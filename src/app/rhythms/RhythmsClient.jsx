"use client";

import { useState, useEffect } from "react";

// ─── Persistence (localStorage with in-memory fallback) ─────────
// The original app held all state in memory only (built for artifacts).
// On the real site we persist the user's tracked rhythms and saved
// reflections so progress survives refresh and returns across visits.
const RKEY = { tracked: "tfi-rhythms-tracked", reflections: "tfi-rhythms-reflections" };
const _rmem = {};
const rLoad = (key, fallback) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const v = window.localStorage.getItem(key);
      if (v !== null) return JSON.parse(v);
    }
    return _rmem[key] !== undefined ? _rmem[key] : fallback;
  } catch { return fallback; }
};
const rSave = (key, val) => {
  _rmem[key] = val;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  } catch {}
};


// ─── PRINCIPLES ────────────────────────────────────────────────────────────────
const PRINCIPLES = [
  { n:"Cooperation", i:"🤝", d:"Everything is interconnected. Work with others and with what is. Resistance to cooperation is resistance to life itself.", violation:"You're forcing outcomes alone. You're fighting reality rather than working with it.", q:"Where are you refusing help or fighting what is, when cooperating would serve better?" },
  { n:"Timing", i:"⏱", d:"Right action at right time succeeds. Know when to act and when to wait.", violation:"You're forcing results before they're ready. You're treating urgency as a virtue.", q:"Where are you applying force right now where waiting would serve better?" },
  { n:"Awareness", i:"👁", d:"See clearly. What you're unconscious of controls you. Awareness is the prerequisite for all change.", violation:"You're operating on assumptions you've never examined. The pattern keeps repeating because you haven't seen it.", q:"What are you pretending not to know about your current situation?" },
  { n:"Patience", i:"🌿", d:"Everything unfolds at its own pace. Patience is active trust, not passivity.", violation:"You're measuring daily what needs to be measured monthly. You're quitting phases early because progress isn't visible.", q:"Where are you measuring progress on the wrong timeline?" },
  { n:"Discernment", i:"⚖️", d:"Distinguish truth from illusion. Not all advice is wise. Not all paths lead where they claim to.", violation:"You're following advice that sounds wise but doesn't fit your actual situation. You're trusting the wrong people.", q:"Whose counsel are you following — and have you verified their results match what you want?" },
  { n:"Growth", i:"📈", d:"Life is growth or death. There is no neutral. Seek challenges because comfort is a slow contraction.", violation:"You've been in the same phase too long. Comfort has become stagnation. You're avoiding the challenge that would grow you.", q:"What challenge are you currently avoiding under the name of being responsible?" },
  { n:"Flow", i:"💧", d:"Move with energy, not against it. When things are consistently hard, check alignment first.", violation:"Everything feels like a fight. You're forcing instead of cooperating. You've confused struggle with virtue.", q:"What in your current situation is consistently hard — and have you asked whether you're aligned with it?" },
  { n:"Rootedness", i:"🌳", d:"Stay grounded in reality, body, relationships, nature. Deep roots allow the most reach.", violation:"You're all momentum and no foundation. Building high without building deep. Disconnected from your body and close relationships.", q:"What foundational relationship or practice have you been neglecting in pursuit of the work?" }
];

