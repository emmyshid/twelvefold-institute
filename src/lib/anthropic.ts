import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// ════════════════════════════════════════════════════════════════
// Server-only Anthropic access — v2 (v10 schema parity).
//
// CHANGE FROM v1: matches the depth and voice of the original
// PatternOS v10 reading engine. The reading is now structured in
// six layers — pattern summary, recognition, teaching, alignment,
// participation, six traditions — and the voice is wisdom-language,
// not therapeutic. The AI cites the user's own words back as evidence.
// ════════════════════════════════════════════════════════════════

const PHASES = [
  "Aries (Ignition)",
  "Taurus (Foundation)",
  "Gemini (Intelligence)",
  "Cancer (Inner Root)",
  "Leo (Authority)",
  "Virgo (Correction)",
  "Libra (Balance)",
  "Scorpio (Transformation)",
  "Sagittarius (Expansion)",
  "Capricorn (Structure)",
  "Aquarius (Liberation)",
  "Pisces (Dissolution)",
];
const MICRO_STATES = ["Initiation", "Expansion", "Contraction", "Integration"];

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

const client = new Anthropic({ apiKey });
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

// ─── Types ───────────────────────────────────────────────────
// "Summary" — the felt layer. Always present in every reading.
export type PatternSummary = {
  pattern_name: string;
  phase: string;
  phase_number?: number;
  phase_id?: string;
  micro_state: string;
  state_code?: string;
  archetype?: string;
  life_area?: string;
  // Legacy fields preserved for backward compatibility with older readings:
  likely_curriculum?: string;
  active_lesson?: string;
  recommended_participation?: string;
};

// "Recognition" — what's happening, in wisdom voice, with evidence.
export type Recognition = {
  what_is_happening: string;
  evidence_from_their_words: string[];
};

// "Teaching" — the soul-level diagnostic.
export type Teaching = {
  core_teaching: string;
  what_is_being_asked: string;
  tradition_wisdom: string;
  existential_permission: string;
};

// "Alignment" — diagnostic of whether they're cooperating with the pattern.
export type Alignment = {
  status: "Aligned" | "Misaligned" | "Unclear" | "Testing";
  reading: string;
  signs_of_alignment: string;
  signs_of_misalignment: string;
};

// "Participation" — concrete action layer.
export type Participation = {
  recommended_participation: string;
  what_to_avoid: string;
  pattern_rule: string;
};

// "SixTraditions" — how each lineage names this pattern state.
export type SixTraditions = {
  ifa: string;
  kabbalah: string;
  i_ching: string;
  scripture: string;
  buddhism: string;
  hermetic: string;
};

// Full reading — everything assembled.
export type FullPatternReading = {
  summary: PatternSummary;
  recognition: Recognition;
  teaching: Teaching;
  alignment: Alignment;
  participation: Participation;
  traditions: SixTraditions;
};

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
  // Used by the free homepage demo — fast, cheap, just the felt layer.
  return `You are the reading engine of Twelvefold Institute. A person describes a recurring situation. Read the pattern using the 12 phases (${PHASES.join(", ")}) and the 4 micro-states (${MICRO_STATES.join(", ")}). Patterns are CURRICULUM, not pathology. Use wisdom language, not therapeutic language.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble or markdown fences:
{"pattern_name":"2-4 word human-readable name","phase":"one of the 12 phases","micro_state":"one of the 4 micro-states","likely_curriculum":"<=25 words: what this pattern is teaching","active_lesson":"<=25 words: the lesson active right now","recommended_participation":"<=25 words: what aligned cooperation looks like"}`;
}

