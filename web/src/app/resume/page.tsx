import type { Metadata } from "next";
import Link from "next/link";
import { RESUME_PAGE, RESUME_PDF } from "@/content/resume";

export const metadata: Metadata = { title: "Résumé · Raagul Sundaralingam" };

// The actual résumé PDF (public/resume.pdf) and its rendered page.
export default function ResumePage() {
  return (
    <main className="resume-standalone">
      <nav>
        <Link href="/">← Back to the room</Link>
        <a href={RESUME_PDF} download>
          Download PDF
        </a>
      </nav>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={RESUME_PAGE} alt="Raagul Sundaralingam résumé" />
    </main>
  );
}
