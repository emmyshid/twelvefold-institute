"use client";

import { useState } from "react";
import PatternMastery from "./PatternMastery";
import UniversalStructures from "./UniversalStructures";
import CoordinateReading from "@/components/CoordinateReading";

// ════════════════════════════════════════════════════════════════
// PATTERN LITERACY CERTIFICATION APP v1
// Twelvefold Institute — Practitioner Training Platform
// Stack: React 18 + Vite (local deployment)
// Storage: localStorage
// AI: Anthropic API (Claude) for diagnostics
// ════════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(255,255,255,0.07)",
  bgInput: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderFocus: "rgba(167,139,250,0.5)",
  text: "#E8E4F0",
  textDim: "rgba(255,255,255,0.5)",
  textMuted: "rgba(255,255,255,0.35)",
  accent: "#A78BFA",
  accentDark: "#7C3AED",
  gold: "#FBBF24",
  goldDim: "rgba(251,191,36,0.15)",
  success: "#6BCB77",
  warn: "#FFD93D",
  danger: "#FF6B6B",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  glass: "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);",
  radius: "16px",
  radiusSm: "10px",
  shadow: "0 8px 32px rgba(0,0,0,0.4)",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

// ─── STORAGE KEYS ────────────────────────────────────────────
const KEYS = {
  user: "plc-user",
  progress: "plc-progress",
  exercises: "plc-exercises",
  orgs: "plc-organizations",
  plans: "plc-action-plans",
};

// Storage: real localStorage when in a browser, in-memory fallback when not.
// Original was in-memory only (built for Claude artifacts). On the real
// website we want progress to survive page refresh, so we layer
// localStorage on top with a graceful fallback for SSR/sandboxed contexts.
const _mem = {};
const load = (key, fallback) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    }
    return _mem[key] !== undefined ? _mem[key] : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  _mem[key] = val;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  } catch {}
};

// ─── MODULE CONTENT ──────────────────────────────────────────
// Module 1 is fully embedded. Modules 2-6 have structure + summaries.

