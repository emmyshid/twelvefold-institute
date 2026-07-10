import React, { useEffect, useState } from "react";

/* ---------------------------------------------------------
   Organizing Intelligence Engine - Transformation Map (v2)
   Five-layer model (this app only): Intelligent Order,
   Structure, Pattern, Rhythm, Events. Workflow is the bridge
   between Rhythm and Events, not a layer of reality. Outcome
   is a measurement attached to Events, not a sixth layer.
--------------------------------------------------------- */

const S = {
  bg: "#06060F",
  card: "rgba(237,233,245,0.04)",
  border: "rgba(237,233,245,0.10)",
  text: "#EDE9F5",
  textMuted: "rgba(237,233,245,0.62)",
  textFaint: "rgba(237,233,245,0.38)",
  gold: "#FBBF24",
  purple: "#A78BFA",
  cyan: "#67E8F9",
  pink: "#F472B6",
  green: "#34D399",
  orange: "#FB923C",
  sky: "#38BDF8",
  red: "#F87171",
  fontHead: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', monospace",
};

const AREAS = ["General", "Work / Career", "Money", "Relationships", "Health", "Creative Work", "Family", "Self-Discipline"];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function weekKey(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function weekLabel(key) {
  const start = new Date(key + "T00:00:00");
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const opts = { month: "short", day: "numeric" };
  return start.toLocaleDateString(undefined, opts) + " - " + end.toLocaleDateString(undefined, opts) + ", " + start.getFullYear();
}

// ─── Storage ─────────────────────────────────────────────────
// SSR-safe localStorage with in-memory fallback. The original app was
// written for the Claude artifacts environment (window.storage async
// API); this version uses the same pattern as every other portal
// tool: synchronous localStorage with graceful degradation.
//
// Storage keys use the portal `tfi-` prefix to prevent collisions
// with other tools.
//
// Note: existing users who first tried this app in the artifact
// environment will not see their old data — the artifact `window.storage`
// namespace is separate from `window.localStorage`. That's an
// acceptable one-time loss given that the app is being formally
// installed here for the first time.

const _cosmicMem = {};

function _loadKey(key, fallback) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    }
    return _cosmicMem[key] !== undefined ? _cosmicMem[key] : fallback;
  } catch {
    return fallback;
  }
}

function _saveKey(key, value) {
  _cosmicMem[key] = value;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Quota errors / private mode / etc. In-memory copy still holds
    // for the current session.
  }
}

// Preserve the loadArray / saveArray signatures the rest of the app
// uses — including the async signature — even though localStorage
// is synchronous. This keeps the diff surface small; every await
// call site elsewhere continues to work unchanged.
async function loadArray(key) {
  const val = _loadKey(key, []);
  return Array.isArray(val) ? val : [];
}

async function saveArray(key, value) {
  _saveKey(key, value);
}

/* ---------------------------------------------------------
   AI call path
   All calls go through /api/org-diagnostic — a Next.js server
   route that holds the ANTHROPIC_API_KEY safely, gates on
   Clerk auth, applies per-user rate limiting, and salvages
   JSON from the model reply.
   The endpoint takes a single flat `prompt` field, so we
   concatenate the system prompt and user message with a
   separator. Response is the parsed JSON directly.
--------------------------------------------------------- */

function salvageJSON(raw) {
  let t = (raw || "").replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(t);
  } catch (e) {
    const first = t.indexOf("{");
    const last = t.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(t.slice(first, last + 1));
    }
    throw new Error("No parseable JSON in model response");
  }
}

