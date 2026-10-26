"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, useGLTF } from "@react-three/drei";
import { EffectComposer, HueSaturation, SelectiveBloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { HOTSPOTS, hotspotByObject, type Hotspot } from "@/lib/hotspots";
import { applyLightmaps, LIGHTMAP_DIR, type LightmapManifest } from "@/lib/lightmaps";
import { maxSafeDistance, offset, SafeDistanceTable } from "@/lib/framing";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { laptopTexture, monitorTexture } from "@/lib/screens";
import { RESUME_PDF, RESUME_PAGE } from "@/content/resume";

const MODEL = "/models/scene.glb";
const ATLASES = ["room", "desk", "wall"] as const;
useGLTF.preload(MODEL, "/draco/");

// Where the hero camera looks (Blender's hero_camera target, converted to three.js Y-up), and a
// pan applied to both the camera and its target: a little to the right and up.
const BLENDER_TARGET = new THREE.Vector3(0.55, 0.7, -0.75);
const PAN_RIGHT = 0.3, PAN_UP = 0.18; // metres, in the hero view's own right/up directions
const BLENDER_EYE = new THREE.Vector3(3.555, 2.3, -3.777);
const HERO_RIGHT = new THREE.Vector3()
  .crossVectors(BLENDER_TARGET.clone().sub(BLENDER_EYE).normalize(), new THREE.Vector3(0, 1, 0))
  .normalize();
const HERO_PAN = HERO_RIGHT.clone().multiplyScalar(PAN_RIGHT).add(new THREE.Vector3(0, PAN_UP, 0));
const HERO_TARGET = BLENDER_TARGET.clone().add(HERO_PAN);
const WALL_TOP = 2.6;
const deg = THREE.MathUtils.degToRad;
const ORBIT_ARC = deg(25); // look-around range either side of the hero angle
const MAX_POLAR = deg(80); // keeps the camera at least 10 degrees above the floor plane
const MIN_DIST = 1.6;
const MARKERS = HOTSPOTS;

export type RoomProps = {
  focus: string | null; // object name the camera should frame, or null for the hero view
  onHotspot: (h: Hotspot) => void;
  onClose: () => void; // leave the focused object (e.g. click outside the laptop screen)
  onReady: () => void;
};

type MarkerPos = { name: string; x: number; y: number; visible: boolean };
type InnerProps = RoomProps & {
  hovered: string | null;
  setHovered: (name: string | null) => void;
  onProject: (positions: MarkerPos[]) => void; // screen positions of the marker anchors, every frame
  onMoving: (moving: boolean) => void; // camera moving (drag, zoom, damping, fly-in) vs settled
  onDoc: (shown: boolean) => void; // résumé page on the laptop screen visible or not
  docHost: HTMLDivElement; // DOM node the interactive résumé is portalled into
  cssHost: RefObject<HTMLDivElement | null>; // overlay the CSS3D renderer draws into
};
const DOC_W = 1200; // px width of .laptop-doc; mapped onto the laptop screen's width
const RAY = new THREE.Raycaster();
const PROJECTED = new THREE.Vector3();

/** Puts a canvas texture on an emissive screen material (by material name). */
function setScreen(scene: THREE.Object3D, material: string, tex: THREE.Texture, intensity: number) {
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      const std = mat as THREE.MeshStandardMaterial;
      if (!std.isMeshStandardMaterial || std.name !== material) continue;
      std.map = null;
      std.color.set(0x000000);
      std.emissive.set(0xffffff);
      std.emissiveMap = tex;
      std.emissiveIntensity = intensity;
      std.needsUpdate = true;
    }
  });
}

type Spot = { hotspot: Hotspot; box: THREE.Box3; center: THREE.Vector3; anchor: THREE.Vector3; meshes: THREE.Mesh[] };

