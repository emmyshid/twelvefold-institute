"use client";

import { useState, useEffect } from "react";

const TIER_META = {
  1:{name:"Recognition",weeks:12,goal:"Meet all 12 phases with full depth. By the end: you can name, recognise, and distinguish all 12 in your own life and in others.",
    blocks:[
      {name:"Fire",  icon:"🔥",color:"#FF6B6B",weeks:[1,2,3],  phases:["Aries","Leo","Sagittarius"]},
      {name:"Earth", icon:"🌍",color:"#6BCB77",weeks:[4,5,6],  phases:["Taurus","Virgo","Capricorn"]},
      {name:"Air",   icon:"💨",color:"#38BDF8",weeks:[7,8,9],  phases:["Gemini","Libra","Aquarius"]},
      {name:"Water", icon:"💧",color:"#C084FC",weeks:[10,11,12],phases:["Cancer","Scorpio","Pisces"]},
    ]},
  2:{name:"Sequence & Precision",weeks:8,goal:"Revisit all 12 phases through two new lenses. By the end: you can track movement within a phase and read how phases connect.",
    blocks:[
      {name:"Seasonal Sequences",icon:"🌀",color:"#FBBF24",weeks:[1,2,3,4],phases:["Spring","Summer","Autumn","Winter"]},
      {name:"Micro-States",icon:"◎",color:"#10b981",weeks:[5,6,7,8],phases:["Initiation","Expansion","Contraction","Integration"]},
    ]},
  3:{name:"Mastery Practice",weeks:4,goal:"No new content. Pure application. By the end: you can read real, ambiguous situations with full pattern literacy.",
    blocks:[
      {name:"Application",icon:"◇",color:"#67E8F9",weeks:[1,2,3,4],phases:["Multi-Phase Reading","Tradition Depth","Live Scenarios","Reading Others"]},
    ]},
};

const PHASES = {
  Aries:      {el:"Fire", icon:"↗",color:"#FF6B6B",pk:"aries",   teaching:"The raw impulse to begin before you know what you're beginning.",        pn:"Ignition Moment",     dist:"Aquarius"},
  Leo:        {el:"Fire", icon:"☀",color:"#FBBF24",pk:"fire",    teaching:"Stepping into visibility with what is genuinely yours.",                  pn:"Stepping Into Light",  dist:"Sagittarius"},
  Sagittarius:{el:"Fire", icon:"→",color:"#FB923C",pk:"fire",    teaching:"Following the vision toward the horizon before the map exists.",           pn:"Horizon Calling",      dist:"Leo"},
  Taurus:     {el:"Earth",icon:"▣",color:"#6BCB77",pk:"taurus",  teaching:"Showing up daily until the spark becomes solid.",                        pn:"Foundation Years",     dist:"Capricorn"},
  Virgo:      {el:"Earth",icon:"⊕",color:"#A3E635",pk:"earth",   teaching:"Seeing precisely what needs improving and closing the gap.",               pn:"The Work of Clarity",  dist:"Gemini"},
  Capricorn:  {el:"Earth",icon:"△",color:"#94A3B8",pk:"earth",   teaching:"Building with patience what will outlast you.",                            pn:"The Long Work",        dist:"Taurus"},
  Gemini:     {el:"Air",  icon:"◇",color:"#FFD93D",pk:"air",     teaching:"Following curiosity wherever it leads without forcing a destination.",    pn:"Information Awakening",dist:"Virgo"},
  Libra:      {el:"Air",  icon:"⚖",color:"#67E8F9",pk:"air",     teaching:"Genuine encounter with another person — real balance, authentic presence.",pn:"The Real Conversation",dist:"Cancer"},
  Aquarius:   {el:"Air",  icon:"⚡",color:"#38BDF8",pk:"aquarius",teaching:"Breaking precisely from the constraint that has become a cage.",           pn:"Liberation Calling",   dist:"Aries"},
  Cancer:     {el:"Water",icon:"🌊",color:"#60A5FA",pk:"water",   teaching:"Accessing what is emotionally true — what nourishes, what depletes.",    pn:"Emotional Root",       dist:"Scorpio"},
  Scorpio:    {el:"Water",icon:"◈",color:"#C084FC",pk:"scorpio",  teaching:"The necessary ending of what cannot continue.",                           pn:"The Necessary End",    dist:"Pisces"},
  Pisces:     {el:"Water",icon:"∞",color:"#A78BFA",pk:"water",   teaching:"Releasing what has completed with grace and returning to source.",        pn:"The Graceful Release", dist:"Scorpio"},
};

const T1 = {
  week_1:{phase:"Aries",...PHASES.Aries,tier:1},week_2:{phase:"Leo",...PHASES.Leo,tier:1},
  week_3:{phase:"Sagittarius",...PHASES.Sagittarius,tier:1},week_4:{phase:"Taurus",...PHASES.Taurus,tier:1},
  week_5:{phase:"Virgo",...PHASES.Virgo,tier:1},week_6:{phase:"Capricorn",...PHASES.Capricorn,tier:1},
  week_7:{phase:"Gemini",...PHASES.Gemini,tier:1},week_8:{phase:"Libra",...PHASES.Libra,tier:1},
  week_9:{phase:"Aquarius",...PHASES.Aquarius,tier:1},week_10:{phase:"Cancer",...PHASES.Cancer,tier:1},
  week_11:{phase:"Scorpio",...PHASES.Scorpio,tier:1},week_12:{phase:"Pisces",...PHASES.Pisces,tier:1},
};
const T2 = {
  week_1:{phase:"Spring",icon:"🌱",color:"#6BCB77",el:"Aries → Taurus → Gemini",pk:"spring",teaching:"Ignition grounds into foundation, which opens into understanding.",tier:2,seasonal:true},
  week_2:{phase:"Summer",icon:"☀️",color:"#FF6B6B",el:"Cancer → Leo → Virgo",pk:"summer",teaching:"Depth enables expression; expression enables refinement.",tier:2,seasonal:true},
  week_3:{phase:"Autumn",icon:"🍂",color:"#FBBF24",el:"Libra → Scorpio → Sagittarius",pk:"autumn",teaching:"Genuine encounter leads to necessary ending, which opens vision.",tier:2,seasonal:true},
  week_4:{phase:"Winter",icon:"❄️",color:"#38BDF8",el:"Capricorn → Aquarius → Pisces",pk:"winter",teaching:"Structure is built, broken open, and finally dissolved.",tier:2,seasonal:true},
  week_5:{phase:"Initiation",icon:"◈",color:"#38BDF8",el:"First Signal",pk:"initiation",teaching:"The first whisper — the pattern beginning to stir.",tier:2,microstate:true},
  week_6:{phase:"Expansion",icon:"↗",color:"#FF6B6B",el:"Growing Momentum",pk:"expansion",teaching:"The pattern pressing forward — energy available, direction clear.",tier:2,microstate:true},
  week_7:{phase:"Contraction",icon:"↙",color:"#C084FC",el:"Reality Pushes Back",pk:"contraction",teaching:"Where the actual learning happens. The difficulty is the teaching.",tier:2,microstate:true},
  week_8:{phase:"Integration",icon:"✓",color:"#6BCB77",el:"New Baseline",pk:"integration",teaching:"The pattern settles. The change becomes who you are.",tier:2,microstate:true},
};
const T3 = {
  week_1:{phase:"Multi-Phase Reading",icon:"◎",color:"#67E8F9",el:"All phases simultaneously",tier:3,pk:"integration",teaching:"Holding 4+ active phases without collapsing to one."},
  week_2:{phase:"Tradition Depth",icon:"✦",color:"#FBBF24",el:"Six wisdom traditions",tier:3,pk:"integration",teaching:"Each tradition's specific contribution to reading a phase."},
  week_3:{phase:"Live Scenarios",icon:"⚡",color:"#FB923C",el:"Real situations",tier:3,pk:"aries",teaching:"Reading ambiguous, messy, real-time pattern situations."},
  week_4:{phase:"Reading Others",icon:"→",color:"#C084FC",el:"Practitioner layer",tier:3,pk:"integration",teaching:"Holding another person's pattern without projection or rescue."},
};
const ALL_WEEKS = {tier_1:T1,tier_2:T2,tier_3:T3};