async function callModel(system, user) {
  const prompt = system + "\n\n---\n\n" + user;
  let response;
  try {
    response = await fetch("/api/org-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  } catch (netErr) {
    throw new Error("Network error reaching the model: " + (netErr && netErr.message ? netErr.message : "unknown"));
  }

  const rawBody = await response.text();
  if (!response.ok) {
    // /api/org-diagnostic returns { error: "..." } on failure.
    // Surface that specific error where possible for a better UX.
    try {
      const errObj = JSON.parse(rawBody);
      if (errObj && errObj.error) {
        // 429 rate-limit gets a friendlier phrasing
        if (response.status === 429) {
          throw new Error("You're moving fast — the model is briefly rate-limited. Wait a few seconds and try again.");
        }
        throw new Error(errObj.error);
      }
    } catch (parseErr) {
      // fall through to generic error below
    }
    throw new Error("Model request failed (HTTP " + response.status + "). " + rawBody.slice(0, 240));
  }

  // The endpoint returns parsed JSON directly, not the Anthropic
  // envelope. If it's already an object, use it. Fall back to
  // salvageJSON if the body somehow came back as a string.
  try {
    const data = JSON.parse(rawBody);
    // If the server wrapped the payload in an { error } object it would
    // have been !response.ok above. Otherwise this IS the diagnostic.
    return data;
  } catch (e) {
    // Server should have parsed already but salvage as belt-and-braces
    return salvageJSON(rawBody);
  }
}

const READING_PROMPT = `You are the analysis engine inside a personal-clarity tool called the Organizing Intelligence Engine. A person enters an intention, a purpose, a problem, or a goal. You read it through a five-layer model: Intelligent Order, Structure, Pattern, Rhythm, Events. Outcome is a measurement attached to Events, not a sixth layer.

Produce these fields:

1. governing_principle - the single principle that governs this situation. One clear sentence stating the actual structural or causal law at play, not a platitude.
2. Current reality - what is operating now: current_structure (what architecture exists or is missing), current_pattern (the loop that keeps repeating, named concretely), current_rhythm (the cadence they actually run on now, even if erratic or absent).
3. Required alignment - what must be true to resolve: required_structure (the architecture that must exist), required_pattern (the loop that should run instead), required_rhythm (the sustaining cadence - be specific: daily, weekly, monthly, quarterly).
4. events - an array of 3 to 5 immediate, concrete actions the person can execute now. Real actions, not aspirations.
5. event_permission - one sentence naming the single action they are permitted to start right now. The first, most immediate move.
6. outcome_metric - one specific, trackable metric with a timeframe and a clear success threshold.
7. weekly_review_questions - an array of 4 to 6 short questions tailored to THIS intention.

Tone: direct, grounded, practical. No mystical language, no destiny framing, no guaranteed outcomes. A structural diagnosis, not a horoscope. Be specific to what the person wrote. Keep each field tight - one or two sentences.

Return ONLY valid JSON, no markdown fences. Exact keys: governing_principle (string), current_structure (string), current_pattern (string), current_rhythm (string), required_structure (string), required_pattern (string), required_rhythm (string), events (array of strings), event_permission (string), outcome_metric (string), weekly_review_questions (array of strings).`;

const WORKFLOW_PROMPT = `You build the workflow that bridges rhythm and events inside the Organizing Intelligence Engine. Given a person's intention and the alignment they are working toward, produce the ordered sequence that turns the required rhythm into executable events.

Return an array of 4 to 6 ordered steps. Each step is an object with exactly these keys: step (integer starting at 1), objective (why this step exists), action (what to actually do), deliverable (the concrete thing it produces), success_check (how they know the step is complete), principle (one short sentence stating the organizing-intelligence law that makes this step necessary - the reason the order requires it, as a general truth, not restated advice). Where it fits, follow the arc Discover, Design, Implement, Review, Refine.

Tone: direct, grounded, practical. Keep each field to one sentence. Be specific to the intention.

Return ONLY valid JSON, no markdown fences: an object with a single key "workflow" whose value is the array of step objects.`;

async function generateMap(input, area) {
  const userMsg = "Area of life: " + area + "\n\nIntention / purpose / problem / goal:\n" + input;
  const reading = await callModel(READING_PROMPT, userMsg);
  const wfContext =
    userMsg +
    "\n\nRequired structure: " + (reading.required_structure || "") +
    "\nRequired rhythm: " + (reading.required_rhythm || "") +
    "\nImmediate events: " + (Array.isArray(reading.events) ? reading.events.join("; ") : "");
  let workflow = [];
  try {
    const wf = await callModel(WORKFLOW_PROMPT, wfContext);
    workflow = Array.isArray(wf.workflow) ? wf.workflow : Array.isArray(wf) ? wf : [];
  } catch (e) {
    workflow = []; // reading still returns; workflow section simply hides if empty
  }
  return { ...reading, workflow };
}

const EXPLORE_EXAMPLES = [
  // ---------- NATURE ----------
  {
    id: "nautilus", group: "Nature", name: "Nautilus Shell", blurb: "Growth that never changes its proportion.",
    layers: {
      intelligent_order: "A thing can grow without limit and still stay true to its original proportion.",
      structure: "A chambered spiral where each new chamber is a scaled copy of the last, sealed off yet built on the same ratio.",
      pattern: "Every increment of growth repeats the same proportional relationship to what came before.",
      rhythm: "Growth arrives in discrete pulses: a chamber is completed and sealed before the next is begun.",
      events: "The shell you can hold in your hand - larger, but unmistakably the same shape it was when small.",
    },
  },
  {
    id: "beehive", group: "Nature", name: "Beehive", blurb: "One purpose, thousands of roles.",
    layers: {
      intelligent_order: "A colony survives by distributing a single shared purpose across thousands of specialized roles.",
      structure: "Hexagonal cells that store the most with the least material, plus a division into queen, workers, and drones.",
      pattern: "Individual bees follow simple local rules that produce coordinated behavior no single bee planned.",
      rhythm: "Daily foraging cycles, seasonal buildup and contraction, and the once-a-generation event of swarming.",
      events: "Honey stored, brood raised, the hive splitting when it outgrows itself.",
    },
  },
  {
    id: "river", group: "Nature", name: "River & Watershed", blurb: "Water organizing a landscape.",
    layers: {
      intelligent_order: "Water always takes the lowest available path, and over time that path organizes an entire landscape.",
      structure: "A branching network - tributaries feeding channels feeding a main stem - draining one bounded basin.",
      pattern: "The same branching ratio repeats from the smallest rivulet to the largest river.",
      rhythm: "Seasonal flood and drought, the daily pulse of snowmelt, the slow event of a channel changing course.",
      events: "Floods, deltas, canyons cut over time - the visible record of where the water went.",
    },
  },
  {
    id: "tree", group: "Nature", name: "Tree", blurb: "Reaching up and anchoring down at once.",
    layers: {
      intelligent_order: "A living thing reaches for light and water at once, balancing what it spends above against what it anchors below.",
      structure: "Root, trunk, branch, leaf - a load-bearing hierarchy that divides the same way at every scale.",
      pattern: "Each branch splits into smaller branches by the same rule.",
      rhythm: "Annual growth rings, seasonal leaf-out and leaf-fall, the daily opening and closing of pores.",
      events: "A ring laid down, fruit dropped, a limb shed in a storm.",
    },
  },
  // ---------- THE BODY ----------
  {
    id: "heartbeat", group: "The Body", name: "Heartbeat", blurb: "A rhythm that never stops but always adjusts.",
    layers: {
      intelligent_order: "Life depends on a rhythm that never fully stops yet constantly adjusts to load.",
      structure: "A four-chambered pump with a built-in electrical system that fires in sequence.",
      pattern: "The same sequence - fill, squeeze, rest - repeats every single beat.",
      rhythm: "Around sixty to a hundred beats a minute at rest, rising with exertion, dropping in sleep.",
      events: "A pulse you can feel, blood delivered, the measurable output of cardiac work.",
    },
  },
  {
    id: "breath", group: "The Body", name: "Breath", blurb: "Automatic, yet yours to command.",
    layers: {
      intelligent_order: "The body takes in what it needs and releases what it does not, on a cycle it can run automatically or on command.",
      structure: "Lungs, diaphragm, and airways working together as an expandable bellows.",
      pattern: "Inhale, pause, exhale, pause - the same loop, awake or asleep.",
      rhythm: "Roughly twelve to twenty breaths a minute, deepening under exertion, slowing in rest.",
      events: "Oxygen delivered, carbon dioxide cleared, a sigh, a held breath.",
    },
  },
  {
    id: "immune", group: "The Body", name: "Immune System", blurb: "Telling self from not-self, and remembering.",
    layers: {
      intelligent_order: "A body stays whole by telling self from not-self and remembering past threats.",
      structure: "Layered defenses - barriers, fast innate responders, and adaptive cells that specialize and remember.",
      pattern: "Detect, respond, resolve, remember - repeated for each new threat.",
      rhythm: "Innate response in hours, adaptive response over days, immune memory over years.",
      events: "A fever, an infection cleared, immunity that holds the next time.",
    },
  },
  // ---------- LIFE AREAS ----------
  {
    id: "marriage", group: "Life Areas", name: "Marriage", blurb: "Trust built on agreement, not just support.",
    layers: {
      intelligent_order: "Trust grows through consistent communication and shared responsibility.",
      structure: "A shared vision, working communication, and agreed handling of finances, conflict, and family.",
      pattern: "When agreement precedes action, trust compounds; when support is given without agreement, resentment compounds.",
      rhythm: "Daily connection, weekly review, monthly planning, quarterly reset.",
      events: "Decisions made together, conflicts resolved or avoided, the felt sense of partnership.",
    },
  },
  {
    id: "business", group: "Life Areas", name: "A Business", blurb: "Delivering more value than it consumes.",
    layers: {
      intelligent_order: "An organization survives by repeatably delivering more value than it consumes.",
      structure: "Roles, ownership, processes, and a model connecting effort to revenue.",
      pattern: "Offer, deliver, learn, improve - run tight or run loose.",
      rhythm: "Daily execution, weekly review, monthly targets, quarterly strategy.",
      events: "Products shipped, customers served, revenue booked or missed.",
    },
  },
  {
    id: "finances", group: "Life Areas", name: "Personal Finances", blurb: "What you keep, not what you earn.",
    layers: {
      intelligent_order: "Wealth is what you keep and direct, not what you earn.",
      structure: "Income, fixed costs, savings, and a buffer against shock.",
      pattern: "Spending expands to match income unless a structure holds it back.",
      rhythm: "Monthly cash flow, annual planning, and the irregular event of a large expense.",
      events: "Money saved or spent, debt cleared or grown, net worth moving.",
    },
  },
  {
    id: "skill", group: "Life Areas", name: "Learning a Skill", blurb: "Corrected effort at the edge of ability.",
    layers: {
      intelligent_order: "Capability is built by repeated, corrected effort at the edge of current ability.",
      structure: "A model of the skill, a source of feedback, and time protected for practice.",
      pattern: "Attempt, fail, correct, consolidate - repeated just past what you can already do.",
      rhythm: "Daily reps, weekly review of progress, plateaus broken by changing the drill.",
      events: "A rep landed, a plateau broken, a measurable jump in performance.",
    },
  },
  // ---------- THE COSMOS ----------
  {
    id: "solar", group: "The Cosmos", name: "Solar System", blurb: "Motion held in balance with pull.",
    layers: {
      intelligent_order: "Bodies stay bound in stable relationship when their motion exactly balances the pull between them.",
      structure: "A central mass with planets held in nested orbits, each at a distance where speed and gravity balance.",
      pattern: "The same orbital relationship repeats at every scale - moon around planet, planet around star.",
      rhythm: "Each body keeps its own period, and the whole system cycles in overlapping loops that rarely align.",
      events: "An eclipse, a season, a close approach - the visible result of many clocks running at once.",
    },
  },
  {
    id: "star", group: "The Cosmos", name: "A Star's Life", blurb: "Outward pressure against inward pull.",
    layers: {
      intelligent_order: "A thing endures only as long as its outward pressure balances the force pulling it inward.",
      structure: "A sphere of gas where fusion in the core pushes out against gravity pulling in.",
      pattern: "Fuel is burned, balance is held, then fuel runs low and the balance tips - repeated in stages.",
      rhythm: "Millions of years of steady burning, punctuated by rapid transitions when a fuel is exhausted.",
      events: "A steady sun, a red giant, a supernova - each a stage in the same balance shifting.",
    },
  },
  {
    id: "seasons", group: "The Cosmos", name: "The Seasons", blurb: "A steady source, a shifting angle.",
    layers: {
      intelligent_order: "A steady source produces changing effects when the angle at which it strikes keeps shifting.",
      structure: "A tilted planet orbiting a single star, so different parts lean toward the light at different times.",
      pattern: "The same four-part progression - warming, peak, cooling, low - repeats every orbit.",
      rhythm: "One full cycle per year, marked by the solstices and equinoxes.",
      events: "Spring growth, summer heat, autumn fall, winter rest - the tilt made visible.",
    },
  },
  {
    id: "tides", group: "The Cosmos", name: "Tides", blurb: "A distant force, felt on every shore.",
    layers: {
      intelligent_order: "A distant force, felt everywhere at once, produces its strongest effect where things are free to move.",
      structure: "Ocean water loosely held on a spinning planet, pulled by the moon and the sun.",
      pattern: "Water rises and falls in a repeating swell as the pull shifts around the planet.",
      rhythm: "Two highs and two lows on most days, amplified at the new and full moon.",
      events: "A high tide, a spring tide, an exposed shoreline - the pull made local.",
    },
  },
  // ---------- SOCIETY & CULTURE ----------
  {
    id: "city", group: "Society & Culture", name: "A City", blurb: "Coordinating flows no one controls.",
    layers: {
      intelligent_order: "Many people living close together must coordinate flows that no one of them individually controls.",
      structure: "Networks laid over land - streets, water, power, housing, and zones for different kinds of work.",
      pattern: "Density concentrates activity, which draws more people, which demands more infrastructure - a loop.",
      rhythm: "Daily commutes, weekly commerce, seasonal cycles, and slow decades of growth and decline.",
      events: "Rush hour, a new development, a neighborhood's rise or fall.",
    },
  },
  {
    id: "economy", group: "Society & Culture", name: "An Economy", blurb: "Value flowing toward where it is wanted.",
    layers: {
      intelligent_order: "When people are free to exchange, value flows toward wherever it is most wanted.",
      structure: "Buyers, sellers, prices, and the rules and trust that let exchange happen at all.",
      pattern: "Supply and demand push prices until they meet, then conditions shift and push again.",
      rhythm: "Daily transactions, quarterly cycles, and multi-year expansions and contractions.",
      events: "A price change, a boom, a shortage, a crash.",
    },
  },
  {
    id: "language", group: "Society & Culture", name: "Language", blurb: "Transferring meaning minds cannot share.",
    layers: {
      intelligent_order: "A shared code lets separate minds transfer meaning they cannot directly share.",
      structure: "A finite set of sounds and rules that combine into unlimited meanings.",
      pattern: "The same grammar is reused to generate sentences that have never been spoken before.",
      rhythm: "Constant everyday use, slow drift over generations, and the rare sudden coinage.",
      events: "A conversation, a new word entering use, a dialect splitting off.",
    },
  },
  {
    id: "team", group: "Society & Culture", name: "A Team", blurb: "Effort aligned to a single aim.",
    layers: {
      intelligent_order: "A group outperforms its individuals only when their efforts are aligned to one aim.",
      structure: "Roles, a shared goal, working communication, and an agreed way to decide.",
      pattern: "Coordinate, execute, review, adjust - repeated on whatever the team is doing.",
      rhythm: "Daily work, regular check-ins, project cycles, and seasons of intensity and rest.",
      events: "A goal hit or missed, a handoff made, a conflict resolved.",
    },
  },
  // ---------- THE COSMOS (added) ----------
  {
    id: "moon", group: "The Cosmos", name: "Moon Phases", blurb: "The same sphere, seen from a shifting angle.",
    layers: {
      intelligent_order: "What we see of a thing depends entirely on the angle between it, its light, and us.",
      structure: "A lit sphere orbiting a planet, always half-lit, seen from a moving vantage point.",
      pattern: "The visible fraction grows and shrinks through the same sequence every cycle.",
      rhythm: "One full cycle roughly every twenty-nine to thirty days, from new to full and back.",
      events: "A crescent, a full moon, a dark sky - the same sphere at a different angle.",
    },
  },
  {
    id: "galaxy", group: "The Cosmos", name: "A Galaxy", blurb: "Many bodies, one shape, one center.",
    layers: {
      intelligent_order: "Countless separate bodies can hold a single shape when they all orbit a common center.",
      structure: "Billions of stars, gas, and dark matter bound in a disk around a dense core.",
      pattern: "Stars trace the same great orbit, and density waves keep re-forming the spiral arms.",
      rhythm: "A single rotation takes hundreds of millions of years; star formation pulses along the arms.",
      events: "A spiral arm, a burst of new stars, a slow collision with a neighbor.",
    },
  },
  // ---------- NATURE (added) ----------
  {
    id: "forest", group: "Nature", name: "A Forest", blurb: "Filling in, one stage preparing the next.",
    layers: {
      intelligent_order: "An open space fills in stages, each stage preparing the ground for the one that replaces it.",
      structure: "Layered life - soil, ground cover, understory, canopy - each depending on the others.",
      pattern: "Pioneer species arrive, alter conditions, and are succeeded by species that could not have come first.",
      rhythm: "Seasonal growth cycles nested inside a decades-long succession toward maturity.",
      events: "A meadow becoming woodland, a fire, a clearing filling back in.",
    },
  },
  {
    id: "water", group: "Nature", name: "The Water Cycle", blurb: "A fixed quantity, endlessly returning.",
    layers: {
      intelligent_order: "A fixed quantity can serve endlessly if it keeps changing state and returning.",
      structure: "Reservoirs - ocean, air, land, ice - linked by evaporation, rain, and flow.",
      pattern: "Water rises, gathers, falls, and drains, then rises again in the same loop.",
      rhythm: "Daily evaporation, seasonal rains, and the slow turnover of deep reserves.",
      events: "A storm, a drought, a river running to the sea.",
    },
  },
  // ---------- THE BODY (added) ----------
  {
    id: "sleep", group: "The Body", name: "Sleep", blurb: "Going offline to repair and consolidate.",
    layers: {
      intelligent_order: "A system that runs hard must go offline on a schedule to repair and consolidate.",
      structure: "Cycles of lighter and deeper stages, driven by an internal clock and daily light.",
      pattern: "The same stage sequence repeats several times a night, shifting in proportion toward morning.",
      rhythm: "A roughly ninety-minute cycle, nested in the twenty-four-hour day-night rhythm.",
      events: "Falling asleep, a vivid dream, waking rested or not.",
    },
  },
  {
    id: "healing", group: "The Body", name: "Healing a Wound", blurb: "An ordered repair that cannot be skipped.",
    layers: {
      intelligent_order: "A damaged structure restores itself through an ordered sequence that cannot be skipped.",
      structure: "Layered tissue with a built-in repair response - clot, clean, rebuild, remodel.",
      pattern: "The same phases run in order for a splinter or a surgery, differing only in scale.",
      rhythm: "Minutes to clot, days to close, weeks to months to fully remodel.",
      events: "A scab, a scar, skin that holds again.",
    },
  },
  // ---------- LIFE AREAS (added) ----------
  {
    id: "child", group: "Life Areas", name: "Raising a Child", blurb: "Transferring responsibility toward independence.",
    layers: {
      intelligent_order: "A dependent being is guided toward independence by steadily transferring responsibility.",
      structure: "A relationship of care, boundaries, modeling, and gradually widening freedom.",
      pattern: "Protect, teach, release, repeat - each cycle at a higher level of capability.",
      rhythm: "Daily care, developmental stages, and the long arc from dependence to autonomy.",
      events: "A first step, a hard lesson, a child handling something alone.",
    },
  },
  {
    id: "fitness", group: "Life Areas", name: "Building Fitness", blurb: "Stress, recover, adapt, progress.",
    layers: {
      intelligent_order: "A body grows stronger by being stressed past its comfort and then allowed to recover.",
      structure: "Effort, rest, fuel, and a progression that keeps raising the demand.",
      pattern: "Stress, recover, adapt - repeated with the load nudged upward over time.",
      rhythm: "Training sessions across the week, rest days between, deload weeks in cycles.",
      events: "A heavier lift, a faster mile, a body that has visibly changed.",
    },
  },
  // ---------- SOCIETY & CULTURE (added) ----------
  {
    id: "law", group: "Society & Culture", name: "The Law", blurb: "Settling disputes by rule, not force.",
    layers: {
      intelligent_order: "A society holds together when disputes are settled by shared rules rather than by force.",
      structure: "Written rules, courts to apply them, and the trust and power to enforce.",
      pattern: "A rule is set, tested by real cases, interpreted, and refined - repeated over time.",
      rhythm: "Daily enforcement, case-by-case rulings, and slow legislative and precedent change.",
      events: "A verdict, a new statute, a landmark ruling that shifts the line.",
    },
  },
  {
    id: "movement", group: "Society & Culture", name: "A Social Movement", blurb: "Scattered discontent given direction.",
    layers: {
      intelligent_order: "Scattered discontent becomes force when it is given a shared name and direction.",
      structure: "A shared grievance, a message, networks of people, and visible action.",
      pattern: "Grievance spreads, organizes, acts, and either institutionalizes or dissipates.",
      rhythm: "Slow buildup, bursts of mass action, and long stretches of quiet organizing.",
      events: "A protest, a viral moment, a policy change, a movement fading.",
    },
  },
];

const EXPLORE_GROUPS = ["The Cosmos", "Nature", "The Body", "Life Areas", "Society & Culture"];

const EXPLORE_WORKFLOWS = {
  nautilus: [
    { stage: "Seal", description: "Close off the completed chamber.", principle: "What is finished must be closed before the next thing can rest on it." },
    { stage: "Scale", description: "Lay out the next chamber at the same proportion.", principle: "Growth keeps its identity by holding its proportion constant." },
    { stage: "Occupy", description: "Move forward into the new space.", principle: "New capacity is only real once it is inhabited." },
    { stage: "Repeat", description: "Begin the next chamber from the new edge.", principle: "A sound rule, once found, is reapplied rather than reinvented." },
  ],
  beehive: [
    { stage: "Scout", description: "Locate resources across the surrounding range.", principle: "A system cannot act on what it has not yet located." },
    { stage: "Recruit", description: "Signal the find to the rest of the colony.", principle: "Shared information turns private discovery into collective capacity." },
    { stage: "Harvest", description: "Gather nectar and pollen and return.", principle: "Value must be gathered while it is available, not when convenient." },
    { stage: "Store", description: "Convert and seal the yield into cells.", principle: "Surplus is only useful once it is preserved against scarcity." },
    { stage: "Rear", description: "Raise the next generation of workers.", principle: "A system that does not renew its members does not persist." },
  ],
  river: [
    { stage: "Collect", description: "Gather water across the whole basin.", principle: "Order accumulates from the diffuse before it can act." },
    { stage: "Channel", description: "Converge scattered flows into defined paths.", principle: "Scattered force multiplies when it is given a single path." },
    { stage: "Carry", description: "Transport water and sediment downstream.", principle: "Movement is what converts stored potential into work." },
    { stage: "Deposit", description: "Release the load where the flow slows.", principle: "Every flow releases its load where its energy runs out." },
  ],
  tree: [
    { stage: "Anchor", description: "Extend roots for water and stability.", principle: "Reach is limited by the strength of what holds you down." },
    { stage: "Rise", description: "Build trunk and branches toward light.", principle: "Growth moves toward the resource it depends on." },
    { stage: "Capture", description: "Unfold leaves to convert light into energy.", principle: "A system must convert its environment into usable energy." },
    { stage: "Store", description: "Lay down wood and set buds for next season.", principle: "Present surplus is what funds future growth." },
  ],
  heartbeat: [
    { stage: "Fill", description: "Chambers receive the returning blood.", principle: "Output requires a prior intake; nothing is given that was not first received." },
    { stage: "Contract", description: "Squeeze blood out in sequence.", principle: "Work happens in the moment of concentrated release." },
    { stage: "Rest", description: "A brief pause to refill.", principle: "Sustained function depends on recovery built into the cycle." },
    { stage: "Adjust", description: "Rate shifts to meet current demand.", principle: "A living rhythm matches its rate to real demand." },
  ],
  breath: [
    { stage: "Inhale", description: "Draw air in as the diaphragm drops.", principle: "Taking in precedes giving out." },
    { stage: "Exchange", description: "Trade oxygen for carbon dioxide.", principle: "The point of intake is transformation, not accumulation." },
    { stage: "Exhale", description: "Release the spent air.", principle: "What is spent must be released to make room for the new." },
    { stage: "Pause", description: "Settle before the next cycle begins.", principle: "A rhythm needs rest between its beats." },
  ],
  immune: [
    { stage: "Detect", description: "Recognize what is not-self.", principle: "Defense begins with the ability to tell things apart." },
    { stage: "Respond", description: "Mobilize the right defenses.", principle: "Recognition is useless without a mobilized response." },
    { stage: "Resolve", description: "Clear the threat.", principle: "A response must end, or it becomes its own damage." },
    { stage: "Remember", description: "Retain a template for next time.", principle: "Intelligence compounds when experience is retained." },
  ],
  marriage: [
    { stage: "Clarify", description: "Surface expectations openly.", principle: "Nothing can be agreed that has not first been made explicit." },
    { stage: "Agree", description: "Turn expectations into shared commitments.", principle: "Shared commitment, not shared feeling, is what binds." },
    { stage: "Assign", description: "Decide who carries what.", principle: "Responsibility held by everyone is held by no one." },
    { stage: "Review", description: "Check progress together on a set cadence.", principle: "What is not revisited quietly drifts." },
    { stage: "Adjust", description: "Correct what is not working.", principle: "A living agreement is corrected, not enforced." },
  ],
  business: [
    { stage: "Offer", description: "Put value in front of a customer.", principle: "Value must be presented before it can be exchanged." },
    { stage: "Deliver", description: "Fulfill the promise made.", principle: "A promise creates the obligation to fulfill it." },
    { stage: "Measure", description: "Track what actually happened.", principle: "What is not measured cannot be improved." },
    { stage: "Learn", description: "Find the one thing to improve.", principle: "Feedback is only useful once it is interpreted." },
    { stage: "Improve", description: "Change the system and run it again.", principle: "A system that does not change decays against a changing world." },
  ],
  finances: [
    { stage: "Track", description: "See all money coming in and going out.", principle: "You cannot direct what you cannot see." },
    { stage: "Allocate", description: "Give every dollar a job.", principle: "Unassigned resources are spent by default." },
    { stage: "Protect", description: "Fund savings and buffer first.", principle: "Resilience is funded before comfort." },
    { stage: "Review", description: "Reconcile against the plan.", principle: "Plans drift from reality without reconciliation." },
    { stage: "Adjust", description: "Correct the drift each month.", principle: "Correction is continuous, not occasional." },
  ],
  skill: [
    { stage: "Model", description: "Build a clear picture of the target.", principle: "You cannot aim at what you have not defined." },
    { stage: "Attempt", description: "Practice at the edge of ability.", principle: "Capability is built only at the edge of current ability." },
    { stage: "Feedback", description: "Get correction on what went wrong.", principle: "Effort without correction just repeats the error." },
    { stage: "Consolidate", description: "Repeat until it holds.", principle: "Repetition converts a single success into a reliable ability." },
    { stage: "Advance", description: "Raise the difficulty.", principle: "Growth requires raising the demand once the current level holds." },
  ],
  solar: [
    { stage: "Attract", description: "Mass pulls surrounding matter toward it.", principle: "Concentration begins wherever mass gathers." },
    { stage: "Balance", description: "Orbital speed offsets the pull so bodies neither fall in nor fly off.", principle: "Stability is motion held in exact tension with force." },
    { stage: "Clear", description: "Each orbit sweeps its own path over time.", principle: "A stable path is one that has resolved what competes for it." },
    { stage: "Cycle", description: "Bodies return to their positions on fixed periods.", principle: "Order that holds becomes rhythm you can predict." },
  ],
  star: [
    { stage: "Ignite", description: "Pressure and heat start fusion in the core.", principle: "Sustained output requires crossing a threshold before it begins." },
    { stage: "Balance", description: "Fusion pushes out exactly against gravity's pull.", principle: "A stable life is a standoff between opposing forces." },
    { stage: "Shift", description: "As the fuel changes, the balance point moves.", principle: "When the input changes, the whole equilibrium relocates." },
    { stage: "Release", description: "The final balance fails and the star sheds or collapses.", principle: "Every equilibrium eventually meets a force it cannot hold." },
  ],
  seasons: [
    { stage: "Tilt", description: "The planet leans at a fixed angle.", principle: "A constant offset is what turns sameness into variation." },
    { stage: "Orbit", description: "It carries that tilt around the star.", principle: "Change comes from moving a fixed condition through a cycle." },
    { stage: "Angle", description: "Light strikes each hemisphere more or less directly.", principle: "The same input does different work depending on how it lands." },
    { stage: "Return", description: "The cycle completes and begins again.", principle: "What varies within a cycle still returns to where it started." },
  ],
  tides: [
    { stage: "Pull", description: "The moon's gravity draws water toward it.", principle: "Even a distant force reaches everything within its field." },
    { stage: "Bulge", description: "Water gathers on the near and far sides.", principle: "A single force can produce effects in more than one place at once." },
    { stage: "Rotate", description: "The planet turns beneath the bulge.", principle: "Motion turns a steady pull into a repeating cycle." },
    { stage: "Combine", description: "Sun and moon align or oppose.", principle: "Forces that share a direction amplify; forces that cross cancel." },
  ],
  city: [
    { stage: "Gather", description: "People concentrate where opportunity is.", principle: "Density forms wherever advantage accumulates." },
    { stage: "Connect", description: "Networks link the parts so they can exchange.", principle: "A collection becomes a system only once its parts can reach each other." },
    { stage: "Specialize", description: "Districts and roles divide the work.", principle: "Scale is handled by dividing it, not by everyone doing everything." },
    { stage: "Maintain", description: "Infrastructure is repaired or it decays.", principle: "What is built must be sustained, or it returns to disorder." },
  ],
  economy: [
    { stage: "Signal", description: "Prices reveal what is scarce and wanted.", principle: "Information the whole system needs can be carried by a single number." },
    { stage: "Respond", description: "Producers and buyers adjust to the signal.", principle: "A system self-corrects when its parts can act on what it tells them." },
    { stage: "Exchange", description: "Value moves to where it is valued most.", principle: "Free flow moves resources toward their best use." },
    { stage: "Correct", description: "Imbalances build until they break and reset.", principle: "Uncorrected pressure does not vanish; it accumulates until it releases." },
  ],
  language: [
    { stage: "Encode", description: "A speaker turns meaning into shared symbols.", principle: "What is internal must take a shared form to be transmitted." },
    { stage: "Transmit", description: "The symbols cross the gap between minds.", principle: "Meaning travels only through a channel both sides hold in common." },
    { stage: "Decode", description: "The listener reconstructs the meaning.", principle: "A signal is only complete once it is rebuilt on the other side." },
    { stage: "Drift", description: "Repeated use slowly reshapes the code.", principle: "A living system is changed by its own use." },
  ],
  team: [
    { stage: "Align", description: "Agree on the one aim.", principle: "Combined effort requires a shared direction, or it cancels out." },
    { stage: "Assign", description: "Divide the work by role.", principle: "Clear ownership is what turns a goal into action." },
    { stage: "Coordinate", description: "Sync the moving parts.", principle: "Divided work must be recombined to produce a whole." },
    { stage: "Review", description: "Check results and adjust.", principle: "A group improves only when it looks back at what it did." },
  ],
  moon: [
    { stage: "Illuminate", description: "The sun lights one half of the moon at all times.", principle: "The source does not change; only what it reaches is seen." },
    { stage: "Orbit", description: "The moon circles the planet.", principle: "A fixed condition seen from a moving vantage appears to change." },
    { stage: "Reveal", description: "More or less of the lit side faces us.", principle: "What is visible is a matter of angle, not of the thing itself." },
    { stage: "Return", description: "The sequence completes and repeats.", principle: "Appearances cycle even when the underlying state is constant." },
  ],
  galaxy: [
    { stage: "Bind", description: "Gravity holds the mass around a common center.", principle: "A shared center is what makes many parts one body." },
    { stage: "Rotate", description: "Everything orbits together.", principle: "Coherent motion is what gives a crowd a single form." },
    { stage: "Wave", description: "Density ripples compress gas into new stars.", principle: "Form can persist as a pattern of motion, not fixed matter." },
    { stage: "Renew", description: "Old stars die as new ones light.", principle: "A lasting structure replaces its parts while keeping its shape." },
  ],
  forest: [
    { stage: "Pioneer", description: "Hardy first species colonize bare ground.", principle: "The first to arrive are those that need the least." },
    { stage: "Build", description: "They enrich the soil and create shade.", principle: "Each stage changes the conditions the next depends on." },
    { stage: "Succeed", description: "Later species replace the pioneers.", principle: "What prepares the ground is often displaced by what it made possible." },
    { stage: "Mature", description: "A stable community establishes.", principle: "Order reaches a form that sustains rather than merely advances." },
  ],
  water: [
    { stage: "Evaporate", description: "Heat lifts water into the air.", principle: "Energy is what moves a resource from where it rests." },
    { stage: "Gather", description: "Vapor cools and condenses into cloud.", principle: "The diffuse must reconcentrate before it can act again." },
    { stage: "Release", description: "It falls as rain or snow.", principle: "What is gathered eventually returns under its own weight." },
    { stage: "Return", description: "It flows back to the reservoirs.", principle: "A closed loop loses nothing; it only changes form and place." },
  ],
  sleep: [
    { stage: "Wind down", description: "Signals lower arousal as light fades.", principle: "A system cannot switch states without a transition." },
    { stage: "Descend", description: "The body moves into deep, restorative stages.", principle: "Repair happens only when demand is set aside." },
    { stage: "Consolidate", description: "The mind sorts and stores the day.", principle: "Experience becomes memory when the system is offline to process it." },
    { stage: "Cycle", description: "Stages repeat and lighten toward waking.", principle: "Recovery is delivered in repeated passes, not one long effort." },
  ],
  healing: [
    { stage: "Seal", description: "A clot stops the loss.", principle: "The first task of repair is to stop the damage from spreading." },
    { stage: "Clean", description: "The site is cleared of debris and threat.", principle: "Nothing sound can be built on a compromised foundation." },
    { stage: "Rebuild", description: "New tissue fills the gap.", principle: "Restoration is active construction, not the mere absence of harm." },
    { stage: "Remodel", description: "The repair is strengthened over time.", principle: "A fix is provisional until it is reinforced into permanence." },
  ],
  child: [
    { stage: "Protect", description: "Meet the needs the child cannot meet.", principle: "Growth begins from safety, not from exposure." },
    { stage: "Model", description: "Show what you want them to learn.", principle: "The young learn far more from what is done than what is said." },
    { stage: "Release", description: "Hand over responsibility they can now carry.", principle: "Capability grows only when it is actually used." },
    { stage: "Trust", description: "Let them own the outcomes.", principle: "Independence is real only when the results are theirs." },
  ],
  fitness: [
    { stage: "Stress", description: "Train past current capacity.", principle: "Adaptation is triggered only by demand beyond the comfortable." },
    { stage: "Recover", description: "Rest and fuel the repair.", principle: "Growth happens during recovery, not during the effort." },
    { stage: "Adapt", description: "The body rebuilds slightly stronger.", principle: "A system rises to meet a demand that is repeated." },
    { stage: "Progress", description: "Raise the load once it is met.", principle: "Constant demand yields constant results; growth needs escalation." },
  ],
  law: [
    { stage: "Codify", description: "Write the shared rule down.", principle: "A rule everyone must follow must first be made explicit and fixed." },
    { stage: "Apply", description: "Test the rule against a real case.", principle: "A principle only reveals its meaning when met with a specific." },
    { stage: "Interpret", description: "Resolve where the rule is unclear.", principle: "No rule can anticipate every case; judgment fills the gaps." },
    { stage: "Refine", description: "Amend the rule as cases accumulate.", principle: "A living rule is corrected by the reality it meets." },
  ],
  movement: [
    { stage: "Name", description: "Give the shared grievance a clear frame.", principle: "Diffuse feeling becomes force only once it is named." },
    { stage: "Connect", description: "Link the aggrieved into a network.", principle: "Numbers become power only when they are coordinated." },
    { stage: "Act", description: "Make the demand visible and costly to ignore.", principle: "Pressure works only when it is felt by those who can answer it." },
    { stage: "Consolidate", description: "Turn momentum into lasting change.", principle: "A surge fades unless it is built into durable structure." },
  ],
};

function WorkflowSequence({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <div style={{ marginTop: "22px" }}>
      <div
        style={{
          fontFamily: S.fontMono,
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: S.cyan,
          marginBottom: "4px",
          paddingBottom: "6px",
          borderBottom: "1px solid " + S.border,
        }}
      >
        Operating Workflow
      </div>
      <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textFaint, marginBottom: "12px" }}>
        How the order moves from rhythm into events, and the principle behind each stage
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "10px" }}>
          <div
            style={{
              flexShrink: 0,
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "rgba(103,232,249,0.12)",
              border: "1px solid rgba(103,232,249,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: S.fontMono,
              fontSize: "12px",
              color: S.cyan,
            }}
          >
            {i + 1}
          </div>
          <div style={{ paddingTop: "2px" }}>
            <span style={{ fontFamily: S.fontMono, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", color: S.cyan }}>{s.stage}</span>
            <span style={{ fontFamily: S.fontHead, fontSize: "16px", color: S.textMuted }}> - {s.description}</span>
            {s.principle && (
              <div style={{ fontFamily: S.fontHead, fontStyle: "italic", fontSize: "15px", color: S.gold, opacity: 0.85, marginTop: "3px", lineHeight: 1.45 }}>
                {s.principle}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const EXPLORE_PROMPT = `You read the organizing intelligence already present in any subject through five layers. The subject may be a natural form, a physical system, or a domain of life.

Describe, for the given subject:
- intelligent_order: the single governing principle it runs on. One clear sentence.
- structure: the architecture that carries that principle.
- pattern: what repeats within it.
- rhythm: its timing and cadence.
- events: the observable results it produces.
- workflow: the operating sequence by which this order moves from rhythm into events. An array of 4 to 6 stages, each an object with three keys: stage (a one or two word name), description (one short sentence on what happens), and principle (one short sentence stating the organizing-intelligence law that makes this stage necessary - the reason the order works this way, not advice). This is descriptive - the process by which the subject actually does its work - not a to-do list for the reader.

This is descriptive, not prescriptive. You are showing the order that is already there, not giving advice or a plan. Grounded and specific, never mystical, never vague.

Return ONLY valid JSON, no markdown fences, with exactly these keys: intelligent_order (string), structure (string), pattern (string), rhythm (string), events (string), workflow (array of objects with stage, description, and principle).`;

async function generateExplore(subject) {
  return callModel(EXPLORE_PROMPT, "Subject: " + subject);
}

function FiveLayerRead({ layers }) {
  if (!layers) return null;
  const rows = [
    { label: "Intelligent Order", key: "intelligent_order", color: S.gold },
    { label: "Structure", key: "structure", color: S.purple },
    { label: "Pattern", key: "pattern", color: S.cyan },
    { label: "Rhythm", key: "rhythm", color: S.pink },
    { label: "Events", key: "events", color: S.green },
  ];
  return (
    <div>
      {rows.map((row) => (
        <div key={row.key} style={{ marginBottom: "16px", paddingLeft: "14px", borderLeft: "2px solid " + row.color }}>
          <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: row.color, marginBottom: "4px" }}>
            {row.label}
          </div>
          <div style={{ fontFamily: S.fontHead, fontSize: "17px", lineHeight: 1.55, color: S.text }}>{layers[row.key]}</div>
        </div>
      ))}
    </div>
  );
}

function Tab({ id, active, onClick, children }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        fontFamily: S.fontMono,
        fontSize: "12px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid " + (isActive ? S.gold : S.border),
        background: isActive ? "rgba(251,191,36,0.10)" : "transparent",
        color: isActive ? S.gold : S.textMuted,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: S.card,
        border: "1px solid " + S.border,
        borderRadius: "14px",
        padding: "20px",
        backdropFilter: "blur(10px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SubRow({ label, color, children }) {
  if (!children) return null;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: color, marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontFamily: S.fontHead, fontSize: "16px", lineHeight: 1.5, color: S.text }}>{children}</div>
    </div>
  );
}

