"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

const ff = "'Space Mono', monospace";
const fs = "'Crimson Text', serif";

// ════════════════════════════════════════════════════════════════
// UNIFIED PHASE DATA — Felt-name first (the layman's entry point),
// astrological name secondary. Each phase carries everything.
// ════════════════════════════════════════════════════════════════
const PHASES = [
  {
    id: 1, astro: "Aries", felt: "Sparking", texture: "something new starting",
    color: "#FF6B6B", icon: "↗", element: "Fire", duration: "21–28 days",
    work: "Breaking free from analysis. Answering a call. Moving before you're ready. Trusting the impulse.",
    revealed: "You can initiate. Your ideas matter. The world doesn't collapse if you move imperfectly.",
    release: "Permission-seeking. The need for perfect information. The safety of planning without doing.",
    transform: "\"I don't know if I should\" → \"I'm doing this because it's genuinely calling me.\"",
    doNow: ["Make a decision you've been delaying", "Begin without perfecting it first", "Set one clear intention", "Take visible action"],
    avoid: ["Waiting until everything is figured out", "Starting things to avoid what you're already doing"],
    leadership: "Lead with vision. Make the decision others fear. Set the direction.",
  },
  {
    id: 2, astro: "Taurus", felt: "Building", texture: "slow, consistent work",
    color: "#6BCB77", icon: "▣", element: "Earth", duration: "28–45 days",
    work: "Building slowly. Creating systems. Learning that repetition builds mastery. Making the invisible visible through structure.",
    revealed: "Stability requires patience. Small actions compound. You can build something real.",
    release: "Addiction to novelty. Need for excitement. Expectation of quick results.",
    transform: "\"I need something new\" → \"I'm deepening what's already here.\"",
    doNow: ["Stop starting new things", "Deepen one thing properly", "Create routines and systems", "Invest in quality over speed"],
    avoid: ["Chasing the next idea", "Cutting corners for speed"],
    leadership: "Build systems. Develop people. Create structures that hold weight.",
  },
  {
    id: 3, astro: "Gemini", felt: "Learning", texture: "mind very active",
    color: "#FFD93D", icon: "◇", element: "Air", duration: "21–28 days",
    work: "Gathering from multiple sources. Holding contradictions. Communicating to refine. Becoming comfortable with not-knowing.",
    revealed: "There are many valid perspectives. Complexity is richer than simplicity. Your mind has genuine power.",
    release: "Need for certainty. Belief in one true answer. Pressure to decide prematurely.",
    transform: "\"Tell me the truth\" → \"Let me understand this from every angle.\"",
    doNow: ["Gather information. Ask questions.", "Hold multiple perspectives", "Communicate what you're learning", "Make smaller decisions as you learn"],
    avoid: ["Endless research as procrastination", "Oversimplifying complexity"],
    leadership: "Listen before deciding. Help your team see multiple angles.",
  },
  {
    id: 4, astro: "Cancer", felt: "Feeling", texture: "emotions surfacing",
    color: "#C084FC", icon: "◎", element: "Water", duration: "42–70 days",
    work: "Descending inward. Tending to vulnerabilities and needs. Listening to your body and feelings. Creating emotional safety.",
    revealed: "Your feelings are data, not weakness. You need nourishment. Slowing reveals what rushing misses.",
    release: "The armor of productivity. Guilt about needing rest. Belief that feelings are inconvenient.",
    transform: "\"I need to keep going\" → \"I need to come home to myself.\"",
    doNow: ["Create quiet space", "Feel what needs to be felt", "Connect with what nurtures you", "Trust your intuition"],
    avoid: ["Pushing through with force", "Big decisions while inward"],
    leadership: "Create psychological safety. Protect what matters most.",
  },
  {
    id: 5, astro: "Leo", felt: "Expressing", texture: "being seen",
    color: "#FB923C", icon: "◆", element: "Fire", duration: "28–42 days",
    work: "Stepping into visibility. Expressing authentically. Leading by example. Discovering power through clarity.",
    revealed: "You have something worth offering. Your unique expression matters. Being seen means being alive.",
    release: "Belief that humility means hiding. Fear of taking space. Need for permission. Self-doubt.",
    transform: "\"Who am I to lead?\" → \"This is who I am, and I'm offering it fully.\"",
    doNow: ["Show your work. Be visible.", "Lead from authentic power", "Express yourself fully", "Claim your authority"],
    avoid: ["Hiding or playing small", "Seeking permission to lead"],
    leadership: "Lead visibly. Set the example. Show what's possible.",
  },
  {
    id: 6, astro: "Virgo", felt: "Refining", texture: "noticing what's broken",
    color: "#22D3EE", icon: "✦", element: "Earth", duration: "28–42 days",
    work: "Seeing what isn't working. Making precise adjustments. Improving systems. Developing discernment.",
    revealed: "Seeing problems is not criticism—it's care. Fixing is an act of love. Refinement requires humility.",
    release: "Perfectionism. Harsh judgment. Guilt about noticing. Belief you can't improve imperfectly.",
    transform: "\"Everything's wrong\" → \"Here's what needs fixing, and I'll do it with care.\"",
    doNow: ["Notice what needs to change", "Fix one essential thing", "Let small things go", "Refine your processes"],
    avoid: ["Fixing everything at once", "Perfectionism as procrastination"],
    leadership: "Address essential problems. Improve systems. Don't accept mediocrity.",
  },
  {
    id: 7, astro: "Libra", felt: "Relating", texture: "partnership focus",
    color: "#F472B6", icon: "⬡", element: "Air", duration: "28–42 days",
    work: "Considering the other's reality. Negotiating needs. Creating beauty through relationship. Balancing.",
    revealed: "You're stronger in partnership. Honoring others doesn't diminish you. Relationship is a mirror.",
    release: "False choice between self and other. Fear of saying yes to the other. Need to be right.",
    transform: "\"I must maintain myself\" → \"I maintain myself through genuine partnership.\"",
    doNow: ["Consider the other perspective", "Make clear agreements", "Find win-win solutions", "Create harmony"],
    avoid: ["Losing yourself in the relationship", "Avoiding necessary conflict"],
    leadership: "Build teams. Hear all voices. Create consensus without losing clarity.",
  },
  {
    id: 8, astro: "Scorpio", felt: "Transforming", texture: "something dying",
    color: "#EF4444", icon: "◈", element: "Water", duration: "42–70 days",
    work: "Facing what you've avoided. Grieving what ends. Going to the depths. Discovering death as transformation.",
    revealed: "You are far stronger than you thought. Darkness doesn't destroy—it transforms. Loss is part of the pattern.",
    release: "Illusion of control. Attachment to what's meant to die. The identity you've been holding.",
    transform: "\"I must keep this alive\" → \"I trust the process of dying and rebirth.\"",
    doNow: ["Let what's ending fall away", "Face what you've avoided", "Go deep, don't surface early", "Trust death and rebirth"],
    avoid: ["Trying to stop the process", "Emerging before the work is complete"],
    leadership: "Make hard decisions. Remove what's not working. Rebuild from the ground.",
  },
  {
    id: 9, astro: "Sagittarius", felt: "Reaching", texture: "vision emerging",
    color: "#A78BFA", icon: "△", element: "Fire", duration: "28–42 days",
    work: "Reaching beyond circumstances. Learning what transforms seeing. Asking bigger questions. Discovering possibility.",
    revealed: "There is always more to learn. You have capacity to expand. Vision can be bigger than fear.",
    release: "Comfort of the known. Belief you've learned enough. Small thinking. Fear of dreaming big.",
    transform: "\"This is all there is\" → \"I can see further than I ever thought possible.\"",
    doNow: ["Reach toward your vision", "Learn something new", "Expand your perspective", "Ask bigger questions"],
    avoid: ["False optimism that ignores reality", "Seeking without landing anywhere"],
    leadership: "Paint the big picture. Expand the vision. Mentor growth.",
  },
  {
    id: 10, astro: "Capricorn", felt: "Constructing", texture: "long-term mastery",
    color: "#94A3B8", icon: "▢", element: "Earth", duration: "42–70 days",
    work: "Thinking in decades. Doing unglamorous work daily. Building something outlasting you. Developing mastery.",
    revealed: "Time is your ally. Consistency is more powerful than intensity. Mastery comes from showing up repeatedly.",
    release: "Need for quick wins. Expectation of flashiness. Pressure to be done. Fear of deep commitment.",
    transform: "\"I need to finish this\" → \"I'm building something that will outlast me.\"",
    doNow: ["Think long-term", "Build slowly and solidly", "Develop real mastery", "Do the unglamorous work"],
    avoid: ["Taking shortcuts for quick gain", "Giving up before the summit"],
    leadership: "Build for generations. Create what lasts. Be the elder.",
  },
  {
    id: 11, astro: "Aquarius", felt: "Liberating", texture: "breaking free",
    color: "#38BDF8", icon: "⚡", element: "Air", duration: "21–42 days",
    work: "Questioning everything assumed. Breaking out of boxes. Imagining differently. Contributing unique vision.",
    revealed: "The way things have been done isn't the only way. You have unique ideas. Freedom is authentic.",
    release: "Conformity. Need to fit. Belief you must be like everyone. Old structures that constrained you.",
    transform: "\"I have to fit in\" → \"I'm free to be authentically myself.\"",
    doNow: ["Question what you take for granted", "Imagine something different", "Contribute your unique vision", "Break unnecessary constraints"],
    avoid: ["Rebellion for its own sake", "Detachment masquerading as freedom"],
    leadership: "Challenge the status quo. Introduce innovation. Lead change.",
  },
  {
    id: 12, astro: "Pisces", felt: "Dissolving", texture: "tired, releasing",
    color: "#2DD4BF", icon: "≋", element: "Water", duration: "42–70 days",
    work: "Letting go completely. Forgiving. Resting. Creating space. Dissolving the old identity.",
    revealed: "You don't have to do it all. Rest is necessary, not laziness. Surrender is wisdom. Endings enable beginnings.",
    release: "Need to control. Belief you must keep doing. Weight you've been carrying. Resistance to endings.",
    transform: "\"I must keep going\" → \"I release what no longer serves.\"",
    doNow: ["Let go completely", "Stop fighting what's dissolving", "Rest and receive", "Forgive yourself and others"],
    avoid: ["Trying to hold on", "Premature action before dissolution completes"],
    leadership: "Let go of what's not working. Give people permission to rest. Honor endings.",
  },
];

