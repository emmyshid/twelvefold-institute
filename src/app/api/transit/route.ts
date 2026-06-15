import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readTransit, ReadingError, type TransitReading } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// GET /api/transit
//
// Returns the current transit reading: the season's phase plus three
// nested timing teachings (daily/weekly/monthly) in two lenses (self,
// org). Signed-in members only.
//
// The phase is computed server-side from today's date (symbolic
// mapping — the month/zodiac band the sun is currently in). The engine
// writes the teachings.
//
// Caching: teachings are evergreen for a given phase on a given day, so
// we cache by `${phaseId}:${YYYY-MM-DD}` in memory. First visitor of the
// day triggers generation; everyone after reads the cache. (Process
// memory — resets on deploy, which is fine.)

// The 12 phases with their date bands (standard tropical zodiac dates)
// and the season teaching each carries.
const PHASE_BANDS: {
  id: string; label: string; teaching: string;
  from: [number, number]; to: [number, number]; // [month(1-12), day]
}[] = [
  { id: "aries",       label: "Aries (Ignition)",        teaching: "Begin before you feel ready.",            from: [3, 21],  to: [4, 19] },
  { id: "taurus",      label: "Taurus (Foundation)",     teaching: "Depth comes from return, not arrival.",   from: [4, 20],  to: [5, 20] },
  { id: "gemini",      label: "Gemini (Intelligence)",   teaching: "Hold two truths without collapsing either.", from: [5, 21], to: [6, 20] },
  { id: "cancer",      label: "Cancer (Inner Root)",     teaching: "Tend what you have been pushing down.",   from: [6, 21],  to: [7, 22] },
  { id: "leo",         label: "Leo (Authority)",         teaching: "Be seen as you actually are.",            from: [7, 23],  to: [8, 22] },
  { id: "virgo",       label: "Virgo (Correction)",      teaching: "Refine without grinding yourself down.",  from: [8, 23],  to: [9, 22] },
  { id: "libra",       label: "Libra (Balance)",         teaching: "Find truth, not only peace.",             from: [9, 23],  to: [10, 22] },
  { id: "scorpio",     label: "Scorpio (Transformation)",teaching: "Let what is ending, end.",                from: [10, 23], to: [11, 21] },
  { id: "sagittarius", label: "Sagittarius (Expansion)", teaching: "Aim past what you can already see.",      from: [11, 22], to: [12, 21] },
  { id: "capricorn",   label: "Capricorn (Structure)",   teaching: "Build the form that will hold you.",      from: [12, 22], to: [1, 19] },
  { id: "aquarius",    label: "Aquarius (Liberation)",   teaching: "Outgrow the role that became a cage.",    from: [1, 20],  to: [2, 18] },
  { id: "pisces",      label: "Pisces (Dissolution)",    teaching: "Rest. Return to the source. Dissolve.",   from: [2, 19],  to: [3, 20] },
];

function currentPhase(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (const band of PHASE_BANDS) {
    const [fm, fd] = band.from;
    const [tm, td] = band.to;
    // Capricorn wraps the year boundary (Dec→Jan)
    if (fm > tm) {
      if ((m === fm && d >= fd) || (m === tm && d <= td) || m > fm || m < tm) return band;
    } else if ((m === fm && d >= fd) || (m === tm && d <= td) || (m > fm && m < tm)) {
      return band;
    }
  }
  return PHASE_BANDS[0];
}

const cache = new Map<string, TransitReading>();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to read the transit." }, { status: 401 });
  }

  const rl = rateLimit(`transit:${userId}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Slow down — try again in a moment." }, { status: 429 });
  }

  const now = new Date();
  const phase = currentPhase(now);
  const dayKey = `${phase.id}:${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

  const cached = cache.get(dayKey);
  if (cached) return NextResponse.json(cached);

  try {
    const reading = await readTransit(phase.label, phase.id, phase.teaching);
    cache.set(dayKey, reading);
    // Keep the cache from growing unbounded across many days
    if (cache.size > 60) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    return NextResponse.json(reading);
  } catch (err) {
    if (err instanceof ReadingError) {
      return NextResponse.json({ error: err.publicMessage }, { status: 502 });
    }
    console.error("transit route error:", err);
    return NextResponse.json({ error: "Something interrupted the transit. Try again." }, { status: 500 });
  }
}
