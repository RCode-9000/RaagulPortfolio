// The seven clickable objects in public/models/scene.glb. Nothing else in
// the room is interactive. `facing` is the direction (three.js space, Y up) the camera looks at
// the object *from*: the back wall faces +X, the monitor wall faces -Z, and the hero camera sits
// at +X/-Z.

import { sectionById } from "@/content/sections";

export type Hotspot = {
  object: string; // node name in the GLB
  section: string; // section id in src/content/sections.ts
  label: string; // hover tooltip: the section title, filled in below
  facing: [number, number, number];
  zoom?: number; // >1 frames tighter, <1 looser
  marker?: "top" | "front" | "center"; // where the in-scene marker sits (default: just above the object)
  hideChair?: boolean; // the chair sits between the camera and desk items
};

const SPOTS: Omit<Hotspot, "label">[] = [
  { object: "flag", section: "ohio-state", facing: [0.25, -0.05, -1], zoom: 0.75, marker: "center" },
  { object: "monitor", section: "projects", facing: [0.15, 0.15, -1], zoom: 1.05, hideChair: true },
  { object: "laptop", section: "resume", facing: [0.35, 0.45, -1], zoom: 1.15, hideChair: true },
  { object: "phone", section: "contact", facing: [0.7, 1.3, -0.7], zoom: 0.42, hideChair: true },
  { object: "backpack", section: "work", facing: [1, 0.35, -0.35], zoom: 0.6 },
  { object: "cork_board", section: "about", facing: [1, 0.04, -0.08], zoom: 1.5 },
  { object: "model_cars", section: "hobbies", facing: [1, 0.5, -0.3], zoom: 1.2 },
];

export const HOTSPOTS: Hotspot[] = SPOTS.map((h) => ({ ...h, label: sectionById[h.section].title }));

export const hotspotByObject = Object.fromEntries(HOTSPOTS.map((h) => [h.object, h])) as Record<string, Hotspot>;

export const objectForSection = (id: string) => HOTSPOTS.find((h) => h.section === id)?.object;