function SectionLabel({ text, color }) {
  return (
    <div
      style={{
        fontFamily: S.fontMono,
        fontSize: "11px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color,
        marginBottom: "12px",
        paddingBottom: "6px",
        borderBottom: "1px solid " + S.border,
      }}
    >
      {text}
    </div>
  );
}

function WorkflowStep({ s }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        padding: "14px",
        borderRadius: "10px",
        background: "rgba(103,232,249,0.05)",
        border: "1px solid rgba(103,232,249,0.15)",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "rgba(103,232,249,0.14)",
          border: "1px solid rgba(103,232,249,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: S.fontMono,
          fontSize: "13px",
          color: S.cyan,
        }}
      >
        {s.step}
      </div>
      <div style={{ flex: 1 }}>
        <SubRow label="Objective" color={S.textFaint}>{s.objective}</SubRow>
        <SubRow label="Action" color={S.textFaint}>{s.action}</SubRow>
        <SubRow label="Deliverable" color={S.textFaint}>{s.deliverable}</SubRow>
        <div style={{ marginBottom: 0 }}>
          <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.green, marginBottom: "3px" }}>
            Success Check
          </div>
          <div style={{ fontFamily: S.fontHead, fontSize: "16px", lineHeight: 1.5, color: S.text }}>{s.success_check}</div>
        </div>
        {s.principle && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid " + S.border }}>
            <span style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.gold }}>Principle </span>
            <span style={{ fontFamily: S.fontHead, fontStyle: "italic", fontSize: "15px", color: S.gold, opacity: 0.85, lineHeight: 1.45 }}>{s.principle}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MapCard({ map, onToggleEvent, onToggleSave, onDelete, showActions }) {
  if (!map || !map.result) return null;
  const r = map.result;
  const workflow = Array.isArray(r.workflow) ? r.workflow : [];
  const events = Array.isArray(r.events) ? r.events : Array.isArray(r.action_workflow) ? r.action_workflow : [];
  const reviewQs = Array.isArray(r.weekly_review_questions) ? r.weekly_review_questions : [];
  const checked = map.checkedEvents || map.checkedSteps || [];
  const doneCount = checked.filter(Boolean).length;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ flex: 1, paddingRight: "10px" }}>
          <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint }}>
            {new Date(map.createdAt).toLocaleDateString()} - {map.area}
          </div>
          <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.textFaint, marginTop: "8px" }}>
            Intention
          </div>
          <div style={{ fontFamily: S.fontHead, fontSize: "18px", color: S.text, marginTop: "2px" }}>{map.input}</div>
        </div>
        {showActions && (
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => onToggleSave(map.id)} style={smallBtn(map.saved)}>
              {map.saved ? "Saved" : "Save"}
            </button>
            <button onClick={() => onDelete(map.id)} style={smallBtn(false)}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Intelligent Order */}
      <div
        style={{
          fontFamily: S.fontHead,
          fontStyle: "italic",
          fontSize: "17px",
          color: S.gold,
          padding: "14px 16px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "10px",
          marginBottom: "22px",
        }}
      >
        <div style={{ fontFamily: S.fontMono, fontSize: "10px", fontStyle: "normal", letterSpacing: "0.08em", textTransform: "uppercase", color: S.gold, marginBottom: "6px" }}>
          Intelligent Order
        </div>
        {r.governing_principle}
      </div>

      {/* Current Reality */}
      <div style={{ marginBottom: "22px" }}>
        <SectionLabel text="Current Reality" color={S.red} />
        <SubRow label="Structure" color={S.purple}>{r.current_structure || r.current_disorder}</SubRow>
        <SubRow label="Pattern" color={S.cyan}>{r.current_pattern}</SubRow>
        <SubRow label="Rhythm" color={S.pink}>{r.current_rhythm}</SubRow>
      </div>

      {/* Required Alignment */}
      <div style={{ marginBottom: "22px" }}>
        <SectionLabel text="Required Alignment" color={S.green} />
        <SubRow label="Structure" color={S.purple}>{r.required_structure}</SubRow>
        <SubRow label="Pattern" color={S.cyan}>{r.required_pattern}</SubRow>
        <SubRow label="Rhythm" color={S.pink}>{r.required_rhythm || r.recommended_rhythm}</SubRow>
      </div>

      {/* Workflow */}
      {workflow.length > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <SectionLabel text="Workflow - the bridge from rhythm to events" color={S.cyan} />
          {workflow.map((s, i) => (
            <WorkflowStep key={i} s={s} />
          ))}
        </div>
      )}

      {/* Events */}
      <div style={{ marginBottom: "22px" }}>
        <SectionLabel text={"Events - immediate actions" + (events.length ? " (" + doneCount + "/" + events.length + " done)" : "")} color={S.green} />
        {r.event_permission && (
          <div
            style={{
              borderRadius: "10px",
              padding: "12px 14px",
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.25)",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: S.sky, marginBottom: "4px" }}>
              Start here now
            </div>
            <div style={{ fontFamily: S.fontHead, fontSize: "16px", color: S.text }}>{r.event_permission}</div>
          </div>
        )}
        {events.map((ev, i) => (
          <label key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={!!checked[i]} onChange={() => onToggleEvent(map.id, i)} style={{ marginTop: "5px", accentColor: S.green }} />
            <span
              style={{
                fontFamily: S.fontHead,
                fontSize: "16px",
                color: checked[i] ? S.textFaint : S.text,
                textDecoration: checked[i] ? "line-through" : "none",
              }}
            >
              {ev}
            </span>
          </label>
        ))}
      </div>

      {/* Outcome Metric */}
      <div
        style={{
          borderRadius: "10px",
          padding: "14px 16px",
          background: "rgba(251,146,60,0.08)",
          border: "1px solid rgba(251,146,60,0.25)",
          marginBottom: reviewQs.length ? "22px" : 0,
        }}
      >
        <div style={{ fontFamily: S.fontMono, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: S.orange, marginBottom: "4px" }}>
          Outcome Metric
        </div>
        <div style={{ fontFamily: S.fontHead, fontSize: "16px", color: S.text }}>{r.outcome_metric || r.measurable_outcome}</div>
      </div>

      {/* Weekly Review Questions */}
      {reviewQs.length > 0 && (
        <div>
          <SectionLabel text="Weekly Review Questions" color={S.gold} />
          {reviewQs.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontFamily: S.fontMono, fontSize: "12px", color: S.textFaint, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontFamily: S.fontHead, fontSize: "16px", color: S.textMuted, lineHeight: 1.5 }}>{q}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function smallBtn(active) {
  return {
    fontFamily: S.fontMono,
    fontSize: "10px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid " + (active ? S.gold : S.border),
    background: active ? "rgba(251,191,36,0.12)" : "transparent",
    color: active ? S.gold : S.textMuted,
    cursor: "pointer",
  };
}

export default function OrganizingIntelligenceEngine() {
  const [tab, setTab] = useState("new");
  const [input, setInput] = useState("");
  const [area, setArea] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null);

  const [maps, setMaps] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [reflectionText, setReflectionText] = useState("");
  const [reflectionMapId, setReflectionMapId] = useState("");

  const [exploreSelected, setExploreSelected] = useState("nautilus");
  const [exploreInput, setExploreInput] = useState("");
  const [exploreResult, setExploreResult] = useState(null);
  const [exploreSubject, setExploreSubject] = useState("");
  const [exploreLoading, setExploreLoading] = useState(false);
  const [exploreError, setExploreError] = useState("");

  const [reviewDraft, setReviewDraft] = useState({
    eventExecuted: "",
    outcomeProduced: "",
    alignmentCheck: "",
    patternRepeating: "",
    rhythmCorrection: "",
    nextEvent: "",
  });

  useEffect(() => {
    (async () => {
      const [m, r, w] = await Promise.all([loadArray("tfi-cosmic-maps"), loadArray("tfi-cosmic-reflections"), loadArray("tfi-cosmic-reviews")]);
      setMaps(m);
      setReflections(r);
      setReviews(w);
      setLoaded(true);
    })();
  }, []);

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setDraft(null);
    try {
      const result = await generateMap(input.trim(), area);
      setDraft({ id: uid(), createdAt: Date.now(), input: input.trim(), area, result, saved: false, checkedEvents: [] });
    } catch (e) {
      setError((e && e.message) ? e.message : "Could not generate a map. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function commitDraft(saveIt) {
    if (!draft) return;
    const next = [{ ...draft, saved: saveIt }, ...maps];
    setMaps(next);
    await saveArray("tfi-cosmic-maps", next);
    setDraft(null);
    setInput("");
  }

  async function toggleSave(id) {
    const next = maps.map((m) => (m.id === id ? { ...m, saved: !m.saved } : m));
    setMaps(next);
    await saveArray("tfi-cosmic-maps", next);
  }

  async function toggleEvent(id, i) {
    const next = maps.map((m) => {
      if (m.id !== id) return m;
      const checked = [...(m.checkedEvents || m.checkedSteps || [])];
      checked[i] = !checked[i];
      return { ...m, checkedEvents: checked };
    });
    setMaps(next);
    await saveArray("tfi-cosmic-maps", next);
  }

  async function deleteMap(id) {
    const next = maps.filter((m) => m.id !== id);
    setMaps(next);
    await saveArray("tfi-cosmic-maps", next);
  }

  async function addReflection() {
    if (!reflectionText.trim()) return;
    const next = [{ id: uid(), createdAt: Date.now(), text: reflectionText.trim(), mapId: reflectionMapId || null }, ...reflections];
    setReflections(next);
    await saveArray("tfi-cosmic-reflections", next);
    setReflectionText("");
    setReflectionMapId("");
  }

  async function deleteReflection(id) {
    const next = reflections.filter((r) => r.id !== id);
    setReflections(next);
    await saveArray("tfi-cosmic-reflections", next);
  }

  const currentWeekKey = weekKey(new Date());
  const currentWeekReview = reviews.find((r) => r.weekKey === currentWeekKey);

  async function submitReview() {
    const entry = { id: uid(), weekKey: currentWeekKey, createdAt: Date.now(), ...reviewDraft };
    const next = [entry, ...reviews.filter((r) => r.weekKey !== currentWeekKey)];
    setReviews(next);
    await saveArray("tfi-cosmic-reviews", next);
    setReviewDraft({ eventExecuted: "", outcomeProduced: "", alignmentCheck: "", patternRepeating: "", rhythmCorrection: "", nextEvent: "" });
  }

  async function handleExplore() {
    if (!exploreInput.trim()) return;
    setExploreLoading(true);
    setExploreError("");
    setExploreResult(null);
    try {
      const res = await generateExplore(exploreInput.trim());
      setExploreResult(res);
      setExploreSubject(exploreInput.trim());
      setExploreSelected("custom");
    } catch (e) {
      setExploreError((e && e.message) ? e.message : "Could not read that subject. Try again.");
    } finally {
      setExploreLoading(false);
    }
  }

  const savedMaps = maps.filter((m) => m.saved);
  const pastReviews = reviews.filter((r) => r.weekKey !== currentWeekKey).sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1));

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: S.fontHead }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono&display=swap');"}</style>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontFamily: S.fontMono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: S.gold }}>
            Organizing Intelligence Engine
          </div>
          <h1 style={{ fontFamily: S.fontHead, fontSize: "28px", fontWeight: 600, margin: "6px 0 0" }}>Transformation Map</h1>
          <p style={{ fontFamily: S.fontHead, fontSize: "15px", color: S.textMuted, marginTop: "6px", lineHeight: 1.5 }}>
            Transform intention into aligned action: read the order, build the structure, recognize the pattern,
            establish the rhythm, generate the workflow, and execute the right event.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          <Tab id="new" active={tab} onClick={setTab}>New Map</Tab>
          <Tab id="explore" active={tab} onClick={setTab}>Explore</Tab>
          <Tab id="history" active={tab} onClick={setTab}>History</Tab>
          <Tab id="plans" active={tab} onClick={setTab}>Saved Plans</Tab>
          <Tab id="reflect" active={tab} onClick={setTab}>Reflection Log</Tab>
          <Tab id="review" active={tab} onClick={setTab}>Weekly Review</Tab>
        </div>

        {!loaded && <div style={{ fontFamily: S.fontMono, fontSize: "12px", color: S.textFaint }}>Loading...</div>}

        {loaded && tab === "new" && (
          <div>
            <Card style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint, marginBottom: "6px" }}>Area of life</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {AREAS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setArea(a)}
                      style={{
                        fontFamily: S.fontMono,
                        fontSize: "11px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid " + (area === a ? S.purple : S.border),
                        background: area === a ? "rgba(167,139,250,0.12)" : "transparent",
                        color: area === a ? S.purple : S.textMuted,
                        cursor: "pointer",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What are you trying to do, fix, or move through right now?"
                rows={5}
                style={{
                  width: "100%",
                  background: "rgba(237,233,245,0.03)",
                  border: "1px solid " + S.border,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  color: S.text,
                  fontFamily: S.fontHead,
                  fontSize: "16px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  fontFamily: S.fontMono,
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid " + S.gold,
                  background: loading ? "rgba(251,191,36,0.08)" : "rgba(251,191,36,0.16)",
                  color: S.gold,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Reading the order..." : "Generate Transformation Map"}
              </button>
              {error && <div style={{ marginTop: "10px", fontFamily: S.fontMono, fontSize: "12px", color: S.red }}>{error}</div>}
            </Card>

            {draft && (
              <div>
                <MapCard map={draft} onToggleEvent={() => {}} onToggleSave={() => {}} onDelete={() => {}} showActions={false} />
                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                  <button onClick={() => commitDraft(true)} style={{ ...smallBtn(true), flex: 1, padding: "12px", fontSize: "12px" }}>Save as Plan</button>
                  <button onClick={() => commitDraft(false)} style={{ ...smallBtn(false), flex: 1, padding: "12px", fontSize: "12px" }}>Keep in History Only</button>
                </div>
              </div>
            )}
          </div>
        )}

        {loaded && tab === "explore" && (
          <div>
            <Card style={{ marginBottom: "20px" }}>
              <p style={{ fontFamily: S.fontHead, fontSize: "16px", color: S.textMuted, lineHeight: 1.55, margin: "0 0 4px" }}>
                The same organizing intelligence runs through a seashell, a heartbeat, and a marriage. Pick one to
                see it read through the five layers - or read any subject of your own.
              </p>
            </Card>

            {EXPLORE_GROUPS.map((group) => (
              <div key={group} style={{ marginBottom: "18px" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: S.gold, marginBottom: "10px" }}>
                  {group}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {EXPLORE_EXAMPLES.filter((e) => e.group === group).map((ex) => {
                    const active = exploreSelected === ex.id;
                    return (
                      <button
                        key={ex.id}
                        onClick={() => setExploreSelected(ex.id)}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid " + (active ? S.gold : S.border),
                          background: active ? "rgba(251,191,36,0.10)" : "rgba(237,233,245,0.03)",
                          cursor: "pointer",
                          maxWidth: "220px",
                        }}
                      >
                        <div style={{ fontFamily: S.fontHead, fontSize: "16px", color: active ? S.gold : S.text }}>{ex.name}</div>
                        <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textFaint, marginTop: "2px" }}>{ex.blurb}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <Card style={{ marginTop: "8px", marginBottom: "20px" }}>
              {exploreSelected === "custom" ? (
                <div>
                  <div style={{ fontFamily: S.fontMono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.purple, marginBottom: "4px" }}>
                    Your subject
                  </div>
                  <div style={{ fontFamily: S.fontHead, fontSize: "20px", color: S.text, marginBottom: "16px" }}>{exploreSubject}</div>
                  <FiveLayerRead layers={exploreResult} />
                  <WorkflowSequence steps={exploreResult && exploreResult.workflow} />
                </div>
              ) : (
                (() => {
                  const ex = EXPLORE_EXAMPLES.find((e) => e.id === exploreSelected) || EXPLORE_EXAMPLES[0];
                  return (
                    <div>
                      <div style={{ fontFamily: S.fontMono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.purple, marginBottom: "4px" }}>
                        {ex.group}
                      </div>
                      <div style={{ fontFamily: S.fontHead, fontSize: "22px", color: S.text, marginBottom: "16px" }}>{ex.name}</div>
                      <FiveLayerRead layers={ex.layers} />
                      <WorkflowSequence steps={EXPLORE_WORKFLOWS[ex.id]} />
                    </div>
                  );
                })()
              )}
            </Card>

            <Card>
              <div style={{ fontFamily: S.fontMono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: S.textFaint, marginBottom: "10px" }}>
                Read your own subject
              </div>
              <input
                value={exploreInput}
                onChange={(e) => setExploreInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleExplore(); }}
                placeholder="A forest, a language, a startup, a friendship..."
                style={{ width: "100%", background: "rgba(237,233,245,0.03)", border: "1px solid " + S.border, borderRadius: "10px", padding: "12px 14px", color: S.text, fontFamily: S.fontHead, fontSize: "16px", boxSizing: "border-box" }}
              />
              <button
                onClick={handleExplore}
                disabled={exploreLoading || !exploreInput.trim()}
                style={{ marginTop: "12px", width: "100%", fontFamily: S.fontMono, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px", borderRadius: "10px", border: "1px solid " + S.gold, background: exploreLoading ? "rgba(251,191,36,0.08)" : "rgba(251,191,36,0.16)", color: S.gold, cursor: exploreLoading || !exploreInput.trim() ? "not-allowed" : "pointer" }}
              >
                {exploreLoading ? "Reading the order..." : "Read the Organizing Intelligence"}
              </button>
              {exploreError && <div style={{ marginTop: "10px", fontFamily: S.fontMono, fontSize: "12px", color: S.red }}>{exploreError}</div>}
            </Card>
          </div>
        )}

        {loaded && tab === "history" && (
          <div>
            {maps.length === 0 && <EmptyNote text="No maps generated yet. Start with an intention on the New Map tab." />}
            {maps.map((m) => (
              <div key={m.id} style={{ marginBottom: "16px" }}>
                <MapCard map={m} onToggleEvent={toggleEvent} onToggleSave={toggleSave} onDelete={deleteMap} showActions={true} />
              </div>
            ))}
          </div>
        )}

        {loaded && tab === "plans" && (
          <div>
            {savedMaps.length === 0 && <EmptyNote text="Nothing saved yet. Save a map from History or right after generating one." />}
            {savedMaps.map((m) => (
              <div key={m.id} style={{ marginBottom: "16px" }}>
                <MapCard map={m} onToggleEvent={toggleEvent} onToggleSave={toggleSave} onDelete={deleteMap} showActions={true} />
              </div>
            ))}
          </div>
        )}

        {loaded && tab === "reflect" && (
          <div>
            <Card style={{ marginBottom: "20px" }}>
              <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint, marginBottom: "8px" }}>Link to a plan (optional)</div>
              <select
                value={reflectionMapId}
                onChange={(e) => setReflectionMapId(e.target.value)}
                style={{ width: "100%", marginBottom: "12px", background: "rgba(237,233,245,0.03)", border: "1px solid " + S.border, borderRadius: "8px", padding: "10px", color: S.text, fontFamily: S.fontMono, fontSize: "12px" }}
              >
                <option value="">No specific plan</option>
                {maps.map((m) => (
                  <option key={m.id} value={m.id}>{m.input.slice(0, 60)}</option>
                ))}
              </select>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="What did you notice? What actually happened when you ran the workflow or the recommended rhythm?"
                rows={4}
                style={{ width: "100%", background: "rgba(237,233,245,0.03)", border: "1px solid " + S.border, borderRadius: "10px", padding: "12px 14px", color: S.text, fontFamily: S.fontHead, fontSize: "16px", resize: "vertical", boxSizing: "border-box" }}
              />
              <button onClick={addReflection} disabled={!reflectionText.trim()} style={{ ...smallBtn(true), marginTop: "10px", width: "100%", padding: "12px", fontSize: "12px" }}>Add to Reflection Log</button>
            </Card>

            {reflections.length === 0 && <EmptyNote text="No reflections logged yet." />}
            {reflections.map((r) => {
              const linked = maps.find((m) => m.id === r.mapId);
              return (
                <Card key={r.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint }}>{new Date(r.createdAt).toLocaleString()}</div>
                    <button onClick={() => deleteReflection(r.id)} style={smallBtn(false)}>Delete</button>
                  </div>
                  {linked && <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.purple, marginTop: "6px" }}>Re: {linked.input.slice(0, 60)}</div>}
                  <div style={{ fontFamily: S.fontHead, fontSize: "16px", marginTop: "8px", lineHeight: 1.5 }}>{r.text}</div>
                </Card>
              );
            })}
          </div>
        )}

        {loaded && tab === "review" && (
          <div>
            <Card style={{ marginBottom: "20px" }}>
              <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.gold, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>This week</div>
              <div style={{ fontFamily: S.fontHead, fontSize: "18px", marginBottom: "16px" }}>{weekLabel(currentWeekKey)}</div>

              <ReviewField label="What event did you execute?" value={reviewDraft.eventExecuted} onChange={(v) => setReviewDraft({ ...reviewDraft, eventExecuted: v })} />
              <ReviewField label="What outcome did it produce?" value={reviewDraft.outcomeProduced} onChange={(v) => setReviewDraft({ ...reviewDraft, outcomeProduced: v })} />

              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint, marginBottom: "6px" }}>Did the outcome confirm alignment or reveal misalignment?</div>
                <select
                  value={reviewDraft.alignmentCheck}
                  onChange={(e) => setReviewDraft({ ...reviewDraft, alignmentCheck: e.target.value })}
                  style={{ width: "100%", background: "rgba(237,233,245,0.03)", border: "1px solid " + S.border, borderRadius: "8px", padding: "10px", color: S.text, fontFamily: S.fontMono, fontSize: "12px" }}
                >
                  <option value="">Not yet determined</option>
                  <option value="Confirmed alignment">Confirmed alignment</option>
                  <option value="Revealed misalignment">Revealed misalignment</option>
                </select>
              </div>

              <ReviewField label="What pattern is repeating?" value={reviewDraft.patternRepeating} onChange={(v) => setReviewDraft({ ...reviewDraft, patternRepeating: v })} />
              <ReviewField label="What rhythm needs correction?" value={reviewDraft.rhythmCorrection} onChange={(v) => setReviewDraft({ ...reviewDraft, rhythmCorrection: v })} />
              <ReviewField label="What is the next event?" value={reviewDraft.nextEvent} onChange={(v) => setReviewDraft({ ...reviewDraft, nextEvent: v })} />

              <button onClick={submitReview} style={{ ...smallBtn(true), marginTop: "6px", width: "100%", padding: "12px", fontSize: "12px" }}>
                {currentWeekReview ? "Update This Week's Review" : "Submit Weekly Review"}
              </button>
            </Card>

            {pastReviews.length === 0 && <EmptyNote text="No past weekly reviews yet." />}
            {pastReviews.map((r) => (
              <Card key={r.id} style={{ marginBottom: "12px" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint, marginBottom: "10px" }}>{weekLabel(r.weekKey)}</div>
                <ReviewRow label="Event executed" text={r.eventExecuted} />
                <ReviewRow label="Outcome produced" text={r.outcomeProduced} />
                <ReviewRow label="Alignment check" text={r.alignmentCheck} />
                <ReviewRow label="Pattern repeating" text={r.patternRepeating} />
                <ReviewRow label="Rhythm correction" text={r.rhythmCorrection} />
                <ReviewRow label="Next event" text={r.nextEvent} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textFaint, marginBottom: "6px" }}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        style={{ width: "100%", background: "rgba(237,233,245,0.03)", border: "1px solid " + S.border, borderRadius: "8px", padding: "10px 12px", color: S.text, fontFamily: S.fontHead, fontSize: "15px", resize: "vertical", boxSizing: "border-box" }}
      />
    </div>
  );
}

function ReviewRow({ label, text }) {
  if (!text) return null;
  return (
    <div style={{ marginBottom: "8px" }}>
      <span style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}: </span>
      <span style={{ fontFamily: S.fontHead, fontSize: "15px" }}>{text}</span>
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <div style={{ fontFamily: S.fontMono, fontSize: "12px", color: S.textFaint, textAlign: "center", padding: "40px 20px", border: "1px dashed " + S.border, borderRadius: "12px" }}>
      {text}
    </div>
  );
}
