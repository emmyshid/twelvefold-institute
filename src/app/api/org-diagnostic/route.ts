import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// POST /api/org-diagnostic  { prompt: string }
//
// Used by the certification portal's organizational diagnostic engine.
// Originally the cert app made client-side calls to api.anthropic.com,
// which would either expose the API key or fail. This endpoint runs
// the call server-side with the key safely held in env.
//
// Auth: signed-in users only. The portal page itself is already gated
// on cert payment, so anyone who can reach this endpoint and be signed
// in has paid. We don't double-check payment here — defense in depth
// could be added later, but the gate on the page provides reasonable
// protection.
//
// Returns the parsed JSON directly (the prompt instructs Claude to
// respond with JSON only, and we strip code fences just in case).

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
const client = new Anthropic({ apiKey });
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  // Rate limit per user — diagnostic calls are expensive and shouldn't
  // be hammered. 10/minute is generous for legitimate practitioner use.
  const rl = rateLimit(`org-diag:${userId}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Slow down — try again in a moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const prompt = String((body as { prompt?: unknown })?.prompt ?? "").trim();
  if (!prompt || prompt.length < 20) {
    return NextResponse.json({ error: "Prompt missing or too short." }, { status: 400 });
  }
  if (prompt.length > 20000) {
    return NextResponse.json({ error: "Prompt too long." }, { status: 400 });
  }

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = res.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Salvage parse — same pattern as /api/reading. Slice from the
    // first { to the last } to survive any wrapping markdown fences
    // or stray prose, then JSON.parse.
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1 || last < first) {
      return NextResponse.json(
        { error: "The diagnostic came back malformed. Try again." },
        { status: 502 },
      );
    }
    const parsed = JSON.parse(text.slice(first, last + 1));
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("org-diagnostic error:", e);
    return NextResponse.json(
      { error: "Diagnostic service unavailable. Try again." },
      { status: 502 },
    );
  }
}
