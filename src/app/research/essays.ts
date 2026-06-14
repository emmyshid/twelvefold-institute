// ════════════════════════════════════════════════════════════════
// Research essays — seed content (Option A: hardcoded).
//
// This is the single source of truth for /research articles. The list
// page and the [slug] detail page both import from here. When/if this
// graduates to a database (research_articles table), only this file is
// replaced — the page components consume the same Essay shape.
//
// Each essay body is an array of blocks so the detail page can render
// headings, paragraphs, and pull-quotes without a markdown parser.
// ════════════════════════════════════════════════════════════════

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export interface Essay {
  slug: string;
  title: string;
  dek: string; // one-line summary
  category: string;
  readingTime: string;
  publishedLabel: string; // human label, not a hard date — these are evergreen
  body: Block[];
}

export const ESSAYS: Essay[] = [
  {
    slug: "patterns-are-curriculum-not-pathology",
    title: "Patterns Are Curriculum, Not Pathology",
    dek: "Reframing what keeps happening as a teaching, not a flaw.",
    category: "Foundations",
    readingTime: "6 min",
    publishedLabel: "Foundational essay",
    body: [
      { type: "p", text: "There is a particular kind of suffering that comes from believing something is wrong with you. You notice a pattern — the relationships that end the same way, the projects abandoned at the same stage, the conflicts that arrive on schedule — and the modern instinct is to treat it as a defect. A bug in your wiring. Something to be fixed, medicated, optimized, or willed away." },
      { type: "p", text: "Pattern Literacy begins from a different premise: that a recurring pattern is not a flaw to be eliminated but a curriculum to be learned. The pattern keeps returning not because you are broken, but because there is a lesson inside it that has not yet been completed." },
      { type: "quote", text: "The pattern repeats because the teaching inside it has not yet been received." },
      { type: "h2", text: "The difference this reframe makes" },
      { type: "p", text: "Pathology asks: what is wrong with me, and how do I get rid of it? Curriculum asks: what is this teaching me, and how do I cooperate with it? These are not the same question, and they do not lead to the same place." },
      { type: "p", text: "When you treat a pattern as pathology, you fight it. You bring willpower, shame, and force. And because the pattern is structural — woven into how you move through time — fighting it tends to entrench it. The harder you push against the phase you are in, the more reliably it reasserts itself." },
      { type: "p", text: "When you treat a pattern as curriculum, you can become a student of it. You can ask what it is for. You can notice that the same situation arriving again is not evidence of failure but an invitation to learn the thing you did not learn last time. The pattern is patient. It will keep offering the lesson until you take it." },
      { type: "h2", text: "This is not toxic positivity" },
      { type: "p", text: "Reframing a pattern as curriculum does not mean pretending difficulty is good, or that pain is secretly a gift you should be grateful for. Some patterns carry real loss. The point is not to feel better about what keeps happening. The point is to stop misdiagnosing it." },
      { type: "p", text: "A pattern misdiagnosed as pathology generates a war you cannot win, because you are fighting the structure of your own movement through time. A pattern correctly read as curriculum generates a question you can actually answer — and answering it is what lets the pattern complete and release." },
      { type: "p", text: "This is the philosophical core of the entire framework. Everything else — the twelve phases, the four micro-states, the readings, the practice — is built on this single reframe. What keeps happening is not happening to you. It is teaching you. The work is learning to read what it teaches." },
    ],
  },
  {
    slug: "why-six-traditions-converge",
    title: "Why Six Traditions Converge on the Same Structure",
    dek: "On independent discovery and the shape of transformation.",
    category: "The Traditions",
    readingTime: "7 min",
    publishedLabel: "On the convergence claim",
    body: [
      { type: "p", text: "Six wisdom traditions — Ifá in West Africa, Kabbalah in the Jewish world, the I Ching in China, the wisdom literature of scripture, Buddhism across Asia, and Hermetic philosophy in the Western esoteric line — developed largely without contact, across different continents and millennia. They use incompatible cosmologies. They disagree about gods, the afterlife, the self, and the ultimate aim of a human life." },
      { type: "p", text: "And yet, on one thing, they substantially agree: that human experience moves in structured, recognizable patterns, that each phase of a cycle carries its own distinct teaching, and that wisdom consists in cooperating with the phase rather than overriding it." },
      { type: "quote", text: "When traditions this different agree on the structure, the structure is not invented. It is recognized." },
      { type: "h2", text: "What convergence does and doesn't prove" },
      { type: "p", text: "It is tempting to overclaim here, so let us be precise. The convergence of six traditions on a structural insight does not prove the insight is metaphysically true. It does not prove any particular cosmology. It does not make the traditions interchangeable — they are not different names for the same religion." },
      { type: "p", text: "What it does suggest is that the structure these traditions point to is a real feature of human experience rather than a cultural artifact. When unconnected observers, using entirely different conceptual tools, keep mapping the same territory, the most economical explanation is that the territory is there." },
      { type: "h2", text: "The honest version of the claim" },
      { type: "p", text: "Twelvefold's framework organizes this shared recognition into a single map of twelve phases and four micro-states. This organizing scheme is our interpretive contribution — the traditions themselves do not natively agree on twelve phases. Ifá has 256 odu, the I Ching has 64 hexagrams, Kabbalah has ten Sefirot. What they agree on is not the number. It is the existence of structured, phased transformation, each phase asking something specific of the person inside it." },
      { type: "p", text: "We translate; we do not invent. The traditions recognized the patterns independently. We built a usable map from what they recognized, and we hold each tradition with respect rather than flattening their genuine differences into a single mush. The convergence is the evidence. The map is the tool. Keeping those two things distinct is what makes the claim honest." },
    ],
  },
  {
    slug: "the-case-against-self-improvement",
    title: "The Case Against Self-Improvement",
    dek: "Why willpower fights the phase instead of cooperating with it.",
    category: "Practice",
    readingTime: "6 min",
    publishedLabel: "On aligned action",
    body: [
      { type: "p", text: "The self-improvement industry runs on a single assumption: that you are a project to be optimized, and that with enough discipline, the right system, and sufficient willpower, you can force yourself into a better version of you. It is an assumption so common it rarely gets examined." },
      { type: "p", text: "Pattern Literacy questions it directly. Not because effort is bad, or because growth is an illusion, but because willpower applied against the phase you are actually in tends to produce exhaustion, not change." },
      { type: "quote", text: "Most failed self-improvement is not a failure of willpower. It is a failure of timing." },
      { type: "h2", text: "The phase you are in is asking for something specific" },
      { type: "p", text: "Every phase carries its own question. A phase of foundation asks for return and repetition. A phase of dissolution asks you to let something end. A phase of ignition asks you to begin before you feel ready. These are not interchangeable demands." },
      { type: "p", text: "The self-improvement instinct ignores phase entirely. It applies the same prescription — more discipline, more optimization, more pushing — regardless of what the moment is actually asking. So you find yourself trying to build when the phase wants you to release, trying to push forward when the phase wants you to rest, trying to hold on when the phase wants you to let go. The effort is real. It is simply pointed in the wrong direction." },
      { type: "h2", text: "Aligned action instead" },
      { type: "p", text: "The alternative is not passivity. It is aligned action: doing what the phase is actually asking, in real circumstances, while remaining yourself. This often requires more from you than brute optimization, not less — because it requires first reading where you are, which is harder than simply pushing harder." },
      { type: "p", text: "A person in a phase of dissolution who stops trying to rebuild and instead allows the ending to complete is not giving up. They are cooperating with the curriculum. And cooperation, it turns out, moves you through a phase far faster than resistance ever does. The phase completes when its lesson lands — not when you have white-knuckled your way past it." },
      { type: "p", text: "This is the case against self-improvement: not that you cannot change, but that change does not come from forcing yourself against the grain of the moment. It comes from reading the moment correctly and acting with it." },
    ],
  },
  {
    slug: "timing-is-not-a-metaphor",
    title: "Timing Is Not a Metaphor",
    dek: "What the solar year actually tells us about cycles.",
    category: "The Framework",
    readingTime: "5 min",
    publishedLabel: "On the framework's structure",
    body: [
      { type: "p", text: "When people first encounter a framework organized around twelve phases named for the zodiac, they often assume it is astrology — that it claims the planets are exerting some force on your life. It does not claim that. The relationship between the framework and the solar year is more concrete and less mystical than that assumption suggests." },
      { type: "p", text: "The twelve phases correspond to a real structure: twelve lunar cycles per solar year. This is astronomical fact, not belief. The year has a shape, and that shape has twelve parts. The framework borrows the zodiacal names because they have traveled furthest into common language — but it borrows them as labels for cycles, not as claims about planetary influence." },
      { type: "quote", text: "The names are borrowed. The cycles are real. The two should not be confused." },
      { type: "h2", text: "Why a structure, and why twelve" },
      { type: "p", text: "A framework needs an organizing structure, and the twelvefold division of the solar year is one that nearly every culture independently arrived at, because it is grounded in something observable: the moon's cycle against the sun's. Twelve is not arbitrary, and it is not ours. It is inherited from the oldest shared timekeeping humans have." },
      { type: "p", text: "What is ours — Twelvefold's actual structural contribution — is the four micro-states within each phase: Initiation, Expansion, Contraction, Integration. This is the framework's specific addition, the distillation of how any single phase moves internally from beginning to completion." },
      { type: "h2", text: "Timing as a literal claim" },
      { type: "p", text: "So when the framework says timing matters, it is not using timing as a poetic flourish. It is making a literal claim: that human transformation has phases, that those phases have a structure as real as the structure of the year, and that knowing which phase you are in changes what action will actually work." },
      { type: "p", text: "You would not plant in winter and expect a harvest. You would not expect the work of beginning to succeed during a phase that is asking you to end. Timing is not a metaphor for being thoughtful about when you act. It is a structural feature of how change moves — and reading it correctly is the difference between effort that lands and effort that scatters." },
    ],
  },
];

export function getEssay(slug: string): Essay | undefined {
  return ESSAYS.find((e) => e.slug === slug);
}