const MODULES = [
  {
    id: "m1", number: 1, title: "Foundation",
    subtitle: "What Pattern Literacy Is & How It Works",
    hours: "2-3 hours", icon: "◈",
    color: "#A78BFA",
    description: "Learn the framework: 12 phases, 4 micro-states, 6 wisdom traditions, and how to identify your organization's current phase.",
    lessons: [
      {
        id: "m1-l1", title: "What Is Pattern Literacy?",
        duration: "20 min",
        content: [
          { type: "heading", text: "Pattern Literacy Is a Practice" },
          { type: "text", text: "Pattern Literacy is the ability to recognize, understand, and cooperate with the intelligent cycles governing organizational life. It is not a theory to be debated. It is a practice to be developed." },
          { type: "text", text: "Every organization moves through predictable phases of development. These phases are not random. They are intelligent. Each one carries specific curriculum — specific lessons that the organization must learn before it can move to the next phase." },
          { type: "text", text: "When leaders understand what phase their organization is in, they stop fighting reality and start cooperating with it. Decisions become clearer. Conflicts make sense. Growth becomes natural." },
          { type: "highlight", text: "Pattern Literacy is the difference between leading blind and leading with sight." },
          { type: "heading", text: "Organizations as Living Systems" },
          { type: "text", text: "Organizations are not machines. They are living systems. They grow, plateau, transform, and renew — just like people, seasons, and ecosystems." },
          { type: "text", text: "A 2-year-old church faces different challenges than a 10-year-old church. A startup in year 1 needs different leadership than a company in year 15. This isn't because the leaders are different — it's because the organization itself is in a different phase of its development." },
          { type: "text", text: "Pattern Literacy gives you the map. It tells you where you are, what's being asked of you, and what comes next." },
          { type: "heading", text: "Curriculum, Not Pathology" },
          { type: "text", text: "The most important principle: Patterns are curriculum, not pathology. When your organization hits a wall, it's not broken. It's being taught something." },
          { type: "text", text: "A plateau at year 4 is not failure — it's the Cancer phase asking for authenticity. Conflict at year 10 is not dysfunction — it's the Scorpio phase asking for transformation. Low energy at year 17 is not death — it's the Pisces phase asking for integration and renewal." },
          { type: "highlight", text: "Every challenge your organization faces is an invitation to learn what this phase is teaching." },
        ],
        exercise: {
          id: "ex-m1-l1",
          title: "Your First Reflection",
          prompt: "Think about your organization right now. What challenge or frustration are you facing? Write it down. Then ask: What if this challenge isn't a problem to be solved, but a lesson to be learned? What might the lesson be?",
          type: "longtext",
        },
      },
      {
        id: "m1-l2", title: "The 12 Universal Phases",
        duration: "25 min",
        content: [
          { type: "heading", text: "12 Phases of Organizational Life" },
          { type: "text", text: "Every organization moves through 12 distinct phases over an approximately 19-year cycle. Each phase has its own curriculum, its own leadership demands, and its own common mistakes." },
          { type: "text", text: "The phases follow a natural progression — from founding energy through building, learning, deepening, leading, refining, balancing, transforming, expanding, structuring, innovating, and completing. Then the cycle spirals upward and begins again at a higher level." },
          { type: "phases", text: "" },
          { type: "heading", text: "The Arc of Development" },
          { type: "text", text: "The first three phases (Aries, Taurus, Gemini) are the founding phases. Energy is high, systems are being built, identity is forming." },
          { type: "text", text: "The middle phases (Cancer, Leo, Virgo) are the deepening phases. The organization goes inward, claims its authority, and refines its quality." },
          { type: "text", text: "The later phases (Libra through Sagittarius) are the mature phases. Integration, transformation, and expansion happen here." },
          { type: "text", text: "The final phases (Capricorn, Aquarius, Pisces) are the completion phases. Structure, innovation, and renewal prepare the organization for its next cycle." },
          { type: "highlight", text: "The cycle spirals upward. Aries 2.0 is not the same as Aries 1.0. The organization carries all the wisdom from its first cycle into the next." },
        ],
        exercise: {
          id: "ex-m1-l2",
          title: "Phase Identification (Initial)",
          prompt: "Based on what you've learned, which phase do you think your organization is in? Why? What evidence do you see? (Don't worry about being precise — we'll refine this throughout the program.)",
          type: "longtext",
        },
      },
      {
        id: "m1-l3", title: "The 4 Micro-States",
        duration: "15 min",
        content: [
          { type: "heading", text: "Every Phase Has Four Movements" },
          { type: "text", text: "Within each of the 12 phases, there are four micro-states that describe how the phase unfolds. These micro-states are the heartbeat of the framework." },
          { type: "microstates", text: "" },
          { type: "text", text: "Initiation is the whisper. The phase begins. Something new appears. Pay attention." },
          { type: "text", text: "Expansion is the momentum. Energy builds. Things accelerate. The phase's teaching becomes clear." },
          { type: "text", text: "Contraction is the test. Reality pushes back. You face obstacles. The phase's lesson gets harder before it gets easier." },
          { type: "text", text: "Integration is the landing. The lesson has been learned. A new baseline is established. You're ready for what's next." },
          { type: "highlight", text: "12 phases × 4 micro-states = 48 distinct pattern states. Each one carries specific wisdom from six traditions." },
        ],
        exercise: {
          id: "ex-m1-l3",
          title: "Micro-State Awareness",
          prompt: "Within the phase you identified, which micro-state do you think your organization is in? Are you just beginning (Initiation)? Building momentum (Expansion)? Facing resistance (Contraction)? Landing the lesson (Integration)?",
          type: "longtext",
        },
      },
      {
        id: "m1-l4", title: "The 6 Wisdom Traditions",
        duration: "20 min",
        content: [
          { type: "heading", text: "Six Traditions, One Intelligence" },
          { type: "text", text: "Pattern Literacy draws on six wisdom traditions that independently recognized the same archetypal qualities of transformation. These traditions are not blended or flattened. Each is honored on its own terms." },
          { type: "traditions", text: "" },
          { type: "text", text: "Ifá (West African) brings the understanding of destiny, character, and alignment with cosmic order. Kabbalah (Jewish mysticism) brings the map of emanation and return — how the divine manifests in the world. The I Ching (Chinese wisdom) brings the understanding of change itself — how situations transform through natural law." },
          { type: "text", text: "Scripture (Judeo-Christian) brings narrative wisdom — stories that encode the phases of human and communal development. Buddhism brings the psychology of suffering and liberation — how to work skillfully with what arises. Hermetic philosophy brings the principle of correspondence — as above, so below; as within, so without." },
          { type: "highlight", text: "These traditions are not appropriated. They are consulted with respect. Each tradition has its own integrity. Pattern Literacy creates a meeting place where their insights illuminate each other." },
        ],
        exercise: {
          id: "ex-m1-l4",
          title: "Tradition Resonance",
          prompt: "Which of the six traditions resonates most with your experience? Why? How does that tradition's lens help you understand what your organization is going through?",
          type: "longtext",
        },
      },
      {
        id: "m1-l5", title: "The Diagnostic Framework",
        duration: "20 min",
        content: [
          { type: "heading", text: "Four Questions That Reveal Your Phase" },
          { type: "text", text: "Accurate diagnosis is the foundation of Pattern Literacy practice. You cannot cooperate with a phase you haven't identified. These four questions form the diagnostic core:" },
          { type: "heading", text: "1. What is the organizational energy right now?" },
          { type: "text", text: "Is energy high (founding/expansion phases)? Low (deepening/completion phases)? Chaotic (transformation phases)? Steady (structure phases)? Energy tells you where you are in the cycle." },
          { type: "heading", text: "2. What are the primary challenges?" },
          { type: "text", text: "Each phase has characteristic challenges. Systems problems point to Taurus/Virgo. Identity questions point to Gemini/Cancer. Growth challenges point to Leo/Sagittarius. Structural issues point to Capricorn." },
          { type: "heading", text: "3. How long have you been here?" },
          { type: "text", text: "Timing matters. A 2-year-old organization is likely in Taurus. A 5-year-old organization in Cancer. A 12-year-old organization in Sagittarius. Timeline narrows the possibilities significantly." },
          { type: "heading", text: "4. What is your gut telling you?" },
          { type: "text", text: "Leaders often sense their phase intuitively. They say things like 'We need to go deeper' (Cancer), 'We need to get organized' (Virgo), 'Something needs to change fundamentally' (Scorpio). Trust the intuition." },
          { type: "highlight", text: "These four questions — energy, challenges, timing, intuition — will guide your diagnostic practice throughout this program." },
        ],
        exercise: {
          id: "ex-m1-l5",
          title: "Your Diagnostic Practice",
          prompt: "Apply the four diagnostic questions to your organization:\n\n1. What is the energy right now? (High, low, chaotic, steady?)\n2. What are the primary challenges? (Systems, identity, growth, structure?)\n3. How long has your organization existed?\n4. What is your gut telling you about where you are?\n\nBased on your answers, what phase do you think you're in? Has your answer changed since Lesson 2?",
          type: "longtext",
        },
      },
      {
        id: "m1-l6", title: "Decision-Making by Phase",
        duration: "15 min",
        content: [
          { type: "heading", text: "Every Phase Has Its Own Decision Framework" },
          { type: "text", text: "One of the most practical applications of Pattern Literacy is decision-making. When you know your phase, you know what questions to ask before making any significant decision." },
          { type: "text", text: "In Aries, ask: Does this align with the vision? In Taurus, ask: Does this serve sustainability? In Gemini, ask: What is this teaching us? In Cancer, ask: Is this authentic? In Leo, ask: Does this multiply impact? In Virgo, ask: Does this improve quality?" },
          { type: "text", text: "In Libra, ask: Does this serve the whole? In Scorpio, ask: What needs to die? In Sagittarius, ask: Does this expand our reach with integrity? In Capricorn, ask: Will this last? In Aquarius, ask: What's trying to be born? In Pisces, ask: What is the teaching?" },
          { type: "highlight", text: "Phase-aligned decisions are faster, clearer, and more effective. You stop second-guessing because you know what the phase is asking." },
          { type: "heading", text: "Completing Module 1" },
          { type: "text", text: "You now have the foundation: 12 phases, 4 micro-states, 6 wisdom traditions, the diagnostic framework, and decision-making by phase." },
          { type: "text", text: "In Module 2, you'll go deep into each phase — learning the specific curriculum, leadership tasks, common mistakes, and transition indicators for all 12 phases. That's where the real depth begins." },
        ],
        exercise: {
          id: "ex-m1-l6",
          title: "Your Phase-Aligned Decision",
          prompt: "Think of a decision your organization is currently facing. Based on the phase you've identified, what question should you be asking? Write the decision, the phase, the question, and your initial answer.",
          type: "longtext",
        },
      },
    ],
  },
  {
    id: "m2", number: 2, title: "The 12 Phases Deep Dive",
    subtitle: "Curriculum, Leadership & Mistakes for Every Phase",
    hours: "12 hours (4 sessions)", icon: "◉",
    color: "#7C3AED",
    description: "Deep dive into all 12 phases. Learn the specific curriculum, leadership tasks, common mistakes, wisdom tradition teachings, and transition indicators for each phase.",
    lessons: [
      { id: "m2-s1", title: "Session 1: Aries, Taurus, Gemini", duration: "3 hours", content: [{ type: "text", text: "Deep dive into the founding phases. Each phase explored with: overview, curriculum, characteristics, leadership tasks, common mistakes, wisdom traditions, decision framework, and transition indicators." }], exercise: { id: "ex-m2-s1", title: "Founding Phase Analysis", prompt: "Analyze your organization's founding phase. What was the Aries vision? How were Taurus systems built? What did Gemini teach you about identity?", type: "longtext" } },
      { id: "m2-s2", title: "Session 2: Cancer, Leo, Virgo", duration: "3 hours", content: [{ type: "text", text: "Deep dive into the deepening phases. Cancer asks for authenticity. Leo asks for authority. Virgo asks for precision. Each explored in full detail with exercises." }], exercise: { id: "ex-m2-s2", title: "Deepening Phase Analysis", prompt: "If your organization is in Cancer, Leo, or Virgo — what is the specific work being asked? If you're past these phases, what was the learning?", type: "longtext" } },
      { id: "m2-s3", title: "Session 3: Libra, Scorpio, Sagittarius", duration: "3 hours", content: [{ type: "text", text: "Deep dive into the mature phases. Libra balances. Scorpio transforms. Sagittarius expands. Each explored in full detail with organizational case studies." }], exercise: { id: "ex-m2-s3", title: "Mature Phase Analysis", prompt: "How does your organization handle polarities (Libra)? What has died or needs to die (Scorpio)? What is your distinctive teaching (Sagittarius)?", type: "longtext" } },
      { id: "m2-s4", title: "Session 4: Capricorn, Aquarius, Pisces", duration: "3 hours", content: [{ type: "text", text: "Deep dive into the completion phases. Capricorn structures. Aquarius innovates. Pisces completes. Each explored in full detail with exercises on long-term thinking." }], exercise: { id: "ex-m2-s4", title: "Completion Phase Analysis", prompt: "What are you building for generations (Capricorn)? What new wants to be born (Aquarius)? What wisdom have you gained (Pisces)?", type: "longtext" } },
    ],
  },
  {
    id: "m3", number: 3, title: "Diagnostic & Assessment",
    subtitle: "Accurately Identifying Organizational Phases",
    hours: "3 hours", icon: "◎",
    color: "#6BCB77",
    description: "Master the diagnostic process. Learn to assess organizations accurately using energy signals, challenge patterns, timing analysis, and intuitive reading.",
    lessons: [
      { id: "m3-l1", title: "The Diagnostic Process", duration: "45 min", content: [{ type: "text", text: "Comprehensive diagnostic methodology. How to gather information, ask the right questions, read organizational energy, and identify phase with high confidence." }], exercise: { id: "ex-m3-l1", title: "Diagnostic Practice", prompt: "Practice the full diagnostic process on your organization. Document your findings.", type: "longtext" } },
      { id: "m3-l2", title: "Common Misdiagnoses", duration: "45 min", content: [{ type: "text", text: "Where practitioners get it wrong. Cancer vs. depression. Virgo vs. Capricorn. Scorpio vs. crisis. How to refine your assessment." }], exercise: { id: "ex-m3-l2", title: "Misdiagnosis Check", prompt: "Review your diagnosis. Could you be wrong? What would change if you shifted one phase forward or back?", type: "longtext" } },
      { id: "m3-l3", title: "Case Study Practice", duration: "90 min", content: [{ type: "text", text: "Three detailed organizational scenarios. Practice diagnosing each one. Compare your assessment with expert analysis." }], exercise: { id: "ex-m3-l3", title: "Case Study Diagnosis", prompt: "Diagnose the provided case study. Identify the phase, explain your reasoning, and recommend next steps.", type: "longtext" } },
    ],
  },
  {
    id: "m4", number: 4, title: "Leadership & Decision-Making",
    subtitle: "Leading Through Phases with Aligned Action",
    hours: "4 hours", icon: "◆",
    color: "#FBBF24",
    description: "Develop phase-aligned leadership capacities. Learn decision frameworks, study real leadership cases, and build your own leadership development plan.",
    lessons: [
      { id: "m4-l1", title: "Phase-Aligned Leadership", duration: "60 min", content: [{ type: "text", text: "What leadership looks like in each phase. The capacities required, the common traps, and how to develop what's needed." }], exercise: { id: "ex-m4-l1", title: "Leadership Self-Assessment", prompt: "Rate your leadership capacities for your current phase. Where are you strong? Where do you need to develop?", type: "longtext" } },
      { id: "m4-l2", title: "Decision Frameworks in Practice", duration: "60 min", content: [{ type: "text", text: "Applied decision-making. Real scenarios where phase-aligned frameworks clarify complex choices." }], exercise: { id: "ex-m4-l2", title: "Real Decision Analysis", prompt: "Apply your phase's decision framework to a real decision you're facing. Document the process and outcome.", type: "longtext" } },
      { id: "m4-l3", title: "Leadership Case Studies", duration: "60 min", content: [{ type: "text", text: "Four detailed case studies of leaders navigating phase transitions. What worked, what didn't, and why." }], exercise: { id: "ex-m4-l3", title: "Case Study Analysis", prompt: "Analyze the leadership case study. What would you do differently? What would you preserve?", type: "longtext" } },
      { id: "m4-l4", title: "Your Leadership Plan", duration: "60 min", content: [{ type: "text", text: "Create your personal leadership development plan based on your phase and your capacities." }], exercise: { id: "ex-m4-l4", title: "Leadership Development Plan", prompt: "Create your leadership development plan. What capacities will you develop? How? By when?", type: "longtext" } },
    ],
  },
  {
    id: "m5", number: 5, title: "Communication & Culture",
    subtitle: "Explaining Phases & Building Aligned Culture",
    hours: "3 hours", icon: "◇",
    color: "#FF6B6B",
    description: "Learn to communicate organizational phases to your community. Build culture that supports the current phase's work. Manage transitions with clarity.",
    lessons: [
      { id: "m5-l1", title: "Communicating Your Phase", duration: "60 min", content: [{ type: "text", text: "How to explain what phase your organization is in. Language that works for different audiences. Sample communications." }], exercise: { id: "ex-m5-l1", title: "Draft Communication", prompt: "Draft a communication to your organization explaining your current phase and what it's asking. Write for your actual audience.", type: "longtext" } },
      { id: "m5-l2", title: "Building Phase-Aligned Culture", duration: "60 min", content: [{ type: "text", text: "Cultural practices that support each phase. Rituals, rhythms, and structures that align organizational culture with the current curriculum." }], exercise: { id: "ex-m5-l2", title: "Culture Plan", prompt: "Design 3 cultural practices that would support your organization's current phase. Be specific about what, when, and how.", type: "longtext" } },
      { id: "m5-l3", title: "Managing Transitions", duration: "60 min", content: [{ type: "text", text: "How to help people understand when the phase is changing. Managing resistance. Supporting people through transitions." }], exercise: { id: "ex-m5-l3", title: "Transition Plan", prompt: "If your organization is approaching a phase transition, plan how you'll communicate it. What will people feel? How will you support them?", type: "longtext" } },
    ],
  },
  {
    id: "m6", number: 6, title: "Practicum",
    subtitle: "Real-World Application & Certification",
    hours: "8 hours (split sessions)", icon: "★",
    color: "#E879F9",
    description: "Apply everything to a real organization. Complete full diagnostic, build an action plan, receive peer feedback, and earn your Pattern Literacy certification.",
    lessons: [
      { id: "m6-l1", title: "Full Organizational Diagnostic", duration: "3 hours", content: [{ type: "text", text: "Complete a full diagnostic on a real organization. Identify the phase, the curriculum, the leadership needs, and the common mistakes to avoid." }], exercise: { id: "ex-m6-l1", title: "Full Diagnostic Report", prompt: "Complete a full diagnostic report for your organization. Include: phase identification, confidence level, evidence, curriculum, leadership assessment, and recommended next steps.", type: "longtext" } },
      { id: "m6-l2", title: "Action Plan Development", duration: "3 hours", content: [{ type: "text", text: "Build a complete 6-12 month action plan aligned with your organization's phase. Set goals, assign owners, define timelines, and identify resources." }], exercise: { id: "ex-m6-l2", title: "Action Plan", prompt: "Create your complete action plan. Include: 3-5 focus areas from your phase's curriculum, SMART goals for each, owners, timelines, and resources needed.", type: "longtext" } },
      { id: "m6-l3", title: "Peer Feedback & Certification", duration: "2 hours", content: [{ type: "text", text: "Share your diagnostic and action plan with peers. Receive and give feedback. Complete certification requirements." }], exercise: { id: "ex-m6-l3", title: "Certification Reflection", prompt: "Reflect on your learning journey through all 6 modules. What has changed in how you see your organization? What will you do differently? What's your commitment going forward?", type: "longtext" } },
    ],
  },
];

