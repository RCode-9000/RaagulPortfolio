"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useProgress } from "@react-three/drei";
import { profile, sectionById, sections } from "@/content/sections";
import { objectForSection, type Hotspot } from "@/lib/hotspots";
import SectionPanel from "./SectionPanel";

const RoomCanvas = dynamic(() => import("./RoomCanvas"), { ssr: false });

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noSubscribe = () => () => {};

function Loader({ done }: { done: boolean }) {
  const { progress } = useProgress();
  return (
    <div className={`loader${done ? " loader--done" : ""}`} aria-hidden={done}>
      <p className="loader__title">{profile.name}</p>
      <div className="loader__bar">
        <span style={{ transform: `scaleX(${Math.max(progress, 4) / 100})` }} />
      </div>
      <p className="loader__note">Setting up the room…</p>
    </div>
  );
}

export default function Portfolio() {
  const [open, setOpen] = useState<string | null>(null); // section id
  const [focus, setFocus] = useState<string | null>(null); // object name
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [touched, setTouched] = useState(false);
  // null while server-rendering; true/false once we know in the browser
  const webgl = useSyncExternalStore<boolean | null>(noSubscribe, hasWebGL, () => null);

  const openSection = useCallback((id: string, object?: string) => {
    if (!sectionById[id]) return;
    setOpen(id);
    setFocus(object ?? objectForSection(id) ?? null);
    setMenu(false);
    setTouched(true);
    history.replaceState(null, "", `#${id}`);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    setFocus(null);
    history.replaceState(null, "", location.pathname);
  }, []);

  // deep links: /#projects
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.slice(1);
      if (sectionById[id]) openSection(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openSection]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menu) setMenu(false);
        else if (open) close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menu, close]);

  const onHotspot = useCallback(
    (h: Hotspot) => {
      setTouched(true);
      if (h.section) openSection(h.section, h.object);
    },
    [openSection],
  );

  const onReady = useCallback(() => setReady(true), []);

  return (
    <main className="app">
      {webgl && (
        <div className="stage" onPointerDown={() => setTouched(true)}>
          <RoomCanvas focus={focus} onHotspot={onHotspot} onClose={close} onReady={onReady} />
        </div>
      )}
      {webgl && <Loader done={ready} />}

      <header className="brand">
        <h1>{profile.name}</h1>
        <p>{profile.tagline}</p>
      </header>

      <nav className="topnav" aria-label="Sections">
        <button className="pill" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="menu">
          {menu ? "Close" : "Menu"}
        </button>
      </nav>

      {(menu || webgl === false) && (
        <div id="menu" className={`menu${webgl === false ? " menu--static" : ""}`}>
          {webgl === false && <p className="menu__note">Your browser can&apos;t show the 3D room, but everything is here.</p>}
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <button onClick={() => openSection(s.id)}>
                  <span>{s.title}</span>
                  {webgl !== false && <small>{s.object}</small>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {webgl && ready && !touched && !open && (
        <p className="hint">Click anything in the room · drag to look around</p>
      )}

      {/* the résumé opens on the laptop screen itself, not in the side panel */}
      <SectionPanel section={open && open !== "resume" ? sectionById[open] : null} onClose={close} />
    </main>
  );
}
