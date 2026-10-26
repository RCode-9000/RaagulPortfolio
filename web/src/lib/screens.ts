import * as THREE from "three";
import { configureTexture } from "./lightmaps";

// Screen contents drawn at full resolution into canvases, used as
// emissive maps. Canvas row 0 is the top of the screen; the textures use flipY = false like the
// glTF ones, and the screens' UVs read left-to-right.

const MONO = '"JetBrains Mono", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function toTexture(c: HTMLCanvasElement, maxAniso: number) {
  const tex = new THREE.CanvasTexture(c);
  configureTexture(tex, maxAniso, true);
  return tex;
}

function rrect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

// ------------------------------------------------------------------ ultrawide: IDE + terminal
const CODE = `import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { maxSafeDistance, offset } from "@/lib/framing";
import type { Object3D } from "three";

// Keep the camera inside the room at any aspect ratio.
export function useHeroFraming(shell: Object3D, hero: HeroPose) {
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;

  return useMemo(() => {
    const fov = fitFov(hero, aspect);
    const dist = maxSafeDistance(shell, TARGET, hero.az, hero.polar, fov, aspect, 1.6, hero.dist);
    const limits = {
      minAzimuth: hero.az - ORBIT_ARC,
      maxAzimuth: hero.az + ORBIT_ARC,
      maxPolar: deg(80),
    };
    return { fov, dist, limits };
  }, [shell, hero, aspect]);
}

function fitFov(hero: HeroPose, aspect: number) {
  if (aspect >= hero.aspect) {
    // wider screens keep the Blender framing's horizontal coverage
    return radToDeg(2 * Math.atan(Math.tan(hero.hfov / 2) / aspect));
  }
  const keep = lerp(0.55, 1, clamp((aspect - 0.45) / (hero.aspect - 0.45), 0, 1));
  const v = radToDeg(2 * Math.atan(Math.tan((hero.hfov * keep) / 2) / aspect));
  return clamp(v, hero.yfov, 62);
}

export const ORBIT_ARC = deg(25);
export const TARGET = new Vector3(0.55, 0.7, -0.75);`;

const KEYWORDS = new Set(["import", "from", "export", "function", "const", "let", "return", "if", "else", "new", "type", "await", "async"]);
const C = {
  bg: "#1b1d26", gutter: "#4f5573", text: "#d7dce8", kw: "#c792ea", str: "#c3e88d", fn: "#82aaff",
  type: "#ffcb6b", num: "#f78c6c", com: "#6a7194", punc: "#89ddff", prop: "#f07178",
};