const PHASES_OVERVIEW = [
  { name: "Aries", felt: "Sparking", years: "0-1", color: "#FF6B6B", icon: "↗", ask: "Ignite the vision, gather founding community" },
  { name: "Taurus", felt: "Building", years: "1-2", color: "#6BCB77", icon: "▣", ask: "Build systems, establish sustainable rhythm" },
  { name: "Gemini", felt: "Learning", years: "2-3", color: "#FFD93D", icon: "◇", ask: "Test, experiment, discover true identity" },
  { name: "Cancer", felt: "Feeling", years: "3-5", color: "#4ECDC4", icon: "◑", ask: "Get real, go deeper, face shadows" },
  { name: "Leo", felt: "Expressing", years: "5-7", color: "#FF8C42", icon: "☀", ask: "Own authority, be visible, multiply" },
  { name: "Virgo", felt: "Refining", years: "6-8", color: "#95E1D3", icon: "◈", ask: "Fix, document, train to excellence" },
  { name: "Libra", felt: "Relating", years: "7-9", color: "#DDA0DD", icon: "⚖", ask: "Balance polarities, integrate, harmonize" },
  { name: "Scorpio", felt: "Transforming", years: "9-11", color: "#8B0000", icon: "♦", ask: "Let go, transform, surrender" },
  { name: "Sagittarius", felt: "Reaching", years: "11-13", color: "#9B59B6", icon: "➤", ask: "Expand, teach, multiply reach" },
  { name: "Capricorn", felt: "Constructing", years: "13-15", color: "#5D6D7E", icon: "▲", ask: "Build governance, think in decades" },
  { name: "Aquarius", felt: "Liberating", years: "15-17", color: "#00BCD4", icon: "⚡", ask: "Innovate, evolve, invite new voices" },
  { name: "Pisces", felt: "Dissolving", years: "17-19", color: "#7B68EE", icon: "≋", ask: "Integrate wisdom, complete, prepare renewal" },
];

const MICRO_STATES = [
  { name: "Initiation", desc: "The whisper. Something new appears.", color: "#A78BFA", width: "15%" },
  { name: "Expansion", desc: "Momentum builds. Energy floods.", color: "#6BCB77", width: "35%" },
  { name: "Contraction", desc: "Reality pushes back. The test.", color: "#FF6B6B", width: "35%" },
  { name: "Integration", desc: "The lesson lands. New baseline.", color: "#FBBF24", width: "15%" },
];