const ELEMENT_COLOR = { Fire: "#FB923C", Earth: "#6BCB77", Air: "#38BDF8", Water: "#C084FC" };

const MICROS = [
  { name: "Initiation", color: "#38BDF8", desc: "The phase is appearing. You sense it, but it's not fully clear yet." },
  { name: "Expansion", color: "#FBBF24", desc: "The phase intensifies. The pressure rises. You can't ignore it anymore." },
  { name: "Contraction", color: "#F87171", desc: "The phase peaks. You face what you can't avoid. The truth becomes unavoidable." },
  { name: "Integration", color: "#4ADE80", desc: "The teaching is absorbed. The new understanding becomes your baseline." },
];

// ════════════════════════════════════════════════════════════════
// SEGMENTS — restructured for cleaner flow
// ════════════════════════════════════════════════════════════════
const SEGMENTS = [
  { id: 0, title: "The Foundation", short: "Foundation", icon: "📖", duration: "3 min", kind: "foundation" },
  { id: 1, title: "Patterns in Nature", short: "Nature", icon: "🌍", duration: "7 min", kind: "nature" },
  { id: 2, title: "The Cost of Misalignment", short: "The Cost", icon: "⚠️", duration: "5 min", kind: "cost" },
  { id: 3, title: "The 12 Phases", short: "12 Phases", icon: "♻️", duration: "8 min", kind: "phases" },
  { id: 4, title: "The Four Movements", short: "Movements", icon: "🌊", duration: "3 min", kind: "movements" },
  { id: 5, title: "Recognize Your Phase", short: "Diagnostic", icon: "🔍", duration: "8 min", kind: "diagnostic" },
  { id: 6, title: "How to Work With It", short: "Your Practice", icon: "🛠️", duration: "5 min", kind: "practice" },
  { id: 7, title: "The Convergence", short: "Convergence", icon: "🌐", duration: "2 min", kind: "convergence" },
  { id: 8, title: "Timing & Rhythm", short: "Timing", icon: "⏰", duration: "2 min", kind: "timing" },
  { id: 9, title: "What Alignment Opens", short: "Alignment", icon: "✨", duration: "8 min", kind: "alignment" },
  { id: 10, title: "Your Pattern Reading", short: "Your Reading", icon: "🪞", duration: "2 min", kind: "summary" },
];

// ════════════════════════════════════════════════════════════════
// DIAGNOSTIC — one question at a time
// ════════════════════════════════════════════════════════════════
const DIAGNOSTIC = [
  {
    id: 1, question: "What is the texture of your life right now?",
    hint: "Answer with your gut, not your mind.",
    options: PHASES.map(p => ({ value: p.id, label: p.felt, sub: p.texture, color: p.color })),
  },
  {
    id: 2, question: "What's the dominant energy?",
    hint: "Which element feels most alive?",
    options: [
      { value: "Fire", label: "Fire", sub: "impulse, action, vision", color: ELEMENT_COLOR.Fire },
      { value: "Earth", label: "Earth", sub: "foundation, structure, matter", color: ELEMENT_COLOR.Earth },
      { value: "Air", label: "Air", sub: "mind, connection, freedom", color: ELEMENT_COLOR.Air },
      { value: "Water", label: "Water", sub: "emotion, transformation, flow", color: ELEMENT_COLOR.Water },
    ],
  },
  {
    id: 3, question: "What's calling you forward?",
    hint: "What does this season want from you?",
    options: PHASES.map(p => ({ value: p.id, label: p.felt, sub: p.texture, color: p.color })),
  },
];

const TRADITIONS = [
  { name: "Scripture & Solomon's Wisdom", origin: "World spiritual texts", insight: "Reality operates on patterns. Solomon's prayer: 'Teach me how reality works.'", source: "1 Kings 3:9; Genesis, Exodus, Job; 1 Corinthians 12:4–11.", note: "A living spiritual tradition with specific revelation claims. We honor its depth from outside the faith community." },
  { name: "Ifá", origin: "Yoruba tradition (West Africa)", insight: "256 odu configurations map human cycles and the right relationship with each.", source: "Wande Abimbola, 'Sixteen Great Poems of Ifá' (Harvard).", note: "A living practice of the Yoruba people with its own orishas, rituals, and community. We acknowledge its wisdom without extracting it from its context. Ifá is far richer than any summary." },
  { name: "Kabbalah", origin: "Jewish mysticism", insight: "The Ten Sefirot represent stages of conscious evolution.", source: "'Sefer Yetzirah'; Gershom Scholem, 'Major Trends in Jewish Mysticism'.", note: "Rooted in Jewish tradition and practice. Different schools interpret the Sefirot differently. We note parallels, not equivalence." },
  { name: "I Ching", origin: "Chinese classic", insight: "64 hexagrams describe situations and how they transform. Nothing is static.", source: "Wilhelm/Baynes translation (Princeton, 1967).", note: "From Taoist and Confucian traditions. Interpretation varies across centuries. We note its cyclical framework, not its full cosmology." },
  { name: "Buddhism", origin: "Asian tradition", insight: "The Twelve Nidanas map the cycle of suffering and awakening.", source: "Bhikkhu Bodhi, 'Comprehensive Manual of the Dharma'.", note: "Multiple schools with different interpretations. Buddhism's purpose is liberation from cyclical existence—not optimization within it." },
  { name: "Hermetic Philosophy", origin: "Western esoteric tradition", insight: "The Principle of Rhythm: 'Everything flows, out and in; everything has its tides.'", source: "'The Kybalion' (1908).", note: "A philosophical system, not a religion. Practitioners interpret the principles differently." },
];