// ─── RHYTHM DATA ───────────────────────────────────────────────────────────────
const R = {
  success: {
    name:"Success Rhythm", icon:"📊", color:"#FF6B6B",
    patternName:"The Mastery Path",
    cycle:["Learning","Practice","Failure","Refinement","Consistency","Mastery","Expansion"],
    duration:"3–7 years",
    teaching:"Every phase is necessary. Mastery is built through repetition and failure, not talent.",
    why:"Most people bail during Failure thinking it means they're not talented. They don't understand that Failure is a required phase, not a verdict. The rhythm doesn't care about your feelings about it.",
    traditions:[
      {t:"Ifá", tx:"The orisha teach through repetition and failure. Mastery is an act of devotion, not genius. Honor the process."},
      {t:"Kabbalah", tx:"Mastery builds through descent into Malkuth — grounding knowledge in material reality through practice. You cannot skip embodiment."},
      {t:"I Ching", tx:"Hexagram 4, Youthful Ignorance: wisdom begins by acknowledging what you don't know. The teacher appears when the student is genuinely ready."},
      {t:"Scripture", tx:"The wilderness years are preparation time. Forty years before public ministry. The process cannot be shortened through prayer alone."},
      {t:"Buddhism", tx:"Right effort applied consistently over time. The diamond mind is cut through repetition, not inspiration. Practice is the path."},
      {t:"Hermetic", tx:"Cause and effect: consistent practice is the cause; mastery is the inevitable effect. The principle makes no exceptions for impatience."},
    ],
    phases:[
      {
        id:"learning", name:"Learning", patternName:"The Apprentice's Ground", time:"6–18 months",
        what:"You're in apprenticeship mode. Studying how others do this. Building fundamental skills. Nothing visible yet — but essential work is happening.",
        alignment:["Genuinely humble about what you don't know","Learning from someone more experienced","Practicing what you're studying, not just reading","Asking questions instead of performing knowledge","Patient with how long this takes"],
        misalignment:["Thinking you already know enough to skip this phase","Learning in isolation with no mentor or feedback","Reading endlessly but never practicing","Performing knowledge to others rather than acquiring it","Wanting to be in Practice or Mastery already"],
        participation:"Find one person at least 5 years ahead of you in this area. Ask them one specific question this week — not about their success, but about their early failures.",
        reflection:"Am I genuinely humble about what I don't know — or am I performing learning while secretly believing I already understand?",
        micro:[{n:"Initiation",d:"Just started. Basics feel foreign. You're orienting."},{n:"Expansion",d:"Knowledge accumulating. Connections forming. Confidence building."},{n:"Contraction",d:"Hit a wall. Complexity is revealing itself. You realize how much you don't know."},{n:"Integration",d:"Foundations solid. Basics understood. Ready to practice."}]
      },
      {
        id:"practice", name:"Practice", patternName:"The Daily Showing Up", time:"6–12 months",
        what:"You've moved from learning to doing. Applying skills. Getting real feedback. Making mistakes. Progress is becoming visible.",
        alignment:["Showing up consistently regardless of how you feel","Actively seeking feedback instead of avoiding it","Adjusting based on feedback without defending","Tracking progress monthly, not daily","Trusting that showing up is the work"],
        misalignment:["Waiting until you feel ready before practicing","Avoiding situations where you might be evaluated","Defending your work instead of learning from criticism","Measuring daily progress and getting discouraged","Practicing alone without any external feedback"],
        participation:"Schedule a specific practice time — same time, same day — for the next 30 days. Get one piece of feedback this week from someone qualified to give it. Do not defend yourself when they speak.",
        reflection:"Am I actually doing the work — or am I still preparing to do the work?",
        micro:[{n:"Initiation",d:"Begun practicing. Early results appearing. Nervous and committed simultaneously."},{n:"Expansion",d:"In flow. Work producing results. Positive feedback. Momentum building."},{n:"Contraction",d:"Hit a plateau. Progress stalls. Doubt enters."},{n:"Integration",d:"Consistent habits solid. Practice rhythm found. Ready for the Failure phase."}]
      },
      {
        id:"failure", name:"Failure", patternName:"The Necessary Breakdown", time:"Weeks to months",
        what:"Something breaks down. Your approach stops working. You're forced to question what you thought you knew. This is the most important phase.",
        alignment:["Staying present with the breakdown instead of numbing","Looking for specific cause instead of generalizing","Asking someone experienced what they see","Not concluding you're not talented","Letting the failure teach instead of crush"],
        misalignment:["Quitting and telling yourself it wasn't for you","Concluding you don't have natural talent","Blaming external factors instead of examining your approach","Numbing the pain with distraction","Moving immediately to the next thing without learning"],
        participation:"Don't quit. Write down specifically what failed and why. Then ask someone who has succeeded in this area to look at your failure and tell you what they see that you can't.",
        reflection:"Am I treating this failure as evidence I'm not talented — or as the curriculum it actually is?",
        micro:[{n:"Initiation",d:"First signs of breakdown. Something isn't working."},{n:"Expansion",d:"Failure is undeniable. The scale of the problem is clear."},{n:"Contraction",d:"Deepest point. Temptation to quit is strongest here."},{n:"Integration",d:"The lesson is emerging. You can see what failed and why."}]
      },
      {
        id:"refinement", name:"Refinement", patternName:"The Careful Adjustment", time:"Months",
        what:"You've integrated lessons from failure. Adjusting your approach. Skill is deepening in ways that weren't possible before.",
        alignment:["Making targeted changes, not wholesale reinventions","Testing adjustments and observing results","More patient now — failure taught you patience","Seeking qualified feedback more deliberately","Focused on what works, not what looks impressive"],
        misalignment:["Making too many changes at once — can't isolate what's working","Reinventing everything instead of refining what worked","Still avoiding the feedback that would actually help","Wanting to skip to Mastery without doing the refining work","Optimizing for appearance rather than effectiveness"],
        participation:"Identify ONE thing from the Failure phase that needs to change. Change only that thing for two weeks. Observe results before changing anything else.",
        reflection:"Am I refining what actually needs to change — or changing everything to avoid sitting with what failed?",
        micro:[{n:"Initiation",d:"Identified what needs to change. Designing the adjustment."},{n:"Expansion",d:"Refinement working. Results improving."},{n:"Contraction",d:"Refinement hits its own limits."},{n:"Integration",d:"Refined approach is solid. Ready for Consistency."}]
      },
      {
        id:"consistency", name:"Consistency", patternName:"The Long Proving", time:"1–2 years",
        what:"You show up reliably. Results are predictable. Trust is building — in yourself and from others. This is the unglamorous phase that separates professionals from hobbyists.",
        alignment:["Showing up even when uninspired","Results are predictable — others can count on you","Built systems that support your consistency","Don't need external motivation to do the work","Building a track record, not just a skill"],
        misalignment:["Consistency is performance-based — only showing up when seen","Still waiting for inspiration before working","Relying on willpower with no systems","Skipping when life gets hard","Wanting the reputation for consistency without doing the time"],
        participation:"For the next 30 days: track your consistency to one person. Not results — just showing up. Report weekly.",
        reflection:"Am I consistent when no one is watching — or performing consistency when it's convenient?",
        micro:[{n:"Initiation",d:"Building habits. Consistency not automatic yet — requires intention."},{n:"Expansion",d:"Consistency becoming natural. Systems working. Results stable."},{n:"Contraction",d:"Life interrupts. A period of inconsistency. The question is whether you return."},{n:"Integration",d:"Consistency is now your baseline. Track record built. Ready for Mastery."}]
      },
      {
        id:"mastery", name:"Mastery", patternName:"The Deep Knowing", time:"Years",
        what:"Your skill is deep and internalized. You operate with ease that took years to build. Others seek your counsel. The work is no longer an effort.",
        alignment:["Solving problems intuitively — principles internalized","Able to teach others what you know","Continuing to learn even at this level","Humble about what the next level requires","Giving back to those in earlier phases"],
        misalignment:["Stopped learning because you consider yourself arrived","Protecting expertise rather than sharing it","Contemptuous of those in earlier phases","Confused mastery with certainty — stopped asking questions","Coasting on reputation rather than continuing to grow"],
        participation:"Find one person in the Learning phase of what you've mastered. Teach them one specific thing this month. Notice what teaching reveals about what you still don't know.",
        reflection:"Am I still genuinely learning at this level — or have I confused expertise with completion?",
        micro:[{n:"Initiation",d:"Realize you've crossed a threshold. Work feels fundamentally different."},{n:"Expansion",d:"Mastery deepening. Discovering new dimensions of what you thought you knew."},{n:"Contraction",d:"Mastery reveals its own edge. Humility returns."},{n:"Integration",d:"This is your operating level. You can teach. Ready for Expansion."}]
      },
      {
        id:"expansion", name:"Expansion", patternName:"The Multiplying Work", time:"Ongoing",
        what:"You're taking what you've built and growing it — more people, more reach, more impact. The skill is becoming service.",
        alignment:["Building systems and teams, not just doing the work alone","Teaching and multiplying your knowledge","Clear about what you're expanding and why","Still grounded in the original discipline","Expanding into service, not just scale"],
        misalignment:["Expanding to prove something rather than to serve","Moving too fast, losing quality and integrity","Lost touch with the craft in pursuit of scale","Expanding your ego rather than your contribution","Neglecting the foundation in pursuit of reach"],
        participation:"Identify one person or system you can build that carries the work beyond your direct involvement. Start this month.",
        reflection:"Am I expanding to serve — or expanding to prove something about myself?",
        micro:[{n:"Initiation",d:"The expansion impulse arrives."},{n:"Expansion",d:"Reach growing. Impact multiplying."},{n:"Contraction",d:"Expansion hits its first limit. Restructuring required."},{n:"Integration",d:"The expanded form is stable. The cycle begins again at a higher level."}]
      }
    ]
  },

  relationship: {
    name:"Relationship Rhythm", icon:"💬", color:"#FFD93D",
    patternName:"The Intimacy Cycle",
    cycle:["Connection","Trust","Vulnerability","Conflict","Repair","Deepening","Renewal"],
    duration:"Months to years",
    teaching:"Conflict leads to deepening, not ending. Avoiding it guarantees shallow relationships.",
    why:"Most people either avoid Conflict entirely (staying permanently shallow) or treat Conflict as a sign to leave. Neither leads to real intimacy. Real knowing of another requires moving through all seven phases.",
    traditions:[
      {t:"Ifá", tx:"Relationship is the mirror the orisha use to show you yourself. The person you chose is part of your curriculum."},
      {t:"Kabbalah", tx:"The other person is a vessel for divine light. Partnership is how you encounter what you cannot encounter alone."},
      {t:"I Ching", tx:"Hexagram 31, Influence: true attraction resonates at a deeper level. Two forces that genuinely align create something neither could alone."},
      {t:"Scripture", tx:"Iron sharpens iron. The covenant relationship is not comfort — it's formation. You are being shaped by who you've chosen."},
      {t:"Buddhism", tx:"The mirror of relationship shows you your attachments. Conflict reveals where you are unexamined. This is the teaching."},
      {t:"Hermetic", tx:"Correspondence: what you cannot face in yourself, you will face through another. The relationship reflects your inner state."},
    ],
    phases:[
      {id:"connection",name:"Connection",patternName:"The Recognition",time:"Weeks to months",what:"You're attracted. Curiosity is natural. Interest is growing. Don't rush or force what's unfolding.",alignment:["Present to what's actually happening, not projecting a future","Genuinely interested in who they are","Authentic rather than performing a version of yourself","Allowing the pace to unfold naturally","Noticing both attraction and concern honestly"],misalignment:["Already writing the whole future story","Performing rather than being seen","Ignoring early signals because you want this to work","Rushing to intimacy before it's been earned","Confusing chemistry for compatibility"],participation:"For the next two weeks, practice asking one genuine question per conversation — and actually listening without planning your response.",reflection:"Am I showing up as myself — or as who I think they want me to be?",micro:[{n:"Initiation",d:"First awareness of the other."},{n:"Expansion",d:"Interest deepening. More time, more sharing."},{n:"Contraction",d:"First doubts or complications arise."},{n:"Integration",d:"Clear about whether to continue."}]},
      {id:"trust",name:"Trust",patternName:"The Proving Ground",time:"Months",what:"You're testing if they keep their word. Small acts prove character. Trust builds through accumulated evidence, not declaration.",alignment:["Noticing whether they follow through on small things","Honest when they fall short rather than excusing it","Showing up as trustworthy yourself","Allowing trust to build at its natural pace","Distinguishing between a pattern and a single incident"],misalignment:["Trusting before you have evidence","Excusing repeated failures because you want to trust","Testing them in ways you haven't disclosed","Demanding trust without demonstrating it yourself","Suspicious of trustworthy behavior"],participation:"Identify one small agreement between you. Keep it perfectly this week. Notice whether they do too.",reflection:"Am I building trust through consistent action — or asking for trust I haven't yet earned?",micro:[{n:"Initiation",d:"Beginning to notice reliability patterns."},{n:"Expansion",d:"Trust building steadily."},{n:"Contraction",d:"First breach or test of trust."},{n:"Integration",d:"Trust is established or it isn't."}]},
      {id:"vulnerability",name:"Vulnerability",patternName:"The Real Revealing",time:"Months",what:"You're revealing more of who you really are — fears, wounds, needs. This is where real relationship begins.",alignment:["Sharing what's true without performing vulnerability","Sharing at the level the relationship can currently hold","Not using vulnerability to manipulate","Allowing them to be vulnerable without fixing it","Noticing how they respond to your realness"],misalignment:["Oversharing to manufacture intimacy","Performing vulnerability without actually being vulnerable","Sharing then panicking and taking it back","Using their vulnerability against them later","Unable to tolerate their real feelings when they appear"],participation:"Share one real thing this week — not a story, but an actual current feeling or fear — and let it sit without explaining or qualifying it.",reflection:"Am I actually vulnerable — or am I performing vulnerability to get a particular response?",micro:[{n:"Initiation",d:"First real sharing."},{n:"Expansion",d:"Deeper revelation. Acceptance experienced."},{n:"Contraction",d:"Vulnerability met poorly. Fear returns."},{n:"Integration",d:"Authentic relating is the baseline now."}]},
      {id:"conflict",name:"Conflict",patternName:"The Necessary Fire",time:"Variable",what:"Real disagreement arrives. This is not a problem — it's the path to knowing each other fully.",alignment:["Staying present instead of fleeing or attacking","Curious about their experience, not just defending yours","Fighting about the actual thing, not everything else","Not bringing up the past to win the present","Seeking resolution, not victory"],misalignment:["Avoiding conflict entirely, building resentment","Treating conflict as a sign the relationship is wrong","Fighting to win, not to understand","Bringing up old grievances when angry","Going silent to punish rather than to think"],participation:"In the next conflict: before responding, ask one genuine question about their experience. Don't defend until you've understood.",reflection:"Am I fighting to be understood — or fighting to win?",micro:[{n:"Initiation",d:"First real disagreement."},{n:"Expansion",d:"The conflict deepens. Real stakes visible."},{n:"Contraction",d:"Hardest moment. Most vulnerable to rupture."},{n:"Integration",d:"Moving toward resolution."}]},
      {id:"repair",name:"Repair",patternName:"The Returning",time:"Weeks to months",what:"You're navigating back to each other after rupture. Repair done well deepens the relationship beyond where it was before the conflict.",alignment:["Taking responsibility for your part without minimizing","Making repair without requiring theirs first","Patient — repair takes longer than the break","Not using the apology as a weapon","Noticing what the repair reveals about both of you"],misalignment:["Waiting for them to repair first","Apologizing without understanding what you're apologizing for","Using apology to end the conversation before the learning","Keeping score — 'I apologized, now you owe me'","Pretending repair happened before it actually has"],participation:"Write down your part in the most recent conflict — not their part, yours. Bring only what you've written to the next conversation.",reflection:"Am I taking genuine responsibility — or performing apology to end the discomfort?",micro:[{n:"Initiation",d:"First movement toward each other."},{n:"Expansion",d:"Repair deepening. Understanding growing."},{n:"Contraction",d:"A repair attempt fails. More work needed."},{n:"Integration",d:"Genuine repair complete. Relationship is different now."}]},
      {id:"deepening",name:"Deepening",patternName:"The Real Knowing",time:"Years",what:"You know each other fully. You've survived difficulty together. The relationship has real substance.",alignment:["Comfortable with who they actually are","Stopped trying to change the parts you can't change","Built real history together","Can disagree without the relationship feeling threatened","Choosing them with full knowledge, not romantic projection"],misalignment:["Still relating to who you hoped they'd be","Using history as leverage rather than foundation","Become so familiar you've stopped being curious","Stopped growing together","Staying out of familiarity, not genuine choice"],participation:"Tell them one specific thing you appreciate about who they actually are right now — not who they were, not who you hope they'll become.",reflection:"Am I in this relationship — or in my idea of this relationship?",micro:[{n:"Initiation",d:"Recognition that something fundamental has shifted."},{n:"Expansion",d:"Deepening is happening. Both feel it."},{n:"Contraction",d:"Relationship tested again at a deeper level."},{n:"Integration",d:"This is now a deep relationship. The foundation is real."}]},
      {id:"renewal",name:"Renewal",patternName:"The Chosen Again",time:"Ongoing",what:"The relationship continues to evolve. New chapters open. You choose each other again with full knowledge.",alignment:["Actively investing in the relationship, not just maintaining it","Curious about who they're becoming","Bringing new things to the relationship","Choosing them consciously, not habitually","Celebrating the relationship as a living thing"],misalignment:["Stopped investing — coasting on accumulated history","No longer curious about them as a person","Staying because leaving seems like too much effort","Relating to who they were 5 years ago","Confused stability with aliveness"],participation:"Plan one thing this month you've never done together. Not elaborate — genuinely new. Notice what it reveals.",reflection:"Am I in this relationship by choice — or by inertia?",micro:[{n:"Initiation",d:"Something new is possible."},{n:"Expansion",d:"New energy in the relationship."},{n:"Contraction",d:"Renewal requires releasing something old."},{n:"Integration",d:"The renewed relationship has new ground."}]}
    ]
  },

  healing: {
    name:"Healing Rhythm", icon:"💖", color:"#E8A87C",
    patternName:"The Wound Becoming Wisdom",
    cycle:["Recognition","Release","Rest","Reconstruction","Strengthening"],
    duration:"Months to years",
    teaching:"Healing has phases. Move through them fully; don't skip or rush.",
    why:"Unhealed wounds underlie most dysfunction. Most people deny the wound, or skip Rest and go straight to Reconstruction — then wonder why they're still broken. Rest is not optional. It's where the actual healing happens.",
    traditions:[
      {t:"Ifá", tx:"The wound that is acknowledged and honored becomes medicine. The orisha ask us to learn from our wounds, not to escape them."},
      {t:"Kabbalah", tx:"The broken vessels (Shevirat HaKelim) are not mistakes — they are the precondition for a higher form of wholeness."},
      {t:"I Ching", tx:"Hexagram 29, The Abysmal Water: moving through difficulty requires staying present rather than thrashing. The way out is through."},
      {t:"Scripture", tx:"The valley of the shadow of death is not the end — it is the path. Wholeness requires moving through, not around."},
      {t:"Buddhism", tx:"The first noble truth acknowledges suffering without flinching. Healing begins with honest recognition, not premature positivity."},
      {t:"Hermetic", tx:"The principle of polarity: what has been broken carries within it the intelligence of the healing. The wound knows its own medicine."},
    ],
    phases:[
      {id:"recognition",name:"Recognition",patternName:"The Truth Named",time:"Hours to weeks",what:"You're acknowledging the wound. Naming what happened. This is the beginning of freedom.",alignment:["Naming the wound specifically, not vaguely","Acknowledging what happened without minimizing it","Feeling the emotion that comes with recognition","Telling at least one trusted person","Not rushing past this into 'healing mode'"],misalignment:["Insisting you're fine when you're not","Minimizing what happened to protect others or yourself","Using spiritual language to bypass the actual pain","Already planning how to fix it before you've felt it","Performing strength instead of acknowledging injury"],participation:"Name the wound specifically to one trusted person. Not what you made it mean. Not what you'll do about it. What actually happened.",reflection:"Am I acknowledging what happened — or naming it just enough to feel like I have?",micro:[{n:"Initiation",d:"First awareness that something is wrong."},{n:"Expansion",d:"The scope of the wound becomes clear."},{n:"Contraction",d:"Overwhelming. Denial temptation strongest here."},{n:"Integration",d:"Clear-eyed acknowledgment. Ready to release."}]},
      {id:"release",name:"Release",patternName:"The Necessary Flood",time:"Days to months",what:"Emotions are moving through you — rage, grief, sorrow. This is healing, not breakdown.",alignment:["Allowing the emotion to move without flooding others","Expressing it safely — journal, move, speak with a professional","Not rushing it — release takes the time it takes","Distinguishing feeling from acting it out","Not numbing with substances or distraction"],misalignment:["Suppressing emotion because it's inconvenient","Flooding others with unprocessed emotion without consent","Using expression as performance rather than release","Rushing through it and declaring yourself done","Numbing with alcohol, screens, food, or constant busyness"],participation:"Set aside 20 minutes for deliberate release — not managed sharing, but actual feeling. Alone. Write, move, or speak aloud what wants to come out.",reflection:"Am I actually releasing — or performing release while keeping the real feeling locked underneath?",micro:[{n:"Initiation",d:"Emotion beginning to move."},{n:"Expansion",d:"Full release happening."},{n:"Contraction",d:"Exhaustion. Feels like it will never end."},{n:"Integration",d:"The wave has passed. Quiet clarity."}]},
      {id:"rest",name:"Rest",patternName:"The Sacred Pause",time:"Weeks to months",what:"You're slowing down. Recovering. Not producing. This is sacred. Don't rush it.",alignment:["Actually resting — not productive rest, just rest","Lowering output expectations without guilt","Receiving care from others","Trusting that rest is doing something","Protecting this time from your own impatience"],misalignment:["Calling it rest but secretly still producing","Feeling guilty for not being productive","Rushing through rest to get back to 'real life'","Refusing to receive care or support","Already planning Reconstruction before you've rested"],participation:"Cancel one non-essential obligation this week. Use that time to do nothing productive. Sit with what's there.",reflection:"Am I actually resting — or doing a quieter version of my normal busyness?",micro:[{n:"Initiation",d:"Slowing down. Resistance to rest is present."},{n:"Expansion",d:"Rest deepening. Body recovering."},{n:"Contraction",d:"Impatience. Wanting to rush back to normal."},{n:"Integration",d:"Rest is complete. A different kind of readiness."}]},
      {id:"reconstruction",name:"Reconstruction",patternName:"The New Architecture",time:"Months to years",what:"You're building differently. New beliefs, new patterns, new self-understanding. What was broken is being replaced, not just repaired.",alignment:["Building with new materials — not the old patterns","Patient with the slow pace of reconstruction","Getting professional support if needed","Celebrating incremental progress","Remaining open to the structure being different than expected"],misalignment:["Rebuilding the exact same structure that broke","Rushing reconstruction because you hate being in process","Refusing professional support","Expecting reconstruction to look like the old thing","Focused on when it'll be done rather than what it's becoming"],participation:"Identify one belief the wound revealed as false. Write a new one. Begin acting from the new belief for one week.",reflection:"Am I rebuilding what was — or building what should be?",micro:[{n:"Initiation",d:"New structure beginning to take shape."},{n:"Expansion",d:"Reconstruction accelerating."},{n:"Contraction",d:"Setbacks. Old patterns reassert themselves."},{n:"Integration",d:"New structure is solid. Ready for Strengthening."}]},
      {id:"strengthening",name:"Strengthening",patternName:"The Wound as Weapon",time:"Ongoing",what:"The wound is integrated. You're stronger precisely where you broke. You can now help others who are where you were.",alignment:["Can tell the story without being destabilized","Using what you learned in service of others","Not wearing the wound as an identity","Genuinely different than before — not performing difference","Compassionate toward others in earlier phases"],misalignment:["Wound has become your identity — you need it to define you","Helping others from an unhealed place","Can't tell the story without re-entering the pain","Used healing language without doing the actual healing","Using healing story to establish superiority"],participation:"Find one person in an earlier phase of what you healed. Offer them one specific thing you wish someone had offered you.",reflection:"Am I using my healed wound in service of others — or still using it as an identity?",micro:[{n:"Initiation",d:"First awareness of new strength."},{n:"Expansion",d:"The strength is real and growing."},{n:"Contraction",d:"A new challenge tests the new strength."},{n:"Integration",d:"The wound is wisdom. The cycle is complete."}]}
    ]
  },

  spiritual: {
    name:"Spiritual Growth", icon:"✨", color:"#A78BFA",
    patternName:"The Deepening Path",
    cycle:["Awakening","Testing","Purification","Surrender","Wisdom","Service"],
    duration:"Years to lifetime",
    teaching:"Spiritual growth is not escape. It's engagement with life at deeper levels.",
    why:"Most people get stuck in Testing — the disillusionment phase — and think their faith was wrong. It wasn't. Testing is the path deepening. The disillusionment is not failure; it's a shallow faith dissolving into something real.",
    traditions:[
      {t:"Ifá", tx:"Ori is the personal divine self that chose this path before birth. Spiritual growth is alignment with what Ori already knows."},
      {t:"Kabbalah", tx:"The Sefirot are dimensions to inhabit simultaneously, not rungs to climb. Growth is expansion of consciousness, not ascent away from earth."},
      {t:"I Ching", tx:"Hexagram 51, The Arousing: awakening comes as disturbance. The shock is not punishment — it is the teaching arriving."},
      {t:"Scripture", tx:"The narrow gate. Spiritual maturity requires passing through doors that feel like loss."},
      {t:"Buddhism", tx:"The three marks: impermanence, suffering, non-self. Spiritual growth is the capacity to hold these with equanimity, not their elimination."},
      {t:"Hermetic", tx:"What you call spiritual growth is the expansion of consciousness into alignment with the universal mind. This requires the dissolution of smaller constructs."},
    ],
    phases:[
      {id:"awakening",name:"Awakening",patternName:"The First Opening",time:"Hours to weeks",what:"You're called to something larger. Possibilities are opening. Something is genuinely stirring.",alignment:["Noticing the call without immediately building a system around it","Genuinely curious rather than performing spiritual interest","Allowing mystery rather than rushing to explanation","Following the thread without demanding it lead somewhere specific","Sharing with discernment rather than broadcasting"],misalignment:["Immediately building an identity around the awakening","Performing spirituality instead of living it","Trying to organize and explain what should remain mysterious","Proselytizing prematurely","Using awakening to feel superior to others"],participation:"This week: sit in silence for 15 minutes daily without agenda. Don't meditate 'correctly'. Just sit with what arises.",reflection:"Am I genuinely curious about what's opening — or building a spiritual identity to fill a different kind of emptiness?",micro:[{n:"Initiation",d:"The first stirring."},{n:"Expansion",d:"The call is deepening."},{n:"Contraction",d:"Doubt arrives."},{n:"Integration",d:"The call is clear."}]},
      {id:"testing",name:"Testing",patternName:"The Disillusionment",time:"Months to years",what:"Disillusionment arrives. You question everything you thought you knew. This is not failure — it's the path deepening.",alignment:["Staying engaged with the questions rather than fleeing to certainty","Allowing previous understanding to die without immediately replacing it","Seeking spiritual direction from someone who's been here","Distinguishing doubt from disbelief","Trusting the process even when trust is hardest"],misalignment:["Declaring your previous faith wrong and abandoning everything","Rushing to a new certainty to end the discomfort","Becoming cynical and using testing to justify spiritual withdrawal","Performing doubt as sophistication","Trying to protect others from testing rather than moving through it yourself"],participation:"Write down the specific beliefs being tested. Don't resolve them. Sit with them as questions for 30 days before reaching for answers.",reflection:"Am I moving through the testing — or using it as permission to stop growing?",micro:[{n:"Initiation",d:"First doubt arrives."},{n:"Expansion",d:"Disillusionment deepens."},{n:"Contraction",d:"Deepest questioning. Darkest phase."},{n:"Integration",d:"A sturdier faith emerging from the ashes of the shallow one."}]},
      {id:"purification",name:"Purification",patternName:"The Burning Off",time:"Months to years",what:"What doesn't belong to you is being released. Old identities are dissolving. This is transformation, not punishment.",alignment:["Cooperating with what's being released rather than fighting it","Getting support — this is not a solo process","Distinguishing what belongs to you from what you inherited","Grieving what's ending without trying to keep it","Trusting that something truer is emerging"],misalignment:["Fighting the process, trying to keep what's being released","Isolated — refusing support in the name of spiritual independence","Identifying with the difficulty rather than moving through it","Using purification language to avoid the actual work","Rushing to the other side without the actual release"],participation:"Identify one belief, identity, or behavior that belongs to your past and not your future. Grieve it this week. Do not replace it yet.",reflection:"Am I cooperating with what's being released — or using spiritual language to avoid the actual letting go?",micro:[{n:"Initiation",d:"Something is ending. You feel it."},{n:"Expansion",d:"The releasing is happening."},{n:"Contraction",d:"Grief. Resistance. The hardest part."},{n:"Integration",d:"Lighter. Different. Truer."}]},
      {id:"surrender",name:"Surrender",patternName:"The Release of Control",time:"Ongoing",what:"You stop fighting what is. You release the need to control outcomes. Something opens in the space that control was occupying.",alignment:["Distinguishing surrender from passivity — you still act, but differently","Releasing outcomes while continuing to do your part","Becoming more present as need to control future decreases","Noticing what fills the space control vacated","Helping from an open hand rather than a closed fist"],misalignment:["Confusing surrender with giving up","Using surrender language to avoid responsibility","Surrendering only what doesn't matter while controlling what does","Performing surrender without actually releasing","Surrendering to unhealthy things in the name of spirituality"],participation:"Name one outcome you've been gripping. Take one action toward it this week and then release the result completely.",reflection:"Am I genuinely surrendering — or performing surrender while still controlling everything that matters to me?",micro:[{n:"Initiation",d:"First glimpse of what surrender actually is."},{n:"Expansion",d:"Surrender deepening."},{n:"Contraction",d:"Temptation to take control back."},{n:"Integration",d:"A new way of acting — engaged but unattached."}]},
      {id:"wisdom",name:"Wisdom",patternName:"The Earned Knowing",time:"Years+",what:"You've integrated the journey. You see clearly. You hold complexity without collapsing. Wisdom is not information — it's earned understanding.",alignment:["Holding certainty loosely","Seeing multiple levels of reality simultaneously","Comfortable with paradox","Speaking from experience, not theory","Knowing what you know and what you don't"],misalignment:["Confused wisdom with information","Performing wisdom as a spiritual identity","Certain where wisdom requires humility","Speaking about others' paths with authority you haven't earned","Using wisdom to avoid being a student"],participation:"Find one area of your life where you're performing wisdom rather than living it. Become a genuine student there for 30 days.",reflection:"Is this wisdom I've actually earned — or wisdom I've read about and now perform?",micro:[{n:"Initiation",d:"Recognition that something has fundamentally changed."},{n:"Expansion",d:"Wisdom deepening."},{n:"Contraction",d:"A test of the wisdom."},{n:"Integration",d:"The wisdom is integrated. Ready for Service."}]},
      {id:"service",name:"Service",patternName:"The Offering",time:"Ongoing",what:"Your wisdom serves others. Your journey becomes someone else's map. Service is the completion of the cycle.",alignment:["Serving from abundance, not from wound","Serving what you've actually been through, not what you've read about","Knowing your lane — serving where you've been","Serving without requiring gratitude or recognition","Still a student in areas where you're also a teacher"],misalignment:["Serving to fill your own unmet needs","Helping others to avoid your own continued growth","Serving outside your lane — teaching what you haven't lived","Need to be seen as a guide more than need to actually guide","Stopped being a student"],participation:"Identify one person who is where you were five years ago spiritually. Offer them one hour of genuine presence this month — not advice, presence.",reflection:"Am I serving from genuine fullness — or from a wound that hasn't finished healing?",micro:[{n:"Initiation",d:"The call to serve arrives."},{n:"Expansion",d:"Service is real and landing."},{n:"Contraction",d:"Service reveals your own unfinished work."},{n:"Integration",d:"The cycle completes. The spiral deepens."}]}
    ]
  },

  emotional:{name:"Emotional Rhythm",icon:"🌊",color:"#FF9F5A",patternName:"The Weather Moving Through",cycle:["Trigger","Feeling","Processing","Understanding","Integration","Peace"],duration:"Hours to weeks",teaching:"Emotions move like weather. Let them flow through you.",why:"Most people either suppress emotions (creating stored pain) or are overwhelmed by them (losing function). Both are misaligned. There is a third option: feeling fully while remaining conscious.",traditions:[{t:"Ifá",tx:"Emotions are orisha energy moving through you. The emotion is not the problem — unconscious emotion is."},{t:"Kabbalah",tx:"Emotional healing is not suppression — it is transformation. The Nefesh serves the higher soul when it's made conscious."},{t:"I Ching",tx:"Water finds its way through every obstacle by following its nature. Emotions move the same way — the resistance is the problem."},{t:"Scripture",tx:"Jesus wept. David raged. Job lamented. The emotional life is not spiritually inferior — suppression is not holiness."},{t:"Buddhism",tx:"The second arrow is optional. The first arrow is the emotion. The second arrow is the resistance to it. Drop the second arrow."},{t:"Hermetic",tx:"Everything is vibration. Emotions are information moving through you. The question is only whether you can read the information."}],phases:[{id:"trigger",name:"Trigger",patternName:"The Activation",time:"Moments",what:"Something activates you. An event has touched something deeper.",alignment:["Noticing you've been activated before reacting","Pausing rather than immediately responding","Curious about what was touched","Not performing calm","Acknowledging the activation to yourself honestly"],misalignment:["Reacting without any pause","Performing composure while activation grows underground","Immediately judging the other person","Dismissing the activation as irrational","Acting out from the activation without realizing it"],participation:"When activated this week: before saying or doing anything, take 3 deliberate breaths and ask: 'What is this actually touching in me?'",reflection:"Am I responding to what's in front of me — or to what this situation reminded me of?",micro:[{n:"Initiation",d:"Something happens."},{n:"Expansion",d:"The activation spreads."},{n:"Contraction",d:"Urge to react is strongest."},{n:"Integration",d:"Noticed without reacting."}]},{id:"feeling",name:"Feeling",patternName:"The Wave",time:"Hours to days",what:"The emotion is present. Intensity is here. This is not a problem to solve — it's a process to move through.",alignment:["Allowing the emotion to be present","Locating it in your body rather than just your mind","Breathing into it rather than away from it","Not making the feeling wrong","Feeling it without acting it out on others"],misalignment:["Suppressing emotion through force of will","Immediately analyzing instead of feeling","Acting out the emotion on whoever is nearby","Performing the emotion for effect","Using substances or behavior to escape the feeling"],participation:"Find 10 minutes to sit with the emotion without trying to change, analyze, or express it. Just notice where it lives in your body.",reflection:"Am I actually feeling — or am I thinking about feeling?",micro:[{n:"Initiation",d:"The emotion arrives."},{n:"Expansion",d:"Full intensity."},{n:"Contraction",d:"Exhaustion. Feels like it will never end."},{n:"Integration",d:"The wave is passing."}]},{id:"processing",name:"Processing",patternName:"The Moving Through",time:"Hours to days",what:"The emotion needs to move. Journaling, speaking, physical movement.",alignment:["Choosing an appropriate outlet for the energy","Expressing without flooding or performing","Honest about what you're feeling, not what sounds better","Using movement if words aren't coming","Involving a qualified person if the emotion is large"],misalignment:["Processing in the wrong container — to someone who can't hold it","Flooding others with unprocessed material","Performing processing for effect","Using processing to stay in the emotion rather than move through it","Skipping processing entirely"],participation:"Process the current emotion in writing before speaking it. Write uncensored for 15 minutes. Then decide what, if anything, needs to be said.",reflection:"Am I processing to move through — or processing to stay in and be understood?",micro:[{n:"Initiation",d:"Expression beginning."},{n:"Expansion",d:"Processing deepening."},{n:"Contraction",d:"More comes up than expected."},{n:"Integration",d:"The expression is complete."}]},{id:"understanding",name:"Understanding",patternName:"The Pattern Revealed",time:"Hours to days",what:"You're seeing what the trigger revealed. What belief is underneath the emotion?",alignment:["Curious about the pattern rather than the story","Looking for your part, not just others' wrong","Noticing what this reminded you of","Identifying the belief underneath the feeling","Taking responsibility for your interpretation"],misalignment:["Using understanding to assign blame","Building a case rather than gaining insight","Understanding intellectually without integrating emotionally","Staying in the story rather than finding the pattern","Using understanding to feel superior"],participation:"Write: what did this trigger remind me of? What belief does this feeling protect? What would I have to believe for this to make sense?",reflection:"Am I seeking understanding to grow — or to build a case?",micro:[{n:"Initiation",d:"First glimpse of the pattern."},{n:"Expansion",d:"Understanding deepens."},{n:"Contraction",d:"Resistance to what you're seeing."},{n:"Integration",d:"The understanding is real."}]},{id:"integration",name:"Integration",patternName:"The Absorbed Teaching",time:"Hours to days",what:"The learning from the emotion is becoming part of you. You're different as a result of having moved through this.",alignment:["Can acknowledge the emotion and what it taught","Noticing what's changed in you","Bringing the learning into behavior","Not needing to keep processing the same event","Genuinely different, not performing difference"],misalignment:["Keep processing the same event without moving through","Intellectually understand but nothing has changed in how you act","Performing having integrated without the actual shift","Using the lesson as a new story rather than a new way to live","Jumping immediately to the next emotional event"],participation:"Identify one specific thing you're going to do differently as a result of what this emotion taught. Write it down. Do it once this week.",reflection:"Has something actually changed in me — or have I just produced a new story about this?",micro:[{n:"Initiation",d:"Something has shifted."},{n:"Expansion",d:"The integration is deepening."},{n:"Contraction",d:"Testing the integration."},{n:"Integration",d:"The learning is yours now."}]},{id:"peace",name:"Peace",patternName:"The Return",time:"Back to baseline",what:"Return to equilibrium. The cycle is complete.",alignment:["Not manufacturing peace before it arrives","Resting in the quiet without seeking the next wave","Acknowledging what you moved through","Genuinely different than before the cycle started","Available for the next cycle without dread"],misalignment:["Calling it peace before it arrives","Manufacturing calm to appear spiritual","Immediately diving into the next emotional event","Haven't actually changed — just got through it","Dreading the next activation rather than being ready"],participation:"Rest. Don't immediately process, analyze, or share. Sit in the quiet for one day and let the integration complete itself.",reflection:"Is this genuine peace — or am I just tired and calling it peace?",micro:[{n:"Initiation",d:"The quiet arrives."},{n:"Expansion",d:"Peace deepening."},{n:"Contraction",d:"A ripple — not the wave."},{n:"Integration",d:"The cycle is complete."}]}]},

  "life-season":{name:"Life Season Rhythm",icon:"🍂",color:"#6BCB77",patternName:"The Season You're In",cycle:["Preparation","Building","Expansion","Harvest","Transition","Renewal"],duration:"5–30 years",teaching:"Different seasons require different approaches. You cannot summer in the winter.",why:"Comparing your Building season to someone's Expansion season creates false failure. Understanding seasons prevents this — and helps you extract exactly what each season is actually for.",traditions:[{t:"Ifá",tx:"Each age of life has its own character and gift. The elder who tries to have the energy of youth wastes the gift of their actual season."},{t:"Kabbalah",tx:"There is a time for Chesed (expansion) and a time for Gevurah (contraction). Wisdom is knowing which is active."},{t:"I Ching",tx:"Heaven and earth follow cycles. Winter is not failed summer — it is winter. Honor the season."},{t:"Scripture",tx:"A time for everything under heaven. Every activity has its season. Wisdom is knowing the time."},{t:"Buddhism",tx:"Spiritual maturity doesn't transcend the seasons — it inhabits each one fully."},{t:"Hermetic",tx:"The principle of rhythm: everything flows and counterflows. Fighting the rhythm is the definition of misalignment."}],phases:[{id:"preparation",name:"Preparation",patternName:"The Invisible Work",time:"Years",what:"Learning, developing, getting ready. The invisible work. Foundation being laid beneath the surface.",alignment:["Embracing the learning without rushing to application","Building relationships and skill without demanding visibility","Patient with how long preparation takes","Seeking quality mentorship and instruction","Not confusing preparation with procrastination"],misalignment:["Impatient — wanting to be in Building or Expansion already","Visible before you're ready","Skipping the learning because it's not glamorous","Been in preparation so long it's become avoidance","Waiting for perfect preparation before beginning"],participation:"Identify the one skill that, if developed fully, would make everything else possible. Invest in that deliberately this month.",reflection:"Am I genuinely in preparation — or have I been using preparation to avoid the risk of beginning?",micro:[{n:"Initiation",d:"Recognizing this is preparation season."},{n:"Expansion",d:"Learning accelerating."},{n:"Contraction",d:"The season is lasting longer than expected."},{n:"Integration",d:"The preparation is complete. Ready for Building."}]},{id:"building",name:"Building",patternName:"The Foundation Season",time:"Years",what:"Creating foundation. Establishing yourself. Hard, unglamorous work. Essential.",alignment:["Doing unglamorous work without requiring recognition","Building quality rather than speed","Resisting comparison to people in later seasons","Investing in foundation even when invisible","Staying the course when building takes longer than expected"],misalignment:["Wanting the recognition of Harvest without doing the Building","Rushing building because impatient with the timeline","Comparing your Building to someone else's Harvest","Building for appearance rather than substance","Skipping foundation to reach the visible structure faster"],participation:"Identify one foundational thing you've been neglecting in pursuit of what's visible. Invest in it deliberately this week.",reflection:"Am I building for what lasts — or for what looks built?",micro:[{n:"Initiation",d:"Starting to build."},{n:"Expansion",d:"Building momentum."},{n:"Contraction",d:"The building is harder than expected."},{n:"Integration",d:"The foundation is real. Ready for Expansion."}]},{id:"expansion",name:"Expansion",patternName:"The Growing Season",time:"Years",what:"What you built is growing. Momentum is real. Don't stop now.",alignment:["Feeding the momentum without recklessness","Expanding what's working, not what looks impressive","Bringing others in without losing core quality","Staying grounded while reach extends","Clear about what the expansion is for"],misalignment:["Expanding in all directions instead of the right direction","Lost touch with foundation in pursuit of scale","Expanding ego alongside work","Overextending financially or personally","Forgotten what the expansion is actually for"],participation:"Identify the most productive direction for your current expansion. Put 80% of your expansion energy there this month.",reflection:"Am I expanding what matters — or expanding because expansion feels like success?",micro:[{n:"Initiation",d:"Expansion becoming possible."},{n:"Expansion",d:"Genuine momentum."},{n:"Contraction",d:"Growth reveals structural gaps."},{n:"Integration",d:"The expanded form is stable."}]},{id:"harvest",name:"Harvest",patternName:"The Reaping Season",time:"Years",what:"Reaping what you've sown. Abundance. Recognition. The season to receive what the Building was for.",alignment:["Actually receiving — not deflecting or minimizing the harvest","Generous with the abundance","Acknowledging the long work that made this possible","Preparing for Transition even in the midst of Harvest","Using the harvest to invest in the next cycle"],misalignment:["Not recognizing the Harvest because still in Building mode","Hoarding the abundance rather than circulating it","Taking full credit without acknowledging what you were given","Trying to extend the Harvest indefinitely","Becoming defined by the success rather than continuing to grow"],participation:"Receive one piece of recognition or abundance this week without deflecting, minimizing, or immediately redirecting. Just receive it.",reflection:"Am I actually receiving this harvest — or too busy to notice the season has changed?",micro:[{n:"Initiation",d:"The harvest is beginning."},{n:"Expansion",d:"Full abundance."},{n:"Contraction",d:"Harvest reaching its peak."},{n:"Integration",d:"Season completing. Transition approaches."}]},{id:"transition",name:"Transition",patternName:"The Between Season",time:"Years",what:"One chapter is ending. Another is beginning. The discomfort is the transition itself, not evidence of failure.",alignment:["Acknowledging what's ending rather than trying to extend it","Grieving the ending genuinely","Resisting the urge to rush into the next season","Getting support — transitions are hard","Staying present with the uncertainty"],misalignment:["Extending a season that's naturally ending","Rushing into the next season without grieving what ended","Mistaking the end of a season for the end of your story","Making major decisions in the middle of transition","So uncomfortable with the liminal space that you'll do anything to escape it"],participation:"Name specifically what is ending. Write it down. Hold a small ceremony of acknowledgment — alone, with someone trusted, or in writing.",reflection:"Am I honoring the ending — or trying to skip the grief by rushing to what's next?",micro:[{n:"Initiation",d:"First signals a season is ending."},{n:"Expansion",d:"Transition deepening."},{n:"Contraction",d:"Hardest part — neither the old nor the new."},{n:"Integration",d:"Transition complete. New season beginning."}]},{id:"renewal",name:"Renewal",patternName:"The Beginning Again",time:"New beginning",what:"You begin again. Different, wiser, more capable. The cycle deepens.",alignment:["Beginning with what you've learned, not what you've left behind","Genuinely open to what this season will be","Not rushing to replicate the last cycle","Trusting that you've been prepared","Present to the new season's specific character"],misalignment:["Trying to replicate the last cycle rather than inhabit the new","Exhausted from the last cycle and dragging into the new","Comparing this beginning to the previous cycle's peak","Haven't actually completed the previous cycle","Brought all the same patterns from the previous cycle"],participation:"Write down three things you're bringing into this new season intentionally — and one thing you're deliberately leaving behind.",reflection:"Am I genuinely beginning again — or starting the same cycle with different scenery?",micro:[{n:"Initiation",d:"A new season is beginning."},{n:"Expansion",d:"New energy and possibility."},{n:"Contraction",d:"The new requires releasing the old more completely."},{n:"Integration",d:"The new season is established."}]}]},

  financial:{name:"Financial Rhythm",icon:"💰",color:"#34D399",patternName:"The Money Maturity Path",cycle:["Earning","Managing","Saving","Investing","Multiplying","Stewardship"],duration:"5–20+ years",teaching:"Money amplifies character. Handle small sums with integrity and larger sums will follow.",why:"Most people skip foundation — jumping from Earning to Multiplying without managing, saving, or learning to invest properly. The foundation phases aren't boring — they're what makes everything else possible.",traditions:[{t:"Ifá",tx:"The orisha give wealth to those who have demonstrated the character to hold it. Wealth that comes before wisdom destroys."},{t:"Kabbalah",tx:"Spiritual development without material integrity is incomplete. The money is sacred."},{t:"I Ching",tx:"Hexagram 14, Possession in Great Measure: the sovereign possesses much while remaining humble."},{t:"Scripture",tx:"Faithful with small things, then given larger things. The sequence is the teaching."},{t:"Buddhism",tx:"Right livelihood is one of the eight paths. How you earn, manage, and use money is a spiritual practice."},{t:"Hermetic",tx:"Your relationship with small sums of money is identical to your relationship with large sums. Change the relationship."}],phases:[{id:"earning",name:"Earning",patternName:"The Value Builder",time:"Ongoing",what:"Developing value and income. Your skills are your wealth-building foundation.",alignment:["Income reflects real value provided","Developing skill while earning","Knowing market value and advocating for it","Building earning capacity, not just earning","Earning with integrity"],misalignment:["Underpaid and unwilling to advocate for yourself","Confused busyness with value","Earning but not developing — trading time without building capacity","Dishonest in your earning","Earning from work that extracts rather than develops you"],participation:"Research what someone with your skills earns in your market. If there's a gap, identify one specific thing to close it this month.",reflection:"Am I earning in a way that builds toward something — or just trading time for money?",micro:[{n:"Initiation",d:"Building earning capacity."},{n:"Expansion",d:"Income growing."},{n:"Contraction",d:"Earning hits a ceiling."},{n:"Integration",d:"Sustainable earning established."}]},{id:"managing",name:"Managing",patternName:"The Conscious Flow",time:"Ongoing",what:"Knowing where your money goes. Conscious spending. The most neglected phase.",alignment:["Knowing where every dollar goes","Making spending decisions consciously, not habitually","Aligning spending with actual values","Not in denial about financial reality","Adjusting without shame when patterns aren't working"],misalignment:["Avoiding looking at actual numbers","Spending unconsciously — habits without intention","Earning more but saving none more","In debt but don't know the details","Using spending to manage emotions"],participation:"This week: track every purchase, no matter how small. At the end of the week, look at where the money actually went. No judgment — just clarity.",reflection:"Do I know exactly where my money goes — or do I have a vague sense that I'm 'pretty good' about it?",micro:[{n:"Initiation",d:"Beginning to see the actual picture."},{n:"Expansion",d:"Conscious spending becoming habit."},{n:"Contraction",d:"Old habits reassert themselves."},{n:"Integration",d:"Conscious management is the baseline."}]},{id:"saving",name:"Saving",patternName:"The Reserve Building",time:"Years",what:"Building reserves. Creating security and options. The buffer between you and catastrophe.",alignment:["Paying yourself first before other obligations","Moving toward a specific target","Defined 'enough' for an emergency fund","Saving even in difficult months","Building toward specific future needs"],misalignment:["Saving what's left after spending (usually nothing)","No target — just vague intention","Raiding savings for non-emergencies","Promising to save 'when things are easier'","Saving without a clear purpose"],participation:"Set up an automatic transfer to savings this week — even if it's small. Automation removes the decision from willpower.",reflection:"Am I actually building a reserve — or promising myself I'll save when things get easier?",micro:[{n:"Initiation",d:"Beginning to save consistently."},{n:"Expansion",d:"Reserve is growing."},{n:"Contraction",d:"A setback depletes savings."},{n:"Integration",d:"The reserve is established."}]},{id:"investing",name:"Investing",patternName:"The Seed Planting",time:"Years",what:"Money working for you. The shift from earning to building wealth.",alignment:["Understanding what you're investing in before investing","Investing based on principle, not trends or tips","Patient — investing for years, not months","Diversifying deliberately","Continuing to invest through market volatility"],misalignment:["Investing in things you don't understand","Investing based on what's exciting right now","Expecting quick returns","Panic-selling when markets drop","Investing before managing debt and building savings"],participation:"If not yet investing: identify the one thing preventing you. Research that specific barrier this week.",reflection:"Am I investing based on understanding — or based on hope and what sounds exciting?",micro:[{n:"Initiation",d:"Beginning to invest."},{n:"Expansion",d:"Investment knowledge and assets growing."},{n:"Contraction",d:"Market event tests your commitment."},{n:"Integration",d:"Consistent investing is the habit."}]},{id:"multiplying",name:"Multiplying",patternName:"The Compound Season",time:"5–20 years",what:"Wealth compounding. Systems working while you sleep. The patient investor's reward.",alignment:["Patient with compound time horizons","Resisting temptation to touch long-term investments","Reinvesting returns","Diversified across time horizons","Not leveraged beyond ability to hold"],misalignment:["Impatient with the compound timeline","Taking profits too early","Constantly adjusting based on market news","Making emotional decisions based on comparison","Confused real wealth with visible spending"],participation:"Identify the investment you're most tempted to adjust unnecessarily. Leave it alone for 90 days.",reflection:"Am I trusting the compound process — or undermining it with impatience?",micro:[{n:"Initiation",d:"Compound effect becoming visible."},{n:"Expansion",d:"Wealth genuinely growing."},{n:"Contraction",d:"A test of the long-term commitment."},{n:"Integration",d:"Wealth is an established reality."}]},{id:"stewardship",name:"Stewardship",patternName:"The Wealth as Service",time:"Ongoing",what:"Using wealth wisely. Impact. Legacy. The wealth serving something beyond personal accumulation.",alignment:["Using wealth in service of something larger","Giving generously and strategically","Building legacy rather than just accumulating","Staying grounded despite abundance","Teaching what you've learned about money"],misalignment:["Made wealth your identity","Generous only when visible","Hoarding more than needed while others lack","Lost touch with what the wealth is actually for","Using wealth as power over others"],participation:"Identify one cause or person you could support with current resources. Give something specific this month — from the flow, not just the excess.",reflection:"Is this wealth serving my life and others — or serving my need to feel secure and significant?",micro:[{n:"Initiation",d:"Wealth becoming a vehicle for service."},{n:"Expansion",d:"Impact deepening."},{n:"Contraction",d:"Stewardship is tested."},{n:"Integration",d:"Legacy is being built."}]}]},

  leadership:{name:"Leadership Rhythm",icon:"👑",color:"#F59E0B",patternName:"The Authority Earned",cycle:["Responsibility","Competence","Trust","Influence","Service","Legacy"],duration:"10–30+ years",teaching:"Leadership is earned through demonstrated care, not conferred by title.",why:"Title without substance creates toxic environments. Real leadership is recognized, not declared. The gap between authority given and authority earned is where most organizational dysfunction lives.",traditions:[{t:"Ifá",tx:"The leader who serves the community receives the power of the community. The leader who uses the community destroys both."},{t:"Kabbalah",tx:"The righteous leader serves through Wisdom, Understanding, and Loving-kindness. Leadership that doesn't flow from these destroys."},{t:"I Ching",tx:"Hexagram 7, The Army: true leadership requires inner authority before outer authority."},{t:"Scripture",tx:"The greatest among you will be your servant. Leadership is not a crown — it's a towel and basin."},{t:"Buddhism",tx:"Right speech, right action, right livelihood — the leadership that elevates is built on embodying these principles."},{t:"Hermetic",tx:"Leaders create the environments they themselves embody. The culture is always a reflection of the leader."}],phases:[{id:"responsibility",name:"Responsibility",patternName:"The Ownership Phase",time:"2–5 years",what:"You own outcomes. No blaming circumstances. Accountability is the foundation of everything that follows.",alignment:["Owning mistakes without defensiveness","Fixing problems rather than explaining why they're not your fault","Reliable — when you say you'll do something, it's done","Bringing solutions, not problems","Holding yourself to a higher standard than you hold others"],misalignment:["Explanations for every failure that point outward","Technically not at fault for things that are functionally your problem","Reliable only when convenient","Bringing problems up without proposed solutions","Holding others to standards you don't apply to yourself"],participation:"Identify one thing in your domain that isn't working and that you've been internally blaming on something else. Own it. Bring one specific solution.",reflection:"Am I genuinely accountable — or do I have a sophisticated internal narrative that explains why everything is always someone else's responsibility?",micro:[{n:"Initiation",d:"Beginning to understand what real accountability means."},{n:"Expansion",d:"Accountability becoming a habit."},{n:"Contraction",d:"A major failure tests the commitment."},{n:"Integration",d:"Accountability is who you are."}]},{id:"competence",name:"Competence",patternName:"The Craft Development",time:"3–10 years",what:"Developed real leadership skills — not management tasks, but genuine human leadership.",alignment:["Seeking coaching and feedback deliberately","Studying how excellent leaders lead","Practicing leadership skills the way musicians practice scales","Genuinely curious about what makes people tick","Learning from every difficult situation rather than just surviving it"],misalignment:["Think leadership is something you already know","Avoiding feedback that would actually grow you","Managing tasks instead of leading people","Intimidated by superior leaders rather than learning from them","Leading the way you were led rather than learning to lead better"],participation:"Find one person whose leadership you admire. Ask them one specific question about how they developed a specific skill. Write down what they say.",reflection:"Am I developing as a leader — or managing my way through situations without actually growing?",micro:[{n:"Initiation",d:"Recognizing what real leadership requires."},{n:"Expansion",d:"Skills genuinely developing."},{n:"Contraction",d:"A situation exposes a gap."},{n:"Integration",d:"Real competence — not perfect, but genuine."}]},{id:"trust",name:"Trust",patternName:"The Believed In",time:"5–15 years",what:"People follow you because they believe in you. This cannot be demanded, manufactured, or shortcut.",alignment:["Doing what you say consistently","Telling the truth even when it costs you","Advocating for your people when it's hard","Consistent in private as in public","Protecting confidence — not using private information as currency"],misalignment:["Expecting trust you haven't earned","Inconsistent — people don't know which version of you will show up","Sacrificing team's interests for your own advancement","One person publicly and another privately","Using information people share in confidence against them"],participation:"Ask one person on your team honestly, in private: 'What's one thing I do that makes it harder to trust me?' Receive it without defense.",reflection:"Am I trusted — or am I assuming trust because of my title?",micro:[{n:"Initiation",d:"Trust beginning to accumulate."},{n:"Expansion",d:"Trust is palpable."},{n:"Contraction",d:"Trust is tested — a betrayal or mistake."},{n:"Integration",d:"Trust is deep and earned."}]},{id:"influence",name:"Influence",patternName:"The Extended Reach",time:"5–15 years",what:"Your reach extends beyond your immediate team. You shape culture and direction.",alignment:["Using influence to elevate, not to advance yourself","Clear on values and leading from them consistently","Influencing through example, not politics","Giving influence away rather than hoarding it","Knowing the difference between authority and influence"],misalignment:["Using influence for personal advancement","Leading with politics rather than principle","Influential publicly but inconsistent privately","Hoarding influence rather than developing leaders","Confusing your position's influence with your personal influence"],participation:"Identify one person with potential you haven't invested in. Schedule one hour with them this month — not to manage, to develop.",reflection:"Is my influence building something — or building my reputation?",micro:[{n:"Initiation",d:"Influence extending beyond direct reports."},{n:"Expansion",d:"Cultural influence is real."},{n:"Contraction",d:"Influence misused or tested."},{n:"Integration",d:"The influence is trustworthy and earned."}]},{id:"service",name:"Service",patternName:"The Leader as Ground",time:"10+ years",what:"You're most powerful when most devoted to elevating others.",alignment:["Genuinely caring about the people you lead","Measuring success by their growth","Removing obstacles rather than creating them","Accessible — not hiding behind your position","Leading with authority and humility simultaneously"],misalignment:["Leading for the status, not for the service","Tolerating poor performance in people you like","Making everything about your vision without caring about their development","Protected and unavailable","Confused being served with service"],participation:"Ask someone you lead what they need from you that they're not getting. Listen. Then actually provide it.",reflection:"Am I leading these people for their sake — or for mine?",micro:[{n:"Initiation",d:"Service becoming the actual orientation."},{n:"Expansion",d:"Leadership as service is real."},{n:"Contraction",d:"Service tested when it costs something."},{n:"Integration",d:"The leader is known for who they developed."}]},{id:"legacy",name:"Legacy",patternName:"The Living On",time:"Final phase+",what:"What you've built outlasts you. The people you developed carry it forward.",alignment:["Investing in developing people who will outlast your tenure","Building systems and cultures, not just results","Telling the truth about your own leadership failures","Actively preparing your replacement","Leading now as if what you leave behind is the point"],misalignment:["Building something only you can run","Haven't developed anyone who could replace you","Need to be irreplaceable to feel secure","More concerned with reputation than contribution","Never honestly named the damage your leadership has done"],participation:"Identify the person most capable of carrying on what you've built. What does your investment in their development look like this quarter?",reflection:"Am I building something that will outlast me — or something that requires my continued presence to function?",micro:[{n:"Initiation",d:"Legacy becoming conscious."},{n:"Expansion",d:"Investment in successors is real."},{n:"Contraction",d:"Something you built is tested."},{n:"Integration",d:"The legacy is established."}]}]},

  creativity:{name:"Creativity Rhythm",icon:"🎨",color:"#EC4899",patternName:"The Making Cycle",cycle:["Inspiration","Incubation","Creation","Revision","Completion","Renewal"],duration:"Weeks to months",teaching:"Creativity is a rhythm, not inspiration strikes. Show up regardless.",why:"The inspiration myth prevents people from creating at all. If you only work when inspired, you're in Phase 1 waiting for itself. Professionals show up for all six phases — not just the exciting one.",traditions:[{t:"Ifá",tx:"Creative work is the orisha working through human hands. The artist who shows up regardless of feeling gives the orisha a vessel."},{t:"Kabbalah",tx:"Binah is the womb of creation. The creative force descends through all the Sefirot before it manifests. You participate in creation."},{t:"I Ching",tx:"Hexagram 1, The Creative leads immediately to hexagram 2, The Receptive. Creation requires both the initiating force and the receptive response."},{t:"Scripture",tx:"In the beginning God created. Then rested. The creative and the rest are equally sacred."},{t:"Buddhism",tx:"The disciplined practice of showing up without attachment to the result. The middle way in creativity."},{t:"Hermetic",tx:"What exists in the invisible realm must be given form in the visible. The creator is the bridge between the two."}],phases:[{id:"inspiration",name:"Inspiration",patternName:"The Call to Create",time:"Hours to weeks",what:"Called to create something. An idea comes. You feel pulled. Receive it — don't force it into form yet.",alignment:["Receiving the inspiration without immediately forcing form","Capturing it — write, record, sketch","Not judging its quality in this phase","Allowing the fullness of the inspiration before executing","Genuinely excited, not performing excitement"],misalignment:["Dismissing inspiration because you're too busy","Immediately forcing it into a finished form","Judging it as not good enough before it has a chance","Needing certainty before letting yourself be inspired","Comparing your inspiration to finished work by others"],participation:"Capture every creative impulse this week — notebook, phone, voice memo. No editing. Just capture.",reflection:"Am I receiving inspiration — or waiting for inspiration that's already here?",micro:[{n:"Initiation",d:"The first spark."},{n:"Expansion",d:"The idea is alive and growing."},{n:"Contraction",d:"Doubt enters."},{n:"Integration",d:"Inspiration is clear enough to begin."}]},{id:"incubation",name:"Incubation",patternName:"The Gestation",time:"Days to weeks",what:"Living with the idea. Gathering. Not forcing. Letting it develop in the dark before bringing it to light.",alignment:["Living with the idea before forcing execution","Gathering inputs — references, research, related work","Allowing the unconscious to work","Resisting the urge to show it before it's ready","Trusting the gestation period"],misalignment:["Skipping incubation and immediately executing","Showing it to everyone before it has any form","Forcing the idea to develop faster than it needs","So impatient to create that you cut the gestation short","Been incubating so long it's become avoidance"],participation:"Before beginning the actual work: spend 3 days just living with the idea. Read, observe, gather — without creating yet.",reflection:"Am I genuinely incubating — or using incubation as sophisticated procrastination?",micro:[{n:"Initiation",d:"Gathering phase begins."},{n:"Expansion",d:"The idea is developing."},{n:"Contraction",d:"Nothing seems to be happening."},{n:"Integration",d:"Ready to create."}]},{id:"creation",name:"Creation",patternName:"The Making",time:"Weeks to months",what:"Doing the work. Showing up. Making something from nothing. The hardest and most essential phase.",alignment:["Showing up whether inspired or not","Making the work before evaluating the work","Protecting creative time from other demands","Producing without immediately judging","Making bad work as part of making good work"],misalignment:["Waiting for inspiration before sitting down","Editing before finishing — judging while creating","Letting others' needs interrupt creative time","'Working on it' for months without actual output","Producing a creativity performance without actual creation"],participation:"Set one non-negotiable hour per day for creative work for the next two weeks. Honor it as you would a client meeting.",reflection:"Am I actually making — or managing the appearance of making?",micro:[{n:"Initiation",d:"Beginning the actual work."},{n:"Expansion",d:"The work is flowing."},{n:"Contraction",d:"The middle — work is hard and messy."},{n:"Integration",d:"A draft exists. Something is there."}]},{id:"revision",name:"Revision",patternName:"The Refinement",time:"Weeks to months",what:"Making it better. Cutting what doesn't serve. This is where craft actually happens.",alignment:["Willing to cut what isn't working, even if you love it","Getting qualified feedback before declaring it done","Revising with discernment, not perfection","Knowing the difference between polishing and finishing","More interested in whether it works than whether you look good"],misalignment:["Refusing to cut anything because it cost effort","Declaring revision done to end the discomfort","Getting feedback from people who'll tell you it's great","Revising to improve versus revising to delay completion","Revising so long it's become a shield against sharing"],participation:"Share a current work-in-progress with someone qualified to evaluate it. Ask them specifically what isn't working.",reflection:"Am I revising to improve — or revising to delay having to share it?",micro:[{n:"Initiation",d:"First revision pass."},{n:"Expansion",d:"Work is genuinely improving."},{n:"Contraction",d:"Revision reveals how much more work is needed."},{n:"Integration",d:"The work is ready."}]},{id:"completion",name:"Completion",patternName:"The Release",time:"Days to weeks",what:"Finishing and releasing. Done is not perfect. The work belongs to whoever receives it now.",alignment:["Declaring it done and releasing it","Not improving past the point of diminishing returns","Tolerating the vulnerability of sharing","Separating your worth from the work's reception","Moving to the next project without clinging"],misalignment:["Keeping working past done to avoid releasing","Waiting for perfect before sharing","Can't separate worth from how work is received","Releasing it then immediately disowning it","Finished but telling yourself it isn't done yet"],participation:"Identify one piece of work you've been 'almost finishing' for more than a month. Release it this week.",reflection:"Am I completing — or perpetually approaching completion?",micro:[{n:"Initiation",d:"The work is done enough."},{n:"Expansion",d:"Releasing is happening."},{n:"Contraction",d:"The vulnerability of reception."},{n:"Integration",d:"The work is in the world."}]},{id:"renewal",name:"Renewal",patternName:"The Empty Before the Full",time:"Variable",what:"The creative cycle completes. Rest. Allow the emptiness. Then begins again.",alignment:["Actually resting between cycles","Not immediately starting the next project","Acknowledging what was made","Allowing the emptiness before it fills again","Trusting the rhythm will return"],misalignment:["Immediately starting the next project to avoid the emptiness","Addicted to being in creation — can't tolerate the quiet","Not acknowledging or celebrating what was made","Afraid the creativity won't return","Confused productivity with creative aliveness"],participation:"After completing a project: take a deliberate rest from that work for one full week before starting the next.",reflection:"Am I resting — or afraid that resting means the creativity won't return?",micro:[{n:"Initiation",d:"The completion."},{n:"Expansion",d:"Rest deepening."},{n:"Contraction",d:"Impatience — wanting to create again."},{n:"Integration",d:"Ready for the next cycle."}]}]},

  wisdom:{name:"Wisdom Rhythm",icon:"📚",color:"#06B6D4",patternName:"The Earned Understanding",cycle:["Experience","Reflection","Discernment","Application","Understanding"],duration:"Lifetime",teaching:"Wisdom is earned through experience + reflection + application, not reading.",why:"Knowledge is what you know. Wisdom is what you've lived. You can read every book about grief and understand nothing about grief. You can live one deep loss and understand everything that matters.",traditions:[{t:"Ifá",tx:"Wisdom is remembering what was already known. Reading is not remembering — living is."},{t:"Kabbalah",tx:"Chokhmah is the flash of lightning — direct knowing that arrives before thought. Wisdom requires lived experience to develop."},{t:"I Ching",tx:"The 64 hexagrams are not descriptions to memorize — they are situations to be lived. Wisdom comes from recognition."},{t:"Scripture",tx:"The fear of the Lord is the beginning of wisdom. Not the understanding — the encounter. Wisdom begins in encounter, not information."},{t:"Buddhism",tx:"Wisdom comes through the teacher, the teaching, and the community (lived practice). All three required."},{t:"Hermetic",tx:"Know thyself. Not information about yourself — the ongoing inquiry that lived experience makes possible."}],phases:[{id:"experience",name:"Experience",patternName:"The Living",time:"Ongoing",what:"Living through situations — the good and the hard. Both are required. Wisdom needs a full range.",alignment:["Fully present to what's happening, not managing it","Allowing experiences to affect you","Not numbing or avoiding the difficult ones","Engaging with life rather than curating it","Trusting that everything is curriculum"],misalignment:["So busy managing experience that you don't actually have it","Avoiding experiences that might be uncomfortable","Spectating rather than participating","Curating life so carefully that nothing surprising can happen","Processing experience in real time rather than allowing it to land"],participation:"This week: be fully present in one situation without managing it. Don't check your phone, don't think about how you'll describe it later. Just be there.",reflection:"Am I actually having experiences — or managing them from a safe distance?",micro:[{n:"Initiation",d:"Entering a new experience."},{n:"Expansion",d:"The experience is fully present."},{n:"Contraction",d:"The experience is more than expected."},{n:"Integration",d:"The experience is complete."}]},{id:"reflection",name:"Reflection",patternName:"The Looking Back",time:"Hours to weeks",what:"Examining what happened. Not rushing past. Taking time to understand what you moved through.",alignment:["Reflecting before drawing conclusions","Examining your own role, not just others'","Willing to be changed by what you see","Reflecting with a trusted other when appropriate","Creating deliberate reflective space"],misalignment:["Rushing from experience to experience without reflection","Reflecting to build a case, not to understand","Reflecting to confirm what you already believed","Never examining your own contribution to difficult situations","Using reflection as another form of avoidance"],participation:"Write for 20 minutes about a significant recent experience — not to share, just to understand. What happened? What did I contribute? What did it show me?",reflection:"Am I reflecting to learn — or to confirm what I already think?",micro:[{n:"Initiation",d:"Beginning to look back."},{n:"Expansion",d:"Reflection deepening."},{n:"Contraction",d:"Reflection reveals something uncomfortable."},{n:"Integration",d:"The reflection is complete."}]},{id:"discernment",name:"Discernment",patternName:"The Separating",time:"Days to weeks",what:"Separating signal from noise. Seeing what was actually happening beneath the surface.",alignment:["Distinguishing between what happened and what you made it mean","Seeing multiple perspectives on the same event","Recognizing your own biases in your interpretation","Asking: what is the teaching underneath the event?","Holding ambiguity — not every experience resolves cleanly"],misalignment:["Collapsing what happened and your interpretation of it","Seeing events only from your own perspective","Certain when uncertainty is more honest","Rushing to the lesson rather than sitting with the ambiguity","Using discernment as a way to judge others"],participation:"Take one recent difficult experience. Write: what actually happened (facts only). What you made it mean. What else it could mean.",reflection:"Am I seeing clearly — or am I seeing what confirms what I already believe?",micro:[{n:"Initiation",d:"Beginning to see more clearly."},{n:"Expansion",d:"Discernment deepening."},{n:"Contraction",d:"Discernment reveals something you don't want to see."},{n:"Integration",d:"The discernment is clear."}]},{id:"application",name:"Application",patternName:"The Testing",time:"Ongoing",what:"Using what you've learned in real situations. This is how wisdom gets verified.",alignment:["Applying what you've learned to current situations","Noticing when old wisdom applies and when it doesn't","Willing to be wrong about your application","Testing wisdom in small situations before high-stakes ones","Updating understanding when application reveals gaps"],misalignment:["Knowing the wisdom but not applying it when it's hard","Applying old wisdom to new situations without checking if it fits","Certain your understanding is complete","Applying wisdom from a pedantic position rather than a humble one","Applying wisdom to others' situations more easily than your own"],participation:"Identify one piece of hard-won wisdom you're not currently applying to your own most difficult situation. Apply it this week.",reflection:"Am I applying what I know — or keeping wisdom as theory to protect myself from having to live it?",micro:[{n:"Initiation",d:"Applying the learning."},{n:"Expansion",d:"The application is working."},{n:"Contraction",d:"Application is harder than expected."},{n:"Integration",d:"The wisdom is tested and verified."}]},{id:"understanding",name:"Understanding",patternName:"The Deep Knowing",time:"Ongoing",what:"The understanding that transcends the specific event. This is wisdom — it transfers to situations you haven't encountered.",alignment:["Wisdom generalizes — applies beyond the original context","Holding understanding with humility, not certainty","Still curious — wisdom deepens curiosity, not closes it","Can transmit understanding to others","Knowing what you don't yet understand"],misalignment:["Confused information with understanding","Wisdom has made you closed rather than open","Teaching understanding you've accumulated but not embodied","Stopped questioning because you consider yourself wise","Using wisdom as social currency"],participation:"Teach one piece of genuine understanding to one person this month — not from a book, but from your life. Notice what teaching reveals about what you still don't understand.",reflection:"Is this wisdom I've actually lived — or wisdom I've accumulated and am now distributing?",micro:[{n:"Initiation",d:"A new depth of understanding becomes available."},{n:"Expansion",d:"The understanding is deepening."},{n:"Contraction",d:"Understanding reveals its own limits."},{n:"Integration",d:"The wisdom is real. The spiral deepens."}]}]},

  nature:{name:"Nature Rhythm",icon:"🌱",color:"#10B981",patternName:"The Natural Cycle",cycle:["Seed","Root","Growth","Fruit","Decay","Renewal"],duration:"Weeks to decades",teaching:"All systems cycle. Fighting the cycle creates disease.",why:"We try to perpetually grow and skip decay. This creates burnout in individuals, organizations, and relationships. Decay is not failure — it is the sacred ending that makes renewal possible.",traditions:[{t:"Ifá",tx:"Every season is sacred. The orisha embody the seasons. Fighting the natural rhythm is fighting the orisha themselves."},{t:"Kabbalah",tx:"The Tree of Life breathes. Chesed expands; Gevurah contracts. The universal cycle of expansion and contraction governs everything."},{t:"I Ching",tx:"No state is permanent. Hexagram 11 (Peace) contains the seed of hexagram 12 (Standstill). All states cycle."},{t:"Scripture",tx:"Unless a grain of wheat falls into the earth and dies, it remains alone. Decay is the precondition for resurrection."},{t:"Buddhism",tx:"Impermanence is the first mark of existence. Fighting it is the source of suffering. Honoring the cycle is the beginning of peace."},{t:"Hermetic",tx:"The principle of rhythm governs everything. Wisdom is not stopping the pendulum — it is learning to move with it."}],phases:[{id:"seed",name:"Seed",patternName:"The Potential",time:"Variable",what:"Potential is present but dormant. Don't rush the seed. Prepare the soil.",alignment:["Honoring the seed's need for darkness before light","Preparing conditions without forcing emergence","Patient with timing","Not digging up the seed to check if it's growing","Trusting that potential you can't see is real"],misalignment:["Forcing emergence before conditions are ready","Giving up before the seed has had time to germinate","Comparing your seed to someone else's fruit","Digging it up to check if it's working","Over-controlling the conditions"],participation:"Identify one thing you've been forcing to emerge. Stop intervening for two weeks. Prepare the conditions and wait.",reflection:"Am I nurturing the seed — or forcing it open?",micro:[{n:"Initiation",d:"Potential recognized."},{n:"Expansion",d:"Conditions preparing."},{n:"Contraction",d:"The waiting is hard."},{n:"Integration",d:"The seed is ready."}]},{id:"root",name:"Root",patternName:"The Foundation Below",time:"Weeks to months",what:"Foundation being laid beneath the surface. Invisible, essential, deep.",alignment:["Investing in invisible foundation without requiring visible progress","Going deep before going tall","Patient with how long roots take","Building for permanence, not speed","Resisting pressure to show results too soon"],misalignment:["Building above ground before root is established","Impatient with the invisible phase","Showing results you don't yet have","Building wide instead of deep","Skipping root phase because it's not visible to others"],participation:"Identify the foundational investment you've been neglecting. Invest in it this week even though it won't be immediately visible.",reflection:"Am I building from a genuine root — or building something tall on shallow ground?",micro:[{n:"Initiation",d:"The rooting has begun."},{n:"Expansion",d:"Roots deepening."},{n:"Contraction",d:"The root is tested."},{n:"Integration",d:"The root is established."}]},{id:"growth",name:"Growth",patternName:"The Visible Rising",time:"Weeks to months",what:"Visible momentum. Energy is high. Feed it appropriately.",alignment:["Feeding growth with appropriate resources","Pruning what's diverting energy from main growth","Protecting the growing thing from premature exposure","Staying grounded in the root while growth extends","Celebrating visible progress without becoming complacent"],misalignment:["Overwatering — too much resource overwhelms","Neglecting root while tending visible growth","Showing growth prematurely","Trying to accelerate beyond natural growth rate","So excited by visible progress that you stop tending the root"],participation:"Identify one thing diverting energy from your most important growth. Remove or reduce it this week.",reflection:"Am I tending the growth appropriately — or forcing it beyond its natural pace?",micro:[{n:"Initiation",d:"Growth beginning."},{n:"Expansion",d:"Momentum is real."},{n:"Contraction",d:"Growth hits natural limits."},{n:"Integration",d:"The growth phase is complete."}]},{id:"fruit",name:"Fruit",patternName:"The Harvest Moment",time:"Variable",what:"The harvest. What was planted is realized. Receive it fully.",alignment:["Actually receiving what you grew","Sharing the abundance","Acknowledging the full cycle that made this possible","Harvesting without destroying the plant","Preparing for what comes after the harvest"],misalignment:["Too busy tending to stop and receive","Hoarding rather than sharing","Taking the fruit without acknowledging the seed and root","Trying to extend the fruit phase past its natural end","Destroying the plant harvesting it"],participation:"Identify one piece of fruit — one result you've grown — that you haven't fully received. Receive it this week.",reflection:"Am I actually receiving this harvest — or moving past it without acknowledgment?",micro:[{n:"Initiation",d:"The fruit is appearing."},{n:"Expansion",d:"Full harvest."},{n:"Contraction",d:"The harvest is ending."},{n:"Integration",d:"The fruit has been received."}]},{id:"decay",name:"Decay",patternName:"The Sacred Ending",time:"Weeks to months",what:"What was, releases. This is not failure — it is the completion of a cycle. It feeds what comes next.",alignment:["Allowing the ending without trying to preserve what's completing","Grieving appropriately","Harvesting wisdom before releasing the form","Trusting that decay serves the next cycle","Not rushing to the next seed before this decay is complete"],misalignment:["Refusing the ending — trying to maintain what's completing","Skipping the grief","Decaying without harvesting the wisdom first","Rushing immediately to next seed to avoid the grief","Treating decay as failure rather than completion"],participation:"Name one thing in your life that is in decay. Acknowledge the ending. Write what this cycle taught you before it completes.",reflection:"Am I honoring this ending — or trying to prevent what is already completing?",micro:[{n:"Initiation",d:"Decay beginning."},{n:"Expansion",d:"The releasing is happening."},{n:"Contraction",d:"The grief is deepest here."},{n:"Integration",d:"The decay is complete. The soil is ready."}]},{id:"renewal",name:"Renewal",patternName:"The New Beginning",time:"Variable",what:"The cycle begins again. The soil is richer. The root will go deeper. The fruit will be fuller.",alignment:["Beginning the new cycle with wisdom of the last","Genuinely ready — not just impatient for the new","Honoring quality of renewal over speed of it","Trusting that what came before was necessary","Entering the Seed phase with genuine patience"],misalignment:["Beginning the new cycle without integrating the previous","Rushing to seed phase to escape the decay","Entering renewal without wisdom of the last cycle","Exhausted from not honoring the decay phase","Expecting the new cycle to look like the previous one's peak"],participation:"Name three specific things you learned from the last cycle. These are what you're planting in the next one.",reflection:"Am I genuinely ready for a new cycle — or just tired of the decay?",micro:[{n:"Initiation",d:"The new cycle is beginning."},{n:"Expansion",d:"New energy is present."},{n:"Contraction",d:"The new requires more of the old to be released."},{n:"Integration",d:"The renewal is real."}]}]}
};