const TRADITIONS = [
  { name: "Ifá", origin: "West Africa", icon: "◉", desc: "Destiny, character, alignment with cosmic order" },
  { name: "Kabbalah", origin: "Jewish Mysticism", icon: "✡", desc: "Emanation and return — divine manifestation" },
  { name: "I Ching", origin: "Chinese Wisdom", icon: "☰", desc: "The nature of change through natural law" },
  { name: "Scripture", origin: "Judeo-Christian", icon: "✝", desc: "Narrative wisdom encoding communal development" },
  { name: "Buddhism", origin: "Eastern Practice", icon: "☸", desc: "Psychology of suffering and liberation" },
  { name: "Hermetic", origin: "Western Esoteric", icon: "⚗", desc: "Correspondence — as above, so below" },
];

// ─── DIAGNOSTIC QUESTIONS ────────────────────────────────────
const DIAGNOSTIC_QUESTIONS = [
  { id: "dq1", category: "History", question: "How long has your organization existed?", type: "select", options: ["Less than 1 year", "1-2 years", "2-3 years", "3-5 years", "5-7 years", "7-10 years", "10-15 years", "15-20 years", "20+ years"] },
  { id: "dq2", category: "History", question: "What was the founding vision (in one sentence)?", type: "longtext" },
  { id: "dq3", category: "History", question: "How many people are part of this organization?", type: "select", options: ["Under 20", "20-50", "50-100", "100-250", "250-500", "500+"] },
  { id: "dq4", category: "Energy", question: "What's the overall energy level right now?", type: "select", options: ["High — excited, moving fast", "Moderate — steady, sustainable", "Low — tired, stuck, plateau", "Chaotic — unstable, in transition", "Mixed — some high, some low"] },
  { id: "dq5", category: "Energy", question: "How would you describe the mood of leadership?", type: "select", options: ["Optimistic and energized", "Focused and determined", "Frustrated or burned out", "Uncertain about direction", "Ready for something new"] },
  { id: "dq6", category: "Challenges", question: "What is the primary challenge right now?", type: "longtext" },
  { id: "dq7", category: "Challenges", question: "Which category best describes your challenges?", type: "select", options: ["Vision/direction (unclear where we're going)", "Systems/operations (things are disorganized)", "Identity (who are we really?)", "Growth (we're stuck or growing too fast)", "Quality (things are slipping)", "Conflict (tensions between people or ideas)", "Transformation (something needs to fundamentally change)", "Structure (we need better governance)", "Innovation (we need to evolve)"] },
  { id: "dq8", category: "Challenges", question: "How distributed is leadership?", type: "select", options: ["Founder does almost everything", "Founder + 1-2 key people", "Small leadership team (3-5)", "Distributed across many leaders", "Fully shared/collective leadership"] },
  { id: "dq9", category: "Systems", question: "How would you rate your organizational systems?", type: "select", options: ["Minimal — we're winging it", "Basic — some systems exist", "Moderate — systems work but need improvement", "Strong — systems are reliable", "Sophisticated — professional-grade systems"] },
  { id: "dq10", category: "Intuition", question: "Complete this sentence: 'What our organization needs most right now is...'", type: "longtext" },
  { id: "dq11", category: "Intuition", question: "If your organization were a person, what age would it be?", type: "select", options: ["Infant (0-2) — just born, pure potential", "Child (3-7) — learning, growing, curious", "Adolescent (8-14) — identity forming, testing limits", "Young adult (15-25) — establishing itself in the world", "Mature adult (26-40) — established, producing, leading", "Elder (40+) — wisdom, legacy, preparing for what's next"] },
  { id: "dq12", category: "Intuition", question: "What would change if you were completely honest about where your organization is?", type: "longtext" },
];

// ─── COMPONENTS ──────────────────────────────────────────────

