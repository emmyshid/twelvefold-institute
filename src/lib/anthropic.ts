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

// ─── Dream reading ───────────────────────────────────────────
// A dream is not a waking situation, so it gets its own structure:
// the symbolic content is read first, then placed in a phase, then
// bridged back to waking life. It still shares the felt summary,
// the participation guidance, and the six-traditions layer.
export type DreamLayer = {
  symbols: { image: string; meaning: string }[]; // key dream images decoded
  emotional_tone: string; // the dream's felt atmosphere
  phase_commentary: string; // what the dream says about the phase they're in
  waking_life_bridge: string; // how the dream connects to their waking circumstances
};

export type DreamReading = {
  summary: PatternSummary;
  dream: DreamLayer;
  teaching: Teaching;
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

function buildDreamPrompt(dream: string): string {
  return `YOU ARE A DREAM READER for Twelvefold Institute.

A dream is the psyche speaking in images. It is not random noise and it is not literal prophecy — it is the intelligence of a life commenting on the phase that life is in. Your job: read the dream's symbols, name the phase it is speaking from, and bridge it back to the dreamer's waking life.

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

THE 4 MICRO-STATES: Initiation, Expansion, Contraction, Integration.

HOW TO READ A DREAM:
- Decode the key images symbolically, not literally. Water is rarely "water." A house is rarely "a house."
- Do NOT moralize or diagnose. A dream is a message, not a verdict.
- Dreams in Pisces (Dissolution) and Scorpio (Transformation) are especially common and meaningful — the psyche does its deepest work in the dark phases.
- Speak with wisdom-gravity, never therapeutic flatness. You are a mirror.
- Honor the six wisdom traditions accurately (Ifá, Kabbalah, I Ching, scripture, Buddhism, Hermetic). Many traditions have dream-reading lineages — reference real teachings, never invent.

Their dream: "${dream}"

Respond with ONLY a JSON object, no preamble, no markdown fences:

{
  "summary": {
    "pattern_name": "2-4 word Pattern Name for the phase the dream speaks from",
    "phase": "Phase name with parenthetical, e.g., 'Pisces (Dissolution)'",
    "phase_number": 12,
    "phase_id": "lowercase, e.g., 'pisces'",
    "micro_state": "Initiation|Expansion|Contraction|Integration",
    "state_code": "12.1 format",
    "archetype": "'The X' — short evocative archetype",
    "life_area": "career|relationship|identity|health|finances|family"
  },
  "dream": {
    "symbols": [
      {"image": "a key image from the dream, in their words", "meaning": "<=25 words: what it symbolizes in this phase"},
      {"image": "another image", "meaning": "<=25 words"},
      {"image": "another image", "meaning": "<=25 words"}
    ],
    "emotional_tone": "1-2 sentences naming the dream's felt atmosphere and what that tone reveals.",
    "phase_commentary": "2-3 sentences: what this dream is saying about the phase the dreamer is in. Wisdom voice.",
    "waking_life_bridge": "2-3 sentences connecting the dream to their waking circumstances. What is the dream asking them to see in daylight?"
  },
  "teaching": {
    "core_teaching": "What this dream is teaching. 2-3 sentences. Speak to the soul.",
    "what_is_being_asked": "What the intelligence behind their life is asking through this dream.",
    "tradition_wisdom": "1-2 sentences connecting to ONE wisdom tradition's dream teaching. Reference something real.",
    "existential_permission": "1-2 sentences: you are not broken, the psyche is working, this is sacred."
  },
  "participation": {
    "recommended_participation": "Concrete practice (2-3 sentences) for carrying the dream's message into waking life THIS WEEK.",
    "what_to_avoid": "1-2 sentences: how to avoid dismissing or over-literalizing the dream.",
    "pattern_rule": "Single memorable line in the form: 'When I dream of [motif], the psyche is [message]. The rule: [aligned principle].'"
  },
  "traditions": {
    "ifa": "<=30 words: how Ifá reads this dream-state. Reference odu, orisha, or principle.",
    "kabbalah": "<=30 words: Kabbalah's lens — sefirah, world, or the tradition's dream teaching.",
    "i_ching": "<=30 words: which hexagram or trigram speaks to this dream.",
    "scripture": "<=30 words: which scriptural dream or theme resonates (scripture is rich with dreams).",
    "buddhism": "<=30 words: which Buddhist teaching addresses this dream-state.",
    "hermetic": "<=30 words: which Hermetic principle is at work."
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

export async function readDream(dream: string): Promise<DreamReading> {
  const prompt = buildDreamPrompt(dream);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 6000,
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");
      const parsed = salvageJson<DreamReading>(text);
      // Validate the critical layers are present
      if (
        !parsed.summary?.pattern_name ||
        !parsed.dream?.phase_commentary ||
        !parsed.teaching?.core_teaching ||
        !parsed.traditions?.ifa
      ) {
        throw new ReadingError("The dream reading came back incomplete. Try again.");
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

// ─── Transit reading ─────────────────────────────────────────
// Reads the current phase (the "season") and generates three nested
// timing teachings — daily, weekly, monthly — in two lenses: for the
// individual, and for an organization. Timing as curriculum, not
// prediction. The phase is passed in (computed from the date on the
// server); the engine writes the teachings.
export type TransitLensTeaching = {
  daily: string;
  weekly: string;
  monthly: string;
};
export type TransitReading = {
  phase: string;        // e.g. "Taurus (Foundation)"
  phase_id: string;     // e.g. "taurus"
  season_teaching: string; // the one-line teaching of the season
  self: TransitLensTeaching;
  org: TransitLensTeaching;
};

function buildTransitPrompt(phaseLabel: string, phaseTeaching: string): string {
  return `You are the transit reader of Twelvefold Institute.

A transit is timing read as curriculum — never prediction, never prophecy. The 12 zodiac names are borrowed labels for the 12 phases of Intelligent Order. Right now the season is in this phase:

PHASE: ${phaseLabel}
THE SEASON'S CORE TEACHING: ${phaseTeaching}

Write three nested timing teachings, each in TWO lenses — one for an individual, one for an organization/leader. The same phase, read at three time-scales:
- DAILY = the rhythm of the day (small, immediate, what today is for)
- WEEKLY = the movement of the pattern through this week (the arc, the shift underway)
- MONTHLY = the dominant lesson of the whole season (the deep teaching)

VOICE: wisdom language, grounded, never mystical-vague, never therapeutic-flat. Speak with gravity. For the organizational lens, speak to teams, launches, leadership decisions, and institutional seasons concretely.

Respond with ONLY a JSON object, no preamble, no markdown fences:
{
  "season_teaching": "one-line teaching of this season (you may refine the given one)",
  "self": {
    "daily": "2-3 sentences: what today's rhythm asks of an individual in this phase",
    "weekly": "2-3 sentences: how the pattern moves through this person's week",
    "monthly": "2-3 sentences: the dominant lesson of the season for this person"
  },
  "org": {
    "daily": "2-3 sentences: what today asks of a team/leader in this phase — concrete (standups, shipping, hiring, decisions)",
    "weekly": "2-3 sentences: how the pattern moves through an organization's week",
    "monthly": "2-3 sentences: the dominant lesson of the season for an organization — concrete (strategy, consolidation, pivots, launches)"
  }
}`;
}

export async function readTransit(phaseLabel: string, phaseId: string, phaseTeaching: string): Promise<TransitReading> {
  const prompt = buildTransitPrompt(phaseLabel, phaseTeaching);
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
      const parsed = salvageJson<Omit<TransitReading, "phase" | "phase_id">>(text);
      if (!parsed.self?.daily || !parsed.org?.daily) {
        throw new ReadingError("The transit came back incomplete. Try again.");
      }
      return { phase: phaseLabel, phase_id: phaseId, ...parsed };
    } catch (err) {
      lastError = err;
      if (err instanceof Anthropic.APIError && err.status && err.status < 500 && err.status !== 429) break;
    }
  }
  if (lastError instanceof ReadingError) throw lastError;
  throw new ReadingError("The transit service is unavailable right now. Try again in a moment.", lastError);
}

// ─── Coordinate reading (the 60 Reality Coordinates) ─────────
// Two-axis diagnosis: 12 phases × 5 layers = 60 coordinates.
// The engine does the two-step the framework describes: locate the
// phase, then discriminate WHICH LAYER is actually changing, then name
// the coordinate (e.g. AR-8) and what it requires.
//
// Layers (5): Intelligent Order (IO), Architecture (AR), Pattern (PA),
// Rhythm (RH), Events (EV). "Architecture" is the framework's name for
// the structure/systems layer — distinct from the Capricorn PHASE
// "Structure", to avoid collision.
export type CoordinateReading = {
  situation_summary: string;
  symptom: { code: string; layer: string; layer_code: string; phase: string; phase_number: number };
  root: { code: string; layer: string; layer_code: string; phase: string; phase_number: number };
  coordinate_title: string;     // e.g. "Architecture in Transformation"
  symptom_line: string;         // what everyone sees (the surface layer)
  root_line: string;            // the layer the reading found beneath it
  teaching: string;
  what_it_asks: string;
  what_to_avoid: string;
};

function buildCoordinatePrompt(situation: string): string {
  return `You are the coordinate reader of Twelvefold Institute.

Reality can be located on two axes at once:

THE 5 LAYERS (what level of reality is changing):
  IO — Intelligent Order: purpose, meaning, governing intelligence
  AR — Architecture: structure, laws, systems, how a thing is organized
  PA — Pattern: recurring forms and arrangements
  RH — Rhythm: cycles, timing, movement
  EV — Events: manifestations, the visible symptoms and experiences

THE 12 PHASES (where in the developmental cycle):
  1 Ignition (Aries) — emergence
  2 Foundation (Taurus) — stabilization
  3 Intelligence (Gemini) — learning
  4 Inner Root (Cancer) — identity formation
  5 Authority (Leo) — expression
  6 Correction (Virgo) — refinement
  7 Balance (Libra) — relationship
  8 Transformation (Scorpio) — death / rebirth
  9 Expansion (Sagittarius) — growth
  10 Structure (Capricorn) — responsibility
  11 Liberation (Aquarius) — service
  12 Dissolution (Pisces) — completion

A coordinate is LAYER-PHASE, e.g. AR-8 = Architecture at Transformation.

THE DIAGNOSTIC MOVE (this is the whole point):
Most people read only the EVENTS layer — the visible symptom. Your job is to find the LAYER BENEATH the symptom where the real movement is. The event is downstream of a deeper coordinate. Locate BOTH: the visible symptom coordinate (almost always on the EV or a surface layer), AND the root coordinate (the layer where change actually originates).

Example: a church loses half its members. The symptom is EV-8 (crisis event). But the root may be AR-8 (the architecture no longer supports the mission) or IO-8 (the purpose itself is evolving). The exodus is the symptom; the structure is the root.

Rules:
- Both coordinates share the SAME phase number (the situation is in one phase; the layers differ).
- The root layer must be DIFFERENT from and DEEPER than the symptom layer (IO is deepest, then AR, PA, RH, then EV at the surface).
- Speak with wisdom-gravity, never therapeutic flatness. This is a navigation instrument, not a comfort.
- Be concrete. Name the actual structure/purpose/pattern/rhythm at work.

Their situation: "${situation}"

Respond with ONLY a JSON object, no preamble, no markdown fences:
{
  "situation_summary": "one sentence restating the situation neutrally",
  "symptom": { "code": "EV-8", "layer": "Events", "layer_code": "EV", "phase": "Transformation", "phase_number": 8 },
  "root": { "code": "AR-8", "layer": "Architecture", "layer_code": "AR", "phase": "Transformation", "phase_number": 8 },
  "coordinate_title": "Short title for the ROOT coordinate, e.g. 'Architecture in Transformation'",
  "symptom_line": "1-2 sentences: what everyone sees — the surface coordinate.",
  "root_line": "2-3 sentences: the deeper coordinate the reading locates, and why the symptom is downstream of it.",
  "teaching": "2-3 sentences: what this root coordinate is teaching. Wisdom voice.",
  "what_it_asks": "2-3 sentences: the concrete aligned action this coordinate requires.",
  "what_to_avoid": "1-2 sentences: the mistake of treating only the symptom layer."
}`;
}

export async function readCoordinate(situation: string): Promise<CoordinateReading> {
  const prompt = buildCoordinatePrompt(situation);
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
      const parsed = salvageJson<CoordinateReading>(text);
      if (!parsed.root?.code || !parsed.symptom?.code || !parsed.teaching) {
        throw new ReadingError("The coordinate reading came back incomplete. Try again.");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      if (err instanceof Anthropic.APIError && err.status && err.status < 500 && err.status !== 429) break;
    }
  }
  if (lastError instanceof ReadingError) throw lastError;
  throw new ReadingError("The coordinate service is unavailable right now. Try again in a moment.", lastError);
}