function tokens(line: string): [string, string][] {
  const out: [string, string][] = [];
  const re = /(\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"'`]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [t] = m;
    if (m[1]) out.push([t, C.com]);
    else if (m[2]) out.push([t, C.str]);
    else if (m[3]) out.push([t, C.num]);
    else if (m[4]) {
      const rest = line.slice(re.lastIndex);
      if (KEYWORDS.has(t)) out.push([t, C.kw]);
      else if (/^\s*\(/.test(rest)) out.push([t, C.fn]);
      else if (/^[A-Z]/.test(t)) out.push([t, C.type]);
      else if (/^\s*:/.test(rest) && !/^\s*::/.test(rest)) out.push([t, C.prop]);
      else out.push([t, C.text]);
    } else if (m[5]) out.push([t, C.text]);
    else out.push([t, C.punc]);
  }
  return out;
}

const TERMINAL: [string, string][] = [
  ["prompt", "git status"],
  ["out", "On branch main"],
  ["out", "Your branch is up to date with 'origin/main'."],
  ["out", ""],
  ["out", "Changes not staged for commit:"],
  ["mod", "        modified:   src/components/RoomCanvas.tsx"],
  ["mod", "        modified:   src/lib/framing.ts"],
  ["out", ""],
  ["prompt", "npm test"],
  ["dim", "> web@0.1.0 test"],
  ["dim", "> vitest run"],
  ["out", ""],
  ["ok", " ✓ src/lib/framing.test.ts (6 tests) 41ms"],
  ["ok", " ✓ src/lib/hotspots.test.ts (4 tests) 12ms"],
  ["out", ""],
  ["out", " Test Files  2 passed (2)"],
  ["out", "      Tests  10 passed (10)"],
  ["dim", "   Duration  812ms"],
  ["out", ""],
  ["prompt", "npm run dev"],
  ["dim", "> web@0.1.0 dev"],
  ["dim", "> next dev"],
  ["out", ""],
  ["out", "   ▲ Next.js 16.4.3"],
  ["out", "   - Local:        http://localhost:3000"],
  ["out", ""],
  ["ok", " ✓ Ready in 336ms"],
  ["dim", " ○ Compiling / ..."],
  ["ok", " ✓ Compiled / in 1.2s"],
  ["out", " GET / 200 in 1418ms"],
  ["cursor", ""],
];

export function monitorTexture(maxAniso: number) {
  const W = 3440, H = 1440, HALF = W / 2;
  const [c, g] = canvas(W, H);
  g.textBaseline = "middle";

  // ---- left half: IDE
  g.fillStyle = C.bg;
  g.fillRect(0, 0, HALF, H);
  const TAB_H = 64, SIDE_W = 360, STATUS_H = 38;
  g.fillStyle = "#15161e";
  g.fillRect(0, 0, HALF, TAB_H);
  g.fillStyle = "#16171f";
  g.fillRect(0, TAB_H, SIDE_W, H - TAB_H - STATUS_H);
  // tabs
  let tx = SIDE_W;
  g.font = `500 24px ${SANS}`;
  for (const [i, name] of ["RoomCanvas.tsx", "framing.ts", "hotspots.ts"].entries()) {
    const w = g.measureText(name).width + 80;
    g.fillStyle = i === 0 ? C.bg : "#15161e";
    g.fillRect(tx, 0, w, TAB_H);
    if (i === 0) {
      g.fillStyle = "#82aaff";
      g.fillRect(tx, TAB_H - 4, w, 4);
    }
    rrect(g, tx + 22, TAB_H / 2 - 7, 14, 14, 3, i === 0 ? "#3fa7c9" : "#4f5573");
    g.fillStyle = i === 0 ? "#e8ecf6" : "#7d84a3";
    g.fillText(name, tx + 46, TAB_H / 2);
    tx += w;
  }
  // file tree
  g.font = `600 20px ${SANS}`;
  g.fillStyle = "#7d84a3";
  g.fillText("EXPLORER", 28, TAB_H + 36);
  const tree: [number, string, boolean, boolean?][] = [
    [0, "web", true], [1, "public", true], [1, "src", true], [2, "app", true], [3, "layout.tsx", false],
    [3, "page.tsx", false], [3, "globals.css", false], [2, "components", true], [3, "Portfolio.tsx", false],
    [3, "RoomCanvas.tsx", false, true], [3, "SectionPanel.tsx", false], [2, "content", true], [3, "resume.ts", false],
    [3, "sections.ts", false], [2, "lib", true], [3, "framing.ts", false], [3, "hotspots.ts", false],
    [3, "lightmaps.ts", false], [3, "screens.ts", false], [1, "package.json", false], [1, "README.md", false],
  ];
  g.font = `400 23px ${SANS}`;
  tree.forEach(([depth, name, dir, sel], i) => {
    const y = TAB_H + 84 + i * 40;
    if (sel) {
      g.fillStyle = "#262a3a";
      g.fillRect(0, y - 20, SIDE_W, 40);
    }
    const x = 26 + depth * 26;
    if (dir) {
      g.fillStyle = "#7d84a3";
      g.beginPath();
      g.moveTo(x, y - 6); g.lineTo(x + 12, y - 6); g.lineTo(x + 6, y + 4); g.closePath(); g.fill();
      rrect(g, x + 20, y - 9, 20, 16, 3, "#c9a46a");
    } else {
      rrect(g, x + 20, y - 8, 16, 16, 3, name.endsWith(".tsx") || name.endsWith(".ts") ? "#3fa7c9" : name.endsWith(".css") ? "#c792ea" : "#9aa1bd");
    }
    g.fillStyle = sel ? "#e8ecf6" : "#b3b9d1";
    g.fillText(name, x + 50, y);
  });
  // gutter + code
  const LH = 40, FONT = 27, CODE_X = SIDE_W + 112, TOP = TAB_H + 40;
  g.font = `400 ${FONT}px ${MONO}`;
  const lines = CODE.split("\n");
  lines.forEach((line, i) => {
    const y = TOP + i * LH;
    if (y > H - STATUS_H - 20) return;
    if (i === 11) {
      g.fillStyle = "#222534";
      g.fillRect(SIDE_W, y - LH / 2, HALF - SIDE_W, LH);
    }
    g.fillStyle = i === 11 ? "#c8cde0" : C.gutter;
    g.textAlign = "right";
    g.fillText(String(i + 1), CODE_X - 36, y);
    g.textAlign = "left";
    let x = CODE_X;
    for (const [t, col] of tokens(line)) {
      g.fillStyle = col;
      g.fillText(t, x, y);
      x += g.measureText(t).width;
      if (x > HALF - 20) break;
    }
  });
  // status bar
  g.fillStyle = "#3b3f6b";
  g.fillRect(0, H - STATUS_H, HALF, STATUS_H);
  g.font = `500 21px ${SANS}`;
  g.fillStyle = "#e3e6f3";
  g.fillText("⎇  main", 24, H - STATUS_H / 2);
  g.textAlign = "right";
  g.fillText("Ln 12, Col 34    Spaces: 2    UTF-8    TypeScript React", HALF - 24, H - STATUS_H / 2);
  g.textAlign = "left";

  // ---- right half: terminal
  g.fillStyle = "#101118";
  g.fillRect(HALF, 0, HALF, H);
  g.fillStyle = "#08090d";
  g.fillRect(HALF - 3, 0, 6, H);
  g.fillStyle = "#191a23";
  g.fillRect(HALF + 3, 0, HALF, 56);
  ["#ff6b6b", "#ffcb6b", "#5bd36b"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(HALF + 36 + i * 32, 28, 9, 0, Math.PI * 2);
    g.fill();
  });
  g.font = `500 22px ${SANS}`;
  g.fillStyle = "#8b91ad";
  g.textAlign = "center";
  g.fillText("raagul — web — zsh", HALF + HALF / 2, 28);
  g.textAlign = "left";
  const TX = HALF + 40, TLH = 41;
  g.font = `400 27px ${MONO}`;
  TERMINAL.forEach(([kind, text], i) => {
    const y = 56 + 40 + i * TLH;
    let x = TX;
    if (kind === "prompt" || kind === "cursor") {
      for (const [t, col] of [["raagul@studio", "#7fd88f"], [" ", "#d7dce8"], ["web", "#82aaff"], [" % ", "#d7dce8"]] as const) {
        g.fillStyle = col;
        g.fillText(t, x, y);
        x += g.measureText(t).width;
      }
      if (kind === "cursor") {
        g.fillStyle = "#d7dce8";
        g.fillRect(x, y - 16, 16, 32);
        return;
      }
      g.fillStyle = "#eef1fa";
      g.fillText(text, x, y);
      return;
    }
    g.fillStyle = kind === "ok" ? "#7fd88f" : kind === "mod" ? "#f07178" : kind === "dim" ? "#6f7593" : "#c9cee0";
    g.fillText(text, x, y);
  });
  return toTexture(c, maxAniso);
}

