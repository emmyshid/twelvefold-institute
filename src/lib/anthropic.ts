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

// ─── Types ───────────────────────────────────────────────────
export type PatternSummary = {
  pattern_name: string;
  phase: string;
  micro_state: string;
  likely_curriculum: string;
  active_lesson: string;
  recommended_participation: string;
};

export type TechnicalReading = {
  phase_nature: string;
  micro_state_work: string;
  what_to_do: string;
  what_to_avoid: string;
  the_unseen: string;
};

export type SixTraditions = {
  ifa: string;
  kabbalah: string;
  i_ching: string;
  scripture: string;
  buddhism: string;
  hermetic: string;
};

export type FullPatternReading = {
  summary: PatternSummary;
  technical: TechnicalReading;
  traditions: SixTraditions;
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

// ─── Salvage parser ──────────────────────────────────────────
function salvageJson<T>(text: string): T {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new ReadingError("That was hard to read as a pattern. Try a sentence or two.");
  }
  return JSON.parse(text.slice(first, last + 1)) as T;
}

// ─── Prompts ─────────────────────────────────────────────────
function buildSummaryPrompt(situation: string): string {
  return `You are the reading engine of Twelvefold Institute. A person describes a recurring situation. Read the pattern using the 12 phases (${PHASES.join(", ")}) and the 4 micro-states (${MICRO_STATES.join(", ")}). Patterns are CURRICULUM, not pathology. Be grounded and direct, never mystical. Use "recommended participation" framing for guidance.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble or markdown fences:
{"pattern_name":"2-4 word human-readable name","phase":"one of the 12 phases","micro_state":"one of the 4 micro-states","likely_curriculum":"<=25 words: what this pattern is teaching","active_lesson":"<=25 words: the lesson active right now","recommended_participation":"<=25 words: what aligned cooperation looks like"}`;
}

function buildFullPrompt(situation: string): string {
  return `You are the reading engine of Twelvefold Institute. A person describes a recurring situation. Read the pattern in three layers.

THE 12 PHASES: ${PHASES.join(", ")}
THE 4 MICRO-STATES: ${MICRO_STATES.join(", ")}

FRAMING RULES:
- Patterns are CURRICULUM, not pathology. Never pathologize the person.
- Be grounded and direct, never mystical or vague.
- Use "recommended participation" framing — what the moment is asking, not what to fix.
- Honor each wisdom tradition with accuracy and respect. Reference real teachings, never invent.
- The six traditions worked independently across cultures and arrived at the same shape of transformation. Translate, do not flatten.

THE THREE LAYERS:

(1) PATTERN SUMMARY — the felt layer. Human-readable, what they see first.
(2) TECHNICAL READING — the structural diagnostic. The "why" beneath the summary.
(3) SIX TRADITIONS — how each lineage illuminates this exact pattern state. Reference real teachings; be specific.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble or markdown fences. Structure:

{
  "summary": {
    "pattern_name": "2-4 word human-readable name",
    "phase": "one of the 12 phases",
    "micro_state": "one of the 4 micro-states",
    "likely_curriculum": "<=25 words: what this pattern is teaching",
    "active_lesson": "<=25 words: the lesson active right now",
    "recommended_participation": "<=25 words: what aligned cooperation looks like"
  },
  "technical": {
    "phase_nature": "<=35 words: what this phase fundamentally is and what it asks of any life passing through it",
    "micro_state_work": "<=35 words: what this specific micro-state within the phase is doing — the energetic shape of where they are",
    "what_to_do": "<=35 words: concrete action that cooperates with the phase",
    "what_to_avoid": "<=35 words: the move that fights the phase and prolongs the lesson",
    "the_unseen": "<=35 words: what is happening beneath the surface the situation is showing"
  },
  "traditions": {
    "ifa": "<=30 words: how Ifá names this state — odu, orisha, principle. Specific.",
    "kabbalah": "<=30 words: how Kabbalah names this — sefirah, world, principle. Specific.",
    "i_ching": "<=30 words: which hexagram or trigram speaks to this state. Specific.",
    "scripture": "<=30 words: which scripture story or theme resonates with this pattern. Specific.",
    "buddhism": "<=30 words: which Buddhist teaching addresses this state. Specific.",
    "hermetic": "<=30 words: which Hermetic principle is at work here. Specific."
  }
}`;
}

// ─── Public readers ──────────────────────────────────────────
export async function readPattern(situation: string): Promise<PatternSummary> {
  const prompt = buildSummaryPrompt(situation);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
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
      if (err instanceof Anthropic.APIError && err.status && err.status < 500 && err.status !== 429) {
        break;
      }
    }
  }

  if (lastError instanceof ReadingError) throw lastError;
  throw new ReadingError("The reading service is unavailable right now. Try again in a moment.", lastError);
}

export async function readFullPattern(situation: string): Promise<FullPatternReading> {
  const prompt = buildFullPrompt(situation);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");
      const parsed = salvageJson<FullPatternReading>(text);
      if (!parsed.summary?.pattern_name || !parsed.technical?.phase_nature || !parsed.traditions?.ifa) {
        throw new ReadingError("The deep reading came back incomplete. Try again.");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      if (err instanceof Anthropic.APIError && err.status && err.status < 500 && err.status !== 429) {
        break;
      }
    }
  }

  if (lastError instanceof ReadingError) throw lastError;
  throw new ReadingError("The reading service is unavailable right now. Try again in a moment.", lastError);
}
