import * as THREE from "three";

// Written by the Blender bake script next to the lightmap JPEGs.
export type LightmapManifest = {
  atlases: Record<string, { file: string; scale: number }>;
  meshes: Record<string, string>; // GLB node name -> atlas
};

export const LIGHTMAP_DIR = "/models/lightmaps";

/** Every texture: trilinear mipmaps, max anisotropy, glTF UV orientation. */
export function configureTexture(tex: THREE.Texture, maxAniso: number, color: boolean) {
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = maxAniso;
  tex.flipY = false;
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
}

function atlasFor(obj: THREE.Object3D, manifest: LightmapManifest): string | undefined {
  for (let o: THREE.Object3D | null = obj; o; o = o.parent) {
    const a = manifest.meshes[o.name];
    if (a) return a;
  }
  return undefined;
}

/**
 * Multiplies the baked lighting over each mesh's albedo. Albedo stays on UV0 (palette swatches
 * or the dedicated flag/poster/cork/rug textures); the lightmap uses UV1. Materials are cloned
 * per atlas because one albedo material (the palette) is shared across all three atlases.
 */
export function applyLightmaps(
  scene: THREE.Object3D,
  manifest: LightmapManifest,
  lightmaps: Record<string, THREE.Texture>,
  maxAniso: number,
) {
  for (const tex of Object.values(lightmaps)) {
    configureTexture(tex, maxAniso, true); // stored sRGB-encoded (L / scale), decoded to linear
    tex.channel = 1;
  }
  const cache = new Map<string, THREE.Material>();
  const seen = new Set<THREE.Texture>();
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const atlas = atlasFor(mesh, manifest);
    const swap = (mat: THREE.Material) => {
      const m = mat as THREE.MeshBasicMaterial & THREE.MeshStandardMaterial;
      for (const key of ["map", "emissiveMap"] as const) {
        const t = m[key];
        if (t && !seen.has(t)) {
          configureTexture(t, maxAniso, true);
          seen.add(t);
        }
      }
      if ("flatShading" in m) m.flatShading = false;
      if (!atlas || !m.isMeshBasicMaterial) return mat;
      const key = `${mat.uuid}:${atlas}`;
      let lit = cache.get(key) as THREE.MeshBasicMaterial | undefined;
      if (!lit) {
        lit = (mat as THREE.MeshBasicMaterial).clone();
        lit.lightMap = lightmaps[atlas];
        // MeshBasicMaterial divides the lightmap by PI
        lit.lightMapIntensity = manifest.atlases[atlas].scale * Math.PI;
        lit.userData.lightmapped = true;
        cache.set(key, lit);
      }
      return lit;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
  });
}