const LESSONS = {
  "Aries":{sections:[
    {h:"About This Framework",b:"This system uses the names of the twelve astrological signs as borrowed labels for recognisable patterns of human experience. You do not need to believe in astrology. The names are simply labels.\n\nEach phase describes a recurring pattern that shows up in work, relationships, health, and identity. The goal: learn to recognise these patterns in your own life and in others, so you can respond to them wisely."},
    {h:"What Aries Is",b:"Aries is the phase of the new beginning — the moment something inside you says 'I need to start this' before you fully know what it is or why. It is not a plan. It is the spark that arrives before any of that.\n\nThink of the morning you woke up knowing something had to change. The distinctive signal: you feel drawn toward something before you can explain it."},
    {h:"How It Feels From Inside",b:"From the inside, Aries feels like restlessness that has a direction. Not the vague discomfort of being stuck — but a forward pull, like something is calling.\n\nIn the body: warmth in the chest, an upward energy. Sleep may be lighter. Ideas arrive uninvited. Something wants to move."},
    {h:"Recognising It in Others",b:"Listen for: 'I've been thinking about starting...' or 'I feel like I need to...' The person may not be able to explain their impulse logically. That's the signal — the pull comes before the justification.\n\nKey difference from Aquarius: Aries people are leaning toward something new. Aquarius people are leaning away from something constraining. Both feel urgent — the direction tells them apart."},
    {h:"Aligned Response",b:"The right response to Aries is to honour the impulse by actually beginning — not by planning, not by researching, but by taking one concrete first step. Aries doesn't ask you to have it figured out. It asks you to start.\n\nTwo common mistakes: starting aggressively before the impulse has any form; or suppressing it because it seems impractical."},
    {h:"The Wisdom Tradition View",b:"In the Yoruba tradition of Ifá, the first of 256 sacred patterns is Ogbe Meji — carrying the energy of original creative force. It does not wait for ideal conditions. Scripture opens the same way: 'In the beginning, God created' — the first act is beginning, not planning.\n\nIn Kabbalah, the crown of the Tree of Life represents pure divine will — the impulse toward creation before it has taken any specific form."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: one concrete first action taken — not a conversation about the plan, but an actual move in the direction the impulse is pointing.\n\nThree common substitutions: talking about starting instead of starting; starting something adjacent but safer; waiting for perfect conditions.\n\nThe honest test: 'If no one would ever know you started this — no audience, no approval — would you still take the first step?'"},
  ]},
  "Leo":{sections:[
    {h:"What Leo Is",b:"Leo is the phase of stepping into visibility — taking up your full space, expressing what is genuinely yours, being seen as you actually are. Something wants to be shown — a piece of work, a truth, a capacity — and the cost is real: being seen means being judged.\n\nLeo doesn't promise safety. It promises the expression is worth it."},
    {h:"How It Feels From Inside",b:"From the inside, Leo feels like the need to step forward — into a room, onto a stage, through creative work. There is a vulnerability to it that other phases don't carry.\n\nIn the body: warmth, a sense of fullness, a quality of 'now.' The impulse is present-tense. It is about this moment, this room, this work."},
    {h:"Recognising It in Others",b:"Leo shows up as natural authority — the person speaking clearly about what they believe, sharing creative work without excessive apology, stepping into a leadership role because the situation calls for it.\n\nKey difference from Sagittarius: Leo is present-tense visibility. Sagittarius is future-reaching vision."},
    {h:"Aligned Response",b:"The aligned response to Leo is stepping into visibility with something real — not a polished performance designed to win approval, but the actual work, the actual truth, the actual self.\n\nMisalignment: staying invisible to be safe, or performing visibility without genuine expression behind it."},
    {h:"The Wisdom Tradition View",b:"Jesus named it directly in Matthew 5:14-16: 'Ye are the light of the world... let your light so shine before men.' This is not arrogance — it is obedience to what you were made to be. In the Yoruba tradition, Shango — the Orisha of lightning and fire — embodies the intelligence that cannot be contained.\n\nIn Kabbalah, Tiferet — Beauty — is where the interior becomes visible, where depth becomes expression."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: one concrete step into visibility with something genuine — submitting the work, speaking the truth in the room, showing up as yourself where you would ordinarily manage and diminish yourself.\n\nThree substitutions: posting about your work instead of doing it; performing impact instead of risking being seen; using 'I'm not ready yet' as permanent deferral.\n\nThe honest test: 'What would I show or say if the audience was genuinely interested and not judging?'"},
  ]},
  "Sagittarius":{sections:[
    {h:"What Sagittarius Is",b:"Sagittarius is the phase of following the vision — the pull toward something larger than the current situation, a meaning or purpose that gives life direction before the route is fully mapped.\n\nThe signal is less about visibility (that is Leo) and more about direction. Something is calling from the horizon."},
    {h:"How It Feels From Inside",b:"From the inside, Sagittarius feels like being drawn toward something you can't fully see yet. The questions are about meaning: Where is this going? What does all of this add up to?\n\nIn the body: warmth, upward movement, a sense of expansion. Different from Aries (about starting) and Leo (about being seen now). Sagittarius is about the arc — the longer story."},
    {h:"Recognising It in Others",b:"Sagittarius shows up in vision language — the person always thinking about the bigger picture, the longer arc, the meaning of what they are doing. They can see the destination before the map exists.\n\nKey difference from Leo: Leo wants to express now. Sagittarius wants to reach toward what comes next."},
    {h:"Aligned Response",b:"The aligned response to Sagittarius is following the vision before it is fully formed. Writing it down even when it is more feeling than plan. Moving toward it without waiting for justification.\n\nMisalignment: using grand vision-language as a substitute for the daily action that would actually build toward it."},
    {h:"The Wisdom Tradition View",b:"The prophet Habakkuk received the instruction: 'Write the vision, make it plain upon tables, that he may run that readeth it' (2:2). The vision must be expressed, not only held internally.\n\nIn Hermetic philosophy, fire is the element of illumination — it reveals what was in darkness. Sagittarius is fire as the force that illuminates the horizon."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: writing down what the vision actually is — even if it is not yet a plan — and directing real time and energy toward it every week.\n\nThe characteristic substitution: using vision-language as a substitute for present-tense action. 'I have a larger purpose' can be genuine — or a way of avoiding the specific, exposed step that Leo is asking for.\n\nThe honest test: 'What have I actually done this week that moved toward this vision?'"},
  ]},
  "Taurus":{sections:[
    {h:"What Taurus Is",b:"Taurus is the phase of showing up — the daily repetition that turns a spark into something real and solid. Aries is the day you decide to write the book. Taurus is the morning practice, week after week, that actually produces it.\n\nThe question Taurus asks: 'What am I willing to show up for — even when I don't feel like it?'"},
    {h:"How It Feels From Inside",b:"From the inside, Taurus feels like a quiet, faithful heaviness. Not dullness — but the particular solidity of someone who has made a commitment and is honouring it regardless of how inspired they feel.\n\nIn the body: weight and groundedness, doing real work with real hands. The excitement of the beginning has settled into something less glamorous and more durable. This is the phase working correctly."},
    {h:"Recognising It in Others",b:"Look for the person who has been showing up for the same thing for months — the daily writer, the craftsperson at the bench. They are not excited about it every day. They just do it.\n\nKey difference from Capricorn: Taurus is building for this month, this year. Capricorn is building for the next twenty years."},
    {h:"Aligned Response",b:"The right response to Taurus is to show up — not once, not when inspired, but on a regular schedule regardless of mood. Taurus doesn't promise excitement. It promises consistency builds something solid.\n\nPractical example: someone who meditates every morning whether they feel anxious or not. That is Taurus. The person who meditates only when anxious is waiting for Aries to return."},
    {h:"The Wisdom Tradition View",b:"Scripture is direct: 'Whatsoever thy hand findeth to do, do it with thy might' (Ecclesiastes 9:10). The Parable of the Talents: the servant who faithfully cultivates what was given is trusted with more.\n\nThe I Ching — Hexagram 2 (Earth receiving Heaven) — teaches that great things are not forced but accumulated through faithful daily action."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: the same action, taken on the same days, over weeks and months. Taurus alignment is always verifiable — what did you actually do last week?\n\nTwo common substitutions: optimising instead of doing (researching the perfect method rather than doing the work); mistaking one intense effort for consistent practice.\n\nThe honest test: 'Did you show up for this yesterday? The day before? What about when you were tired?'"},
  ]},
  "Virgo":{sections:[
    {h:"What Virgo Is",b:"Virgo is the phase of clear sight and refinement — seeing precisely what needs improving and then closing the gap. The signal: you can see exactly what is wrong with something and exactly what would make it better.\n\nThis is both a gift and sometimes a burden. You notice the flaw in the argument, the inefficiency in the process, the sentence that doesn't say what it means."},
    {h:"How It Feels From Inside",b:"From the inside, Virgo feels like having a target — a specific gap between what exists and what could be. The mental energy is applied rather than diffuse. You are not exploring (that is Gemini). You are correcting.\n\nIn the body: focused attention, looking closely at something. Sometimes a slight frustration — you can see what needs fixing but it hasn't been fixed yet."},
    {h:"Recognising It in Others",b:"Virgo shows up as precision — the person who spots the flaw in the argument, sees what the team is missing, notices what could be refined. They are not being negative. They are seeing clearly.\n\nKey difference from Gemini: Gemini opens into new territory, following curiosity. Virgo applies clear sight to close a specific gap."},
    {h:"Aligned Response",b:"The aligned response to Virgo is naming the specific gap clearly and then taking the specific refinement action. Both parts matter. Seeing clearly without acting is Virgo's shadow.\n\nPractical example: editing a chapter until it says exactly what it needs to say — not editing for the sake of it, but closing a specific gap between what was said and what was meant."},
    {h:"The Wisdom Tradition View",b:"Proverbs 24:3: 'Through wisdom is a house builded; and by understanding it is established.' Paul described himself as 'a wise masterbuilder' who laid the foundation precisely (1 Corinthians 3:10) — Virgo supplies the precision that makes long building trustworthy.\n\nThe I Ching teaches that faithful, receptive responsiveness builds more than force — Virgo is the quality of attention that notices what needs adjusting before the problem becomes structural."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: seeing the specific gap and taking the specific refinement action — not just noticing and staying quiet, and not noticing and talking endlessly without acting.\n\nThe most common Virgo substitution is perfectionism as avoidance — using the pursuit of a perfect outcome as a reason to never finish and release.\n\nThe honest test: 'What specific gap did I identify, and what specific action did I take to close it?'"},
  ]},
  "Capricorn":{sections:[
    {h:"What Capricorn Is",b:"Capricorn is the phase of building what will outlast you — structure, mastery, legacy, the long work that takes decades and is meant to. The signal: a particular kind of patience, the willingness to do today's unglamorous work knowing it is building something that will not be finished for years.\n\nThink of someone planting trees they will never sit under."},
    {h:"How It Feels From Inside",b:"From the inside, Capricorn feels like patient commitment — a willingness to do the work today without requiring visible results today. The timescale is long. The daily work is often unremarkable. The purpose is not.\n\nIn the body: steadiness, rootedness. Not the excitement of beginning (Aries) or the aliveness of expression (Leo) — but the dignity of someone who knows what they are building and is willing to build it faithfully."},
    {h:"Recognising It in Others",b:"Capricorn shows up as long-game thinking — the person always thinking about the institution, the precedent, the body of work, the systems that will exist after them. They measure progress in years, not weeks.\n\nKey difference from Taurus: Taurus builds the immediate foundation — daily practice, present solidity. Capricorn builds toward what will outlast the builder."},
    {h:"Aligned Response",b:"The aligned response to Capricorn is doing today's specific work toward the long-term structure without requiring visible results today. The builder lays one stone. The stone does not immediately look like a cathedral.\n\nMisalignment: building toward an outcome you no longer genuinely want because you have invested too much to stop. Sunk cost has replaced living commitment as the reason to continue."},
    {h:"The Wisdom Tradition View",b:"Paul described himself as 'a wise masterbuilder' who laid the foundation — explicitly noting someone else would build on it (1 Corinthians 3:10). Psalm 1 describes the person whose roots go deep: 'like a tree planted by the rivers of water, that bringeth forth his fruit in his season.'\n\nIn Hermetic philosophy, Saturn governs the Capricorn principle — structure, time, the slow accumulation of genuine mastery."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: doing today's work toward the long thing, without requiring it to produce visible results today. The long work gets actual time — not in theory, but in the calendar, every week.\n\nThe substitution that most costs Capricorn: doing urgent tactical work indefinitely while the long-term structure never gets built.\n\nThe honest test: 'If I were starting this today, knowing what I now know, would I still choose it?'"},
  ]},
  "Gemini":{sections:[
    {h:"What Gemini Is",b:"Gemini is the phase of following curiosity — the pull toward learning, questioning, and following interest wherever it leads without forcing it toward a predetermined destination. The signal: a quality of mental aliveness — everything is suddenly interesting, and one question leads to three more.\n\nThis is not scattered thinking. It is intelligence gathering — the mind doing the work of collecting before it is ready to apply."},
    {h:"How It Feels From Inside",b:"From the inside, Gemini feels like your mind is suddenly alive and making connections everywhere. Questions multiply faster than answers — and this feels right rather than frustrating. You are gathering, not yet applying.\n\nIn the body: lightness, mental aliveness, electricity. Ideas come fast. The mind wants to keep moving."},
    {h:"Recognising It in Others",b:"Gemini shows up as curiosity that ranges widely — the person reading across five different fields at once, making unexpected connections, holding multiple open questions simultaneously.\n\nKey difference from Virgo: Virgo sees a specific gap to close. Gemini sees a landscape of interesting territory to explore."},
    {h:"Aligned Response",b:"The aligned response to Gemini is following the curiosity wherever it honestly goes, without forcing it toward a predetermined destination. The mind is gathering. Let it gather.\n\nMisalignment: forcing a single track before the gathering is complete, or using learning as permanent avoidance of the action the learning was supposed to enable."},
    {h:"The Wisdom Tradition View",b:"Jesus described the movement of the Spirit as wind in John 3:8: 'The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth.' Air cannot be controlled, only received. Gemini intelligence has this quality.\n\nIn Hermetic philosophy, Hermes (Mercury) governs the air element — the intelligence that carries meaning between worlds, connects what was separate."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: following genuine curiosity wherever it leads, trusting that the gathering is productive even when it doesn't yet look like anything.\n\nThe characteristic Gemini substitution: using learning as permanent avoidance — accumulating more information as a substitute for taking the action the learning was supposed to enable.\n\nThe honest test: 'Is there something the curiosity has been circling that I have been using the learning to avoid?'"},
  ]},
  "Libra":{sections:[
    {h:"What Libra Is",b:"Libra is the phase of genuine encounter — the pull toward real presence with another person, authentic partnership, the balance that requires actually seeing someone else rather than managing them.\n\nThe signal: an openness to the other — not performing interest, not managing the relationship to stay comfortable, but actually attending to what is real for this person."},
    {h:"How It Feels From Inside",b:"From the inside, Libra feels like genuine attention to another person — actually listening rather than waiting to speak, actually adjusting to what they need rather than what would be convenient.\n\nIn the body: a quality of receptiveness, of turning toward. The self is still present — Libra is not self-erasure — but the attention has genuinely moved to include the other."},
    {h:"Recognising It in Others",b:"Libra shows up as attunement — the person who is genuinely listening, who adjusts to what the other actually needs, who cares about whether the relationship is fair and real rather than just convenient.\n\nKey difference from Cancer: Cancer goes inward to feel what is emotionally true about oneself. Libra moves outward to genuinely receive another person."},
    {h:"Aligned Response",b:"The aligned response to Libra is genuine presence — actually listening, actually saying what is true in the relationship, actually showing up for the balance the partnership requires. Not managing the relationship. Inhabiting it.\n\nPractical example: having an honest conversation about a dynamic that isn't working — not to manage the situation, but because the relationship matters enough to have the real conversation."},
    {h:"The Wisdom Tradition View",b:"The prophet Amos asked the question that defines Libra: 'Can two walk together, except they be agreed?' (3:3) — the deep question of genuine relational alignment.\n\nThe Book of Ruth is a sustained Libra text — the loyalty between Ruth and Naomi, the quality of genuine presence with another person through difficulty. 'Whither thou goest, I will go' is not obligation. It is the fruit of genuine encounter."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: genuine encounter — actually attending, actually saying what is true, actually showing up for the relationship. The test is behavioral: did the honest conversation happen, or the managed one?\n\nThe characteristic Libra substitution: managing the relationship rather than inhabiting it — saying what keeps the peace while never having the real conversation.\n\nThe honest test: 'Am I actually attending to this person, or managing my own discomfort through the appearance of attending?'"},
  ]},
  "Aquarius":{sections:[
    {h:"What Aquarius Is",b:"Aquarius is the phase of breaking free — the moment when something that once served you has become a trap, and you recognise that continuing to stay is costing you more than leaving would.\n\nThe key difference from Aries: Aries is pulled toward something new. Aquarius is pushed away from something constraining. Aries says 'I have to start this.' Aquarius says 'I cannot keep doing this.'"},
    {h:"How It Feels From Inside",b:"From the inside, Aquarius feels like a suffocation that has finally become undeniable. Something that was manageable for years has crossed a threshold.\n\nIn the body: tightness in the chest, a sense of being physically too small for the space you are occupying, electric restlessness. The body is communicating clearly."},
    {h:"Recognising It in Others",b:"Listen for: 'I can't keep doing this.' 'This no longer fits who I am.' The person is not describing where they want to go. They are describing what they can no longer tolerate.\n\nThe emotional quality: not excited (that would be Aries) but clear. A knowing that has moved past debate into quiet certainty."},
    {h:"Aligned Response",b:"The right response to Aquarius is to honour the recognition — not impulsively, not by breaking everything at once, but by naming precisely what has become the cage and taking deliberate steps to exit it.\n\nThe most common mistake: breaking things for the relief of breaking rather than from a clear understanding of what specifically is constraining you."},
    {h:"The Wisdom Tradition View",b:"Galatians 5:1: 'Stand fast therefore in the liberty wherewith Christ hath made us free, and be not entangled again with the yoke of bondage.' The Bible treats captivity — including the self-imposed kind — as something to be freed from, not endured.\n\nKabbalah teaches that when a form can no longer contain the intelligence passing through it, it must break — not as failure but as growth."},
    {h:"Cooperation vs. Substitution",b:"The key question: is the person moving toward genuine freedom, or substituting one form of constraint for another while calling it liberation?\n\nThree common substitutions: making the exit loud but recreating the same situation in a new setting; breaking things in general because breaking feels like freedom; recommitting to the constraint while using liberation language.\n\nThe honest test: 'What specifically were you not free to be or do? Are you now free to be or do that?'"},
  ]},
  "Cancer":{sections:[
    {h:"What Cancer Is",b:"Cancer is the phase of accessing what is emotionally true — going inward to feel what is real, identifying what nourishes and what depletes, and often encountering the family patterns and emotional inheritance that shape how you operate.\n\nThe signal: an emotional opening — something that has been kept at a distance becomes impossible to ignore."},
    {h:"How It Feels From Inside",b:"From the inside, Cancer feels like an emotional opening — something real is being felt that may have been carefully avoided. The feelings are not comfortable, but they are true.\n\nIn the body: softness, depth, a quality of going inward. The outward world becomes less interesting. What is inside becomes more pressing."},
    {h:"Recognising It in Others",b:"Cancer shows up as emotional depth and inward orientation — the person who goes quiet when things get difficult, who is attuned to what feeds them and what depletes them.\n\nKey difference from Scorpio: Cancer is feeling deeply — processing emotion. Scorpio has a specific recognition that something must end."},
    {h:"Aligned Response",b:"The aligned response to Cancer is moving toward the feeling rather than away from it. The emotion is not a problem to be managed. It is information. Sit with it long enough to hear what it is telling you.\n\nThe misalignment is emotional management without actual interior movement."},
    {h:"The Wisdom Tradition View",b:"The Psalms speak to Cancer directly: 'Deep calleth unto deep' (Psalm 42:7) — the deepest part of you resonates with the deepest part of life. You cannot receive that resonance from a distance.\n\nIn Kabbalah, water corresponds to Chokhmah — intuitive wisdom, the knowing that arrives before rational thought. In the Yoruba tradition, Yemoja — Orisha of the ocean and of emotional depth — governs the Cancer principle."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: moving toward the feeling rather than away from it — sitting with the emotion, asking what it knows, letting it inform rather than control.\n\nThe characteristic Cancer substitution: emotional management without actual interior movement — talking about feelings without actually feeling them.\n\nThe honest test: 'Is there something I have been feeling but not acknowledging?'"},
  ]},
  "Scorpio":{sections:[
    {h:"What Scorpio Is",b:"Scorpio is the phase of necessary endings — the recognition that something in your life has run its course and cannot continue, no matter how much you might want it to. This is not the end of a chapter. It is the end of the whole book.\n\nThe signal: not a desire for change, but a bone-deep knowing that what exists simply cannot go on."},
    {h:"How It Feels From Inside",b:"From the inside, Scorpio feels like a quiet, serious necessity. Not dramatic excitement about change — that would be Aries. Not emotional grief about loss — that would be Cancer. Something quieter and more certain: this cannot continue.\n\nIn the body: intensity, depth, a particular heaviness that is not sadness but weight."},
    {h:"Recognising It in Others",b:"The person in Scorpio knows something. They may not be ready to say it out loud. But there is a quality of deliberateness about them — a sense that something important is being held beneath the surface.\n\nKey difference from Cancer: Cancer is feeling deeply. Scorpio has a specific recognition that something must end."},
    {h:"Aligned Response",b:"The right response to Scorpio is conscious participation in the ending. Not forcing it faster than it needs to go. Not delaying it past its natural time. Not numbing yourself against it. Just meeting what must be met.\n\nThe most costly mistake: prolonging what must die to avoid the pain of loss."},
    {h:"The Wisdom Tradition View",b:"In the Yoruba tradition of Ifá, the pattern called Oyeku Meji governs death and endings. It is not feared — it is honoured as sacred. Oyeku teaches that the seed must die in the ground before the plant can grow.\n\nJesus said it plainly: 'Except a corn of wheat fall into the ground and die, it abideth alone: but if it die, it bringeth forth much fruit' (John 12:24)."},
    {h:"Cooperation vs. Substitution",b:"The key question: is the thing actually ending, or is the person describing an ending while keeping the thing alive?\n\nThree common substitutions: starting something new before the old thing has actually concluded; understanding the ending deeply but never acting on it; making the ending theatrical rather than quiet and real.\n\nThe honest test: 'What is the concrete, observable action that marks the ending? Has it happened?'"},
  ]},
  "Pisces":{sections:[
    {h:"What Pisces Is",b:"Pisces is the phase of graceful release — what has run its full course is returned with grace, forgiven, surrendered. Where Scorpio requires something to die, Pisces allows something to complete. The quality is different: not destruction for new life, but fullness that can let go.\n\nThe signal: a readiness to release — a sense of completion, of something having run its natural course."},
    {h:"How It Feels From Inside",b:"From the inside, Pisces feels like a readiness to release. Not resignation — not giving up before the work is done — but the particular peace of something actually finished. The form has served its purpose.\n\nIn the body: a quality of softness, of letting go, of coming to rest."},
    {h:"Recognising It in Others",b:"Pisces shows up as graceful completion — the person who can release what others would cling to, who forgives genuinely rather than performing forgiveness, who can close a chapter with dignity.\n\nKey difference from Scorpio: Scorpio ends because continuing is causing damage. Pisces completes because the natural arc has been fulfilled."},
    {h:"Aligned Response",b:"The aligned response to Pisces is releasing what is genuinely complete. The release should have a quality of fullness, not escape.\n\nMisalignment: premature release — using language like 'I've forgiven this' to avoid the honest encounter the situation still requires. Dissolution cannot precede completion."},
    {h:"The Wisdom Tradition View",b:"Isaiah 43:18-19: 'Remember not the former things... Behold, I will do a new thing.' But the new thing cannot come while the old thing is still being maintained. Simeon's words in Luke 2:29: 'Lord, now lettest thou thy servant depart in peace.' The life fully lived, released with gratitude.\n\nBaptism — going down into death and coming up into new life — enacts the full arc in physical form."},
    {h:"Cooperation vs. Substitution",b:"Real cooperation: releasing something that is genuinely complete. The quality is grace, not escape.\n\nThe characteristic Pisces substitution: premature release — saying 'I've forgiven' or 'I've released this' to avoid the genuine encounter the situation still requires.\n\nThe honest test: 'Has this actually been fully met — not in principle, not in intention, but in practice?'"},
  ]},
  "Spring":{sections:[
    {h:"The Spring Arc",b:"The Spring Sequence is Aries → Taurus → Gemini: Ignition grounds into foundation, which opens into understanding.\n\nEach phase enables the next. Rushing any stage collapses the arc."},
    {h:"Aries → Taurus",b:"What Aries gives Taurus: the genuine impulse or ground that makes the next phase possible.\n\nThe most common break: Aries happens but Taurus is skipped. The sequence stalls and must restart."},
    {h:"Taurus → Gemini",b:"What Taurus gives Gemini: the embodied or expressed or met substance that makes Gemini genuinely available.\n\nThe transition happens when Taurus has done enough real work that Gemini can genuinely open."},
    {h:"What Spring Produces",b:"The Spring arc produces something that cannot be acquired by shortcut — it requires the full sequence. Each phase contributes something the others cannot.\n\nThis is what prepares the following season."},
    {h:"Common Sequence Failures",b:"Skipping the middle phase: the sequence breaks and produces nothing solid.\n\nStaying in the first phase: each new beginning dies before it reaches the next phase because the next beginning arrives first.\n\nForcing the third phase: trying to arrive at the final movement before the middle phase has done its work."},
    {h:"Reading Spring in Others",b:"Watch for whether the full arc is present. Someone in genuine Spring can name what is actually happening in all three phases — not just the most exciting one.\n\nThe question that reveals Spring's state: 'What specifically is the work of each phase right now?'"},
  ]},
  "Summer":{sections:[
    {h:"The Summer Arc",b:"The Summer Sequence is Cancer → Leo → Virgo: Depth enables expression; expression enables refinement.\n\nEach phase enables the next. Rushing any stage collapses the arc."},
    {h:"Cancer → Leo",b:"What Cancer gives Leo: the genuine impulse or ground that makes the next phase possible.\n\nThe most common break: Cancer happens but Leo is skipped. The sequence stalls and must restart."},
    {h:"Leo → Virgo",b:"What Leo gives Virgo: the embodied or expressed or met substance that makes Virgo genuinely available.\n\nThe transition happens when Leo has done enough real work that Virgo can genuinely open."},
    {h:"What Summer Produces",b:"The Summer arc produces something that cannot be acquired by shortcut — it requires the full sequence. Each phase contributes something the others cannot.\n\nThis is what prepares the following season."},
    {h:"Common Sequence Failures",b:"Skipping the middle phase: the sequence breaks and produces nothing solid.\n\nStaying in the first phase: each new beginning dies before it reaches the next phase because the next beginning arrives first.\n\nForcing the third phase: trying to arrive at the final movement before the middle phase has done its work."},
    {h:"Reading Summer in Others",b:"Watch for whether the full arc is present. Someone in genuine Summer can name what is actually happening in all three phases — not just the most exciting one.\n\nThe question that reveals Summer's state: 'What specifically is the work of each phase right now?'"},
  ]},
  "Autumn":{sections:[
    {h:"The Autumn Arc",b:"The Autumn Sequence is Libra → Scorpio → Sagittarius: Genuine encounter leads to necessary ending, which opens vision.\n\nEach phase enables the next. Rushing any stage collapses the arc."},
    {h:"Libra → Scorpio",b:"What Libra gives Scorpio: the genuine impulse or ground that makes the next phase possible.\n\nThe most common break: Libra happens but Scorpio is skipped. The sequence stalls and must restart."},
    {h:"Scorpio → Sagittarius",b:"What Scorpio gives Sagittarius: the embodied or expressed or met substance that makes Sagittarius genuinely available.\n\nThe transition happens when Scorpio has done enough real work that Sagittarius can genuinely open."},
    {h:"What Autumn Produces",b:"The Autumn arc produces something that cannot be acquired by shortcut — it requires the full sequence. Each phase contributes something the others cannot.\n\nThis is what prepares the following season."},
    {h:"Common Sequence Failures",b:"Skipping the middle phase: the sequence breaks and produces nothing solid.\n\nStaying in the first phase: each new beginning dies before it reaches the next phase because the next beginning arrives first.\n\nForcing the third phase: trying to arrive at the final movement before the middle phase has done its work."},
    {h:"Reading Autumn in Others",b:"Watch for whether the full arc is present. Someone in genuine Autumn can name what is actually happening in all three phases — not just the most exciting one.\n\nThe question that reveals Autumn's state: 'What specifically is the work of each phase right now?'"},
  ]},
  "Winter":{sections:[
    {h:"The Winter Arc",b:"The Winter Sequence is Capricorn → Aquarius → Pisces: Structure is built, broken open, and finally dissolved.\n\nEach phase enables the next. Rushing any stage collapses the arc."},
    {h:"Capricorn → Aquarius",b:"What Capricorn gives Aquarius: the genuine impulse or ground that makes the next phase possible.\n\nThe most common break: Capricorn happens but Aquarius is skipped. The sequence stalls and must restart."},
    {h:"Aquarius → Pisces",b:"What Aquarius gives Pisces: the embodied or expressed or met substance that makes Pisces genuinely available.\n\nThe transition happens when Aquarius has done enough real work that Pisces can genuinely open."},
    {h:"What Winter Produces",b:"The Winter arc produces something that cannot be acquired by shortcut — it requires the full sequence. Each phase contributes something the others cannot.\n\nThis is what prepares the following season."},
    {h:"Common Sequence Failures",b:"Skipping the middle phase: the sequence breaks and produces nothing solid.\n\nStaying in the first phase: each new beginning dies before it reaches the next phase because the next beginning arrives first.\n\nForcing the third phase: trying to arrive at the final movement before the middle phase has done its work."},
    {h:"Reading Winter in Others",b:"Watch for whether the full arc is present. Someone in genuine Winter can name what is actually happening in all three phases — not just the most exciting one.\n\nThe question that reveals Winter's state: 'What specifically is the work of each phase right now?'"},
  ]},
  "Initiation":{sections:[
    {h:"What Initiation Is",b:"Initiation is the pattern beginning to stir stage of any pattern. The signal: the first whisper.\n\nTeaching: Catch it here before it has to press hard."},
    {h:"Initiation Across the Elements",b:"Fire Initiation: tends to be vivid and urgent — easy to miss at first, then impossible to ignore.\n\nEarth Initiation: quieter and steadier — the signal builds slowly. Air Initiation: shows as questions, connections, and relational shifts. Water Initiation: the most interior — often felt before it is understood."},
    {h:"Initiation in Specific Phases",b:"Initiation looks different in each phase but has a consistent quality. In fire phases it tends to be warmer and more urgent. In earth phases, more gradual and physical. In air phases, more mental and relational. In water phases, more interior and felt.\n\nWith practice, you recognise the quality of Initiation regardless of which phase it is in."},
    {h:"Aligned Response",b:"The right response to Initiation: cooperate with what it is asking without forcing it faster or suppressing it.\n\nInitiation has its own pace. The work is to meet it at that pace — not to rush toward the next stage, and not to resist what the current stage requires."},
    {h:"Common Misreadings",b:"Confusing Initiation with the whole arc: the stage is not the pattern. Initiation will move into the next stage if met well.\n\nForcing the next stage: trying to skip Initiation by moving prematurely to what comes after.\n\nDismissing Initiation as unimportant: the stage that is missed most often produces the difficulties that seem to arrive without warning."},
    {h:"What Repetition Teaches",b:"After meeting many instances of Initiation consciously — seeing it clearly, cooperating with what it asks — something changes. You develop a felt sense of this stage that makes it recognisable even before it announces itself.\n\nThis is what pattern literacy in its mature form looks like: not knowing the name, but recognising the quality."},
  ]},
  "Expansion":{sections:[
    {h:"What Expansion Is",b:"Expansion is the pattern pressing forward stage of any pattern. The signal: momentum building.\n\nTeaching: Move with the energy. It is available now."},
    {h:"Expansion Across the Elements",b:"Fire Expansion: tends to be vivid and urgent — easy to miss at first, then impossible to ignore.\n\nEarth Expansion: quieter and steadier — the signal builds slowly. Air Expansion: shows as questions, connections, and relational shifts. Water Expansion: the most interior — often felt before it is understood."},
    {h:"Expansion in Specific Phases",b:"Expansion looks different in each phase but has a consistent quality. In fire phases it tends to be warmer and more urgent. In earth phases, more gradual and physical. In air phases, more mental and relational. In water phases, more interior and felt.\n\nWith practice, you recognise the quality of Expansion regardless of which phase it is in."},
    {h:"Aligned Response",b:"The right response to Expansion: cooperate with what it is asking without forcing it faster or suppressing it.\n\nExpansion has its own pace. The work is to meet it at that pace — not to rush toward the next stage, and not to resist what the current stage requires."},
    {h:"Common Misreadings",b:"Confusing Expansion with the whole arc: the stage is not the pattern. Expansion will move into the next stage if met well.\n\nForcing the next stage: trying to skip Expansion by moving prematurely to what comes after.\n\nDismissing Expansion as unimportant: the stage that is missed most often produces the difficulties that seem to arrive without warning."},
    {h:"What Repetition Teaches",b:"After meeting many instances of Expansion consciously — seeing it clearly, cooperating with what it asks — something changes. You develop a felt sense of this stage that makes it recognisable even before it announces itself.\n\nThis is what pattern literacy in its mature form looks like: not knowing the name, but recognising the quality."},
  ]},
  "Contraction":{sections:[
    {h:"What Contraction Is",b:"Contraction is the momentum has met resistance stage of any pattern. The signal: reality pushing back.\n\nTeaching: Where the actual learning happens. The difficulty is the teaching."},
    {h:"Contraction Across the Elements",b:"Fire Contraction: tends to be vivid and urgent — easy to miss at first, then impossible to ignore.\n\nEarth Contraction: quieter and steadier — the signal builds slowly. Air Contraction: shows as questions, connections, and relational shifts. Water Contraction: the most interior — often felt before it is understood."},
    {h:"Contraction in Specific Phases",b:"Contraction looks different in each phase but has a consistent quality. In fire phases it tends to be warmer and more urgent. In earth phases, more gradual and physical. In air phases, more mental and relational. In water phases, more interior and felt.\n\nWith practice, you recognise the quality of Contraction regardless of which phase it is in."},
    {h:"Aligned Response",b:"The right response to Contraction: cooperate with what it is asking without forcing it faster or suppressing it.\n\nContraction has its own pace. The work is to meet it at that pace — not to rush toward the next stage, and not to resist what the current stage requires."},
    {h:"Common Misreadings",b:"Confusing Contraction with the whole arc: the stage is not the pattern. Contraction will move into the next stage if met well.\n\nForcing the next stage: trying to skip Contraction by moving prematurely to what comes after.\n\nDismissing Contraction as unimportant: the stage that is missed most often produces the difficulties that seem to arrive without warning."},
    {h:"What Repetition Teaches",b:"After meeting many instances of Contraction consciously — seeing it clearly, cooperating with what it asks — something changes. You develop a felt sense of this stage that makes it recognisable even before it announces itself.\n\nThis is what pattern literacy in its mature form looks like: not knowing the name, but recognising the quality."},
  ]},
  "Integration":{sections:[
    {h:"What Integration Is",b:"Integration is the what was difficult is now familiar stage of any pattern. The signal: quietness.\n\nTeaching: The pattern settles. The change becomes who you are."},
    {h:"Integration Across the Elements",b:"Fire Integration: tends to be vivid and urgent — easy to miss at first, then impossible to ignore.\n\nEarth Integration: quieter and steadier — the signal builds slowly. Air Integration: shows as questions, connections, and relational shifts. Water Integration: the most interior — often felt before it is understood."},
    {h:"Integration in Specific Phases",b:"Integration looks different in each phase but has a consistent quality. In fire phases it tends to be warmer and more urgent. In earth phases, more gradual and physical. In air phases, more mental and relational. In water phases, more interior and felt.\n\nWith practice, you recognise the quality of Integration regardless of which phase it is in."},
    {h:"Aligned Response",b:"The right response to Integration: cooperate with what it is asking without forcing it faster or suppressing it.\n\nIntegration has its own pace. The work is to meet it at that pace — not to rush toward the next stage, and not to resist what the current stage requires."},
    {h:"Common Misreadings",b:"Confusing Integration with the whole arc: the stage is not the pattern. Integration will move into the next stage if met well.\n\nForcing the next stage: trying to skip Integration by moving prematurely to what comes after.\n\nDismissing Integration as unimportant: the stage that is missed most often produces the difficulties that seem to arrive without warning."},
    {h:"What Repetition Teaches",b:"After meeting many instances of Integration consciously — seeing it clearly, cooperating with what it asks — something changes. You develop a felt sense of this stage that makes it recognisable even before it announces itself.\n\nThis is what pattern literacy in its mature form looks like: not knowing the name, but recognising the quality."},
  ]},
  "Multi-Phase Reading":{sections:[
    {h:"The Mastery Challenge",b:"This week develops a practitioner-level skill that the previous tiers prepared for but could not produce on their own.\n\nFocus: Holding 4+ active phases without collapsing to one."},
    {h:"The Core Practice",b:"Choose one real situation each day this week. Apply the full framework: phase, element, micro-state, tier, aligned response, characteristic substitution.\n\nThe constraint: do this in under five minutes. Mastery is not slow analysis. It is quick, accurate recognition."},
    {h:"Where Learners Get Stuck",b:"The most common plateau: using conceptual knowledge in place of actual recognition. Knowing the framework and seeing clearly in real time are different skills.\n\nThe second plateau: certainty. Committing to a reading and defending it rather than holding it lightly and updating when new information arrives."},
    {h:"Reading in Real Time",b:"The skill becomes real when you can receive what someone is living, form an accurate reading, and respond in a way that is actually useful — without explaining the framework, without naming phases aloud.\n\nThis week, practice translating framework insights into ordinary language."},
    {h:"The Tradition Resource",b:"Each of the six wisdom traditions has particular strengths for particular phases. This week, identify which tradition speaks most clearly to the situation you are working with.\n\nThe traditions are not decoration. They are working tools that carry centuries of refined understanding."},
    {h:"What You Are Building",b:"This week adds the capacity for Holding 4+ active phases without collapsing to one. to your practitioner toolkit.\n\nBy the end of the week, this should feel like a natural way of seeing — not a technique applied after the fact, but the default lens."},
  ]},
  "Tradition Depth":{sections:[
    {h:"The Mastery Challenge",b:"This week develops a practitioner-level skill that the previous tiers prepared for but could not produce on their own.\n\nFocus: Each tradition's specific contribution to reading a phase."},
    {h:"The Core Practice",b:"Choose one real situation each day this week. Apply the full framework: phase, element, micro-state, tier, aligned response, characteristic substitution.\n\nThe constraint: do this in under five minutes. Mastery is not slow analysis. It is quick, accurate recognition."},
    {h:"Where Learners Get Stuck",b:"The most common plateau: using conceptual knowledge in place of actual recognition. Knowing the framework and seeing clearly in real time are different skills.\n\nThe second plateau: certainty. Committing to a reading and defending it rather than holding it lightly and updating when new information arrives."},
    {h:"Reading in Real Time",b:"The skill becomes real when you can receive what someone is living, form an accurate reading, and respond in a way that is actually useful — without explaining the framework, without naming phases aloud.\n\nThis week, practice translating framework insights into ordinary language."},
    {h:"The Tradition Resource",b:"Each of the six wisdom traditions has particular strengths for particular phases. This week, identify which tradition speaks most clearly to the situation you are working with.\n\nThe traditions are not decoration. They are working tools that carry centuries of refined understanding."},
    {h:"What You Are Building",b:"This week adds the capacity for Each tradition's specific contribution to reading a phase. to your practitioner toolkit.\n\nBy the end of the week, this should feel like a natural way of seeing — not a technique applied after the fact, but the default lens."},
  ]},
  "Live Scenarios":{sections:[
    {h:"The Mastery Challenge",b:"This week develops a practitioner-level skill that the previous tiers prepared for but could not produce on their own.\n\nFocus: Reading ambiguous, messy, real-time pattern situations."},
    {h:"The Core Practice",b:"Choose one real situation each day this week. Apply the full framework: phase, element, micro-state, tier, aligned response, characteristic substitution.\n\nThe constraint: do this in under five minutes. Mastery is not slow analysis. It is quick, accurate recognition."},
    {h:"Where Learners Get Stuck",b:"The most common plateau: using conceptual knowledge in place of actual recognition. Knowing the framework and seeing clearly in real time are different skills.\n\nThe second plateau: certainty. Committing to a reading and defending it rather than holding it lightly and updating when new information arrives."},
    {h:"Reading in Real Time",b:"The skill becomes real when you can receive what someone is living, form an accurate reading, and respond in a way that is actually useful — without explaining the framework, without naming phases aloud.\n\nThis week, practice translating framework insights into ordinary language."},
    {h:"The Tradition Resource",b:"Each of the six wisdom traditions has particular strengths for particular phases. This week, identify which tradition speaks most clearly to the situation you are working with.\n\nThe traditions are not decoration. They are working tools that carry centuries of refined understanding."},
    {h:"What You Are Building",b:"This week adds the capacity for Reading ambiguous, messy, real-time pattern situations. to your practitioner toolkit.\n\nBy the end of the week, this should feel like a natural way of seeing — not a technique applied after the fact, but the default lens."},
  ]},
  "Reading Others":{sections:[
    {h:"The Mastery Challenge",b:"This week develops a practitioner-level skill that the previous tiers prepared for but could not produce on their own.\n\nFocus: Holding another person's pattern without projection or rescue."},
    {h:"The Core Practice",b:"Choose one real situation each day this week. Apply the full framework: phase, element, micro-state, tier, aligned response, characteristic substitution.\n\nThe constraint: do this in under five minutes. Mastery is not slow analysis. It is quick, accurate recognition."},
    {h:"Where Learners Get Stuck",b:"The most common plateau: using conceptual knowledge in place of actual recognition. Knowing the framework and seeing clearly in real time are different skills.\n\nThe second plateau: certainty. Committing to a reading and defending it rather than holding it lightly and updating when new information arrives."},
    {h:"Reading in Real Time",b:"The skill becomes real when you can receive what someone is living, form an accurate reading, and respond in a way that is actually useful — without explaining the framework, without naming phases aloud.\n\nThis week, practice translating framework insights into ordinary language."},
    {h:"The Tradition Resource",b:"Each of the six wisdom traditions has particular strengths for particular phases. This week, identify which tradition speaks most clearly to the situation you are working with.\n\nThe traditions are not decoration. They are working tools that carry centuries of refined understanding."},
    {h:"What You Are Building",b:"This week adds the capacity for Holding another person's pattern without projection or rescue. to your practitioner toolkit.\n\nBy the end of the week, this should feel like a natural way of seeing — not a technique applied after the fact, but the default lens."},
  ]},
};

const makeDays=(w)=>{
  const p=w.phase,el=(w.el||"").split(" ")[0],dist=w.dist||"";
  if(w.tier===1) return [
    {day:1,name:"Monday",   title:`${p} — In Your Life`,           desc:`Recall a recent moment when ${p} energy was present.`,                                              exercise:`Write three sentences describing it. What were the specific signals?`,                              focus:"Recognition in self",          time:8},
    {day:2,name:"Tuesday",  title:`${p} — In Others`,              desc:`Listen and watch for ${p} in people around you today.`,                                             exercise:`Record one clear example. What specific signals gave it away?`,                                    focus:"Recognition in others",        time:10},
    {day:3,name:"Wednesday",title:`Element Attunement — ${el}`,    desc:`Spend 15 minutes with the ${el.toLowerCase()} element directly.`,                                   exercise:`What in your life right now has this elemental quality?`,                                          focus:"Elemental embodiment",         time:15},
    {day:4,name:"Thursday", title:"Pattern Name",                   desc:`Work with the pattern name for ${p}.`,                                                              exercise:`Say the pattern name aloud slowly. Where in your life does it fit right now?`,                    focus:"Pattern name internalization", time:5},
    {day:5,name:"Friday",   title:`Distinction — ${p} vs ${dist}`, desc:`Both ${p} and ${dist} can feel similar. The difference is essential.`,                              exercise:`Write one clear real example of each. What is the single essential distinction?`,                focus:"Cross-phase discrimination",   time:10},
    {day:6,name:"Saturday", title:"Life Areas Mapping",             desc:`Map ${p} across all six life domains.`,                                                             exercise:`Career · Relationship · Identity · Health · Finances · Family — where is ${p} active right now?`,focus:"Contextual mapping",           time:12},
    {day:7,name:"Sunday",   title:"Integration & Assessment",       desc:`Review your week with ${p}.`,                                                                       exercise:`Rate 1–5: recognition in self, recognition in others, distinction accuracy. Write one insight.`,  focus:"Self-assessment",              time:10},
  ];
  if(w.tier===2&&w.seasonal){const pts=w.el.split(" → ");return [
    {day:1,name:"Monday",   title:`${pts[0]} in the Sequence`,        desc:`Review your Tier 1 ${pts[0]} lesson.`,                                exercise:`What specifically does ${pts[0]} make possible that couldn't exist without it?`,    focus:"Sequential logic",             time:10},
    {day:2,name:"Tuesday",  title:`${pts[0]}→${pts[1]} Transition`,  desc:`What must be present in ${pts[0]} for ${pts[1]} to become available?`,exercise:`Describe a time this transition succeeded. What enabled it?`,                     focus:"Phase transition",             time:10},
    {day:3,name:"Wednesday",title:`${pts[1]} in the Sequence`,        desc:`The middle phase — receives from ${pts[0]}, prepares ${pts[2]}.`,    exercise:`What would ${pts[1]} look like if ${pts[0]} had been skipped?`,                  focus:"Sequential continuity",        time:10},
    {day:4,name:"Thursday", title:`${pts[1]}→${pts[2]} Transition`,  desc:`What must be present in ${pts[1]} for ${pts[2]} to emerge?`,          exercise:`Describe a time you saw this transition in someone else's life.`,               focus:"Phase transition",             time:10},
    {day:5,name:"Friday",   title:`${pts[2]} in the Sequence`,        desc:`The final phase — what it produces that prepares the next season.`,  exercise:`What does ${pts[2]} give to the following season that couldn't have come earlier?`,focus:"Sequential completion",        time:10},
    {day:6,name:"Saturday", title:`${w.phase} — Life Areas Map`,      desc:`Map the full sequence across your life domains.`,                   exercise:`Which are in ${pts[0]}? ${pts[1]}? ${pts[2]}?`,                                  focus:"Sequential contextual mapping",time:15},
    {day:7,name:"Sunday",   title:"Integration",                      desc:`The sequence as a complete arc.`,                                   exercise:`Write the sequence in one sentence. What breaks it most often? Rate 1–5.`,         focus:"Arc integration",              time:10},
  ];}
  if(w.tier===2&&w.microstate) return [
    {day:1,name:"Monday",   title:`${p} — The Signal`,    desc:`${p} has a characteristic feeling. Learn to catch it early.`,             exercise:`Describe what ${p} feels like in one phase you know well. Then in a second phase.`,focus:"Micro-state recognition",      time:10},
    {day:2,name:"Tuesday",  title:`${p} Across Elements`, desc:`${p} looks different in Fire, Earth, Air, and Water phases.`,            exercise:`Write what ${p} looks like in a Fire phase vs a Water phase. What changes?`,      focus:"Cross-phase micro-state",      time:12},
    {day:3,name:"Wednesday",title:`Aligned Response`,     desc:`This micro-state asks for something specific.`,                          exercise:`For a current ${p} in your life: what is it asking for? What would cooperation look like?`,focus:"Aligned action",          time:10},
    {day:4,name:"Thursday", title:`${p} in Others`,       desc:`Reading this micro-state in another person's situation.`,                exercise:`Find one person currently in ${p}. What are the signals? What do they most need?`, focus:"External micro-state reading", time:10},
    {day:5,name:"Friday",   title:`${p} — Adjacent States`,desc:`What distinguishes ${p} from the micro-state before and after it?`,    exercise:`Write one scenario that could be misread. What signal actually decides?`,          focus:"Micro-state distinction",      time:10},
    {day:6,name:"Saturday", title:`${p} — Life Areas Map`,desc:`Map the ${p} micro-state across your active patterns.`,                  exercise:`Which of your active patterns are currently in ${p}? What is each one asking?`,   focus:"Contextual micro-state mapping",time:15},
    {day:7,name:"Sunday",   title:"Integration",          desc:`The teaching of ${p} in your own words.`,                                exercise:`Write it in three sentences. What is one ${p} you missed in the past?`,            focus:"Micro-state integration",      time:10},
  ];
  return [
    {day:1,name:"Monday",   title:`${p} — Application`,   desc:`Apply the full framework to one real situation.`,     exercise:`Map every phase, element, and micro-state active.`,                            focus:"Full framework application",time:20},
    {day:2,name:"Tuesday",  title:"Scenario Practice",    desc:`Read an ambiguous scenario.`,                         exercise:`Phase · Element · Micro-state · Aligned response. Practice with 3 scenarios.`,  focus:"Applied reading",          time:20},
    {day:3,name:"Wednesday",title:"Teaching Practice",    desc:`Explain the framework to someone who doesn't know it.`,exercise:`Teach one phase. Note what confused them and what landed.`,                    focus:"Teaching as mastery test", time:20},
    {day:4,name:"Thursday", title:"Live Reading",         desc:`Read a real conversation in real time.`,               exercise:`Listen to someone today. What phase? Which micro-state? What do they need?`,    focus:"Real-time recognition",    time:15},
    {day:5,name:"Friday",   title:"Tradition Integration",desc:`Apply one wisdom tradition to your current reading.`,  exercise:`What does Ifá / Kabbalah / I Ching / Scripture say about what you're navigating?`,focus:"Tradition depth",          time:15},
    {day:6,name:"Saturday", title:"Multi-Phase Map",      desc:`Map all active patterns across all life domains.`,     exercise:`Draw or write the full map. Are the right responses in place for each domain?`,  focus:"Multi-phase awareness",    time:20},
    {day:7,name:"Sunday",   title:"Mastery Assessment",   desc:`Honest evaluation of your full framework literacy.`,   exercise:`Rate 1–5: 12-phase recognition, micro-state precision, sequential reading, tradition depth.`,focus:"Mastery evaluation",time:15},
  ];
};

const PA={
  aries:{misalignment:{chaos:"Multiple new projects, none gaining traction.",suffering:"The impulse is undeniable but every first step meets resistance.",confusion:"Cannot distinguish genuine calling from desire to escape what is uncomfortable.",fragmentation:"Starting things in one domain to avoid what asks for attention in another."},alignment:{coherence:"The impulse and the action are the same thing.",wisdom:"Knows the difference between an impulse worth following and restlessness in search of an exit.",clarity:"Sees what is actually new versus familiar discomfort dressed as beginning.",purpose:"The beginning serves something real — not novelty or escape.",transformation:"Has moved from thinking about starting to having started."}},
  taurus:{misalignment:{chaos:"Daily practice exists in theory, not in the calendar.",suffering:"Showing up every day and feeling nothing — connection to purpose lost.",confusion:"Cannot tell faithful patience from unconscious inertia.",fragmentation:"Consistent in some domains, absent in others."},alignment:{coherence:"The practice and the life are the same rhythm.",wisdom:"Understands the work produces differently over months than over days.",clarity:"Knows exactly what the daily practice is and has done it today.",purpose:"The daily work is connected to something being built over a longer arc.",transformation:"The capacity is in the body now."}},
  scorpio:{misalignment:{chaos:"Multiple new projects launched as the old thing is dying.",suffering:"Prolonged anguish not moving toward completion.",confusion:"Cannot tell whether what must end is the form or the essence.",fragmentation:"Describing transformation while the thing continues unchanged."},alignment:{coherence:"The thing that must end is being ended. Quietly, deliberately.",wisdom:"Knows the difference between a necessary ending and a premature one.",clarity:"Sees what specifically must die.",purpose:"The ending serves what cannot yet be named but is already pressing.",transformation:"Has come out the other side different."}},
  aquarius:{misalignment:{chaos:"Everything broken but the constraining pattern carried into the next version.",suffering:"Liberation was real but the new form is already becoming a new constraint.",confusion:"Cannot name what specifically was the constraint.",fragmentation:"Breaking free in one domain while tightening constraint in another."},alignment:{coherence:"The specific constraint has been named and specifically exited.",wisdom:"Knows the difference between genuine liberation and rebellion that relocates the cage.",clarity:"Sees the specific form that became the specific cage.",purpose:"The liberation is toward something, not only away from something.",transformation:"Is living differently now."}},
  fire:{misalignment:{chaos:"Visible, expressive, reaching — but not toward anything real.",suffering:"The expression is happening but not the real expression.",confusion:"Cannot distinguish genuine vision from attractive narrative.",fragmentation:"Fully expressed in one domain, completely invisible in another."},alignment:{coherence:"What is expressed corresponds to what is true.",wisdom:"Knows when to step forward and when to wait.",clarity:"Sees where the vision is genuine and where it is attractive story.",purpose:"Expression and vision in service of something larger.",transformation:"Has become someone who inhabits their visibility naturally."}},
  earth:{misalignment:{chaos:"Sees everything that needs refining and is fixing none of it.",suffering:"Building faithfully toward something that no longer corresponds to genuine commitment.",confusion:"Cannot tell patient building from unconscious delay.",fragmentation:"Capricorn vision in career, Taurus nowhere."},alignment:{coherence:"The clear sight and the refinement action are the same movement.",wisdom:"Knows that earth builds differently at different timescales.",clarity:"Sees what specifically needs refining and what specifically needs building.",purpose:"Refinement and structure in service of something that will outlast individual effort.",transformation:"The thing has been built. Something real and solid exists."}},
  air:{misalignment:{chaos:"Ideas multiplying without connecting.",suffering:"In relationship but not present. Performance of attunement without genuine attention.",confusion:"Cannot distinguish genuine curiosity from using learning to avoid action.",fragmentation:"Intellectually alive, relationally absent."},alignment:{coherence:"The curiosity and the connection are both real.",wisdom:"Knows when enough has been learned and action is being delayed.",clarity:"Can articulate what has been learned and what is happening in a relationship.",purpose:"Thinking and relating both in service of something real.",transformation:"Has become someone who learns and connects naturally."}},
  water:{misalignment:{chaos:"Releasing before completing. Forgiving before the wound has been felt.",suffering:"Emotional truth accessed but not allowed to do its work.",confusion:"Cannot tell whether what is being released is genuinely complete.",fragmentation:"Emotional depth in one domain, complete disconnection in another."},alignment:{coherence:"The feeling and the action it informs are the same movement.",wisdom:"Knows the difference between genuine completion and premature release.",clarity:"Can name what is being felt and what is ready to be released.",purpose:"Feeling and release in service of something larger.",transformation:"Has been changed by what was felt and released."}},
  spring:{misalignment:{chaos:"Multiple Aries sparks, no Taurus ground.",suffering:"Taurus ground without Aries spark — showing up faithfully for something the impulse abandoned.",confusion:"Cannot tell whether Gemini understanding is genuine or premature.",fragmentation:"In Aries in career, Gemini in relationship, Taurus nowhere."},alignment:{coherence:"The spark ignited, daily work grounded it, genuine understanding is opening.",wisdom:"Can tell which of the three movements is active and what it asks.",clarity:"Sees the arc as a whole.",purpose:"The spring arc is building something real.",transformation:"Has moved through the full spring arc. Is different for having done it."}},
  summer:{misalignment:{chaos:"Leo expression without Cancer ground.",suffering:"Cancer depth without Leo expression. Everything felt; nothing shown.",confusion:"Virgo refinement preventing Leo expression.",fragmentation:"Expressing in public, not feeling in private."},alignment:{coherence:"What is felt becomes what is expressed, what is expressed is refined.",wisdom:"Knows when feeling has been accessed deeply enough to express.",clarity:"Can see the gap between what the summer expression is and what it could be.",purpose:"Expression and refinement in service of something real being brought into visible form.",transformation:"Something that began as interior truth now exists in the world."}},
  autumn:{misalignment:{chaos:"Libra encounter managed to prevent Scorpio death.",suffering:"Scorpio death without Sagittarian vision. The ending real; nothing yet appeared.",confusion:"Sagittarian vision arriving before Scorpio death has actually happened.",fragmentation:"Relating genuinely in one domain, avoiding encounter in another."},alignment:{coherence:"The encounter was real, the death it made necessary occurred, and vision is forming.",wisdom:"Can hold all three — present in relating, willing to meet the death, patient with vision.",clarity:"Sees what specifically needed to end and why.",purpose:"The autumn arc produces the only wisdom that cannot be acquired any other way.",transformation:"Has arrived at a vision that could only have been reached through the loss."}},
  winter:{misalignment:{chaos:"Aquarius breaking before Capricorn building.",suffering:"Capricorn building toward something the person no longer genuinely wants.",confusion:"Pisces release before Capricorn completion.",fragmentation:"Building in one domain, liberating in another, dissolving in a third."},alignment:{coherence:"Something was built faithfully, broken free of, dissolved with grace.",wisdom:"Knows when building is genuinely done.",clarity:"Sees what was built, what needed breaking free of, what is ready to dissolve.",purpose:"The winter arc serves the spring that follows it.",transformation:"Standing at the beginning of a new spring with different capacity."}},
  initiation:{misalignment:{chaos:"Multiple Initiations simultaneously — cannot distinguish genuine signals from noise.",suffering:"A real Initiation signal present and being suppressed.",confusion:"Cannot tell which signal is the pattern genuinely beginning.",fragmentation:"Forcing action in some domains; dismissing signals in others."},alignment:{coherence:"The first whisper heard, acknowledged, and being attended to.",wisdom:"Can distinguish a genuine Initiation signal from restlessness.",clarity:"Knows what the signal is pointing toward.",purpose:"The attention given to the signal is the first act of cooperation.",transformation:"Has developed the sensitivity to catch patterns at Initiation."}},
  expansion:{misalignment:{chaos:"Momentum used to start everything simultaneously.",suffering:"Momentum suppressed. Energy building without outlet.",confusion:"Cannot tell whether to lean into the momentum or resist it.",fragmentation:"Participating with Expansion in one domain while suppressing it in another."},alignment:{coherence:"The momentum and the action are the same thing.",wisdom:"Knows the natural pace of this Expansion and moves with it.",clarity:"Sees exactly what the Expansion is pressing toward.",purpose:"The Expansion used in service of what the pattern is actually building.",transformation:"Has moved from noticing the energy to completing the work."}},
  contraction:{misalignment:{chaos:"Multiple exit strategies. New projects arrived at the most demanding point.",suffering:"Genuine Contraction being met with presence — productive, not avoidance.",confusion:"Cannot tell genuine completion from Contraction avoidance.",fragmentation:"Present in manageable domains. Absent in domains too costly to meet."},alignment:{coherence:"The difficulty and the presence are the same thing.",wisdom:"Has met enough Contractions to know staying present produces what escape never produces.",clarity:"Sees exactly what is being asked.",purpose:"The Contraction is producing what Expansion could not.",transformation:"Has stayed. Something has changed that could not have changed any other way."}},
  integration:{misalignment:{chaos:"Integration period filled with new Initiations before the cycle has settled.",suffering:"Refusing to acknowledge what Integration produced.",confusion:"Cannot tell whether Integration's quietness is completion or stagnation.",fragmentation:"Integration in one domain, active Contraction in another."},alignment:{coherence:"The new capacity and the person are the same thing now.",wisdom:"Can name specifically what changed and how.",clarity:"Sees the new Initiation beginning to appear without rushing toward it.",purpose:"The Integration has produced a new floor.",transformation:"Is genuinely different from the person who entered this cycle."}},
};

const FC={
  "All 12 Phases":[
    {id:"f01",front:"Raw impulse. Something new calling. Spark. Urgency. Moving toward unknown.",back:{primary:"ARIES — Ignition",secondary:"Fire · Pattern Name: Ignition Moment",extra:"Distinction: moves TOWARD something (vs Aquarius which moves AWAY FROM constraint)"}},
    {id:"f02",front:"Stepping forward to be seen. Expression. Visibility. Being present as yourself now.",back:{primary:"LEO — Expression",secondary:"Fire · Pattern Name: Stepping Into Light",extra:"Distinction: present-tense visibility (vs Sagittarius which reaches toward future horizon)"}},
    {id:"f03",front:"Reaching toward a horizon you can't fully see yet. Meaning. Vision. The larger purpose.",back:{primary:"SAGITTARIUS — Expansion",secondary:"Fire · Pattern Name: Horizon Calling",extra:"Distinction: future-reaching vision (vs Leo which is present-tense expression)"}},
    {id:"f04",front:"Showing up daily. Making the spark real. Patient building. Faithful repetition.",back:{primary:"TAURUS — Foundation",secondary:"Earth · Pattern Name: Foundation Years",extra:"Distinction: daily timescale (vs Capricorn which builds for decades)"}},
    {id:"f05",front:"Seeing precisely what needs improving. The gap between what is and what could be.",back:{primary:"VIRGO — Clarity",secondary:"Earth · Pattern Name: The Work of Clarity",extra:"Distinction: refines what exists (vs Gemini which opens into new territory)"}},
    {id:"f06",front:"Building for decades. Legacy. Structure that will outlast you. Long-game patience.",back:{primary:"CAPRICORN — Structure",secondary:"Earth · Pattern Name: The Long Work",extra:"Distinction: multi-decade timescale (vs Taurus which builds day by day)"}},
    {id:"f07",front:"Curiosity alive. Questions multiplying. Following interest wherever it leads.",back:{primary:"GEMINI — Intelligence",secondary:"Air · Pattern Name: Information Awakening",extra:"Distinction: opens into new territory (vs Virgo which refines what already exists)"}},
    {id:"f08",front:"Genuine encounter with another. Real balance. Authentic presence in relationship.",back:{primary:"LIBRA — Relation",secondary:"Air · Pattern Name: The Real Conversation",extra:"Distinction: relational (vs Cancer which is interior emotional depth)"}},
    {id:"f09",front:"Breaking free from constraint. Can't keep doing this. The cage has become intolerable.",back:{primary:"AQUARIUS — Liberation",secondary:"Air · Pattern Name: Liberation Calling",extra:"Distinction: moves AWAY FROM constraint (vs Aries which moves TOWARD something new)"}},
    {id:"f10",front:"Going inward. Feeling what is emotionally true. What nourishes. What depletes.",back:{primary:"CANCER — Inner Root",secondary:"Water · Pattern Name: Emotional Root",extra:"Distinction: emotional depth (vs Scorpio which requires metamorphic ending)"}},
    {id:"f11",front:"Something cannot continue. Necessary ending. Complete metamorphosis. The form must die.",back:{primary:"SCORPIO — Transformation",secondary:"Water · Pattern Name: The Necessary End",extra:"Distinction: necessary death (vs Pisces which is graceful completion)"}},
    {id:"f12",front:"What has run its course. Releasing what is complete. Forgiveness. Graceful return.",back:{primary:"PISCES — Dissolution",secondary:"Water · Pattern Name: The Graceful Release",extra:"Distinction: graceful completion (vs Scorpio which is metamorphic death)"}},
  ],
  "The Four Elements":[
    {id:"e01",front:"FIRE: Three phases, shared quality, how it feels in the body.",back:{primary:"Aries · Leo · Sagittarius",secondary:"Shared: expression, impulse, vision, aliveness, upward movement",extra:"In body: warmth, urgency, brightness. Something vital is moving."}},
    {id:"e02",front:"EARTH: Three phases, shared quality, how it feels in the body.",back:{primary:"Taurus · Virgo · Capricorn",secondary:"Shared: patience, precision, building, material reality",extra:"In body: weight, solidity, groundedness. Real work with real hands."}},
    {id:"e03",front:"AIR: Three phases, shared quality, how it feels in the body.",back:{primary:"Gemini · Libra · Aquarius",secondary:"Shared: thought, connection, communication, movement",extra:"In body: lightness, mental aliveness, electricity. Something wants to move freely."}},
    {id:"e04",front:"WATER: Three phases, shared quality, how it feels in the body.",back:{primary:"Cancer · Scorpio · Pisces",secondary:"Shared: feeling, depth, transformation, release",extra:"In body: fluidity, depth, softness. The interior is active."}},
  ],
  "Micro-States":[
    {id:"m01",front:"INITIATION: signal, what it asks, what blocks it.",back:{primary:"First whisper. Pattern beginning to stir.",secondary:"Asks: notice, acknowledge, hold lightly without forcing.",extra:"Blocked by: dismissing it or forcing it to full form before it is ready."}},
    {id:"m02",front:"EXPANSION: signal, what it asks, what blocks it.",back:{primary:"Momentum building. Pattern pressing forward.",secondary:"Asks: move with the energy for the work it is pressing toward.",extra:"Blocked by: forcing the pace (burnout) or suppressing it (missed window)."}},
    {id:"m03",front:"CONTRACTION: signal, what it asks, what blocks it.",back:{primary:"Reality pushing back. Momentum has met resistance.",secondary:"Asks: stay present. Meet the difficulty. The only way is through.",extra:"Blocked by: exiting the pattern, numbing through it, or escaping into new Expansion."}},
    {id:"m04",front:"INTEGRATION: signal, what it asks, what blocks it.",back:{primary:"Quietness. What was difficult is now familiar.",secondary:"Asks: honour what the arc produced before moving on.",extra:"Blocked by: rushing to the next Initiation before the learning has settled."}},
  ],
  "The Seasons":[
    {id:"s01",front:"SPRING: Three phases, essential arc, what it produces.",back:{primary:"Aries → Taurus → Gemini",secondary:"Arc: Ignite → Ground → Understand",extra:"Produces: understanding earned through your own direct practice."}},
    {id:"s02",front:"SUMMER: Three phases, essential arc, what it produces.",back:{primary:"Cancer → Leo → Virgo",secondary:"Arc: Feel → Express → Refine",extra:"Produces: expression that is emotionally true and technically precise."}},
    {id:"s03",front:"AUTUMN: Three phases, essential arc, what it produces.",back:{primary:"Libra → Scorpio → Sagittarius",secondary:"Arc: Relate → Transform → Vision",extra:"Produces: wisdom that can only come through genuine loss."}},
    {id:"s04",front:"WINTER: Three phases, essential arc, what it produces.",back:{primary:"Capricorn → Aquarius → Pisces",secondary:"Arc: Build → Break Open → Dissolve",extra:"Produces: cleared ground from which the next spring can genuinely begin."}},
  ],
};

const SCNS=[
  {title:"The Job That No Longer Fits",diff:"Easy",scenario:"Eight years in this role. I'm good at it. But I feel trapped. This version of work no longer fits who I am. I can't shake the need to break free — not toward something specific, just away from this.",answer:{phase:"Aquarius",teaching:"The push away from what no longer fits is its own valid signal. Something has become a cage.",mis:"Staying indefinitely out of fear. Or quitting impulsively without naming the specific constraint."}},
  {title:"The Creative Project Finally Calling",diff:"Easy",scenario:"I've been thinking about this project for eight months. Yesterday something clicked and I can't NOT do it now. I don't know if it will work. I don't have a plan. I just need to start.",answer:{phase:"Aries",teaching:"Creative impulse at peak. The time to begin is now, not when conditions are perfect.",mis:"Waiting for the plan before starting. Or using the impulse to escape something that still needs facing."}},
  {title:"The Business That Isn't Scaling",diff:"Easy",scenario:"Five years of building this company. Small, stable, genuinely good. Loyal clients. We show up every day. I love it. Two investors have approached me about scaling. Something in me deeply doesn't want to.",answer:{phase:"Taurus",teaching:"Sacred daily work. Patient building. This is what Taurus produces when honoured.",mis:"Scaling out of obligation or fear. Abandoning the daily work for promises of rapid growth."}},
  {title:"The Gift That Wants to Be Seen",diff:"Medium",scenario:"I have something valuable to offer — I know this, genuinely. But when I imagine being visible, self-doubt floods in. I keep the work private. Meanwhile I watch others share work less developed than mine.",answer:{phase:"Leo",teaching:"The real work is stepping into visibility with something genuine. The self-doubt is Leo in Contraction.",mis:"Staying invisible to be safe. Performing for approval rather than expressing what is true."}},
  {title:"Five Courses and No Apology",diff:"Easy",scenario:"I'm enrolled in five different online courses. History, AI, ceramics, Portuguese, philosophy. Everyone tells me I'm scattered. I feel more alive doing this than anything else in years.",answer:{phase:"Gemini",teaching:"The mind alive with genuine curiosity. The scattered quality is Gemini doing what Gemini does.",mis:"Forcing a single track before the learning has found its centre."}},
  {title:"New Relationship, Old Patterns",diff:"Medium",scenario:"I'm in a new relationship — genuinely good. But closeness is triggering old family stuff. Patterns from childhood surfacing. I want to run. The fear isn't about this person. It's about what intimacy always does to me.",answer:{phase:"Cancer",teaching:"Emotional truth. Family patterns surfacing for examination. The relationship is the mirror.",mis:"Running from the relationship. Blaming the partner for what is ancestral."}},
  {title:"The Ten-Year Partnership Ending",diff:"Hard",scenario:"Business partnership ending. I can see it clearly. Part of me still grieves it. Part of me can feel something new on the other side. How do I hold all of this?",answer:{phase:"Scorpio / Autumn Sequence",teaching:"Libra: the relationship seen fully. Scorpio: the ending real. Sagittarius: vision forming on the other side.",mis:"Trying to save the partnership to avoid Scorpio. Or rushing to vision to avoid grieving."}},
  {title:"Building for Twenty Years",diff:"Medium",scenario:"The nonprofit I'm building will take 20 years. Everyone wants results in 12 months. I'm exhausted by the gap between what I know is necessary and what everyone demands.",answer:{phase:"Capricorn",teaching:"Building for decades. The frustration is Capricorn meeting a culture that cannot hold its timescale.",mis:"Abandoning the long game under external pressure. Or building toward something you no longer believe in."}},
];

const DIST=[
  {pair:"Aries vs Aquarius",A:{name:"Aries",icon:"↗",c:"#FF6B6B"},B:{name:"Aquarius",icon:"⚡",c:"#38BDF8"},sep:"Aries moves TOWARD something unknown. Aquarius moves AWAY FROM something constraining. Both feel restless — the direction is everything.",sigA:["magnetised toward a new thing","can't not begin","pulled forward","urgency to start"],sigB:["can't keep doing this","old form no longer fits","repelled by constraint","need to break free"],drills:[
    {sit:"A doctor feels a persistent pull toward painting. She finds herself in art supply shops, watching tutorials at midnight. She doesn't know where this leads. She just knows she has to start.",ans:"A",sig:"She is magnetised TOWARD something specific and new. Pure forward pull. That is Aries.",why:"Aquarius would show suffocation under the current form. There is no repulsion from medicine here."},
    {sit:"A senior partner has billed 2,800 hours a year for eleven years. The requirements of partnership feel physically unbearable. He doesn't know what he wants. He only knows he can't keep doing this.",ans:"B",sig:"He is REPELLED by the current form. No specific new destination. Entirely away from, not toward. That is Aquarius.",why:"Aries would show a specific new thing pulling him. He has none."},
  ]},
  {pair:"Taurus vs Capricorn",A:{name:"Taurus",icon:"▣",c:"#6BCB77"},B:{name:"Capricorn",icon:"△",c:"#94A3B8"},sep:"Both are earth. Both build. Taurus builds the immediate foundation — daily showing up. Capricorn builds for decades — legacy, mastery, multi-generational structure. The timescale is the diagnostic.",sigA:["showing up daily","making the practice real","weeks and months","the work in front of me now"],sigB:["decades of commitment","what will outlast me","mastery over a lifetime","building what others will inherit"],drills:[
    {sit:"A musician has committed to practicing scales for one hour every morning for four months. She doesn't care about performing yet. She cares about what her hands can do.",ans:"A",sig:"Daily repetition over months, building immediate solidity. That is Taurus.",why:"Capricorn would show multi-decade orientation — a lifetime career, legacy she wants to leave."},
    {sit:"A 38-year-old is building a legal practice focused on indigenous land rights. She thinks about the precedents she will set over thirty years, the lawyers she will train, the cases her work will make possible after she is gone.",ans:"B",sig:"Thirty-year timescale, precedents, legacy beyond her career. Structure designed to outlast the builder. That is Capricorn.",why:"Taurus would show in today's practice. The primary pattern here is the long-game vision."},
  ]},
  {pair:"Scorpio vs Pisces",A:{name:"Scorpio",icon:"◈",c:"#C084FC"},B:{name:"Pisces",icon:"∞",c:"#A78BFA"},sep:"Both are water endings. Scorpio is metamorphic death — something must be destroyed for new life. Pisces is dissolution — what has completed is gently released, forgiven, surrendered.",sigA:["cannot continue — must die","intensity and necessity","metamorphic transformation","something trapped must be freed"],sigB:["completion not destruction","forgiveness","gentle release","what has run its course"],drills:[
    {sit:"After twelve years, a woman closes her gallery. She is not bitter. She spent the last year consciously wrapping things up — final shows, expressing gratitude. She feels complete. It is time.",ans:"B",sig:"Conscious, graceful completion — something that has run its full course released with gratitude. That is Pisces.",why:"Scorpio would show if the gallery had become a prison — if continuing was destroying her."},
    {sit:"A man has been in a marriage for fourteen years. The last four have accumulated certainty: this marriage is killing something in him. Not through betrayal — but through incompatibility that has become undeniable.",ans:"A",sig:"The marriage must die — ended because continuing causes metamorphic damage. Intensity and necessity. That is Scorpio.",why:"Pisces would show if the marriage had simply run its natural course with gratitude and completion."},
  ]},
  {pair:"Cancer vs Scorpio",A:{name:"Cancer",icon:"🌊",c:"#60A5FA"},B:{name:"Scorpio",icon:"◈",c:"#C084FC"},sep:"Both are water and intense. Cancer accesses what is emotionally true — feeling, family, what nourishes. Scorpio requires what cannot continue to die completely.",sigA:["emotions surfacing","family patterns alive","going inward","tenderness grief love"],sigB:["something cannot continue","complete ending required","intensity beyond emotion","what must die"],drills:[
    {sit:"A woman visits her parents for the holidays and finds herself crying in the car on the way home — not from a specific incident but from a weight she can't name. Old dynamics, old roles, old feelings.",ans:"A",sig:"Emotional truth surfacing from family origin. Nothing is dying. Everything is being felt. That is Cancer.",why:"Scorpio would require a death — the family role becoming untenable, the relationship needing to end."},
    {sit:"A man has been in a business partnership for eight years. Last month he realised with clarity: this partnership cannot continue. Not because of anger. Because it is done.",ans:"B",sig:"Something that cannot continue must end completely. The clarity is metamorphic, not emotional. That is Scorpio.",why:"Cancer would show grief and tenderness. Here the primary signal is the recognition that this form must die."},
  ]},
  {pair:"Leo vs Sagittarius",A:{name:"Leo",icon:"☀",c:"#FBBF24"},B:{name:"Sagittarius",icon:"→",c:"#FB923C"},sep:"Both are fire. Leo wants to be seen — expression, visibility, being fully present now. Sagittarius wants to reach — vision, meaning, the horizon not yet touched.",sigA:["wanting to be seen","expressing fully","visibility now","being present as myself"],sigB:["reaching toward a horizon","meaning and vision","what this is all for","the larger purpose"],drills:[
    {sit:"A researcher has spent three years doing significant work that no one outside her lab knows about. She has been offered a keynote at a major conference. She is terrified and knows she must say yes.",ans:"A",sig:"Stepping into visibility with what is genuinely hers. About presence now, not horizon. That is Leo.",why:"Sagittarius would show future-oriented vision. The primary pattern pressing is present-tense visibility."},
    {sit:"A therapist in his late forties feels individual practice is not enough. He keeps returning to: what is therapy actually for? He is drawn to ideas about healing at a cultural scale.",ans:"B",sig:"The primary movement is toward meaning, vision, and the larger purpose. Reaching toward a horizon. That is Sagittarius.",why:"Leo would show in the desire to be seen as an individual practitioner. The primary signal here is meaning."},
  ]},
  {pair:"Gemini vs Virgo",A:{name:"Gemini",icon:"◇",c:"#FFD93D"},B:{name:"Virgo",icon:"⊕",c:"#A3E635"},sep:"Both engage the mind precisely. Gemini opens into learning and curiosity — gathering, questioning. Virgo applies clear sight to refine what exists — seeing the gap and closing it.",sigA:["curiosity alive","questions multiplying","learning for its own sake","the mind opening"],sigB:["what needs refining here","the gap between what is and what could be","seeing clearly and fixing","precision improvement"],drills:[
    {sit:"A journalist has started reading across fields she knows nothing about — marine biology, behavioral economics, medieval history. No article assigned. She just finds herself following one interesting thing to another.",ans:"A",sig:"The mind opening into genuine curiosity — following interest without destination. That is Gemini.",why:"Virgo would show as a specific gap she is trying to close. Here there is no gap. Only curiosity."},
    {sit:"A product manager is reviewing his team's workflow. He can see exactly where the inefficiencies are — three specific handoff points that create delay. He can see what the corrected workflow would look like.",ans:"B",sig:"He sees the gap between what is and what could be — specific, with the correction visible. That is Virgo.",why:"Gemini would show as curiosity about how workflows function. Here there are no questions — only clear sight of a specific problem."},
  ]},
];

const ESE=[
  {phase:"Aries",icon:"↗",color:"#FF6B6B",teaching:"The creative impulse before it has form. Beginning before you are ready.",pn:"Ignition Moment",stories:[
    {id:"a1",title:"The Manuscript",arc:"Initiation → Integration",text:"She had been thinking about the novel for five years. Not planning it — thinking about it the way you think about something you're not ready to touch. Then one Tuesday in October she called in sick, sat at the kitchen table with coffee she didn't drink, and wrote three thousand words before noon.\n\nShe told no one. She didn't know if it was good. She went back the next morning before work, and the morning after that. Six weeks of mornings.\n\nAt week four the momentum cracked. She read back what she'd written and it felt thin, embarrassing. She didn't go to the table the next morning. On the third morning she went anyway, not because she was confident, because she couldn't stand the absence of it.\n\nBy week eight she had a hundred and twenty pages. She wasn't sure it was a book. She was sure that making it had changed something in her she couldn't name and didn't need to.",reflection:"Where in your own life has something started before you were ready? What did starting without permission feel like?"},
  ]},
  {phase:"Taurus",icon:"▣",color:"#6BCB77",teaching:"Patient building through repetition. The ordinary work done faithfully.",pn:"Foundation Years",stories:[
    {id:"t1",title:"Saturday Bread",arc:"Initiation → Integration",text:"She makes bread every Saturday morning. Has for three years. Not for a bakery, not to post anywhere. She makes it because she decided to learn bread and learning bread, she discovered, requires Saturdays.\n\nThe first year the loaves were dense and wrong. She adjusted ratios, read obsessively. Some Saturdays she threw out what she'd made. She went back the following Saturday anyway.\n\nThird year she can feel when the dough is right before she's done anything with it. The information is in her palms now.\n\nPeople ask how she got so good at bread. The true answer is: I showed up for it every week for three years. That answer disappoints people looking for a technique. The technique is the showing up.",reflection:"What in your life have you been showing up for repeatedly? What has that repetition built in you?"},
  ]},
  {phase:"Scorpio",icon:"◈",color:"#C084FC",teaching:"What cannot continue must die completely. The ending that makes new life possible.",pn:"The Necessary End",stories:[
    {id:"sc1",title:"The Cleared Ground",arc:"Expansion → Integration",text:"The marriage ended the way most things end — not in a single moment but through accumulation. The last year was both of them knowing and neither of them saying.\n\nWhen she finally said it aloud, the relief was the first thing she felt. She had expected devastation. The devastation came later. The relief came first.\n\nThe year that followed was the hardest of her life. She cried at unpredictable times. She was unproductive. She cancelled plans.\n\nUnderneath all of it was a strange cleanness. Something that had been dying for three years had been allowed to die.\n\nNew things only grow in cleared ground. She was learning to trust the clearing.",reflection:"What have you been allowing to die slowly rather than ending consciously? What would it mean to let it complete?"},
  ]},
  {phase:"Aquarius",icon:"⚡",color:"#38BDF8",teaching:"Breaking free from what constrains. Sovereignty over the self.",pn:"Liberation Calling",stories:[
    {id:"aq1",title:"The Door Was Always Unlocked",arc:"Expansion → Integration",text:"She did not quit her consulting firm because she had a better offer. She quit because she could no longer make herself sit in the meetings.\n\nNot because they were bad meetings. Because she was no longer the person who could sit in them without disappearing.\n\nShe resigned on a Friday. She did not have a plan that satisfied anyone. She had the certain knowledge that staying had become impossible.\n\nThe form had become a cage. She had been slow to name it because the cage was comfortable and well-compensated. All of that was true. The cage was still a cage.\n\nThe door had always been unlocked. She had been standing at it for eight months before she walked through.",reflection:"Where have you been mistaking a comfortable constraint for a choice?"},
  ]},
  {phase:"Integration",icon:"✨",color:"#FBBF24",teaching:"Holding multiple phases simultaneously — the mark of pattern literacy.",pn:"The Full View",stories:[
    {id:"int1",title:"The Map",arc:"Integration",text:"After six months of working with the framework, she could see her life clearly for the first time.\n\nCareer: Aries Initiation. A new project was sparking. She was honoring the impulse.\n\nRelationship: Taurus. Steady, faithful daily presence with her partner. Nothing dramatic. Everything solid.\n\nHealth: Scorpio Contraction. Something in how she was treating her body had to end. She knew it. She hadn't acted yet. But she knew.\n\nIdentity: Aquarius. A version of herself that she had been performing was no longer fitting.\n\nSeeing all four at once did not overwhelm her. It clarified. Instead of 'why is everything so complicated,' the response was: 'these four things are happening, and each one is asking for something specific.'\n\nThis was not a problem to solve. This was a life to inhabit.",reflection:"Draw your own map. What is active in each domain right now? What is each one asking?"},
  ]},
];

const RK="tfi-pattern-mastery";
const loadR=()=>{try{const r=localStorage.getItem(RK);return r?JSON.parse(r):{}}catch{return{}}};
const Bar=({title,onBack,onHome})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:12,marginBottom:32,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
    <button onClick={onBack} style={{color:"#67e8f9",fontWeight:700,fontSize:13,background:"none",border:"none",cursor:"pointer"}}>← Back</button>
    <span style={{fontSize:12,color:"#6b7280"}}>{title}</span>
    <button onClick={onHome} style={{color:"#67e8f9",fontWeight:700,fontSize:13,background:"none",border:"none",cursor:"pointer"}}>🏠</button>
  </div>
);
const PBar=({cur,tot,colors=["#06b6d4","#3b82f6"]})=>(
  <div style={{marginBottom:24}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280",marginBottom:6}}><span>{cur} of {tot}</span><span>{Math.round(cur/tot*100)}%</span></div>
    <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${cur/tot*100}%`,background:`linear-gradient(to right,${colors[0]},${colors[1]})`,transition:"width .4s"}}/></div>
  </div>
);

export default function PatternMastery(){
  const [tier,setTier]=useState(1);
  const [week,setWeek]=useState(1);
  const [view,setView]=useState("overview");
  const [expandedDay,setExpandedDay]=useState(null);
  const [fcDeck,setFcDeck]=useState(0);
  const [fcCard,setFcCard]=useState(0);
  const [fcFlipped,setFcFlipped]=useState(false);
  const [scIdx,setScIdx]=useState(0);
  const [scAns,setScAns]=useState("");
  const [scRev,setScRev]=useState(false);
  const [dtPair,setDtPair]=useState(0);
  const [dtDrill,setDtDrill]=useState(0);
  const [dtChoice,setDtChoice]=useState(null);
  const [dtRev,setDtRev]=useState(false);
  const [eP,setEP]=useState(0);
  const [eS,setES]=useState(0);
  const [eTch,setETch]=useState(false);
  const [rhythm,setRhythm]=useState(loadR);

  const wdata=ALL_WEEKS[`tier_${tier}`]?.[`week_${week}`]||{};
  const ldata=wdata.phase?(LESSONS[wdata.phase]||null):null;
  const days=wdata.phase?makeDays(wdata):[];
  const tmeta=TIER_META[tier];
  const decks=Object.keys(FC);
  const cards=FC[decks[fcDeck]]||[];
  const card=cards[fcCard];
  const dp=DIST[dtPair];
  const dd=dp?.drills[dtDrill];
  const ep=ESE[eP];
  const es=ep?.stories[eS];
  const BG="linear-gradient(135deg,#0f172a,#1e293b)";

  useEffect(()=>{try{localStorage.setItem(RK,JSON.stringify(rhythm));}catch{}},[rhythm]);

  const go=(v,opts={})=>{
    setView(v);
    if(opts.tier!==undefined){setTier(opts.tier);setWeek(1);}
    if(opts.week!==undefined)setWeek(opts.week);
    if(opts.tier!==undefined||opts.week!==undefined)setExpandedDay(null);
    if(v==="flashcards"){setFcDeck(0);setFcCard(0);setFcFlipped(false);}
    if(v==="scenarios"){setScIdx(0);setScAns("");setScRev(false);}
    if(v==="distinctions"){setDtPair(0);setDtDrill(0);setDtChoice(null);setDtRev(false);}
    if(v==="ese"){setEP(0);setES(0);setETch(false);}
  };
  const markDone=(t,w,d)=>{
    const k=`T${t}W${w}D${d}`;const today=new Date().toISOString().slice(0,10);
    setRhythm(p=>{const s=p.streak||{lastDate:null,count:0};const yest=new Date(Date.now()-86400000).toISOString().slice(0,10);const nc=s.lastDate===today?s.count:s.lastDate===yest?s.count+1:1;return{...p,completed:{...p.completed,[k]:{at:new Date().toISOString()}},streak:{lastDate:today,count:nc}};});
  };
  const isDone=(t,w,d)=>!!rhythm.completed?.[`T${t}W${w}D${d}`];

  const renderOverview=()=>(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",color:"#fff",padding:"40px 24px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:40,flexWrap:"wrap",gap:16}}>
          <div><h1 style={{fontSize:34,fontWeight:800,margin:0}}>Pattern Mastery</h1><p style={{color:"#6b7280",margin:"4px 0 0",fontSize:13}}>Twelvefold Institute · Pattern Mastery</p></div>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3].map(t=>(<button key={t} onClick={()=>go("overview",{tier:t})} style={{padding:"8px 18px",borderRadius:10,fontWeight:700,fontSize:12,border:"none",cursor:"pointer",background:tier===t?"linear-gradient(to right,#0891b2,#2563eb)":"rgba(255,255,255,0.06)",color:tier===t?"#fff":"#9ca3af"}}>T{t} — {TIER_META[t].name}</button>))}
          </div>
        </div>
        <div style={{borderRadius:20,padding:"28px 32px",marginBottom:28,background:"linear-gradient(135deg,rgba(6,182,212,0.1),rgba(59,130,246,0.1))",border:"1px solid rgba(255,255,255,0.08)"}}>
          <p style={{fontSize:11,fontWeight:700,color:"#67e8f9",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Tier {tier} — {tmeta.name}</p>
          <p style={{color:"#d1d5db",margin:"0 0 6px",fontSize:14,lineHeight:1.7}}>{tmeta.goal}</p>
          <p style={{color:"#6b7280",fontSize:12,margin:0}}>{tmeta.weeks} weeks</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
          {tmeta.blocks.map(bl=>(
            <div key={bl.name} style={{borderRadius:18,border:`1px solid ${bl.color}25`,background:`${bl.color}08`,padding:"18px 22px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <span style={{fontSize:18}}>{bl.icon}</span>
                <span style={{fontWeight:700,color:bl.color,fontSize:13,textTransform:"uppercase",letterSpacing:1.5}}>{bl.name}</span>
                <span style={{fontSize:11,color:"#6b7280"}}>Weeks {bl.weeks[0]}–{bl.weeks[bl.weeks.length-1]}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${bl.phases.length},1fr)`,gap:10}}>
                {bl.phases.map((ph,i)=>{
                  const wn=bl.weeks[i];const phData=PHASES[ph]||{};
                  const done=[1,2,3,4,5,6,7].filter(d=>isDone(tier,wn,d)).length;
                  return(
                    <button key={ph} onClick={()=>go("lesson",{week:wn})} style={{padding:"14px 10px",borderRadius:14,border:`2px solid ${week===wn&&view!=="overview"?bl.color:bl.color+"28"}`,background:week===wn&&view!=="overview"?`${bl.color}20`:"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left"}}>
                      <div style={{fontSize:20,marginBottom:5}}>{phData.icon||bl.icon}</div>
                      <p style={{margin:"0 0 2px",fontWeight:700,color:"#fff",fontSize:12}}>{ph}</p>
                      <p style={{margin:"0 0 5px",color:"#9ca3af",fontSize:10}}>{phData.el||""}</p>
                      {done>0&&<div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${done/7*100}%`,background:bl.color}}/></div>}
                      <p style={{margin:"4px 0 0",fontSize:9,color:"#6b7280"}}>W{wn}{done>0?` · ${done}/7`:""}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{icon:"🎴",label:"Flashcards",sub:"All 12 phases + elements",fn:()=>go("flashcards")},{icon:"📊",label:"Scenarios",sub:`${SCNS.length} real-world situations`,fn:()=>go("scenarios")},{icon:"⚖️",label:"Distinctions",sub:`${DIST.length} pairs · drills`,fn:()=>go("distinctions")},{icon:"📖",label:"Ese Stories",sub:"Narrative teaching",fn:()=>go("ese")},{icon:"🌊",label:"Learning Rhythm",sub:"Your practice orbit",fn:()=>go("rhythm")},{icon:"📅",label:"Daily Exercises",sub:`Week ${week} exercises`,fn:()=>go("practice")}].map(({icon,label,sub,fn})=>(
            <button key={label} onClick={fn} style={{padding:"16px 12px",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:5}}>{icon}</div>
              <p style={{margin:"0 0 2px",fontWeight:700,color:"#fff",fontSize:11}}>{label}</p>
              <p style={{margin:0,color:"#6b7280",fontSize:9}}>{sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLesson=()=>{
    const pa=PA[wdata.pk];
    return(
      <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Bar title={`T${tier} · W${week} · ${wdata.phase||""}`} onBack={()=>go("overview")} onHome={()=>go("overview")}/>
          <div style={{display:"flex",gap:5,marginBottom:22,flexWrap:"wrap"}}>
            {Object.keys(ALL_WEEKS[`tier_${tier}`]).map((k,i)=>{
              const n=i+1;const bl=tmeta.blocks.find(b=>b.weeks.includes(n));
              return(<button key={k} onClick={()=>{setWeek(n);setExpandedDay(null);}} style={{padding:"7px 9px",borderRadius:9,border:`2px solid ${week===n?(bl?.color||"#67e8f9"):"rgba(255,255,255,0.08)"}`,background:week===n?`${bl?.color||"#67e8f9"}20`:"rgba(255,255,255,0.03)",cursor:"pointer",color:week===n?"#fff":"#9ca3af",fontWeight:700,fontSize:10,minWidth:38}}>W{n}</button>);
            })}
          </div>
          <div style={{borderRadius:20,overflow:"hidden",marginBottom:28,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{padding:"26px 32px",borderBottom:`2px solid ${wdata.color||"#67e8f9"}40`,background:`linear-gradient(135deg,${wdata.color||"#67e8f9"}20,${wdata.color||"#67e8f9"}08)`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
                <span style={{fontSize:30}}>{wdata.icon||"◎"}</span>
                <div>
                  <p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:wdata.color||"#67e8f9",textTransform:"uppercase",letterSpacing:2}}>Tier {tier} · Week {week}</p>
                  <h2 style={{margin:0,fontSize:28,fontWeight:800}}>{wdata.phase}</h2>
                  <p style={{margin:"3px 0 0",color:"#9ca3af",fontSize:12}}>{wdata.el||""}</p>
                </div>
              </div>
              <p style={{margin:0,color:"#d1d5db",lineHeight:1.7,fontSize:13}}>{wdata.teaching}</p>
            </div>
          </div>
          {!ldata&&<div style={{textAlign:"center",padding:"48px 0"}}><p style={{color:"#9ca3af",fontSize:14}}>Lesson content for this week is coming soon.</p></div>}
          {ldata&&(<>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
              {ldata.sections.map((sec,i)=>(
                <div key={i} style={{borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"}}>
                  <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:`${wdata.color||"#67e8f9"}10`}}><p style={{margin:0,fontWeight:700,color:"#fff",fontSize:13}}>{sec.h}</p></div>
                  <div style={{padding:"16px 20px"}}>{(sec.b||"").split("\\n\\n").map((para,j)=>(<p key={j} style={{margin:"0 0 12px",color:"#d1d5db",fontSize:13,lineHeight:1.85}}>{para}</p>))}</div>
                </div>
              ))}
            </div>
            {pa&&(
              <div style={{marginBottom:28}}>
                <div style={{borderRadius:"14px 14px 0 0",padding:"14px 20px",background:"linear-gradient(135deg,rgba(239,68,68,0.1),rgba(16,185,129,0.1))",border:"1px solid rgba(255,255,255,0.08)",borderBottom:"none"}}><p style={{margin:0,fontWeight:800,fontSize:13,color:"#fff"}}>States of Alignment & Misalignment</p></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"0 0 14px 14px",overflow:"hidden"}}>
                  {[{side:pa.misalignment,label:"Misalignment",col:"#EF4444",bg:"rgba(239,68,68,0.06)"},{side:pa.alignment,label:"Alignment",col:"#10b981",bg:"rgba(16,185,129,0.06)"}].map(({side,label,col,bg},si)=>(
                    <div key={si} style={{padding:"14px 16px",background:bg,borderRight:si===0?"1px solid rgba(255,255,255,0.06)":"none"}}>
                      <p style={{margin:"0 0 10px",fontSize:9,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:1.5}}>{label}</p>
                      {Object.entries(side).map(([k,v])=>(<div key={k} style={{marginBottom:8}}><p style={{margin:"0 0 2px",fontSize:9,fontWeight:700,color:col,textTransform:"capitalize"}}>{k}</p><p style={{margin:0,fontSize:10,color:"#9ca3af",lineHeight:1.6}}>{v}</p></div>))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{borderRadius:16,padding:24,textAlign:"center",border:`1px solid ${wdata.color||"#67e8f9"}40`,background:`${wdata.color||"#67e8f9"}10`}}>
              <p style={{color:"#9ca3af",fontSize:13,marginBottom:14}}>You have received the teaching for <strong style={{color:"#fff"}}>{wdata.phase}</strong>.</p>
              <button onClick={()=>go("practice")} style={{padding:"11px 32px",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${wdata.color||"#67e8f9"},${wdata.color||"#67e8f9"}88)`}}>Begin {wdata.phase} Exercises →</button>
            </div>
          </>)}
        </div>
      </div>
    );
  };

  const renderPractice=()=>(
    <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <Bar title={`T${tier} · W${week} · ${wdata.phase||""} — Exercises`} onBack={()=>go("overview")} onHome={()=>go("overview")}/>
        <button onClick={()=>go("lesson")} style={{fontSize:11,color:"#6b7280",background:"none",border:"none",cursor:"pointer",marginBottom:18}}>← Return to lesson</button>
        <div style={{borderRadius:16,overflow:"hidden",marginBottom:24,border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{padding:"18px 24px",borderBottom:`2px solid ${wdata.color||"#67e8f9"}50`,background:`linear-gradient(135deg,${wdata.color||"#67e8f9"}20,${wdata.color||"#67e8f9"}08)`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}><span style={{fontSize:22}}>{wdata.icon}</span><h2 style={{margin:0,fontSize:22,fontWeight:800}}>{wdata.phase}</h2></div>
            <p style={{margin:0,color:"#d1d5db",fontSize:12}}>{wdata.teaching}</p>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {days.map(day=>{
            const done=isDone(tier,week,day.day);const open=expandedDay===day.day;
            return(
              <div key={day.day} style={{borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",background:open?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)"}}>
                <button onClick={()=>setExpandedDay(open?null:day.day)} style={{width:"100%",padding:"13px 16px",display:"flex",alignItems:"center",gap:12,background:"none",border:"none",cursor:"pointer",color:"#fff",textAlign:"left"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`${wdata.color||"#67e8f9"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{done?"✓":day.day}</div>
                  <div style={{flex:1}}><p style={{margin:"0 0 1px",fontWeight:600,fontSize:12}}>{day.name}</p><p style={{margin:0,color:"#9ca3af",fontSize:10}}>{day.title}</p></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {done&&<span style={{fontSize:9,color:"#34d399",fontWeight:700}}>Done</span>}
                    <span style={{fontSize:10,color:"#6b7280",background:"rgba(255,255,255,0.06)",padding:"2px 7px",borderRadius:20}}>{day.time}m</span>
                    <span style={{color:"#6b7280",fontSize:11}}>{open?"▾":"▸"}</span>
                  </div>
                </button>
                {open&&(
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
                    {[{h:"Description",b:day.desc},{h:"Exercise",b:day.exercise},{h:"What You're Training",b:day.focus}].map(sec=>(<div key={sec.h}><p style={{margin:"0 0 4px",fontSize:9,fontWeight:700,color:"#67e8f9",textTransform:"uppercase",letterSpacing:1.5}}>{sec.h}</p><p style={{margin:0,color:"#d1d5db",fontSize:12,lineHeight:1.75}}>{sec.b}</p></div>))}
                    <button onClick={()=>markDone(tier,week,day.day)} style={{padding:"8px 0",borderRadius:10,border:done?"1px solid rgba(52,211,153,0.5)":"1px solid rgba(6,182,212,0.4)",background:done?"rgba(52,211,153,0.1)":"none",color:done?"#34d399":"#67e8f9",fontWeight:700,fontSize:11,cursor:"pointer"}}>{done?"Completed ✓":"Mark Complete ✓"}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFlashcards=()=>(
    <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <Bar title="Flashcards" onBack={()=>go("overview")} onHome={()=>go("overview")}/>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(decks.length,4)},1fr)`,gap:8,marginBottom:24}}>
          {decks.map((d,i)=>(<button key={d} onClick={()=>{setFcDeck(i);setFcCard(0);setFcFlipped(false);}} style={{padding:"11px 8px",borderRadius:11,border:fcDeck===i?"1px solid rgba(6,182,212,0.6)":"1px solid rgba(255,255,255,0.08)",background:fcDeck===i?"rgba(6,182,212,0.12)":"rgba(255,255,255,0.03)",cursor:"pointer"}}><p style={{margin:"0 0 2px",fontWeight:600,fontSize:10,color:fcDeck===i?"#67e8f9":"#d1d5db",textAlign:"center"}}>{d}</p><p style={{margin:0,fontSize:9,color:"#6b7280",textAlign:"center"}}>{FC[d].length} cards</p></button>))}
        </div>
        <PBar cur={fcCard+1} tot={cards.length||1}/>
        <div onClick={()=>setFcFlipped(f=>!f)} style={{height:230,borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",padding:32,cursor:"pointer",marginBottom:18,position:"relative"}}>
          {!fcFlipped?<div style={{textAlign:"center"}}><p style={{fontSize:15,color:"#e5e7eb",lineHeight:1.8,fontWeight:300,margin:0}}>{card?.front}</p><p style={{fontSize:9,color:"#374151",marginTop:18,textTransform:"uppercase",letterSpacing:2}}>Click to reveal</p></div>:<div style={{textAlign:"center",width:"100%"}}><p style={{fontSize:18,fontWeight:700,color:"#67e8f9",marginBottom:6,lineHeight:1.3}}>{card?.back?.primary}</p>{card?.back?.secondary&&<p style={{fontSize:12,color:"#d1d5db",marginBottom:5}}>{card.back.secondary}</p>}{card?.back?.extra&&<p style={{fontSize:10,color:"#9ca3af",fontStyle:"italic",margin:0}}>{card.back.extra}</p>}</div>}
          <span style={{position:"absolute",top:8,right:12,fontSize:8,color:"#374151"}}>{fcFlipped?"Back":"Front"}</span>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {[{l:"← Previous",fn:()=>{setFcCard(c=>Math.max(0,c-1));setFcFlipped(false);},d:fcCard===0},{l:"Next →",fn:()=>{setFcCard(c=>Math.min((cards.length||1)-1,c+1));setFcFlipped(false);},d:fcCard===(cards.length||1)-1}].map(({l,fn,d})=>(<button key={l} onClick={fn} disabled={d} style={{padding:"9px 26px",borderRadius:10,border:"none",background:"rgba(255,255,255,0.06)",color:d?"#374151":"#d1d5db",fontWeight:600,cursor:d?"not-allowed":"pointer",fontSize:11,opacity:d?0.4:1}}>{l}</button>))}
        </div>
      </div>
    </div>
  );

  const renderScenarios=()=>{const sc=SCNS[scIdx];return(
    <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <Bar title="Scenarios" onBack={()=>go("overview")} onHome={()=>go("overview")}/>
        <PBar cur={scIdx+1} tot={SCNS.length} colors={["#10b981","#06b6d4"]}/>
        <span style={{display:"inline-block",padding:"4px 11px",borderRadius:20,fontSize:9,fontWeight:700,marginBottom:16,background:sc.diff==="Easy"?"rgba(52,211,153,0.12)":sc.diff==="Medium"?"rgba(251,191,36,0.12)":"rgba(239,68,68,0.12)",color:sc.diff==="Easy"?"#34d399":sc.diff==="Medium"?"#fbbf24":"#f87171"}}>{sc.diff}</span>
        <div style={{borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 22px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"linear-gradient(to right,rgba(16,185,129,0.1),rgba(6,182,212,0.1))"}}><h3 style={{margin:0,fontSize:18,fontWeight:700}}>{sc.title}</h3></div>
          <div style={{padding:"20px 22px"}}><p style={{margin:0,color:"#d1d5db",fontSize:13,lineHeight:1.85}}>{sc.scenario}</p></div>
        </div>
        <div style={{marginBottom:12}}><p style={{fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>What phase is this?</p><input value={scAns} onChange={e=>setScAns(e.target.value)} placeholder="Phase name or description..." style={{width:"100%",padding:"10px 13px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>
        <button onClick={()=>setScRev(r=>!r)} style={{width:"100%",padding:"12px 0",borderRadius:11,border:"1px solid rgba(16,185,129,0.4)",background:"none",color:"#34d399",fontWeight:700,fontSize:12,cursor:"pointer",marginBottom:12}}>{scRev?"Hide Answer (up)":"Reveal Answer (down)"}</button>
        {scRev&&(<div style={{borderRadius:12,border:"1px solid rgba(16,185,129,0.2)",background:"rgba(16,185,129,0.06)",padding:"20px",marginBottom:18,display:"flex",flexDirection:"column",gap:12}}>
          {[{h:"Phase",v:sc.answer.phase},{h:"Teaching",v:sc.answer.teaching},{h:"Misalignment",v:sc.answer.mis,italic:true}].map(({h,v,italic})=>(<div key={h}><p style={{margin:"0 0 4px",fontSize:9,fontWeight:700,color:"#34d399",textTransform:"uppercase",letterSpacing:1.5}}>{h}</p><p style={{margin:0,color:h==="Phase"?"#34d399":"#d1d5db",fontSize:h==="Phase"?15:12,fontWeight:h==="Phase"?700:400,lineHeight:1.7,fontStyle:italic?"italic":"normal"}}>{v}</p></div>))}
        </div>)}
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {[{l:"← Previous",fn:()=>{setScIdx(i=>Math.max(0,i-1));setScAns("");setScRev(false);},d:scIdx===0},{l:"Next →",fn:()=>{setScIdx(i=>Math.min(SCNS.length-1,i+1));setScAns("");setScRev(false);},d:scIdx===SCNS.length-1}].map(({l,fn,d})=>(<button key={l} onClick={fn} disabled={d} style={{padding:"9px 26px",borderRadius:10,border:"none",background:"rgba(255,255,255,0.06)",color:d?"#374151":"#d1d5db",fontWeight:600,cursor:d?"not-allowed":"pointer",fontSize:11,opacity:d?0.4:1}}>{l}</button>))}
        </div>
      </div>
    </div>
  );};

  const renderDistinctions=()=>{
    const totD=DIST.reduce((s,p)=>s+p.drills.length,0);
    const bef=DIST.slice(0,dtPair).reduce((s,p)=>s+p.drills.length,0);
    const gI=bef+dtDrill+1;
    const isFirst=dtPair===0&&dtDrill===0;
    const isLast=dtPair===DIST.length-1&&dtDrill===dp.drills.length-1;
    const nxt=()=>{if(dtDrill<dp.drills.length-1){setDtDrill(d=>d+1);setDtChoice(null);setDtRev(false);}else if(dtPair<DIST.length-1){setDtPair(p=>p+1);setDtDrill(0);setDtChoice(null);setDtRev(false);}};
    const prv=()=>{if(dtDrill>0){setDtDrill(d=>d-1);setDtChoice(null);setDtRev(false);}else if(dtPair>0){const pp=DIST[dtPair-1];setDtPair(p=>p-1);setDtDrill(pp.drills.length-1);setDtChoice(null);setDtRev(false);}};
    return(
      <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Bar title="Distinction Training" onBack={()=>go("overview")} onHome={()=>go("overview")}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
            {DIST.map((p,i)=>(<button key={p.pair} onClick={()=>{setDtPair(i);setDtDrill(0);setDtChoice(null);setDtRev(false);}} style={{padding:"9px 10px",borderRadius:11,border:dtPair===i?"1px solid rgba(245,158,11,0.6)":"1px solid rgba(255,255,255,0.08)",background:dtPair===i?"rgba(245,158,11,0.1)":"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left"}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:13}}>{p.A.icon}</span><span style={{fontSize:8,color:"#6b7280"}}>vs</span><span style={{fontSize:13}}>{p.B.icon}</span></div><p style={{margin:0,fontWeight:600,fontSize:10,color:dtPair===i?"#fbbf24":"#d1d5db"}}>{p.A.name} vs {p.B.name}</p></button>))}
          </div>
          <PBar cur={gI} tot={totD} colors={["#f59e0b","#fb923c"]}/>
          <div style={{borderRadius:12,border:"1px solid rgba(245,158,11,0.2)",background:"rgba(245,158,11,0.07)",padding:"16px 20px",marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontSize:12,color:"#d1d5db",lineHeight:1.7}}>{dp.sep}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{ph:dp.A,sigs:dp.sigA},{ph:dp.B,sigs:dp.sigB}].map(({ph,sigs})=>(<div key={ph.name} style={{borderRadius:9,padding:"10px 12px",border:`1px solid ${ph.c}25`,background:`${ph.c}10`}}><p style={{margin:"0 0 5px",fontSize:9,fontWeight:700,color:ph.c}}>{ph.icon} {ph.name}</p><ul style={{margin:0,padding:0,listStyle:"none"}}>{sigs.map((s,i)=><li key={i} style={{fontSize:10,color:"#9ca3af",marginBottom:2,display:"flex",gap:4}}><span style={{color:"#6b7280"}}>·</span>{s}</li>)}</ul></div>))}
            </div>
          </div>
          <div style={{borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:18}}>
            <div style={{padding:"11px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"linear-gradient(to right,rgba(245,158,11,0.1),rgba(251,146,60,0.1))"}}><p style={{margin:0,fontSize:10,color:"#fbbf24",fontWeight:700}}>Drill {dtDrill+1} of {dp.drills.length}</p></div>
            <div style={{padding:"18px 22px"}}><p style={{margin:0,color:"#e5e7eb",fontSize:13,lineHeight:1.85}}>{dd.sit}</p></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[{key:"A",ph:dp.A},{key:"B",ph:dp.B}].map(({key,ph})=>{
              const chosen=dtChoice===key;const correct=key===dd.ans;
              let brd=`${ph.c}30`,bg=`${ph.c}08`;
              if(dtRev&&chosen&&correct){brd=ph.c;bg=`${ph.c}25`;}
              if(dtRev&&chosen&&!correct){brd="#ef4444";bg="#ef444415";}
              if(dtRev&&!chosen&&correct){brd=ph.c;bg=`${ph.c}15`;}
              return(<button key={key} onClick={()=>!dtRev&&setDtChoice(key)} style={{padding:"16px 12px",borderRadius:12,border:`2px solid ${chosen&&!dtRev?ph.c:brd}`,background:bg,cursor:dtRev?"default":"pointer",textAlign:"left"}}>
                <div style={{fontSize:20,marginBottom:5}}>{ph.icon}</div>
                <p style={{margin:"0 0 3px",fontWeight:700,color:"#fff",fontSize:13}}>{ph.name}</p>
                {dtRev&&correct&&<p style={{margin:0,fontSize:9,fontWeight:700,color:ph.c}}>✓ Correct</p>}
                {dtRev&&chosen&&!correct&&<p style={{margin:0,fontSize:9,fontWeight:700,color:"#f87171"}}>✗ Incorrect</p>}
              </button>);
            })}
          </div>
          <button onClick={()=>setDtRev(r=>!r)} disabled={!dtChoice} style={{width:"100%",padding:"12px 0",borderRadius:11,border:"1px solid rgba(245,158,11,0.4)",background:"none",color:"#fbbf24",fontWeight:700,fontSize:12,cursor:dtChoice?"pointer":"not-allowed",marginBottom:12,opacity:dtChoice?1:0.4}}>{dtRev?"Hide Answer (up)":dtChoice?"Reveal Answer (down)":"Choose a phase first"}</button>
          {dtRev&&(<div style={{borderRadius:12,border:"1px solid rgba(245,158,11,0.2)",background:"rgba(245,158,11,0.07)",padding:"18px",marginBottom:18,display:"flex",flexDirection:"column",gap:10}}>
            {[{h:"Answer",v:dd.ans==="A"?dp.A.name:dp.B.name},{h:"Distinguishing Signal",v:dd.sig},{h:"Why Not the Other",v:dd.why,italic:true}].map(({h,v,italic})=>(<div key={h}><p style={{margin:"0 0 3px",fontSize:9,fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:1.5}}>{h}</p><p style={{margin:0,color:h==="Answer"?"#fbbf24":"#d1d5db",fontSize:h==="Answer"?14:11,fontWeight:h==="Answer"?700:400,lineHeight:1.7,fontStyle:italic?"italic":"normal"}}>{v}</p></div>))}
          </div>)}
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            {[{l:"← Previous",fn:prv,d:isFirst},{l:"Next →",fn:nxt,d:isLast}].map(({l,fn,d})=>(<button key={l} onClick={fn} disabled={d} style={{padding:"9px 26px",borderRadius:10,border:"none",background:"rgba(255,255,255,0.06)",color:d?"#374151":"#d1d5db",fontWeight:600,cursor:d?"not-allowed":"pointer",fontSize:11,opacity:d?0.4:1}}>{l}</button>))}
          </div>
        </div>
      </div>
    );
  };

  const renderEse=()=>{
    const totS=ESE.reduce((s,p)=>s+p.stories.length,0);
    const b2=ESE.slice(0,eP).reduce((s,p)=>s+p.stories.length,0);
    const isF2=eP===0&&eS===0;const isL2=eP===ESE.length-1&&eS===ep.stories.length-1;
    const nxtS=()=>{if(eS<ep.stories.length-1){setES(s=>s+1);setETch(false);}else if(eP<ESE.length-1){setEP(p=>p+1);setES(0);setETch(false);}};
    const prvS=()=>{if(eS>0){setES(s=>s-1);setETch(false);}else if(eP>0){const pp=ESE[eP-1];setEP(p=>p-1);setES(pp.stories.length-1);setETch(false);}};
    return(
      <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Bar title="Ese Stories" onBack={()=>go("overview")} onHome={()=>go("overview")}/>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(ESE.length,5)},1fr)`,gap:8,marginBottom:18}}>
            {ESE.map((p,i)=>(<button key={p.phase} onClick={()=>{setEP(i);setES(0);setETch(false);}} style={{padding:"9px 7px",borderRadius:11,border:eP===i?`2px solid ${p.color}`:"1px solid rgba(255,255,255,0.08)",background:eP===i?`${p.color}20`:"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:16,marginBottom:3}}>{p.icon}</div><p style={{margin:0,fontSize:9,fontWeight:600,color:eP===i?p.color:"#9ca3af"}}>{p.phase}</p></button>))}
          </div>
          <PBar cur={b2+eS+1} tot={totS} colors={["#8b5cf6","#6d28d9"]}/>
          <div style={{borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:18}}>
            <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:`linear-gradient(to right,${ep.color}12,${ep.color}05)`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}><span style={{fontSize:22}}>{ep.icon}</span><div><p style={{margin:"0 0 2px",fontSize:9,fontWeight:700,color:ep.color,textTransform:"uppercase",letterSpacing:2}}>{ep.phase}</p><h3 style={{margin:0,fontSize:20,fontWeight:700}}>{es.title}</h3></div></div>
              <p style={{margin:0,fontSize:10,color:"#6b7280",fontStyle:"italic"}}>{es.arc}</p>
            </div>
            <div style={{padding:"24px 28px"}}>{es.text.split("\n\n").map((par,i)=><p key={i} style={{margin:"0 0 18px",color:"#d1d5db",fontSize:13,lineHeight:2}}>{par}</p>)}</div>
          </div>
          <div style={{borderRadius:12,padding:"18px 20px",marginBottom:14,border:`1px solid ${ep.color}20`,background:`${ep.color}08`}}>
            <p style={{fontSize:9,fontWeight:700,color:ep.color,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Reflection</p>
            <p style={{margin:"0 0 10px",color:"#d1d5db",fontSize:12,lineHeight:1.85,fontStyle:"italic"}}>{es.reflection}</p>
            <textarea placeholder="Write what you noticed..." rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:11,resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7}}/>
          </div>
          <button onClick={()=>setETch(t=>!t)} style={{width:"100%",padding:"12px 0",borderRadius:11,border:"1px solid rgba(139,92,246,0.3)",background:"none",color:"#a78bfa",fontWeight:700,fontSize:12,cursor:"pointer",marginBottom:14}}>{eTch?"Hide Teaching (up)":"Reveal Pattern Teaching (down)"}</button>
          {eTch&&(<div style={{borderRadius:12,border:"1px solid rgba(139,92,246,0.2)",background:"rgba(139,92,246,0.07)",padding:"18px 20px",marginBottom:18,display:"flex",flexDirection:"column",gap:10}}>
            {[{h:"Phase",v:ep.phase},{h:"Pattern Name",v:ep.pn},{h:"Core Teaching",v:ep.teaching}].map(({h,v})=>(<div key={h}><p style={{margin:"0 0 3px",fontSize:9,fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:1.5}}>{h}</p><p style={{margin:0,color:"#d1d5db",fontSize:12,lineHeight:1.7}}>{v}</p></div>))}
          </div>)}
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            {[{l:"← Previous",fn:prvS,d:isF2},{l:"Next →",fn:nxtS,d:isL2}].map(({l,fn,d})=>(<button key={l} onClick={fn} disabled={d} style={{padding:"9px 26px",borderRadius:10,border:"none",background:"rgba(255,255,255,0.06)",color:d?"#374151":"#d1d5db",fontWeight:600,cursor:d?"not-allowed":"pointer",fontSize:11,opacity:d?0.4:1}}>{l}</button>))}
          </div>
        </div>
      </div>
    );
  };

  const renderRhythm=()=>{
    const completed=rhythm.completed||{};const streak=rhythm.streak||{count:0,lastDate:null};
    const today=new Date().toISOString().slice(0,10);const yest=new Date(Date.now()-86400000).toISOString().slice(0,10);
    const streakActive=streak.lastDate===today||streak.lastDate===yest;
    const totalDays=24*7;const doneDays=Object.keys(completed).length;
    const tierProg=[1,2,3].map(t=>{const wks=Object.keys(ALL_WEEKS[`tier_${t}`]);const poss=wks.length*7;const done=wks.reduce((s,_,i)=>{let c=0;for(let d=1;d<=7;d++)if(completed[`T${t}W${i+1}D${d}`])c++;return s+c;},0);return{tier:t,done,poss,pct:Math.round(done/poss*100),color:{1:"#FF6B6B",2:"#FBBF24",3:"#67E8F9"}[t],name:TIER_META[t].name};});
    return(
      <div style={{minHeight:"100vh",background:BG,color:"#fff",padding:"40px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <Bar title="Learning Rhythm" onBack={()=>go("overview")} onHome={()=>go("overview")}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:32}}>
            {[{icon:"🔥",label:"Practice Streak",val:streak.count,sub:streak.count===0?"Begin today":streakActive?"Active":"Broken — restart today",col:streak.count>0&&streakActive?"#6BCB77":"#94A3B8"},{icon:"✓",label:"Exercises Done",val:`${doneDays}/${totalDays}`,sub:`${Math.round(doneDays/totalDays*100)}% complete`,col:"#38BDF8"},{icon:"◎",label:"Tiers Active",val:`${tierProg.filter(t=>t.done>0).length}/3`,sub:"Tiers where practice has begun",col:"#C084FC"}].map(({icon,label,val,sub,col})=>(<div key={label} style={{borderRadius:16,border:`1px solid ${col}25`,background:`${col}10`,padding:"20px 16px",textAlign:"center"}}><p style={{fontSize:20,margin:"0 0 5px"}}>{icon}</p><p style={{fontSize:24,fontWeight:800,margin:"0 0 3px",color:"#fff"}}>{val}</p><p style={{fontSize:9,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:1.5,margin:"0 0 3px"}}>{label}</p><p style={{fontSize:9,color:"#6b7280",margin:0}}>{sub}</p></div>))}
          </div>
          <div style={{marginBottom:28}}>
            <p style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Progress by Tier</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {tierProg.map(({tier:t,done,poss,pct,color,name})=>(<div key={t} style={{borderRadius:12,border:`1px solid ${color}20`,background:`${color}08`,padding:"14px 18px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:10,fontWeight:700,color,textTransform:"uppercase",letterSpacing:1.5}}>T{t} — {name} · {done}/{poss}</span><span style={{fontSize:10,color:"#6b7280"}}>{pct}%</span></div><div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3}}/></div></div>))}
            </div>
          </div>
          <div style={{marginBottom:28}}>
            <p style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>All 12 Phases — Tier 1</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {Object.keys(PHASES).map((ph,i)=>{const w=i+1;const done=[1,2,3,4,5,6,7].filter(d=>completed[`T1W${w}D${d}`]).length;const phd=PHASES[ph];return(<div key={ph} style={{borderRadius:10,border:`1px solid ${phd.color}25`,background:`${phd.color}08`,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:16,marginBottom:3}}>{phd.icon}</div><p style={{margin:"0 0 2px",fontSize:10,fontWeight:700,color:"#fff"}}>{ph}</p><p style={{margin:"0 0 4px",fontSize:8,color:"#6b7280"}}>{phd.el}</p>{done>0&&<div style={{height:2,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${done/7*100}%`,background:phd.color}}/></div>}<p style={{margin:"3px 0 0",fontSize:8,color:"#6b7280"}}>{done}/7</p></div>);})}
            </div>
          </div>
          <div style={{borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",padding:"22px"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>What Your Rhythm Is Saying</p>
            {doneDays===0?<p style={{color:"#9ca3af",fontSize:13,lineHeight:1.8,margin:0}}>No rhythm data yet. Begin the daily exercises and return here after a week to see your learning pattern emerge.</p>:<div style={{display:"flex",flexDirection:"column",gap:8}}>
              {streak.count>=7&&<p style={{margin:0,color:"#9ca3af",fontSize:13,lineHeight:1.8}}>A seven-day streak means the daily practice rhythm has taken hold.</p>}
              {(streak.count>0&&streak.count<7)&&<p style={{margin:0,color:"#9ca3af",fontSize:13,lineHeight:1.8}}>The streak is young. Seven consecutive days is the threshold where daily rhythm becomes established.</p>}
              {(!streakActive&&streak.count>0)&&<p style={{margin:0,color:"#fb923c",fontSize:13,lineHeight:1.8}}>The streak has broken. The rhythm is not lost — it only needs restarting.</p>}
              {doneDays>0&&<p style={{margin:0,color:"#9ca3af",fontSize:13,lineHeight:1.8}}>You have completed {doneDays} exercise{doneDays!==1?"s":""}. Repetition is building recognition into reflex.</p>}
            </div>}
          </div>
        </div>
      </div>
    );
  };

  return(
    <div>
      {view==="overview"&&renderOverview()}
      {view==="lesson"&&renderLesson()}
      {view==="practice"&&renderPractice()}
      {view==="flashcards"&&renderFlashcards()}
      {view==="scenarios"&&renderScenarios()}
      {view==="distinctions"&&renderDistinctions()}
      {view==="ese"&&renderEse()}
      {view==="rhythm"&&renderRhythm()}
    </div>
  );
}