// ------------------------------------------------------------------ laptop: document editor
/** Generic document-editor UI (no real product branding) showing the actual résumé PDF's page
 *  (public/resume-page1.png, rendered from public/resume.pdf). */
export function laptopTexture(maxAniso: number, page: HTMLImageElement) {
  const W = 2048, H = 1356;
  const [c, g] = canvas(W, H);
  g.textBaseline = "alphabetic";
  // window bar + menus
  g.fillStyle = "#2a2c38";
  g.fillRect(0, 0, W, 64);
  ["#ff6b6b", "#ffcb6b", "#5bd36b"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(32 + i * 30, 32, 9, 0, Math.PI * 2);
    g.fill();
  });
  g.font = `500 24px ${SANS}`;
  g.fillStyle = "#c9cde0";
  g.textAlign = "center";
  g.fillText("RaagulSundaralingamResume.pdf", W / 2, 41);
  g.textAlign = "left";
  g.fillStyle = "#30333f";
  g.fillRect(0, 64, W, 48);
  g.font = `400 22px ${SANS}`;
  g.fillStyle = "#b6bbcf";
  let mx = 40;
  for (const m of ["File", "Edit", "View", "Insert", "Format", "Tools", "Help"]) {
    g.fillText(m, mx, 96);
    mx += g.measureText(m).width + 40;
  }
  // formatting toolbar
  g.fillStyle = "#393c4a";
  g.fillRect(0, 112, W, 60);
  let bx = 40;
  rrect(g, bx, 124, 180, 36, 6, "#4a4e5f");
  g.fillStyle = "#dfe2ee";
  g.fillText("Inter", bx + 16, 150);
  g.fillText("11", bx + 140, 150);
  bx += 210;
  g.font = `700 24px ${SANS}`;
  for (const glyph of ["B", "I", "U"]) {
    rrect(g, bx, 124, 40, 36, 6, "#43475a");
    g.fillStyle = "#dfe2ee";
    g.fillText(glyph, bx + 13, 151);
    bx += 50;
  }
  bx += 20;
  for (let k = 0; k < 4; k++) {
    rrect(g, bx, 124, 40, 36, 6, "#43475a");
    g.fillStyle = "#b6bbcf";
    for (let r = 0; r < 4; r++) g.fillRect(bx + 9 + (k === 1 && r % 2 ? 6 : 0), 132 + r * 6, k === 2 ? 22 : 18 - (r % 2) * 4, 3);
    bx += 50;
  }
  // grey canvas + page
  g.fillStyle = "#8b8e9c";
  g.fillRect(0, 172, W, H - 172);
  const pageH = H - 172 - 40, pageW = Math.round((pageH * 8.5) / 11), px = (W - pageW) / 2, py = 192;
  g.fillStyle = "rgba(20,16,24,0.25)";
  g.fillRect(px + 6, py + 8, pageW, pageH);
  g.fillStyle = "#ffffff";
  g.fillRect(px, py, pageW, pageH);
  g.imageSmoothingQuality = "high";
  g.drawImage(page, px, py, pageW, pageH);
  return toTexture(c, maxAniso);
}