// ════════════════════════════════════════════════════════════════
// NARRATION SCRIPTS — read aloud by the browser (no files/hosting)
// ════════════════════════════════════════════════════════════════
const NARRATION = {
  foundation: "Before we begin, I want to share something foundational — something that ancient wisdom and plain observation both point to. Reality runs on pattern. Not chaos. Not randomness. Intelligent patterns, rhythms, and cycles that repeat with precision. This isn't philosophy. It's simply how things move. Now, most people spend their lives chasing outcomes. They want success. They want prosperity. They want the blessing. But wisdom asks a different question. Wisdom doesn't chase the outcome — it seeks to understand the system that produces the outcome. There's an old story about Solomon. When he was offered anything he wanted, he didn't ask for wealth or victory. He asked for the ability to understand how reality works — to read the patterns of life, and to act in harmony with them. That request is the beginning of real wisdom. Because whether you call the order behind life divine, or natural law, or simply the way things work — the recognition is the same. Life is patterned. And once you can read those patterns, everything changes. That's what we're here to build: the ability to recognize the patterns running through your own life, and to cooperate with them instead of fighting them. Let's begin.",
  nature: "Look at the natural world for a moment. Everything in it runs on pattern. A seed doesn't become a plant by accident. It follows a precise sequence — root, then sprout, then growth, then flower, then fruit, then rest. Every time. The seasons never shuffle themselves. Winter gives way to spring, spring to summer, summer to fall, and back again — the same order, repeating for as long as there have been seasons. The moon moves through its cycle in roughly twenty-nine and a half days, so consistent that entire civilizations built their calendars on it. The tides rise and fall with that same moon, a rhythm that has held for as long as there's been an ocean. And your own body runs on rhythms too. Your circadian cycle tracks the sun. Your sleep, your hormones, your heartbeat, your breath — all of it moves in measured time. Here's the point. This order isn't random, and it isn't chaotic. It's precise. It operates whether or not anyone notices it. It doesn't care whether you're religious, secular, spiritual, or skeptical. The patterns simply work. Now here's the insight that changes everything: human life runs on the same kind of order. Your consciousness moves through phases. Your relationships move through cycles. Your work has its seasons. Your inner life has its rhythms. None of it is random. And just as a farmer who understands the seasons knows when to plant and when to harvest, you can learn to recognize the phase you're in — and move with it, instead of against it. That's the whole skill. That's what we're building.",
  cost: "So what happens when you don't recognize the pattern you're in? When you fight the season instead of working with it? There are real consequences. Not punishment — just friction. Like trying to swim upstream. Let me name five of them. First, repetition. The same pattern keeps returning — different people, different jobs, different circumstances, but the same underlying structure, again and again. It repeats because there's something in it you haven't yet recognized. Second, friction and suffering. Life starts to feel effortful. You're constantly pushing against the timing of your own life, and it wears you down. Third, disconnection — from yourself, from the people around you, from your sense of purpose. That feeling of being out of step is often the signal that you're fighting what's actually happening. Fourth, lost opportunity. The right thing arrives, but you're in the wrong phase to receive it. The timing doesn't line up, and the moment passes. And fifth, exhaustion. Not the kind of tiredness that sleep fixes — a deeper exhaustion that comes from resisting reality day after day. Now, I want to be clear about something. None of this is a cosmic punishment. The order behind life doesn't punish you. It simply doesn't bend. When you move against the grain of how things actually work, you feel friction. And that friction is information. It's telling you: you're out of sync here — try aligning instead. Once you start reading the friction as feedback rather than failure, everything softens. You stop blaming yourself. And you start asking a better question — not what's wrong with me, but what is this moment actually asking of me?",
  phases: "Just as nature has its four seasons — always four, always in the same order — human life moves through twelve phases. Each one has a felt texture, something you can actually recognize in your own experience, and each one carries a name borrowed from an old map of the sky. Let me walk you through them. The first is Sparking — the feeling of something new wanting to begin. We call it Aries. Then Building — slow, patient, consistent work. That's Taurus. Then Learning, when the mind comes alive and wants to understand everything. That's Gemini. Then Feeling, when emotions rise to the surface and you need to go inward. That's Cancer. Then Expressing, the urge to be seen, to show what you carry. That's Leo. Then Refining, when you start noticing what's broken and needs fixing. That's Virgo. Then Relating, when partnership and connection move to the center. That's Libra. Then Transforming, when something has to die so something new can be born. That's Scorpio. Then Reaching, when a larger vision starts to emerge. That's Sagittarius. Then Constructing, the long, steady work of mastery. That's Capricorn. Then Liberating, the need to break free and reimagine. That's Aquarius. And finally Dissolving — tired, releasing, surrendering what's complete. That's Pisces. Twelve phases. And here's what matters: you're always in one of them. Not because someone assigned it to you, but because life genuinely moves this way. Your job isn't to force yourself into a phase you'd prefer. Your job is to recognize the one you're actually in, and cooperate with what it's asking. When you do, you move with the current. When you don't, you create friction. On the screen, you'll find all twelve. Take your time. Tap into any of them. See which texture sounds most like your life right now. Don't analyze it — feel for it. The one that resonates is usually the one you're in.",
  movements: "Within each of the twelve phases, there are four smaller movements. Think of it like a single season having an early stretch, a middle stretch, a late stretch, and a turning point. The first movement is Initiation. The phase is just appearing. You can sense it, but it isn't fully clear yet. Something's shifting, but you can't quite name it. The second is Expansion. Now the phase intensifies. The energy rises. Whatever's happening, you can't ignore it anymore — it's asking for your attention. The third is Contraction. This is the peak. You're brought face to face with what you've been avoiding. The truth of the phase becomes unavoidable. This is usually the hardest stretch, and the most important. And the fourth is Integration. The teaching has landed. What you learned becomes part of you — your new baseline — and you're ready for whatever comes next. Here's the part people most need to hear: you cannot skip a movement. You can't leap from Initiation straight to Integration and avoid the difficulty in the middle. The intensity of Expansion and Contraction is exactly what transforms you. When you try to skip ahead, you create suffering — you stay stuck, circling the same lesson. But when you cooperate with each movement, even the uncomfortable ones, transformation happens on its own. You don't have to force it. You just have to stop resisting it.",
  diagnostic: "Now it's your turn. Your body already knows which phase you're in — it's been telling you, in the form of energy, mood, and instinct. We just have to listen. I'm going to ask you three short questions. Answer them from your gut, not your head. This isn't a test, and there are no wrong answers. It's recognition. The first question asks about the texture of your life right now — how it actually feels to be you these days. The second asks which element feels most alive — fire, earth, air, or water. And the third asks what's calling you forward. Don't overthink any of them. Notice your first instinct, and trust it. When you've answered all three, the app will reflect back the phase you're most likely moving through, along with what it's asking of you. Take a breath, and begin when you're ready.",
  practice: "So you've recognized your phase. Now the real question: what do you actually do about it? Recognition without action is just insight. Cooperation is where the change happens. For every phase, there are things to lean into, and things to let go of. If you're in Sparking, the work is to begin — to make the decision you've been delaying, and to act before you feel completely ready. If you're in Building, it's the opposite — stop chasing the new, and deepen what's already in front of you. If you're in Feeling, the work is to slow down and go inward, even when the world is asking you to push. If you're in Transforming, it's to let what's ending actually end, without rushing to rebuild. Each phase has its own assignment. On the screen, you'll find what to do, what to avoid, and how to lead others while you're in this phase — all tailored to the phase you recognized. Read it slowly. Then pick one practice — just one — that feels most alive, and commit to it this week. You don't have to do everything. You just have to take one real step in the direction the phase is already moving. That's what alignment actually means in practice: not forcing, not performing — just doing what this season of your life is genuinely asking, while remaining fully yourself.",
  convergence: "You might be wondering — where does this framework come from? Is it just made up? Here's what's remarkable. Six distinct wisdom traditions, separated by thousands of miles and thousands of years, with no contact between them, each independently recognized similar patterns in how human transformation moves. The Ifá tradition of the Yoruba people in West Africa. Kabbalah, from Jewish mysticism. The I Ching, from ancient China. The pattern-maps woven through scripture. The stages of awakening mapped by Buddhism. And the principle of rhythm in Hermetic philosophy. Different languages, different cosmologies, different worlds — and yet they kept noticing the same thing: that life moves in cycles, that those cycles have stages, and that wisdom means learning to move with them. That convergence is the evidence. Not that anyone invented this, but that they were each describing something real. And here's the freeing part: you don't have to adopt any of their beliefs to use this. Whether you understand the order behind life as divine, or as natural law, or simply as the way things work — the patterns operate the same. We honor each of these traditions as living and whole, far richer than any summary. We're simply standing where they all happen to point.",
  timing: "Here's something that sets pattern literacy apart: each phase has a natural duration. It doesn't last forever, and it doesn't end on demand. It has its own timing. Some phases move quickly — the Sparking of a new beginning, or the active Learning phase, often run their course in three to four weeks. Others sit in the middle range — Building, Refining, Expressing — usually unfolding over a month to six weeks. And the deep teaching phases — Feeling, Transforming, Constructing, Dissolving — these take longer, sometimes six to ten weeks, because the lessons run deeper. Why does this matter? Because it changes the story you tell yourself. I'm stuck in this forever becomes I'm in a phase, and this phase has a timeline I can work with. That shift gives you back your agency. You can't control which phase you're in, and you can't rush it. But when you know roughly how long it lasts, you stop panicking. You settle in. You cooperate. You trust that the timeline will complete — because timelines always do.",
  alignment: "Let's talk about what actually opens up when you stop fighting your life and start cooperating with it. The first shift is that you stop blaming yourself. You realize you're not broken — you're in a phase, and that phase has a teaching. That alone takes an enormous weight off. The second shift is that you move from victim to student. Instead of asking why is this happening to me, you start asking what is this teaching me. Same circumstances — completely different relationship to them. The third shift is that you stop fighting and start cooperating. You move through the phase with clarity, instead of being dragged through it in confusion. And the fourth shift is that real agency returns. You know where you are in the cycle, and roughly how long it lasts. You can't control the phases, but you can absolutely work with them. Underneath all of it is a quieter truth: an intelligent order is running through your life right now. It isn't against you. When you recognize the phase you're in, and cooperate with what it's asking, things begin to flow — not because the difficulty vanishes, but because you're no longer alone inside it. Now let me be honest about what this does and doesn't do. People who practice this consistently report real change — more clarity, less repeating of old patterns, better decisions. But it isn't magic. It works when you genuinely recognize your phase, cooperate with it, and give it time. It won't change your circumstances on its own, and it won't work if you use it as an excuse to do nothing. This is a way of seeing — and seeing clearly is where every real change begins. You've now walked through the whole framework. You've recognized your phase. You understand what it's asking. The only question left is how far you want to take this.",
  summary: "Here it is — your pattern reading. Everything you recognized today, gathered in one place. The phase you're moving through. What it's asking of you. The shift it's inviting. The practice you chose, and the words you wrote along the way. Take a moment with it. Copy it, or keep it somewhere you'll see it again — because the real work begins now, in the days after you close this. You came in looking for an answer. You're leaving with something better: the beginning of literacy. The ability to read the patterns of your own life. Carry it well.",
};

// ════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ════════════════════════════════════════════════════════════════
const Card = ({ children, style = {}, accent, onClick, hover }) => (
  <div onClick={onClick} style={{
    background: "linear-gradient(135deg,#ffffff09,#ffffff03)",
    border: "1px solid #ffffff0E", borderRadius: "18px", padding: "20px",
    backdropFilter: "blur(12px)", boxShadow: "0 8px 32px #00000025,inset 0 1px 0 #ffffff0A",
    transition: "all .25s cubic-bezier(.4,0,.2,1)",
    ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
    ...(onClick ? { cursor: "pointer" } : {}), ...style,
  }}>{children}</div>
);

const Label = ({ children, color = "#A78BFA", size = "10px", style = {} }) => (
  <div style={{ fontSize: size, fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color, marginBottom: "10px", fontFamily: ff, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant = "primary", disabled, style: sx = {} }) => {
  const v = {
    primary: { background: "linear-gradient(135deg,#A78BFA,#7C3AED)", color: "#fff", border: "none", boxShadow: "0 8px 28px #7C3AED40" },
    ghost: { background: "#ffffff08", color: "#ffffff60", border: "1px solid #ffffff12" },
    gold: { background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1a1206", border: "none", boxShadow: "0 8px 28px #FBBF2430" },
    soft: { background: "#A78BFA14", color: "#C4B5FD", border: "1px solid #A78BFA30" },
  }[variant] || {};
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "13px 18px", borderRadius: "13px", fontSize: "12px", fontWeight: "700",
      letterSpacing: "1.5px", textTransform: "uppercase", cursor: disabled ? "default" : "pointer",
      fontFamily: ff, opacity: disabled ? .35 : 1, transition: "all .2s", ...v, ...sx,
    }}>{children}</button>
  );
};