// Utility: glassmorphism card
const Card = ({ children, style, onClick, hover }) => (
  <div
    onClick={onClick}
    style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: T.radius,
      padding: "24px",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      transition: "all 0.3s ease",
      cursor: onClick ? "pointer" : "default",
      ...(hover ? {} : {}),
      ...style,
    }}
    onMouseEnter={e => {
      if (onClick) {
        e.currentTarget.style.background = T.bgCardHover;
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)";
      }
    }}
    onMouseLeave={e => {
      if (onClick) {
        e.currentTarget.style.background = T.bgCard;
        e.currentTarget.style.borderColor = T.border;
      }
    }}
  >
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style, disabled }) => {
  const styles = {
    primary: { background: T.grad, color: "#fff", border: "none" },
    gold: { background: T.gradGold, color: "#000", border: "none" },
    ghost: { background: "transparent", color: T.accent, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: T.danger, border: `1px solid rgba(255,107,107,0.3)` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 24px",
        borderRadius: T.radiusSm,
        fontFamily: T.fontMono,
        fontSize: "13px",
        letterSpacing: "0.5px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const ProgressBar = ({ value, max, color = T.accent }) => (
  <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.5s ease" }} />
  </div>
);

// ─── SPECIAL CONTENT RENDERERS ───────────────────────────────

const PhasesDisplay = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", margin: "20px 0" }}>
    {PHASES_OVERVIEW.map((p, i) => (
      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${p.color}30`, borderRadius: T.radiusSm, padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "18px" }}>{p.icon}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: "13px", color: p.color }}>{p.name}</span>
          <span style={{ fontFamily: T.font, fontSize: "12px", color: T.textDim }}>({p.felt})</span>
        </div>
        <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim, marginBottom: "4px" }}>Year {p.years}</div>
        <div style={{ fontFamily: T.font, fontSize: "13px", color: T.text, lineHeight: "1.4" }}>{p.ask}</div>
      </div>
    ))}
  </div>
);

const MicroStatesDisplay = () => (
  <div style={{ margin: "20px 0" }}>
    <div style={{ display: "flex", gap: "2px", marginBottom: "16px", borderRadius: T.radiusSm, overflow: "hidden" }}>
      {MICRO_STATES.map((ms, i) => (
        <div key={i} style={{ width: ms.width, height: "8px", background: ms.color }} />
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
      {MICRO_STATES.map((ms, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: ms.color, marginTop: "5px", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: ms.color }}>{ms.name}</div>
            <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim, lineHeight: "1.4" }}>{ms.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TraditionsDisplay = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", margin: "20px 0" }}>
    {TRADITIONS.map((t, i) => (
      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "18px" }}>{t.icon}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.gold }}>{t.name}</span>
        </div>
        <div style={{ fontFamily: T.font, fontSize: "12px", color: T.textMuted, marginBottom: "4px" }}>{t.origin}</div>
        <div style={{ fontFamily: T.font, fontSize: "13px", color: T.text, lineHeight: "1.4" }}>{t.desc}</div>
      </div>
    ))}
  </div>
);

// ─── LESSON VIEW ─────────────────────────────────────────────

const LessonView = ({ lesson, moduleId, onBack, onNext, progress, setProgress, exercises, setExercises }) => {
  const [exerciseText, setExerciseText] = useState(exercises[lesson.exercise?.id] || "");
  const [saved, setSaved] = useState(false);

  const isComplete = progress.completedLessons?.includes(lesson.id);

  const handleSaveExercise = () => {
    const updated = { ...exercises, [lesson.exercise.id]: exerciseText };
    setExercises(updated);
    save(KEYS.exercises, updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleComplete = () => {
    const completed = [...(progress.completedLessons || [])];
    if (!completed.includes(lesson.id)) completed.push(lesson.id);
    const updated = { ...progress, completedLessons: completed };
    setProgress(updated);
    save(KEYS.progress, updated);
    if (onNext) onNext();
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fontMono, fontSize: "13px" }}>← Back</button>
        <div style={{ flex: 1 }} />
        {isComplete && <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.success }}>✓ Completed</span>}
        <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted }}>{lesson.duration}</span>
      </div>

      <h2 style={{ fontFamily: T.fontMono, fontSize: "24px", color: T.text, marginBottom: "32px", letterSpacing: "-0.5px" }}>{lesson.title}</h2>

      {lesson.content.map((block, i) => {
        switch (block.type) {
          case "heading": return <h3 key={i} style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.accent, marginTop: "32px", marginBottom: "12px" }}>{block.text}</h3>;
          case "text": return <p key={i} style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: "1.75", marginBottom: "16px" }}>{block.text}</p>;
          case "highlight": return (
            <div key={i} style={{ background: T.goldDim, borderLeft: `3px solid ${T.gold}`, padding: "16px 20px", borderRadius: `0 ${T.radiusSm} ${T.radiusSm} 0`, margin: "24px 0" }}>
              <p style={{ fontFamily: T.font, fontSize: "16px", color: T.gold, lineHeight: "1.6", margin: 0, fontStyle: "italic" }}>{block.text}</p>
            </div>
          );
          case "phases": return <PhasesDisplay key={i} />;
          case "microstates": return <MicroStatesDisplay key={i} />;
          case "traditions": return <TraditionsDisplay key={i} />;
          default: return null;
        }
      })}

      {lesson.exercise && (
        <Card style={{ marginTop: "40px", borderColor: "rgba(167,139,250,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.accent, textTransform: "uppercase", letterSpacing: "1px" }}>Exercise</span>
          </div>
          <h4 style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.text, marginBottom: "12px" }}>{lesson.exercise.title}</h4>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: "1.6", marginBottom: "16px", whiteSpace: "pre-line" }}>{lesson.exercise.prompt}</p>
          <textarea
            value={exerciseText}
            onChange={e => setExerciseText(e.target.value)}
            placeholder="Write your response here..."
            style={{
              width: "100%", minHeight: "180px", padding: "16px",
              background: T.bgInput, border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm, color: T.text,
              fontFamily: T.font, fontSize: "15px", lineHeight: "1.6",
              resize: "vertical", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = T.borderFocus}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <div style={{ display: "flex", gap: "12px", marginTop: "12px", alignItems: "center" }}>
            <Btn onClick={handleSaveExercise} variant="ghost">Save Progress</Btn>
            {saved && <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.success }}>✓ Saved</span>}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "24px", borderTop: `1px solid ${T.border}` }}>
        <Btn onClick={onBack} variant="ghost">← Back to Module</Btn>
        <Btn onClick={handleComplete} variant={isComplete ? "ghost" : "primary"}>
          {isComplete ? "✓ Completed" : onNext ? "Complete & Continue →" : "Complete Lesson ✓"}
        </Btn>
      </div>
    </div>
  );
};

// ─── MODULE VIEW ─────────────────────────────────────────────

const ModuleView = ({ module, onBack, onLesson, progress }) => {
  const completedCount = module.lessons.filter(l => progress.completedLessons?.includes(l.id)).length;
  const totalLessons = module.lessons.length;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fontMono, fontSize: "13px", marginBottom: "24px" }}>← Back to Dashboard</button>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
        <span style={{ fontSize: "32px", color: module.color }}>{module.icon}</span>
        <div>
          <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>Module {module.number}</div>
          <h2 style={{ fontFamily: T.fontMono, fontSize: "24px", color: T.text, margin: 0 }}>{module.title}</h2>
        </div>
      </div>
      <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, marginBottom: "8px" }}>{module.subtitle}</p>
      <p style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.6", marginBottom: "24px" }}>{module.description}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <ProgressBar value={completedCount} max={totalLessons} color={module.color} />
        <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, whiteSpace: "nowrap" }}>{completedCount}/{totalLessons}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {module.lessons.map((lesson, i) => {
          const isComplete = progress.completedLessons?.includes(lesson.id);
          return (
            <Card key={lesson.id} onClick={() => onLesson(lesson)} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isComplete ? `${module.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isComplete ? module.color : T.border}`,
                fontFamily: T.fontMono, fontSize: "14px",
                color: isComplete ? module.color : T.textDim,
                flexShrink: 0,
              }}>
                {isComplete ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.fontMono, fontSize: "15px", color: T.text }}>{lesson.title}</div>
                <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textMuted }}>{lesson.duration}</div>
              </div>
              <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim }}>→</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── DIAGNOSTIC ENGINE ───────────────────────────────────────

const DiagnosticEngine = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const q = DIAGNOSTIC_QUESTIONS[step];
  const total = DIAGNOSTIC_QUESTIONS.length;

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    if (step < total - 1) setStep(s => s + 1);
    else runDiagnostic();
  };

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Pattern Literacy diagnostic engine for Twelvefold Institute. Based on the following organizational assessment, identify which of the 12 phases this organization is in and provide a detailed reading.

The 12 phases are: Aries/Sparking (Year 0-1), Taurus/Building (Year 1-2), Gemini/Learning (Year 2-3), Cancer/Inner Root (Year 3-5), Leo/Authority (Year 5-7), Virgo/Correction (Year 6-8), Libra/Balance (Year 7-9), Scorpio/Transformation (Year 9-11), Sagittarius/Expansion (Year 11-13), Capricorn/Structure (Year 13-15), Aquarius/Liberation (Year 15-17), Pisces/Dissolution (Year 17-19).

Assessment answers:
${DIAGNOSTIC_QUESTIONS.map(dq => `${dq.question}: ${answers[dq.id] || "Not answered"}`).join("\n")}

Respond ONLY in JSON format with these exact fields:
{
  "phase": "the phase name (e.g. Cancer)",
  "felt_name": "the felt-experience name (e.g. Inner Root)",
  "confidence": 85,
  "summary": "2-3 sentence summary of the diagnosis",
  "curriculum": ["list of 5-7 specific tasks this phase is asking"],
  "leadership_needs": "what leadership capacities are needed right now",
  "common_mistakes": ["2-3 mistakes to watch for in this phase"],
  "next_steps": ["3-4 specific recommended next steps"],
  "reading": "A 200-word detailed reading addressing this organization's specific situation"
}`;

      // Route through our server-side proxy at /api/org-diagnostic.
      // The original code called api.anthropic.com directly, which would
      // either expose an API key or fail outright. The server endpoint
      // holds the key safely and returns parsed JSON.
      const res = await fetch("/api/org-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Diagnostic service unavailable. Try again.");
      }
      const parsed = await res.json();
      setResult(parsed);

      // Save to organizations
      const orgs = load(KEYS.orgs, []);
      orgs.push({ id: Date.now(), date: new Date().toISOString(), answers, result: parsed });
      save(KEYS.orgs, orgs);
    } catch (err) {
      console.error("Diagnostic error:", err);
      setResult({ error: true, message: "Diagnostic could not be completed. Check your API connection." });
    }
    setLoading(false);
  };

  if (loading) return (
    <div style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "24px", animation: "spin 2s linear infinite" }}>◈</div>
      <p style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.accent }}>Analyzing your organization...</p>
      <p style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim }}>Reading energy patterns, timing signals, and challenge indicators</p>
    </div>
  );

  if (result) {
    if (result.error) return (
      <div style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}>
        <p style={{ fontFamily: T.font, fontSize: "16px", color: T.danger }}>{result.message}</p>
        <Btn onClick={() => { setResult(null); setStep(0); }} variant="ghost" style={{ marginTop: "16px" }}>Try Again</Btn>
      </div>
    );

    const phaseData = PHASES_OVERVIEW.find(p => p.name.toLowerCase() === result.phase?.toLowerCase());

    return (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fontMono, fontSize: "13px", marginBottom: "24px" }}>← Back</button>

        <Card style={{ borderColor: `${phaseData?.color || T.accent}40`, marginBottom: "24px", textAlign: "center", padding: "40px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Your Organization's Phase</div>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>{phaseData?.icon || "◈"}</div>
          <h2 style={{ fontFamily: T.fontMono, fontSize: "28px", color: phaseData?.color || T.accent, margin: "0 0 4px" }}>{result.phase} / {result.felt_name}</h2>
          <div style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.textDim, marginBottom: "16px" }}>{result.confidence}% Confidence</div>
          <p style={{ fontFamily: T.font, fontSize: "16px", color: T.text, lineHeight: "1.6" }}>{result.summary}</p>
        </Card>

        <Card style={{ marginBottom: "16px" }}>
          <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.gold, marginBottom: "16px" }}>What This Phase Is Asking</h3>
          {result.curriculum?.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <span style={{ color: T.gold, flexShrink: 0 }}>→</span>
              <span style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.5" }}>{item}</span>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom: "16px" }}>
          <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.accent, marginBottom: "12px" }}>Your Reading</h3>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.7" }}>{result.reading}</p>
        </Card>

        <Card style={{ marginBottom: "16px" }}>
          <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.success, marginBottom: "12px" }}>Leadership Needs</h3>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.6" }}>{result.leadership_needs}</p>
        </Card>

        <Card style={{ marginBottom: "16px" }}>
          <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.danger, marginBottom: "12px" }}>Mistakes to Watch For</h3>
          {result.common_mistakes?.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: T.danger, flexShrink: 0 }}>⚠</span>
              <span style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.5" }}>{m}</span>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom: "24px" }}>
          <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.accent, marginBottom: "12px" }}>Recommended Next Steps</h3>
          {result.next_steps?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.accent, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: "1.5" }}>{s}</span>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", gap: "12px" }}>
          <Btn onClick={() => { setResult(null); setStep(0); setAnswers({}); }} variant="ghost">Run New Diagnostic</Btn>
          <Btn onClick={onBack} variant="primary">Back to Dashboard</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fontMono, fontSize: "13px", marginBottom: "24px" }}>← Back</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h2 style={{ fontFamily: T.fontMono, fontSize: "20px", color: T.text, margin: 0 }}>Organizational Diagnostic</h2>
        <span style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.textDim }}>{step + 1} / {total}</span>
      </div>

      <ProgressBar value={step + 1} max={total} color={T.gold} />

      <Card style={{ marginTop: "24px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>{q.category}</div>
        <h3 style={{ fontFamily: T.font, fontSize: "18px", color: T.text, marginBottom: "20px", lineHeight: "1.5" }}>{q.question}</h3>

        {q.type === "select" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "12px 16px",
                  background: answers[q.id] === opt ? "rgba(167,139,250,0.15)" : T.bgInput,
                  border: `1px solid ${answers[q.id] === opt ? T.accent : T.border}`,
                  borderRadius: T.radiusSm,
                  color: answers[q.id] === opt ? T.accent : T.text,
                  fontFamily: T.font,
                  fontSize: "15px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "longtext" && (
          <textarea
            value={answers[q.id] || ""}
            onChange={e => handleAnswer(e.target.value)}
            placeholder="Write your response..."
            style={{
              width: "100%", minHeight: "120px", padding: "16px",
              background: T.bgInput, border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm, color: T.text,
              fontFamily: T.font, fontSize: "15px", lineHeight: "1.6",
              resize: "vertical", outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = T.borderFocus}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
        <Btn onClick={() => setStep(s => Math.max(0, s - 1))} variant="ghost" disabled={step === 0}>← Previous</Btn>
        <Btn onClick={handleNext} disabled={!answers[q.id]}>
          {step < total - 1 ? "Next →" : "Run Diagnostic →"}
        </Btn>
      </div>
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────

const Dashboard = ({ user, progress, onModule, onDiagnostic, onTools }) => {
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = progress.completedLessons?.length || 0;
  const certProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontFamily: T.fontMono, fontSize: "28px", color: T.text, marginBottom: "8px" }}>
          Welcome{user.name ? `, ${user.name}` : ""}
        </h1>
        <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim }}>Pattern Literacy Certification Program</p>
      </div>

      {/* Progress Overview */}
      <Card style={{ marginBottom: "32px", borderColor: "rgba(167,139,250,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>Certification Progress</div>
            <div style={{ fontFamily: T.fontMono, fontSize: "32px", color: T.accent, marginTop: "4px" }}>{certProgress}%</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.text }}>{completedLessons} / {totalLessons} lessons</div>
            <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim }}>
              {certProgress === 100 ? "Ready for certification!" : completedLessons === 0 ? "Start with Module 1" : "Keep going"}
            </div>
          </div>
        </div>
        <ProgressBar value={completedLessons} max={totalLessons} />
      </Card>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "40px" }}>
        <Card onClick={onDiagnostic} style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>◎</div>
          <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.gold }}>Run Diagnostic</div>
          <div style={{ fontFamily: T.font, fontSize: "12px", color: T.textDim, marginTop: "4px" }}>Assess an organization</div>
        </Card>
        <Card onClick={onTools} style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>◆</div>
          <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.accent }}>Practitioner Tools</div>
          <div style={{ fontFamily: T.font, fontSize: "12px", color: T.textDim, marginTop: "4px" }}>Plans, templates, resources</div>
        </Card>
      </div>

      {/* Modules */}
      <h2 style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.text, marginBottom: "16px" }}>Learning Modules</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MODULES.map((mod, i) => {
          const modLessons = mod.lessons.length;
          const modCompleted = mod.lessons.filter(l => progress.completedLessons?.includes(l.id)).length;
          const isLocked = i > 0 && MODULES[i - 1].lessons.some(l => !progress.completedLessons?.includes(l.id));
          const isComplete = modCompleted === modLessons;

          return (
            <Card
              key={mod.id}
              onClick={isLocked ? null : () => onModule(mod)}
              style={{
                display: "flex", alignItems: "center", gap: "20px",
                opacity: isLocked ? 0.4 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isComplete ? `${mod.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isComplete ? mod.color : T.border}`,
                fontSize: "24px", color: mod.color, flexShrink: 0,
              }}>
                {isComplete ? "✓" : mod.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted }}>MODULE {mod.number}</span>
                  {isLocked && <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted }}>🔒 Locked</span>}
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.text, marginTop: "2px" }}>{mod.title}</div>
                <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim, marginTop: "2px" }}>{mod.subtitle}</div>
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <ProgressBar value={modCompleted} max={modLessons} color={mod.color} />
                  <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim, whiteSpace: "nowrap" }}>{modCompleted}/{modLessons}</span>
                </div>
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, flexShrink: 0 }}>{mod.hours}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── PRACTITIONER TOOLS ──────────────────────────────────────

