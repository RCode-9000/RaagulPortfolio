"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Code,
  Copy,
  Gamepad2,
  Link as LinkIcon,
  Mail,
  MapPin,
  UtensilsCrossed,
  Volleyball,
  type LucideIcon,
} from "lucide-react";
import type { Block, ContactRow, IconName, Section } from "@/content/sections";

const ICONS: Record<IconName, LucideIcon> = {
  mail: Mail,
  linkedin: LinkIcon,
  github: Code,
  location: MapPin,
  friends: UtensilsCrossed,
  gaming: Gamepad2,
  sports: Volleyball,
  reading: BookOpen,
};

// http(s) links open in a new tab; mailto: stays in place
function External({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const ext = /^https?:/.test(href);
  return (
    <a href={href} className={className} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

// *words* -> <em>words</em>
function Rich({ text }: { text: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      className={`contact__copy${done ? " contact__copy--done" : ""}`}
      onClick={() => navigator.clipboard?.writeText(value).then(() => setDone(true), () => {})}
      aria-label={done ? `${label} copied` : `Copy ${label.toLowerCase()}`}
      title={done ? "Copied" : "Copy"}
    >
      {done ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
}

function ContactRowView({ row }: { row: ContactRow }) {
  const Icon = ICONS[row.icon];
  const body = (
    <>
      <span className="contact__icon">
        <Icon size={20} />
      </span>
      <span className="contact__text">
        <small>{row.label}</small>
        <span>{row.value}</span>
      </span>
      {row.href && /^https?:/.test(row.href) && <ArrowUpRight className="contact__go" size={18} />}
    </>
  );
  return (
    <li className="contact__row">
      {row.href ? (
        <External href={row.href} className="contact__main">
          {body}
        </External>
      ) : (
        <div className="contact__main">{body}</div>
      )}
      {row.copy && <CopyButton value={row.copy} label={row.label} />}
    </li>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="panel__text">
          <Rich text={block.text} />
        </p>
      );
    case "school":
      return (
        <article className="school">
          <h3>{block.org}</h3>
          <p className="school__place">{block.place}</p>
          <p className="school__degree">
            {block.degree}
            <span aria-hidden> · </span>
            {block.date}
          </p>
          <p className="school__details">
            {block.details.map((d, i) => (
              <Fragment key={d}>
                {i > 0 && <span aria-hidden> · </span>}
                {d}
              </Fragment>
            ))}
          </p>
        </article>
      );
    case "facts":
      return (
        <dl className="facts">
          {block.items.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.text}</dd>
            </div>
          ))}
        </dl>
      );
    case "projects":
      return (
        <div className="projects">
          {block.items.map((p) => (
            <article key={p.name} className="project">
              <h3>{p.name}</h3>
              <p className="project__meta">
                {p.role}
                <span aria-hidden> · </span>
                {p.date}
              </p>
              <p className="project__desc">{p.description}</p>
              <ul className="tags" aria-label="Stack">
                {p.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.links && p.links.length > 0 && (
                <div className="project__links">
                  {p.links.map((l) => (
                    <External key={l.href} href={l.href}>
                      {l.label} <ArrowUpRight size={14} />
                    </External>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      );
    case "contact":
      return (
        <ul className="contact">
          {block.rows.map((r) => (
            <ContactRowView key={r.label} row={r} />
          ))}
        </ul>
      );
    case "timeline":
      return (
        <ol className="timeline">
          {block.items.map((j) => (
            <li key={j.org} className={`timeline__item${j.current ? " timeline__item--current" : ""}`}>
              <header>
                {j.current && <span className="timeline__badge">Current</span>}
                <h3>{j.org}</h3>
                <p className="timeline__role">{j.role}</p>
                <p className="timeline__meta">
                  {j.place}
                  <span aria-hidden> · </span>
                  {j.date}
                </p>
              </header>
              <ul>
                {j.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <ul className="cards">
          {block.items.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <li key={c.title} className="card">
                <Icon className="card__icon" size={20} />
                <h3>{c.title}</h3>
                <p>
                  <Rich text={c.text} />
                </p>
              </li>
            );
          })}
        </ul>
      );
  }
}

export default function SectionPanel({ section, onClose }: { section: Section | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // move focus into the panel when it opens, and scroll it back to the top
  useEffect(() => {
    if (section && ref.current) {
      ref.current.scrollTop = 0;
      ref.current.focus({ preventScroll: true });
    }
  }, [section]);

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      className={`panel${section ? " panel--open" : ""}`}
      aria-hidden={!section}
      aria-label={section?.title}
    >
      {section && (
        <>
          <div className="panel__top">
            <p className="panel__kicker">{section.object}</p>
            <button className="panel__close" onClick={onClose} aria-label="Close and return to the room">
              ×
            </button>
          </div>
          <h2 className="panel__title">{section.title}</h2>
          {section.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </>
      )}
    </aside>
  );
}