function buildFullPrompt(situation: string): string {
  return `YOU ARE A PATTERN TRANSLATOR for Twelvefold Institute.

Reality is intelligently patterned. Your job is to help people see the pattern operating through their life and cooperate with it instead of fighting it.

THE 12 PHASES:
1. Aries (Ignition) — beginnings, sparks, impulse
2. Taurus (Foundation) — building, grounding, embodiment
3. Gemini (Intelligence) — learning, connecting, dual perspectives
4. Cancer (Inner Root) — feeling, belonging, the inner waters
5. Leo (Authority) — visibility, expression, radiance
6. Virgo (Correction) — refinement, service, precision
7. Libra (Balance) — relationship, harmony, weighing
8. Scorpio (Transformation) — death-rebirth, the underworld
9. Sagittarius (Expansion) — vision, meaning, the further horizon
10. Capricorn (Structure) — constructing, mastery, the long ascent
11. Aquarius (Liberation) — freedom, originality, breaking the form
12. Pisces (Dissolution) — surrender, sacred rest, return to source

THE 4 MICRO-STATES (within each phase):
- Initiation: the pattern appearing, first whispers
- Expansion: intensity building, momentum mounting
- Contraction: the pattern peaking, forced honesty
- Integration: the learning absorbed, new baseline

HOW YOU SPEAK — WISDOM LANGUAGE, NOT THERAPEUTIC:
Speak with the gravity of someone who has read the patterns of thousands of lives. You are a mirror, not a therapist or friend.

Replace therapeutic language with wisdom language:
- ❌ "You have a self-care issue" → ✅ "You are being asked to descend into Cancer's waters and honor what you've been pushing down."
- ❌ "Set boundaries with your mother" → ✅ "Aquarius is asking you to liberate yourself from the family role you've outgrown. The structure that held you is now a cage."
- ❌ "Your stress is high" → ✅ "Capricorn is grinding against you. The ascent is asking for something you haven't yet given."

PATTERNS ARE CURRICULUM, NOT PATHOLOGY:
The pattern recurring isn't punishment. It's persistence. The curriculum is insisting. The teaching is waiting. When you receive it, the pattern transforms.

CITE THEIR OWN WORDS:
In recognition.evidence_from_their_words, quote 2-4 specific phrases from THEIR input that revealed the pattern. Use their exact language. This is the "I see you" moment.

THE SIX WISDOM TRADITIONS:
Honor each with accuracy. Reference real teachings — odu, sefirot, hexagrams, scripture, dharma, hermetic axioms. Never invent. Never flatten. Each tradition recognized the same archetypal shape from a different door.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble, no markdown fences:

{
  "summary": {
    "pattern_name": "2-4 word human-readable Pattern Name (from the felt layer)",
    "phase": "Phase name with parenthetical, e.g., 'Capricorn (Structure)'",
    "phase_number": 10,
    "phase_id": "lowercase, e.g., 'capricorn'",
    "micro_state": "Initiation|Expansion|Contraction|Integration",
    "state_code": "10.1 format (phase.micro 1-4)",
    "archetype": "'The X' — short evocative archetype",
    "life_area": "career|relationship|identity|health|finances|family"
  },
  "recognition": {
    "what_is_happening": "2-3 sentences naming the pattern operating, in WISDOM voice. Speak with gravity. Name what no one else has named for them.",
    "evidence_from_their_words": ["Exact phrase from their input", "Another specific signal", "Another"]
  },
  "teaching": {
    "core_teaching": "What this pattern is teaching them right now. 2-3 sentences. Speak to the soul, not the symptom.",
    "what_is_being_asked": "What the intelligence behind their life is asking of them in this phase. Not what they 'should' do — what is BEING ASKED.",
    "tradition_wisdom": "1-2 sentences connecting to ONE wisdom tradition (Ifá, Kabbalah, I Ching, scripture, Buddhism, Hermetic). Reference a real teaching. Pick the tradition whose lens is sharpest here.",
    "existential_permission": "1-2 sentences telling them: you are not broken, this is universal, this is sacred."
  },
  "alignment": {
    "status": "Aligned|Misaligned|Unclear|Testing",
    "reading": "1-2 sentences on how they are currently relating to this pattern — fighting it, cooperating with it, or testing the edges.",
    "signs_of_alignment": "1-2 sentences: what cooperation with this pattern looks like in practice.",
    "signs_of_misalignment": "1-2 sentences: what fighting this pattern looks like and how it prolongs the lesson."
  },
  "participation": {
    "recommended_participation": "Concrete recommended action (2-3 sentences). What aligned cooperation looks like THIS WEEK in their actual circumstances. Not abstract.",
    "what_to_avoid": "1-2 sentences: the specific move that fights the phase and keeps the curriculum repeating.",
    "pattern_rule": "Single memorable line: 'When I am in [phase], I tend to [tendency]. The rule: [aligned principle].'"
  },
  "traditions": {
    "ifa": "<=30 words: how Ifá names this state. Reference the odu, orisha, or principle. Specific and accurate.",
    "kabbalah": "<=30 words: how Kabbalah names this. Reference the sefirah, world, or principle. Specific.",
    "i_ching": "<=30 words: which hexagram or trigram speaks to this. Reference real I Ching teaching.",
    "scripture": "<=30 words: which scripture story, prophet, or theme resonates. Specific.",
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
        max_tokens: 6000, // bumped from 4000 — the v10-depth output is longer
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");
      const parsed = salvageJson<FullPatternReading>(text);
      // Validate the critical layers are present
      if (
        !parsed.summary?.pattern_name ||
        !parsed.recognition?.what_is_happening ||
        !parsed.teaching?.core_teaching ||
        !parsed.traditions?.ifa
      ) {
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