const PractitionerTools = ({ onBack, onDiagnostic }) => {
  const orgs = load(KEYS.orgs, []);

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.fontMono, fontSize: "13px", marginBottom: "24px" }}>← Back to Dashboard</button>

      <h2 style={{ fontFamily: T.fontMono, fontSize: "24px", color: T.text, marginBottom: "8px" }}>Practitioner Tools</h2>
      <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, marginBottom: "32px" }}>Diagnostic results, action plans, and resources for your practice.</p>

      {/* Past Diagnostics */}
      <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.accent, marginBottom: "16px" }}>Past Diagnostics ({orgs.length})</h3>
      {orgs.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, marginBottom: "16px" }}>No diagnostics yet. Run your first assessment to get started.</p>
          <Btn onClick={onDiagnostic}>Run Diagnostic</Btn>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {orgs.slice().reverse().map((org, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.text }}>
                    {org.result?.phase || "Unknown"} / {org.result?.felt_name || ""}
                  </div>
                  <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim, marginTop: "2px" }}>
                    {org.result?.confidence}% confidence · {new Date(org.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textMuted }}>
                  {org.answers?.dq3 || ""} · {org.answers?.dq1 || ""}
                </div>
              </div>
              <p style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim, marginTop: "8px", lineHeight: "1.5" }}>{org.result?.summary}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Resources */}
      <h3 style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.gold, marginBottom: "16px" }}>Resource Library</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
        {[
          { icon: "📋", title: "Decision Frameworks", desc: "Phase-aligned decision guides" },
          { icon: "💬", title: "Communication Templates", desc: "Sample communications by phase" },
          { icon: "📖", title: "Case Studies", desc: "Real organizational examples" },
          { icon: "🔄", title: "Transition Guides", desc: "Moving between phases" },
          { icon: "👥", title: "Leadership Capacities", desc: "What each phase requires" },
          { icon: "📊", title: "Assessment Tools", desc: "Diagnostic question sets" },
        ].map((r, i) => (
          <Card key={i} style={{ padding: "16px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{r.icon}</div>
            <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.text }}>{r.title}</div>
            <div style={{ fontFamily: T.font, fontSize: "12px", color: T.textDim, marginTop: "2px" }}>{r.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── ONBOARDING ──────────────────────────────────────────────

const Onboarding = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");

  const handleStart = () => {
    const user = { name, organization: org, role, createdAt: new Date().toISOString() };
    save(KEYS.user, user);
    onComplete(user);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: T.bg }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "14px", color: T.textMuted, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>Twelvefold Institute</div>
          <h1 style={{ fontFamily: T.fontMono, fontSize: "28px", color: T.text, marginBottom: "8px" }}>Pattern Literacy</h1>
          <h2 style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.accent, fontWeight: "normal" }}>Practitioner Certification Program</h2>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, marginTop: "16px", lineHeight: "1.6" }}>
            Learn to read the intelligent cycles governing organizational life. 6 modules. 33 hours. Complete certification.
          </p>
        </div>

        <Card>
          <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Get Started</div>

          {[
            { label: "Your Name", value: name, set: setName, placeholder: "Full name" },
            { label: "Organization", value: org, set: setOrg, placeholder: "Church, nonprofit, business..." },
            { label: "Your Role", value: role, set: setRole, placeholder: "Pastor, Director, Founder..." },
          ].map((field, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <label style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim, display: "block", marginBottom: "6px" }}>{field.label}</label>
              <input
                value={field.value}
                onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: T.bgInput, border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm, color: T.text,
                  fontFamily: T.font, fontSize: "15px",
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = T.borderFocus}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
          ))}

          <Btn onClick={handleStart} disabled={!name} style={{ width: "100%", marginTop: "8px", padding: "14px" }}>
            Begin Certification →
          </Btn>
        </Card>
      </div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────

