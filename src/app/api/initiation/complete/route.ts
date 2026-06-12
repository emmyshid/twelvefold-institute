import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initiationCompletions } from "@/lib/db/schema";
import { emailInitiationConfirmation, emailAdminNotification } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/initiation/complete
//
// Called from the /initiation page when a visitor reaches the final
// segment, fills in name + email, and clicks one of the three CTAs
// ("certification" | "consult" | "community").
//
// Behavior:
//   - Validate email
//   - Insert (or no-op on email collision) into initiation_completions
//   - On a fresh row: fire confirmation email to user + admin notification
//   - Return {ok: true, redirect: <next-route>} so the client knows where to send them
//
// Note: we ALWAYS return a redirect target, even if the email was a
// repeat — so people can click "Certification" twice and still get
// routed correctly. Only the email side-effects are gated by "fresh row".
interface CompleteBody {
  email?: string;
  name?: string;
  phaseId?: number;
  phaseFelt?: string;
  phaseAstro?: string;
  practiceCommitment?: string;
  reflections?: Record<string, string>;
  ctaChosen?: "certification" | "consult" | "community";
}

const REDIRECT_BY_CTA: Record<string, string> = {
  certification: "/certification",
  consult: "/institutions",
  community: "/book",
};

export async function POST(req: NextRequest) {
  let body: CompleteBody;
  try {
    body = (await req.json()) as CompleteBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim() || null;
  const phaseId = typeof body.phaseId === "number" ? body.phaseId : null;
  const phaseFelt = String(body.phaseFelt ?? "").trim() || null;
  const phaseAstro = String(body.phaseAstro ?? "").trim() || null;
  const practiceCommitment = String(body.practiceCommitment ?? "").trim() || null;
  const reflections = body.reflections && typeof body.reflections === "object" ? body.reflections : null;
  const ctaChosen =
    body.ctaChosen === "certification" || body.ctaChosen === "consult" || body.ctaChosen === "community"
      ? body.ctaChosen
      : null;

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Please include a valid email." }, { status: 400 });
  }

  try {
    const inserted = await db
      .insert(initiationCompletions)
      .values({
        email,
        name,
        diagnosedPhaseId: phaseId,
        diagnosedPhaseFelt: phaseFelt,
        diagnosedPhaseAstro: phaseAstro,
        practiceCommitment,
        reflections,
        ctaChosen,
      })
      .onConflictDoNothing({ target: initiationCompletions.email })
      .returning();

    // Fire emails only on first-time completion. Non-blocking.
    if (inserted.length === 1) {
      Promise.all([
        emailInitiationConfirmation({
          name,
          email,
          phaseFelt,
          phaseAstro,
          practiceCommitment,
          ctaChosen,
        }),
        emailAdminNotification({
          subject: `[Twelvefold] New Initiation completion: ${name || email}${phaseFelt ? ` (${phaseFelt})` : ""}`,
          body: [
            `Email: ${email}`,
            `Name: ${name || "(not provided)"}`,
            `Diagnosed phase: ${phaseFelt || "(none)"} / ${phaseAstro || "(none)"}`,
            `Practice commitment: ${practiceCommitment || "(none)"}`,
            `CTA chosen: ${ctaChosen || "(none)"}`,
            `Reflections recorded: ${reflections ? Object.keys(reflections).length : 0}`,
          ].join("\n"),
        }),
      ]).catch((e) => console.error("[email] initiation completion notifications failed:", e));
    }

    const redirect = ctaChosen ? REDIRECT_BY_CTA[ctaChosen] : null;
    return NextResponse.json({ ok: true, redirect });
  } catch (e) {
    console.error("initiation complete error:", e);
    return NextResponse.json({ error: "We couldn't save that. Try again." }, { status: 500 });
  }
}