// ════════════════════════════════════════════════════════════════
// PHASE WHEEL (interactive — tap a node to open that phase)
// ════════════════════════════════════════════════════════════════
const PhaseWheel = ({ size = 300, activeId, onSelect }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "8px auto" }}>
    <defs>
      {PHASES.map(p => (
        <radialGradient key={p.id} id={`g${p.id}`}><stop offset="0%" stopColor={p.color} stopOpacity=".18" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      ))}
    </defs>
    <circle cx={size/2} cy={size/2} r={size/2.7} fill="none" stroke="#ffffff0A" strokeWidth="1" />
    {PHASES.map((p, i) => {
      const a = (i/12)*Math.PI*2 - Math.PI/2;
      const x = size/2 + (size/2.9)*Math.cos(a);
      const y = size/2 + (size/2.9)*Math.sin(a);
      const on = activeId === p.id;
      return (
        <g key={p.id} style={{ cursor: "pointer" }} onClick={() => onSelect?.(p.id)}>
          {on && <circle cx={x} cy={y} r={20} fill={`url(#g${p.id})`} />}
          <circle cx={x} cy={y} r={on ? 15 : 11} fill={p.color + (on ? "40" : "20")} stroke={p.color} strokeWidth={on ? 2.5 : 1.5} />
          <text x={x} y={y+1} textAnchor="middle" dominantBaseline="central" fill={on ? "#fff" : p.color} fontSize={on ? "11" : "9"} fontWeight="700" fontFamily={ff}>{p.id}</text>
        </g>
      );
    })}
    <text x={size/2} y={size/2-6} textAnchor="middle" fill="#ffffff50" fontSize="10" fontFamily={ff} fontWeight="700" letterSpacing="1px">TAP A PHASE</text>
    <text x={size/2} y={size/2+10} textAnchor="middle" fill="#ffffff25" fontSize="8" fontFamily={ff} letterSpacing="2px">12 PHASES</text>
  </svg>
);