function hotspotFor(obj: THREE.Object3D | null): string | null {
  for (let o = obj; o; o = o.parent) if (hotspotByObject[o.name]) return o.name;
  return null;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

function Room({ focus, onHotspot, onClose, onReady, hovered, setHovered, onProject, onMoving, onDoc, docHost, cssHost }: InnerProps) {
  const { scene, cameras } = useGLTF(MODEL, "/draco/");
  const manifestText = useLoader(THREE.FileLoader, `${LIGHTMAP_DIR}/manifest.json`) as string;
  const lmTextures = useLoader(THREE.TextureLoader, ATLASES.map((a) => `${LIGHTMAP_DIR}/lm_${a}.jpg`));
  const resumePage = useLoader(THREE.ImageLoader, RESUME_PAGE);
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const controls = useRef<CameraControls>(null);
  const reduced = useReducedMotion();

  // Albedo x baked lighting, then hotspot meshes get their own material copies so
  // highlighting one doesn't light up everything else sharing a material.
  const spots = useMemo(() => {
    const manifest = JSON.parse(manifestText) as LightmapManifest;
    applyLightmaps(
      scene,
      manifest,
      Object.fromEntries(ATLASES.map((a, i) => [a, lmTextures[i]])),
      gl.capabilities.getMaxAnisotropy(),
    );
    // ultrawide: IDE + terminal drawn at 3440x1440
    setScreen(scene, "monitor_screen", monitorTexture(gl.capabilities.getMaxAnisotropy()), 1.5);
    // laptop: document editor with the résumé's first page until it's clicked (section 4)
    setScreen(scene, "laptop_screen", laptopTexture(gl.capabilities.getMaxAnisotropy(), resumePage), 0.85);
    const out: Record<string, Spot> = {};
    for (const h of HOTSPOTS) {
      const node = scene.getObjectByName(h.object);
      if (!node) continue;
      const meshes: THREE.Mesh[] = [];
      node.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const own = (x: THREE.Material) => Object.assign(x.clone(), { userData: { ...x.userData, hotspot: true } });
        m.material = Array.isArray(m.material) ? m.material.map(own) : own(m.material);
        meshes.push(m);
      });
      const box = new THREE.Box3().setFromObject(node);
      const center = box.getCenter(new THREE.Vector3());
      const anchor =
        h.marker === "front"
          ? new THREE.Vector3(box.max.x + 0.02, center.y, center.z) // back-wall furniture faces +X
          : h.marker === "center"
            ? center.clone()
            : new THREE.Vector3(center.x, box.max.y + 0.04, center.z);
      out[h.object] = { hotspot: h, box, center, anchor, meshes };
    }
    return out;
  }, [scene, manifestText, lmTextures, gl, resumePage]);

  // The laptop screen as a quad in world space, from its UVs (u right, v down on the image).
  const laptopScreen = useMemo(() => {
    const found: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !Array.isArray(m.material) && m.material.name === "laptop_screen") found.push(m);
    });
    const mesh = found[0];
    if (!mesh) return null;
    mesh.updateWorldMatrix(true, false);
    const pos = mesh.geometry.attributes.position, uv = mesh.geometry.attributes.uv;
    const corner = (u: number, v: number) => {
      let best = 0, bd = Infinity;
      for (let i = 0; i < uv.count; i++) {
        const d = (uv.getX(i) - u) ** 2 + (uv.getY(i) - v) ** 2;
        if (d < bd) [bd, best] = [d, i];
      }
      return new THREE.Vector3().fromBufferAttribute(pos, best).applyMatrix4(mesh.matrixWorld);
    };
    const tl = corner(0, 0), tr = corner(1, 0), bl = corner(0, 1);
    const right = tr.clone().sub(tl), down = bl.clone().sub(tl);
    const center = tl.clone().addScaledVector(right, 0.5).addScaledVector(down, 0.5);
    const normal = new THREE.Vector3().crossVectors(down, right).normalize(); // toward the viewer
    return { center, right, down, normal, width: right.length(), height: down.length() };
  }, [scene]);

  // Interactive résumé on the laptop screen: a DOM page placed in 3D with three's CSS3DRenderer
  // (the technique drei's <Html transform> uses, without creating a second React root).
  const css = useRef<{ renderer: CSS3DRenderer; scene: THREE.Scene } | null>(null);
  useEffect(() => {
    const host = cssHost.current;
    if (!host || !laptopScreen) return;
    const renderer = new CSS3DRenderer();
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";
    host.appendChild(renderer.domElement);
    const cssScene = new THREE.Scene();
    const obj = new CSS3DObject(docHost);
    const x = laptopScreen.right.clone().normalize();
    const y = laptopScreen.down.clone().normalize().negate();
    const z = new THREE.Vector3().crossVectors(x, y);
    const k = laptopScreen.width / DOC_W;
    obj.matrixAutoUpdate = false;
    obj.matrix.makeBasis(x, y, z).scale(new THREE.Vector3(k, k, k));
    obj.matrix.setPosition(laptopScreen.center.clone().addScaledVector(laptopScreen.normal, 0.002));
    cssScene.add(obj);
    cssScene.updateMatrixWorld(true);
    css.current = { renderer, scene: cssScene };
    return () => {
      cssScene.remove(obj);
      host.removeChild(renderer.domElement);
      css.current = null;
    };
  }, [cssHost, docHost, laptopScreen]);
  useEffect(() => css.current?.renderer.setSize(size.width, size.height), [size, laptopScreen]);

  // Camera moving vs settled: hidden while dragging, zooming, coasting and flying; settled once
  // there have been no updates for 150ms after the gesture ends.
  const [moving, setMoving] = useState(true);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    let dragging = false;
    let timer: number | undefined;
    const set = (v: boolean) => {
      setMoving(v);
      onMoving(v);
    };
    const settleSoon = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => !dragging && set(false), 150);
    };
    const start = () => {
      dragging = true;
      window.clearTimeout(timer);
      set(true);
    };
    const end = () => {
      dragging = false;
      settleSoon();
    };
    // camera-controls keeps emitting tiny updates for seconds as it eases to a stop; only real
    // movement counts (>0.3 mm or >0.05 deg since the last update)
    const cam = get().camera;
    const lastPos = cam.position.clone();
    const lastQuat = cam.quaternion.clone();
    const change = () => {
      const moved = cam.position.distanceTo(lastPos) > 3e-4 || cam.quaternion.angleTo(lastQuat) > 1e-3;
      lastPos.copy(cam.position);
      lastQuat.copy(cam.quaternion);
      if (!moved) return;
      set(true);
      settleSoon();
    };
    c.addEventListener("controlstart", start);
    c.addEventListener("controlend", end);
    c.addEventListener("transitionstart", change);
    c.addEventListener("update", change);
    settleSoon();
    return () => {
      window.clearTimeout(timer);
      c.removeEventListener("controlstart", start);
      c.removeEventListener("controlend", end);
      c.removeEventListener("transitionstart", change);
      c.removeEventListener("update", change);
    };
  }, [onMoving, get]);

  const laptopNode = useMemo(() => scene.getObjectByName("laptop") ?? null, [scene]);
  const docWanted = focus === "laptop" && !moving;
  const docShown = useRef(false);

  // The Blender hero camera as an orbit pose around HERO_TARGET.
  const hero = useMemo(() => {
    const cam = cameras[0] as THREE.PerspectiveCamera | undefined;
    const pos = (cam ? cam.getWorldPosition(new THREE.Vector3()) : BLENDER_EYE.clone()).add(HERO_PAN);
    const yfov = cam?.fov ?? 39.8;
    const aspect = cam?.aspect ?? 16 / 9;
    const hfov = 2 * Math.atan(Math.tan(deg(yfov) / 2) * aspect);
    const s = new THREE.Spherical().setFromVector3(pos.clone().sub(HERO_TARGET));
    return { yfov, hfov, aspect, az: s.theta, polar: s.phi, dist: s.radius };
  }, [cameras]);

  const shell = useMemo(() => scene.getObjectByName("static_room") ?? scene, [scene]);

  // Fit to the viewport: wider screens keep the Blender framing's horizontal coverage; narrower
  // ones (down to portrait phones) widen the vertical FOV a little and give up some width.
  const aspect = size.width / size.height;
  const fov = useMemo(() => {
    if (aspect >= hero.aspect) return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hero.hfov / 2) / aspect));
    const keep = THREE.MathUtils.lerp(0.55, 1, THREE.MathUtils.clamp((aspect - 0.45) / (hero.aspect - 0.45), 0, 1));
    const v = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan((hero.hfov * keep) / 2) / aspect));
    return THREE.MathUtils.clamp(v, hero.yfov, 62);
  }, [aspect, hero]);

  // ...then pull the camera in until every edge of the frame lands on wall or floor, and
  // precompute that limit across the whole allowed orbit range.
  const framing = useMemo(() => {
    const heroDist = maxSafeDistance(shell, HERO_TARGET, hero.az, hero.polar, fov, aspect, MIN_DIST, hero.dist);
    // never higher than the wall tops: camera height = target.y + distance * cos(polar)
    const wallPolar = Math.acos(THREE.MathUtils.clamp((WALL_TOP - 0.1 - HERO_TARGET.y) / heroDist, -1, 1));
    const pol0 = Math.min(wallPolar, hero.polar);
    const az0 = hero.az - ORBIT_ARC, az1 = hero.az + ORBIT_ARC;
    const table = new SafeDistanceTable(shell, HERO_TARGET, az0, az1, pol0, MAX_POLAR, fov, aspect, MIN_DIST, heroDist);
    return { heroDist, az0, az1, pol0, table };
  }, [shell, hero, fov, aspect]);

  useLayoutEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = fov;
    camera.near = 0.05;
    camera.updateProjectionMatrix();
  }, [get, fov]);

  // Camera: hero view, or fly to the focused object. Limits are set before each move so the
  // destination always satisfies them.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const smooth = !reduced;
    const spot = focus ? spots[focus] : null;
    if (!spot) {
      c.minAzimuthAngle = framing.az0;
      c.maxAzimuthAngle = framing.az1;
      c.minPolarAngle = framing.pol0;
      c.maxPolarAngle = MAX_POLAR;
      c.minDistance = MIN_DIST;
      c.maxDistance = framing.heroDist;
      const eye = HERO_TARGET.clone().add(offset(hero.az, hero.polar, framing.heroDist));
      c.setLookAt(eye.x, eye.y, eye.z, HERO_TARGET.x, HERO_TARGET.y, HERO_TARGET.z, smooth);
      return;
    }
    if (focus === "laptop" && laptopScreen) {
      // square-on to the screen, filling most of the view
      const vf = deg(fov), hf = 2 * Math.atan(Math.tan(vf / 2) * aspect);
      const d = Math.max(laptopScreen.height / 2 / Math.tan(vf / 2) / 0.8, laptopScreen.width / 2 / Math.tan(hf / 2) / 0.88);
      const e = laptopScreen.center.clone().addScaledVector(laptopScreen.normal, d);
      const s0 = new THREE.Spherical().setFromVector3(e.clone().sub(laptopScreen.center));
      c.minAzimuthAngle = s0.theta - deg(6);
      c.maxAzimuthAngle = s0.theta + deg(6);
      c.minPolarAngle = s0.phi - deg(5);
      c.maxPolarAngle = s0.phi + deg(5);
      c.minDistance = d * 0.85;
      c.maxDistance = d * 1.2;
      const t = laptopScreen.center;
      c.setLookAt(e.x, e.y, e.z, t.x, t.y, t.z, smooth);
      return;
    }
    const radius = spot.box.getSize(new THREE.Vector3()).length() / 2;
    const vfov = deg(fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    // leave room for the side panel on wide screens
    const fitFov = Math.min(vfov, hfov * (size.width > 900 ? 0.5 : 1));
    const dist = radius / Math.sin(fitFov / 2) / (spot.hotspot.zoom ?? 1);
    const dir = new THREE.Vector3(...spot.hotspot.facing).normalize();
    const eye = spot.center.clone().addScaledVector(dir, Math.max(dist, 0.45));
    const target = spot.center.clone();
    if (size.width > 900) {
      // shift so the object sits left of the panel
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
      target.addScaledVector(right, dist * Math.tan(hfov / 2) * 0.42);
      eye.addScaledVector(right, dist * Math.tan(hfov / 2) * 0.42);
    }
    if (size.width <= 700) {
      // phones: the bottom sheet covers the lower part, so frame the object near the top
      eye.addScaledVector(dir, dist * 0.25);
      const drop = dist * Math.tan(vfov / 2) * 0.32;
      target.y -= drop;
      eye.y -= drop;
    }
    // a gentle look-around near the object
    const s = new THREE.Spherical().setFromVector3(eye.clone().sub(target));
    c.minAzimuthAngle = s.theta - deg(12);
    c.maxAzimuthAngle = s.theta + deg(12);
    c.minPolarAngle = Math.max(deg(15), s.phi - deg(10));
    c.maxPolarAngle = Math.min(deg(85), s.phi + deg(10));
    c.minDistance = s.radius * 0.6;
    c.maxDistance = s.radius * 1.25;
    c.setLookAt(eye.x, eye.y, eye.z, target.x, target.y, target.z, smooth);
  }, [focus, spots, hero, fov, aspect, size, reduced, framing, laptopScreen]);

  useFrame(({ camera, size: s }) => {
    const c = controls.current;
    // void guard: the allowed distance depends on where in the orbit we are
    if (c && !focus) {
      const safe = Math.max(MIN_DIST, framing.table.at(c.azimuthAngle, c.polarAngle));
      if (Math.abs(c.maxDistance - safe) > 1e-3) c.maxDistance = safe;
      if (c.distance > safe + 1e-3) c.dollyTo(safe, false);
    }
    // résumé page on the laptop: only once the camera has settled on it, and hidden if anything
    // comes between the camera and the screen
    let show = docWanted && !!css.current && !!laptopScreen;
    if (show && laptopScreen) {
      const to = laptopScreen.center.clone().sub(camera.position);
      const dist = to.length();
      RAY.set(camera.position, to.normalize());
      RAY.far = dist - 0.01;
      // three's raycaster also hits hidden objects (e.g. the chair, hidden for this view)
      const hit = RAY.intersectObject(scene, true).find((h) => {
        for (let o: THREE.Object3D | null = h.object; o; o = o.parent) if (o === laptopNode || !o.visible) return false;
        return true;
      });
      if (hit) show = false;
    }
    if (show !== docShown.current) {
      docShown.current = show;
      onDoc(show);
    }
    if (show && css.current) css.current.renderer.render(css.current.scene, camera);
    // markers are plain DOM buttons; the parent places them at these screen positions
    onProject(
      Object.values(spots).map((spot) => {
        const p = PROJECTED.copy(spot.anchor).project(camera);
        return {
          name: spot.hotspot.object,
          x: ((p.x + 1) / 2) * s.width,
          y: ((1 - p.y) / 2) * s.height,
          visible: p.z < 1 && Math.abs(p.x) < 1.02 && Math.abs(p.y) < 1.02,
        };
      }),
    );
  });

  // Hover highlight: brighten the albedo (the lightmap multiplies on top).
  useEffect(() => {
    for (const [name, spot] of Object.entries(spots)) {
      const level = name === focus ? 1.6 : name === hovered ? 1.35 : 1;
      for (const m of spot.meshes) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        for (const mat of mats) {
          const basic = mat as THREE.MeshBasicMaterial;
          if (basic.isMeshBasicMaterial) basic.color.setScalar(level);
        }
      }
    }
    document.body.style.cursor = hovered ? "pointer" : "";
  }, [hovered, focus, spots]);

  // The chair blocks the view of the monitor, laptop and phone.
  useEffect(() => {
    const chair = scene.getObjectByName("chair");
    if (chair) chair.visible = !(focus && hotspotByObject[focus]?.hideChair);
  }, [focus, scene]);

  useEffect(() => onReady(), [onReady]);

  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation();
    return hotspotFor(e.object);
  };

  return (
    <>
      <primitive
        object={scene}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => setHovered(pick(e))}
        onPointerOut={() => setHovered(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          const name = pick(e);
          if (e.delta > 6) return; // that was a drag, not a click
          if (focus === "laptop") onClose();
          else if (name) onHotspot(hotspotByObject[name]);
        }}
      />
      <CameraControls ref={controls} makeDefault smoothTime={0.6} dollySpeed={0.4} truckSpeed={0} />
    </>
  );
}

