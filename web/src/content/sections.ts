// Everything the side panels say. Each section opens from one
// clickable object in the room (src/lib/hotspots.ts) and from the menu, which lists them in this
// order. Panels render straight from these blocks, so copy changes only happen here.
// In text, *words* render in italics.

export type Link = { label: string; href: string };

// lucide icon names used by the panels (see ICONS in src/components/SectionPanel.tsx)
export type IconName = "mail" | "linkedin" | "github" | "location" | "friends" | "gaming" | "sports" | "reading";

export type Project = {
  name: string;
  role: string;
  date: string;
  description: string;
  stack: string[];
  links?: Link[]; // GitHub / demo
};

export type Job = {
  org: string;
  role: string;
  place: string;
  date: string;
  current?: boolean;
  bullets: string[];
};

export type ContactRow = {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
  copy?: string; // shows a copy-to-clipboard button for this value
};

export type Card = { icon: IconName; title: string; text: string };

export type Block =
  | { kind: "text"; text: string }
  | { kind: "school"; org: string; place: string; degree: string; date: string; details: string[] }
  | { kind: "facts"; items: { label: string; text: string }[] }
  | { kind: "projects"; items: Project[] }
  | { kind: "contact"; rows: ContactRow[] }
  | { kind: "timeline"; items: Job[] }
  | { kind: "cards"; items: Card[] };

export type Section = {
  id: string;
  title: string; // menu, panel title and hotspot tooltip
  object: string; // the object in the room it lives on
  blocks: Block[];
};

export const profile = {
  name: "Raagul Sundaralingam",
  tagline: "Software Engineering Consultant @ CapTech | CS & AI Alum @ Ohio State",
  email: "raagul9803@gmail.com",
};

export const projects: Project[] = [
  {
    name: "Mimir: AI-powered academic assistant",
    role: "Project Lead",
    date: "Jan – Apr 2025",
    description:
      "A RAG system over thousands of embedded arXiv papers that gives citation-grounded suggestions in a real-time writing editor.",
    stack: ["Weaviate", "Ollama", "FastAPI", "Next.js"],
  },
  {
    name: "Acquired.Beauty: makeup shopping platform",
    role: "Project Lead",
    date: "Jan – Apr 2025",
    description:
      "Led a 4-person team building a marketplace with a Firecrawl + Claude API pipeline that enriches product data, plus a matching algorithm for personalized recommendations. User research shaped the roadmap.",
    stack: ["Next.js", "FastAPI", "Supabase", "Claude API", "Firecrawl"],
  },
];

export const jobs: Job[] = [
  {
    org: "CapTech",
    role: "Software Engineering Consultant",
    place: "Arlington, VA",
    date: "Jul 2025 – Present",
    current: true,
    bullets: [
      "Co-built a config-driven PySpark ETL platform on AWS EMR for a top-5 U.S. financial institution. It cut pipeline runtimes from 12+ hours to 20–30 minutes, includes built-in data-governance checks, and was adopted by additional lines of business.",
      "Owned the custom-SQL layer and, as sole owner of historical data copy, built a config-driven migration tool that moved 10 GB–20 TB datasets in a third of the time of the previous 24+ hour methods. Handed it off to the client for future migrations.",
      "Built an LLM app (GPT-4 on Azure, Next.js, FastAPI, Docker) that bulk-converts new-hire résumés into CapTech's Workday format. An LLM-judge eval loop over hundreds of résumés raised accuracy from ~60% to near error-free.",
      "Built an LLM error-diagnostics feature for CapTech's firm-wide internal deployment platform: a terminal-style UI with GPT-4 explanations and fix suggestions for failed deploys. Helped integrate it into production.",
      "Built an agentic certification-study app (Next.js, FastAPI, Ollama): a ReAct-loop agent with custom MCP-style tools that researches documentation, models what the learner knows, and generates study guides, flashcards, and practice exams.",
    ],
  },
  {
    org: "Machine Analysis of Political Speech Lab, Ohio State University",
    role: "Research Assistant",
    place: "Columbus, OH",
    date: "Jan 2024 – Jun 2025",
    bullets: [
      "Architected a Python multimodal pipeline on Linux that automates ingestion and processing of large-scale political datasets.",
      "Automated extraction with WhisperX and Llama-3 into a SQL database, cutting 1.5-hour video processing to ~13 minutes and producing queryable datasets on presidential debate candidates.",
    ],
  },
];