const Sidebar = ({ view, setView, progress, mobileOpen, onClose }) => {
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const completed = progress.completedLessons?.length || 0;

  const CERT_ONLY_VIEWS = ["diagnostic", "coordinate", "mastery", "client-readings", "tools"];
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "structures", label: "Universal Structures", icon: "❖" },
    // Practitioner-only items — hidden for free users, shown for cert-paid
    ...(isCertified ? [
      { id: "diagnostic", label: "Diagnostic", icon: "◎" },
      { id: "coordinate", label: "Coordinate Reading", icon: "⊹" },
      { id: "mastery", label: "Pattern Mastery", icon: "✸" },
      { id: "client-readings", label: "Client Readings", icon: "✦", external: "/read/app?mode=master" },
      { id: "tools", label: "Practitioner Tools", icon: "◆" },
    ] : []),
  ];

  return (
    <div
      className={`pi-portal-sidebar${mobileOpen ? " is-open" : ""}`}
      style={{
        width: "240px", height: "100vh", position: "fixed", left: 0, top: 0,
        background: "rgba(6,6,15,0.97)", borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", padding: "24px 16px",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        zIndex: 100, boxSizing: "border-box",
      }}
    >
      {/* Mobile close button — only visible when sidebar is overlay */}
      <button
        className="pi-portal-close"
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: "absolute", top: "12px", right: "12px",
          width: "36px", height: "36px", borderRadius: "999px",
          background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`,
          color: T.textDim, cursor: "pointer", fontSize: "16px",
          display: "none", alignItems: "center", justifyContent: "center",
        }}
      >×</button>
      {/* Logo */}
      <div style={{ marginBottom: "32px", padding: "0 8px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, letterSpacing: "2px", textTransform: "uppercase" }}>Twelvefold Institute</div>
        <div style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.text, marginTop: "4px" }}>Certification</div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "24px" }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.external) {
                // External nav — leave the portal for routes that live
                // outside it (currently: /read/app for Client Readings).
                window.location.href = item.external;
              } else {
                setView(item.id);
                if (onClose) onClose();
              }
            }}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 12px", borderRadius: T.radiusSm,
              background: view === item.id ? "rgba(167,139,250,0.1)" : "transparent",
              border: "none", cursor: "pointer",
              color: view === item.id ? T.accent : T.textDim,
              fontFamily: T.fontMono, fontSize: "13px",
              transition: "all 0.2s ease",
              textAlign: "left", width: "100%",
              minHeight: "44px",
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            {item.label}
            {item.external && <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: "11px" }}>↗</span>}
          </button>
        ))}
      </div>

      {/* Module List — practitioner only */}
      {isCertified && <>
      <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, letterSpacing: "1px", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>Modules</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, overflow: "auto" }}>
        {MODULES.map(mod => {
          const modCompleted = mod.lessons.filter(l => progress.completedLessons?.includes(l.id)).length;
          const isComplete = modCompleted === mod.lessons.length;
          return (
            <button
              key={mod.id}
              onClick={() => setView(`module-${mod.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 12px", borderRadius: T.radiusSm,
                background: view === `module-${mod.id}` ? "rgba(167,139,250,0.1)" : "transparent",
                border: "none", cursor: "pointer",
                color: view === `module-${mod.id}` ? T.accent : T.textDim,
                fontFamily: T.fontMono, fontSize: "12px",
                transition: "all 0.2s ease",
                textAlign: "left", width: "100%",
              }}
            >
              <span style={{ fontSize: "12px", color: isComplete ? T.success : mod.color }}>{isComplete ? "✓" : mod.icon}</span>
              <span style={{ flex: 1 }}>{mod.number}. {mod.title}</span>
              <span style={{ fontSize: "10px", color: T.textMuted }}>{modCompleted}/{mod.lessons.length}</span>
            </button>
          );
        })}
      </div>
      </>}

      {/* Footer Progress */}
      <div style={{ padding: "16px 8px 0", borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim, marginBottom: "8px" }}>
          {completed}/{totalLessons} lessons complete
        </div>
        <ProgressBar value={completed} max={totalLessons} />
      </div>
    </div>
  );
};


// ─── PortalCertGate ──────────────────────────────────────────
// Shown when a free (non-certified) user tries to access a
// practitioner-only view inside the portal.
function PortalCertGate({ onGoStructures }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", fontSize: "24px" }}>⊘</div>
      <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2.5px", color: T.accent, textTransform: "uppercase", marginBottom: "14px", fontWeight: 700 }}>Practitioner feature</div>
      <h2 style={{ fontFamily: T.font, fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 600, color: T.text, margin: "0 0 16px", lineHeight: 1.2 }}>This module is part of the certification</h2>
      <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, maxWidth: "440px", margin: "0 auto 32px", lineHeight: 1.65 }}>
        Diagnostic tools, coordinate readings, pattern mastery, curriculum modules, and practitioner tools are available after completing the Twelvefold certification program.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/certification" style={{ padding: "13px 26px", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", textDecoration: "none", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", display: "inline-flex", alignItems: "center", minHeight: "44px" }}>See the Certification →</a>
        <button onClick={onGoStructures} style={{ padding: "13px 26px", background: "transparent", color: T.text, border: `1px solid ${T.border}`, borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", minHeight: "44px" }}>Explore Structures ↗</button>
      </div>
    </div>
  );
}

