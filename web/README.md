# Portfolio site

A Next.js site built around a baked 3D model of my desk corner.
Clicking an object in the room flies the camera to it and opens that section. The same sections
are in the **Menu** for keyboard users, and as a plain list on devices without WebGL.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
|---|---|
| The résumé itself | `public/resume.pdf` + its rendered page `public/resume-page1.png` |
| Side-panel copy for all seven sections | `src/content/sections.ts` |
| Screen canvases: ultrawide IDE + terminal, laptop document editor | `src/lib/screens.ts` |
| Which object opens which section, camera angles | `src/lib/hotspots.ts` |
| 3D scene: loading, hover, camera, markers, lamp easter egg | `src/components/RoomCanvas.tsx` |
| Lightmaps (albedo × baked lighting) and texture filtering | `src/lib/lightmaps.ts` |
| Viewport fit + "never see outside the room" camera limits | `src/lib/framing.ts` |
| Page chrome, menu, deep links (`/#projects`) | `src/components/Portfolio.tsx` |
| Section panel | `src/components/SectionPanel.tsx` |
| Styles (room palette) | `src/app/globals.css` |
| Model | `public/models/scene.glb` (Draco; decoder in `public/draco/`) + `public/models/lightmaps/` |

## Updating the room

The model and lightmaps are baked in Blender (sources kept outside this repo). Drop the new
`scene.glb` and lightmaps into `public/models/`. Hotspots find objects by their Blender names,
so keep those names stable.

## Camera

The hero view is the Blender `hero_camera`, refitted to the viewport. Wider screens keep its
horizontal coverage, and narrower ones widen the vertical FOV. The camera then pulls in until rays
through every edge of the frame hit the room shell. Orbiting is limited to ±25° around the hero
angle, no higher than the wall tops, and at least 10° above the floor, with no panning. The
allowed distance at each angle comes from a precomputed safe-distance table (`lib/framing.ts`).

## Résumé

The laptop shows the actual PDF. Its page is rendered to `public/resume-page1.png`, which the screen
texture uses, as does the scrollable view placed on the screen with three's CSS3DRenderer once the
camera settles. Download PDF serves `public/resume.pdf`. To update it, replace the PDF, then run:

```bash
pdftoppm -r 250 -png -singlefile public/resume.pdf public/resume-page1
```

## Deploying

It's a static page, so Vercel works with zero config. Import the repo and set the project's root
directory to `web/`.
