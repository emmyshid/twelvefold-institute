import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// ════════════════════════════════════════════════════════════════
// Server-only Anthropic access.
//
// SECURITY: the API key is read from the environment on the server and
// never reaches the browser. Every AI feature in the app calls THIS
// module via an API route — never `fetch("https://api.anthropic.com")`
// from client code. That direct-from-browser call (fine in a local
// Vite demo) would expose and drain the key in production.
//
// RELIABILITY: this preserves the hardened path from PatternOS —
// status handling (the SDK throws on non-2xx), one retry, JSON salvage
// from the first `{` to the last `}`, and real error surfacing rather
// than silent parse failures.
// ════════════════════════════════════════════════════════════════

const PHASES = [
  "Sparking", "Building", "Learning", "Feeling",
  "Expressing", "Refining", "Relating", "Transforming",
  "Reaching", "Constructing", "Liberating", "Dissolving",
];
const MICRO_STATES = ["Initiation", "Expansion", "Contraction", "Integration"];

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

const client = new Anthropic({ apiKey });
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export type PatternSummary = {
  pattern_name: string;
  phase: string;
  micro_state: string;
  likely_curriculum: string;
  active_lesson: string;
  recommended_participation: string;
};

// A failure we can show the user without leaking internals.
export class ReadingError extends Error {
  publicMessage: string;
  constructor(publicMessage: string, cause?: unknown) {
    super(publicMessage);
    this.name = "ReadingError";
    this.publicMessage = publicMessage;
    if (cause) (this as { cause?: unknown }).cause = cause;
  }
}

function buildPrompt(situation: string): string {
  return `You are the reading engine of Twelvefold Institute. A person describes a recurring situation. Read the pattern using the 12 phases (${PHASES.join(", ")}) and the 4 micro-states (${MICRO_STATES.join(", ")}). Patterns are CURRICULUM, not pathology. Be grounded and direct, never mystical. Use "recommended participation" framing for guidance.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble or markdown fences:
{"pattern_name":"2-4 word human-readable name","phase":"one of the 12 phases","micro_state":"one of the 4 micro-states","likely_curriculum":"<=25 words: what this pattern is teaching","active_lesson":"<=25 words: the lesson active right now","recommended_participation":"<=25 words: what aligned cooperation looks like"}`;
}

function salvageJson<T>(text: string): T {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new ReadingError("That was hard to read as a pattern. Try a sentence or two.");
  }
  return JSON.parse(text.slice(first, last + 1)) as T;
}

export async function readPattern(situation: string): Promise<PatternSummary> {
  const prompt = buildPrompt(situation);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 1024, // capped per the project's reliability rule (<= 2000-4000)
        messages: [{ role: "user", content: prompt }],
      });

      const text = res.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");

      const parsed = salvageJson<PatternSummary>(text);
      if (!parsed.pattern_name || !parsed.phase) {
        throw new ReadingError("The reading came back incomplete. Try again.");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      // Retry once on transient parse/network errors; surface auth/quota fast.
      if (err instanceof Anthropic.APIError && err.status && err.status < 500 && err.status !== 429) {
        break;
      }
    }
  }

  if (lastError instanceof ReadingError) throw lastError;
  throw new ReadingError("The reading service is unavailable right now. Try again in a moment.", lastError);
}