// ════════════════════════════════════════════════════════════════
// EXPANDABLE PHASE CARD — felt-name primary, astro secondary
// ════════════════════════════════════════════════════════════════
const PhaseCard = ({ phase, open, onToggle }) => (
  <div style={{
    background: open ? `linear-gradient(135deg,${phase.color}12,#ffffff03)` : "linear-gradient(135deg,#ffffff07,#ffffff02)",
    border: `1px solid ${open ? phase.color + "40" : "#ffffff0E"}`,
    borderRadius: "16px", overflow: "hidden", transition: "all .3s cubic-bezier(.4,0,.2,1)",
  }}>
    {/* Header — always visible, tappable */}
    <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", cursor: "pointer" }}>
      <div style={{ width: 42, height: 42, borderRadius: "12px", background: phase.color + "1A", border: `1px solid ${phase.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: phase.color, flexShrink: 0 }}>{phase.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", fontFamily: ff }}>{phase.felt}</div>
        <div style={{ fontSize: "12px", color: "#ffffff70", fontFamily: fs, fontStyle: "italic" }}>{phase.texture}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "10px", color: phase.color, fontFamily: ff, fontWeight: "700", letterSpacing: "1px" }}>{phase.astro}</div>
        <div style={{ fontSize: "16px", color: "#ffffff40", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s", marginTop: "2px" }}>⌄</div>
      </div>
    </div>
    {/* Body — expands */}
    {open && (
      <div style={{ padding: "0 18px 20px", animation: "fadeIn .3s ease" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "20px", background: ELEMENT_COLOR[phase.element] + "1A", color: ELEMENT_COLOR[phase.element], fontFamily: ff, fontWeight: "600" }}>{phase.element}</span>
          <span style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "20px", background: "#ffffff0A", color: "#ffffff60", fontFamily: ff, fontWeight: "600" }}>{phase.duration}</span>
        </div>
        {[
          { lbl: "The Work", color: "#38BDF8", txt: phase.work },
          { lbl: "What's Revealed", color: "#4ADE80", txt: phase.revealed },
          { lbl: "What to Release", color: "#EF4444", txt: phase.release },
        ].map((row, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "9px", fontWeight: "700", color: row.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "4px", fontFamily: ff }}>{row.lbl}</div>
            <div style={{ fontSize: "13px", color: "#ffffffB0", lineHeight: "1.55", fontFamily: fs }}>{row.txt}</div>
          </div>
        ))}
        <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "10px", background: phase.color + "10", border: `1px solid ${phase.color}25` }}>
          <div style={{ fontSize: "9px", fontWeight: "700", color: phase.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px", fontFamily: ff }}>The Shift</div>
          <div style={{ fontSize: "13px", color: "#ffffffD0", lineHeight: "1.55", fontFamily: fs, fontStyle: "italic" }}>{phase.transform}</div>
        </div>
      </div>
    )}
  </div>
);

// ════════════════════════════════════════════════════════════════
// PROSE BLOCK helper
// ════════════════════════════════════════════════════════════════
const Teach = ({ title, children, accent = "#FBBF24", italic }) => (
  <Card accent={accent} style={{ marginBottom: "16px", background: accent + "08" }}>
    {title && <Label color={accent} size="10px">{title}</Label>}
    <div style={{ fontSize: "15px", lineHeight: "1.65", color: "#ffffffC8", fontFamily: fs, fontStyle: italic ? "italic" : "normal" }}>{children}</div>
  </Card>
);

// ════════════════════════════════════════════════════════════════
// NARRATION PLAYER — Web Speech API, sentence-by-sentence with a
// live highlighting transcript. No audio files, no hosting.
// ════════════════════════════════════════════════════════════════
function splitSentences(text) {
  return (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [text]).map(s => s.trim()).filter(Boolean);
}

function NarrationPlayer({ text, accent = "#A78BFA" }) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const sentences = useMemo(() => splitSentences(text || ""), [text]);
  const [voices, setVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(0.95);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showText, setShowText] = useState(false);

  const playingRef = useRef(false);
  const idxRef = useRef(0);
  const voiceRef = useRef(null);
  const rateRef = useRef(0.95);
  const activeRef = useRef(null);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { voiceRef.current = voices.find(v => v.voiceURI === voiceURI) || null; }, [voiceURI, voices]);

  // Load available English voices (async on most browsers)
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith("en"));
      if (!all.length) return;
      setVoices(all);
      setVoiceURI(prev => {
        if (prev) return prev;
        const pref = all.find(v => /natural|google|samantha|serena|aria|jenny|daniel/i.test(v.name)) || all.find(v => v.default) || all[0];
        return pref.voiceURI;
      });
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { try { window.speechSynthesis.onvoiceschanged = null; window.speechSynthesis.cancel(); } catch {} };
  }, [supported]);

  // Stop speech whenever the text (segment) changes or component unmounts
  useEffect(() => {
    setPlaying(false); playingRef.current = false; setIdx(0); idxRef.current = 0;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {}
    return () => { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {} };
  }, [text]);

  const speakFrom = (start) => {
    if (!supported) return;
    try { window.speechSynthesis.cancel(); } catch {}
    let i = start;
    const next = () => {
      if (!playingRef.current) return;
      if (i >= sentences.length) { setPlaying(false); playingRef.current = false; setIdx(0); idxRef.current = 0; return; }
      setIdx(i); idxRef.current = i;
      const u = new SpeechSynthesisUtterance(sentences[i]);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = rateRef.current; u.pitch = 1; u.volume = 1;
      u.onend = () => { i += 1; next(); };
      u.onerror = () => { i += 1; next(); };
      activeRef.current = u;
      window.speechSynthesis.speak(u);
    };
    // tiny delay helps Chrome reliably start after a cancel
    setTimeout(next, 60);
  };

  const play = () => { if (!supported) return; setPlaying(true); playingRef.current = true; speakFrom(idxRef.current); };
  const pause = () => { setPlaying(false); playingRef.current = false; try { window.speechSynthesis.cancel(); } catch {} };
  const restart = () => { setIdx(0); idxRef.current = 0; setPlaying(true); playingRef.current = true; speakFrom(0); };
  const jumpTo = (i) => { setIdx(i); idxRef.current = i; if (playingRef.current) speakFrom(i); };
  const changeRate = (r) => { setRate(r); rateRef.current = r; if (playingRef.current) speakFrom(idxRef.current); };
  const changeVoice = (uri) => { setVoiceURI(uri); voiceRef.current = voices.find(v => v.voiceURI === uri) || null; if (playingRef.current) speakFrom(idxRef.current); };

  const pct = sentences.length ? Math.round(((playing || idx > 0 ? idx + (playing ? 1 : 0) : 0) / sentences.length) * 100) : 0;

  if (!supported) {
    return (
      <Card style={{ marginBottom: "20px" }}>
        <Label color={accent}>Narration</Label>
        <div style={{ fontSize: "13px", color: "#ffffff90", fontFamily: fs, lineHeight: "1.6" }}>
          Your browser doesn't support spoken narration. You can read the transcript below.
        </div>
        <div style={{ marginTop: "12px", fontSize: "14px", color: "#ffffffB0", fontFamily: fs, lineHeight: "1.7" }}>{text}</div>
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: "20px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={playing ? pause : play} aria-label={playing ? "Pause narration" : "Play narration"} style={{
          width: 48, height: 48, borderRadius: "50%", flexShrink: 0, cursor: "pointer", border: "none",
          background: `linear-gradient(135deg,${accent},#7C3AED)`, color: "#fff", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 20px ${accent}40`,
        }}>{playing ? "❚❚" : "▶"}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: accent, fontFamily: ff, fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>
              {playing ? "Narrating…" : idx > 0 ? "Paused" : "Listen"}
            </span>
            <span style={{ fontSize: "10px", color: "#ffffff45", fontFamily: ff }}>{idx + (playing ? 1 : (idx > 0 ? 1 : 0))}/{sentences.length}</span>
          </div>
          <div style={{ background: "#ffffff10", height: "5px", borderRadius: "20px", marginTop: "7px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${accent},#7C3AED)`, transition: "width .3s ease", borderRadius: "20px" }} />
          </div>
        </div>
        <button onClick={restart} aria-label="Restart" title="Restart" style={{ background: "#ffffff08", border: "1px solid #ffffff14", borderRadius: "10px", width: 38, height: 38, color: "#ffffff80", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>↺</button>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
        {voices.length > 0 && (
          <select value={voiceURI} onChange={e => changeVoice(e.target.value)} style={{
            flex: 1, minWidth: "120px", background: "#ffffff06", border: "1px solid #ffffff14", borderRadius: "9px",
            color: "#ffffff90", fontFamily: ff, fontSize: "11px", padding: "8px 10px", cursor: "pointer",
          }}>
            {voices.map(v => <option key={v.voiceURI} value={v.voiceURI} style={{ background: "#13132a" }}>{v.name.replace(/Microsoft|Google|\(.*?\)/g, "").trim()} · {v.lang}</option>)}
          </select>
        )}
        <div style={{ display: "flex", gap: "4px", background: "#ffffff06", border: "1px solid #ffffff14", borderRadius: "9px", padding: "3px" }}>
          {[0.8, 0.95, 1.15].map((r, i) => (
            <button key={r} onClick={() => changeRate(r)} style={{
              background: Math.abs(rate - r) < 0.01 ? accent + "30" : "transparent", color: Math.abs(rate - r) < 0.01 ? accent : "#ffffff60",
              border: "none", borderRadius: "6px", padding: "5px 9px", fontSize: "10px", fontFamily: ff, fontWeight: "700", cursor: "pointer",
            }}>{["Slow", "Normal", "Fast"][i]}</button>
          ))}
        </div>
        <button onClick={() => setShowText(s => !s)} style={{ background: "#ffffff06", border: "1px solid #ffffff14", borderRadius: "9px", color: "#ffffff70", fontFamily: ff, fontSize: "11px", padding: "8px 12px", cursor: "pointer" }}>
          {showText ? "Hide text" : "Show text"}
        </button>
      </div>

      {/* Live transcript — highlights the active sentence */}
      {showText && (
        <div style={{ marginTop: "14px", maxHeight: "200px", overflowY: "auto", padding: "14px", background: "#00000025", borderRadius: "12px", border: "1px solid #ffffff0A", lineHeight: "1.8", fontFamily: fs, fontSize: "14px" }}>
          {sentences.map((s, i) => (
            <span key={i} onClick={() => jumpTo(i)} style={{
              cursor: "pointer",
              color: i === idx && (playing || idx > 0) ? "#fff" : "#ffffff60",
              background: i === idx && (playing || idx > 0) ? accent + "30" : "transparent",
              borderRadius: "4px", padding: "1px 2px", transition: "all .2s",
            }}>{s} </span>
          ))}
        </div>
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════
export default function InitiationApp() {
  const [seg, setSeg] = useState(0);
  const [responses, setResponses] = useState({});
  const [answers, setAnswers] = useState({});
  const [dq, setDq] = useState(0); // current diagnostic question
  const [userPhase, setUserPhase] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });
  const [openPhase, setOpenPhase] = useState(1);
  const [navOpen, setNavOpen] = useState(false);
  const [returning, setReturning] = useState(null); // {seg, phaseId} if a prior session exists
  const scroller = useRef(null);

  // Submission state for the final conversion CTAs. We POST to
  // /api/initiation/complete with their diagnosed phase, practice
  // commitment, and reflections, then navigate to the chosen path.
  const [submitting, setSubmitting] = useState(null); // "certification" | "consult" | "community" | null
  const [submitError, setSubmitError] = useState(null);

  async function completeAndGo(ctaChosen) {
    if (submitting) return;
    if (!user.email.trim() || !user.email.includes("@")) {
      setSubmitError("Please include a valid email so we can follow up.");
      return;
    }
    setSubmitting(ctaChosen);
    setSubmitError(null);
    save(); // persist their work to localStorage one more time
    try {
      const res = await fetch("/api/initiation/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email.trim(),
          name: user.name.trim() || undefined,
          phaseId: userPhase?.id,
          phaseFelt: userPhase?.felt,
          phaseAstro: userPhase?.astro,
          practiceCommitment: (responses[6] || "").trim() || undefined,
          reflections: responses,
          ctaChosen,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Could not save your initiation.");
      }
      const data = await res.json();
      window.location.href = data.redirect || "/";
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(null);
    }
  }

  useEffect(() => {
    try {
      const s = localStorage.getItem("initiation-v2");
      if (s) {
        const d = JSON.parse(s);
        setUser(d.user || { name: "", email: "" });
        setResponses(d.responses || {});
        if (d.phaseId) setUserPhase(PHASES.find(p => p.id === d.phaseId));
        // Offer to resume only if they got past the very first screen
        if ((d.seg && d.seg > 0) || d.phaseId) setReturning({ seg: d.seg || 0, phaseId: d.phaseId });
      }
    } catch {}
  }, []);

  const save = (extra = {}) => {
    try {
      localStorage.setItem("initiation-v2", JSON.stringify({ user, responses, phaseId: userPhase?.id, seg, ts: new Date().toISOString(), ...extra }));
    } catch {}
  };

  const resolvePhase = (a) => {
    // Primary signal: Q1 texture (phase id). Q3 calling can confirm/override toward its phase.
    const q1 = a[1], q3 = a[3];
    let id = q1;
    if (q1 && q3 && q1 === q3) id = q1;       // strong agreement
    else if (q1) id = q1;                       // default to felt texture
    return PHASES.find(p => p.id === id) || null;
  };

  const answerDiagnostic = (qid, val) => {
    const next = { ...answers, [qid]: val };
    setAnswers(next);
    if (qid < 3) {
      setTimeout(() => setDq(d => Math.min(d + 1, 2)), 280);
    } else {
      const p = resolvePhase(next);
      if (p) { setUserPhase(p); setOpenPhase(p.id); save({ phaseId: p.id }); }
    }
  };

  const go = (i) => { setSeg(Math.max(0, Math.min(i, SEGMENTS.length - 1))); setNavOpen(false); scroller.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => { save(); go(seg + 1); };
  const S = SEGMENTS[seg];
  const progress = ((seg + 1) / SEGMENTS.length) * 100;

  return (
    <div style={{ background: "radial-gradient(ellipse at 20% 0%,#1a0533,transparent 55%),radial-gradient(ellipse at 90% 15%,#0c1445,transparent 50%),radial-gradient(ellipse at 50% 100%,#0a1628,transparent 60%),#06060F", color: "#fff", fontFamily: fs, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px);} to {opacity:1; transform:none;} }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px);} to {opacity:1; transform:none;} }
        textarea::placeholder, input::placeholder { color:#ffffff35; }
        textarea:focus, input:focus { outline:none; border-color:#A78BFA80 !important; }
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width:8px; } ::-webkit-scrollbar-thumb { background:#ffffff15; border-radius:4px; }
      `}</style>

      {/* ░░ WELCOME BACK OVERLAY ░░ */}
      {returning && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#06060Fee", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeIn .3s" }}>
          <div style={{ maxWidth: "400px", width: "100%", background: "linear-gradient(135deg,#13132a,#0a0a1a)", border: "1px solid #ffffff14", borderRadius: "20px", padding: "28px", textAlign: "center", animation: "slideUp .4s" }}>
            <div style={{ fontSize: "34px", marginBottom: "8px" }}>{userPhase ? userPhase.icon : "🪞"}</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff", fontFamily: ff, marginBottom: "8px" }}>
              {user.name ? `Welcome back, ${user.name}` : "Welcome back"}
            </div>
            <div style={{ fontSize: "14px", color: "#ffffff90", fontFamily: fs, lineHeight: "1.6", marginBottom: "22px" }}>
              {userPhase
                ? <>You recognized your phase as <span style={{ color: userPhase.color, fontWeight: "700" }}>{userPhase.felt}</span>. Pick up where you left off, or start fresh.</>
                : <>You started this once before. Continue where you left off, or start fresh.</>}
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <Btn variant="primary" onClick={() => { go(returning.seg); setReturning(null); }} style={{ width: "100%" }}>Continue →</Btn>
              {userPhase && <Btn variant="soft" onClick={() => { go(10); setReturning(null); }} style={{ width: "100%" }}>Jump to My Reading 🪞</Btn>}
              <Btn variant="ghost" onClick={() => { setUserPhase(null); setAnswers({}); setResponses({}); setDq(0); setSeg(0); try { localStorage.removeItem("initiation-v2"); } catch {} setReturning(null); }} style={{ width: "100%" }}>Start Fresh</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ░░ STICKY TOP BAR ░░ */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#06060Fcc", backdropFilter: "blur(16px)", borderBottom: "1px solid #ffffff0C" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "12px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setNavOpen(o => !o)} style={{ background: "#ffffff08", border: "1px solid #ffffff14", borderRadius: "10px", width: 38, height: 38, color: "#fff", fontSize: "16px", cursor: "pointer", flexShrink: 0 }}>☰</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#A78BFA", fontFamily: ff, fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>Twelvefold Institute · {seg + 1}/{SEGMENTS.length}</div>
                  <div style={{ fontSize: "8px", color: "#FBBF24", fontFamily: ff, fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px", opacity: 0.7 }}>Read the pattern. Align with the order.</div>
                </div>
                <Link href="/" style={{ fontSize: "9px", color: "#ffffff50", fontFamily: ff, fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>← Exit</Link>
              </div>
              <div style={{ fontSize: "15px", color: "#fff", fontFamily: ff, fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{S.icon} {S.title}</div>
            </div>
            {userPhase && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 12px", borderRadius: "20px", background: userPhase.color + "18", border: `1px solid ${userPhase.color}40`, flexShrink: 0 }}>
                <span style={{ color: userPhase.color, fontSize: "13px" }}>{userPhase.icon}</span>
                <span style={{ color: userPhase.color, fontSize: "11px", fontFamily: ff, fontWeight: "700" }}>{userPhase.felt}</span>
              </div>
            )}
          </div>
          <div style={{ background: "#ffffff0C", height: "3px", borderRadius: "20px", marginTop: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#A78BFA,#7C3AED)", width: `${progress}%`, transition: "width .4s ease" }} />
          </div>
        </div>

        {/* Slide-down nav */}
        {navOpen && (
          <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 18px 14px", animation: "fadeIn .2s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "8px" }}>
              {SEGMENTS.map((x, i) => (
                <button key={i} onClick={() => go(i)} style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", textAlign: "left",
                  background: i === seg ? "#A78BFA20" : i < seg ? "#4ADE8010" : "#ffffff06",
                  border: `1px solid ${i === seg ? "#A78BFA50" : i < seg ? "#4ADE8025" : "#ffffff0C"}`,
                  color: i === seg ? "#C4B5FD" : i < seg ? "#86EFAC" : "#ffffff70", cursor: "pointer", fontFamily: ff,
                }}>
                  <span style={{ fontSize: "13px" }}>{i < seg ? "✓" : x.icon}</span>
                  <span style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.short}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ░░ BODY ░░ */}
      <div ref={scroller} style={{ maxWidth: "780px", margin: "0 auto", padding: "24px 18px 120px" }}>
        <div key={seg} style={{ animation: "slideUp .35s ease" }}>

          {/* Narration — browser voice reads the segment aloud */}
          <NarrationPlayer text={NARRATION[S.kind] || ""} accent="#A78BFA" />

          {/* ───── SEGMENT CONTENT ───── */}
          {S.kind === "foundation" && (<>
            <Teach accent="#2DD4BF">Before we begin: a foundational truth that ancient wisdom and direct observation both point to.</Teach>
            <Card accent="#FBBF24" style={{ marginBottom: "16px" }}>
              <Label color="#FBBF24">Reality Runs on Pattern</Label>
              <div style={{ fontSize: "15px", lineHeight: "1.65", color: "#ffffffB0", fontFamily: fs }}>Reality operates according to intelligent patterns, rhythms, and developmental cycles. This isn't philosophy — it's how things actually move.</div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <Card accent="#ffffff50" style={{ padding: "16px" }}>
                <Label color="#ffffff70" size="9px">Most People Seek</Label>
                <div style={{ fontSize: "13px", color: "#ffffff90", fontFamily: fs, lineHeight: "1.7" }}>outcomes · blessings · success · prosperity</div>
              </Card>
              <Card accent="#FBBF24" style={{ padding: "16px" }}>
                <Label color="#FBBF24" size="9px">Wisdom Seeks</Label>
                <div style={{ fontSize: "13px", color: "#ffffffC0", fontFamily: fs, lineHeight: "1.7" }}>understanding of the system that produces them</div>
              </Card>
            </div>
            <Card accent="#C084FC" style={{ marginBottom: "16px", background: "linear-gradient(135deg,#C084FC0A,#A78BFA08)" }}>
              <Label color="#C084FC">The Question That Changes Everything</Label>
              <div style={{ fontSize: "15px", lineHeight: "1.65", color: "#ffffffC8", fontFamily: fs, fontStyle: "italic" }}>Solomon became wise not by asking for success, but by asking to understand how reality works — "give me the ability to read the patterns of life and act in harmony with them."</div>
            </Card>
            <Teach accent="#4ADE80">Whether you call that order divine, natural law, systems, or simply "how things work" — the recognition is the same. That recognition is what we're here to build.</Teach>
          </>)}

          {S.kind === "nature" && (<>
            <Teach accent="#FBBF24">Everything in nature runs on patterns — rhythms and cycles that repeat with observable precision.</Teach>
            <Card style={{ marginBottom: "16px" }}>
              <Label color="#38BDF8">Observable Order, Everywhere</Label>
              {[
                ["🌱", "A seed follows a precise sequence — root, sprout, growth, flower, fruit, rest."],
                ["🍂", "Seasons never shuffle: Winter → Spring → Summer → Fall. The same order, for millennia."],
                ["🌙", "The moon cycles in 29.5 days — consistent enough that civilizations were built on it."],
                ["🌊", "Tides rise and fall with the moon. The pattern has held for as long as there's been an ocean."],
                ["❤️", "Your body runs on rhythms: circadian cycles, sleep, hormones, heartbeat, breath."],
              ].map(([e, t], i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{e}</span>
                  <span style={{ fontSize: "14px", color: "#ffffffA8", fontFamily: fs, lineHeight: "1.5" }}>{t}</span>
                </div>
              ))}
            </Card>
            <Teach accent="#4ADE80" title="The Key Insight">Human life runs on the same kind of order. Your consciousness moves through phases. Your relationships have cycles. Your work has seasons. These patterns operate whether you're religious, secular, or skeptical — they don't depend on your beliefs.</Teach>
          </>)}

          {S.kind === "cost" && (<>
            <Teach accent="#FBBF24">When you fight the pattern that's actually running through your life, there are real consequences. Not punishment — just friction. Like swimming upstream.</Teach>
            {[
              ["Repetition", "The same pattern returns — new people, same structure — until you recognize what it's teaching."],
              ["Friction & Suffering", "Life becomes effortful. You struggle against timing and the natural rhythm of your own life."],
              ["Disconnection", "From yourself, others, purpose. The signal that you're fighting what's actually happening."],
              ["Lost Opportunity", "You miss the timing. The right thing arrives while you're in the wrong phase to receive it."],
              ["Exhaustion", "Bone-deep tiredness from resisting reality — the kind sleep doesn't fix."],
            ].map(([t, d], i) => (
              <Card key={i} accent="#EF4444" style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: "700", color: "#EF4444", fontSize: "12px", marginBottom: "5px", fontFamily: ff, textTransform: "uppercase", letterSpacing: "1px" }}>{t}</div>
                <div style={{ fontSize: "13px", color: "#ffffffA8", lineHeight: "1.5", fontFamily: fs }}>{d}</div>
              </Card>
            ))}
            <Teach accent="#4ADE80" title="This Is Feedback, Not Failure">The order doesn't punish. It just doesn't bend. The friction is information: you're out of sync — try aligning instead.</Teach>
          </>)}

          {S.kind === "phases" && (<>
            <Teach accent="#FBBF24">Just as nature has four seasons — always four, always in order — human life moves through 12 phases. Each has a felt texture you can recognize, and a name borrowed from an old map of the sky.</Teach>
            <Card style={{ marginBottom: "16px", textAlign: "center" }}>
              <PhaseWheel activeId={openPhase} onSelect={setOpenPhase} />
            </Card>
            <Label color="#A78BFA" size="11px" style={{ marginBottom: "12px" }}>Tap any phase to open it</Label>
            <div style={{ display: "grid", gap: "10px" }}>
              {PHASES.map(p => (
                <PhaseCard key={p.id} phase={p} open={openPhase === p.id} onToggle={() => setOpenPhase(openPhase === p.id ? null : p.id)} />
              ))}
            </div>
          </>)}

          {S.kind === "movements" && (<>
            <Teach accent="#FBBF24">Each phase moves through four movements — like spring having an early, middle, late, and turning point. You can't skip any of them.</Teach>
            <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
              {MICROS.map((m, i) => (
                <Card key={i} accent={m.color}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "8px", background: m.color + "20", color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff, fontWeight: "700", fontSize: "13px" }}>{i + 1}</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: m.color, fontFamily: ff }}>{m.name}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#ffffffA8", lineHeight: "1.5", fontFamily: fs, paddingLeft: "38px" }}>{m.desc}</div>
                </Card>
              ))}
            </div>
            <Teach accent="#F87144" title="Why It Matters">The intensity of Expansion and Contraction is what transforms you. Skip ahead and you create suffering. Cooperate with each movement and transformation happens naturally.</Teach>
          </>)}

          {S.kind === "diagnostic" && (<>
            {!userPhase ? (<>
              <Teach accent="#FBBF24">Your body already knows which phase you're in. Answer from your gut — this is recognition, not analysis.</Teach>
              {/* Question progress dots */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "18px" }}>
                {DIAGNOSTIC.map((_, i) => (
                  <div key={i} style={{ width: i === dq ? "24px" : "8px", height: "8px", borderRadius: "20px", background: answers[i + 1] ? "#4ADE80" : i === dq ? "#A78BFA" : "#ffffff15", transition: "all .3s" }} />
                ))}
              </div>
              {(() => {
                const q = DIAGNOSTIC[dq];
                return (
                  <Card style={{ animation: "fadeIn .3s" }}>
                    <Label color="#38BDF8">Question {q.id} of 3</Label>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", fontFamily: ff, marginBottom: "4px" }}>{q.question}</div>
                    <div style={{ fontSize: "13px", color: "#ffffff60", fontFamily: fs, fontStyle: "italic", marginBottom: "16px" }}>{q.hint}</div>
                    <div style={{ display: "grid", gridTemplateColumns: q.options.length > 5 ? "1fr 1fr" : "1fr", gap: "8px" }}>
                      {q.options.map(o => {
                        const sel = answers[q.id] === o.value;
                        return (
                          <button key={o.value} onClick={() => answerDiagnostic(q.id, o.value)} style={{
                            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", padding: "12px 14px", borderRadius: "12px", textAlign: "left",
                            background: sel ? o.color + "22" : "#ffffff05", border: `1px solid ${sel ? o.color : "#ffffff0E"}`, cursor: "pointer", transition: "all .2s",
                          }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: sel ? o.color : "#fff", fontFamily: ff }}>{o.label}</span>
                            <span style={{ fontSize: "11px", color: "#ffffff60", fontFamily: fs }}>{o.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                    {dq > 0 && <button onClick={() => setDq(d => d - 1)} style={{ marginTop: "14px", background: "none", border: "none", color: "#ffffff50", fontSize: "12px", fontFamily: ff, cursor: "pointer" }}>← back</button>}
                  </Card>
                );
              })()}
            </>) : (
              // Result reveal
              <div style={{ animation: "slideUp .4s" }}>
                <Card style={{ textAlign: "center", background: `linear-gradient(135deg,${userPhase.color}18,#ffffff03)`, border: `1px solid ${userPhase.color}40`, marginBottom: "16px" }}>
                  <div style={{ fontSize: "44px", marginBottom: "8px" }}>{userPhase.icon}</div>
                  <Label color={userPhase.color}>You're in the phase of</Label>
                  <div style={{ fontSize: "32px", fontWeight: "700", color: "#fff", fontFamily: ff, lineHeight: "1.1" }}>{userPhase.felt}</div>
                  <div style={{ fontSize: "14px", color: "#ffffff80", fontFamily: fs, fontStyle: "italic", marginTop: "4px" }}>{userPhase.texture}</div>
                  <div style={{ display: "inline-flex", gap: "8px", marginTop: "14px" }}>
                    <span style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px", background: userPhase.color + "1A", color: userPhase.color, fontFamily: ff, fontWeight: "700" }}>{userPhase.astro}</span>
                    <span style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px", background: "#ffffff0A", color: "#ffffff70", fontFamily: ff }}>{userPhase.duration}</span>
                  </div>
                </Card>
                <Teach accent={userPhase.color}>{userPhase.work}</Teach>
                <button onClick={() => { setUserPhase(null); setAnswers({}); setDq(0); }} style={{ width: "100%", background: "#ffffff06", border: "1px solid #ffffff12", borderRadius: "12px", padding: "12px", color: "#ffffff60", fontSize: "12px", fontFamily: ff, cursor: "pointer", letterSpacing: "1px" }}>↺ RETAKE</button>
              </div>
            )}
          </>)}

          {S.kind === "practice" && (userPhase ? (() => {
            const p = userPhase;
            return (<>
              <Card style={{ marginBottom: "16px", background: `linear-gradient(135deg,${p.color}14,#ffffff03)`, border: `1px solid ${p.color}35`, display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: 46, height: 46, borderRadius: "12px", background: p.color + "1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: p.color }}>{p.icon}</div>
                <div><div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", fontFamily: ff }}>{p.felt}</div><div style={{ fontSize: "12px", color: "#ffffff70", fontFamily: fs, fontStyle: "italic" }}>{p.texture} · {p.astro}</div></div>
              </Card>
              <Card accent="#4ADE80" style={{ marginBottom: "12px" }}>
                <Label color="#4ADE80">What To Do</Label>
                {p.doNow.map((x, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "14px", color: "#ffffffB0", fontFamily: fs, lineHeight: "1.5" }}><span style={{ color: "#4ADE80" }}>→</span>{x}</div>)}
              </Card>
              <Card accent="#EF4444" style={{ marginBottom: "12px" }}>
                <Label color="#EF4444">What To Avoid</Label>
                {p.avoid.map((x, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "14px", color: "#ffffffB0", fontFamily: fs, lineHeight: "1.5" }}><span style={{ color: "#EF4444" }}>✕</span>{x}</div>)}
              </Card>
              <Card accent="#FBBF24">
                <Label color="#FBBF24">If You Lead Others</Label>
                <div style={{ fontSize: "14px", color: "#ffffffB0", fontFamily: fs, lineHeight: "1.55" }}>{p.leadership}</div>
              </Card>
            </>);
          })() : (
            <Card style={{ textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px", opacity: .6 }}>🔍</div>
              <div style={{ fontSize: "15px", color: "#ffffff90", fontFamily: fs, marginBottom: "16px" }}>Recognize your phase first, then return here for practices tailored to it.</div>
              <Btn variant="soft" onClick={() => go(5)} style={{ width: "100%" }}>← Take the Diagnostic</Btn>
            </Card>
          ))}

          {S.kind === "convergence" && (<>
            <Teach accent="#FBBF24">Six distinct traditions — independent, across continents and centuries — recognized similar patterns in how transformation moves. The convergence is the evidence.</Teach>
            <Teach accent="#A78BFA" title="What This Means">Religious or secular, you can frame this as divine order, natural law, or simply how things work. The patterns operate the same. The order doesn't care how you name it.</Teach>
            {TRADITIONS.map((t, i) => (
              <Card key={i} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "700", color: "#A78BFA", fontSize: "13px", marginBottom: "4px", fontFamily: ff }}>{t.name}</div>
                <div style={{ fontSize: "11px", color: "#ffffff50", fontFamily: ff, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{t.origin}</div>
                <div style={{ fontSize: "13px", color: "#ffffffA8", lineHeight: "1.5", fontFamily: fs, marginBottom: "8px" }}>{t.insight}</div>
                <div style={{ fontSize: "11px", color: "#ffffff55", fontFamily: fs, fontStyle: "italic", paddingTop: "8px", borderTop: "1px solid #ffffff0A" }}><b style={{ color: "#ffffff70" }}>Sources:</b> {t.source}</div>
                <div style={{ fontSize: "10px", color: "#ffffff40", fontFamily: fs, lineHeight: "1.45", paddingTop: "6px" }}><b style={{ color: "#ffffff55" }}>Note:</b> {t.note}</div>
              </Card>
            ))}
          </>)}

          {S.kind === "timing" && (<>
            <Teach accent="#FBBF24">Each phase has a natural duration. Knowing it changes "I'm stuck forever" into "this has a timeline I can work with."</Teach>
            <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
              {[["21–28 days", "Fast-moving", "Sparking, Learning", "#FF6B6B"], ["28–42 days", "Medium", "Building, Refining, Expressing", "#FBBF24"], ["42–70 days", "Deep teaching", "Feeling, Transforming, Constructing, Dissolving", "#2DD4BF"]].map(([r, t, ex, c], i) => (
                <Card key={i} accent={c}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: c, fontFamily: ff }}>{r}</span>
                    <span style={{ fontSize: "11px", color: "#ffffff70", fontFamily: ff, textTransform: "uppercase", letterSpacing: "1px" }}>{t}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#ffffff80", fontFamily: fs }}>{ex}</div>
                </Card>
              ))}
            </div>
            <Teach accent="#38BDF8" title="Rhythm Intelligence">{userPhase ? `Your phase — ${userPhase.felt} — typically runs ${userPhase.duration}. You're not stuck. You're on a timeline, and timelines complete.` : "When you know your phase's duration, you gain agency: this has an end, and you can cooperate with it."}</Teach>
          </>)}

          {S.kind === "alignment" && (<>
            <Teach accent="#FBBF24">When you stop fighting what's happening and start cooperating with it, several things shift.</Teach>
            {[
              ["Stop Blaming Yourself", "You're not broken. You're in a phase, and that phase has a teaching."],
              ["Victim → Student", "Instead of \"Why me?\" you ask \"What is this teaching me?\" Same situation, different relationship to it."],
              ["Cooperate, Don't Fight", "You move through the phase with clarity instead of being dragged through it in confusion."],
              ["Real Agency Returns", "You know where you are and how long it lasts. You can't control the phases, but you can work with them."],
            ].map(([t, d], i) => (
              <Card key={i} accent="#4ADE80" style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: "700", color: "#4ADE80", fontSize: "12px", marginBottom: "5px", fontFamily: ff, textTransform: "uppercase", letterSpacing: "1px" }}>{t}</div>
                <div style={{ fontSize: "13px", color: "#ffffffA8", lineHeight: "1.5", fontFamily: fs }}>{d}</div>
              </Card>
            ))}
            <Teach accent="#2DD4BF" title="The Deepest Truth" italic>An intelligent order is running through your life right now. It's not against you. When you recognize your phase and cooperate with what it asks, things begin to flow — not because difficulty disappears, but because you're no longer alone in it.</Teach>
            <Teach accent="#38BDF8" title="Honest About What This Does">Many who practice this consistently report real shifts: clarity, less repetition, better decisions. It isn't magic. It works when you genuinely recognize your phase, cooperate with it, and give it time. It won't change circumstances by itself, and it won't work if used to justify inaction.</Teach>

            <Card style={{ marginTop: "20px", textAlign: "center", background: "linear-gradient(135deg,#A78BFA12,#7C3AED0C)", border: "1px solid #A78BFA35" }}>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>🪞</div>
              <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#ffffffC8", fontFamily: fs, marginBottom: "16px" }}>
                One last thing. Everything you've recognized today has been gathered into a personal reading — yours to keep.
              </div>
              <Btn variant="primary" onClick={next} style={{ width: "100%" }}>See Your Pattern Reading →</Btn>
            </Card>
          </>)}

          {S.kind === "summary" && (() => {
            const p = userPhase;
            const written = SEGMENTS.filter(x => (responses[x.id] || "").trim()).map(x => ({ seg: x, text: responses[x.id].trim() }));
            const committed = (responses[6] || "").trim(); // practice-segment reflection = their chosen practice
            return (<>
              {!p ? (
                <Card style={{ textAlign: "center", padding: "32px 20px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px", opacity: .6 }}>🔍</div>
                  <div style={{ fontSize: "15px", color: "#ffffff90", fontFamily: fs, marginBottom: "16px" }}>Your reading is built around the phase you recognize. Take the short diagnostic and it'll appear here.</div>
                  <Btn variant="soft" onClick={() => go(5)} style={{ width: "100%" }}>← Recognize Your Phase</Btn>
                </Card>
              ) : (<>
                {/* Hero */}
                <Card style={{ textAlign: "center", background: `linear-gradient(135deg,${p.color}1E,#ffffff03)`, border: `1px solid ${p.color}45`, marginBottom: "16px" }}>
                  <Label color={p.color} style={{ justifyContent: "center" }}>{user.name ? `${user.name}, your reading` : "Your Pattern Reading"}</Label>
                  <div style={{ fontSize: "48px", margin: "4px 0" }}>{p.icon}</div>
                  <div style={{ fontSize: "34px", fontWeight: "700", color: "#fff", fontFamily: ff, lineHeight: "1.05" }}>{p.felt}</div>
                  <div style={{ fontSize: "14px", color: "#ffffff85", fontFamily: fs, fontStyle: "italic", marginTop: "4px" }}>{p.texture}</div>
                  <div style={{ display: "inline-flex", gap: "8px", marginTop: "14px", flexWrap: "wrap", justifyContent: "center" }}>
                    <span style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px", background: p.color + "1A", color: p.color, fontFamily: ff, fontWeight: "700" }}>{p.astro}</span>
                    <span style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px", background: ELEMENT_COLOR[p.element] + "1A", color: ELEMENT_COLOR[p.element], fontFamily: ff, fontWeight: "700" }}>{p.element}</span>
                    <span style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px", background: "#ffffff0A", color: "#ffffff75", fontFamily: ff }}>{p.duration}</span>
                  </div>
                </Card>

                {/* What it's asking */}
                <Card accent={p.color} style={{ marginBottom: "12px" }}>
                  <Label color={p.color}>What This Phase Is Asking</Label>
                  <div style={{ fontSize: "14px", color: "#ffffffB8", lineHeight: "1.6", fontFamily: fs }}>{p.work}</div>
                </Card>

                {/* The shift */}
                <Card style={{ marginBottom: "12px", background: p.color + "0C", border: `1px solid ${p.color}25` }}>
                  <Label color={p.color}>The Shift</Label>
                  <div style={{ fontSize: "14px", color: "#ffffffC8", lineHeight: "1.6", fontFamily: fs, fontStyle: "italic" }}>{p.transform}</div>
                </Card>

                {/* Your committed practice */}
                <Card accent="#4ADE80" style={{ marginBottom: "12px" }}>
                  <Label color="#4ADE80">Your Practice This Week</Label>
                  {committed ? (
                    <div style={{ fontSize: "14px", color: "#ffffffC0", lineHeight: "1.6", fontFamily: fs, fontStyle: "italic" }}>"{committed}"</div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "#ffffff80", lineHeight: "1.6", fontFamily: fs }}>
                      You didn't note one yet. From your phase, a strong place to start: <span style={{ color: "#86EFAC" }}>{p.doNow[0].toLowerCase()}</span>.
                    </div>
                  )}
                </Card>

                {/* Timing reminder */}
                <Card accent="#38BDF8" style={{ marginBottom: "12px" }}>
                  <Label color="#38BDF8">Hold This Lightly</Label>
                  <div style={{ fontSize: "14px", color: "#ffffffB8", lineHeight: "1.6", fontFamily: fs }}>
                    {p.felt} typically runs <b style={{ color: "#7DD3FC" }}>{p.duration}</b>. You're not stuck — you're on a timeline, and timelines complete.
                  </div>
                </Card>

                {/* Reflections written along the way */}
                {written.length > 0 && (
                  <Card style={{ marginBottom: "12px" }}>
                    <Label color="#FBBF24">In Your Own Words</Label>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {written.map(({ seg: sg, text }) => (
                        <div key={sg.id} style={{ padding: "10px 12px", background: "#ffffff04", borderLeft: "2px solid #FBBF2450", borderRadius: "8px" }}>
                          <div style={{ fontSize: "9px", color: "#FBBF24", fontFamily: ff, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{sg.short}</div>
                          <div style={{ fontSize: "13px", color: "#ffffffA8", lineHeight: "1.55", fontFamily: fs, fontStyle: "italic" }}>{text}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Save / copy */}
                <Btn variant="soft" onClick={() => {
                  const lines = [
                    `MY PATTERN READING${user.name ? " — " + user.name : ""}`,
                    `Phase: ${p.felt} (${p.astro}) — ${p.texture}`,
                    `Element: ${p.element} · Typical duration: ${p.duration}`,
                    ``,
                    `What this phase is asking:`,
                    p.work,
                    ``,
                    `The shift: ${p.transform.replace(/[""]/g, '"')}`,
                    ``,
                    `My practice this week: ${committed || p.doNow[0]}`,
                    ...(written.length ? ["", "In my own words:", ...written.map(w => `• [${w.seg.short}] ${w.text}`)] : []),
                    ``,
                    `— Twelvefold Institute`,
                  ].join("\n");
                  try { navigator.clipboard.writeText(lines); alert("Your reading has been copied — paste it somewhere you'll see it again."); }
                  catch { alert("Select and copy your reading from the screen to keep it."); }
                }} style={{ width: "100%", marginBottom: "20px" }}>⧉ Copy My Reading to Keep</Btn>

                {/* Conversion */}
                <Card style={{ background: "linear-gradient(135deg,#A78BFA12,#7C3AED0C)", border: "1px solid #A78BFA35" }}>
                  <Label color="#A78BFA">Go Deeper</Label>
                  <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#ffffffC0", fontFamily: fs, marginBottom: "16px" }}>
                    This was the first reading. The certification teaches you to read any phase — your own, and others' — with depth and confidence.
                  </div>
                  <input placeholder="Your name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "13px", background: "#ffffff05", border: "1px solid #ffffff14", borderRadius: "11px", color: "#fff", fontFamily: fs, fontSize: "14px", marginBottom: "10px" }} />
                  <input placeholder="Your email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "13px", background: "#ffffff05", border: "1px solid #ffffff14", borderRadius: "11px", color: "#fff", fontFamily: fs, fontSize: "14px", marginBottom: "16px" }} />
                  <div style={{ display: "grid", gap: "9px" }}>
                    <Btn variant="primary" disabled={!!submitting} onClick={() => completeAndGo("certification")} style={{ width: "100%" }}>{submitting === "certification" ? "Saving…" : "Start the Certification →"}</Btn>
                    <Btn variant="gold" disabled={!!submitting} onClick={() => completeAndGo("consult")} style={{ width: "100%" }}>{submitting === "consult" ? "Saving…" : "Book a 1:1 Consultation"}</Btn>
                    <Btn variant="ghost" disabled={!!submitting} onClick={() => completeAndGo("community")} style={{ width: "100%" }}>{submitting === "community" ? "Saving…" : "Join the Community"}</Btn>
                  </div>
                  {submitError && (
                    <div style={{ marginTop: "12px", padding: "10px 14px", background: "#FF6B6B12", border: "1px solid #FF6B6B40", borderRadius: "10px", fontSize: "13px", color: "#FFB4B4", fontFamily: fs }}>
                      {submitError}
                    </div>
                  )}
                </Card>
              </>)}
            </>);
          })()}

          {/* ───── REFLECTION (kinds that have one) ───── */}
          {["foundation", "nature", "cost", "phases", "movements", "practice", "timing"].includes(S.kind) && (
            <Card style={{ marginTop: "20px" }}>
              <Label color="#FBBF24">Reflection</Label>
              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#ffffffC0", fontFamily: fs }}>
                {{
                  foundation: "What would change if you could read the patterns of your life accurately?",
                  nature: "Where do you already see patterns operating in nature or your own body?",
                  cost: "Which cost of misalignment resonates most right now?",
                  phases: "Which felt-texture sounds most like your life right now?",
                  movements: "Which movement feels most intense for you at the moment?",
                  practice: "Which of these practices feels most aligned with where you are?",
                  timing: "How would knowing your phase's duration change your approach?",
                }[S.kind]}
              </div>
              <textarea value={responses[S.id] || ""} onChange={e => setResponses({ ...responses, [S.id]: e.target.value })} placeholder="Take a moment…" style={{ width: "100%", boxSizing: "border-box", minHeight: "90px", background: "#ffffff05", border: "1px solid #ffffff12", borderRadius: "11px", padding: "13px", color: "#fff", fontFamily: fs, fontSize: "14px", resize: "vertical" }} />
            </Card>
          )}
        </div>
      </div>

      {/* ░░ STICKY BOTTOM NAV ░░ */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, background: "#06060Fdd", backdropFilter: "blur(16px)", borderTop: "1px solid #ffffff0C" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "12px 18px", display: "flex", gap: "10px" }}>
          <Btn variant="ghost" disabled={seg === 0} onClick={() => go(seg - 1)} style={{ flex: "0 0 auto" }}>←</Btn>
          <Btn variant="primary" onClick={next} disabled={seg === SEGMENTS.length - 1} style={{ flex: 1 }}>
            {seg === SEGMENTS.length - 1 ? "Complete ✓" : `Next: ${SEGMENTS[seg + 1].short} →`}
          </Btn>
        </div>
      </div>
    </div>
  );
}