export const sections: Section[] = [
  {
    id: "ohio-state",
    title: "Education",
    object: "Ohio State flag",
    blocks: [
      {
        kind: "school",
        org: "The Ohio State University",
        place: "Columbus, OH",
        degree: "B.S. in Computer Science & Engineering",
        date: "May 2025",
        details: ["Specialization: Artificial Intelligence", "Minor: Mathematics", "GPA: 3.7"],
      },
      {
        kind: "facts",
        items: [
          {
            label: "Research",
            text: "Research Assistant, Machine Analysis of Political Speech Lab (Jan 2024 – Jun 2025). Built a multimodal pipeline that turns presidential debate video into queryable datasets (full details under Employment).",
          },
          {
            label: "Awards",
            text: "Dean's List · 1st Place, ShowOHI/O 2023 · 2nd Place, HackAI 2023 · TartanHacks 2025 MakingWaves Track Winner",
          },
          { label: "Certification", text: "AWS Certified Solutions Architect – Associate (SAA-C03), August 2026" },
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Side Projects",
    object: "Monitor",
    blocks: [
      {
        kind: "text",
        text: "I like building side projects with unfamiliar tech stacks to get hands-on with new tools and problem spaces. A few highlights:",
      },
      { kind: "projects", items: projects },
    ],
  },
  {
    // opens on the laptop screen itself (interactive résumé), not in the side panel
    id: "resume",
    title: "Résumé",
    object: "Laptop",
    blocks: [],
  },
  {
    id: "contact",
    title: "Contact",
    object: "Phone",
    blocks: [
      { kind: "text", text: "Always happy to talk about agents, side projects, or new roles. Reach out!" },
      {
        kind: "contact",
        rows: [
          { icon: "mail", label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: profile.email },
          { icon: "linkedin", label: "LinkedIn", value: "linkedin.com/in/raagul-sundar", href: "https://www.linkedin.com/in/raagul-sundar/" },
          { icon: "github", label: "GitHub", value: "github.com/RCode-9000", href: "https://github.com/RCode-9000" },
          { icon: "location", label: "Location", value: "Arlington, VA" },
        ],
      },
    ],
  },
  {
    id: "work",
    title: "Employment",
    object: "Backpack",
    blocks: [{ kind: "timeline", items: jobs }],
  },
  {
    id: "about",
    title: "About Me",
    object: "Photo board",
    blocks: [
      {
        kind: "text",
        text: "I'm Raagul Sundaralingam, a software engineer who graduated from The Ohio State University in May 2025 with a degree in Computer Science & Engineering, a specialization in AI, and a minor in Mathematics.",
      },
      {
        kind: "text",
        text: "I love building, working on new things, exploring new territory, and making an impact. One habit that ties my free time to my career: I build side projects with different tech stacks to get exposure to new tools and problem spaces.",
      },
      { kind: "text", text: "Lately I've been going deep on AI agents, agentic engineering, and fine-tuning." },
    ],
  },
  {
    id: "hobbies",
    title: "Hobbies",
    object: "Lego cars",
    blocks: [
      { kind: "text", text: "When I'm not building, you'll usually find me…" },
      {
        kind: "cards",
        items: [
          { icon: "friends", title: "Friends & food", text: "Hanging out with friends and eating lots of good food." },
          {
            icon: "gaming",
            title: "Gaming",
            text: "Currently replaying *Batman: Arkham City* and playing *Marvel Rivals*. Also lots of online Catan with friends.",
          },
          { icon: "sports", title: "Sports", text: "A few sports; lately I've gotten really into volleyball." },
          { icon: "reading", title: "Reading", text: "Currently reading *The Fourth Turning* by William Strauss and Neil Howe." },
        ],
      },
    ],
  },
];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<string, Section>;