// ─── FreeDashboard ───────────────────────────────────────────
// Landing view shown to signed-in users who are not yet certified.
// Orients them to what's free (Universal Structures Explore/Overview)
// and what the certification unlocks.
function FreeDashboard({ user, onGoStructures }) {
  const FREE_FEATURES = [
    { icon: "❖", label: "60 Universal Structures", body: "Browse all structures across nature, the body, and the cosmos. Study the Intelligent Order named at each layer." },
    { icon: "◎", label: "Overview & Recognition Signals", body: "Each structure shows recognition signals — concrete signs it is operating in your situation — and its five-layer descent." },
    { icon: "✦", label: "Natural Allies", body: "Every structure has natural allies across plants, animals, and planets, with guidance on how to work with each." },
  ];
  const CERT_FEATURES = [
    { icon: "◎", label: "Diagnostic Engine" },
    { icon: "⊹", label: "Coordinate Reading" },
    { icon: "✸", label: "Pattern Mastery" },
    { icon: "◆", label: "Practitioner Tools" },
    { icon: "✦", label: "Client Readings" },
    { icon: "📖", label: "Full Curriculum (12 modules)" },
    { icon: "⊕", label: "Apply, Invoke & Journal" },
  ];
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)" }}>
      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "10px" }}>Welcome{user?.name ? `, ${user.name}` : ""}</div>
        <h1 style={{ fontFamily: T.font, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 600, color: T.text, margin: "0 0 14px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>You have access to the structures.</h1>
        <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, lineHeight: 1.65, margin: 0, maxWidth: 540 }}>Explore all 60 Universal Structures, their Intelligent Order mappings, recognition signals, and natural allies. The full practice system — Apply, Invoke, Journal, and all diagnostic tools — unlocks with certification.</p>
      </div>

      {/* Free features */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.textMuted, textTransform: "uppercase", marginBottom: "14px", fontWeight: 700 }}>FREE WITH YOUR ACCOUNT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {FREE_FEATURES.map((f) => (
            <div key={f.label} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: "12px" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{f.icon}</div>
              <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.accent, fontWeight: 700, marginBottom: "6px", letterSpacing: "0.5px" }}>{f.label}</div>
              <div style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim, lineHeight: 1.55 }}>{f.body}</div>
            </div>
          ))}
        </div>
        <button onClick={onGoStructures} style={{ padding: "13px 28px", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", border: "none", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", minHeight: "44px" }}>Explore Universal Structures →</button>
      </div>

      {/* Cert features */}
      <div style={{ padding: "28px 28px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.18)", borderRadius: "14px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.accent, textTransform: "uppercase", marginBottom: "14px", fontWeight: 700 }}>UNLOCKS WITH CERTIFICATION</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {CERT_FEATURES.map((f) => (
            <span key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, fontFamily: T.fontMono, fontSize: "11px", color: T.textDim }}>
              <span style={{ opacity: 0.6 }}>{f.icon}</span>{f.label}
            </span>
          ))}
        </div>
        <a href="/certification" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", background: "transparent", color: T.text, border: `1px solid ${T.border}`, borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", textDecoration: "none", minHeight: "44px" }}>See the Certification Program →</a>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

export default function CertificationApp({ isCertified = false }) {
  const [user, setUser] = useState(load(KEYS.user, null));
  const [progress, setProgress] = useState(load(KEYS.progress, { completedLessons: [] }));
  const [exercises, setExercises] = useState(load(KEYS.exercises, {}));
  const [view, setView] = useState("dashboard");
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  // Mobile sidebar overlay — closed by default, opened via hamburger.
  // On desktop (≥ 960px) the sidebar is always-on via CSS; this state
  // only affects the mobile overlay path.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fonts & styles injected via JSX (see bottom of render)

  if (!user) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <Onboarding onComplete={setUser} />
    </>
  );

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setActiveLesson(null);
    setView(`module-${mod.id}`);
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleLessonBack = () => {
    setActiveLesson(null);
  };

  const handleLessonNext = () => {
    if (!activeModule) return;
    const idx = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
    if (idx < activeModule.lessons.length - 1) {
      setActiveLesson(activeModule.lessons[idx + 1]);
    } else {
      setActiveLesson(null); // Back to module view
    }
  };

  const renderContent = () => {
    // Lesson view — practitioner only
    if (activeLesson && activeModule) {
      if (!isCertified) return <PortalCertGate onGoStructures={() => setView("structures")} />;
      const idx = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
      const hasNext = idx < activeModule.lessons.length - 1;
      return (
        <LessonView
          lesson={activeLesson}
          moduleId={activeModule.id}
          onBack={handleLessonBack}
          onNext={hasNext ? handleLessonNext : null}
          progress={progress}
          setProgress={setProgress}
          exercises={exercises}
          setExercises={setExercises}
        />
      );
    }

    // Module view — practitioner only (already caught by CERT_ONLY guard above,
    // but kept here so the guard message is shown if somehow reached directly)
    if (view.startsWith("module-")) {
      if (!isCertified) return <PortalCertGate onGoStructures={() => setView("structures")} />;
      const modId = view.replace("module-", "");
      const mod = MODULES.find(m => m.id === modId);
      if (mod) {
        return <ModuleView module={mod} onBack={() => { setView("dashboard"); setActiveModule(null); }} onLesson={(lesson) => { setActiveModule(mod); handleLessonClick(lesson); }} progress={progress} />;
      }
    }

    // Practitioner-only guard — redirect free users back to dashboard
    const CERT_ONLY = ["diagnostic", "mastery", "coordinate", "tools"];
    if (!isCertified && (CERT_ONLY.includes(view) || view.startsWith("module-"))) {
      return <PortalCertGate onGoStructures={() => setView("structures")} />;
    }

    // Diagnostic
    if (view === "diagnostic") return <DiagnosticEngine onBack={() => setView("dashboard")} />;

    // Pattern Mastery — the v4 self-contained training app
    if (view === "mastery") return <PatternMastery />;

    // Universal Structures — the 60-coordinate structure library
    if (view === "structures") return <UniversalStructures isCertified={isCertified} />;

    // Coordinate Reading — the 60 Reality Coordinates diagnostic
    if (view === "coordinate") {
      return (
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <CoordinateReading />
        </div>
      );
    }

    // Tools
    if (view === "tools") return <PractitionerTools onBack={() => setView("dashboard")} onDiagnostic={() => setView("diagnostic")} />;

    // Dashboard — show free-tier landing for non-certified users
    if (!isCertified) return <FreeDashboard user={user} onGoStructures={() => setView("structures")} />;
    return (
      <Dashboard
        user={user}
        progress={progress}
        onModule={handleModuleClick}
        onDiagnostic={() => setView("diagnostic")}
        onTools={() => setView("tools")}
      />
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 3px; }
        ::selection { background: rgba(167,139,250,0.3); }

        /* ─── Portal responsive layout ─── */
        /* Desktop: sidebar is fixed at left, main content offset by 240px */
        .pi-portal-main { margin-left: 240px; padding: 40px; }
        .pi-portal-hamburger { display: none; }
        .pi-portal-backdrop { display: none; }

        @media (max-width: 960px) {
          /* Phone/tablet: sidebar becomes an overlay drawer.
             Closed = slid off-screen via translateX(-100%).
             Open = .is-open class slides it in. */
          .pi-portal-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
            box-shadow: 0 0 60px rgba(0,0,0,0.6);
          }
          .pi-portal-sidebar.is-open { transform: translateX(0); }
          .pi-portal-close { display: inline-flex !important; }
          .pi-portal-main {
            margin-left: 0;
            padding: 20px 18px 60px;
            padding-top: 76px; /* room for the floating hamburger button */
          }
          .pi-portal-hamburger {
            display: inline-flex;
            position: fixed; top: 14px; left: 14px; z-index: 90;
            width: 44px; height: 44px; border-radius: 999px;
            background: rgba(6,6,15,0.92); border: 1px solid rgba(255,255,255,0.14);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            color: #EDE9F5; align-items: center; justify-content: center;
            cursor: pointer; font-size: 18px;
          }
          .pi-portal-backdrop {
            display: block; position: fixed; inset: 0; z-index: 80;
            background: rgba(0,0,0,0.55); backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            opacity: 0; pointer-events: none;
            transition: opacity 0.25s ease;
          }
          .pi-portal-backdrop.is-open { opacity: 1; pointer-events: auto; }
          /* Module/diagnostic cards: stack on small screens */
          .pi-portal-main h1 { font-size: clamp(22px, 5vw, 32px) !important; }
          .pi-portal-main h2 { font-size: clamp(18px, 4.5vw, 24px) !important; }
        }

        @media (max-width: 520px) {
          .pi-portal-main { padding: 18px 14px 60px; padding-top: 72px; }
        }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: T.font, background: T.bg }}>
        {/* Hamburger button — visible on mobile only */}
        <button
          className="pi-portal-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >☰</button>

        {/* Backdrop — visible on mobile only when sidebar is open */}
        <div
          className={`pi-portal-backdrop${sidebarOpen ? " is-open" : ""}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />

        <Sidebar
          view={view}
          setView={(v) => {
            setView(v);
            setActiveLesson(null);
            if (!v.startsWith("module-")) setActiveModule(null);
          }}
          progress={progress}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          className="pi-portal-main"
          style={{ flex: 1, overflow: "auto", height: "100vh", boxSizing: "border-box" }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
}