const AM={work:["success","leadership","life-season"],relationships:["relationship","emotional","healing"],growth:["healing","wisdom","spiritual"],creative:["creativity","success"],finances:["financial","life-season"],meaning:["spiritual","wisdom","nature"],leadership:["leadership","success","financial"]};


// ─── PLANET RHYTHMS ────────────────────────────────────────────────────────────
// Planets = Active Forces of Intelligence. Where zodiac shows the classroom,
// the planet shows the teacher.
const PLANETS = {
  sun:{
    name:"Sun Rhythm", symbol:"☉", icon:"🌞", color:"#FDB022",
    patternName:"Know Thyself",
    cycle:["Confusion","Discovery","Testing","Confidence","Radiance"],
    duration:"Lifetime cycles", activates:"Purpose, selfhood, vitality",
    teaching:"Your essence is your curriculum. Identity is not fixed — it evolves.",
    why:"Most people spend their lives performing identities that aren't theirs. The Sun asks: who are you, independent of others' expectations? Authentic identity is the foundation of everything else.",
    traditions:[
      {t:"Ifá",tx:"Your ori (personal guardian) chose this path before birth. Identity is alignment with what your ori already knows — remembering, not becoming."},
      {t:"Kabbalah",tx:"You are made in the image of God. Your task is to know that image in yourself. Identity is revelation, not construction."},
      {t:"I Ching",tx:"Hexagram 27, Nourishment: you are what you feed yourself with. Identity is maintained by what you consume — thoughts, relationships, practices."},
      {t:"Scripture",tx:"You are the light of the world. Let your light shine before others. Your identity is meant to be visible, not hidden."},
      {t:"Buddhism",tx:"Non-self is the teaching. Identity is impermanent. Know this and attachment to identity releases — leaving only authentic expression."},
      {t:"Hermetic",tx:"Know thyself. Self-knowledge is the gateway to all other knowledge. Your true name has power — when you know it."}
    ],
    phases:[
      {id:"sun-confusion",name:"Confusion",patternName:"Not Yet Knowing",time:"Months to years",
       what:"Not yet clear on who you are. Identity feels borrowed or performed. This is not failure — it's the fertile beginning.",
       alignment:["Honestly acknowledging you don't know yet","Genuinely curious about who you actually are","Trying things to discover rather than to perform","Collecting experiences, not permanent conclusions","Open to being surprised by who you are"],
       misalignment:["Performing certainty about identity you don't have","Adopting others' definitions without testing them","Afraid of the not-knowing","Frozen in confusion rather than exploring","Defining yourself by what you're not"],
       participation:"Complete these sentences without editing: 'I think I am...' 'I know I'm not...' 'I'm discovering I might be...' Notice what emerges.",
       reflection:"Am I genuinely exploring who I am — or performing an identity while pretending to explore?",
       micro:[{n:"Initiation",d:"Beginning to question received identity."},{n:"Expansion",d:"Exploring multiple possibilities."},{n:"Contraction",d:"Confusion deepens."},{n:"Integration",d:"Clarity emerging from honest exploration."}]},
      {id:"sun-discovery",name:"Discovery",patternName:"Finding Glimmers of Self",time:"Months to years",
       what:"Recognizing moments where you felt genuinely yourself. The real self appears in fragments — then more clearly.",
       alignment:["Noticing when you feel authentic","Following the thread of genuine interest","Recognizing your actual values emerging","Collecting evidence of your real self","Strengthening what resonates"],
       misalignment:["Dismissing authentic moments as flukes","Following what's expected over what resonates","Ignoring the glimmers of realness","Confused about what's real vs what's performed","Weak signal, easy to dismiss"],
       participation:"Notice one moment this week when you felt authentically yourself. What were you doing? Who were you with? What made it feel real?",
       reflection:"When do I feel most genuinely myself — and what am I doing in those moments?",
       micro:[{n:"Initiation",d:"First glimmer of authentic self."},{n:"Expansion",d:"Pattern of authentic moments emerging."},{n:"Contraction",d:"Pressure to deny what you're discovering."},{n:"Integration",d:"The real self is becoming clearer."}]},
      {id:"sun-testing",name:"Testing",patternName:"Living As If",time:"Months to years",
       what:"Acting as if this is who you are. Testing your authentic identity in real situations.",
       alignment:["Actually living as your discovered self","Testing in lower-stakes situations first","Observing what happens when you're real","Adjusting based on reality, not fear","Willing to be wrong about what you thought"],
       misalignment:["Still performing while thinking you're authentic","Testing only in safe spaces with safe people","Not willing to risk visibility","Expecting everyone to support your discovery","Backing down at first resistance"],
       participation:"Express one authentic thing about yourself this week in a real situation. Something that hasn't been visible yet.",
       reflection:"Am I willing to let the real me be seen — even if others react with confusion or resistance?",
       micro:[{n:"Initiation",d:"Taking the first visible risk."},{n:"Expansion",d:"More visibility of true self."},{n:"Contraction",d:"Fear and resistance arrive."},{n:"Integration",d:"The true self is being tested."}]},
      {id:"sun-confidence",name:"Confidence",patternName:"Settled In Your Self",time:"Years",
       what:"You know who you are. You're not constantly questioning or performing. There's groundedness.",
       alignment:["Clear about who you are without defensiveness","Not needing constant validation","Comfortable being different from others","Standing in your identity without brittleness","Genuine presence that others feel"],
       misalignment:["Confident in an identity you're still performing","Defensive — your identity shatters with criticism","Need constant validation to feel real","Judgmental of those different from you","Brittle — easily destabilized"],
       participation:"State three things you're genuinely confident about regarding who you are. Live from that confidence one full day this week.",
       reflection:"Is my confidence real — or am I defending a story I need others to believe?",
       micro:[{n:"Initiation",d:"First genuine confidence."},{n:"Expansion",d:"Deepening stability."},{n:"Contraction",d:"Identity is challenged."},{n:"Integration",d:"Confidence is real and lasting."}]},
      {id:"sun-radiance",name:"Radiance",patternName:"Shining Your Light",time:"Years to lifetime",
       what:"Your authentic self is visible without effort. You're not hiding your light. Your presence is a gift.",
       alignment:["Your light is visible without effort","Comfortable with recognition","Not diminishing yourself for others' comfort","Your vitality is evident to those around you","Inspiring others to find their own light"],
       misalignment:["Still hiding your actual light","Making yourself small for others' comfort","Drained from constantly dimming yourself","Your gifts are invisible to those who need them","Resentful that others don't recognize you"],
       participation:"Let yourself be more visible this week. Do one thing that expresses who you actually are — visible to others who matter.",
       reflection:"Am I willing to let my actual self be seen — or am I still protecting others from my light?",
       micro:[{n:"Initiation",d:"Choosing visibility over hiding."},{n:"Expansion",d:"Your light is shining."},{n:"Contraction",d:"Fear or judgment arrives."},{n:"Integration",d:"Radiance becomes natural."}]}
    ]
  },

  moon:{
    name:"Moon Rhythm", symbol:"☽", icon:"🌙", color:"#C4B5FD",
    patternName:"Feel and Know",
    cycle:["Instinct","Feeling","Memory","Processing","Nourishment"],
    duration:"Lifetime cycles", activates:"Memory, instinct, safety, feeling",
    teaching:"Your emotional body is a valid source of wisdom. Feel fully — emotions are intelligence, not distraction.",
    why:"Most people either suppress emotions (creating disease) or are overwhelmed by them (losing function). The Moon asks for a third way: full feeling, consciously held. Your feelings know things your mind doesn't.",
    traditions:[
      {t:"Ifá",tx:"Yemaya is the mother, the ocean, the womb. The Moon is the container for all feeling. Honor her and you honor the feminine wisdom within."},
      {t:"Kabbalah",tx:"Binah is the mother — understanding, the womb, fertility. The Moon rules the subconscious. Know this realm and you access deep wisdom."},
      {t:"I Ching",tx:"Hexagram 2, The Receptive: the power is in receiving, responding, holding. This is not passive — this is the greatest power."},
      {t:"Scripture",tx:"Mary sat at Jesus's feet. Receiving, listening, feeling. This is exalted. The emotional life is not spiritually inferior."},
      {t:"Buddhism",tx:"The four immeasurables include compassion. Feeling deeply is the path to liberation. Emotional wisdom is real wisdom."},
      {t:"Hermetic",tx:"Water rules the emotional realm. Water shapes continents. Never dismiss the power of what flows and feels."}
    ],
    phases:[
      {id:"moon-instinct",name:"Instinct",patternName:"What You Sense",time:"Ongoing",
       what:"Tuning into what you sense below conscious thought. Your body knows before your mind catches up.",
       alignment:["Trusting what you sense without needing proof","Acting on subtle signals","Noticing what doesn't feel right","Honoring body wisdom alongside mental wisdom","Developing sensitivity deliberately"],
       misalignment:["Dismissing instinct as irrational or unscientific","Demanding logical proof for everything you sense","Numb to subtle signals from within","Overriding body wisdom with thinking alone","Walked into danger you sensed was there"],
       participation:"This week: notice three times your body sensed something before your mind understood it. Trust that sensing once.",
       reflection:"Am I honoring my instinct — or overriding it in favor of appearing rational?",
       micro:[{n:"Initiation",d:"Subtle sensing arrives."},{n:"Expansion",d:"You're noticing more signals."},{n:"Contraction",d:"Doubt about what you sense."},{n:"Integration",d:"Trusting instinct consistently."}]},
      {id:"moon-feeling",name:"Feeling",patternName:"The Wave",time:"Hours to days",
       what:"Emotion is present. Allow it to be here. Not as a problem to solve — as information to receive.",
       alignment:["Allowing emotions to be present without fixing","Locating emotion in your body, not just your mind","Breathing into it rather than away from it","Not making the feeling wrong or weak","Feeling without acting it out on others"],
       misalignment:["Suppressing to appear strong or spiritual","Performing emotion for effect","Drowning in emotion — unable to function","Exiling certain emotions as unacceptable","Using substances or behavior to escape feeling"],
       participation:"Allow yourself to fully feel one emotion this week — 10 minutes of uninterrupted feeling without analyzing or fixing.",
       reflection:"Am I suppressing what I feel — or am I overwhelmed by it, with no third option?",
       micro:[{n:"Initiation",d:"The emotion arrives."},{n:"Expansion",d:"Full intensity."},{n:"Contraction",d:"Peak — most vulnerable."},{n:"Integration",d:"The emotion is being processed."}]},
      {id:"moon-memory",name:"Memory",patternName:"What This Reminds You Of",time:"Hours to days",
       what:"The current emotion is touching old memories. Understanding which patterns are activated changes your response.",
       alignment:["Distinguishing current from past","Understanding what old pattern is activated","Not acting out old wounds in current situations","Healing old wounds through current events","Integrating memory — not being controlled by it"],
       misalignment:["Responding to the past as if it's the present","Old patterns running your life unconsciously","Can't distinguish what's yours from what was done to you","Triggered repeatedly without understanding why","Memory controlling rather than informing"],
       participation:"When triggered this week: pause and ask, 'What old memory is this touching?' Write about it separately from the current situation.",
       reflection:"Am I responding to what's in front of me — or to what this triggered from the past?",
       micro:[{n:"Initiation",d:"Memory surfaces."},{n:"Expansion",d:"The full pattern is visible."},{n:"Contraction",d:"Grief about what was."},{n:"Integration",d:"Understanding the pattern clearly."}]},
      {id:"moon-processing",name:"Processing",patternName:"Moving the Energy",time:"Hours to days",
       what:"The emotion and memory need to move. Choosing the right container for the right expression.",
       alignment:["Processing in the right container for the size of the feeling","Movement of emotional energy — not just mental understanding","Expression without flooding those around you","Honoring the magnitude of what's present","Moving toward genuine resolution"],
       misalignment:["Wrong container — flooding someone who can't hold it","Surface management without actual processing","Endless processing that becomes identity","Using processing to stay in the emotion","Skipping processing entirely and moving on"],
       participation:"Identify the best way you process emotions (movement, writing, speaking, art). Use that container this week for something unprocessed.",
       reflection:"Am I processing to move through — or using processing to stay in the emotion and be understood?",
       micro:[{n:"Initiation",d:"Expression beginning."},{n:"Expansion",d:"Energy moving."},{n:"Contraction",d:"More comes up."},{n:"Integration",d:"Expression is complete."}]},
      {id:"moon-nourishment",name:"Nourishment",patternName:"Creating Safety",time:"Hours to days",
       what:"Creating genuine internal safety. Comforting yourself. Rebuilding the nervous system. Essential — not indulgent.",
       alignment:["Knowing how to genuinely self-soothe","Creating internal safety deliberately","Gentle with yourself during difficult process","Asking for what you need from others","Receiving comfort when offered"],
       misalignment:["Addicted to comfort as avoidance of completion","No sense of safety internally or externally","Pushing through without rest — 'strength' as armor","Unable to receive comfort from others","Using food, substances, or screens as nourishment"],
       participation:"Create genuine nourishment for yourself this week — not distraction, actual comfort. Rest, gentle movement, safe presence.",
       reflection:"Am I genuinely nourishing myself — or using comfort as avoidance of what needs to be felt?",
       micro:[{n:"Initiation",d:"Knowing you need safety."},{n:"Expansion",d:"Creating genuine safety."},{n:"Contraction",d:"Old habit of pushing through."},{n:"Integration",d:"Safety is restored."}]}
    ]
  },

  mercury:{
    name:"Mercury Rhythm", symbol:"☿", icon:"💭", color:"#FCD34D",
    patternName:"Thought Creates Reality",
    cycle:["Perception","Interpretation","Thought","Speech","Listening"],
    duration:"Weeks to months per cycle", activates:"Thought, speech, interpretation",
    teaching:"Your interpretation shapes your experience. Clear thinking is a form of freedom.",
    why:"Most people believe their thoughts are reality. They're not — they're interpretations. The gap between what happened and what you made it mean is where all change becomes possible.",
    traditions:[
      {t:"Ifá",tx:"Esu governs communication and interpretation. Clear the crossroads of your thinking and every path opens."},
      {t:"Kabbalah",tx:"Hod is the sphere of communication. Words have the power to create and destroy. Use them with intention."},
      {t:"I Ching",tx:"Hexagram 61, Inner Truth: what you truly think is communicated whether you speak or not. Align word, thought, and truth."},
      {t:"Scripture",tx:"As a man thinks in his heart, so he is. The thought precedes the action. Change the thought, change the life."},
      {t:"Buddhism",tx:"Right thought and right speech are two of the eight paths. Thought shapes reality more than any external circumstance."},
      {t:"Hermetic",tx:"The principle of mentalism: the universe is mental. What you think with consistency, you manifest. Govern your mind."}
    ],
    phases:[
      {id:"mercury-perception",name:"Perception",patternName:"What You Notice",time:"Ongoing",
       what:"What you attend to shapes what exists for you. Perception is selective — and that selection is a choice.",
       alignment:["Widening your attention beyond habitual focus","Noticing what's actually there, not just what confirms beliefs","Curious about what you've been missing","Deliberately seeking different viewpoints","Questioning your own selective attention"],
       misalignment:["Only noticing what confirms what you believe","Blind to evidence that would change your mind","Perception narrowed by fear or past experience","Never questioning what you consistently don't notice","Confusing the map (your perception) with the territory (reality)"],
       participation:"This week: notice one thing in an important area of your life that you've been consistently not seeing. What has your perception been filtering out?",
       reflection:"Am I seeing clearly — or am I seeing what my past has trained me to see?",
       micro:[{n:"Initiation",d:"Beginning to question your perception."},{n:"Expansion",d:"Seeing more than before."},{n:"Contraction",d:"Uncomfortable things appearing."},{n:"Integration",d:"Wider perception as baseline."}]},
      {id:"mercury-interpretation",name:"Interpretation",patternName:"What You Make It Mean",time:"Ongoing",
       what:"The gap between what happened and what you made it mean. Your interpretation is not the truth — it's a story.",
       alignment:["Distinguishing facts from interpretations","Curious about alternative interpretations","Willing to be wrong about your interpretation","Checking interpretations before acting on them","Holding interpretations loosely"],
       misalignment:["Certain your interpretation is reality","No distinction between what happened and what it meant","Defending interpretations rather than examining them","Acting from unexamined interpretations","Never considering alternative meanings"],
       participation:"Take one recurring difficult situation. Write: what actually happened (facts only). What you made it mean. Three other things it could mean.",
       reflection:"Am I responding to what happened — or to the story I made up about what happened?",
       micro:[{n:"Initiation",d:"Seeing the gap between fact and meaning."},{n:"Expansion",d:"Multiple interpretations becoming available."},{n:"Contraction",d:"Resistance to letting go of your interpretation."},{n:"Integration",d:"Holding interpretations loosely."}]},
      {id:"mercury-thought",name:"Thought",patternName:"The Inner Narrative",time:"Ongoing",
       what:"The ongoing commentary in your head shapes your reality more than external events. Governing thought is advanced work.",
       alignment:["Aware of the quality of your internal commentary","Interrupting thought patterns that don't serve","Directing thought deliberately","Not believing every thought you have","Choosing thoughts that expand rather than contract"],
       misalignment:["Unaware of your thought patterns","Loops that repeat without resolution","Believing every thought as truth","No ability to interrupt unhelpful patterns","Thought creating suffering that events don't warrant"],
       participation:"Track your dominant thought theme for one full day. Write it down every hour. At the end of the day, ask: is this thought serving me?",
       reflection:"What is the dominant thought pattern running right now — and is it creating what I want?",
       micro:[{n:"Initiation",d:"Becoming aware of thought patterns."},{n:"Expansion",d:"Interrupting loops."},{n:"Contraction",d:"Thought patterns reassert themselves."},{n:"Integration",d:"Governing thought consciously."}]},
      {id:"mercury-speech",name:"Speech",patternName:"Words as Action",time:"Ongoing",
       what:"What you say consistently shapes your reality. Words are not neutral — they create and they destroy.",
       alignment:["Speaking what you actually mean","Honoring commitments made with words","Using language that creates possibility","Silence when words don't serve","Speech that builds rather than diminishes"],
       misalignment:["Words that don't match thoughts — dishonesty of any kind","Commitments made carelessly without follow-through","Complaining and criticizing without purpose","Filling silence with meaningless talk","Using words to diminish self or others"],
       participation:"Track your words for one conversation this week. Were they honest? Did they build or diminish? Were they necessary?",
       reflection:"Are my words creating what I say I want — or undermining it?",
       micro:[{n:"Initiation",d:"Becoming conscious of word choices."},{n:"Expansion",d:"Speech becoming more aligned."},{n:"Contraction",d:"Old speech patterns return."},{n:"Integration",d:"Speech consistently reflects intention."}]},
      {id:"mercury-listening",name:"Listening",patternName:"Receiving Understanding",time:"Ongoing",
       what:"Genuine listening is rarer than speech. When you truly listen, you receive intelligence unavailable to the talker.",
       alignment:["Listening to understand, not to respond","Genuinely curious about others' perspective","Silence that creates space for truth","Hearing what isn't said as well as what is","Changed by what you hear"],
       misalignment:["Listening only to find your response","Already forming rebuttal while others speak","Impatient with others' pace of expression","Only hearing what confirms your view","Never changed by listening"],
       participation:"In one important conversation this week: listen completely before responding. Ask one genuine question. Withhold your perspective until invited.",
       reflection:"Am I genuinely receiving what others communicate — or filtering everything through my own perspective?",
       micro:[{n:"Initiation",d:"Choosing to genuinely listen."},{n:"Expansion",d:"Receiving more than expected."},{n:"Contraction",d:"Desire to speak overcomes listening."},{n:"Integration",d:"Deep listening as practice."}]}
    ]
  },

  venus:{
    name:"Venus Rhythm", symbol:"♀", icon:"💚", color:"#F9A8D4",
    patternName:"You Love What You Value",
    cycle:["Desire","Attraction","Value","Love","Beauty"],
    duration:"Months to years per cycle", activates:"Love, attraction, beauty, desire",
    teaching:"What you value determines what you attract. Love wisely.",
    why:"Most people haven't examined their actual values — the ones revealed by where they spend time and money, not the ones they claim. Aligning desire with genuine value changes everything you attract.",
    traditions:[
      {t:"Ifá",tx:"Osun is the orisha of love, sweet water, and abundance. She gives only to those who appreciate what they already have."},
      {t:"Kabbalah",tx:"Netzach is the sphere of desire and beauty. Desire is sacred when aligned with the Divine — destructive when not."},
      {t:"I Ching",tx:"Hexagram 31, Influence: genuine attraction happens naturally when you embody what you value. Authentic beauty attracts."},
      {t:"Scripture",tx:"Where your treasure is, there your heart will be also. What you value with your actions is your actual treasure."},
      {t:"Buddhism",tx:"Right intention — wanting what actually liberates rather than what temporarily satisfies. Desire is not the problem; unconscious desire is."},
      {t:"Hermetic",tx:"Like attracts like. What you value in your core is what you draw into your life. Change the values, change the magnetism."}
    ],
    phases:[
      {id:"venus-desire",name:"Desire",patternName:"What Calls to You",time:"Ongoing",
       what:"Something calls to you. Desire is not the enemy — unconscious desire is. Learn what you actually want.",
       alignment:["Honest about what you genuinely desire","Distinguishing genuine desire from conditioned desire","Following desire that expands rather than contracts","Curious about the deeper need beneath the surface desire","Not suppressing desire out of shame or fear"],
       misalignment:["Suppressing desire completely — creating shadow","Pursuing every desire without discernment","Confusing what you desire with what others told you to","Desire running you rather than informing you","Shame about genuine desire"],
       participation:"Write your genuine desires without editing — including the 'unacceptable' ones. Notice which feel expansive vs which feel like wounds wanting to be soothed.",
       reflection:"Are my desires actually mine — or have I inherited them from culture, family, or past wounds?",
       micro:[{n:"Initiation",d:"Honest desire becoming visible."},{n:"Expansion",d:"Desire clarifying."},{n:"Contraction",d:"Resistance to genuine desire."},{n:"Integration",d:"Desire as information, not compulsion."}]},
      {id:"venus-attraction",name:"Attraction",patternName:"What Draws You",time:"Ongoing",
       what:"What you're attracted to reveals what you value — even when you wish it revealed something else.",
       alignment:["Curious about what your attraction patterns reveal","Attracted to what aligns with genuine values","Noticing attraction as information","Updating what you pursue based on what attraction patterns show","Honest about what you're actually drawn to"],
       misalignment:["Repeatedly attracted to what damages you","Attracted to image rather than substance","Confusing intensity with compatibility","Ignoring what attraction patterns reveal about values","Pursuing what others value, not what you actually desire"],
       participation:"List the last three things you were genuinely attracted to (people, opportunities, experiences). What do they have in common? What value does this reveal?",
       reflection:"Am I attracted to what genuinely aligns with who I am — or to what fills a wound?",
       micro:[{n:"Initiation",d:"Seeing attraction patterns clearly."},{n:"Expansion",d:"Attraction and values aligning."},{n:"Contraction",d:"Old attraction patterns resurface."},{n:"Integration",d:"Attraction as reliable compass."}]},
      {id:"venus-value",name:"Value",patternName:"What You Actually Value",time:"Ongoing",
       what:"Your real values are revealed by your actions, not your words. What do you actually invest in?",
       alignment:["Values revealed by where you spend time and money","Spending reflects what you say you value","Willing to pay the price for what matters","Clear hierarchy of values in practice","Updating values as you develop"],
       misalignment:["Claimed values don't match actual investment","Paying for what doesn't matter, starving what does","Can't name your top three actual values","Values borrowed from others without examination","Values contradicting each other without resolution"],
       participation:"Track where you spent your time and money last week. What do those choices reveal about your actual values? Are they what you'd choose?",
       reflection:"Do my actions reflect my claimed values — or do they reveal what I actually value?",
       micro:[{n:"Initiation",d:"Examining actual values."},{n:"Expansion",d:"Values becoming more conscious."},{n:"Contraction",d:"Clash between claimed and actual values."},{n:"Integration",d:"Acted values and stated values aligning."}]},
      {id:"venus-love",name:"Love",patternName:"The Genuine Affection",time:"Months to years",
       what:"Genuine love — not the transaction, not the attachment, not the need. Love that wants what's best for the other.",
       alignment:["Loving freely without conditions","Wanting what's genuinely best for those you love","Not needing love to look a certain way to receive it","Love that grows as you develop","Giving without depleting yourself"],
       misalignment:["Loving conditionally — withdrawing when conditions aren't met","Needing love returned in exactly the form you give it","Confusing need with love","Love as transaction — I give this so you give that","Depleting yourself in the name of loving"],
       participation:"Identify one person you love. Do one thing this week that serves their actual wellbeing — not what you feel like giving, but what they genuinely need.",
       reflection:"Am I loving — or do I need something in return that I'm calling love?",
       micro:[{n:"Initiation",d:"Love becoming less conditional."},{n:"Expansion",d:"Love deepening and growing."},{n:"Contraction",d:"Love is tested by circumstances."},{n:"Integration",d:"Love as a way of being."}]},
      {id:"venus-beauty",name:"Beauty",patternName:"Creating and Appreciating",time:"Ongoing",
       what:"Beauty is not luxury — it's a signal of alignment. Creating and appreciating beauty cultivates values.",
       alignment:["Creating beauty in your environment and work","Appreciating beauty others create","Slowing down to experience what's beautiful","Beauty as a practice, not a decoration","Seeing beauty in what others overlook"],
       misalignment:["Neglecting beauty as irrelevant or frivolous","Never creating — only consuming","Too busy to appreciate what's beautiful","Cynical about beauty as pretension","Surrounded by ugliness you've stopped noticing"],
       participation:"Create one beautiful thing this week — in your space, in your work, or for someone you love. Notice what it does to your inner state.",
       reflection:"Am I cultivating beauty in my life — or has practicality crowded out what makes life worth living?",
       micro:[{n:"Initiation",d:"Noticing beauty deliberately."},{n:"Expansion",d:"Creating beauty actively."},{n:"Contraction",d:"Busyness crowds beauty out."},{n:"Integration",d:"Beauty as a consistent practice."}]}
    ]
  },

  mars:{
    name:"Mars Rhythm", symbol:"♂", icon:"🔥", color:"#EF4444",
    patternName:"Courage Is Required",
    cycle:["Desire","Courage","Action","Conflict","Victory"],
    duration:"Weeks to months per cycle", activates:"Will, courage, conflict, pursuit",
    teaching:"Courage moves the world. The life you want requires real action — not preparation for action.",
    why:"Most people are waiting. Waiting to feel ready, waiting for certainty, waiting for the right moment. Mars asks: what do you want? And are you willing to go after it regardless of fear?",
    traditions:[
      {t:"Ifá",tx:"Ogun is the orisha of iron, action, and clearing the path. He requires that you actually move — not plan to move."},
      {t:"Kabbalah",tx:"Gevurah is the sphere of strength, discipline, and divine severity. Power requires the courage to act from values even when costly."},
      {t:"I Ching",tx:"Hexagram 34, The Power of the Great: power without wisdom destroys. But wisdom without action accomplishes nothing."},
      {t:"Scripture",tx:"Be strong and courageous. Do not be afraid. The courage required is real courage — despite genuine fear, not in its absence."},
      {t:"Buddhism",tx:"Right action is not passive. The Bodhisattva vow is to act for liberation — an active, engaged commitment, not withdrawal."},
      {t:"Hermetic",tx:"Action is the bridge between the mental and the material. All the knowledge in the world without action produces nothing."}
    ],
    phases:[
      {id:"mars-desire",name:"Desire",patternName:"Knowing What You Want",time:"Ongoing",
       what:"Clear desire is the prerequisite for courage. You cannot be courageous toward something you haven't chosen.",
       alignment:["Honest about what you genuinely want","Desire that's yours, not borrowed","Clear enough to name it specifically","Desire that persists beyond comfort","Not suppressing what you want out of fear of wanting"],
       misalignment:["Vague about what you want — protecting against disappointment","Pursuing what you think you should want","Desire suppressed from fear of failure or judgment","Confused between wants that feel good vs wants that serve you","Changing what you want based on who you're with"],
       participation:"Write what you actually want in one important area — not what's realistic, not what you should want. What do you genuinely want?",
       reflection:"Am I pursuing what I actually want — or what seems acceptable to want?",
       micro:[{n:"Initiation",d:"Honest desire becoming clear."},{n:"Expansion",d:"Desire solidifying."},{n:"Contraction",d:"Fear of wanting."},{n:"Integration",d:"Desire as reliable compass."}]},
      {id:"mars-courage",name:"Courage",patternName:"Willing to Go For It",time:"Days to weeks",
       what:"Courage is action despite fear. Not the absence of fear — the willingness to move with it.",
       alignment:["Taking the first step despite not feeling ready","Tolerating the discomfort of real risk","Distinguishing rational caution from fear-based paralysis","Courage in the specific area where you're called","Small acts of courage building larger ones"],
       misalignment:["Waiting to feel courageous before acting — waiting forever","Confusing preparation with courage","Courage in safe areas, avoidance in the ones that matter","Making fear the reason rather than the obstacle","Bravado that isn't courage — it's avoidance of real fear"],
       participation:"Identify the one action you've been avoiding that would most change your situation. Take the smallest possible step toward it this week.",
       reflection:"Am I being genuinely courageous — or performing courage in areas where I'm not actually afraid?",
       micro:[{n:"Initiation",d:"Choosing to act despite fear."},{n:"Expansion",d:"Courage building through action."},{n:"Contraction",d:"Fear reasserts itself."},{n:"Integration",d:"Courage as character."}]},
      {id:"mars-action",name:"Action",patternName:"Actually Moving",time:"Weeks to months",
       what:"The doing. Not the preparation, not the planning. The actual movement toward what you want.",
       alignment:["Actual movement, not preparation for movement","Adjusting based on feedback while continuing to act","Consistent action more than inspired bursts","Protecting action time from everything else","Measuring by action taken, not by results yet"],
       misalignment:["Extensive preparation with no action","Bursts of action followed by long inaction","Letting everything interrupt action","Measuring only by results before they could exist","Action in wrong direction because of clarity avoidance"],
       participation:"Commit to 30 minutes of direct action toward what you want every day for 7 days. No exceptions for mood or inspiration.",
       reflection:"Am I taking consistent action — or waiting for the right conditions that never quite arrive?",
       micro:[{n:"Initiation",d:"Beginning to actually move."},{n:"Expansion",d:"Action generating momentum."},{n:"Contraction",d:"Action hits resistance."},{n:"Integration",d:"Consistent action as habit."}]},
      {id:"mars-conflict",name:"Conflict",patternName:"Meeting Resistance",time:"Days to weeks",
       what:"Conflict is the natural response to genuine action. Something or someone will resist. This is expected.",
       alignment:["Handling conflict directly rather than avoiding","Distinguishing useful from pointless conflict","Engaging the conflict that serves your movement","Not backing down from important confrontation","Remaining clear on what you're pursuing through the conflict"],
       misalignment:["Avoiding all conflict — stopping the moment resistance arrives","Engaging every conflict — dispersing energy unnecessarily","Aggressive rather than direct","Passive rather than honest","Backing down when the conflict is real and necessary"],
       participation:"Identify one conflict you've been avoiding. Engage it directly this week — honestly, respectfully, clearly.",
       reflection:"Am I engaging the conflicts that need to happen — or avoiding them in the name of peace?",
       micro:[{n:"Initiation",d:"Resistance encountered."},{n:"Expansion",d:"Conflict clarifying."},{n:"Contraction",d:"Hardest point of the conflict."},{n:"Integration",d:"Conflict resolved or transcended."}]},
      {id:"mars-victory",name:"Victory",patternName:"Achieving What You Pursued",time:"Variable",
       what:"You got it. The achievement. Receive it fully. Learn from the pursuit. Then rest before the next one.",
       alignment:["Actually receiving and acknowledging the achievement","Learning what the pursuit taught","Resting before the next Mars cycle begins","Sharing the victory appropriately","Remaining grounded in what was built"],
       misalignment:["Immediately dismissing or minimizing the achievement","Moving immediately to next pursuit without rest","Letting victory inflate rather than ground you","Not acknowledging those who helped","Using victory to claim more than it means"],
       participation:"Acknowledge one genuine achievement from the recent past that you haven't fully received. Let yourself feel it.",
       reflection:"Am I receiving this victory fully — or already dismissing it and moving to the next pursuit?",
       micro:[{n:"Initiation",d:"Achievement realized."},{n:"Expansion",d:"Receiving it fully."},{n:"Contraction",d:"The victory is smaller than imagined."},{n:"Integration",d:"Wisdom from the pursuit."}]}
    ]
  },

  jupiter:{
    name:"Jupiter Rhythm", symbol:"♃", icon:"🌟", color:"#F97316",
    patternName:"Opportunity Follows Faith",
    cycle:["Faith","Vision","Growth","Generosity","Wisdom"],
    duration:"Years-long cycles", activates:"Faith, wisdom, growth, opportunity",
    teaching:"Believe generously. Growth comes to the open-hearted and the faithful.",
    why:"Scarcity thinking prevents the expansion that would eliminate scarcity. Jupiter asks: can you believe in possibility even when circumstances don't support it? Faith that waits for evidence isn't faith.",
    traditions:[
      {t:"Ifá",tx:"Oshun teaches abundance flows to those who overflow — not those who grasp. Generosity precedes receiving."},
      {t:"Kabbalah",tx:"Chesed is the sphere of loving-kindness, generosity, and expansion. God's overflow into creation. You participate in this flow."},
      {t:"I Ching",tx:"Hexagram 42, Increase: when above decreases and below increases, all benefit. Generosity to those who have less creates genuine abundance."},
      {t:"Scripture",tx:"Ask and you shall receive. The faith precedes the evidence. Seeking before finding is the required order."},
      {t:"Buddhism",tx:"Dana (generosity) is the first paramita. The practice of giving opens what grasping closes. Start with generosity."},
      {t:"Hermetic",tx:"Like attracts like at the mental level. Abundance thinking attracts abundance. This is not wish fulfillment — it is the mechanism."}
    ],
    phases:[
      {id:"jupiter-faith",name:"Faith",patternName:"Believing Before Seeing",time:"Ongoing",
       what:"Faith that good things are possible, even when circumstances don't yet show it. This is active and difficult, not passive.",
       alignment:["Holding faith when circumstances don't support it","Acting from faith without certainty","Not requiring evidence before believing","Sharing faith without needing others to validate it","Returning to faith when doubt arrives"],
       misalignment:["Faith contingent on evidence — not faith but observation","Lost faith because things got hard","Cynical about what's possible — protecting against disappointment","Performing faith publicly without actually having it","Faith in one area, scarcity thinking in all others"],
       participation:"Identify one area where you've stopped believing things can improve. Act from faith there this week — one small act that assumes the possible.",
       reflection:"Is my faith genuine — or have I replaced it with a sophisticated cynicism that feels like realism?",
       micro:[{n:"Initiation",d:"Choosing to believe."},{n:"Expansion",d:"Faith producing visible results."},{n:"Contraction",d:"Faith tested by difficulty."},{n:"Integration",d:"Faith as ground, not occasional state."}]},
      {id:"jupiter-vision",name:"Vision",patternName:"Seeing the Expanded Possibility",time:"Months to years",
       what:"Seeing beyond what currently exists to what could be. Vision that genuinely moves you.",
       alignment:["Vision that genuinely excites and calls","Specific enough to work toward","Revisiting and refining vision as you develop","Sharing vision without needing everyone's agreement","Acting toward vision in present circumstances"],
       misalignment:["Vision so vague it can't inform action","Vision that's really someone else's for you","Rigid vision that can't evolve","Waiting until vision is perfect before sharing","Vision as escape from present work"],
       participation:"Articulate your vision in one important area as specifically as possible. What does it look like in five years if things go well?",
       reflection:"Is my vision genuinely mine — or a mixture of others' expectations and my own fears?",
       micro:[{n:"Initiation",d:"Vision becoming clearer."},{n:"Expansion",d:"Vision pulling you forward."},{n:"Contraction",d:"Vision and reality gap is hard."},{n:"Integration",d:"Vision informing daily action."}]},
      {id:"jupiter-growth",name:"Growth",patternName:"Actually Expanding",time:"Years",
       what:"Real growth — beyond comfort, beyond what was already possible. Leaning into the expansion.",
       alignment:["Actively seeking challenges beyond current capacity","Growing beyond what's comfortable","Growth that's sustainable, not reckless","Investing in growth even before it's necessary","Staying curious as you grow"],
       misalignment:["Comfort masquerading as wisdom","Same phase too long — stagnation","Growth that destroys what it was built on","Expanding in the wrong direction — volume over depth","Stopped growing because you consider yourself arrived"],
       participation:"Identify the challenge just beyond your current capacity. Step into it this week — not to succeed immediately, but to grow.",
       reflection:"Am I genuinely growing — or have I found a comfortable place and called it arrived?",
       micro:[{n:"Initiation",d:"Stepping beyond comfort."},{n:"Expansion",d:"Growth producing results."},{n:"Contraction",d:"Growth reveals how much more is possible."},{n:"Integration",d:"New capacity is established."}]},
      {id:"jupiter-generosity",name:"Generosity",patternName:"Giving From the Flow",time:"Ongoing",
       what:"Generosity not from excess but from abundance mindset. Giving opens what grasping closes.",
       alignment:["Giving before you feel you have enough","Generous with time, attention, and resources","Giving without keeping score","Generosity that doesn't deplete you","Finding what you have to give that others need"],
       misalignment:["Giving only from excess — usually never","Generous publicly, stingy privately","Giving with hidden expectation of return","Generosity depleting you — giving from wound","Stingy because you believe there isn't enough"],
       participation:"Give something this week without expectation of return. Something that genuinely costs you something — time, attention, or resource.",
       reflection:"Is my generosity real — or am I giving when it costs nothing and calling it generous?",
       micro:[{n:"Initiation",d:"Giving before comfortable."},{n:"Expansion",d:"Generosity opening what was closed."},{n:"Contraction",d:"Scarcity thinking reasserts."},{n:"Integration",d:"Generosity as character."}]},
      {id:"jupiter-wisdom",name:"Wisdom",patternName:"Learning From Expansion",time:"Years",
       what:"The wisdom that only growth produces. What you understand because you've expanded beyond what was comfortable.",
       alignment:["Wisdom that came from genuine growth experience","Teaching what you've actually lived","Humble about what you still don't know","Wisdom that makes you more open, not more certain","Passing wisdom forward generously"],
       misalignment:["Claiming wisdom from growth you haven't made","Performing wisdom as identity","Wisdom that made you more certain and less curious","Hoarding wisdom rather than passing it forward","Wisdom that separates rather than connects"],
       participation:"Identify one piece of genuine wisdom you've earned through actual growth. Teach it to one person this month — from lived experience, not reading.",
       reflection:"Is this wisdom I've actually earned through expansion — or wisdom I've gathered and am performing?",
       micro:[{n:"Initiation",d:"Wisdom becoming available."},{n:"Expansion",d:"Wisdom deepening."},{n:"Contraction",d:"Wisdom reveals its own limits."},{n:"Integration",d:"Wisdom informing how you live."}]}
    ]
  },

  saturn:{
    name:"Saturn Rhythm", symbol:"♄", icon:"⏰", color:"#92400E",
    patternName:"Limits Make Things Possible",
    cycle:["Reality","Discipline","Responsibility","Structure","Mastery"],
    duration:"2–3 year cycles", activates:"Discipline, time, responsibility, limits",
    teaching:"Discipline enables mastery. Constraints are not obstacles — they're the conditions of genuine achievement.",
    why:"Most people fight constraints. Saturn teaches that limits are the conditions under which real things become possible. A river without banks is a swamp. Constraint focuses energy into power.",
    traditions:[
      {t:"Ifá",tx:"Obatala teaches clarity, patience, and right use of white light. Clean work, deliberate action, no shortcuts. This is the path."},
      {t:"Kabbalah",tx:"Binah is the great mother, the understanding that gives form to the formless. Form requires limit. Creation requires constraint."},
      {t:"I Ching",tx:"Hexagram 60, Limitation: limitation without joy exhausts. But the right limitations bring freedom within structure."},
      {t:"Scripture",tx:"Through discipline comes freedom. The narrow gate leads to life. The constraints are not punishments — they are the path."},
      {t:"Buddhism",tx:"Vinaya — the monastic code — is not restriction but liberation. Structure eliminates the exhausting decision of each moment."},
      {t:"Hermetic",tx:"The principle of cause and effect has no exceptions. Saturn's lesson: you cannot circumvent the law. You can only align with it."}
    ],
    phases:[
      {id:"saturn-reality",name:"Reality",patternName:"Seeing What's Actually There",time:"Ongoing",
       what:"Clear-eyed seeing of what is — not what you wish, not what you fear. Saturn requires honesty about actual circumstances.",
       alignment:["Honest assessment without catastrophizing or minimizing","Seeing constraints clearly without resentment","Reality as the starting point, not the ending point","Not requiring circumstances to be different before beginning","Accurate inventory of what you actually have to work with"],
       misalignment:["Denial about actual constraints or problems","Catastrophizing — making constraints larger than they are","Resentful of reality rather than accepting it as starting point","Waiting for better circumstances before dealing with current ones","Wishful thinking about what's actually possible"],
       participation:"Do an honest assessment of one area of your life. List what's actually there — resources, constraints, realities. No editing for optimism or pessimism.",
       reflection:"Am I seeing my situation clearly — or am I seeing what I want to be true or fear might be true?",
       micro:[{n:"Initiation",d:"Seeing clearly without distortion."},{n:"Expansion",d:"Reality assessment deepening."},{n:"Contraction",d:"Hard truths becoming visible."},{n:"Integration",d:"Clear seeing as foundation."}]},
      {id:"saturn-discipline",name:"Discipline",patternName:"The Consistent Practice",time:"Months to years",
       what:"Showing up regardless. The consistent practice that makes mastery possible. The unglamorous engine of everything real.",
       alignment:["Showing up whether you feel like it or not","Systems that remove the decision from willpower","Discipline in the areas that matter most","Consistent over intense — daily practice beats weekend intensity","Discipline as self-respect, not self-punishment"],
       misalignment:["Waiting to feel motivated before practicing","Intense bursts followed by long absence","Discipline as self-punishment — joyless and harsh","Disciplined in performance areas, undisciplined where it matters","No systems — relying entirely on willpower"],
       participation:"Identify your most important practice. Commit to it daily for 21 days — same time, same duration. Track it.",
       reflection:"Am I disciplined in the areas that actually shape my future — or disciplined in visible areas while neglecting what matters?",
       micro:[{n:"Initiation",d:"Building the consistent practice."},{n:"Expansion",d:"Discipline becoming automatic."},{n:"Contraction",d:"Life disrupts the practice."},{n:"Integration",d:"Discipline as identity."}]},
      {id:"saturn-responsibility",name:"Responsibility",patternName:"Owning Your Domain",time:"Ongoing",
       what:"Taking full ownership of your domain — no blaming circumstances, no waiting for others to fix what's yours to fix.",
       alignment:["Owning outcomes in your domain without blame","Fixing what's yours to fix","Taking initiative before being asked","Delivering what you committed to","Holding yourself to higher standards than you hold others"],
       misalignment:["Explanations for every problem that point outward","Waiting for others to fix what's yours","Committed and then didn't deliver","Holding others to standards you don't apply yourself","Technically compliant but not genuinely responsible"],
       participation:"Name one thing in your domain that isn't working. Stop explaining why it's not your fault. Take one specific action to fix it.",
       reflection:"Am I genuinely responsible — or am I skilled at explaining why things are others' problems?",
       micro:[{n:"Initiation",d:"Owning your domain."},{n:"Expansion",d:"Responsibility expanding."},{n:"Contraction",d:"Pressure to blame others."},{n:"Integration",d:"Responsibility as character."}]},
      {id:"saturn-structure",name:"Structure",patternName:"Building to Last",time:"Months to years",
       what:"Creating systems and structures that endure. Building what will be there tomorrow, next year, in a decade.",
       alignment:["Building for permanence rather than speed","Systems that work without your constant management","Investing in infrastructure even before it's needed","Revising structures when they stop working","Structure that enables freedom within it"],
       misalignment:["Building for appearance rather than function","Everything dependent on your constant attention","No systems — relying on heroic effort repeatedly","Structures that constrain rather than enable","Refusing to build because it's slow"],
       participation:"Identify one area of your life that would benefit from a better system. Design and implement the simplest possible version this week.",
       reflection:"Am I building structures that will serve me — or managing chaos that structure would eliminate?",
       micro:[{n:"Initiation",d:"Recognizing where structure is needed."},{n:"Expansion",d:"Structure being built."},{n:"Contraction",d:"Structure requires more than expected."},{n:"Integration",d:"Reliable structure in place."}]},
      {id:"saturn-mastery",name:"Mastery",patternName:"Excellence Through Practice",time:"Years",
       what:"The mastery that only time and consistent practice produce. Not talent. Not shortcut. Time.",
       alignment:["Mastery earned through genuine sustained practice","Humble about what the next level requires","Teaching what you've mastered","Continuing to practice even at mastery level","Mastery that reveals the next level of learning"],
       misalignment:["Claiming mastery you haven't earned through practice","Stopping practice because you consider yourself arrived","Protecting expertise rather than sharing it","Contemptuous of those in earlier phases","Mastery that creates arrogance rather than humility"],
       participation:"Identify one area where you're approaching mastery. Name what sustained practice produced it. Name what the next level requires.",
       reflection:"Is this mastery I've earned through years of practice — or expertise I'm claiming from accumulated knowledge?",
       micro:[{n:"Initiation",d:"Recognizing you've crossed a threshold."},{n:"Expansion",d:"Mastery deepening."},{n:"Contraction",d:"Mastery reveals its own limits."},{n:"Integration",d:"This is your operating level."}]}
    ]
  },

  uranus:{
    name:"Uranus Rhythm", symbol:"♅", icon:"⚡", color:"#7DD3FC",
    patternName:"Break Free Into Authenticity",
    cycle:["Awakening","Disruption","Liberation","Innovation","Freedom"],
    duration:"7-year cycles", activates:"Awakening, disruption, innovation",
    teaching:"Awakening requires disruption. What's false must break before what's real can emerge.",
    why:"Most people prefer the comfort of a familiar cage to the discomfort of freedom. Uranus disrupts what needs to be disrupted. The disruption feels like destruction until you see what it made possible.",
    traditions:[
      {t:"Ifá",tx:"The lightning of Shango clears what has become stagnant. The strike is not punishment — it is the old pattern being broken open."},
      {t:"Kabbalah",tx:"Chokmah is the divine flash — sudden illumination that shatters the previous understanding. The lightning bolt of revelation."},
      {t:"I Ching",tx:"Hexagram 51, The Arousing: the shock arrives. Stay centered in the midst of disruption. This is not destruction — it is awakening."},
      {t:"Scripture",tx:"Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Transformation requires disruption."},
      {t:"Buddhism",tx:"The moment of insight (kensho) comes suddenly, often uninvited. The awakening is not produced — it breaks through."},
      {t:"Hermetic",tx:"When the vessel becomes too small for the force it contains, it must break. The force is not wrong — the vessel must grow."}
    ],
    phases:[
      {id:"uranus-awakening",name:"Awakening",patternName:"Seeing What You Couldn't Before",time:"Days to weeks",
       what:"Something you couldn't see before becomes suddenly visible. The spell breaks. This is often uncomfortable.",
       alignment:["Staying present with what you now see","Not rushing to restore comfort by dismissing the awakening","Seeking understanding before making decisions","Sharing the awakening with discernment","Trusting the disruption even without knowing where it leads"],
       misalignment:["Immediately trying to unsee what you've seen","Performing awakening without actually having one","Sharing prematurely — before integration","Dismissing the awakening when it becomes inconvenient","Using awakening to feel superior to those not awake"],
       participation:"Name one thing you've become aware of recently that you wish you could un-see. What would it require of you to fully receive this awakening?",
       reflection:"Am I genuinely receiving this awakening — or managing it so it doesn't require too much change?",
       micro:[{n:"Initiation",d:"The spell breaking."},{n:"Expansion",d:"More becoming visible."},{n:"Contraction",d:"Desire to return to not-knowing."},{n:"Integration",d:"The awakening is real."}]},
      {id:"uranus-disruption",name:"Disruption",patternName:"Breaking What Needs to Break",time:"Months",
       what:"What was false is breaking. This looks like destruction. It is actually liberation in process.",
       alignment:["Cooperating with what's breaking rather than fighting it","Distinguishing what must break from what should continue","Getting support during disruption","Not rushing to rebuild before the clearing completes","Trusting that something real will emerge"],
       misalignment:["Fighting to preserve what's breaking","Rebuilding immediately on top of rubble","Making every disruption mean catastrophe","Disrupting everything — throwing out what's real with what's false","So frightened of disruption that you reconstruct the cage quickly"],
       participation:"Name one thing in your life that is currently in disruption. Stop fighting it for one week. Let it break all the way.",
       reflection:"Am I cooperating with the disruption — or frantically trying to restore what's breaking?",
       micro:[{n:"Initiation",d:"The breaking beginning."},{n:"Expansion",d:"Disruption deepening."},{n:"Contraction",d:"The hardest point — nothing in place."},{n:"Integration",d:"The clearing is complete."}]},
      {id:"uranus-liberation",name:"Liberation",patternName:"Free From the False",time:"Months to years",
       what:"Free from what was false. Space for what's real. This is not comfortable — freedom rarely is at first.",
       alignment:["Actually inhabiting the freedom rather than immediately filling it","Comfortable with the open space","Choosing what to build in freedom rather than defaulting","Authentic now that the false has broken","Not immediately recreating the old pattern in new form"],
       misalignment:["Freedom so uncomfortable you rebuilt the cage","Recreating the old pattern immediately","Liberation without discernment — not knowing what to do with freedom","So long in constraint that freedom feels threatening","Breaking free without knowing what you're free for"],
       participation:"Identify one area where you've recently broken free. What will you do with this freedom that you couldn't do before?",
       reflection:"Am I inhabiting my freedom — or finding new ways to constrain myself because freedom is unfamiliar?",
       micro:[{n:"Initiation",d:"Tasting genuine freedom."},{n:"Expansion",d:"Freedom expanding."},{n:"Contraction",d:"Freedom's discomfort."},{n:"Integration",d:"Authentic liberation embodied."}]},
      {id:"uranus-innovation",name:"Innovation",patternName:"The New Made Possible",time:"Months to years",
       what:"What the disruption and liberation made possible. New approaches, new forms, new possibilities.",
       alignment:["Building what the liberation made possible","Innovation that serves, not just innovates","Testing new approaches without defending old ones","Bringing others into the new possibility","Innovative without being reckless"],
       misalignment:["Disrupting for its own sake — without building what's better","Innovating away from what works out of restlessness","Innovation that serves only yourself","So in love with novelty that depth is abandoned","Constant disruption that never allows completion"],
       participation:"Identify one new approach that your recent liberation made possible. Implement it in a small, testable way this week.",
       reflection:"Am I innovating to build something better — or disrupting because I'm uncomfortable with what's established?",
       micro:[{n:"Initiation",d:"The new becoming visible."},{n:"Expansion",d:"Innovation producing results."},{n:"Contraction",d:"Innovation meets resistance."},{n:"Integration",d:"The new approach is established."}]},
      {id:"uranus-freedom",name:"Freedom",patternName:"Genuine Liberation",time:"Years to lifetime",
       what:"Authentic freedom — not from responsibility, but from what was false. The freedom to be genuinely yourself.",
       alignment:["Free from others' definitions of who you should be","Authentic even when unconventional","Freedom that enables service rather than withdrawing from it","Not needing others' permission to be yourself","Liberating for those around you as well as yourself"],
       misalignment:["Freedom from responsibility rather than from falseness","Confusing freedom with license — doing whatever","Freedom that abandons others rather than serving them","Still performing — just a different performance","Needing to rebel to feel free — still defined by what you're against"],
       participation:"In one area of your life, act entirely from who you actually are this week — without performing, without seeking permission, without explaining.",
       reflection:"Am I genuinely free — or still defined by what I'm rebelling against?",
       micro:[{n:"Initiation",d:"True freedom becoming real."},{n:"Expansion",d:"Freedom deepening."},{n:"Contraction",d:"Freedom tested."},{n:"Integration",d:"Freedom as way of being."}]}
    ]
  },

  neptune:{
    name:"Neptune Rhythm", symbol:"♆", icon:"🌊", color:"#818CF8",
    patternName:"Mystery Is Valid",
    cycle:["Dream","Mystery","Surrender","Dissolution","Vision"],
    duration:"12–14 year cycles", activates:"Dream, mystery, imagination, dissolution",
    teaching:"You cannot control everything. Surrender is not passivity — it's active trust.",
    why:"Control is the illusion we maintain to avoid encountering what's actually real. Neptune asks you to release the grip. Not into passivity — into genuine openness to what's actually there.",
    traditions:[
      {t:"Ifá",tx:"Obatala's white cloth covers everything. What you cannot see is real. The invisible world is as real as the visible."},
      {t:"Kabbalah",tx:"Keter, the crown, is pure being beyond understanding. Mystery is not ignorance — it is the encounter with what transcends concept."},
      {t:"I Ching",tx:"Hexagram 29, The Abysmal: water flows over the obstacle, not through it. Release the need to force your way through what flows around."},
      {t:"Scripture",tx:"Be still and know. The knowing available in stillness is inaccessible in striving. Surrender opens what force closes."},
      {t:"Buddhism",tx:"Not-knowing is the beginning of wisdom. The expert's mind has few possibilities. The beginner's mind has many. Return to not-knowing."},
      {t:"Hermetic",tx:"The principle of polarity: all opposites are the same thing in different degrees. What you're fighting and what you're seeking may be the same."}
    ],
    phases:[
      {id:"neptune-dream",name:"Dream",patternName:"Imagining Possibilities",time:"Months",
       what:"Imagination opening to what could be. Dreams that don't have practical forms yet — and don't need to.",
       alignment:["Allowing imagination to roam without immediately grounding","Receiving the image, symbol, or dream without analyzing","Trusting the dream's message before knowing its meaning","Noting dreams and visions without judgment","Protecting time for imagination"],
       misalignment:["Dismissing imagination as impractical","Immediately analyzing what should be allowed to unfold","Forcing premature form on what's still forming","Never dreaming — too practical for imagination","Addicted to dream — never taking it into reality"],
       participation:"Spend 20 minutes this week in pure imagination about something important to you. No planning, no editing. Let it be as big or strange as it wants.",
       reflection:"Am I allowing myself to dream — or have I become too practical for imagination?",
       micro:[{n:"Initiation",d:"Imagination stirring."},{n:"Expansion",d:"Dream deepening."},{n:"Contraction",d:"Practicality interrupting."},{n:"Integration",d:"Dream informing direction."}]},
      {id:"neptune-mystery",name:"Mystery",patternName:"What You Cannot Control",time:"Months to years",
       what:"Encountering what you cannot control or explain. The invitation to stay present with mystery rather than eliminating it.",
       alignment:["Staying with mystery without rushing to resolution","Comfortable not knowing","Finding the mystery interesting rather than threatening","Learning to live with genuine ambiguity","The mystery deepening rather than eliminating your faith"],
       misalignment:["Must resolve every mystery — uncomfortable with not knowing","Mystery produces anxiety that shuts down exploration","Forcing false certainty to avoid genuine uncertainty","Using cynicism to avoid genuine mystery","Avoiding situations where you can't be certain"],
       participation:"Identify one genuine mystery in your life — something you don't know and can't know yet. Stay with it without resolving it for one week.",
       reflection:"Am I comfortable with genuine not-knowing — or am I forcing certainty to manage my anxiety?",
       micro:[{n:"Initiation",d:"Mystery becoming present."},{n:"Expansion",d:"The mystery deepening."},{n:"Contraction",d:"Urge to force resolution."},{n:"Integration",d:"Comfortable with mystery."}]},
      {id:"neptune-surrender",name:"Surrender",patternName:"Releasing the Grip",time:"Months",
       what:"Releasing control. Not into passivity — into genuine openness. Active trust.",
       alignment:["Releasing control of what you can't control","Still acting, but without attachment to the outcome","Peace in the not-knowing","Trusting what you can't see","Surrender as strength, not weakness"],
       misalignment:["Passive surrender — giving up rather than releasing","Surrendering what you could and should influence","Spiritual bypass — using surrender to avoid responsibility","Still controlling but calling it surrender","Surrender only when you've failed — not as a practice"],
       participation:"Identify one outcome you've been gripping. Take the actions that are yours to take — then genuinely release the outcome for one week.",
       reflection:"Am I surrendering — or have I given up and called it surrender?",
       micro:[{n:"Initiation",d:"Beginning to release."},{n:"Expansion",d:"Surrender deepening."},{n:"Contraction",d:"Control impulse returns."},{n:"Integration",d:"Active surrender as practice."}]},
      {id:"neptune-dissolution",name:"Dissolution",patternName:"Boundaries Dissolving",time:"Months to years",
       what:"The self becoming less solid. Merging with something larger. This is not death — it's expansion.",
       alignment:["Allowing the dissolution without panic","Boundaries dissolving into something real","Experiencing interconnection beyond separateness","The small self releasing into something larger","Trust in what remains when boundaries dissolve"],
       misalignment:["Panic at the dissolution — holding self rigid","Dissolution into codependence — losing self in others","Dissolution through substance rather than genuine opening","So identified with self-concept that dissolution is terrifying","Lost — no anchor during dissolution"],
       participation:"Practice one moment of genuine connection this week — where the boundary between you and another softens. Don't analyze it. Just notice.",
       reflection:"Am I allowing genuine dissolution — or clinging to a self-concept that's too small for what I'm being called into?",
       micro:[{n:"Initiation",d:"Boundaries beginning to soften."},{n:"Expansion",d:"Dissolution deepening."},{n:"Contraction",d:"Fear of losing self."},{n:"Integration",d:"Dissolution into something real."}]},
      {id:"neptune-vision",name:"Vision",patternName:"Clarity Through Surrender",time:"Weeks to months",
       what:"The clarity that arrives through surrender and dissolution. Not forced — received. Often unexpected.",
       alignment:["Receiving vision rather than producing it","Trusting the vision even without immediate explanation","Staying with the vision until it clarifies further","Acting on vision without forcing its completion","Sharing vision only when it's received, not performed"],
       misalignment:["Forcing vision rather than receiving it","Claiming vision to appear special","Sharing prematurely — before clarity","Acting on idea before it's actually vision","Vision as escape from current reality"],
       participation:"Spend 10 minutes in stillness each morning this week. Don't direct your mind. Receive what comes without grasping or dismissing.",
       reflection:"Is this vision I've genuinely received — or an idea I've elevated to vision to avoid the mundane work in front of me?",
       micro:[{n:"Initiation",d:"Vision beginning to arrive."},{n:"Expansion",d:"Vision clarifying."},{n:"Contraction",d:"Vision requires surrender to receive."},{n:"Integration",d:"Vision informing direction."}]}
    ]
  },

  pluto:{
    name:"Pluto Rhythm", symbol:"♇", icon:"💀", color:"#7C3AED",
    patternName:"Death Enables Rebirth",
    cycle:["Shadow","Death","Underworld","Rebirth","Integration"],
    duration:"12–30 year cycles", activates:"Power, shadow, death, rebirth",
    teaching:"What must die, dies. Complete transformation requires letting go completely.",
    why:"Most people try to transform without dying. They want to be different without releasing what made them who they were. Pluto teaches that complete rebirth requires complete death of the old form. There are no half-measures.",
    traditions:[
      {t:"Ifá",tx:"Oya governs transformation, change, and the whirlwind of death and rebirth. She strips away what is false so what is real can emerge."},
      {t:"Kabbalah",tx:"Daath, the hidden sephirah, is the abyss that must be crossed. The crossing requires the death of the previous self."},
      {t:"I Ching",tx:"Hexagram 23, Splitting Apart: the disintegration precedes the new. Hexagram 24, Return, follows immediately: the return after the dark."},
      {t:"Scripture",tx:"Unless a grain of wheat falls into the earth and dies, it remains alone. But if it dies, it bears much fruit. Death is required."},
      {t:"Buddhism",tx:"The death and rebirth within each meditation session. The moment consciousness releases what it was holding — and sees what remains."},
      {t:"Hermetic",tx:"Solve et coagula: dissolve and coagulate. The alchemical process requires the complete dissolution of the previous form before the new can crystallize."}
    ],
    phases:[
      {id:"pluto-shadow",name:"Shadow",patternName:"Seeing What You've Hidden",time:"Months to years",
       what:"The parts of yourself you've exiled — repressed, denied, projected onto others. The shadow contains both what you fear and what you haven't yet claimed.",
       alignment:["Willing to see what you've been hiding from yourself","Not projecting shadow onto others","Curious about what your reactions reveal","Working with the shadow rather than eliminating it","Seeing shadow as potential, not just darkness"],
       misalignment:["Unaware of shadow — it appears only in others","Projecting every shadow quality outward","Certain you don't have the qualities you criticize in others","Shadow controlling behavior unconsciously","Eliminating shadow rather than integrating it"],
       participation:"Notice three things that trigger you in others. Ask: where is this quality also true of me? Write without defense.",
       reflection:"What am I seeing in others that I'm not yet willing to see in myself?",
       micro:[{n:"Initiation",d:"Shadow becoming visible."},{n:"Expansion",d:"More shadow material surfacing."},{n:"Contraction",d:"Resistance to what's being revealed."},{n:"Integration",d:"Shadow acknowledged."}]},
      {id:"pluto-death",name:"Death",patternName:"Releasing What Must Die",time:"Months to years",
       what:"Something must die. A version of you, a relationship, a career, a belief, an identity. The death is real.",
       alignment:["Allowing the death without grasping","Grieving genuinely — the death is real","Not rushing to resurrection before the death is complete","Getting support during genuine dying","Trusting that something will emerge from the death"],
       misalignment:["Holding on to what's dying — using life support on what needs to die","Rushing past the death without grieving","Performing acceptance without actual release","Death of everything including what should survive","Too frightened to allow the death that's necessary"],
       participation:"Name one thing that needs to die. Write it explicitly. Grieve it. Spend time with the death before seeking what comes after.",
       reflection:"Am I allowing what needs to die to die — or using all my energy to keep alive what should be released?",
       micro:[{n:"Initiation",d:"The death beginning."},{n:"Expansion",d:"The releasing deepening."},{n:"Contraction",d:"Hardest point — holding on."},{n:"Integration",d:"The death is complete."}]},
      {id:"pluto-underworld",name:"Underworld",patternName:"The Deep Transformation",time:"Months to years",
       what:"Deep in the process. The old is gone. The new hasn't arrived. You are between. This is the most important phase.",
       alignment:["Staying present in the between without rushing","Trusting the process even in total darkness","Not manufacturing a premature emergence","Getting real support — not people who need you to be okay","The underworld doing its work"],
       misalignment:["Rushing out of the underworld before transformation completes","Manufacturing a resurrection that's really just escape","Isolated — no support during the deepest phase","Numbing to manage the underworld experience","Performing transformation without actually being in it"],
       participation:"If you're in the underworld: do not rush. Name what's being transformed. Get support. Wait for the actual emergence.",
       reflection:"Am I actually in the underworld transformation — or performing it while avoiding the real work?",
       micro:[{n:"Initiation",d:"Deep in the process."},{n:"Expansion",d:"Transformation working."},{n:"Contraction",d:"Darkest point."},{n:"Integration",d:"Emergence becoming possible."}]},
      {id:"pluto-rebirth",name:"Rebirth",patternName:"Emerging Transformed",time:"Months",
       what:"You emerge. Not the same. What died in the underworld didn't return. What emerges is genuinely new.",
       alignment:["Receiving the new self without immediately assigning old identity","Different in ways you couldn't have engineered","Not performing rebirth — actually being reborn","Humble about the transformation","Grateful for the death that made this possible"],
       misalignment:["Performing rebirth without actually transforming","Recreating the old self in new language","Claiming transformation to others before you've integrated it","Using rebirth language to avoid the actual underworld","Back to the same patterns quickly"],
       participation:"Describe in writing one way you are genuinely different than before the death and underworld. Not performed — what's actually changed?",
       reflection:"Am I actually reborn — or have I emerged from difficulty without transformation?",
       micro:[{n:"Initiation",d:"Emerging from the underworld."},{n:"Expansion",d:"The new self finding form."},{n:"Contraction",d:"Old patterns attempting return."},{n:"Integration",d:"The rebirth is real."}]},
      {id:"pluto-integration",name:"Integration",patternName:"Living as the Transformed",time:"Years",
       what:"The transformation integrated into how you live. The shadow claimed. The death honored. The new self embodied.",
       alignment:["Living from the transformed self consistently","Shadow integrated rather than suppressed","The death honored — its gifts received","Authentic power from having gone through the process","Teaching others from genuine transformation"],
       misalignment:["Transformation in one area, old patterns in others","Shadow integrated intellectually but not behaviorally","Death honored in words, not in changed life","Power without the transformation — dangerous","Teaching transformation you haven't completed"],
       participation:"Identify one way your transformation is still not integrated — where you act from the old self despite the change. Work there specifically.",
       reflection:"Is the transformation integrated into how I actually live — or is it a story I tell while the old patterns run?",
       micro:[{n:"Initiation",d:"Integration beginning."},{n:"Expansion",d:"Transformation deepening into life."},{n:"Contraction",d:"Integration tested."},{n:"Integration",d:"The transformed self is established."}]}
    ]
  }
};
// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("home");
  const [tracked,setTracked]=useState(()=>rLoad(RKEY.tracked, []));
  const [reflections,setReflections]=useState(()=>rLoad(RKEY.reflections, []));
  const [reflection,setReflection]=useState("");
  const [saved,setSaved]=useState(false);
  const [step,setStep]=useState(1);
  const [area,setArea]=useState(null);
  const [cR,setCR]=useState(null);
  const [cP,setCP]=useState(null);
  const [res,setRes]=useState(null);
  const [bId,setBId]=useState(null);
  const [bTab,setBTab]=useState("o");
  const [exp,setExp]=useState(null);
  const [expSection,setExpSection]=useState({});
  const [showTrad,setShowTrad]=useState(false);
  const [principleDay]=useState(new Date().getDate()%8);
  // Planet state
  const [rView,setRView]=useState("domains");  // "domains" | "planets"
  const [bSrc,setBSrc]=useState("domains");    // source for detail view

  // Persist tracked rhythms whenever they change
  useEffect(()=>{rSave(RKEY.tracked, tracked);},[tracked]);
  useEffect(()=>{rSave(RKEY.reflections, reflections);},[reflections]);

  const doSave=()=>{if(!reflection.trim())return;setReflections(prev=>[{text:reflection.trim(),at:new Date().toISOString(),rhythm:bId||null,src:bSrc},...prev].slice(0,200));setReflection("");setSaved(true);setTimeout(()=>setSaved(false),2000);};
  // Unified item lookup
  const getItem=(id,src)=>src==="planets"?PLANETS[id]:R[id];
  const finish=()=>{
    const item=getItem(cR,area==="planets"?"planets":"domains");
    const p=item.phases.find(x=>x.id===cP);
    const src=area==="planets"?"planets":"domains";
    setRes({r:item,p,id:cR,src});
    if(!tracked.find(t=>t.id===cR&&t.src===src))setTracked([...tracked,{id:cR,pId:cP,src}]);
    setStep(4);
  };
  const reset=()=>{setStep(1);setArea(null);setCR(null);setCP(null);setRes(null);};
  const goTab=(id)=>{setTab(id);if(id==="rhythms"){setBId(null);}if(id==="assess")reset();};
  const toggleSection=(phaseId,sec)=>{const k=`${phaseId}-${sec}`;setExpSection(prev=>({...prev,[k]:!prev[k]}));};
  const isSec=(phaseId,sec)=>expSection[`${phaseId}-${sec}`];

  const todayPrompts=["Which rhythm is most active for you today?","Where are you resisting what the phase is asking?","What would aligned action look like right now?","Which principle needs your attention?","What are you learning that you didn't expect?"];
  const todayPrompt=todayPrompts[new Date().getDate()%5];

  // Get today's practice from first tracked rhythm
  const todayPractice = tracked.length > 0 ? (() => {
    const t=tracked[0]; const r=getItem(t.id,t.src||"domains"); const p=r?.phases?.find(x=>x.id===t.pId);
    return p ? { rhythmName: r.name, phaseName: p.name, text: p.participation } : null;
  })() : null;

  const todayPrinciple = PRINCIPLES[principleDay];

  // Styles
  const C={bg:"#06060E",card:"rgba(255,255,255,0.04)",bdr:"rgba(255,255,255,0.08)",purple:"#A78BFA",text:"#fff",muted:"#999",sub:"#ccc"};
  const btn=(active,color="#A78BFA")=>({background:active?`${color}30`:"rgba(255,255,255,0.05)",border:`1px solid ${active?color:"rgba(255,255,255,0.08)"}`,color:active?color:"#ccc",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13,fontWeight:600});
  const PB={background:C.purple,color:C.bg,border:"none",borderRadius:10,padding:"12px 16px",fontWeight:700,cursor:"pointer",fontSize:14,width:"100%"};
  const GB={background:"rgba(255,255,255,0.06)",color:C.sub,border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px",fontWeight:600,cursor:"pointer",fontSize:13,width:"100%"};
  const BB={background:"none",border:"none",color:C.purple,cursor:"pointer",fontSize:13,padding:0,marginBottom:14,display:"block"};
  const LB={fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:C.purple,marginBottom:10,fontWeight:700,display:"block"};
  const page={padding:"16px 20px 0"};

  // Shared phase detail renderer (used by both domains and planets)
  const renderPhaseDetail=(p)=>(
    <div style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{padding:"12px 14px",fontSize:13,color:C.sub,lineHeight:1.7}}>{p.what}</div>
      <div style={{padding:"0 14px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:10,color:"#10B981",fontWeight:700,marginBottom:7}}>WHEN ALIGNED ✓</div>
          {p.alignment.map((a,j)=><div key={j} style={{fontSize:12,color:"#ccc",lineHeight:1.5,marginBottom:4,paddingLeft:8,borderLeft:"2px solid rgba(16,185,129,0.3)"}}>{a}</div>)}
        </div>
        <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:10,color:"#EF4444",fontWeight:700,marginBottom:7}}>WHEN MISALIGNED ✗</div>
          {p.misalignment.map((m,j)=><div key={j} style={{fontSize:12,color:"#ccc",lineHeight:1.5,marginBottom:4,paddingLeft:8,borderLeft:"2px solid rgba(239,68,68,0.3)"}}>{m}</div>)}
        </div>
      </div>
      <div style={{padding:"0 14px 12px"}}>
        <button onClick={()=>toggleSection(p.id,"micro")} style={{...btn(isSec(p.id,"micro")),width:"100%",display:"flex",justifyContent:"space-between",marginBottom:isSec(p.id,"micro")?8:0}}>
          <span>The 4 Micro-States Within This Phase</span><span>{isSec(p.id,"micro")?"−":"+"}</span>
        </button>
        {isSec(p.id,"micro")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {p.micro.map((m,j)=>(
            <div key={j} style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:7,padding:"9px 11px"}}>
              <div style={{fontSize:11,color:C.purple,fontWeight:700,marginBottom:4}}>{j+1}. {m.n}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{m.d}</div>
            </div>
          ))}
        </div>}
      </div>
      <div style={{padding:"0 14px 12px"}}>
        <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:8,padding:"11px 13px"}}>
          <div style={{fontSize:10,color:"#FBBF24",fontWeight:700,marginBottom:6}}>RECOMMENDED PARTICIPATION</div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.6}}>{p.participation}</div>
        </div>
      </div>
      <div style={{padding:"0 14px 14px"}}>
        <div style={{background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:8,padding:"11px 13px"}}>
          <div style={{fontSize:10,color:"#FF6B6B",fontWeight:700,marginBottom:6}}>REFLECTION QUESTION</div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.6,fontStyle:"italic"}}>{p.reflection}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"system-ui,sans-serif",color:C.text,paddingBottom:80}}>

      {/* HEADER */}
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#A78BFA,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center"}}>⟳</div>
        <div><div style={{fontWeight:700,fontSize:14}}>Intelligent Rhythms</div><div style={{fontSize:10,color:"#555"}}>Twelvefold Institute</div></div>
      </div>

      {/* ── HOME ── */}
      {tab==="home"&&<div style={page}>
        <span style={LB}>My Rhythms</span>
        {tracked.length===0
          ?<div style={{background:"rgba(167,139,250,0.07)",border:"1px dashed rgba(167,139,250,0.25)",borderRadius:12,padding:"22px 18px",textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:26,marginBottom:8}}>🔍</div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:14}}>No rhythms identified yet.<br/>Take an assessment to get started.</div>
            <button onClick={()=>goTab("assess")} style={{...PB,width:"auto",padding:"10px 20px"}}>Start Assessment</button>
          </div>
          :<div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {tracked.map(t=>{const r=getItem(t.id,t.src||"domains"),p=r.phases.find(x=>x.id===t.pId);return(
              <div key={t.id+t.src} onClick={()=>{setBId(t.id);setBSrc(t.src||"domains");setBTab("o");setExp(null);setShowTrad(false);setRView(t.src==="planets"?"planets":"domains");setTab("rhythms");}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${r.color}`,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:17}}>{r.icon||r.symbol}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{r.patternName}</div>
                    <div style={{fontSize:11,color:C.muted}}>{r.name} · {p?.name||""} phase</div>
                  </div>
                </div>
                {p&&<div style={{fontSize:12,color:C.muted,overflow:"hidden",maxHeight:36}}>{(p.what||"").slice(0,80)}…</div>}
              </div>
            );})}
          </div>}

        {/* Today's Practice */}
        {todayPractice&&<div style={{marginBottom:20}}>
          <span style={LB}>Today's Practice</span>
          <div style={{background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",borderRadius:10,padding:"13px 14px"}}>
            <div style={{fontSize:11,color:"#FBBF24",fontWeight:600,marginBottom:6}}>{todayPractice.rhythmName} · {todayPractice.phaseName}</div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.6}}>{todayPractice.text}</div>
          </div>
        </div>}

        {/* Today's Reflection */}
        <div style={{marginBottom:20}}>
          <span style={LB}>Today's Reflection</span>
          <div style={{background:"rgba(167,139,250,0.08)",borderLeft:"2px solid #A78BFA",borderRadius:8,padding:"11px 13px",fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:11,fontStyle:"italic"}}>{todayPrompt}</div>
          <textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Write your reflection here…" style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"11px 13px",color:C.text,fontSize:13,minHeight:75,resize:"vertical",outline:"none",fontFamily:"inherit",boxSizing:"border-box",display:"block",marginBottom:9}}/>
          <button onClick={doSave} style={{...PB,background:saved?"#10B981":C.purple}}>{saved?"✓ Saved":"Save Reflection"}</button>
        </div>

        {/* Principle of the Day */}
        <div style={{marginBottom:20}}>
          <span style={LB}>Today's Principle</span>
          <div style={{background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:10,padding:"13px 14px"}}>
            <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:18}}>{todayPrinciple.i}</span>
              <div style={{fontWeight:700,fontSize:14,color:C.purple}}>{todayPrinciple.n}</div>
            </div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.6,marginBottom:8}}>{todayPrinciple.d}</div>
            <div style={{fontSize:12,color:C.muted,fontStyle:"italic",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:8}}>❓ {todayPrinciple.q}</div>
          </div>
        </div>
      </div>}

      {/* ── ASSESS ── */}
      {tab==="assess"&&<div style={page}>
        {step===1&&<>
          <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Which area needs attention?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Select what's active for you right now</div>
          {[["work","💼","Work / Career"],["relationships","💬","Relationships"],["growth","🌱","Personal Growth"],["creative","🎨","Creative Work"],["finances","💰","Money / Finances"],["meaning","✨","Meaning / Spirit"],["leadership","👑","Leadership"]].map(([id,ic,lb])=>(
            <button key={id} onClick={()=>{setArea(id);setStep(2);}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"13px 14px",display:"flex",alignItems:"center",gap:13,cursor:"pointer",color:C.text,textAlign:"left",width:"100%",marginBottom:8}}>
              <span style={{fontSize:21}}>{ic}</span><span style={{fontWeight:500,fontSize:14}}>{lb}</span>
            </button>
          ))}
          {/* Planets path */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:8,paddingTop:12}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,letterSpacing:0.5}}>OR EXPLORE PLANETARY FORCES</div>
            <button onClick={()=>{setArea("planets");setStep(2);}} style={{background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:9,padding:"13px 14px",display:"flex",alignItems:"center",gap:13,cursor:"pointer",color:C.text,textAlign:"left",width:"100%"}}>
              <span style={{fontSize:21}}>🪐</span>
              <div>
                <div style={{fontWeight:600,fontSize:14,color:C.purple}}>Planetary Forces</div>
                <div style={{fontSize:11,color:C.muted,marginTop:1}}>Sun, Moon, Mercury, Venus, Mars + more</div>
              </div>
            </button>
          </div>
        </>}

        {step===2&&area==="planets"&&<>
          <button style={BB} onClick={()=>setStep(1)}>← Back</button>
          <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Which planet is active?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Select the force you feel most strongly right now</div>
          {Object.entries(PLANETS).map(([id,p])=>(
            <button key={id} onClick={()=>{setCR(id);setStep(3);}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.08)",borderLeft:`3px solid ${p.color}`,borderRadius:9,padding:"12px 14px",display:"flex",alignItems:"center",gap:13,cursor:"pointer",color:C.text,textAlign:"left",width:"100%",marginBottom:8}}>
              <span style={{fontSize:22}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{p.symbol} {p.name}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{p.activates}</div>
              </div>
              <span style={{color:"#555"}}>→</span>
            </button>
          ))}
        </>}

        {step===2&&area!=="planets"&&<>
          <button style={BB} onClick={()=>setStep(1)}>← Back</button>
          <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Which rhythm?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>You might be in one of these</div>
          {(AM[area]||[]).map(id=>{const r=R[id];return(
            <button key={id} onClick={()=>{setCR(id);setStep(3);}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.08)",borderLeft:`3px solid ${r.color}`,borderRadius:9,padding:"13px 14px",display:"flex",alignItems:"center",gap:13,cursor:"pointer",color:C.text,textAlign:"left",width:"100%",marginBottom:8}}>
              <span style={{fontSize:21}}>{r.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{r.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{r.cycle.join(" → ")}</div></div>
              <span style={{color:"#555"}}>→</span>
            </button>
          );})}
        </>}

        {step===3&&(()=>{
          const item=getItem(cR,area==="planets"?"planets":"domains");
          return(<>
            <button style={BB} onClick={()=>setStep(2)}>← Back</button>
            <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>{item.icon||item.symbol} {item.name}</div>
            {area==="planets"&&<div style={{fontSize:12,color:C.purple,marginBottom:6}}>{item.activates}</div>}
            <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Which phase feels most true right now?</div>
            {item.phases.map((p,i)=>(
              <button key={p.id} onClick={()=>setCP(p.id)} style={{background:cP===p.id?"rgba(167,139,250,0.15)":C.card,border:cP===p.id?"1px solid #A78BFA":"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"11px 13px",display:"flex",gap:11,alignItems:"center",cursor:"pointer",width:"100%",marginBottom:8}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:cP===p.id?"#A78BFA":"rgba(167,139,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:cP===p.id?C.bg:"#A78BFA",flexShrink:0}}>{i+1}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{color:C.text,fontWeight:600,fontSize:13}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:1}}>{p.time}</div>
                </div>
              </button>
            ))}
            <button onClick={finish} disabled={!cP} style={{...PB,opacity:cP?1:0.4,cursor:cP?"pointer":"not-allowed",marginTop:4}}>See My Results →</button>
          </>);
        })()}

        {step===4&&res&&<div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div style={{background:"linear-gradient(135deg,rgba(167,139,250,0.15),rgba(99,102,241,0.06))",border:"1px solid rgba(167,139,250,0.3)",borderRadius:13,padding:18}}>
            <div style={{fontSize:26,marginBottom:6}}>{res.r.icon||res.r.symbol}</div>
            {res.src==="planets"&&<div style={{fontSize:11,color:"#818CF8",fontWeight:600,letterSpacing:1,marginBottom:4}}>PLANETARY FORCE ACTIVE</div>}
            {res.src!=="planets"&&<div style={{fontSize:11,color:C.purple,fontWeight:600,letterSpacing:1,marginBottom:4}}>YOU ARE IN</div>}
            <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>{res.r.patternName}</div>
            <div style={{fontSize:13,color:C.purple,marginBottom:12}}>{res.r.name} · {res.p.name} Phase</div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>{res.p.what}</div>
          </div>
          <div style={{background:C.card,borderRadius:12,padding:14}}>
            <div style={{fontSize:10,color:C.purple,fontWeight:700,letterSpacing:1,marginBottom:7}}>RECOMMENDED PARTICIPATION</div>
            <div style={{fontSize:13,color:"#ddd",lineHeight:1.6}}>{res.p.participation}</div>
          </div>
          <div style={{background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:10,padding:13}}>
            <div style={{fontSize:10,color:"#FF6B6B",fontWeight:700,letterSpacing:1,marginBottom:7}}>REFLECTION QUESTION</div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.6,fontStyle:"italic"}}>{res.p.reflection}</div>
          </div>
          <button onClick={()=>{setBId(res.id);setBSrc(res.src||"domains");setBTab("o");setExp(null);setShowTrad(false);setRView(res.src==="planets"?"planets":"domains");setTab("rhythms");}} style={PB}>Explore {res.r.name}</button>
          <button onClick={reset} style={GB}>Do Another Assessment</button>
        </div>}
      </div>}

      {/* ── RHYTHMS LIST ── */}
      {tab==="rhythms"&&!bId&&<div style={page}>
        {/* Domains / Planets Toggle */}
        <div style={{display:"flex",gap:7,marginBottom:16}}>
          {[["domains","📚","Life Domains"],["planets","🪐","Planet Forces"]].map(([v,ic,lb])=>(
            <button key={v} onClick={()=>{setRView(v);setExp(null);}} style={{...btn(rView===v),flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <span>{ic}</span><span>{lb}</span>
            </button>
          ))}
        </div>

        {rView==="domains"&&<>
          <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>11 Life Domain Rhythms</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>Where you are in each area of life</div>
          {Object.entries(R).map(([id,r])=>(
            <button key={id} onClick={()=>{setBId(id);setBSrc("domains");setBTab("o");setExp(null);setShowTrad(false);}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${r.color}`,borderRadius:9,padding:"13px 14px",display:"flex",alignItems:"flex-start",gap:11,cursor:"pointer",textAlign:"left",width:"100%",marginBottom:8}}>
              <span style={{fontSize:21,flexShrink:0}}>{r.icon}</span>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontWeight:600,fontSize:13}}>{r.name}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>{r.cycle.slice(0,4).join(" → ")}…</div>
              </div>
              <span style={{color:"#555",marginTop:2}}>→</span>
            </button>
          ))}
        </>}

        {rView==="planets"&&<>
          <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>10 Planet Rhythms</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>The active forces moving through your life</div>
          {Object.entries(PLANETS).map(([id,p])=>(
            <button key={id} onClick={()=>{setBId(id);setBSrc("planets");setBTab("o");setExp(null);setShowTrad(false);}} style={{background:C.card,border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${p.color}`,borderRadius:9,padding:"13px 14px",display:"flex",alignItems:"flex-start",gap:11,cursor:"pointer",textAlign:"left",width:"100%",marginBottom:8}}>
              <span style={{fontSize:21,flexShrink:0}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontWeight:600,fontSize:13}}>{p.symbol} {p.name}</div>
                <div style={{color:"#818CF8",fontSize:11,marginTop:1,fontStyle:"italic"}}>{p.activates}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>{p.cycle.join(" → ")}</div>
              </div>
              <span style={{color:"#555",marginTop:2}}>→</span>
            </button>
          ))}
        </>}
      </div>}

      {/* ── RHYTHM / PLANET DETAIL ── */}
      {tab==="rhythms"&&bId&&(()=>{
        const r=getItem(bId,bSrc);
        const isPlanet=bSrc==="planets";
        return(
          <div style={page}>
            <button style={BB} onClick={()=>setBId(null)}>← {isPlanet?"All Planets":"All Rhythms"}</button>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:4}}>
              <span style={{fontSize:26}}>{r.icon||r.symbol}</span>
              <div>
                <div style={{fontWeight:700,fontSize:18}}>{r.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{r.duration}</div>
              </div>
            </div>

            {/* Pattern Name badge */}
            <div style={{display:"inline-block",background:isPlanet?"rgba(129,140,248,0.15)":"rgba(167,139,250,0.15)",border:`1px solid ${isPlanet?"rgba(129,140,248,0.3)":"rgba(167,139,250,0.3)"}`,borderRadius:6,padding:"4px 11px",fontSize:12,color:isPlanet?"#818CF8":C.purple,fontWeight:600,marginBottom:isPlanet?6:16}}>{r.patternName}</div>
            {isPlanet&&<div style={{display:"block",fontSize:11,color:"#818CF8",marginBottom:14,fontStyle:"italic"}}>{r.activates}</div>}

            {/* Sub-tabs */}
            <div style={{display:"flex",gap:7,marginBottom:16}}>
              {[["o","Overview"],["p","Phases"]].map(([t,lb])=>(
                <button key={t} onClick={()=>{setBTab(t);setExp(null);}} style={btn(bTab===t)}>{lb}</button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {bTab==="o"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:isPlanet?"rgba(129,140,248,0.08)":"rgba(167,139,250,0.08)",borderLeft:`2px solid ${isPlanet?"#818CF8":"#A78BFA"}`,borderRadius:8,padding:"13px 14px",fontSize:14,color:"#ddd",lineHeight:1.7,fontStyle:"italic"}}>{r.teaching}</div>
              <div>
                <span style={LB}>Why This Matters</span>
                <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>{r.why}</div>
              </div>
              <div>
                <span style={LB}>The Cycle</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {r.cycle.map(ph=><span key={ph} style={{background:isPlanet?"rgba(129,140,248,0.12)":"rgba(167,139,250,0.12)",border:`1px solid ${isPlanet?"rgba(129,140,248,0.2)":"rgba(167,139,250,0.2)"}`,borderRadius:6,padding:"5px 10px",fontSize:12,color:isPlanet?"#818CF8":C.purple}}>{ph}</span>)}
                </div>
              </div>
              <div>
                <button onClick={()=>setShowTrad(!showTrad)} style={{...btn(showTrad),width:"100%",justifyContent:"space-between",display:"flex",alignItems:"center"}}>
                  <span>How 6 Wisdom Traditions See This</span>
                  <span>{showTrad?"−":"+"}</span>
                </button>
                {showTrad&&<div style={{display:"flex",flexDirection:"column",gap:9,marginTop:10}}>
                  {r.traditions.map(tr=>(
                    <div key={tr.t} style={{background:C.card,border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,padding:"11px 13px"}}>
                      <div style={{fontSize:11,color:isPlanet?"#818CF8":C.purple,fontWeight:700,marginBottom:5}}>{tr.t}</div>
                      <div style={{fontSize:13,color:C.sub,lineHeight:1.6}}>{tr.tx}</div>
                    </div>
                  ))}
                </div>}
              </div>
            </div>}

            {/* PHASES TAB */}
            {bTab==="p"&&<div>
              {r.phases.map((p,i)=>(
                <div key={p.id} style={{background:exp===p.id?"rgba(167,139,250,0.06)":C.card,border:exp===p.id?"1px solid rgba(167,139,250,0.25)":"1px solid rgba(255,255,255,0.07)",borderRadius:10,overflow:"hidden",marginBottom:9}}>
                  <button onClick={()=>setExp(exp===p.id?null:p.id)} style={{width:"100%",background:"none",border:"none",padding:"13px 14px",display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:exp===p.id?"#A78BFA":"rgba(167,139,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:exp===p.id?C.bg:"#A78BFA",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,textAlign:"left"}}>
                      <div style={{color:C.text,fontWeight:600,fontSize:14}}>{p.name}</div>
                      <div style={{color:C.muted,fontSize:10,marginTop:1}}>{p.time} · {p.patternName}</div>
                    </div>
                    <span style={{color:"#555"}}>{exp===p.id?"−":"+"}</span>
                  </button>
                  {exp===p.id&&renderPhaseDetail(p)}
                </div>
              ))}
            </div>}
          </div>
        );
      })()}

      {/* ── LEARN ── */}
      {tab==="learn"&&<div style={page}>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>8 Universal Principles</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Underlying all 21 rhythms</div>
        {PRINCIPLES.map((p,i)=>(
          <div key={p.n} style={{background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:11,padding:"13px 14px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
              <span style={{fontSize:18}}>{p.i}</span>
              <div style={{fontWeight:700,fontSize:13,color:C.purple}}>{i+1}. {p.n}</div>
            </div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.6,marginBottom:10}}>{p.d}</div>
            <div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:7,padding:"9px 11px",marginBottom:8}}>
              <div style={{fontSize:10,color:"#EF4444",fontWeight:700,marginBottom:5}}>WHEN THIS IS VIOLATED</div>
              <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{p.violation}</div>
            </div>
            <div style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:7,padding:"9px 11px"}}>
              <div style={{fontSize:10,color:C.purple,fontWeight:700,marginBottom:5}}>PRACTICE QUESTION</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5,fontStyle:"italic"}}>{p.q}</div>
            </div>
          </div>
        ))}
      </div>}

      {/* ── ME ── */}
      {tab==="me"&&<div style={page}>
        <div style={{fontSize:19,fontWeight:700,marginBottom:16}}>My Journey</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[["Tracked",tracked.length],["Day Streak","1"],["Principles","8"],["Total Rhythms","21"]].map(([lb,v])=>(
            <div key={lb} style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:11,padding:"13px 11px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:700,color:C.purple}}>{v}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:3}}>{lb}</div>
            </div>
          ))}
        </div>

        {/* Rhythm type breakdown */}
        <div style={{background:C.card,border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"13px 14px",marginBottom:16}}>
          <span style={LB}>System Overview</span>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {[["📚 Life Domain Rhythms","11 rhythms · 64 phases","#A78BFA"],["🪐 Planet Rhythms","10 forces · 50 phases","#818CF8"],["✨ Universal Principles","8 principles","#FBBF24"]].map(([lb,sub,col])=>(
              <div key={lb} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,color:C.text,fontWeight:600}}>{lb}</div>
                  <div style={{fontSize:11,color:C.muted}}>{sub}</div>
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>
              </div>
            ))}
          </div>
        </div>

        <span style={LB}>Principles Awareness</span>
        {PRINCIPLES.map((p,i)=>(
          <div key={p.n} style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
            <span style={{fontSize:13,width:18,textAlign:"center"}}>{p.i}</span>
            <span style={{fontSize:11,color:C.sub,width:90,flexShrink:0}}>{p.n}</span>
            <div style={{flex:1,height:5,background:"rgba(255,255,255,0.08)",borderRadius:3}}>
              <div style={{width:`${[72,55,88,43,67,91,50,78][i]}%`,height:"100%",background:C.purple,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>}

      {/* NAV */}
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(6,6,14,0.97)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",padding:"8px 10px",gap:5}}>
        {[["home","🏠","Home"],["assess","📋","Assess"],["rhythms","📚","Rhythms"],["learn","✨","Learn"],["me","👤","Me"]].map(([id,ic,lb])=>(
          <button key={id} onClick={()=>goTab(id)} style={{flex:1,background:tab===id?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.05)",border:tab===id?"1px solid rgba(167,139,250,0.4)":"1px solid rgba(255,255,255,0.07)",color:tab===id?C.purple:"#666",borderRadius:7,padding:"8px 4px",fontSize:10,cursor:"pointer",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:14}}>{ic}</span>{lb}
          </button>
        ))}
      </nav>
    </div>
  );
}