// Emissive surfaces (screens, lamp shade, candle flame) are the only things that bloom.
function GlowBloom({ scene }: { scene: THREE.Object3D }) {
  const light = useMemo(() => new THREE.AmbientLight(0xffffff, 0), []);
  const glowing = useMemo(() => {
    const out: THREE.Object3D[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      const mat = m.isMesh ? (m.material as THREE.MeshStandardMaterial) : null;
      // the laptop's white page would bloom into a haze over the text, so it stays out
      if (mat && mat.isMeshStandardMaterial && mat.emissiveIntensity > 0 && mat.name !== "laptop_screen") out.push(m);
    });
    return out;
  }, [scene]);
  return (
    <SelectiveBloom lights={[light]} selection={glowing} mipmapBlur luminanceThreshold={0.2} luminanceSmoothing={0.4} intensity={0.9} radius={0.55} />
  );
}

function Effects() {
  const { scene } = useGLTF(MODEL, "/draco/");
  return (
    <EffectComposer>
      <GlowBloom scene={scene} />
      <HueSaturation saturation={0.08} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}

export default function RoomCanvas(props: RoomProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [moving, setMoving] = useState(true); // markers hide while the camera moves
  const [docOn, setDocOn] = useState(false);
  const [docHost] = useState(() => {
    const el = document.createElement("div");
    el.className = "laptop-doc-host"; // CSS3DObject sets pointer-events inline; the stylesheet overrides it
    return el;
  });
  const cssHost = useRef<HTMLDivElement>(null);
  const down = useRef({ x: 0, y: 0 });
  const markers = useRef<Record<string, HTMLButtonElement | null>>({});
  const placeMarkers = useCallback((positions: MarkerPos[]) => {
    for (const p of positions) {
      const el = markers.current[p.name];
      if (!el) continue;
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      el.style.visibility = p.visible ? "visible" : "hidden";
    }
  }, []);
  return (
    <>
      <Canvas
        onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
        onPointerMissed={(e) => {
          const moved = Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y);
          if (props.focus === "laptop" && moved < 6) props.onClose();
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
          gl.toneMappingExposure = 1.2; // a dim room; the glow comes from the light sources
        }}
        camera={{ position: [3.55, 2.3, -3.78], fov: 40, near: 0.05, far: 60 }}
      >
        {/* light plum atmosphere for depth; matches the page background behind the canvas */}
        <fogExp2 attach="fog" args={["#4a3552", 0.055]} />
        <Suspense fallback={null}>
          <Room
            {...props}
            hovered={hovered}
            setHovered={setHovered}
            onProject={placeMarkers}
            onMoving={setMoving}
            onDoc={setDocOn}
            docHost={docHost}
            cssHost={cssHost}
          />
          <Effects />
        </Suspense>
      </Canvas>
      <div ref={cssHost} className="css3d" />
      {createPortal(
        <div className={`laptop-doc-wrap${docOn ? " is-on" : ""}`} aria-hidden={!docOn}>
          <div className="laptop-doc">
            <div className="laptop-doc__bar">
              <span>RaagulSundaralingamResume.pdf</span>
              <a href={RESUME_PDF} download tabIndex={docOn ? 0 : -1}>
                Download PDF
              </a>
            </div>
            <div className="laptop-doc__scroll">
              {/* the actual résumé PDF, rendered page (public/resume-page1.png) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="laptop-doc__page" src={RESUME_PAGE} alt="Raagul Sundaralingam résumé" />
            </div>
          </div>
        </div>,
        docHost,
      )}
      {/* Keyboard-reachable markers over the clickable objects (positioned every frame by Room) */}
      <div className={`markers${moving ? " markers--moving" : ""}`}>
        {MARKERS.map((h) => (
          <button
            key={h.object}
            ref={(el) => {
              markers.current[h.object] = el;
            }}
            className={`marker${hovered === h.object ? " marker--on" : ""}${props.focus ? " marker--hidden" : ""}`}
            tabIndex={props.focus ? -1 : 0}
            aria-hidden={!!props.focus}
            aria-label={h.label}
            onClick={() => props.onHotspot(h)}
            onPointerEnter={() => setHovered(h.object)}
            onPointerLeave={() => setHovered(null)}
          >
            <span className="marker__dot" />
            <span className="marker__label">{h.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
