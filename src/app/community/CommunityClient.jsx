"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// ATTUNED COMMUNITY — Member Portal v20 (My Journey current position + track progress)
// Twelvefold Institute
// Local Vite deployment (localhost)
// Tagline: Learn the Order. Read the Pattern. Move with the Rhythm.
// ═══════════════════════════════════════════════════════════════

const KEYS = { profile:'ac-member-profile', journal:'ac-journal-entries', posts:'ac-community-posts', events:'ac-events', progress:'ac-learning-progress', announcements:'ac-announcements', circleNotes:'ac-circle-notes', coachingNotes:'ac-coaching-notes', members:'ac-members', guides:'ac-guides', decodings:'ac-decodings', codex:'ac-codex' };
const save = (key,data) => localStorage.setItem(key,JSON.stringify(data));
const load = (key,fb) => { try{return JSON.parse(localStorage.getItem(key))||fb;}catch{return fb;} };

const LEVELS = [
  { id:'observer',label:'Observer',rank:1,color:'#9A938A',price:'Free',desc:'Learn events and pattern awareness.',question:'What keeps repeating?',learns:['Events','Pattern awareness'] },
  { id:'reader',label:'Reader',rank:2,color:'#9B8FC7',price:'$200/mo',desc:'Pattern identification and Pattern Literacy foundations.',question:'What pattern am I living?',learns:['Pattern identification','Pattern Literacy foundations'] },
  { id:'interpreter',label:'Interpreter',rank:3,color:'#7BA0C4',price:'$350/mo',desc:'Structure analysis and rhythm analysis.',question:'Why does this pattern exist?',learns:['Structure analysis','Rhythm analysis'] },
  { id:'practitioner',label:'Practitioner',rank:4,color:'#E0B65C',price:'$500/mo',desc:'Conscious alignment and decision-making through pattern awareness.',question:'How should I respond?',learns:['Conscious alignment','Decision-making through pattern awareness'] },
  { id:'guide',label:'Guide',rank:5,color:'#7FB39A',price:'By Invitation',desc:'Community facilitation, pattern coaching, vision reading.',question:'How do I help others read reality?',learns:['Community facilitation','Pattern coaching','Vision reading'] },
];

const VALUES = [
  { title:'Observation Before Reaction',desc:'We seek understanding before judgment.' },
  { title:'Pattern Before Event',desc:'We study causes, not symptoms.' },
  { title:'Alignment Before Action',desc:'We move with reality rather than against it.' },
  { title:'Learning Before Blame',desc:'Every recurring experience contains instruction.' },
  { title:'Participation Before Prediction',desc:'The goal is to participate wisely in the creation of the future.' },
];

const CREED = ['We believe reality is intelligible.','We believe events are not isolated.','We believe patterns reveal deeper structures.','We believe rhythms guide development.','We believe wisdom comes through attunement.','','We commit to observation before reaction,','learning before blame,','alignment before force,','and participation before prediction.','','We seek to live in harmony with Intelligent Order.'];

const LENSES = [
  { id:'intelligent-order',number:1,title:'Intelligent Order',question:'What larger intelligence or principle is operating here?',examples:['Growth','Balance','Adaptation','Transformation','Stewardship','Integration'],color:'#E0B65C' },
  { id:'structure',number:2,title:'Structure',question:'What underlying architecture is creating this situation?',examples:['Belief systems','Incentives','Relationships','Habits','Organizational design','Cultural assumptions'],color:'#9B8FC7' },
  { id:'pattern',number:3,title:'Pattern',question:'What is repeating?',examples:['Recurring conflicts','Repeating opportunities','Cycles of success','Cycles of failure'],color:'#7BA0C4' },
  { id:'rhythm',number:4,title:'Rhythm',question:'What phase of development am I in?',examples:['Initiation','Building','Expansion','Transition','Completion'],color:'#7FB39A' },
  { id:'events',number:5,title:'Events',question:'What specific manifestation am I observing?',examples:['Events become data','Patterns become meaning'],color:'#D98C7A' },
];

const ECOSYSTEM = [
  { entity:'Twelvefold Institute',purpose:'Research, curriculum, certification',icon:'◆' },
  { entity:'PatternOS',purpose:'Technology and AI platform',icon:'◈' },
  { entity:'Attuned Community',purpose:'Practice and application community',icon:'◎' },
  { entity:'Attunement Circles',purpose:'Local chapters and gatherings',icon:'◉' },
  { entity:'Certified Practitioners',purpose:'Guides trained to serve others',icon:'◇' },
];

const MICRO_STATES = ['Initiation','Expansion','Contraction','Integration'];

const PHASES = [
  { sign:'Aries',name:'Ignition',icon:'♈',element:'Fire',mode:'Cardinal',func:'Initiation',funcPurpose:'Begin',seeks:'emergence',patternWord:'Beginning',rhythmWord:'Birth',eventsList:['New project','New relationship','New vision','New identity'],dev:{intelligence:'Initiative Intelligence',character:'Courage',capability:'Action',consciousness:'Self-awareness'},teaching:'The spark of new beginnings. Raw impulse meeting reality for the first time.',wisdom:'Every cycle begins with an act of courage. Ignition is not reckless — it is the intelligence of the seed breaking through soil.',prompts:['What new impulse is trying to emerge in your life right now?','Where are you hesitating to begin? What would courage look like today?','Write about a time when acting on instinct led you somewhere important.'],practices:['Morning intention setting — name one thing you will initiate today.','Notice where you feel the pull to start something. Follow it for one hour.','Identify one area where over-planning has replaced action.'],shadow:'Impulsiveness without direction. Starting without willingness to sustain.',gift:'The courage to begin before conditions are perfect.' },
  { sign:'Taurus',name:'Foundation',icon:'♉',element:'Earth',mode:'Fixed',func:'Foundation',funcPurpose:'Build',seeks:'stability',patternWord:'Establishment',rhythmWord:'Rooting',eventsList:['Building resources','Creating routines','Financial security','Physical health'],dev:{intelligence:'Stewardship Intelligence',character:'Patience',capability:'Consistency',consciousness:'Embodiment'},teaching:'What was sparked must now be given ground. Foundation is the act of making something real.',wisdom:'Intelligent Order does not rush. After ignition comes patient building. Can you stay with something long enough for it to take root?',prompts:['What in your life needs more patient tending right now?','Where are you rushing past the foundation phase?','What do you truly value enough to build slowly?'],practices:['Spend 20 minutes on one task with no multitasking.','Identify one commitment you have been neglecting. Recommit this week.','Walk slowly. Eat slowly. Notice the body and patience.'],shadow:'Stubbornness mistaken for commitment. Clinging to comfort.',gift:'The patience to let something become what it is meant to be.' },
  { sign:'Gemini',name:'Intelligence',icon:'♊',element:'Air',mode:'Mutable',func:'Learning',funcPurpose:'Learn',seeks:'understanding',patternWord:'Exploration',rhythmWord:'Discovery',eventsList:['Education','Networking','Questions','Skill acquisition'],dev:{intelligence:'Learning Intelligence',character:'Curiosity',capability:'Communication',consciousness:'Awareness'},teaching:'The mind opens. Information flows. Intelligence is the phase of learning how to learn.',wisdom:'After foundation is set, the structure needs intelligence — the ability to adapt, communicate, and process. Knowledge is not accumulation. It is seeing connections between things that appear separate.',prompts:['What are you learning right now that is changing how you see?','Where are you confusing information with understanding?','What conversation do you need to have that you have been avoiding?'],practices:['Read something outside your usual domain. Note three connections.','Practice articulating a complex idea in simple language.','Listen to someone today without formulating a response while they speak.'],shadow:'Scattered attention. Knowledge without application.',gift:'The capacity to see patterns across seemingly unrelated domains.' },
  { sign:'Cancer',name:'Inner Root',icon:'♋',element:'Water',mode:'Cardinal',func:'Belonging',funcPurpose:'Bond',seeks:'connection',patternWord:'Nurturing',rhythmWord:'Bonding',eventsList:['Family','Community','Emotional healing','Home'],dev:{intelligence:'Emotional Intelligence',character:'Compassion',capability:'Caregiving',consciousness:'Interconnectedness'},teaching:'After learning comes feeling. Inner Root is where knowledge descends from the mind into the body.',wisdom:'Intelligence that has not been felt is incomplete. What do you actually feel about what you know? Until information becomes felt-truth, it cannot guide you.',prompts:['What truth have you understood intellectually but not yet felt?','Where do you feel most emotionally safe? What creates that safety?','What is your relationship with vulnerability right now?'],practices:['Sit with one emotion for five minutes without trying to change it.','Write a letter to yourself at age 12.','Notice where in your body you carry tension today. Breathe into it.'],shadow:'Over-protection. Emotional withdrawal disguised as self-care.',gift:'The ability to feel truth, not just think it.' },
  { sign:'Leo',name:'Authority',icon:'♌',element:'Fire',mode:'Fixed',func:'Creative',funcPurpose:'Shine',seeks:'expression',patternWord:'Self-Revelation',rhythmWord:'Radiance',eventsList:['Leadership','Creativity','Visibility','Performance'],dev:{intelligence:'Creative Intelligence',character:'Confidence',capability:'Influence',consciousness:'Authenticity'},teaching:'What has been felt must now be expressed. Authority is the courage to be seen as you actually are.',wisdom:'Authority is not dominion over others. It is authorship — the willingness to stand behind what you have built, learned, and felt. Can you express your truth without needing applause?',prompts:['Where are you hiding your real capacity?','What would it look like to lead from authenticity rather than performance?','Who are you when no one is watching? Is that person allowed to be public?'],practices:['Share one genuine opinion today without softening it.','Create something and let it exist without editing.','Notice where you perform confidence versus where you actually feel it.'],shadow:'Performance without substance. Seeking validation instead of truth.',gift:'The courage to be visible and accountable for what you create.' },
  { sign:'Virgo',name:'Correction',icon:'♍',element:'Earth',mode:'Mutable',func:'Optimization',funcPurpose:'Improve',seeks:'refinement',patternWord:'Improvement',rhythmWord:'Correction',eventsList:['System building','Analysis','Health optimization','Skill mastery'],dev:{intelligence:'Operational Intelligence',character:'Discipline',capability:'Execution',consciousness:'Discernment'},teaching:'What has been expressed now needs refinement. Correction is the intelligence of precision.',wisdom:'After the boldness of Authority comes the humility of Correction. This is not criticism — it is discernment. Correction is love expressed as craft.',prompts:['What in your life is functional but not yet excellent?','Where are you avoiding necessary correction out of comfort?','Where are you overcommitted? Write three areas requiring recalibration.'],practices:['Choose one area of your work and improve a single detail.','Ask for honest feedback from someone you trust. Receive it without defending.','Clean or organize one physical space. Notice how external order affects internal clarity.'],shadow:'Perfectionism that prevents completion. Criticism disguised as helpfulness.',gift:'The ability to refine without destroying what has been built.' },
  { sign:'Libra',name:'Balance',icon:'♎',element:'Air',mode:'Cardinal',func:'Relationship',funcPurpose:'Balance',seeks:'harmony',patternWord:'Balancing',rhythmWord:'Reciprocity',eventsList:['Partnerships','Negotiations','Collaboration','Diplomacy'],dev:{intelligence:'Relational Intelligence',character:'Fairness',capability:'Cooperation',consciousness:'Mutuality'},teaching:'The art of right relationship. Balance is where self meets other and must find harmony.',wisdom:'Balance does not mean equal distribution — it means right proportion. Justice and beauty are not luxuries. They are structural necessities.',prompts:['Which relationship in your life needs recalibration right now?','Where are you giving too much? Where too little?','What does justice look like in your most important partnership?'],practices:['Have a conversation this week that restores balance in a relationship.','Notice where you compromise truth to keep peace. Name it.','Create beauty somewhere today.'],shadow:'People-pleasing disguised as harmony. Avoiding conflict at the cost of truth.',gift:'The ability to hold two truths simultaneously without collapsing into one.' },
  { sign:'Scorpio',name:'Transformation',icon:'♏',element:'Water',mode:'Fixed',func:'Renewal',funcPurpose:'Renew',seeks:'transformation',patternWord:'Death-Rebirth',rhythmWord:'Metamorphosis',eventsList:['Crisis','Loss','Deep healing','Reinvention'],dev:{intelligence:'Transformational Intelligence',character:'Courage',capability:'Adaptation',consciousness:'Depth'},teaching:'What cannot survive the depth must be released. Transformation is the intelligence of death and regeneration.',wisdom:'This is the phase most people resist and most people need. Every pattern that no longer serves becomes fuel for what comes next. But you must be willing to let go completely.',prompts:['What are you holding onto that has already ended?','What would you need to release to become who you are becoming?','Where is a death happening in your life that you have not yet honored?'],practices:['Name one thing you need to let go of. Write it down. Burn the paper.','Sit with discomfort for 10 minutes without reaching for distraction.','Have the conversation you have been avoiding.'],shadow:'Control disguised as intensity. Destruction without regeneration.',gift:'The ability to let something die so something real can be born.' },
  { sign:'Sagittarius',name:'Expansion',icon:'♐',element:'Fire',mode:'Mutable',func:'Vision',funcPurpose:'Grow',seeks:'expansion',patternWord:'Exploration',rhythmWord:'Adventure',eventsList:['Travel','Philosophy','Teaching','Mission'],dev:{intelligence:'Vision Intelligence',character:'Faith',capability:'Strategic Direction',consciousness:'Meaning'},teaching:'After transformation, vision returns. Expansion is the search for meaning beyond the personal.',wisdom:'Having survived transformation, you now ask: what does this mean? Not just for me, but for the whole? This is where personal experience becomes teaching.',prompts:['What has your recent experience taught you that could serve others?','Where is your vision too small for what reality is asking of you?','What truth are you ready to teach?'],practices:['Write the three biggest lessons from the last year. Identify the pattern.','Share a hard-won insight with someone who needs it.','Study something from a tradition outside your own.'],shadow:'Preaching without practice. Expansion without integration.',gift:'The ability to find meaning in suffering and turn experience into wisdom.' },
  { sign:'Capricorn',name:'Mastery',icon:'♑',element:'Earth',mode:'Cardinal',func:'Achievement',funcPurpose:'Achieve',seeks:'mastery',patternWord:'Institution Building',rhythmWord:'Ascension',eventsList:['Career growth','Leadership','Authority','Legacy building'],dev:{intelligence:'Strategic Intelligence',character:'Responsibility',capability:'Leadership',consciousness:'Stewardship'},teaching:'Vision must take durable form. Mastery is where wisdom becomes achievement that endures and serves.',wisdom:'Mastery is not mere ambition — it is the patient building of something that outlasts your enthusiasm. A vision that cannot be built into form cannot serve beyond the individual.',prompts:['What vision do you hold that needs durable form?','Where are you relying on inspiration instead of discipline?','What would a 10-year version of your current work look like?'],practices:['Create a 90-day plan for one important project.','Identify one broken system in your life. Design a better one.','Do the unglamorous task you have been postponing.'],shadow:'Rigidity. Control. Ambition disconnected from service.',gift:'The ability to build something that endures beyond enthusiasm.' },
  { sign:'Aquarius',name:'Liberation',icon:'♒',element:'Air',mode:'Fixed',func:'Innovation',funcPurpose:'Evolve',seeks:'evolution',patternWord:'Reformation',rhythmWord:'Breakthrough',eventsList:['New ideas','Social innovation','Technology','Systems redesign'],dev:{intelligence:'Systems Intelligence',character:'Originality',capability:'Innovation',consciousness:'Collective Awareness'},teaching:'Structure must serve freedom. Liberation asks what must be released and reinvented so the system can keep breathing.',wisdom:'Liberation is not rebellion — it is the intelligence that knows when a system needs to evolve. What rules have outlived their purpose?',prompts:['What structure in your life has become a constraint rather than a support?','Where are you conforming to expectations that no longer serve?','What would genuine freedom look like for you right now?'],practices:['Break one routine today. Do something differently.','Question one belief you hold. Ask: is this mine, or inherited?','Offer one unconventional idea in a conversation this week.'],shadow:'Rebellion without purpose. Detachment disguised as independence.',gift:'The ability to evolve systems without destroying what they serve.' },
  { sign:'Pisces',name:'Dissolution',icon:'♓',element:'Water',mode:'Mutable',func:'Completion',funcPurpose:'Return',seeks:'integration',patternWord:'Surrender',rhythmWord:'Dissolution',eventsList:['Reflection','Spiritual awakening','Forgiveness','Closure'],dev:{intelligence:'Unity Intelligence',character:'Wisdom',capability:'Integration',consciousness:'Wholeness'},teaching:'The cycle completes. Dissolution is the return to the source before the next beginning.',wisdom:'Everything dissolves back into the field from which it came. This is not failure — it is completion. The next ignition is already forming.',prompts:['What cycle in your life is completing right now?','Where do you need to rest instead of starting something new?','What has this cycle taught you that you want to carry forward?'],practices:['Spend time near water. Let your mind wander.','Write a completion letter to something that is ending.','Do nothing productive for one hour. Practice being.'],shadow:'Escapism. Martyrdom. Refusing to let a cycle end.',gift:'The ability to surrender to completion and trust what comes next.' },
];

const WISDOM_TRACKS = [
  { id:'ifa',name:'Ifá',origin:'Yoruba / West Africa',icon:'◈',desc:'The oldest known system of organized divination. Ifá teaches that reality speaks through patterns (Odù) and that human beings can align with cosmic intelligence through careful observation and ritual precision.',keyTeachings:['256 Odù (pattern configurations)','Orí (personal destiny and alignment)','Àṣẹ (the power to make things happen)','Iwà Pẹ̀lẹ́ (gentle character as spiritual technology)'],connectionToFramework:'Ifá\'s Odù system directly maps to the concept of pattern states. Each Odù describes a configuration of forces — much like each phase × micro-state combination in Pattern Literacy.',modules:[{id:'ifa-1',title:'Introduction to Ifá',desc:'Origins, philosophy, and why Ifá matters to Pattern Literacy.',duration:'30 min'},{id:'ifa-2',title:'The Odù System',desc:'How 256 pattern configurations describe the full range of human experience.',duration:'45 min'},{id:'ifa-3',title:'Orí and Personal Alignment',desc:'The concept of destiny, purpose, and cooperating with your own unfolding.',duration:'30 min'}] },
  { id:'kabbalah',name:'Kabbalah',origin:'Jewish Mysticism',icon:'✡',desc:'The Tree of Life maps the architecture of reality through ten emanations (Sefirot) and twenty-two paths. Kabbalah teaches that structure is sacred.',keyTeachings:['The ten Sefirot','The four worlds (levels of reality)','Tikkun (repair and alignment)','The 22 paths between Sefirot'],connectionToFramework:'Kabbalah\'s ten Sefirot map directly to the concept of structure in the Attuned Framework. The four worlds parallel the five lenses.',modules:[{id:'kab-1',title:'Introduction to Kabbalah',desc:'The Tree of Life and its relevance to pattern literacy.',duration:'30 min'},{id:'kab-2',title:'The Ten Sefirot',desc:'Understanding the ten emanations as a map of reality.',duration:'45 min'},{id:'kab-3',title:'Tikkun and Aligned Action',desc:'The concept of repair as conscious participation in reality.',duration:'30 min'}] },
  { id:'iching',name:'I Ching',origin:'Chinese Philosophy',icon:'☯',desc:'The Book of Changes describes reality as a dynamic interplay of yin and yang through 64 hexagrams. The I Ching teaches that change follows intelligible patterns.',keyTeachings:['64 hexagrams (situation-patterns)','Yin-yang polarity','The concept of timing as intelligence','Lines in motion (change within stability)'],connectionToFramework:'The I Ching\'s hexagrams are pattern states — configurations of forces that describe the quality of a moment. Its emphasis on timing aligns with the Rhythm lens.',modules:[{id:'ic-1',title:'Introduction to I Ching',desc:'The philosophy of change and its connection to Pattern Literacy.',duration:'30 min'},{id:'ic-2',title:'Reading Hexagrams',desc:'How to interpret the 64 hexagrams as descriptions of pattern states.',duration:'45 min'},{id:'ic-3',title:'Timing and the Quality of the Moment',desc:'Using the I Ching to understand rhythm and aligned action.',duration:'30 min'}] },
  { id:'scripture',name:'Scripture',origin:'Abrahamic Traditions',icon:'📖',desc:'The sacred texts contain profound pattern teaching embedded in narrative. Scripture teaches through story — showing how human beings navigate cycles of covenant, exile, return, and redemption.',keyTeachings:['Covenant patterns','Exile and return cycles','Prophetic pattern recognition','Parables as pattern instruction'],connectionToFramework:'Scripture\'s narrative structure IS pattern literacy in story form. The cycles of exile and return mirror the 12-phase cycle.',modules:[{id:'scr-1',title:'Pattern Reading in Scripture',desc:'How sacred narrative teaches pattern recognition.',duration:'30 min'},{id:'scr-2',title:'Cycles of Covenant and Return',desc:'The archetypal cycle embedded in Abrahamic narrative.',duration:'40 min'},{id:'scr-3',title:'The Prophetic Voice',desc:'Pattern reading as a form of prophecy.',duration:'30 min'}] },
  { id:'buddhism',name:'Buddhism',origin:'Indian Subcontinent',icon:'☸',desc:'Buddhism teaches that suffering arises from misreading reality. The Four Noble Truths and the Eightfold Path are pattern recognition technologies.',keyTeachings:['The Four Noble Truths','Dependent origination','Impermanence','The Eightfold Path'],connectionToFramework:'Buddhism\'s dependent origination is the Structure lens in spiritual form. The Four Noble Truths are a pattern reading methodology.',modules:[{id:'bud-1',title:'Buddhism and Pattern Recognition',desc:'The Four Noble Truths as a diagnostic framework.',duration:'30 min'},{id:'bud-2',title:'Dependent Origination',desc:'Understanding structure through the Buddhist lens of conditions.',duration:'40 min'},{id:'bud-3',title:'The Eightfold Path as Aligned Action',desc:'Buddhist ethics as a framework for moving with reality.',duration:'30 min'}] },
  { id:'hermetic',name:'Hermetic Philosophy',origin:'Hellenistic Egypt',icon:'⚗',desc:'The Hermetic tradition teaches that reality operates according to seven universal principles. "As above, so below" is the foundational insight.',keyTeachings:['The seven Hermetic principles','As above, so below','The Principle of Rhythm','The Principle of Correspondence'],connectionToFramework:'Hermetic philosophy is arguably the most direct ancestor of Pattern Literacy. The Principle of Correspondence teaches fractal pattern structure.',modules:[{id:'her-1',title:'Introduction to Hermetic Philosophy',desc:'The seven principles and their relevance to pattern literacy.',duration:'30 min'},{id:'her-2',title:'As Above, So Below',desc:'Fractal patterns — how the same structure repeats across scales.',duration:'40 min'},{id:'her-3',title:'The Principles of Rhythm and Polarity',desc:'Understanding cycles and opposites as structural intelligence.',duration:'30 min'}] },
];

const CURRICULUM_MODULES = [
  { level:'observer',title:'Level 1 — Observer',modules:[{id:'t0-1',title:'What Is Pattern Literacy?',desc:'The framework, the five layers of reality, and why this matters.',duration:'15 min'},{id:'t0-2',title:'The 12 Phases Overview',desc:'Meet the twelve archetypal phases.',duration:'25 min'},{id:'t0-3',title:'Your First Pattern Reading',desc:'Experience a guided PatternOS diagnostic reading.',duration:'20 min'},{id:'t0-4',title:'The Five Lenses Introduction',desc:'Intelligent Order, Structure, Pattern, Rhythm, Events.',duration:'30 min'}] },
  { level:'reader',title:'Level 2 — Reader: Recognition (12 Weeks)',modules:[{id:'t1-1',title:'Week 1–2: Ignition & Foundation',desc:'Aries and Taurus — sparking and building.',duration:'2 weeks'},{id:'t1-2',title:'Week 3–4: Intelligence & Inner Root',desc:'Gemini and Cancer — learning and feeling.',duration:'2 weeks'},{id:'t1-3',title:'Week 5–6: Authority & Correction',desc:'Leo and Virgo — expressing and refining.',duration:'2 weeks'},{id:'t1-4',title:'Week 7–8: Balance & Transformation',desc:'Libra and Scorpio — relating and transforming.',duration:'2 weeks'},{id:'t1-5',title:'Week 9–10: Expansion & Mastery',desc:'Sagittarius and Capricorn — reaching and achieving.',duration:'2 weeks'},{id:'t1-6',title:'Week 11–12: Liberation & Dissolution',desc:'Aquarius and Pisces — liberating and dissolving.',duration:'2 weeks'}] },
  { level:'interpreter',title:'Level 3 — Interpreter (8 Weeks)',modules:[{id:'t2-1',title:'The Four Micro-States',desc:'Initiation → Expansion → Contraction → Integration.',duration:'2 weeks'},{id:'t2-2',title:'The 48 Pattern States',desc:'Deep dive into every phase × micro-state combination.',duration:'3 weeks'},{id:'t2-3',title:'Reading Sequences',desc:'How patterns chain and create compound curriculum.',duration:'2 weeks'},{id:'t2-4',title:'Structure & Rhythm Analysis',desc:'Lens 2 and 4 mastery.',duration:'1 week'}] },
  { level:'practitioner',title:'Level 4 — Practitioner (4 Weeks)',modules:[{id:'t3-1',title:'The Six Traditions',desc:'Ifá, Kabbalah, I Ching, Scripture, Buddhism, Hermetic philosophy.',duration:'2 weeks'},{id:'t3-2',title:'Aligned Action Practice',desc:'Moving from recognition to conscious participation.',duration:'1 week'},{id:'t3-3',title:'Certification Preparation',desc:'Assessment prep and mastery demonstration.',duration:'1 week'}] },
  { level:'guide',title:'Level 5 — Guide',modules:[{id:'t4-1',title:'Practitioner Readings for Others',desc:'Ethics, precision, responsibility.',duration:'2 weeks'},{id:'t4-2',title:'Facilitating Attunement Circles',desc:'Leading weekly gatherings.',duration:'2 weeks'},{id:'t4-3',title:'Vision Reading & Pattern Coaching',desc:'Helping others read reality.',duration:'2 weeks'}] },
];


// ── Lesson Content (keyed by module id) ──────────────────────
const LESSONS = {
  't0-1':{ intro:'Pattern Literacy is the discipline of reading reality at the level beneath events. Before you can change anything, you must learn to see what is actually happening — not the surface incident, but the structure producing it.',
    objectives:['Define Pattern Literacy and why it differs from positive thinking or prediction','Name the five layers of reality','Recognize the difference between an event and a pattern'],
    sections:[
      {h:'Why events mislead us',p:'Most people live at the level of events — isolated incidents that seem to arrive randomly. A missed promotion. A failed relationship. A sudden opportunity. Treated as one-offs, events generate reaction: blame, anxiety, celebration, despair. Pattern Literacy begins by refusing the premise that events are isolated. They are surface expressions of something deeper.'},
      {h:'The five layers',p:'Reality can be read at five depths. Events are the visible surface. Beneath them, Rhythm governs timing and cycles. Beneath rhythm, Pattern names what repeats. Beneath pattern, Structure is the architecture generating the repetition. And beneath structure is Intelligent Order — the coherence that makes the whole thing legible at all. To read reality is to descend through these layers.'},
      {h:'From reaction to participation',p:'The goal is not to predict the future like a fortune teller. It is to participate wisely in its creation. When you can read the pattern, you stop fighting symptoms and start working with causes. This is the shift from reaction to participation — the entire purpose of this curriculum.'},
    ],
    concepts:[{t:'Event',d:'A single, visible manifestation in experience.'},{t:'Pattern',d:'A recurring form produced by an underlying structure.'},{t:'Intelligent Order',d:'The source of coherence that makes reality intelligible.'}],
    exercise:{title:'First observation',steps:['Recall one event from the past week that felt frustrating or surprising.','Ask: have I seen something like this before? When?','Resist explaining it. Just note whether it rhymes with anything in your past.'],reflection:'Describe the event and any echo of it you noticed. Do not analyze yet — just observe.'},
    closing:'You have begun. Observation before reaction is the first value of this community — and the first skill of a pattern reader.' },

  't0-2':{ intro:'The twelve phases are the archetypal stages every process moves through — a person, a project, a relationship, a civilization. Learning their felt-experience names gives you a vocabulary for where you are in any cycle.',
    objectives:['Name the twelve phases in sequence','Understand that phases are stages of development, not personality types','Begin locating your own current phase'],
    sections:[
      {h:'A cycle, not a category',p:'The twelve phases are often mapped to zodiacal signs, but they are not about astrology or fixed identity. They describe movement. Every undertaking passes through Ignition, Foundation, Intelligence, Inner Root, Authority, Correction, Balance, Transformation, Expansion, Structure, Liberation, and Dissolution — then begins again. You are not one phase. You are always somewhere on the wheel.'},
      {h:'The arc of a cycle',p:'The first quarter establishes (spark, ground, learn, feel). The second expresses and refines (show, correct, relate). The third deepens and transforms (release, find meaning, build). The final quarter completes (free, dissolve, return). Recognizing the arc tells you whether to push, refine, release, or rest.'},
      {h:'Why naming matters',p:'When you can name the phase, you stop misreading it. Dissolution feels like failure if you have no name for it; named, it is recognized as completion. Transformation feels like destruction; named, it is composting. The vocabulary itself is a form of relief.'},
    ],
    concepts:[{t:'Phase',d:'One of twelve archetypal stages in any developmental cycle.'},{t:'The wheel',d:'The full twelve-phase cycle that repeats at every scale.'},{t:'Felt-experience name',d:'The human-experience label (e.g. Ignition) layered over the traditional sign.'}],
    exercise:{title:'Locate yourself',steps:['Read the twelve phase names on the Phase Wisdom page.','Notice which one produces a flicker of recognition right now.','Set your current phase on your Profile.'],reflection:'Which phase feels closest to your present moment, and why?'},
    closing:'You now hold the map. The Phase Wisdom section is where you will study each stop on the wheel in depth.' },

  't0-3':{ intro:'A pattern reading is a structured descent through the five layers, applied to a real situation in your life. This lesson walks you through your first guided reading.',
    objectives:['Run a five-layer reading on a real situation','Distinguish what you observe from what you interpret','Produce one aligned action'],
    sections:[
      {h:'Choose the situation',p:'Pick something live — a recurring tension, a decision you face, a relationship that keeps producing the same dynamic. Specificity matters. "My career" is too broad. "I keep taking on work I resent" is readable.'},
      {h:'Descend the layers',p:'Start at the Event: what specifically happened? Then Rhythm: what phase or timing is this part of? Then Pattern: what is repeating? Then Structure: what belief, incentive, or relationship is producing the repetition? Finally Intelligent Order: what larger principle (growth, balance, transformation) is at work? Write one line for each.'},
      {h:'Surface the aligned action',p:'A reading is incomplete until it produces participation. Given what the structure is, what is one action that moves with reality rather than against it? Not a resolution to try harder — a move that addresses the structure.'},
    ],
    concepts:[{t:'Reading',d:'A structured descent through the five layers applied to one situation.'},{t:'Aligned action',d:'A response that works with the underlying structure rather than the surface event.'}],
    exercise:{title:'Your first full reading',steps:['Name one specific, recurring situation.','Write one line at each of the five layers: Event, Rhythm, Pattern, Structure, Intelligent Order.','Name one aligned action.'],reflection:'Record your five-layer reading and the aligned action it revealed.'},
    closing:'This is the core move of the entire practice. Everything that follows deepens your ability to read each layer with precision.' },

  't0-4':{ intro:'The Five Lenses are the practical tool of Pattern Literacy — five questions you can ask of any situation to read it at each depth. Master the questions and you can read anything.',
    objectives:['Recall the five lens questions','Apply each lens to a single situation','Understand how the lenses stack from surface to source'],
    sections:[
      {h:'Five questions, five depths',p:'Each lens is a question. Intelligent Order: what larger principle is operating? Structure: what architecture is creating this? Pattern: what is repeating? Rhythm: what phase am I in? Events: what specifically am I observing? Asked in order from the surface down, they take you from incident to source.'},
      {h:'The lenses are portable',p:'Unlike a one-time reading, the lenses travel with you. In a tense meeting, you can silently ask "what is repeating here?" Walking home, "what phase is this relationship in?" The lenses turn ordinary life into continuous practice.'},
      {h:'Resisting the leap to judgment',p:'The discipline is to move through the lenses before reacting. Most people leap from Event straight to judgment. The lenses insert depth between stimulus and response — which is precisely where wisdom lives.'},
    ],
    concepts:[{t:'Lens',d:'A diagnostic question that reads reality at one of the five layers.'},{t:'Stacking',d:'Asking the lenses in sequence to descend from event to source.'}],
    exercise:{title:'Five lenses on one moment',steps:['Choose any situation from today.','Write a one-sentence answer to each of the five lens questions.','Notice which lens was hardest to answer — that is your growth edge.'],reflection:'Apply all five lenses to one situation and note which lens was hardest.'},
    closing:'You can practice the lenses every day from this point forward. Toggle to "The Five Lenses" tab above any time you need the questions.' },
};

Object.assign(LESSONS, {
  't1-1':{ intro:'The cycle opens with Ignition and Foundation — the courage to begin and the patience to build. Together they teach that a real start requires both the spark and the ground to hold it.',
    objectives:['Distinguish genuine impulse from restless impulsiveness','Recognize when a beginning needs grounding before momentum','Read the Ignition→Foundation transition in your own life'],
    sections:[
      {h:'Ignition: the intelligence of the seed',p:'Ignition is raw impulse meeting reality. It is not recklessness — it is the seed breaking soil. The reader\'s task is to tell the difference between an impulse that carries a future and one that is merely agitation. The test is whether you are willing to sustain what you start.'},
      {h:'Foundation: making it real',p:'What was sparked must be given ground. Foundation is the patient devotion to form — staying with something long enough for it to take root. The shadow is stubbornness mistaken for commitment; the gift is letting a thing become what it is meant to be.'},
      {h:'Reading the transition',p:'Many cycles fail in the gap between these two phases: people ignite repeatedly and never lay foundation, or they cling to old foundations and never ignite. Reading the transition means asking: do I need to start, or to stay?'},
    ],
    concepts:[{t:'Ignition',d:'The phase of courageous beginning and raw impulse.'},{t:'Foundation',d:'The phase of patient grounding that makes a beginning real.'}],
    exercise:{title:'Spark and ground',steps:['Name one thing you keep starting but never grounding.','Name one thing you are grounding past its life.','Choose which phase you actually need this week.'],reflection:'Where do you need Ignition, and where do you need Foundation?'},
    closing:'A cycle well begun is half its work. Next you will learn how the mind opens and descends into feeling.' },

  't1-2':{ intro:'Intelligence and Inner Root move the cycle from the mind to the body. First the mind opens to connection; then knowledge must be felt before it can guide.',
    objectives:['Distinguish information from understanding','Recognize when knowledge has not yet become felt-truth','Read the descent from head to heart'],
    sections:[
      {h:'Intelligence: seeing connections',p:'After foundation, the structure needs the capacity to adapt and communicate. Intelligence is not accumulation of facts — it is seeing the connection between things that appear separate. The shadow is scattered attention; the gift is pattern recognition across domains.'},
      {h:'Inner Root: felt-truth',p:'Intelligence that has not been felt is incomplete. Inner Root is where knowledge descends into the body. Until information becomes felt-truth — something you know in the chest, not just the head — it cannot reliably guide action.'},
      {h:'The reader\'s descent',p:'Reading this pair means noticing where you "know" something intellectually but have not let yourself feel it. That gap is where most stalled change lives.'},
    ],
    concepts:[{t:'Intelligence',d:'The phase of learning, connection, and adaptive communication.'},{t:'Inner Root',d:'The phase where knowledge becomes felt-truth in the body.'},{t:'Felt-truth',d:'Knowledge that has descended from intellect into embodied conviction.'}],
    exercise:{title:'Head and heart',steps:['Name one truth you understand but have not felt.','Sit with it for two minutes without explaining it.','Notice where in your body it registers — or does not.'],reflection:'What do you know intellectually but have not yet allowed yourself to feel?'},
    closing:'Felt knowledge is the only knowledge that moves you. Next: expression and refinement.' },

  't1-3':{ intro:'Authority and Correction govern expression and its refinement. First you risk being seen; then you refine what you have shown with the intelligence of precision.',
    objectives:['Understand authority as authorship rather than dominance','Distinguish correction from criticism','Read the cycle of expression and refinement'],
    sections:[
      {h:'Authority: the courage to be seen',p:'Authority here means authorship — standing behind what you have built, learned, and felt, without needing applause or hiding from visibility. The shadow is performance without substance; the gift is being visible and accountable.'},
      {h:'Correction: love expressed as craft',p:'After boldness comes humility. Correction is discernment, not self-attack: what works, what does not, where intention and execution diverge. The shadow is perfectionism that prevents completion; the gift is refining without destroying.'},
      {h:'The reader\'s balance',p:'Read this pair by asking whether you are stuck hiding (needing Authority) or stuck endlessly polishing (trapped in Correction\'s shadow). Each calls for the opposite medicine.'},
    ],
    concepts:[{t:'Authority',d:'The phase of authentic expression and accountable visibility.'},{t:'Correction',d:'The phase of refinement through discernment, not criticism.'}],
    exercise:{title:'Show and refine',steps:['Name one thing you have been hiding.','Name one thing you have been over-refining instead of finishing.','Choose one to act on this week.'],reflection:'Where do you need to be more visible, and where do you need to stop polishing and finish?'},
    closing:'Expression and refinement are partners. Next: relationship and transformation.' },

  't1-4':{ intro:'Balance and Transformation take the cycle into relationship and then into depth. First you find right proportion with others; then you release what cannot survive.',
    objectives:['Understand balance as right proportion, not equal distribution','Recognize transformation as composting, not destruction','Read what is ending in order to honor it'],
    sections:[
      {h:'Balance: right relationship',p:'Balance is where self meets other and seeks harmony — not equal split, but right proportion. Justice and beauty are structural necessities, not luxuries. The shadow is people-pleasing disguised as harmony; the gift is holding two truths without collapsing into one.'},
      {h:'Transformation: the intelligence of release',p:'This is the phase most resisted and most needed. It asks what must die so that what is real can live. It is not destruction but composting — old patterns become fuel. But you must be willing to let go completely.'},
      {h:'Honoring endings',p:'Reading this pair means recognizing a death you have not yet honored. Naming the ending is what allows the regeneration that follows.'},
    ],
    concepts:[{t:'Balance',d:'The phase of right proportion in relationship.'},{t:'Transformation',d:'The phase of release and regeneration.'}],
    exercise:{title:'Proportion and release',steps:['Name one relationship that needs recalibration.','Name one thing that has already ended that you are still holding.','Write down what releasing it would make room for.'],reflection:'What are you holding onto that has already ended?'},
    closing:'What you release becomes fuel. Next: meaning and the building of structure.' },

  't1-5':{ intro:'Expansion and Mastery turn survival into meaning and meaning into form. First vision returns; then it must be built into achievement that endures.',
    objectives:['Recognize how experience becomes teaching','Understand mastery as durable, serving achievement','Read the move from vision to durable form'],
    sections:[
      {h:'Expansion: experience becomes wisdom',p:'After transformation, vision reaches outward toward meaning. Having survived, you ask what this means — not only for you but for the whole. This is where suffering becomes teaching. The shadow is preaching without practice; the gift is finding meaning in difficulty.'},
      {h:'Mastery: building what endures',p:'Vision must take durable form. Mastery is the patient building of achievement that serves: a vision that cannot be built into form cannot serve beyond the individual. The shadow is rigidity and ambition disconnected from service; the gift is building something that outlasts enthusiasm.'},
      {h:'The reader\'s question',p:'Read this pair by asking whether you have a meaning without a vessel, or a vessel that has lost its meaning. Each needs the other phase.'},
    ],
    concepts:[{t:'Expansion',d:'The phase where experience becomes meaning and teaching.'},{t:'Mastery',d:'The phase where vision becomes durable, serving achievement.'}],
    exercise:{title:'Meaning into form',steps:['Name the biggest lesson of your past year.','Name one structure that could carry it forward.','Sketch a first 90-day step.'],reflection:'What meaning are you ready to build into something that endures?'},
    closing:'Meaning without form dissipates. Next: the freeing and the dissolving that complete the cycle.' },

  't1-6':{ intro:'Liberation and Dissolution complete the wheel. First structure is freed from what no longer serves; then everything dissolves back to source before the next beginning.',
    objectives:['Recognize when a structure has become a cage','Understand dissolution as completion, not failure','Read the close of a cycle and the rest it requires'],
    sections:[
      {h:'Liberation: when structure must evolve',p:'Structure must serve freedom. Liberation is the intelligence that knows when a system has become a constraint — when rules have outlived their purpose. The shadow is rebellion without purpose; the gift is evolving systems without destroying what they serve.'},
      {h:'Dissolution: trusting completion',p:'The cycle returns to the field it came from. Dissolution is not loss but completion — the rhythm honoring its own close. Rest belongs here. The next ignition is already forming. The shadow is escapism or refusing to let a cycle end; the gift is surrender and trust.'},
      {h:'Reading the close',p:'Most people resist endings and exhaust themselves. Reading this pair means recognizing what is genuinely complete and allowing the rest that precedes renewal.'},
    ],
    concepts:[{t:'Liberation',d:'The phase of freeing a system that has become a constraint.'},{t:'Dissolution',d:'The phase of completion and return to source.'}],
    exercise:{title:'Free and complete',steps:['Name one rule or routine that has outlived its purpose.','Name one cycle that is genuinely complete.','Give yourself one permission to rest this week.'],reflection:'What cycle is completing, and what would it mean to honor its ending?'},
    closing:'You have walked the full wheel. As Reader, you can now recognize every phase. The Interpreter level teaches the rhythm within each phase.' },
});

Object.assign(LESSONS, {
  't2-1':{ intro:'Each phase contains four micro-states — Initiation, Expansion, Contraction, Integration — a rhythm within the rhythm. This is the first move from recognition toward precision.',
    objectives:['Name the four micro-states and their felt quality','Locate the micro-state within your current phase','Understand the rhythm-within-rhythm principle'],
    sections:[
      {h:'The rhythm within',p:'A phase is not a flat state. It breathes. Initiation is the spark of the phase; Expansion is its growth; Contraction is the tension that demands refinement; Integration is its completion and harvest. Knowing your micro-state tells you whether to push, refine, or consolidate.'},
      {h:'Why precision matters',p:'Two people in the same phase can need opposite advice depending on micro-state. One in Expansion should accelerate; one in Contraction should refine. The Interpreter learns to read this second layer of timing.'},
    ],
    concepts:[{t:'Micro-state',d:'One of four sub-phases (Initiation, Expansion, Contraction, Integration) within every phase.'},{t:'Rhythm within rhythm',d:'The principle that each phase contains its own four-beat cycle.'}],
    exercise:{title:'Find your beat',steps:['Identify your current phase.','Read the four micro-state descriptions on the Rhythm Calendar.','Set your current micro-state on your Profile.'],reflection:'Which micro-state are you in, and what does it ask of you — push, refine, or consolidate?'},
    closing:'You now read two layers of timing at once. Next: the full grid of pattern states.' },

  't2-2':{ intro:'Twelve phases times four micro-states yields forty-eight pattern states — the full vocabulary of where any process can be. This lesson surveys the grid.',
    objectives:['Understand the 48-state grid','Read a specific phase × micro-state combination','Use the grid to locate precise positions'],
    sections:[
      {h:'The grid',p:'Each of the twelve phases passes through four micro-states, producing forty-eight distinct configurations. A combination like "Transformation · Contraction" describes a very specific moment: the tension point within a phase of release. The grid is the Interpreter\'s periodic table.'},
      {h:'Reading a cell',p:'To read a cell, hold the phase\'s theme and the micro-state\'s movement together. Foundation · Initiation is the first act of grounding; Foundation · Integration is a foundation completing and ready to bear weight. Same phase, different instruction.'},
    ],
    concepts:[{t:'Pattern state',d:'A specific phase × micro-state combination; one of 48.'},{t:'The grid',d:'The full map of all 48 pattern states.'}],
    exercise:{title:'Read three cells',steps:['Pick your current phase × micro-state.','Pick the one just before and just after it in the micro-state cycle.','Describe how the instruction shifts across the three.'],reflection:'Describe your current pattern state and the two adjacent to it.'},
    closing:'With the grid, your readings gain resolution. Next: how states chain into sequences.' },

  't2-3':{ intro:'Patterns rarely occur alone. They chain, overlap, and compound — producing the curriculum a life keeps teaching. The Interpreter learns to read sequences, not just snapshots.',
    objectives:['Recognize how pattern states chain over time','Identify overlapping patterns operating at once','Read a compound curriculum'],
    sections:[
      {h:'Chains',p:'One pattern state flows into the next. Reading a sequence means tracking the movement — where you have been, where you are, where the rhythm is carrying you. A snapshot misleads; the chain reveals direction.'},
      {h:'Overlap and compound curriculum',p:'You are usually in several cycles at once — a career cycle, a relationship cycle, an inner cycle — each at a different phase. When they overlap, life delivers a compound curriculum. The Interpreter learns to separate the strands and read each.'},
    ],
    concepts:[{t:'Sequence',d:'A chain of pattern states unfolding over time.'},{t:'Compound curriculum',d:'The combined lesson of several overlapping cycles.'}],
    exercise:{title:'Trace a strand',steps:['Choose one area of life (work, a relationship, health).','Trace its phase movement over the past year.','Name the direction the rhythm is carrying it.'],reflection:'Trace one cycle across the past year and name where its rhythm is heading.'},
    closing:'You can now read motion, not just position. Next: mastery of the Structure and Rhythm lenses.' },

  't2-4':{ intro:'Lens 2 (Structure) and Lens 4 (Rhythm) are the Interpreter\'s specialty — the why beneath the pattern and the when of its movement.',
    objectives:['Apply the Structure lens to find root architecture','Apply the Rhythm lens to read developmental timing','Combine both to explain why a pattern exists and persists'],
    sections:[
      {h:'Structure: the why',p:'The Structure lens asks what architecture produces the pattern — beliefs, incentives, relationships, habits, cultural assumptions. A pattern persists because a structure rewards it. Change the structure and the pattern changes; fight the pattern alone and it returns.'},
      {h:'Rhythm: the when',p:'The Rhythm lens asks what phase of development is operating. The same action lands differently in different phases. Mastering rhythm means timing action to the moment\'s quality rather than forcing it.'},
    ],
    concepts:[{t:'Structure lens',d:'The question of what architecture creates a situation.'},{t:'Rhythm lens',d:'The question of what developmental phase is operating.'}],
    exercise:{title:'Why and when',steps:['Take a pattern you keep living.','Name the structure rewarding it (Lens 2).','Name the phase it is in (Lens 4).'],reflection:'For one recurring pattern, name the structure that sustains it and the phase it is in.'},
    closing:'You can now answer why a pattern exists. The Practitioner level turns reading into aligned action.' },

  't3-1':{ intro:'Six wisdom traditions — Ifá, Kabbalah, I Ching, Scripture, Buddhism, and Hermetic philosophy — independently arrived at pattern literacy. Studying them deepens and validates the framework.',
    objectives:['Understand how each tradition encodes pattern reading','Connect at least three traditions to the five-layer model','Locate the framework within a longer lineage'],
    sections:[
      {h:'Ancient pattern technologies',p:'Ifá\'s Odù, Kabbalah\'s Sefirot, the I Ching\'s hexagrams, Scripture\'s covenant cycles, Buddhism\'s dependent origination, and Hermetic correspondence are all systems for reading reality beneath events. The framework is not invention but synthesis.'},
      {h:'Why the convergence matters',p:'When six independent traditions describe the same structure, you are likely looking at something real about how reality is organized. Practitioners study the traditions to enrich their readings and to practice humility before a long lineage.'},
    ],
    concepts:[{t:'Convergence',d:'The independent arrival of many traditions at pattern literacy.'},{t:'Lineage',d:'The ancestry of wisdom the framework synthesizes.'}],
    exercise:{title:'Find the echo',steps:['Read one Wisdom Track in full.','Identify which of the five layers it most illuminates.','Note one idea you will carry into your own readings.'],reflection:'Which tradition most clarified the framework for you, and what will you carry from it?'},
    closing:'You stand in a long lineage. Next: turning recognition into aligned action.' },

  't3-2':{ intro:'Recognition is not enough. The Practitioner converts reading into conscious participation — moving with reality rather than merely understanding it.',
    objectives:['Define aligned action precisely','Distinguish aligned action from mere effort','Build an aligned-action practice'],
    sections:[
      {h:'From seeing to moving',p:'A perfect reading that changes nothing is incomplete. Aligned action addresses the structure, honors the phase, and works with Intelligent Order rather than against it. It is rarely "try harder"; it is "act differently, in time with the rhythm."'},
      {h:'The discipline of timing',p:'Aligned action is as much about when as what. Initiation-phase action differs from Integration-phase action. The Practitioner learns to wait without passivity and to act without force.'},
    ],
    concepts:[{t:'Aligned action',d:'Conscious participation that works with structure, phase, and order.'},{t:'Active patience',d:'Waiting that is attentive and ready, not passive.'}],
    exercise:{title:'One aligned move',steps:['Take a current reading.','Design one action that addresses the structure, not the symptom.','Time it to the present phase.'],reflection:'Name one aligned action and explain why its timing fits the current phase.'},
    closing:'You are practicing participation. Next: preparing for certification.' },

  't3-3':{ intro:'Certification confirms you can read reliably and act wisely. This module prepares you through case studies and a mastery demonstration.',
    objectives:['Review the assessment structure','Practice a full case-study reading','Identify your remaining growth edges'],
    sections:[
      {h:'What is assessed',p:'Certification evaluates precision of reading (can you descend all five layers?), soundness of aligned action, and ethical clarity. It is not a memory test; it is a demonstration of literacy.'},
      {h:'Case-study practice',p:'You will read several real situations end to end, defending your structure and rhythm analysis and proposing aligned action. Mastery shows in nuance — recognizing compound curricula and timing.'},
    ],
    concepts:[{t:'Mastery demonstration',d:'A live, end-to-end reading defended before assessors.'},{t:'Growth edge',d:'The lens or skill that remains hardest for you.'}],
    exercise:{title:'Mock reading',steps:['Choose a situation that is not your own.','Run a full five-layer reading and propose aligned action.','Name the part you found hardest.'],reflection:'Complete a full reading of a situation that is not yours, and name your growth edge.'},
    closing:'When you can read clearly for yourself and others, the Guide level opens — where you learn to serve.' },

  't4-1':{ intro:'Guides read for others. This carries ethical weight: precision, humility, and responsibility for the trust placed in you.',
    objectives:['Understand the ethics of reading for others','Practice holding a reading without imposing it','Recognize the limits of your role'],
    sections:[
      {h:'The reader\'s ethics',p:'Reading for another is an act of service, not authority over them. A Guide offers the reading as a mirror, never a verdict. The person remains the author of their own life; the Guide illuminates the structure and steps back.'},
      {h:'Precision and humility together',p:'The temptation is to perform certainty. The discipline is to hold a precise reading lightly — confident in method, humble about conclusions. You can be wrong; the framework still serves if you stay honest.'},
    ],
    concepts:[{t:'Mirror, not verdict',d:'Offering a reading the other can accept, refuse, or revise.'},{t:'Reader\'s ethics',d:'The responsibilities of reading on another\'s behalf.'}],
    exercise:{title:'Hold it lightly',steps:['With consent, offer one person a single-lens observation.','Phrase it as a question, not a conclusion.','Notice the urge to be right, and release it.'],reflection:'Describe an offering you made as a mirror rather than a verdict, and what you noticed in yourself.'},
    closing:'Service begins with restraint. Next: facilitating the Attunement Circle.' },

  't4-2':{ intro:'The weekly Attunement Circle is the community\'s living practice. Guides learn to hold its structure so the group can read together.',
    objectives:['Internalize the five-segment circle structure','Hold space without dominating it','Guide a group from event to aligned action'],
    sections:[
      {h:'Holding the structure',p:'The circle moves through Opening, Pattern Reading, Framework Exploration, Wisdom Dialogue, and Alignment Action. The Guide keeps time and tends the arc, ensuring the group descends the layers together and ends in committed action.'},
      {h:'Facilitation as service',p:'A good facilitator is nearly invisible. You protect the container, invite the quiet voices, and resist filling silence. The group does the reading; you tend the conditions.'},
    ],
    concepts:[{t:'The container',d:'The safe, time-kept space the facilitator protects.'},{t:'Alignment Action',d:'The closing commitment each member makes for the week.'}],
    exercise:{title:'Run one segment',steps:['Choose one circle segment.','Prepare how you would open and close it within its time.','Practice one prompt that invites rather than directs.'],reflection:'Which circle segment will you practice facilitating, and how will you keep it spacious?'},
    closing:'You can hold the room. Final module: vision reading and pattern coaching.' },

  't4-3':{ intro:'The Guide\'s highest craft is helping others read their own reality and make aligned decisions — vision reading and pattern coaching.',
    objectives:['Help another locate their phase and structure','Coach toward aligned action without prescribing it','Read longer arcs and emerging vision'],
    sections:[
      {h:'Vision reading',p:'Beyond the immediate situation lies the longer arc — where a life or project is genuinely heading. Vision reading helps a person see the trajectory their patterns are tracing, so they can participate in it consciously.'},
      {h:'Pattern coaching',p:'Coaching turns insight into movement over time. The Guide returns to the same person across cycles, tracking sequences and supporting aligned action without taking authorship away. This is the full flowering of the practice — reading reality in service of another\'s freedom.'},
    ],
    concepts:[{t:'Vision reading',d:'Reading the longer arc a person\'s patterns are tracing.'},{t:'Pattern coaching',d:'Supporting aligned action across cycles over time.'}],
    exercise:{title:'Read the arc',steps:['With one person\'s consent, listen for the longer trajectory beneath their immediate concern.','Reflect the arc back as a possibility.','Ask what one aligned step it suggests.'],reflection:'Describe a longer arc you helped someone see, and the aligned step it suggested.'},
    closing:'You have completed the curriculum. The work now is the practice — and the people you will help read reality.' },
});


// ── Lens Detail Content (keyed by lens id) ───────────────────
const LENS_DETAIL = {
  'intelligent-order':{ essence:'The deepest lens. It asks what coherent principle the whole situation is expressing — growth, balance, transformation. It rests on the founding belief that reality is intelligible, and that even difficulty carries instruction.',
    reveals:'The meaning and direction beneath everything else — why the pattern exists at all.',
    sections:[
      {h:'The assumption of coherence',p:'This lens stands on the first conviction of the community: reality is intelligible. Nothing you face is purely random noise — situations express principles. To read this lens is to ask which principle is being served by what is happening, rather than treating events as meaningless accident.'},
      {h:'Principle, not platitude',p:'It is easy to drape "everything happens for a reason" over a hard situation. This lens demands more precision than that. Is the operating principle growth? Balance? Stewardship? Naming the exact principle is what turns vague comfort into actionable clarity — it tells you how to respond.'},
    ],
    examples:[
      {t:'Growth',d:'The situation is stretching your capacity. Discomfort signals expansion, not damage.'},
      {t:'Balance',d:'Forces have fallen out of proportion and are seeking equilibrium.'},
      {t:'Adaptation',d:'Conditions changed; the situation is demanding a new form from you.'},
      {t:'Transformation',d:'Something must end so that something truer can be born.'},
      {t:'Stewardship',d:'You are being asked to tend and care for something, not to own or control it.'},
      {t:'Integration',d:'Separate parts of your life are being asked to become whole.'},
    ],
    pitfall:'Using this lens to bypass real feeling or to spiritualize harm — "it was meant to be." Intelligent Order names a principle; it never excuses injustice or suppresses grief. Hold it alongside honest emotion, not instead of it.',
    worked:{situation:'A project I loved collapsed.',read:'The operating principle is not punishment — it is Transformation. Something I was clinging to had to end so that capacity could be freed for what is forming next.'},
    practice:{title:'Name the principle',steps:['Choose one current difficulty.','List which of the six principles might be operating.','Choose the one that produces both relief and responsibility.'],reflection:'Which principle is operating in your situation, and how does naming it change your response?'} },

  'structure':{ essence:'Structure is the architecture — beliefs, incentives, relationships, habits — that produces patterns. Change the structure and the pattern changes; fight the pattern alone and it returns unchanged.',
    reveals:'Why a pattern persists — the machinery quietly generating it.',
    sections:[
      {h:'Patterns are outputs',p:'A recurring pattern is never the root cause. It is the output of a structure that rewards it. The structure is usually invisible precisely because it feels like "just how things are" — which is exactly why it keeps producing the same result.'},
      {h:'Where to look',p:'Structures hide in six common places: belief systems, incentives, relationships, habits, organizational design, and cultural assumptions. Reading this lens means scanning these six and asking which one is quietly manufacturing the repetition you keep living.'},
    ],
    examples:[
      {t:'Belief systems',d:'What you assume is true shapes what you allow yourself to do.'},
      {t:'Incentives',d:'Behavior follows reward, often in ways you never consciously chose.'},
      {t:'Relationships',d:'Roles and dynamics reproduce themselves until someone changes the script.'},
      {t:'Habits',d:'Automated behavior runs the structure on autopilot, below awareness.'},
      {t:'Organizational design',d:'How a system is built determines what it reliably produces.'},
      {t:'Cultural assumptions',d:'The water you do not notice you are swimming in.'},
    ],
    pitfall:'Mistaking a person for a structure — blaming an individual when the architecture would produce the same result with anyone in that seat. Ask whether the role, not the person, is generating the pattern.',
    worked:{situation:'I keep taking on work I resent.',read:'The structure is not my workload. It is a belief ("saying no makes me unsafe") paired with an incentive (praise for over-delivering). Until the belief changes, any new boundary I set will quietly collapse.'},
    practice:{title:'Find the architecture',steps:['Take a pattern you keep living.','List the candidate structures: belief, incentive, relationship, habit, design, culture.','Name the one that, if changed, would dissolve the pattern.'],reflection:'What structure sustains your pattern, and what is one change you could make to it?'} },

  'pattern':{ essence:'Pattern is the lens of recognition. It names what recurs across events — the rhyme beneath the noise. Seeing the pattern is the moment a string of separate incidents becomes one legible thing.',
    reveals:'The recurring form — what your events have in common.',
    sections:[
      {h:'From incident to recognition',p:'A single event is just data. By the third occurrence, you can name a pattern. This lens asks you to gather the instances and look for the shape they share, rather than reacting to each one as if it were the first.'},
      {h:'Patterns are neutral',p:'Patterns are not good or bad — they are information. A repeating opportunity is as much a pattern as a repeating conflict, and both point to an underlying structure worth reading. Resist the urge to judge the pattern before you have named it precisely.'},
    ],
    examples:[
      {t:'Recurring conflicts',d:'The same fight wearing different costumes each time.'},
      {t:'Repeating opportunities',d:'Doors that keep opening in one particular direction.'},
      {t:'Cycles of success',d:'The conditions under which you reliably thrive.'},
      {t:'Cycles of failure',d:'The conditions under which you reliably stall.'},
    ],
    pitfall:'Pattern-matching too quickly — forcing unrelated events into a tidy story. A real pattern survives the question "what specifically is the same across all of these?"',
    worked:{situation:'Three relationships ended the same way.',read:'The repeating form is not the people — it is a sequence: intense start, my over-accommodation, slow resentment, withdrawal. That named sequence is what I take down to the Structure lens next.'},
    practice:{title:'Collect the instances',steps:['Name three or more events that feel related.','Write the single sentence that is true of all of them.','That sentence is your pattern.'],reflection:'What is the precise repeating form across your instances?'} },

  'rhythm':{ essence:'Rhythm is the lens of timing. It reads where in a developmental cycle you stand, because the same action lands differently in different phases. A great deal of wisdom is simply timing.',
    reveals:'The when — whether to initiate, build, push, release, or rest.',
    sections:[
      {h:'Everything has a phase',p:'Projects, relationships, and inner states all move through developmental phases. Rhythm asks which phase is currently active, so you can act in time with it rather than against it. The twelve phases of the framework are this lens in full detail.'},
      {h:'Timing over force',p:'Most failed effort is well-aimed but badly timed — pushing hard in a phase that calls for rest, or resting in a phase that calls for ignition. Reading rhythm replaces force with alignment, which is why it often feels like everything suddenly gets easier.'},
    ],
    examples:[
      {t:'Initiation',d:'The spark. It is time to begin.'},
      {t:'Building',d:'Foundation. It is time for patient, unglamorous work.'},
      {t:'Expansion',d:'Growth. It is time to reach outward.'},
      {t:'Transition',d:'The turn. It is time to release and adjust.'},
      {t:'Completion',d:'The close. It is time to harvest and rest.'},
    ],
    pitfall:'Treating your current phase as permanent — despairing in Transition as if it will never end, or clinging to Expansion long past its season. No phase is the whole story.',
    worked:{situation:'I am exhausted forcing growth that will not come.',read:'I have misread the phase. This is Transition, not Expansion. The aligned move is to release and let the next ignition form on its own — not to push harder against the season.'},
    practice:{title:'Read the phase',steps:['Choose one area of your life.','Match it to a phase using the Phase Wisdom section.','Name what that phase actually asks for.'],reflection:'What phase are you in, and what does it ask — to initiate, build, push, release, or rest?'} },

  'events':{ essence:'Events is the surface lens — the discipline of clean observation before interpretation. It asks you to describe exactly what happened, without story, so that the deeper lenses have honest data to work with.',
    reveals:'The raw facts — what actually occurred, stripped of interpretation.',
    sections:[
      {h:'Observation before reaction',p:'The first value of the community lives here. Before meaning, before blame, comes a simple question: what specifically occurred? Precise observation is the foundation every other lens stands on. Corrupt it and the whole reading tilts.'},
      {h:'Events become data; patterns become meaning',p:'An event recorded cleanly becomes a data point. Enough clean data reveals a pattern, and pattern reveals structure. But this only works if the events were seen clearly in the first place — which is why this "simplest" lens is the one most people skip and most need.'},
    ],
    examples:[
      {t:'Events become data',d:'Each clean observation is a data point for later pattern reading.'},
      {t:'Patterns become meaning',d:'Once events accumulate, their shape yields meaning — but only if seen clearly first.'},
    ],
    pitfall:'Smuggling interpretation into observation. "She ignored me" is a story; "she did not reply for two days" is an event. Keep the two strictly separate, or every higher lens inherits the distortion.',
    worked:{situation:'My boss disrespected me in the meeting.',read:'That is interpretation. The event is: "In the meeting, my boss interrupted me twice and reassigned my proposal to someone else." Now I can read that cleanly at the higher lenses.'},
    practice:{title:'Strip the story',steps:['Take a charged recent moment.','Write what you would normally say about it — the story.','Rewrite it as only observable events.'],reflection:'Rewrite a charged moment as pure observation, with no interpretation.'} },
};


// (Phase x Lens mapping now derived from PHASES per the Cosmic Reality Framework)

// ── Per-phase detail for each of the five layers (Phases & Lenses) ──
const PHASE_DETAIL = [
  { io:'Reality is opening a new cycle. The deepest intelligence at work is the drive to emerge — the seed\u2019s pressure to break ground before it can see the light.', structure:'The architecture is pure initiation: the capacity to start from nothing, to act before conditions are perfect and proof exists.', pattern:'The recurring form is the fresh start — first moves, first attempts, the unmistakable energy of something new declaring itself.', rhythm:'The tempo is the quickening of birth: sudden, forward, urgent. Energy moves outward faster than thought.', events:'Each is a visible moment where a chapter opens — a fresh start you can point to.' },
  { io:'Reality seeks to stabilize what was begun. The intelligence is preservation — turning a spark into something that can endure.', structure:'The architecture is foundation-building: securing the resources, routines, and ground a beginning needs to stand.', pattern:'The recurring form is establishment — the slow accumulation of substance, value, and reliable form.', rhythm:'The tempo is rooting: deliberate, grounded, unhurried. Movement slows so depth can develop.', events:'Each is the patient, tangible work of making a beginning solid and secure.' },
  { io:'Reality seeks understanding. The intelligence is connection — linking what was built to the wider world of meaning.', structure:'The architecture is learning: the channels of information, language, and exchange through which a thing comes to know itself.', pattern:'The recurring form is exploration — gathering, questioning, comparing, and weaving scattered facts into insight.', rhythm:'The tempo is discovery: quick, curious, darting. Attention moves laterally across many things at once.', events:'Each is a moment of taking in the world — gathering input, contacts, and skill.' },
  { io:'Reality seeks connection. The intelligence is belonging — the descent of knowledge from the mind into felt, emotional ground.', structure:'The architecture is belonging: the emotional foundations, attachments, and sense of home that hold a life together.', pattern:'The recurring form is nurturing — protecting, tending, and caring for what is vulnerable and still forming.', rhythm:'The tempo is bonding: tidal, inward, protective. Movement turns toward shelter and intimacy.', events:'Each is a turn toward closeness, care, and the feeling of home.' },
  { io:'Reality seeks expression. The intelligence is creative authorship — the felt self now asks to be revealed and seen.', structure:'The architecture is creative: the voice, presence, and identity through which something becomes visible to others.', pattern:'The recurring form is self-revelation — the courageous showing of what was privately built and felt.', rhythm:'The tempo is radiance: warm, expansive, outward. Energy shines steadily from a stable center.', events:'Each is a moment of stepping into view and being seen for what you create.' },
  { io:'Reality seeks refinement. The intelligence is discernment — the loving precision that perfects what has been expressed.', structure:'The architecture is optimization: the systems, standards, and processes that turn rough expression into reliable craft.', pattern:'The recurring form is improvement — analyzing, adjusting, and closing the gap between intention and execution.', rhythm:'The tempo is correction: careful, iterative, exacting. Movement is small, deliberate adjustment.', events:'Each is an act of refining the work until it genuinely functions.' },
  { io:'Reality seeks harmony. The intelligence is right proportion — the meeting of self and other in just relationship.', structure:'The architecture is relationship: the agreements, partnerships, and mutual obligations that hold two parties in balance.', pattern:'The recurring form is balancing — weighing, negotiating, and seeking equilibrium between competing needs.', rhythm:'The tempo is reciprocity: back-and-forth, responsive, measured. Movement is the exchange between two.', events:'Each is an encounter where two parties seek fair, workable terms.' },
  { io:'Reality seeks transformation. The intelligence is renewal — what cannot survive the depth is released so what is real can live.', structure:'The architecture is renewal: the dismantling of old structures so new ones can form from their material.', pattern:'The recurring form is death and rebirth — endings that compost into beginnings, intensity that regenerates.', rhythm:'The tempo is metamorphosis: deep, slow, and total. Movement happens beneath the surface, out of sight.', events:'Each is an ending or upheaval that clears the ground for something truer.' },
  { io:'Reality seeks expansion. The intelligence is meaning — personal experience reaching outward to become teaching for the whole.', structure:'The architecture is vision: the belief systems, philosophies, and frameworks that give experience a horizon.', pattern:'The recurring form is exploration — widening, seeking, and translating what was survived into wisdom.', rhythm:'The tempo is adventure: bold, far-reaching, optimistic. Movement is toward the distant and the large.', events:'Each is a reach beyond the familiar toward meaning and horizon.' },
  { io:'Reality seeks mastery. The intelligence is stewardship — vision taking durable, serving form that outlasts the individual.', structure:'The architecture is achievement: the institutions, systems, and disciplines that turn meaning into lasting form.', pattern:'The recurring form is institution-building — the patient construction of what endures beyond enthusiasm.', rhythm:'The tempo is ascension: steady, climbing, disciplined. Movement is the long, deliberate ascent.', events:'Each is a step in the long climb toward durable achievement and standing.' },
  { io:'Reality seeks evolution. The intelligence is innovation — systems must be freed and reinvented so they can keep breathing.', structure:'The architecture is innovation: the reform of existing structures from within, the redesign of what has calcified.', pattern:'The recurring form is reformation — questioning convention, breaking outworn rules, and inventing new ones.', rhythm:'The tempo is breakthrough: sudden, electric, discontinuous. Movement leaps rather than flows.', events:'Each is a break from convention that reinvents how things are done.' },
  { io:'Reality seeks integration. The intelligence is wholeness — everything returns to the source from which it came.', structure:'The architecture is completion: structures soften and dissolve, boundaries blur, and form releases its hold.', pattern:'The recurring form is surrender — letting go, forgiving, and allowing a cycle to genuinely end.', rhythm:'The tempo is dissolution: slow, fading, receding. Movement is the quiet ebb before the next tide.', events:'Each is a release — a quiet closing that completes the cycle.' },
];
// ── Wisdom Track module content (keyed by module id) ──
const WISDOM_LESSONS = {
  'ifa-1':{ intro:'Ifá is the sacred divination and wisdom system of the Yoruba people of West Africa — among the oldest continuously practiced systems of organized knowledge on earth. It reads reality through sacred patterns called Odù.',
    objectives:['Understand Ifá\u2019s origins and worldview','Recognize the role of the babaláwo, the trained diviner','See why Ifá matters to Pattern Literacy'],
    sections:[
      {h:'A living tradition',p:'Ifá originates with the Yoruba of present-day Nigeria, Benin, and Togo, and crossed the Atlantic into Cuba, Brazil, and beyond through the diaspora. It is practiced by trained priests known as babaláwo — \u201cfathers of secrets\u201d — and has been recognized by UNESCO as an intangible cultural heritage of humanity.'},
      {h:'Reality as intelligible',p:'Ifá holds that existence is ordered and legible — that a person can consult the patterns of reality to understand their situation and act in harmony with it. This conviction, that reality is intelligible and can be read, is the same foundation Pattern Literacy rests on.'},
      {h:'A note of respect',p:'We approach Ifá as students and guests, not as initiates. This module introduces its concepts with care and points always toward its own lineage-holders for genuine practice.'},
    ],
    concepts:[{t:'Ifá',d:'The Yoruba body of wisdom and its divination system.'},{t:'Babaláwo',d:'A trained Ifá priest and diviner; \u201cfather of secrets.\u201d'},{t:'Odù',d:'The 256 sacred signs or patterns Ifá reads.'}],
    exercise:{title:'Where you assume randomness',steps:['Recall a recent event you dismissed as random chance.','Ask whether it might belong to a larger pattern.','Note what changes if you treat it as legible rather than accidental.'],reflection:'Where in your life do you assume randomness where there might be readable pattern?'},
    closing:'Ifá reminds us that reading reality is ancient technology, not a modern invention.' },

  'ifa-2':{ intro:'At the heart of Ifá are the 256 Odù — sacred signs, each a configuration of forces carrying its own verses, stories, and guidance.',
    objectives:['Understand how the Odù are produced and read','Grasp the Odù as configurations of forces','Connect the Odù to the idea of pattern states'],
    sections:[
      {h:'How the Odù arise',p:'Through casting the sacred palm nuts (ikin) or the divining chain (opele), the diviner produces one of sixteen principal Odù, which combine into 256. Each Odù carries a vast oral corpus of verses — ese — holding stories, proverbs, and prescriptions accumulated over generations.'},
      {h:'Configurations of forces',p:'Each Odù describes a situation-pattern: a particular arrangement of energies and the wisdom appropriate to it. This resonates directly with Pattern Literacy\u2019s idea of pattern states — recognizable configurations that recur across lives and carry instruction.'},
    ],
    concepts:[{t:'Odù',d:'The 256 signs, each a configuration of forces.'},{t:'Ese',d:'The oral verses and stories attached to each Odù.'},{t:'Opele / Ikin',d:'The divining chain and sacred palm nuts used to read.'}],
    exercise:{title:'Your situation as a sign',steps:['Name one recurring situation in your life.','Imagine it as an Odù with its own verse.','Write the one line of guidance that verse would carry.'],reflection:'If your recurring situation were a sign with its own lesson, what would the lesson be?'},
    closing:'The Odù show that human experience, however varied, falls into recognizable patterns that carry teaching.' },

  'ifa-3':{ intro:'Orí — literally \u201chead\u201d — is the Yoruba concept of the inner self, one\u2019s destiny, and the seat of personal alignment.',
    objectives:['Understand Orí as inner destiny and guide','Connect Orí to the practice of aligned action','See the role of character (iwà) in a life well lived'],
    sections:[
      {h:'The inner head',p:'In Ifá thought, each person carries an Orí — an inner divinity that holds their destiny and orients them toward their highest path. Honoring and aligning with one\u2019s Orí is understood as essential to a good and coherent life.'},
      {h:'Cooperating with your unfolding',p:'Orí teaches that wisdom is cooperating with who you are meant to become rather than forcing against your own nature. Pattern Literacy names this aligned action: moving with reality, and with yourself, rather than against the grain.'},
      {h:'Character as technology',p:'Ifá holds that good character — iwà pẹ̀lẹ́, \u201cgentle character\u201d — is what allows destiny to unfold well. Alignment is not only insight; it is how you carry yourself.'},
    ],
    concepts:[{t:'Orí',d:'The inner head — destiny, purpose, and personal alignment.'},{t:'Iwà',d:'Character; gentle character is treated as spiritual technology.'},{t:'Àṣẹ',d:'The vital force, the power to make things happen.'}],
    exercise:{title:'Forcing vs. cooperating',steps:['Name one area where you have been forcing against your own nature.','Describe what cooperating with your Orí would look like there.','Choose one gentler, aligned step.'],reflection:'Where have you been forcing against your nature, and what would cooperating with your Orí look like?'},
    closing:'Orí teaches that alignment begins within — the first pattern to read is your own.' },

  'kab-1':{ intro:'Kabbalah is the mystical tradition within Judaism that seeks the hidden structure of reality and the nature of the divine.',
    objectives:['Understand Kabbalah as a tradition of structural depth','Recognize the Tree of Life as a map of reality','See why \u201cstructure is sacred\u201d connects to Pattern Literacy'],
    sections:[
      {h:'A tradition of depth',p:'Kabbalah developed over centuries within Judaism, with foundational texts such as the Sefer Yetzirah and the Zohar. It teaches that beneath the visible world lies an architecture of divine emanation — a hidden order that can be studied.'},
      {h:'Structure is sacred',p:'Its central image, the Tree of Life (Etz Chaim), maps reality as ten emanations joined by paths. Kabbalah\u2019s conviction that reality has a readable architecture parallels Pattern Literacy\u2019s Structure lens — the search for the design beneath events.'},
      {h:'A note of respect',p:'Kabbalah is traditionally studied within Jewish practice, often after deep grounding in its texts. We introduce its concepts as respectful students, not as authorities.'},
    ],
    concepts:[{t:'Kabbalah',d:'The received mystical tradition of Judaism.'},{t:'Tree of Life (Etz Chaim)',d:'The map of ten emanations and their paths.'},{t:'Zohar',d:'A foundational text of Kabbalistic thought.'}],
    exercise:{title:'Hidden architecture',steps:['Pick a recurring situation in your life.','Ask what unseen structure might be generating it.','Name one element of that hidden architecture.'],reflection:'Where in your life is there a hidden architecture beneath the surface events?'},
    closing:'Kabbalah teaches that structure is not cold — it is sacred order.' },

  'kab-2':{ intro:'The Sefirot are the ten emanations through which, in Kabbalistic thought, the infinite (Ein Sof) becomes manifest reality.',
    objectives:['Name the ten Sefirot','Read the Sefirot as a descent from source to manifestation','Connect the four worlds to the five-layer depth model'],
    sections:[
      {h:'Ten emanations',p:'The Sefirot are Keter (crown), Chokhmah (wisdom), Binah (understanding), Chesed (lovingkindness), Gevurah (strength), Tiferet (beauty and balance), Netzach (endurance), Hod (splendor), Yesod (foundation), and Malkhut (kingdom, manifestation). Together they form the Tree of Life.'},
      {h:'A map of reality\u2019s structure',p:'The Sefirot describe how unity differentiates into multiplicity — a structured descent from source toward concrete manifestation. This echoes Pattern Literacy\u2019s own descent from Intelligent Order down to the Events you live.'},
      {h:'The four worlds',p:'Kabbalah also describes four worlds — Atzilut, Beriah, Yetzirah, and Assiah — levels ranging from the most abstract to the most concrete. They parallel the framework\u2019s five layers from source to surface.'},
    ],
    concepts:[{t:'Sefirot',d:'The ten emanations forming the Tree of Life.'},{t:'Ein Sof',d:'The infinite source beyond all emanation.'},{t:'Four Worlds',d:'Levels of reality from abstract to concrete.'}],
    exercise:{title:'A four-worlds reading',steps:['Choose one situation.','Name its most abstract principle (its \u201csource\u201d).','Trace it down step by step to its concrete, lived form.'],reflection:'Trace one situation from an abstract principle down to its concrete form.'},
    closing:'The Sefirot offer a vocabulary for the architecture beneath everything.' },

  'kab-3':{ intro:'Tikkun — \u201crepair\u201d or \u201crectification\u201d — is the Kabbalistic idea that human action participates in mending and completing the world.',
    objectives:['Understand tikkun as participatory repair','Connect tikkun olam to ethical action','See repair as the framework\u2019s participation before prediction'],
    sections:[
      {h:'Repair of the world',p:'The concept of tikkun olam, \u201crepair of the world,\u201d holds that conscious, ethical action helps restore broken harmony and participates in the ongoing work of creation. The human being is not a spectator but a mender.'},
      {h:'Participation, not prediction',p:'Tikkun frames the person as an active participant in reality\u2019s unfolding — which is precisely Pattern Literacy\u2019s value of participation before prediction. Reading reality is in service of helping to heal it.'},
    ],
    concepts:[{t:'Tikkun',d:'Repair or rectification.'},{t:'Tikkun olam',d:'Repair of the world through aligned, ethical action.'},{t:'Co-participation',d:'The human as active partner in reality\u2019s unfolding.'}],
    exercise:{title:'One act of repair',steps:['Notice one small thing out of harmony in your sphere.','Name a single, doable act of repair.','Do it this week.'],reflection:'What is one act of repair you can make that aligns with the deeper order?'},
    closing:'Tikkun teaches that to read reality is ultimately to help mend it.' },
};
Object.assign(WISDOM_LESSONS, {
  'ic-1':{ intro:'The I Ching (Yijing), the \u201cBook of Changes,\u201d is one of the oldest Chinese classics — a manual of cosmology and divination built on the dynamics of change.',
    objectives:['Understand the I Ching as a philosophy of change','Grasp the interplay of yin and yang','Connect the quality of the moment to the Rhythm lens'],
    sections:[
      {h:'The Book of Changes',p:'With roots reaching back over 2,500 years, the I Ching became a cornerstone of Chinese thought, shaping both Confucian and Daoist traditions. Its core teaching is that change is constant and follows intelligible patterns that a careful reader can learn to recognize.'},
      {h:'Yin and yang',p:'Its foundation is the interplay of yin (the receptive) and yang (the active) — complementary forces whose ceaseless dance produces every situation. Nothing is purely one; each carries the seed of the other.'},
      {h:'The quality of the moment',p:'The I Ching\u2019s premise — that each moment has a readable quality, and that wisdom is acting in accord with it — mirrors Pattern Literacy\u2019s Rhythm lens, which asks what phase and timing you are actually in.'},
    ],
    concepts:[{t:'I Ching (Yijing)',d:'The Book of Changes.'},{t:'Yin–Yang',d:'Complementary receptive and active forces.'},{t:'Dao',d:'The way; the flow one seeks to move with.'}],
    exercise:{title:'Read the moment',steps:['Choose one area of your life.','Ask whether this is a yin (receptive, waiting) time or a yang (active, initiating) time.','Name one action that fits the moment\u2019s quality.'],reflection:'Is the current moment in one area of your life a receptive (yin) or active (yang) time, and how should that shape your move?'},
    closing:'The I Ching teaches that to act wisely is to act in time with change.' },

  'ic-2':{ intro:'The I Ching\u2019s 64 hexagrams are six-line figures, each describing a characteristic situation and its dynamics.',
    objectives:['Understand trigrams and hexagrams','Read a hexagram as a situation-pattern','Use changing lines to read patterns in motion'],
    sections:[
      {h:'Trigrams and hexagrams',p:'Eight trigrams — combinations of three yin or yang lines — pair to form 64 hexagrams. Each hexagram carries a name, an image drawn from nature, and commentary describing a situation and how to meet it well.'},
      {h:'Lines in motion',p:'Individual lines can be \u201cchanging,\u201d transforming one hexagram into another. This encodes how a situation is already in motion toward what comes next — a model strikingly close to Pattern Literacy\u2019s reading of sequences, where one pattern state flows into another.'},
    ],
    concepts:[{t:'Hexagram',d:'A six-line figure describing a situation.'},{t:'Trigram',d:'A three-line building block of hexagrams.'},{t:'Changing lines',d:'Lines that signal a situation in transformation.'}],
    exercise:{title:'Your situation as a hexagram',steps:['Describe a current situation in one image from nature.','Name the situation\u2019s overall character.','Identify the one \u201cline\u201d that is changing — what is shifting.'],reflection:'Describe your current situation as a hexagram: its image, its character, and the one line that is changing.'},
    closing:'The hexagrams show situations not as static but as patterns caught in motion.' },

  'ic-3':{ intro:'Beyond divination, the I Ching is a philosophy of timing — knowing when to act, when to wait, and when to yield.',
    objectives:['Understand timeliness as central to wisdom','Connect timing to aligned action','Practice reading the tempo of a situation'],
    sections:[
      {h:'The right time',p:'Central to the I Ching is the idea that every action has its proper season. The exemplary person — the junzi — reads the time and acts accordingly, neither forcing prematurely nor hesitating past the moment.'},
      {h:'Aligned action through timing',p:'This is the Rhythm lens in practice: the same act can succeed or fail entirely by its timing. The I Ching trains the reader to feel a situation\u2019s tempo and to move with it rather than against it.'},
    ],
    concepts:[{t:'Shí',d:'Timeliness; the right moment to act.'},{t:'Junzi',d:'The exemplary person who acts in accord with the time.'},{t:'Wu wei',d:'Effortless action in harmony with the flow (Daoist resonance).'}],
    exercise:{title:'When, not what',steps:['Identify one decision where the real question is when, not what.','Read whether the moment favors acting, waiting, or yielding.','Name what the moment is asking.'],reflection:'For one decision, the question is timing: what is the moment asking — act, wait, or yield?'},
    closing:'The I Ching teaches that timing is not a detail of wisdom — it is much of wisdom itself.' },

  'scr-1':{ intro:'The scriptures of the Abrahamic traditions — Jewish, Christian, and Islamic — teach through narrative, encoding pattern wisdom inside story.',
    objectives:['Recognize narrative as a vehicle for pattern wisdom','Learn to read beneath the events of a story','Connect scriptural reading to the framework\u2019s method'],
    sections:[
      {h:'Wisdom in story',p:'Rather than abstract systems, scripture often conveys understanding through narrative — characters meeting recurring human situations whose patterns instruct the reader across generations.'},
      {h:'Reading beneath the events',p:'To read scripture deeply is to see the structures and patterns beneath the surface events — covenant and consequence, exile and return. This is the same descent Pattern Literacy makes: from event to the deeper order it expresses.'},
      {h:'A note of respect',p:'These texts are sacred to billions. We engage them here as sources of pattern wisdom alongside their devotional meaning, never in place of it.'},
    ],
    concepts:[{t:'Narrative wisdom',d:'Teaching carried through story rather than abstraction.'},{t:'Archetype',d:'A recurring figure or situation that instructs.'},{t:'Parable',d:'A short story that encodes a pattern.'}],
    exercise:{title:'A story that keeps proving true',steps:['Recall a story — sacred or personal — that has stayed with you.','Name the pattern it carries.','Notice where that pattern keeps proving true in your life.'],reflection:'What story carries a pattern that keeps proving true in your life?'},
    closing:'Scripture shows that pattern literacy is as old as storytelling.' },

  'scr-2':{ intro:'A central pattern across Abrahamic scripture is the cycle of covenant, drift, exile, and return.',
    objectives:['Recognize the covenant–exile–return cycle','See it as a developmental pattern','Locate yourself within such a cycle'],
    sections:[
      {h:'The recurring cycle',p:'Again and again the narrative moves through promise (covenant), drift or transgression, consequence (exile), and restoration (return). It is a developmental cycle written into the deep structure of the tradition.'},
      {h:'A resonance with the wheel',p:'This rise, fall, and renewal echoes the framework\u2019s twelve-phase cycle — beginning, transformation, dissolution, and beginning again. Recognizing the cycle helps you locate where you currently stand within it.'},
    ],
    concepts:[{t:'Covenant',d:'A binding promise or relationship.'},{t:'Exile',d:'Consequence and separation within the cycle.'},{t:'Return (Teshuvah)',d:'Restoration; the turning back.'}],
    exercise:{title:'Locate the cycle',steps:['Choose one area of life.','Identify whether you are in covenant, drift, exile, or return.','Name what the next turn of the cycle invites.'],reflection:'Where are you in a covenant–drift–exile–return cycle right now?'},
    closing:'The cycle teaches that exile is rarely the end of the story — return is part of the pattern.' },

  'scr-3':{ intro:'The prophetic tradition models a particular kind of pattern reader — one who sees the structures beneath events and speaks to where they lead.',
    objectives:['Understand prophecy as structural reading','Distinguish it from fortune-telling','Connect the prophetic voice to the Guide\u2019s responsibility'],
    sections:[
      {h:'Seeing the structure',p:'Prophets in the Abrahamic traditions are less fortune-tellers than readers of moral and social structure — naming where present patterns are heading if they continue unchanged, and calling for a turn.'},
      {h:'Reading as responsibility',p:'The prophetic voice carries the ethical weight Pattern Literacy gives to the Guide: to read clearly, and then to speak truthfully and caringly in service of others rather than for display.'},
    ],
    concepts:[{t:'Prophecy',d:'Reading structure and its likely consequence.'},{t:'Discernment',d:'Seeing the pattern beneath events.'},{t:'Witness',d:'Speaking truthfully what one has read.'}],
    exercise:{title:'Honest witness',steps:['Name one pattern in your community heading somewhere concerning.','Imagine reading it clearly and without blame.','Draft one sentence of caring, honest witness.'],reflection:'What pattern in your community is heading somewhere, and what would honest, caring witness sound like?'},
    closing:'The prophetic voice shows that reading reality carries responsibility toward others.' },
});
Object.assign(WISDOM_LESSONS, {
  'bud-1':{ intro:'Buddhism begins with a clear-eyed diagnosis of the human condition and a method for seeing reality as it actually is.',
    objectives:['Understand the Four Noble Truths as a diagnostic pattern','See clear perception as the aim of practice','Connect Buddhist diagnosis to Pattern Literacy'],
    sections:[
      {h:'The Four Noble Truths',p:'The Buddha\u2019s first teaching is a diagnostic sequence: there is suffering (dukkha); it has a cause (craving and clinging); its cessation is possible; and there is a path that leads to that cessation. Symptom, cause, prognosis, treatment — a complete framework for reading a difficulty.'},
      {h:'Seeing clearly',p:'Buddhism holds that suffering arises largely from misperceiving reality — mistaking the impermanent for the permanent, the conditioned for the absolute. Liberation comes through seeing clearly. Pattern Literacy shares this aim: an honest reading of what is actually happening.'},
      {h:'A note of respect',p:'Buddhism is a 2,500-year-old path with many living schools. We introduce a few core teachings as sources of insight, with respect for the traditions that carry them.'},
    ],
    concepts:[{t:'Dukkha',d:'Suffering or unsatisfactoriness; the condition diagnosed.'},{t:'Four Noble Truths',d:'The diagnostic pattern: suffering, cause, cessation, path.'},{t:'Clear seeing (vipassanā)',d:'Insight into things as they are.'}],
    exercise:{title:'A four-truths reading',steps:['Take one recurring frustration.','Name the suffering, then its underlying craving or clinging.','Ask whether it can ease, and what path would lead there.'],reflection:'Apply the four-truths pattern to one recurring frustration: what is it, its cause, can it ease, and what is the path?'},
    closing:'Buddhism shows that clear diagnosis is the beginning of freedom.' },

  'bud-2':{ intro:'Dependent origination (paṭicca-samuppāda) is the Buddhist teaching that nothing arises independently — everything comes to be through conditions.',
    objectives:['Understand phenomena as conditioned','See patterns as sustained by their conditions','Connect impermanence to the possibility of change'],
    sections:[
      {h:'Nothing stands alone',p:'Phenomena arise in dependence on causes and conditions; remove or alter the conditions and the phenomenon changes. This is the Structure lens in spiritual form: patterns persist not by magic but because conditions continue to sustain them.'},
      {h:'Impermanence',p:'Because everything is conditioned, everything is impermanent (anicca). Patterns are real, but never fixed — they shift the moment their supporting conditions shift. This is profoundly hopeful for anyone wishing to change.'},
    ],
    concepts:[{t:'Dependent origination',d:'Paṭicca-samuppāda; all things arise through conditions.'},{t:'Conditions',d:'What sustains a phenomenon in being.'},{t:'Anicca',d:'Impermanence; the conditioned is always changing.'}],
    exercise:{title:'Change the conditions',steps:['Name a pattern you want to change.','List the conditions currently sustaining it.','Identify the one condition you could realistically alter.'],reflection:'For a pattern you want to change, which sustaining condition could you actually alter?'},
    closing:'Dependent origination teaches that to change a pattern, you change its conditions.' },

  'bud-3':{ intro:'The Noble Eightfold Path is Buddhism\u2019s practical framework for living in accord with reality.',
    objectives:['Know the eight factors of the path','Understand the path as aligned action, not imposed rule','Connect Buddhist ethics to moving with the deeper order'],
    sections:[
      {h:'Eight factors',p:'The path comprises right view, right intention, right speech, right action, right livelihood, right effort, right mindfulness, and right concentration — often grouped as wisdom, ethical conduct, and meditative training. Together they form a complete way of living.'},
      {h:'Aligned action',p:'The path is not a set of rules imposed from outside but a description of how to move so that suffering decreases — for oneself and others. This is exactly Pattern Literacy\u2019s aligned action: participation in harmony with the deeper order rather than friction against it.'},
    ],
    concepts:[{t:'The Eightfold Path',d:'The practical framework of eight factors.'},{t:'Right view',d:'Seeing clearly first; the foundation of the path.'},{t:'Sīla',d:'Ethical conduct; living in accord.'}],
    exercise:{title:'One factor, practiced',steps:['Choose one factor of the path that calls to you.','Name one concrete way to practice it this week.','Notice what shifts when you do.'],reflection:'Pick one factor of the path and name one concrete way to practice it this week.'},
    closing:'The Eightfold Path shows that seeing clearly must become living wisely.' },

  'her-1':{ intro:'Hermetic philosophy is a Western esoteric tradition rooted in texts attributed to Hermes Trismegistus, blending Greek and Egyptian thought.',
    objectives:['Understand the origins of Hermeticism','Distinguish the ancient corpus from later popularizations','See Hermeticism as a direct ancestor of Pattern Literacy'],
    sections:[
      {h:'The Hermetic corpus',p:'Emerging in Hellenistic Egypt, the Hermetic writings — the Corpus Hermeticum — later influenced Renaissance philosophy and Western esotericism. A much later book, The Kybalion (1908), popularized a set of \u201cseven Hermetic principles\u201d and is a modern work, not an ancient one.'},
      {h:'Reality is lawful',p:'Hermeticism teaches that the cosmos operates by universal principles — that reality is lawful, ordered, and mind-like. This is perhaps the most direct philosophical ancestor of Pattern Literacy\u2019s founding claim that reality is intelligible and can be read.'},
    ],
    concepts:[{t:'Hermeticism',d:'A Western esoteric philosophical tradition.'},{t:'Corpus Hermeticum',d:'The ancient body of Hermetic texts.'},{t:'The seven principles',d:'A framework popularized later by The Kybalion (1908).'}],
    exercise:{title:'Where reality feels lawful',steps:['Name one domain where you already assume reality is patterned and lawful.','Name one where you assume it is random.','Ask what would change if you read the second as lawful too.'],reflection:'Where do you already assume reality is lawful and patterned — and where do you not?'},
    closing:'Hermeticism declares reality intelligible — the seed of all pattern reading.' },

  'her-2':{ intro:'\u201cAs above, so below\u201d — the Principle of Correspondence — is Hermeticism\u2019s most famous teaching: patterns repeat across scales.',
    objectives:['Understand the Principle of Correspondence','Recognize fractal recurrence across scales','Use correspondence to read small and large together'],
    sections:[
      {h:'Correspondence',p:'What is true at one level of reality echoes at others; macrocosm and microcosm mirror each other. The phrase descends from the Emerald Tablet and became a cornerstone of Western esoteric thought.'},
      {h:'Fractal patterns',p:'In practical terms, the same structure recurs at different scales — a person, an organization, and a civilization can move through analogous phases. Pattern Literacy uses exactly this move: read the small to understand the large, and read the large to make sense of the small.'},
    ],
    concepts:[{t:'Correspondence',d:'\u201cAs above, so below\u201d; levels mirror one another.'},{t:'Macrocosm / Microcosm',d:'The large and small reflecting the same order.'},{t:'Fractal recurrence',d:'The same structure repeating across scales.'}],
    exercise:{title:'Same shape, different scale',steps:['Find one pattern in your personal life.','Look for the same shape in your work, family, or community.','Note what reading one scale reveals about the other.'],reflection:'What pattern in your personal life also appears at a larger scale — same shape, different size?'},
    closing:'Correspondence teaches that to read one scale well is to gain a key to them all.' },

  'her-3':{ intro:'Two Hermetic principles map directly onto the framework: Rhythm — everything cycles — and Polarity — everything has its pair of opposites.',
    objectives:['Understand the Principle of Rhythm','Understand the Principle of Polarity','Connect both to the phases and micro-states'],
    sections:[
      {h:'The Principle of Rhythm',p:'Everything flows out and in; all things rise and fall, advance and recede, in measured tides. This is the Rhythm lens and the twelve-phase cycle in seed form — the recognition that nothing stays fixed and movement itself is lawful.'},
      {h:'The Principle of Polarity',p:'Opposites are described as two ends of one thing, differing in degree rather than in kind — heat and cold are the same thing measured differently. This resonates with the micro-states and the play of tensions within each phase, where a quality and its opposite belong to one spectrum.'},
    ],
    concepts:[{t:'Principle of Rhythm',d:'All things move in measured, cyclical tides.'},{t:'Principle of Polarity',d:'Opposites are two ends of one spectrum.'},{t:'Degree',d:'Opposites differ in degree, not in kind.'}],
    exercise:{title:'Your rhythm and your polarity',steps:['Name one cycle you are currently in (a rhythm).','Name one polarity you are navigating (e.g. holding on vs. letting go).','Notice where on each spectrum you stand today.'],reflection:'What cycle are you in right now, and what polarity are you navigating?'},
    closing:'Rhythm and Polarity show that the framework\u2019s cycles and tensions are ancient observations of how reality moves.' },
});

const ATTUNEMENT_CIRCLE = { name:'Attunement Circle',duration:'90 minutes',segments:[
  {title:'Opening',duration:'15 min',desc:'Reflection: What events occurred this week?'},
  {title:'Pattern Reading',duration:'20 min',desc:'Members identify recurring situations, emerging opportunities, and recurring challenges.'},
  {title:'Framework Exploration',duration:'20 min',desc:'Facilitator guides discussion through Intelligent Order, Structure, Pattern, Rhythm, Events.'},
  {title:'Wisdom Dialogue',duration:'20 min',desc:'Small groups explore: What is life trying to teach through this pattern?'},
  {title:'Alignment Action',duration:'15 min',desc:'Each member commits to one aligned action for the coming week.'},
]};

const GUIDES = [
  { id:'g1',name:'Dr. Amara Osei',specialty:'Ifá Integration & Pattern Reading',bio:'Practitioner of Ifá divination and Pattern Literacy. Specializes in helping members read recurring life patterns through traditional wisdom.' },
  { id:'g2',name:'Marcus Chen',specialty:'Structure Analysis & Career Patterns',bio:'Former organizational strategist. Helps members identify structural patterns in work, leadership, and professional development.' },
  { id:'g3',name:'Sister Miriam Torres',specialty:'Contemplative Practice & Scripture Patterns',bio:'Bridges contemplative Christian tradition with Pattern Literacy. Guides members through cycles of exile, return, and covenant.' },
];

const DEFAULT_PROFILE = { name:'',email:'',level:'observer',joinDate:new Date().toISOString().split('T')[0],bio:'',currentPhase:null,currentMicroState:null,role:'member' };
const DEFAULT_MEMBERS = [
  { id:'m1',name:'Elena Vasquez',email:'elena.v@example.com',level:'guide',joinDate:'2025-01-12',status:'active' },
  { id:'m2',name:'David Okafor',email:'d.okafor@example.com',level:'practitioner',joinDate:'2025-03-04',status:'active' },
  { id:'m3',name:'Priya Nair',email:'priya.nair@example.com',level:'practitioner',joinDate:'2025-04-22',status:'active' },
  { id:'m4',name:'James Whitfield',email:'jwhitfield@example.com',level:'interpreter',joinDate:'2025-06-18',status:'active' },
  { id:'m5',name:'Aiko Tanaka',email:'aiko.t@example.com',level:'interpreter',joinDate:'2025-08-09',status:'active' },
  { id:'m6',name:'Marcus Bell',email:'marcus.bell@example.com',level:'reader',joinDate:'2025-09-30',status:'active' },
  { id:'m7',name:'Sofia Romano',email:'sofia.r@example.com',level:'reader',joinDate:'2025-11-15',status:'paused' },
  { id:'m8',name:'Thomas Mbeki',email:'t.mbeki@example.com',level:'observer',joinDate:'2026-01-08',status:'active' },
  { id:'m9',name:'Grace Lindqvist',email:'grace.l@example.com',level:'observer',joinDate:'2026-02-21',status:'active' },
  { id:'m10',name:'Omar Haddad',email:'omar.h@example.com',level:'observer',joinDate:'2026-04-03',status:'active' },
];
const DEFAULT_EVENTS = [
  {id:'e0',title:'Attunement Circle',date:'2026-06-08',time:'7:00 PM CST',type:'circle',desc:'Weekly 90-minute gathering.'},
  {id:'e1',title:'New Member Orientation',date:'2026-06-15',time:'7:00 PM CST',type:'workshop',desc:'Introduction to the Attuned Community.'},
  {id:'e2',title:'Attunement Circle',date:'2026-06-15',time:'12:00 PM CST',type:'circle',desc:'Weekly gathering.'},
  {id:'e3',title:'Level 2 Cohort Kickoff',date:'2026-07-01',time:'6:00 PM CST',type:'course',desc:'Reader curriculum begins.'},
  {id:'e4',title:'Ask a Guide',date:'2026-07-10',time:'7:00 PM CST',type:'qa',desc:'Open Q&A with certified Guides.'},
  {id:'e5',title:'Wisdom Traditions Deep Dive: Ifá',date:'2026-07-18',time:'6:30 PM CST',type:'workshop',desc:"Exploring Ifá's contribution to Pattern Literacy."},
];
const DEFAULT_ANNOUNCEMENTS = [
  {id:'a1',date:'2026-06-05',title:'Welcome to Attuned Community',content:'The portal is live. Learn the Order. Read the Pattern. Move with the Rhythm.'},
  {id:'a2',date:'2026-06-03',title:'Book Update: "Why This Keeps Happening"',content:'Manuscript complete. Entering production.'},
  {id:'a3',date:'2026-06-01',title:'Certification Program Applications Open',content:'Twelvefold Institute 200-hour certification is accepting applications.'},
];

const S = { bg:'#0B0A12',bgCard:'rgba(236,231,221,0.025)',bgCardHover:'rgba(236,231,221,0.05)',border:'rgba(236,231,221,0.09)',borderLight:'rgba(236,231,221,0.16)',purple:'#9B8FC7',purpleDeep:'#6D5FA8',gold:'#E0B65C',goldDim:'rgba(224,182,92,0.12)',text:'#ECE7DD',textMuted:'#9C968B',textDim:'#615C54',fontHead:"'Fraunces', Georgia, serif",fontBody:"'Spectral', Georgia, serif",fontSans:"'Hanken Grotesk', -apple-system, sans-serif",fontMono:"'Space Mono', monospace",green:'#7FB39A',red:'#D98C7A',blue:'#7BA0C4' };
const glassCard = { background:'linear-gradient(180deg, rgba(236,231,221,0.04), rgba(236,231,221,0.015))',border:`1px solid ${S.border}`,borderRadius:'14px',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)' };

function SidebarIcon({icon,label,active,onClick}){return(<button onClick={onClick} title={label} style={{display:'flex',alignItems:'center',gap:'12px',width:'100%',padding:'10px 16px',border:'none',borderRadius:'10px',cursor:'pointer',background:active?'rgba(167,139,250,0.15)':'transparent',borderLeft:active?`3px solid ${S.gold}`:'3px solid transparent',color:active?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',fontWeight:500,transition:'all 0.2s ease',textAlign:'left'}} onMouseEnter={e=>{if(!active){e.target.style.background='rgba(255,255,255,0.04)';e.target.style.color=S.text;}}} onMouseLeave={e=>{if(!active){e.target.style.background='transparent';e.target.style.color=S.textMuted;}}}><span style={{fontSize:'16px',width:'22px',textAlign:'center'}}>{icon}</span><span>{label}</span></button>);}

function Card({children,style,onClick,hover}){const[h,setH]=useState(false);return(<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{...glassCard,padding:'24px',...(hover?{transition:'all 0.2s ease',cursor:'pointer'}:{}),...(h&&hover?{background:S.bgCardHover,borderColor:S.borderLight}:{}),...style}}>{children}</div>);}

function Badge({label,color}){return(<span style={{display:'inline-block',padding:'3px 11px',borderRadius:'7px',background:`${color}14`,border:`1px solid ${color}33`,color,fontSize:'10.5px',fontFamily:S.fontMono,fontWeight:400,letterSpacing:'0.8px',textTransform:'uppercase'}}>{label}</span>);}

function SectionTitle({children,sub}){return(<div style={{marginBottom:'22px'}}><h2 style={{fontFamily:S.fontHead,fontSize:'25px',fontWeight:500,color:S.text,margin:0,letterSpacing:'-0.4px',lineHeight:1.15}}>{children}</h2>{sub&&<p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:'6px 0 0',lineHeight:1.5}}>{sub}</p>}</div>);}

function EmptyState({icon,message,action,onAction}){return(<div style={{textAlign:'center',padding:'48px 24px'}}><div style={{fontSize:'48px',marginBottom:'16px',opacity:0.4}}>{icon}</div><p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:'0 0 16px'}}>{message}</p>{action&&<button onClick={onAction} style={{padding:'10px 24px',border:`1px solid ${S.purple}`,borderRadius:'8px',background:'transparent',color:S.purple,fontFamily:S.fontSans,fontSize:'14px',cursor:'pointer'}}>{action}</button>}</div>);}

function PrimaryButton({children,onClick,style,disabled}){const[h,setH]=useState(false);return(<button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:'10px 22px',border:'none',borderRadius:'9px',background:disabled?'rgba(224,182,92,0.25)':h?'#EAC274':S.gold,color:'#1A150A',fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,letterSpacing:'0.2px',cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.55:1,transition:'all 0.2s ease',boxShadow:disabled?'none':h?'0 6px 20px rgba(224,182,92,0.25)':'0 2px 8px rgba(224,182,92,0.12)',transform:h&&!disabled?'translateY(-1px)':'none',...style}}>{children}</button>);}

function SecondaryButton({children,onClick,style}){return(<button onClick={onClick} style={{padding:'10px 24px',border:`1px solid ${S.border}`,borderRadius:'8px',background:'transparent',color:S.textMuted,fontFamily:S.fontSans,fontSize:'14px',cursor:'pointer',...style}}>{children}</button>);}

function TextInput({label,value,onChange,placeholder,multiline,type='text'}){const sh={width:'100%',padding:'10px 14px',border:`1px solid ${S.border}`,borderRadius:'8px',background:'rgba(255,255,255,0.03)',color:S.text,fontFamily:S.fontBody,fontSize:'15px',outline:'none',transition:'border-color 0.2s',boxSizing:'border-box'};return(<div style={{marginBottom:'16px'}}>{label&&<label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>{label}</label>}{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={4} style={{...sh,resize:'vertical'}} onFocus={e=>e.target.style.borderColor=S.purple} onBlur={e=>e.target.style.borderColor=S.border}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={sh} onFocus={e=>e.target.style.borderColor=S.purple} onBlur={e=>e.target.style.borderColor=S.border}/>}</div>);}

const formatDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const relativeTime=ds=>{const diff=Math.floor((new Date()-new Date(ds))/1000);if(diff<60)return'just now';if(diff<3600)return`${Math.floor(diff/60)}m ago`;if(diff<86400)return`${Math.floor(diff/3600)}h ago`;if(diff<604800)return`${Math.floor(diff/86400)}d ago`;return formatDate(ds);};

// ── Element colors + seasonal (phase-based) community events ──
const ELEMENT_COLOR={Fire:'#D98C7A',Earth:'#7FB39A',Air:'#7BA0C4',Water:'#9B8FC7'};
const PHASE_START=[[2,21],[3,20],[4,21],[5,21],[6,23],[7,23],[8,23],[9,23],[10,22],[11,22],[0,20],[1,19]];
function getPhaseEvents(){const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());const out=[];for(let i=0;i<12;i++){const m=PHASE_START[i][0],day=PHASE_START[i][1];let dt=new Date(now.getFullYear(),m,day);if(dt<today)dt=new Date(now.getFullYear()+1,m,day);const ph=PHASES[i];out.push({id:'phase-'+i,phaseIndex:i,title:'Season of '+ph.name+' Opens',date:dt.toISOString().split('T')[0],time:'7:00 PM CST',type:'phase',desc:ph.sign+' season begins — Life seeks '+ph.seeks+'. An Attunement gathering to read the new season and set intentions aligned with '+ph.name+'.'});}return out.sort((a,b)=>new Date(a.date)-new Date(b.date));}

// ══ DASHBOARD ══
function DashboardPage({profile,journalEntries,posts,events,announcements,goTo}){
  const level=LEVELS.find(l=>l.id===profile.level)||LEVELS[0];const upcoming=[...events,...getPhaseEvents()].filter(e=>new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3);
  return(<div>
    <div style={{...glassCard,padding:'36px',marginBottom:'24px',background:'linear-gradient(135deg, rgba(224,182,92,0.08), rgba(155,143,199,0.04) 60%, rgba(236,231,221,0.012))',borderColor:'rgba(224,182,92,0.18)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'-60px',right:'-30px',width:'220px',height:'220px',borderRadius:'50%',background:'radial-gradient(circle, rgba(224,182,92,0.12), transparent 70%)',pointerEvents:'none'}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px',position:'relative'}}>
        <div><h1 style={{fontFamily:S.fontHead,fontSize:'32px',fontWeight:500,color:S.text,margin:'0 0 10px',letterSpacing:'-0.6px',lineHeight:1.1}}>{profile.name?`Welcome back, ${profile.name.split(' ')[0]}`:'Welcome to Attuned Community'}</h1>
          <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:'0 0 6px'}}>{profile.currentPhase!==null?`Current phase: ${PHASES[profile.currentPhase].name} · ${MICRO_STATES[profile.currentMicroState||0]}`:'Begin your pattern literacy journey.'}</p>
          <p style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.gold,fontStyle:'italic',margin:0}}>Learn the Order. Read the Pattern. Move with the Rhythm.</p></div>
        <Badge label={level.label} color={level.color}/></div></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'16px',marginBottom:'24px'}}>
      {[{l:'Journal Entries',v:journalEntries.length,i:'◉'},{l:'Community Posts',v:posts.length,i:'◎'},{l:'Upcoming Events',v:upcoming.length,i:'◈'},{l:'Member Since',v:profile.joinDate?formatDate(profile.joinDate):'—',i:'◇'}].map((s,i)=>
        <Card key={i}><div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}><span style={{marginRight:'6px'}}>{s.i}</span>{s.l}</div><div style={{fontFamily:S.fontHead,fontSize:'22px',color:S.text}}>{s.v}</div></Card>)}</div>
    <Card style={{marginBottom:'24px',borderColor:'rgba(251,191,36,0.15)',background:'linear-gradient(135deg, rgba(251,191,36,0.04), rgba(251,191,36,0.01))'}}>
      <SectionTitle sub="Recited at every gathering">Community Creed</SectionTitle>
      <div style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,lineHeight:1.8}}>{CREED.map((l,i)=>l===''?<br key={i}/>:<div key={i} style={{color:i>=6&&i<=9?S.gold:S.textMuted}}>{l}</div>)}</div></Card>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
      <Card style={{gridColumn:'1 / -1'}}><SectionTitle sub="Latest from Twelvefold Institute">Announcements</SectionTitle>
        {announcements.slice(0,3).map(a=><div key={a.id} style={{padding:'16px',borderRadius:'10px',background:'rgba(255,255,255,0.02)',border:`1px solid ${S.border}`,marginBottom:'8px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{a.title}</span><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{formatDate(a.date)}</span></div>
          <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>{a.content}</p></div>)}</Card>
      <Card><SectionTitle sub="How we practice">Community Values</SectionTitle>
        {VALUES.map((v,i)=><div key={i} style={{padding:'10px 0',borderBottom:i<VALUES.length-1?`1px solid ${S.border}`:'none'}}><div style={{fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,color:S.purple,marginBottom:'2px'}}>{i+1}. {v.title}</div><div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted}}>{v.desc}</div></div>)}</Card>
      <Card><SectionTitle sub="What's coming up">Upcoming Events</SectionTitle>
        {upcoming.length===0?<p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textDim}}>No upcoming events.</p>:upcoming.map(e=><div key={e.id} style={{padding:'12px 0',borderBottom:`1px solid ${S.border}`}}><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{e.title}</div><div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.gold,marginTop:'4px'}}>{formatDate(e.date)} · {e.time}</div></div>)}
        <div style={{marginTop:'12px'}}><SecondaryButton onClick={()=>goTo('events')}>View all events →</SecondaryButton></div></Card>
    </div></div>);}

// ══ MY JOURNEY ══
function MyJourneyPage({profile,progress,setProfile,saveProfile}){
  const cl=LEVELS.find(l=>l.id===profile.level)||LEVELS[0];const cm=Object.keys(progress).filter(k=>progress[k]&&progress[k].completedAt).length;const tm=CURRICULUM_MODULES.reduce((s,g)=>s+g.modules.length,0);
  const up=(f,v)=>{const u={...profile,[f]:v};setProfile&&setProfile(u);saveProfile&&saveProfile(u);};
  const cp=profile.currentPhase;const cpp=cp!=null?PHASES[cp]:null;
  return(<div><SectionTitle sub="Your path through Pattern Literacy">My Journey</SectionTitle>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.gold}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',flexWrap:'wrap',gap:'8px',marginBottom:'4px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:S.text,margin:0}}>Your Current Position</h3><span style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim,letterSpacing:'1px'}}>where you are in the cycle</span></div>
      <p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textDim,margin:'0 0 14px'}}>Set the phase you are moving through — or let the Event Decoder set it for you.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:'8px',marginBottom:cp!=null?'18px':'0'}}>{PHASES.map((ph,i)=>{const on=profile.currentPhase===i;return(<button key={i} onClick={()=>up('currentPhase',on?null:i)} style={{padding:'9px 4px',borderRadius:'10px',border:`1px solid ${on?S.gold:S.border}`,background:on?S.goldDim:'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}><span style={{fontSize:'18px'}}>{ph.icon}</span><span style={{fontFamily:S.fontSans,fontSize:'9.5px',color:on?S.gold:S.textMuted}}>{ph.name}</span></button>);})}</div>
      {cpp&&<div>
        <div style={{padding:'14px 16px',borderRadius:'10px',background:`${S.gold}08`,border:`1px solid ${S.gold}1F`,marginBottom:'14px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}><span style={{fontSize:'22px'}}>{cpp.icon}</span><div><div style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text}}>{cpp.name}</div><div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim,letterSpacing:'1px'}}>{cpp.sign} · {cpp.func} Function · Life seeks {cpp.seeks}</div></div></div>
          <p style={{fontFamily:S.fontBody,fontSize:'13.5px',color:S.textMuted,margin:0,fontStyle:'italic',lineHeight:1.55}}>{cpp.teaching}</p></div>
        <div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textMuted,fontWeight:600,marginBottom:'8px'}}>Micro-state — the rhythm within the phase</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>{MICRO_STATES.map((ms,i)=>{const on=profile.currentMicroState===i;return(<button key={i} onClick={()=>up('currentMicroState',on?null:i)} style={{padding:'10px 6px',borderRadius:'10px',border:`1px solid ${on?S.gold:S.border}`,background:on?S.goldDim:'rgba(255,255,255,0.02)',cursor:'pointer',textAlign:'center'}}><div style={{fontFamily:S.fontHead,fontSize:'13px',fontWeight:500,color:on?S.gold:S.text}}>{ms}</div><div style={{fontFamily:S.fontBody,fontSize:'10.5px',color:S.textDim,marginTop:'2px',lineHeight:1.35}}>{['The spark.','Energy grows.','Refinement.','Completion.'][i]}</div></button>);})}</div>
      </div>}
    </Card>
    <Card style={{marginBottom:'24px'}}><div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'24px'}}>
      {LEVELS.map((l,i)=>(<React.Fragment key={l.id}><div style={{width:'48px',height:'48px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:l.rank<=cl.rank?`${l.color}25`:'rgba(255,255,255,0.04)',border:`2px solid ${l.rank<=cl.rank?l.color:S.border}`,fontFamily:S.fontHead,fontSize:'14px',color:l.rank<=cl.rank?l.color:S.textDim}}>{i+1}</div>
        {i<LEVELS.length-1&&<div style={{flex:1,height:'2px',background:l.rank<cl.rank?`${l.color}50`:S.border}}/>}</React.Fragment>))}</div>
      <div style={{display:'flex',justifyContent:'space-between'}}>{LEVELS.map(l=><div key={l.id} style={{textAlign:'center',width:'48px'}}><div style={{fontFamily:S.fontSans,fontSize:'10px',color:l.id===profile.level?l.color:S.textDim}}>{l.label}</div></div>)}</div></Card>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${cl.color}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}><div><h3 style={{fontFamily:S.fontHead,fontSize:'22px',color:cl.color,margin:'0 0 4px'}}>Level {cl.rank}: {cl.label}</h3><p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:0}}>{cl.desc}</p></div><Badge label={cl.price} color={cl.color}/></div>
      <div style={{padding:'16px',borderRadius:'10px',background:`${cl.color}08`,border:`1px solid ${cl.color}15`,marginBottom:'16px'}}><div style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Your Guiding Question</div><div style={{fontFamily:S.fontBody,fontSize:'18px',color:cl.color,fontStyle:'italic'}}>"{cl.question}"</div></div>
      <div><div style={{fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:600,marginBottom:'8px'}}>What You're Learning</div><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{cl.learns.map((l,i)=><span key={i} style={{padding:'6px 14px',borderRadius:'16px',background:`${cl.color}10`,border:`1px solid ${cl.color}20`,fontFamily:S.fontSans,fontSize:'12px',color:cl.color}}>{l}</span>)}</div></div></Card>
    <Card style={{marginBottom:'24px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><span style={{fontFamily:S.fontSans,fontSize:'14px',color:S.text,fontWeight:600}}>Curriculum Progress</span><span style={{fontFamily:S.fontHead,fontSize:'14px',color:S.gold}}>{cm}/{tm}</span></div>
      <div style={{height:'6px',borderRadius:'3px',background:'rgba(255,255,255,0.05)'}}><div style={{height:'100%',borderRadius:'3px',width:`${tm>0?(cm/tm*100):0}%`,background:`linear-gradient(90deg, ${S.purple}, ${S.gold})`,transition:'width 0.5s'}}/></div></Card>
    <Card><SectionTitle sub="Where to go from here">Next Steps</SectionTitle><div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      {LEVELS.filter(l=>l.rank>cl.rank).slice(0,2).map(l=>(<div key={l.id} style={{padding:'16px',borderRadius:'10px',background:'rgba(255,255,255,0.02)',border:`1px solid ${S.border}`}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:l.color}}>Level {l.rank}: {l.label}</span><span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim}}>{l.price}</span></div>
        <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:'0 0 6px'}}>{l.desc}</p><p style={{fontFamily:S.fontBody,fontSize:'13px',color:l.color,fontStyle:'italic',margin:0}}>"{l.question}"</p></div>))}
      {cl.rank===5&&<p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.green,fontStyle:'italic'}}>You have reached the highest level. Your work now is to guide others.</p>}</div></Card></div>);}

// ══ PHASE WISDOM ══
function PhaseWisdomPage({profile}){
  const[sel,setSel]=useState(profile.currentPhase!==null?profile.currentPhase:0);const p=PHASES[sel];
  return(<div><SectionTitle sub="Deep teachings for each of the twelve phases">Phase Wisdom</SectionTitle>
    <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:'8px',marginBottom:'24px'}}>{PHASES.map((ph,i)=>(<button key={i} onClick={()=>setSel(i)} style={{padding:'10px 4px',borderRadius:'10px',border:`1px solid ${sel===i?S.purple:S.border}`,background:sel===i?'rgba(167,139,250,0.12)':'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}><span style={{fontSize:'20px'}}>{ph.icon}</span><span style={{fontFamily:S.fontSans,fontSize:'10px',color:sel===i?S.purple:S.textMuted,fontWeight:sel===i?600:400}}>{ph.name}</span></button>))}</div>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.purple}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap',gap:'8px'}}><div style={{display:'flex',alignItems:'center',gap:'12px'}}><span style={{fontSize:'32px'}}>{p.icon}</span><div><span style={{fontFamily:S.fontHead,fontSize:'22px',color:S.text}}>{p.name}</span><div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'1px',marginTop:'3px'}}>{p.sign} · {p.func} Function · Life seeks {p.seeks}</div></div></div>
        <div style={{display:'flex',gap:'8px'}}><Badge label={p.element} color={p.element==='Fire'?'#D98C7A':p.element==='Earth'?'#7FB39A':p.element==='Air'?'#7BA0C4':'#9B8FC7'}/><Badge label={p.mode} color={S.textMuted}/></div></div>
      <div style={{fontFamily:S.fontBody,fontSize:'17px',color:S.gold,fontStyle:'italic',marginBottom:'16px',lineHeight:1.6}}>{p.teaching}</div>
      <div style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.8}}>{p.wisdom}</div></Card>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
      <Card><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.red,margin:'0 0 8px'}}>Shadow</h3><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:'0 0 20px'}}>{p.shadow}</p>
        <h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.green,margin:'0 0 8px'}}>Gift</h3><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>{p.gift}</p></Card>
      <Card><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.gold,margin:'0 0 16px'}}>Reflection Prompts</h3><div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {p.prompts.map((pr,i)=>(<div key={i} style={{padding:'12px 16px',borderRadius:'8px',background:`${S.gold}06`,border:`1px solid ${S.gold}15`,fontFamily:S.fontBody,fontSize:'14px',color:S.text,fontStyle:'italic',lineHeight:1.5}}>{pr}</div>))}</div></Card>
      <Card style={{gridColumn:'1 / -1'}}><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.purple,margin:'0 0 16px'}}>Practices for {p.name}</h3><div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {p.practices.map((pr,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start',padding:'12px 16px',borderRadius:'8px',background:'rgba(255,255,255,0.02)',border:`1px solid ${S.border}`}}><span style={{fontFamily:S.fontHead,fontSize:'12px',color:S.purple,marginTop:'2px'}}>{i+1}.</span><span style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,lineHeight:1.5}}>{pr}</span></div>))}</div></Card>
      <Card style={{gridColumn:'1 / -1'}}><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.blue,margin:'0 0 4px'}}>What {p.name} develops</h3><p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textDim,margin:'0 0 16px'}}>The intelligence, character, capability, and consciousness this phase is cultivating.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'10px'}}>{[['Intelligence',p.dev.intelligence],['Character',p.dev.character],['Capability',p.dev.capability],['Consciousness',p.dev.consciousness]].map(([k,v],i)=>(<div key={i} style={{padding:'13px 14px',borderRadius:'10px',background:`${S.blue}0A`,border:`1px solid ${S.blue}1F`}}><div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.blue,letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'5px'}}>{k}</div><div style={{fontFamily:S.fontHead,fontSize:'14.5px',fontWeight:500,color:S.text,lineHeight:1.25}}>{v}</div></div>))}</div></Card>
    </div></div>);}

// ══ RHYTHM CALENDAR ══
function RhythmCalendarPage({profile,openCodex}){
  const SC=[{phase:0,start:'Mar 21',end:'Apr 19'},{phase:1,start:'Apr 20',end:'May 20'},{phase:2,start:'May 21',end:'Jun 20'},{phase:3,start:'Jun 21',end:'Jul 22'},{phase:4,start:'Jul 23',end:'Aug 22'},{phase:5,start:'Aug 23',end:'Sep 22'},{phase:6,start:'Sep 23',end:'Oct 22'},{phase:7,start:'Oct 23',end:'Nov 21'},{phase:8,start:'Nov 22',end:'Dec 21'},{phase:9,start:'Dec 22',end:'Jan 19'},{phase:10,start:'Jan 20',end:'Feb 18'},{phase:11,start:'Feb 19',end:'Mar 20'}];
  const now=new Date(),m=now.getMonth(),d=now.getDate();
  let csp=2; // default Gemini for June
  const checks=[[2,21],[3,20],[4,21],[5,21],[6,23],[7,23],[8,23],[9,23],[10,22],[11,22],[0,20],[1,19]];
  for(let i=0;i<12;i++){const[cm,cd]=checks[i];const[nm,nd]=checks[(i+1)%12];if(i<11){if((m===cm&&d>=cd)||(m===nm&&d<nd)){csp=i;break;}}else{if((m===cm&&d>=cd)||(m<2)||(m===nm&&d<nd))csp=i;}}
  const ap=PHASES[csp];
  return(<div><SectionTitle sub="The annual rhythm of the twelve phases">Rhythm Calendar</SectionTitle>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.gold}`,background:'linear-gradient(135deg, rgba(251,191,36,0.04), rgba(251,191,36,0.01))'}}>
      <div style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Current Cosmic Season</div>
      <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'12px'}}><span style={{fontSize:'40px'}}>{ap.icon}</span><div><div style={{fontFamily:S.fontHead,fontSize:'24px',color:S.gold}}>{ap.name}</div><div style={{fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted}}>{ap.sign} · {SC[csp].start} – {SC[csp].end}</div></div></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,fontStyle:'italic',lineHeight:1.6,margin:0}}>{ap.teaching}</p>
      <div style={{marginTop:'14px',padding:'12px 14px',borderRadius:'10px',background:'rgba(236,231,221,0.025)',border:`1px solid ${S.border}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'9.5px',color:S.gold,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>Practice this season</div>
        <div style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.text,lineHeight:1.55}}>{ap.practices[0]}</div></div></Card>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${ELEMENT_COLOR[ap.element]}`}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:ELEMENT_COLOR[ap.element],letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>The Codex for this season</div>
      <div style={{fontFamily:S.fontHead,fontSize:'20px',color:ELEMENT_COLOR[ap.element],marginBottom:'8px'}}>{CODEX.PARABLES[csp].title}</div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,lineHeight:1.7,margin:'0 0 12px'}}>{CODEX.PARABLES[csp].story}</p>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.text,lineHeight:1.6,margin:'0 0 16px'}}><span style={{fontFamily:S.fontSans,fontWeight:600,fontSize:'11px',color:ELEMENT_COLOR[ap.element]}}>THIS WEEK&nbsp;&nbsp;</span>{CODEX.PARABLES[csp].invitation}</p>
      <div style={{paddingTop:'14px',borderTop:`1px solid ${S.border}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'9.5px',color:S.gold,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'8px'}}>From the Psalm of {ap.name}</div>
        <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,fontStyle:'italic',lineHeight:1.7,margin:0}}>{CODEX.PSALMS[csp].response}</p>
      </div>
      {openCodex&&<div style={{display:'flex',justifyContent:'flex-end',marginTop:'14px'}}><SecondaryButton onClick={()=>openCodex(csp,'psalms')}>Open in the Codex \u2192</SecondaryButton></div>}
    </Card>
    <Card style={{marginBottom:'24px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 20px'}}>Annual Phase Cycle</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'10px'}}>{PHASES.map((ph,i)=>{const ic=i===csp;return(<div key={i} style={{padding:'14px',borderRadius:'10px',textAlign:'center',background:ic?`${S.gold}12`:'rgba(255,255,255,0.02)',border:`1px solid ${ic?S.gold+'40':S.border}`}}>
        <div style={{fontSize:'24px',marginBottom:'4px'}}>{ph.icon}</div><div style={{fontFamily:S.fontSans,fontSize:'12px',fontWeight:600,color:ic?S.gold:S.text,marginBottom:'2px'}}>{ph.name}</div><div style={{fontFamily:S.fontSans,fontSize:'10px',color:S.textDim}}>{SC[i].start} – {SC[i].end}</div>
        {ic&&<div style={{fontFamily:S.fontSans,fontSize:'9px',color:S.gold,marginTop:'4px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Active Now</div>}</div>);})}</div></Card>
    <Card><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 8px'}}>The Rhythm Within Each Phase</h3>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:'0 0 20px'}}>Every phase contains four micro-states — a rhythm within the rhythm.</p>
      <div style={{display:'flex',gap:'12px'}}>{MICRO_STATES.map((ms,i)=>(<div key={i} style={{flex:1,padding:'16px',borderRadius:'10px',textAlign:'center',background:profile.currentMicroState===i?S.goldDim:'rgba(255,255,255,0.02)',border:`1px solid ${profile.currentMicroState===i?S.gold+'40':S.border}`}}>
        <div style={{fontFamily:S.fontHead,fontSize:'14px',color:profile.currentMicroState===i?S.gold:S.text,marginBottom:'4px'}}>{ms}</div>
        <div style={{fontFamily:S.fontBody,fontSize:'12px',color:S.textDim}}>{['The spark. Something begins.','Growth. Energy increases.','Tension. Refinement required.','Completion. Wisdom gained.'][i]}</div></div>))}</div></Card>
    <Card style={{marginTop:'24px',borderLeft:`3px solid ${S.gold}`}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 4px'}}>Seasonal Gatherings</h3>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:'0 0 16px'}}>Each phase opens with a community Attunement gathering to read the new season together. The next openings:</p>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{getPhaseEvents().slice(0,4).map(ev=>{const ph=PHASES[ev.phaseIndex];const col=ELEMENT_COLOR[ph.element];return(<div key={ev.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'12px 14px',borderRadius:'10px',background:`${col}08`,border:`1px solid ${col}1F`}}>
        <span style={{fontSize:'22px',flexShrink:0}}>{ph.icon}</span>
        <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{ev.title}</div><div style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textMuted,marginTop:'2px'}}>Life seeks {ph.seeks} · {ph.func} Function</div></div>
        <div style={{textAlign:'right',flexShrink:0}}><div style={{fontFamily:S.fontMono,fontSize:'11px',color:col}}>{formatDate(ev.date)}</div><div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim}}>{ev.time}</div></div></div>);})}</div></Card></div>);}

// ══ WISDOM MODULE READER ══
function WisdomModuleView({track,module,locked,progress,setProgress,saveProgress,onBack}){
  const lesson=WISDOM_LESSONS[module.id];
  const rec=progress[module.id]||{};
  const done=!!rec.completedAt;
  const[refl,setRefl]=useState(rec.reflection||'');
  const[saved,setSaved]=useState(false);
  const persist=(patch)=>{const u={...progress,[module.id]:{...(progress[module.id]||{}),...patch}};setProgress(u);saveProgress(u);};
  const saveRefl=()=>{persist({reflection:refl});setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const toggleDone=()=>{const u={...progress};if(done){u[module.id]={...rec};delete u[module.id].completedAt;if(!u[module.id].reflection)delete u[module.id];}else{u[module.id]={...(rec),completedAt:new Date().toISOString()};}setProgress(u);saveProgress(u);};
  const idx=track.modules.findIndex(m=>m.id===module.id);
  const next=track.modules[idx+1];

  return(<div>
    <button onClick={()=>onBack()} style={{border:'none',background:'none',color:S.gold,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer',marginBottom:'18px',padding:0}}>← Back to {track.name}</button>

    {/* Module header */}
    <div style={{...glassCard,padding:'30px',marginBottom:'24px',background:'linear-gradient(135deg, rgba(224,182,92,0.07), rgba(236,231,221,0.012))',borderColor:'rgba(224,182,92,0.16)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'14px',flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'22px'}}>{track.icon}</span><Badge label={track.name} color={S.purple}/><span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'1px'}}>⏱ {module.duration}</span></div>
        {done&&<Badge label="Completed" color={S.green}/>}</div>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim,letterSpacing:'1px',marginBottom:'8px'}}>Module {idx+1} of {track.modules.length} · {track.origin}</div>
      <h1 style={{fontFamily:S.fontHead,fontSize:'30px',fontWeight:500,color:S.text,margin:'0 0 12px',letterSpacing:'-0.5px',lineHeight:1.12}}>{module.title}</h1>
      <p style={{fontFamily:S.fontBody,fontSize:'17px',color:S.textMuted,margin:0,lineHeight:1.65}}>{lesson?lesson.intro:module.desc}</p>
    </div>

    {!lesson?(<Card><EmptyState icon="✶" message="Full module content is being prepared. The outline above describes what it covers."/></Card>):(<div>
      {/* Objectives */}
      <Card style={{marginBottom:'24px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>What you'll learn</div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{lesson.objectives.map((o,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <span style={{flexShrink:0,width:'20px',height:'20px',borderRadius:'50%',border:`1px solid ${S.gold}55`,color:S.gold,fontFamily:S.fontMono,fontSize:'10px',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2px'}}>{i+1}</span>
          <span style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.text,lineHeight:1.5}}>{o}</span></div>))}</div>
      </Card>

      {/* Sections */}
      <div style={{display:'flex',flexDirection:'column',gap:'4px',marginBottom:'24px'}}>{lesson.sections.map((sec,i)=>(<Card key={i} style={{marginBottom:'12px'}}>
        <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 10px',letterSpacing:'-0.2px'}}>{sec.h}</h3>
        <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:0,lineHeight:1.75}}>{sec.p}</p></Card>))}</div>

      {/* Key concepts */}
      <Card style={{marginBottom:'24px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.purple,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>Key concepts</div>
        <div style={{display:'grid',gridTemplateColumns:lesson.concepts.length>2?'1fr 1fr':'1fr',gap:'10px'}}>{lesson.concepts.map((c,i)=>(<div key={i} style={{padding:'14px 16px',borderRadius:'10px',background:`${S.purple}08`,border:`1px solid ${S.purple}1F`}}>
          <div style={{fontFamily:S.fontHead,fontSize:'15px',fontWeight:600,color:S.purple,marginBottom:'4px'}}>{c.t}</div>
          <div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,lineHeight:1.5}}>{c.d}</div></div>))}</div>
      </Card>

      {/* Exercise */}
      <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.gold}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Practice</div>
        <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>{lesson.exercise.title}</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'18px'}}>{lesson.exercise.steps.map((stp,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <span style={{flexShrink:0,fontFamily:S.fontMono,fontSize:'12px',color:S.gold,marginTop:'2px'}}>{String(i+1).padStart(2,'0')}</span>
          <span style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.5}}>{stp}</span></div>))}</div>
        <TextInput label={lesson.exercise.reflection} value={refl} onChange={setRefl} placeholder="Write your response here — it saves with the module." multiline/>
        <div style={{display:'flex',alignItems:'center',gap:'12px',justifyContent:'flex-end'}}>{saved&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.green}}>Saved ✓</span>}<SecondaryButton onClick={saveRefl}>Save response</SecondaryButton></div>
      </Card>

      {/* Closing */}
      <Card style={{marginBottom:'24px',background:'linear-gradient(135deg, rgba(224,182,92,0.05), rgba(236,231,221,0.01))',borderColor:'rgba(224,182,92,0.14)'}}>
        <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.gold,fontStyle:'italic',margin:0,lineHeight:1.6}}>{lesson.closing}</p>
      </Card>

      {/* Complete + next */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
        <button onClick={toggleDone} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 22px',borderRadius:'9px',border:`1px solid ${done?S.green:S.gold}`,background:done?`${S.green}14`:S.gold,color:done?S.green:'#1A150A',fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}>
          <span style={{fontSize:'14px'}}>{done?'✓':''}</span>{done?'Completed — mark incomplete':'Mark module complete'}</button>
        {next&&!locked&&<SecondaryButton onClick={()=>onBack(next.id)}>Next: {next.title} →</SecondaryButton>}
      </div>
    </div>)}
  </div>);
}

// ══ WISDOM TRACKS ══
function WisdomTracksPage({profile,progress,setProgress,saveProgress}){
  const[st,setSt]=useState(null);const[openMod,setOpenMod]=useState(null);const cr=(LEVELS.find(l=>l.id===profile.level)||LEVELS[0]).rank;const locked=cr<4;
  const toggleC=id=>{if(locked)return;const u={...progress};const cur=u[id]||{};if(cur.completedAt){const n={...cur};delete n.completedAt;if(n.reflection)u[id]=n;else delete u[id];}else{u[id]={...cur,completedAt:new Date().toISOString()};}setProgress(u);saveProgress(u);};
  if(st){const t=WISDOM_TRACKS.find(x=>x.id===st);
    const om=openMod?t.modules.find(m=>m.id===openMod):null;
    if(om)return(<WisdomModuleView track={t} module={om} locked={locked} progress={progress} setProgress={setProgress} saveProgress={saveProgress} onBack={(nid)=>setOpenMod(nid||null)}/>);
    return(<div>
    <button onClick={()=>{setSt(null);setOpenMod(null);}} style={{border:'none',background:'none',color:S.purple,fontFamily:S.fontSans,fontSize:'14px',cursor:'pointer',marginBottom:'16px',padding:0}}>← Back to all traditions</button>
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.gold}`}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}><span style={{fontSize:'28px'}}>{t.icon}</span><div><h2 style={{fontFamily:S.fontHead,fontSize:'22px',color:S.text,margin:0}}>{t.name}</h2><div style={{fontFamily:S.fontSans,fontSize:'13px',color:S.textDim}}>{t.origin}</div></div></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.7,margin:0}}>{t.desc}</p></Card>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',marginBottom:'24px'}}>
      <Card><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.gold,margin:'0 0 12px'}}>Key Teachings</h3>{t.keyTeachings.map((x,i)=><div key={i} style={{padding:'8px 0',borderBottom:i<t.keyTeachings.length-1?`1px solid ${S.border}`:'none',fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted}}>{x}</div>)}</Card>
      <Card><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.purple,margin:'0 0 12px'}}>Connection to Pattern Literacy</h3><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,lineHeight:1.7,margin:0}}>{t.connectionToFramework}</p></Card></div>
    <Card style={{opacity:locked?0.5:1}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:locked?S.textDim:S.text,margin:'0 0 16px'}}>{locked&&'🔒 '}Modules</h3>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{t.modules.map(mod=>{const done=!!(progress[mod.id]&&progress[mod.id].completedAt);const has=!!WISDOM_LESSONS[mod.id];const hasNotes=!!(progress[mod.id]&&progress[mod.id].reflection);const openable=has&&!locked;return(<div key={mod.id} onClick={()=>{if(openable)setOpenMod(mod.id);}} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'14px',borderRadius:'10px',border:`1px solid ${done?S.green+'30':S.border}`,background:done?`${S.green}08`:'rgba(255,255,255,0.02)',cursor:openable?'pointer':(locked?'not-allowed':'default')}}>
        <div onClick={(e)=>{e.stopPropagation();toggleC(mod.id);}} title={done?'Mark incomplete':'Mark complete'} style={{width:'22px',height:'22px',borderRadius:'6px',flexShrink:0,marginTop:'2px',border:`2px solid ${done?S.green:S.border}`,background:done?S.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:700,cursor:locked?'not-allowed':'pointer'}}>{done?'✓':''}</div>
        <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:done?S.green:S.text}}>{mod.title}</div><div style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textMuted,marginTop:'2px'}}>{mod.desc}</div>
          <div style={{display:'flex',gap:'12px',alignItems:'center',marginTop:'6px',flexWrap:'wrap'}}><span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim}}>⏱ {mod.duration}</span>{has&&<span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.purple}}>● Full module</span>}{hasNotes&&<span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.gold}}>✎ Notes saved</span>}</div></div>
        {openable&&<span style={{color:S.textDim,fontSize:'16px',alignSelf:'center'}}>→</span>}</div>);})}</div></Card></div>);}
  return(<div><SectionTitle sub="Six ancient traditions that inform Pattern Literacy">Wisdom Tracks</SectionTitle>
    {locked&&<Card style={{marginBottom:'24px',borderColor:'rgba(251,191,36,0.2)'}}><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.gold,margin:0}}>🔒 Wisdom Tracks modules unlock at Practitioner level. Explore the traditions below — full coursework available at Level 4.</p></Card>}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>{WISDOM_TRACKS.map(t=>(<Card key={t.id} hover onClick={()=>setSt(t.id)}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}><span style={{fontSize:'28px'}}>{t.icon}</span><div><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:0}}>{t.name}</h3><div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{t.origin}</div></div></div>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:'0 0 12px',lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{t.desc}</p>
      {(()=>{const dn=t.modules.filter(m=>progress[m.id]&&progress[m.id].completedAt).length;return(<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}><span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textMuted}}>{dn} of {t.modules.length} modules</span><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.purple}}>Open →</span></div><div style={{height:'5px',borderRadius:'3px',background:'rgba(236,231,221,0.06)',overflow:'hidden'}}><div style={{height:'100%',width:`${dn/t.modules.length*100}%`,background:S.purple,borderRadius:'3px'}}/></div></div>);})()}</Card>))}</div></div>);}

// ══ LEARNING ══
// ══ LESSON READER ══
function LessonView({module,group,glevel,locked,progress,setProgress,saveProgress,onBack}){
  const lesson=LESSONS[module.id];
  const rec=progress[module.id]||{};
  const done=!!rec.completedAt;
  const[refl,setRefl]=useState(rec.reflection||'');
  const[saved,setSaved]=useState(false);
  const persist=(patch)=>{const u={...progress,[module.id]:{...(progress[module.id]||{}),...patch}};setProgress(u);saveProgress(u);};
  const saveRefl=()=>{persist({reflection:refl});setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const toggleDone=()=>{const u={...progress};if(done){u[module.id]={...rec};delete u[module.id].completedAt;if(!u[module.id].reflection)delete u[module.id];}else{u[module.id]={...(rec),completedAt:new Date().toISOString()};}setProgress(u);saveProgress(u);};
  const idx=group.modules.findIndex(m=>m.id===module.id);
  const next=group.modules[idx+1];

  return(<div>
    <button onClick={onBack} style={{border:'none',background:'none',color:S.gold,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer',marginBottom:'18px',padding:0}}>← Back to curriculum</button>

    {/* Lesson header */}
    <div style={{...glassCard,padding:'30px',marginBottom:'24px',background:'linear-gradient(135deg, rgba(224,182,92,0.07), rgba(236,231,221,0.012))',borderColor:'rgba(224,182,92,0.16)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'14px',flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}><Badge label={glevel.label} color={glevel.color}/><span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'1px'}}>⏱ {module.duration}</span></div>
        {done&&<Badge label="Completed" color={S.green}/>}</div>
      <h1 style={{fontFamily:S.fontHead,fontSize:'30px',fontWeight:500,color:S.text,margin:'0 0 12px',letterSpacing:'-0.5px',lineHeight:1.12}}>{module.title}</h1>
      <p style={{fontFamily:S.fontBody,fontSize:'17px',color:S.textMuted,margin:0,lineHeight:1.65}}>{lesson?lesson.intro:module.desc}</p>
    </div>

    {!lesson?(<Card><EmptyState icon="✶" message="Full lesson content for this module is being prepared. The outline above describes what it covers."/></Card>):(<div>
      {/* Objectives */}
      <Card style={{marginBottom:'24px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>What you'll learn</div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{lesson.objectives.map((o,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <span style={{flexShrink:0,width:'20px',height:'20px',borderRadius:'50%',border:`1px solid ${S.gold}55`,color:S.gold,fontFamily:S.fontMono,fontSize:'10px',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2px'}}>{i+1}</span>
          <span style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.text,lineHeight:1.5}}>{o}</span></div>))}</div>
      </Card>

      {/* Sections */}
      <div style={{display:'flex',flexDirection:'column',gap:'4px',marginBottom:'24px'}}>{lesson.sections.map((sec,i)=>(<Card key={i} style={{marginBottom:'12px'}}>
        <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 10px',letterSpacing:'-0.2px'}}>{sec.h}</h3>
        <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:0,lineHeight:1.75}}>{sec.p}</p></Card>))}</div>

      {/* Key concepts */}
      <Card style={{marginBottom:'24px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.purple,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>Key concepts</div>
        <div style={{display:'grid',gridTemplateColumns:lesson.concepts.length>2?'1fr 1fr':'1fr',gap:'10px'}}>{lesson.concepts.map((c,i)=>(<div key={i} style={{padding:'14px 16px',borderRadius:'10px',background:`${S.purple}08`,border:`1px solid ${S.purple}1F`}}>
          <div style={{fontFamily:S.fontHead,fontSize:'15px',fontWeight:600,color:S.purple,marginBottom:'4px'}}>{c.t}</div>
          <div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,lineHeight:1.5}}>{c.d}</div></div>))}</div>
      </Card>

      {/* Exercise */}
      <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.gold}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Practice</div>
        <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>{lesson.exercise.title}</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'18px'}}>{lesson.exercise.steps.map((st,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <span style={{flexShrink:0,fontFamily:S.fontMono,fontSize:'12px',color:S.gold,marginTop:'2px'}}>{String(i+1).padStart(2,'0')}</span>
          <span style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.5}}>{st}</span></div>))}</div>
        <TextInput label={lesson.exercise.reflection} value={refl} onChange={setRefl} placeholder="Write your response here — it saves with the lesson." multiline/>
        <div style={{display:'flex',alignItems:'center',gap:'12px',justifyContent:'flex-end'}}>{saved&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.green}}>Saved ✓</span>}<SecondaryButton onClick={saveRefl}>Save response</SecondaryButton></div>
      </Card>

      {/* Closing */}
      <Card style={{marginBottom:'24px',background:'linear-gradient(135deg, rgba(224,182,92,0.05), rgba(236,231,221,0.01))',borderColor:'rgba(224,182,92,0.14)'}}>
        <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.gold,fontStyle:'italic',margin:0,lineHeight:1.6}}>{lesson.closing}</p>
      </Card>

      {/* Complete + next */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
        <button onClick={toggleDone} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 22px',borderRadius:'9px',border:`1px solid ${done?S.green:S.gold}`,background:done?`${S.green}14`:S.gold,color:done?S.green:'#1A150A',fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}>
          <span style={{fontSize:'14px'}}>{done?'✓':''}</span>{done?'Completed — mark incomplete':'Mark lesson complete'}</button>
        {next&&!locked&&<SecondaryButton onClick={()=>onBack(next.id)}>Next: {next.title} →</SecondaryButton>}
      </div>
    </div>)}
  </div>);
}

// ══ LEARNING ══
// ══ LENS READER ══
function LensView({lens,progress,setProgress,saveProgress,onBack}){
  const d=LENS_DETAIL[lens.id];const c=lens.color;const key='lens-'+lens.id;
  const rec=progress[key]||{};
  const[refl,setRefl]=useState(rec.reflection||'');const[saved,setSaved]=useState(false);
  const saveRefl=()=>{const u={...progress,[key]:{...(progress[key]||{}),reflection:refl}};setProgress(u);saveProgress(u);setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const idx=LENSES.findIndex(l=>l.id===lens.id);const next=LENSES[idx+1];

  return(<div>
    <button onClick={()=>onBack()} style={{border:'none',background:'none',color:c,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer',marginBottom:'18px',padding:0}}>← Back to the Five Lenses</button>

    {/* Header */}
    <div style={{...glassCard,padding:'30px',marginBottom:'24px',borderLeft:`3px solid ${c}`,background:`linear-gradient(135deg, ${c}10, rgba(236,231,221,0.012))`,borderColor:`${c}28`}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:c,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'10px'}}>Lens {lens.number} of 5</div>
      <h1 style={{fontFamily:S.fontHead,fontSize:'32px',fontWeight:500,color:S.text,margin:'0 0 16px',letterSpacing:'-0.5px',lineHeight:1.1}}>{lens.title}</h1>
      <div style={{fontFamily:S.fontBody,fontSize:'19px',color:c,fontStyle:'italic',lineHeight:1.5}}>{lens.question}</div>
    </div>

    {/* Essence + reveals */}
    <Card style={{marginBottom:'24px'}}>
      <p style={{fontFamily:S.fontBody,fontSize:'17px',color:S.text,margin:'0 0 18px',lineHeight:1.7}}>{d.essence}</p>
      <div style={{padding:'14px 16px',borderRadius:'10px',background:`${c}0A`,border:`1px solid ${c}1F`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:c,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'5px'}}>What this lens reveals</div>
        <div style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.textMuted,lineHeight:1.55}}>{d.reveals}</div></div>
    </Card>

    {/* Sections */}
    <div style={{display:'flex',flexDirection:'column',marginBottom:'12px'}}>{d.sections.map((sec,i)=>(<Card key={i} style={{marginBottom:'12px'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 10px',letterSpacing:'-0.2px'}}>{sec.h}</h3>
      <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:0,lineHeight:1.75}}>{sec.p}</p></Card>))}</div>

    {/* Examples explained */}
    <Card style={{marginBottom:'24px'}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:c,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>What to look for</div>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{d.examples.map((ex,i)=>(<div key={i} style={{display:'flex',gap:'14px',alignItems:'flex-start',padding:'13px 16px',borderRadius:'10px',background:`${c}07`,border:`1px solid ${c}18`}}>
        <span style={{flexShrink:0,fontFamily:S.fontHead,fontSize:'14px',fontWeight:600,color:c,minWidth:'140px'}}>{ex.t}</span>
        <span style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.textMuted,lineHeight:1.5}}>{ex.d}</span></div>))}</div>
    </Card>

    {/* Worked reading */}
    <Card style={{marginBottom:'24px'}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>A reading through this lens</div>
      <div style={{marginBottom:'12px'}}><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim,fontWeight:600}}>Situation</span>
        <p style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.text,fontStyle:'italic',margin:'4px 0 0',lineHeight:1.55}}>"{d.worked.situation}"</p></div>
      <div style={{padding:'14px 16px',borderRadius:'10px',background:`${c}0A`,border:`1px solid ${c}1F`}}><span style={{fontFamily:S.fontSans,fontSize:'12px',color:c,fontWeight:600}}>Reading</span>
        <p style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.textMuted,margin:'4px 0 0',lineHeight:1.6}}>{d.worked.read}</p></div>
    </Card>

    {/* Pitfall */}
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${S.red}`}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.red,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Common pitfall</div>
      <p style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.textMuted,margin:0,lineHeight:1.65}}>{d.pitfall}</p>
    </Card>

    {/* Practice */}
    <Card style={{marginBottom:'24px',borderLeft:`3px solid ${c}`}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:c,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Practice</div>
      <h3 style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>{d.practice.title}</h3>
      <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'18px'}}>{d.practice.steps.map((st,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
        <span style={{flexShrink:0,fontFamily:S.fontMono,fontSize:'12px',color:c,marginTop:'2px'}}>{String(i+1).padStart(2,'0')}</span>
        <span style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.5}}>{st}</span></div>))}</div>
      <TextInput label={d.practice.reflection} value={refl} onChange={setRefl} placeholder="Write your response here — it saves with the lens." multiline/>
      <div style={{display:'flex',alignItems:'center',gap:'12px',justifyContent:'flex-end'}}>{saved&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.green}}>Saved ✓</span>}<SecondaryButton onClick={saveRefl}>Save response</SecondaryButton></div>
    </Card>

    {/* Next lens */}
    <div style={{display:'flex',justifyContent:'flex-end'}}>{next&&<SecondaryButton onClick={()=>onBack(next.id)}>Next: Lens {next.number} — {next.title} →</SecondaryButton>}</div>
  </div>);
}

// ══ PHASES × LENSES MAP (Cosmic Reality Framework) ══
function PhaseLensMapView({profile}){
  const[sel,setSel]=useState(profile.currentPhase!==null?profile.currentPhase:0);
  const p=PHASES[sel];const d=PHASE_DETAIL[sel];
  // source → surface, matching the document's Complete Cosmic Mapping
  const layers=[
    { lens:LENSES[0], label:'Intelligent Order', line:`Life seeks ${p.seeks}.`, note:d.io },
    { lens:LENSES[1], label:'Structure', line:`${p.func} Function — to ${p.funcPurpose.toLowerCase()}.`, note:d.structure },
    { lens:LENSES[2], label:'Pattern', line:p.patternWord+'.', note:d.pattern },
    { lens:LENSES[3], label:'Rhythm', line:p.rhythmWord+'.', note:d.rhythm },
    { lens:LENSES[4], label:'Events', line:p.eventsList.join(' · '), note:d.events },
  ];

  return(<div>
    {/* Core teaching */}
    <Card style={{marginBottom:'24px',borderColor:'rgba(224,182,92,0.16)',background:'linear-gradient(135deg, rgba(224,182,92,0.05), rgba(155,143,199,0.03) 60%, rgba(236,231,221,0.01))'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'20px',fontWeight:500,color:S.gold,margin:'0 0 12px',letterSpacing:'-0.3px'}}>The Cosmic Reality Framework</h3>
      <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.textMuted,margin:'0 0 14px',lineHeight:1.7}}>Each of the twelve phases is a complete vertical expression of all five layers. A phase is not contained in one lens — it descends from <span style={{color:S.gold}}>Intelligent Order</span> through <span style={{color:LENSES[1].color}}>Structure</span>, <span style={{color:LENSES[2].color}}>Pattern</span>, and <span style={{color:LENSES[3].color}}>Rhythm</span>, all the way down to the <span style={{color:LENSES[4].color}}>Events</span> you live.</p>
      <div style={{padding:'16px 18px',borderRadius:'10px',background:'rgba(236,231,221,0.025)',border:`1px solid ${S.border}`}}>
        {['Every event is an expression of a rhythm.','Every rhythm is the movement of a pattern.','Every pattern emerges from a structure.','Every structure serves an Intelligent Order.'].map((l,i)=>(<div key={i} style={{fontFamily:S.fontBody,fontSize:'15px',color:i===3?S.gold:S.text,fontStyle:'italic',lineHeight:1.7}}>{l}</div>))}
      </div>
    </Card>

    {/* Phase selector */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:'8px',marginBottom:'20px'}}>{PHASES.map((ph,i)=>(<button key={i} onClick={()=>setSel(i)} style={{padding:'10px 4px',borderRadius:'10px',border:`1px solid ${sel===i?S.gold:S.border}`,background:sel===i?S.goldDim:'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',transition:'all 0.2s'}}>
      <span style={{fontSize:'20px'}}>{ph.icon}</span><span style={{fontFamily:S.fontSans,fontSize:'10px',color:sel===i?S.gold:S.textMuted,fontWeight:sel===i?600:400}}>{ph.name}</span></button>))}</div>

    {/* Phase header */}
    <Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.gold}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><span style={{fontSize:'30px'}}>{p.icon}</span>
          <div><div style={{fontFamily:S.fontHead,fontSize:'22px',fontWeight:500,color:S.text}}>{p.name}</div>
            <div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'1px'}}>{p.sign} · {p.func} Function · phase {sel+1} of 12</div></div></div>
        <Badge label={'to '+p.funcPurpose.toLowerCase()} color={S.gold}/></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.gold,fontStyle:'italic',margin:'14px 0 0',lineHeight:1.6}}>{p.teaching}</p>
    </Card>

    {/* Vertical slice through the five layers */}
    <div style={{display:'flex',flexDirection:'column',gap:'2px',marginBottom:'14px'}}>
      {layers.map((row,i)=>{const c=row.lens.color;return(<div key={row.lens.id}>
        <Card style={{borderLeft:`3px solid ${c}`,padding:'16px 20px',background:`${c}08`,borderRadius: i===0?'14px 14px 4px 4px':i===layers.length-1?'4px 4px 14px 14px':'4px'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:'10px',marginBottom:'5px',flexWrap:'wrap'}}>
            <span style={{fontFamily:S.fontMono,fontSize:'10px',color:c,letterSpacing:'1.5px',minWidth:'135px'}}>{row.label.toUpperCase()}</span>
            <span style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text}}>{row.line}</span></div>
          <div style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.textMuted,lineHeight:1.6}}>{row.note}</div>
        </Card>
        {i<layers.length-1&&<div style={{textAlign:'center',color:S.textDim,fontSize:'12px',lineHeight:1}}>↓</div>}
      </div>);})}
    </div>
    <p style={{fontFamily:S.fontBody,fontSize:'12.5px',color:S.textDim,margin:'0 0 24px',textAlign:'center',fontStyle:'italic'}}>Read top-down to descend from source to surface; bottom-up to trace any event back to the Intelligent Order it serves.</p>

    {/* What this phase develops */}
    <Card style={{borderLeft:`3px solid ${S.purple}`}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.purple,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>What this phase develops</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        {[['Intelligence',p.dev.intelligence],['Character',p.dev.character],['Capability',p.dev.capability],['Consciousness',p.dev.consciousness]].map(([k,v],i)=>(<div key={i} style={{padding:'13px 16px',borderRadius:'10px',background:`${S.purple}08`,border:`1px solid ${S.purple}1F`}}>
          <div style={{fontFamily:S.fontMono,fontSize:'9.5px',color:S.purple,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'4px'}}>{k}</div>
          <div style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text}}>{v}</div></div>))}
      </div>
    </Card>
  </div>);
}

function LearningPage({profile,progress,setProgress,saveProgress}){
  const[tab,setTab]=useState('curriculum');const[openId,setOpenId]=useState(null);const[openLens,setOpenLens]=useState(null);const cr=(LEVELS.find(l=>l.id===profile.level)||LEVELS[0]).rank;
  const toggleC=id=>{const u={...progress};if(u[id]&&u[id].completedAt){u[id]={...u[id]};delete u[id].completedAt;if(!u[id].reflection)delete u[id];}else{u[id]={...(u[id]||{}),completedAt:new Date().toISOString()};}setProgress(u);saveProgress(u);};
  const tm=CURRICULUM_MODULES.reduce((s,g)=>s+g.modules.length,0);const cc=Object.keys(progress).filter(k=>k.startsWith('t')&&progress[k]&&progress[k].completedAt).length;

  if(openId){
    let mod=null,group=null;for(const g of CURRICULUM_MODULES){const m=g.modules.find(x=>x.id===openId);if(m){mod=m;group=g;break;}}
    if(mod){const gl=LEVELS.find(l=>l.id===group.level)||LEVELS[0];const locked=gl.rank>cr;
      return(<div><SectionTitle sub={group.title.replace(/—.*/,'').trim()}>Lesson</SectionTitle>
        <LessonView module={mod} group={group} glevel={gl} locked={locked} progress={progress} setProgress={setProgress} saveProgress={saveProgress} onBack={(nextId)=>setOpenId(typeof nextId==='string'?nextId:null)}/></div>);}
  }

  if(openLens){const lens=LENSES.find(l=>l.id===openLens);if(lens){
    return(<div><SectionTitle sub="The Attuned Framework">The Five Lenses</SectionTitle>
      <LensView lens={lens} progress={progress} setProgress={setProgress} saveProgress={saveProgress} onBack={(nextId)=>setOpenLens(typeof nextId==='string'?nextId:null)}/></div>);}
  }

  return(<div><SectionTitle sub="Your Pattern Literacy curriculum">Learning Path</SectionTitle>
    <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
      <button onClick={()=>setTab('curriculum')} style={{padding:'8px 20px',borderRadius:'9px',border:`1px solid ${tab==='curriculum'?S.gold:S.border}`,background:tab==='curriculum'?S.goldDim:'transparent',color:tab==='curriculum'?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',fontWeight:500,cursor:'pointer'}}>Curriculum</button>
      <button onClick={()=>setTab('lenses')} style={{padding:'8px 20px',borderRadius:'9px',border:`1px solid ${tab==='lenses'?S.gold:S.border}`,background:tab==='lenses'?S.goldDim:'transparent',color:tab==='lenses'?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',fontWeight:500,cursor:'pointer'}}>The Five Lenses</button>
      <button onClick={()=>setTab('map')} style={{padding:'8px 20px',borderRadius:'9px',border:`1px solid ${tab==='map'?S.gold:S.border}`,background:tab==='map'?S.goldDim:'transparent',color:tab==='map'?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',fontWeight:500,cursor:'pointer'}}>Phases &amp; Lenses</button></div>
    {tab==='lenses'?(<div>
      <Card style={{marginBottom:'24px',borderColor:'rgba(224,182,92,0.15)',background:'linear-gradient(135deg, rgba(224,182,92,0.04), rgba(224,182,92,0.01))'}}><h3 style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:S.gold,margin:'0 0 8px'}}>The Attuned Framework</h3><p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:0}}>Members learn to interpret every experience through five lenses.</p></Card>
      <Card style={{marginBottom:'24px'}}><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
        {['EVENT','RHYTHM','PATTERN','STRUCTURE','INTELLIGENT ORDER'].map((layer,i)=>(<React.Fragment key={layer}><div style={{padding:'8px 24px',borderRadius:'8px',textAlign:'center',background:`${LENSES[4-i]?.color||S.textDim}12`,border:`1px solid ${LENSES[4-i]?.color||S.textDim}25`,fontFamily:S.fontMono,fontSize:'11px',letterSpacing:'1.5px',color:LENSES[4-i]?.color||S.textDim,width:`${60+i*8}%`}}>{layer}</div>{i<4&&<span style={{color:S.textDim,fontSize:'14px'}}>↓</span>}</React.Fragment>))}</div></Card>
      {LENSES.map(lens=>{const hasRefl=!!(progress['lens-'+lens.id]&&progress['lens-'+lens.id].reflection);return(<Card key={lens.id} hover onClick={()=>setOpenLens(lens.id)} style={{marginBottom:'16px',borderLeft:`3px solid ${lens.color}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <h3 style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:lens.color,margin:0}}>Lens {lens.number} — {lens.title}</h3>
          <span style={{color:lens.color,fontSize:'16px'}}>›</span></div>
        <div style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,fontStyle:'italic',padding:'12px 16px',borderRadius:'8px',background:`${lens.color}08`,border:`1px solid ${lens.color}15`,marginBottom:'12px'}}>{lens.question}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'12px'}}>{lens.examples.map((ex,i)=><span key={i} style={{padding:'4px 12px',borderRadius:'16px',background:`${lens.color}10`,border:`1px solid ${lens.color}20`,fontFamily:S.fontSans,fontSize:'12px',color:lens.color}}>{ex}</span>)}</div>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}><span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:lens.color}}>● Full lens guide</span>{hasRefl&&<span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.purple}}>✎ Notes saved</span>}</div></Card>);})}
    </div>):tab==='map'?(<div><PhaseLensMapView profile={profile}/></div>):(<div>
      <Card style={{marginBottom:'24px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><span style={{fontFamily:S.fontSans,fontSize:'14px',color:S.text,fontWeight:600}}>Overall Progress</span><span style={{fontFamily:S.fontHead,fontSize:'15px',color:S.gold}}>{cc}/{tm}</span></div>
        <div style={{height:'6px',borderRadius:'3px',background:'rgba(236,231,221,0.06)'}}><div style={{height:'100%',borderRadius:'3px',width:`${tm>0?(cc/tm*100):0}%`,background:`linear-gradient(90deg, ${S.purple}, ${S.gold})`,transition:'width 0.5s'}}/></div></Card>
      <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>{CURRICULUM_MODULES.map((group,gi)=>{const gl=LEVELS.find(l=>l.id===group.level)||LEVELS[0];const lk=gl.rank>cr;const gc=group.modules.filter(m=>progress[m.id]&&progress[m.id].completedAt).length;
        return(<Card key={gi} style={{opacity:lk?0.55:1}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}><div><h3 style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:lk?S.textDim:S.text,margin:'0 0 4px'}}>{lk&&'🔒 '}{group.title}</h3><span style={{fontFamily:S.fontMono,fontSize:'11px',color:S.textDim}}>{gc}/{group.modules.length} completed</span></div><Badge label={gl.label} color={gl.color}/></div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{group.modules.map(mod=>{const rec=progress[mod.id]||{};const done=!!rec.completedAt;const hasContent=!!LESSONS[mod.id];const hasRefl=!!rec.reflection;return(<div key={mod.id} onClick={()=>!lk&&setOpenId(mod.id)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'10px',border:`1px solid ${done?S.green+'30':S.border}`,background:done?`${S.green}08`:'rgba(236,231,221,0.018)',cursor:lk?'not-allowed':'pointer',transition:'all 0.2s'}}>
            <div onClick={(e)=>{e.stopPropagation();if(!lk)toggleC(mod.id);}} title={done?'Mark incomplete':'Mark complete'} style={{width:'22px',height:'22px',borderRadius:'6px',flexShrink:0,border:`2px solid ${done?S.green:S.borderLight}`,background:done?S.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:'#0B0A12',fontSize:'12px',fontWeight:700,cursor:lk?'not-allowed':'pointer'}}>{done?'✓':''}</div>
            <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:done?S.green:S.text}}>{mod.title}</div><div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,marginTop:'2px'}}>{mod.desc}</div>
              <div style={{display:'flex',gap:'10px',alignItems:'center',marginTop:'7px'}}><span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim}}>⏱ {mod.duration}</span>{hasContent&&<span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.gold}}>● Full lesson</span>}{hasRefl&&<span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.purple}}>✎ Notes saved</span>}</div></div>
            <span style={{color:lk?S.textDim:S.gold,fontSize:'16px',flexShrink:0}}>{lk?'':'›'}</span></div>);})}</div></Card>);})}</div>
    </div>)}</div>);}

// ══ COMMUNITY ══
function CommunityPage({profile,posts,setPosts,savePosts}){
  const[np,setNp]=useState('');const[filter,setFilter]=useState('all');const CATS=['all','reflection','question','insight','practice'];
  const addP=()=>{if(!np.trim())return;const p={id:'p-'+Date.now(),author:profile.name||'Attuned Member',level:profile.level,content:np.trim(),category:'reflection',date:new Date().toISOString(),reactions:{},replies:[]};const u=[p,...posts];setPosts(u);savePosts(u);setNp('');};
  const toggleR=(pid,emoji)=>{const u=posts.map(p=>{if(p.id!==pid)return p;const r={...p.reactions};r[emoji]=(r[emoji]||0)>0?r[emoji]-1:(r[emoji]||0)+1;if(r[emoji]===0)delete r[emoji];return{...p,reactions:r};});setPosts(u);savePosts(u);};
  const setCat=(pid,cat)=>{const u=posts.map(p=>p.id===pid?{...p,category:cat}:p);setPosts(u);savePosts(u);};
  const delP=pid=>{const u=posts.filter(p=>p.id!==pid);setPosts(u);savePosts(u);};
  const filt=filter==='all'?posts:posts.filter(p=>p.category===filter);
  return(<div><SectionTitle sub="Share reflections, ask questions, and connect with practitioners">Community Feed</SectionTitle>
    <Card style={{marginBottom:'24px'}}><textarea value={np} onChange={e=>setNp(e.target.value)} placeholder="Share a reflection, insight, or question..." style={{width:'100%',padding:'14px',border:`1px solid ${S.border}`,borderRadius:'10px',background:'rgba(255,255,255,0.03)',color:S.text,fontFamily:S.fontBody,fontSize:'15px',outline:'none',resize:'vertical',minHeight:'80px',boxSizing:'border-box'}} onFocus={e=>e.target.style.borderColor=S.purple} onBlur={e=>e.target.style.borderColor=S.border}/>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:'12px'}}><PrimaryButton onClick={addP} disabled={!np.trim()}>Post to Community</PrimaryButton></div></Card>
    <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>{CATS.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:'6px 16px',borderRadius:'20px',border:`1px solid ${filter===c?S.purple:S.border}`,background:filter===c?'rgba(167,139,250,0.1)':'transparent',color:filter===c?S.purple:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer',textTransform:'capitalize'}}>{c}</button>)}</div>
    {filt.length===0?<EmptyState icon="◎" message="No posts yet. Be the first to share."/>:
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>{filt.map(post=>{const pl=LEVELS.find(l=>l.id===post.level)||LEVELS[0];return(<Card key={post.id}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'50%',background:`linear-gradient(135deg, ${pl.color}40, ${pl.color}20)`,border:`1px solid ${pl.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'14px',color:pl.color}}>{(post.author||'A')[0].toUpperCase()}</div>
          <div><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{post.author}</div>
            <div style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim}}>{relativeTime(post.date)}<span style={{margin:'0 6px'}}>·</span><span style={{color:pl.color}}>{pl.label}</span></div></div></div>
        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
          <select value={post.category} onChange={e=>setCat(post.id,e.target.value)} style={{padding:'4px 8px',borderRadius:'6px',border:`1px solid ${S.border}`,background:'transparent',color:S.textDim,fontFamily:S.fontSans,fontSize:'11px',cursor:'pointer',outline:'none'}}>{CATS.filter(c=>c!=='all').map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button onClick={()=>delP(post.id)} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'16px',padding:'4px'}}>×</button></div></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,margin:'0 0 12px',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{post.content}</p>
      <div style={{display:'flex',gap:'8px'}}>{['🔥','💎','🌀','🙏'].map(emoji=><button key={emoji} onClick={()=>toggleR(post.id,emoji)} style={{padding:'4px 10px',borderRadius:'16px',border:`1px solid ${post.reactions?.[emoji]?S.purple+'40':S.border}`,background:post.reactions?.[emoji]?'rgba(167,139,250,0.08)':'transparent',color:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer'}}>{emoji} {post.reactions?.[emoji]||''}</button>)}</div></Card>);})}</div>}</div>);}

// ══ COACHING ══
function CoachingPage({profile,guides,coachingNotes,setCoachingNotes,saveCoachingNotes}){
  const[sg,setSg]=useState(null);const[nn,setNn]=useState('');
  const addN=()=>{if(!nn.trim())return;const n={id:'cn-'+Date.now(),date:new Date().toISOString().split('T')[0],content:nn.trim(),guideId:sg};const u=[n,...coachingNotes];setCoachingNotes(u);saveCoachingNotes(u);setNn('');};
  return(<div><SectionTitle sub="Connect with certified Pattern Literacy Guides">Coaching</SectionTitle>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'24px'}}>{guides.map(g=>{const a=sg===g.id;return(<Card key={g.id} hover onClick={()=>setSg(a?null:g.id)} style={{borderColor:a?S.gold+'40':undefined}}>
      <div style={{width:'48px',height:'48px',borderRadius:'50%',marginBottom:'12px',background:`linear-gradient(135deg, ${S.gold}30, ${S.gold}10)`,border:`1px solid ${S.gold}25`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'18px',color:S.gold}}>{g.name.split(' ').map(n=>n[0]).join('')}</div>
      <h3 style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text,margin:'0 0 4px'}}>{g.name}</h3>
      <div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.purple,marginBottom:'8px'}}>{g.specialty}</div>
      <p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textMuted,margin:0,lineHeight:1.5}}>{g.bio}</p></Card>);})}</div>
    <Card style={{marginBottom:'24px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 16px'}}>Session Notes</h3>
      <TextInput label="Add a coaching note or reflection" value={nn} onChange={setNn} placeholder="What did you discuss? What alignment action was identified?" multiline/>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={addN} disabled={!nn.trim()}>Save Note</PrimaryButton></div></Card>
    {coachingNotes.length===0?<EmptyState icon="◇" message="No coaching notes yet. Book a session with a Guide to get started."/>:
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{coachingNotes.map(n=>{const g=guides.find(x=>x.id===n.guideId);return(<Card key={n.id}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{formatDate(n.date)}</span>{g&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.gold}}>{g.name}</span>}</div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:0,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{n.content}</p></Card>);})}</div>}</div>);}

// ══ ATTUNEMENT CIRCLES ══
function CirclesPage({events,circleNotes,setCircleNotes,saveCircleNotes}){
  const[nn,setNn]=useState('');const[na,setNa]=useState('');const ce=events.filter(e=>e.type==='circle');const up=ce.filter(e=>new Date(e.date)>=new Date());
  const addN=()=>{if(!nn.trim())return;const n={id:'cr-'+Date.now(),date:new Date().toISOString().split('T')[0],reflection:nn.trim(),alignmentAction:na.trim()};const u=[n,...circleNotes];setCircleNotes(u);saveCircleNotes(u);setNn('');setNa('');};
  return(<div><SectionTitle sub="Weekly gatherings for pattern reading and aligned action">Attunement Circles</SectionTitle>
    <Card style={{marginBottom:'24px',borderColor:'rgba(251,191,36,0.15)',background:'linear-gradient(135deg, rgba(251,191,36,0.04), rgba(251,191,36,0.01))'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'18px',color:S.gold,margin:'0 0 4px'}}>{ATTUNEMENT_CIRCLE.name}</h3>
      <p style={{fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,margin:'0 0 20px'}}>Weekly {ATTUNEMENT_CIRCLE.duration} Gathering</p>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{ATTUNEMENT_CIRCLE.segments.map((seg,i)=>(<div key={i} style={{display:'flex',gap:'14px',alignItems:'flex-start',padding:'14px',borderRadius:'10px',background:'rgba(255,255,255,0.02)',border:`1px solid ${S.border}`}}>
        <div style={{width:'36px',height:'36px',borderRadius:'50%',flexShrink:0,background:`${S.gold}12`,border:`1px solid ${S.gold}25`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'13px',color:S.gold}}>{i+1}</div>
        <div style={{flex:1}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{seg.title}</span><span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.gold}}>{seg.duration}</span></div>
          <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>{seg.desc}</p></div></div>))}</div></Card>
    {up.length>0&&<Card style={{marginBottom:'24px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 16px'}}>Upcoming Circles</h3>
      {up.map(e=><div key={e.id} style={{padding:'12px 0',borderBottom:`1px solid ${S.border}`}}><div style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text}}>{e.title}</div><div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.gold,marginTop:'4px'}}>{formatDate(e.date)} · {e.time}</div></div>)}</Card>}
    <Card style={{marginBottom:'24px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 16px'}}>Circle Reflection</h3>
      <TextInput label="What patterns did you notice this week?" value={nn} onChange={setNn} placeholder="Reflect on the patterns discussed in the circle..." multiline/>
      <TextInput label="Alignment Action" value={na} onChange={setNa} placeholder="What one aligned action are you committing to?"/>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={addN} disabled={!nn.trim()}>Save Reflection</PrimaryButton></div></Card>
    {circleNotes.length>0&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{circleNotes.map(n=><Card key={n.id}>
      <div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim,marginBottom:'8px'}}>{formatDate(n.date)}</div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:'0 0 8px',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{n.reflection}</p>
      {n.alignmentAction&&<div style={{padding:'10px 14px',borderRadius:'8px',background:`${S.gold}06`,border:`1px solid ${S.gold}15`}}>
        <div style={{fontFamily:S.fontSans,fontSize:'11px',color:S.gold,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'4px'}}>Alignment Action</div>
        <div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.text}}>{n.alignmentAction}</div></div>}</Card>)}</div>}</div>);}

// ══ EVENTS ══
function EventsPage({events,announcements}){
  const[tab,setTab]=useState('events');const now=new Date();const allEv=[...events,...getPhaseEvents()];const up=allEv.filter(e=>new Date(e.date)>=now).sort((a,b)=>new Date(a.date)-new Date(b.date));const past=allEv.filter(e=>new Date(e.date)<now);
  const tc={workshop:S.purple,circle:S.gold,course:S.green,qa:S.blue};
  return(<div><SectionTitle sub="Workshops, seasonal gatherings, and announcements">Events & Announcements</SectionTitle>
    <div style={{display:'flex',gap:'4px',marginBottom:'24px',background:'rgba(255,255,255,0.03)',borderRadius:'10px',padding:'4px'}}>
      {['events','announcements'].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:tab===t?'rgba(167,139,250,0.12)':'transparent',color:tab===t?S.purple:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,cursor:'pointer',textTransform:'capitalize'}}>{t}</button>)}</div>
    {tab==='events'&&<div>
      {up.length>0&&<><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.textMuted,margin:'0 0 16px',textTransform:'uppercase',letterSpacing:'1px'}}>Upcoming</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'32px'}}>{up.map(e=>{const isPhase=e.type==='phase'&&e.phaseIndex!=null;const col=isPhase?ELEMENT_COLOR[PHASES[e.phaseIndex].element]:(tc[e.type]||S.purple);const dd=new Date(e.date+'T12:00:00');return(<Card key={e.id} hover>
          <div style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
            <div style={{width:'56px',flexShrink:0,textAlign:'center',padding:'8px',borderRadius:'10px',background:`${col}12`,border:`1px solid ${col}25`}}>
              {isPhase?<div style={{fontSize:'22px',lineHeight:1.15}}>{PHASES[e.phaseIndex].icon}</div>:<div style={{fontFamily:S.fontHead,fontSize:'20px',color:col,lineHeight:1}}>{dd.getDate()}</div>}
              <div style={{fontFamily:S.fontSans,fontSize:'10px',color:S.textMuted,textTransform:'uppercase'}}>{dd.toLocaleDateString('en-US',{month:'short'})}{isPhase?' '+dd.getDate():''}</div></div>
            <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'15px',fontWeight:600,color:S.text}}>{e.title}</div>
              <div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.gold,margin:'4px 0'}}>{e.time}</div>
              <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>{e.desc}</p></div>
            <Badge label={isPhase?'season':e.type} color={col}/></div></Card>);})}</div></>}
      {past.length>0&&<><h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.textDim,margin:'0 0 16px',textTransform:'uppercase',letterSpacing:'1px'}}>Past</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',opacity:0.6}}>{past.map(e=><Card key={e.id}><div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontFamily:S.fontSans,fontSize:'14px',color:S.textMuted}}>{e.title}</span><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{formatDate(e.date)}</span></div></Card>)}</div></>}
    </div>}
    {tab==='announcements'&&<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>{announcements.map(a=><Card key={a.id}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:0}}>{a.title}</h3><span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{formatDate(a.date)}</span></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:0,lineHeight:1.6}}>{a.content}</p></Card>)}</div>}</div>);}

// ══ JOURNAL ══
function JournalPage({profile,entries,setEntries,saveEntries}){
  const[comp,setComp]=useState(false);const[draft,setDraft]=useState({title:'',content:'',phase:profile.currentPhase,microState:profile.currentMicroState||0,patternName:'',lens:null});
  const addE=()=>{if(!draft.title.trim()||!draft.content.trim())return;const e={id:'j-'+Date.now(),...draft,date:new Date().toISOString().split('T')[0]};const u=[e,...entries];setEntries(u);saveEntries(u);setDraft({title:'',content:'',phase:profile.currentPhase,microState:profile.currentMicroState||0,patternName:'',lens:null});setComp(false);};
  const delE=id=>{const u=entries.filter(e=>e.id!==id);setEntries(u);saveEntries(u);};
  return(<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
    <SectionTitle sub="Track your pattern readings and reflections">Pattern Journal</SectionTitle>
    <PrimaryButton onClick={()=>setComp(!comp)}>{comp?'Cancel':'+ New Entry'}</PrimaryButton></div>
    {comp&&<Card style={{marginBottom:'24px',borderColor:S.purple+'30'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 16px'}}>New Journal Entry</h3>
      <TextInput label="Title" value={draft.title} onChange={v=>setDraft({...draft,title:v})} placeholder="What are you noticing?"/>
      <TextInput label="Pattern Name (if known)" value={draft.patternName} onChange={v=>setDraft({...draft,patternName:v})} placeholder="e.g. Hidden Preparation"/>
      <div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Primary Lens</label>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{LENSES.map(l=><button key={l.id} onClick={()=>setDraft({...draft,lens:draft.lens===l.id?null:l.id})} style={{padding:'6px 12px',borderRadius:'6px',border:`1px solid ${draft.lens===l.id?l.color:S.border}`,background:draft.lens===l.id?`${l.color}12`:'transparent',color:draft.lens===l.id?l.color:S.textDim,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer'}}>{l.title}</button>)}</div></div>
      <div style={{display:'flex',gap:'16px',marginBottom:'16px'}}>
        <div style={{flex:1}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Phase</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{PHASES.map((p,i)=><button key={i} onClick={()=>setDraft({...draft,phase:draft.phase===i?null:i})} style={{padding:'4px 8px',borderRadius:'6px',border:`1px solid ${draft.phase===i?S.purple:S.border}`,background:draft.phase===i?'rgba(167,139,250,0.1)':'transparent',color:draft.phase===i?S.purple:S.textDim,fontSize:'14px',cursor:'pointer'}} title={p.name}>{p.icon}</button>)}</div></div>
        <div><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Micro-State</label>
          <div style={{display:'flex',gap:'6px'}}>{MICRO_STATES.map((ms,i)=><button key={i} onClick={()=>setDraft({...draft,microState:i})} style={{padding:'4px 10px',borderRadius:'6px',border:`1px solid ${draft.microState===i?S.gold:S.border}`,background:draft.microState===i?S.goldDim:'transparent',color:draft.microState===i?S.gold:S.textDim,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer'}}>{ms.slice(0,4)}</button>)}</div></div></div>
      <TextInput label="Reflection" value={draft.content} onChange={v=>setDraft({...draft,content:v})} placeholder="What is this pattern teaching you?" multiline/>
      <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}><SecondaryButton onClick={()=>setComp(false)}>Cancel</SecondaryButton><PrimaryButton onClick={addE} disabled={!draft.title.trim()||!draft.content.trim()}>Save Entry</PrimaryButton></div></Card>}
    {entries.length===0?<EmptyState icon="◉" message="Your journal is empty. Begin tracking your patterns." action="+ New Entry" onAction={()=>setComp(true)}/>:
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>{entries.map(entry=>{const el=entry.lens?LENSES.find(l=>l.id===entry.lens):null;return(<Card key={entry.id}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 6px'}}>{entry.title}</h3>
          <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.textDim}}>{formatDate(entry.date)}</span>
            {entry.phase!=null&&<Badge label={`${PHASES[entry.phase].icon} ${PHASES[entry.phase].name}`} color={S.purple}/>}
            {entry.microState!=null&&<Badge label={MICRO_STATES[entry.microState]} color={S.gold}/>}
            {el&&<Badge label={el.title} color={el.color}/>}
            {entry.patternName&&<span style={{fontFamily:S.fontBody,fontSize:'13px',color:S.gold,fontStyle:'italic'}}>"{entry.patternName}"</span>}</div></div>
        <button onClick={()=>delE(entry.id)} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'18px',padding:'4px'}}>×</button></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:'12px 0 0',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{entry.content}</p></Card>);})}</div>}</div>);}

// ══ PROFILE ══

// ─── UpgradeCard — server-authoritative tier picker ──────────
// Tier shown reflects payment status (server membership row), not
// profile.level. Clicking "Upgrade" opens Stripe Checkout for the
// chosen tier — on success the webhook updates the membership and
// the next mount reflects the new tier.
function UpgradeCard({profile,currentLevel}){
  const [busy,setBusy]=useState(null);
  const [error,setError]=useState(null);
  const PRODUCT_BY_TIER={reader:'community-reader',interpreter:'community-interpreter',practitioner:'community-practitioner'};
  const handleUpgrade=async(tierId)=>{
    if(!profile.email||!profile.email.includes('@')){
      setError('Please add an email in Personal Information above first.');
      return;
    }
    const product=PRODUCT_BY_TIER[tierId];
    if(!product){setError('That tier is not available for self-checkout.');return;}
    setBusy(tierId);setError(null);
    try{
      const res=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product,email:profile.email,name:profile.name||''})});
      const data=await res.json();
      if(!res.ok||!data.url){throw new Error(data.error||'Could not start checkout');}
      window.location.href=data.url;
    }catch(e){
      setError(e.message||'Something went wrong. Please try again.');
      setBusy(null);
    }
  };
  return(<Card><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 8px'}}>Membership Journey</h3>
    <p style={{fontFamily:S.fontBody,fontSize:'12px',color:S.textDim,margin:'0 0 16px',lineHeight:1.5}}>Tiers unlock layered access. Upgrade through secure Stripe checkout — your membership updates automatically.</p>
    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>{LEVELS.map((l,i)=>{
      const isCurrent=l.id===currentLevel.id;
      const canUpgrade=PRODUCT_BY_TIER[l.id]&&!isCurrent;
      const isFree=l.id==='observer';
      const isInvite=l.id==='guide';
      return(
        <div key={l.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderRadius:'8px',border:`1px solid ${isCurrent?l.color+'60':S.border}`,background:isCurrent?`${l.color}10`:'transparent'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',flex:1,minWidth:0}}>
            <span style={{width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,fontFamily:S.fontSans,background:isCurrent?`${l.color}25`:'rgba(255,255,255,0.05)',color:isCurrent?l.color:S.textDim,flexShrink:0}}>{i+1}</span>
            <div style={{minWidth:0,flex:1}}>
              <div style={{fontFamily:S.fontSans,fontSize:'13px',color:isCurrent?l.color:S.textMuted,fontWeight:600,display:'flex',alignItems:'center',gap:'6px'}}>{l.label}{isCurrent&&<span style={{fontFamily:S.fontMono,fontSize:'9px',color:l.color,letterSpacing:'1px'}}>· CURRENT</span>}</div>
              <div style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textDim,marginTop:'2px'}}>{l.price}</div>
            </div>
          </div>
          {canUpgrade&&!isInvite&&<button onClick={()=>handleUpgrade(l.id)} disabled={busy!==null} style={{padding:'7px 14px',border:`1px solid ${l.color}`,borderRadius:'7px',background:'transparent',color:l.color,fontFamily:S.fontSans,fontSize:'11px',fontWeight:600,letterSpacing:'0.3px',cursor:busy?'wait':'pointer',opacity:busy&&busy!==l.id?0.4:1,whiteSpace:'nowrap'}}>{busy===l.id?'Opening…':'Upgrade'}</button>}
          {isFree&&isCurrent===false&&<span style={{fontFamily:S.fontMono,fontSize:'9px',color:S.textDim,letterSpacing:'1px'}}>FREE</span>}
          {isInvite&&<span style={{fontFamily:S.fontMono,fontSize:'9px',color:S.textDim,letterSpacing:'1px'}}>INVITATION</span>}
        </div>);
    })}</div>
    {error&&<div style={{marginTop:'12px',padding:'10px 12px',borderRadius:'7px',background:'rgba(217,140,122,0.12)',border:'1px solid rgba(217,140,122,0.3)',color:S.red,fontFamily:S.fontBody,fontSize:'13px'}}>{error}</div>}
  </Card>);
}

function ProfilePage({profile,setProfile,saveProfile}){
  const level=LEVELS.find(l=>l.id===profile.level)||LEVELS[0];const up=(f,v)=>{const u={...profile,[f]:v};setProfile(u);saveProfile(u);};
  return(<div><SectionTitle sub="Your identity within Attuned Community">Member Profile</SectionTitle>
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'24px'}}>
      <Card><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 20px'}}>Personal Information</h3>
        <TextInput label="Full Name" value={profile.name} onChange={v=>up('name',v)} placeholder="Your name"/>
        <TextInput label="Email" value={profile.email} onChange={v=>up('email',v)} placeholder="your@email.com" type="email"/>
        <TextInput label="Bio" value={profile.bio} onChange={v=>up('bio',v)} placeholder="Share about yourself and your journey..." multiline/>
        <div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Current Phase</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>{PHASES.map((p,i)=><button key={i} onClick={()=>up('currentPhase',profile.currentPhase===i?null:i)} style={{padding:'8px',border:`1px solid ${profile.currentPhase===i?S.purple:S.border}`,borderRadius:'8px',background:profile.currentPhase===i?'rgba(167,139,250,0.1)':'transparent',color:profile.currentPhase===i?S.purple:S.textMuted,fontFamily:S.fontSans,fontSize:'11px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}><span style={{fontSize:'16px'}}>{p.icon}</span><span>{p.name}</span></button>)}</div></div>
        {profile.currentPhase!==null&&<div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Micro-State</label>
          <div style={{display:'flex',gap:'8px'}}>{MICRO_STATES.map((ms,i)=><button key={i} onClick={()=>up('currentMicroState',i)} style={{padding:'8px 16px',border:`1px solid ${profile.currentMicroState===i?S.gold:S.border}`,borderRadius:'8px',background:profile.currentMicroState===i?S.goldDim:'transparent',color:profile.currentMicroState===i?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer'}}>{ms}</button>)}</div></div>}</Card>
      <div>
        <Card style={{marginBottom:'16px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',color:S.text,margin:'0 0 16px'}}>Membership Level</h3>
          <div style={{padding:'20px',borderRadius:'12px',textAlign:'center',background:`linear-gradient(135deg, ${level.color}15, ${level.color}08)`,border:`1px solid ${level.color}30`}}>
            <div style={{fontFamily:S.fontHead,fontSize:'24px',color:level.color,marginBottom:'4px'}}>{level.label}</div>
            <div style={{fontFamily:S.fontSans,fontSize:'14px',color:S.textMuted}}>{level.price}</div>
            <div style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textDim,marginTop:'8px'}}>{level.desc}</div></div></Card>
        <UpgradeCard profile={profile} currentLevel={level}/>
        </div></div></div>);}

// ══════════════════════════════════════════════════════════════
// MAIN APP SHELL
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// ADMIN CONSOLE PAGES
// ══════════════════════════════════════════════════════════════

const selStyle={padding:'6px 10px',borderRadius:'7px',border:`1px solid ${S.border}`,background:'rgba(236,231,221,0.03)',color:S.text,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer',outline:'none'};

// ══ ADMIN — OVERVIEW ══
function AdminOverviewPage({members,events,announcements,guides,goAdmin}){
  const now=new Date();const upcoming=events.filter(e=>new Date(e.date)>=now);
  const dist=LEVELS.map(l=>({level:l,count:members.filter(m=>m.level===l.id).length}));
  const total=members.length;const maxc=Math.max(1,...dist.map(d=>d.count));
  const recent=[...members].sort((a,b)=>new Date(b.joinDate)-new Date(a.joinDate)).slice(0,5);
  return(<div><SectionTitle sub="Community health at a glance">Admin Overview</SectionTitle>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))',gap:'16px',marginBottom:'24px'}}>
      {[{l:'Total Members',v:total,i:'☷',k:'members'},{l:'Upcoming Events',v:upcoming.length,i:'▸',k:'events'},{l:'Announcements',v:announcements.length,i:'◈',k:'announcements'},{l:'Active Guides',v:guides.length,i:'⚘',k:'guides'}].map((s,i)=>
        <Card key={i} hover onClick={()=>goAdmin(s.k)}><div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim,textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'10px'}}><span style={{marginRight:'7px',color:S.gold}}>{s.i}</span>{s.l}</div><div style={{fontFamily:S.fontHead,fontSize:'30px',fontWeight:500,color:S.text}}>{s.v}</div></Card>)}
    </div>
    <Card style={{marginBottom:'24px'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text,margin:'0 0 18px'}}>Membership by Level</h3>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{dist.map(d=>(<div key={d.level.id} style={{display:'flex',alignItems:'center',gap:'14px'}}>
        <span style={{fontFamily:S.fontSans,fontSize:'13px',color:S.text,minWidth:'92px'}}>{d.level.label}</span>
        <div style={{flex:1,height:'10px',borderRadius:'5px',background:'rgba(236,231,221,0.05)',overflow:'hidden'}}><div style={{height:'100%',width:`${d.count/maxc*100}%`,background:d.level.color,borderRadius:'5px',transition:'width 0.5s'}}/></div>
        <span style={{fontFamily:S.fontMono,fontSize:'12px',color:S.textMuted,minWidth:'28px',textAlign:'right'}}>{d.count}</span></div>))}</div>
    </Card>
    <Card>
      <h3 style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text,margin:'0 0 16px'}}>Recent Members</h3>
      {recent.length===0?<p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textDim}}>No members yet.</p>:recent.map(m=>{const ml=LEVELS.find(l=>l.id===m.level)||LEVELS[0];return(<div key={m.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:`1px solid ${S.border}`}}>
        <div style={{width:'30px',height:'30px',borderRadius:'50%',flexShrink:0,background:`linear-gradient(135deg, ${ml.color}40, ${ml.color}20)`,border:`1px solid ${ml.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'12px',color:ml.color}}>{(m.name||'?')[0].toUpperCase()}</div>
        <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'14px',color:S.text,fontWeight:500}}>{m.name}</div><div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim}}>joined {formatDate(m.joinDate)}</div></div>
        <Badge label={ml.label} color={ml.color}/></div>);})}
    </Card>
  </div>);
}

// ══ ADMIN — MEMBERS ══
function AdminMembersPage({members,setMembers,saveMembers}){
  const[adding,setAdding]=useState(false);const[draft,setDraft]=useState({name:'',email:'',level:'observer'});const[filter,setFilter]=useState('all');
  const persist=m=>{setMembers(m);saveMembers(m);};
  const add=()=>{if(!draft.name.trim())return;const m={id:'m-'+Date.now(),name:draft.name.trim(),email:draft.email.trim(),level:draft.level,joinDate:new Date().toISOString().split('T')[0],status:'active'};persist([m,...members]);setDraft({name:'',email:'',level:'observer'});setAdding(false);};
  const setLevel=(id,lvl)=>persist(members.map(m=>m.id===id?{...m,level:lvl}:m));
  const setStatus=(id,st)=>persist(members.map(m=>m.id===id?{...m,status:st}:m));
  const remove=id=>persist(members.filter(m=>m.id!==id));
  const filtered=filter==='all'?members:members.filter(m=>m.level===filter);
  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}><SectionTitle sub={`${members.length} members in the community`}>Members</SectionTitle><PrimaryButton onClick={()=>setAdding(!adding)}>{adding?'Cancel':'+ Add Member'}</PrimaryButton></div>
    {adding&&<Card style={{marginBottom:'20px',borderColor:S.gold+'30'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>New Member</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}><TextInput label="Name" value={draft.name} onChange={v=>setDraft({...draft,name:v})} placeholder="Full name"/><TextInput label="Email" value={draft.email} onChange={v=>setDraft({...draft,email:v})} placeholder="email@example.com" type="email"/></div>
      <div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Level</label>
        <select value={draft.level} onChange={e=>setDraft({...draft,level:e.target.value})} style={{...selStyle,fontSize:'14px',padding:'10px 14px'}}>{LEVELS.map(l=><option key={l.id} value={l.id}>{l.label} — {l.price}</option>)}</select></div>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={add} disabled={!draft.name.trim()}>Add Member</PrimaryButton></div>
    </Card>}
    <div style={{display:'flex',gap:'8px',marginBottom:'18px',flexWrap:'wrap'}}>{['all',...LEVELS.map(l=>l.id)].map(f=>{const lbl=f==='all'?'All':(LEVELS.find(l=>l.id===f)||{}).label;return(<button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:'20px',border:`1px solid ${filter===f?S.gold:S.border}`,background:filter===f?S.goldDim:'transparent',color:filter===f?S.gold:S.textMuted,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer'}}>{lbl}</button>);})}</div>
    {filtered.length===0?<EmptyState icon="☷" message="No members in this view."/>:
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{filtered.map(m=>{const ml=LEVELS.find(l=>l.id===m.level)||LEVELS[0];return(<Card key={m.id} style={{padding:'14px 18px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap'}}>
        <div style={{width:'38px',height:'38px',borderRadius:'50%',flexShrink:0,background:`linear-gradient(135deg, ${ml.color}40, ${ml.color}20)`,border:`1px solid ${ml.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'14px',color:ml.color}}>{(m.name||'?')[0].toUpperCase()}</div>
        <div style={{flex:1,minWidth:'140px'}}><div style={{fontFamily:S.fontSans,fontSize:'14px',color:S.text,fontWeight:600}}>{m.name}</div><div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim}}>{m.email||'—'} · joined {formatDate(m.joinDate)}</div></div>
        <select value={m.level} onChange={e=>setLevel(m.id,e.target.value)} style={{...selStyle,borderColor:ml.color+'40',color:ml.color}}>{LEVELS.map(l=><option key={l.id} value={l.id} style={{color:'#111'}}>{l.label}</option>)}</select>
        <button onClick={()=>setStatus(m.id,m.status==='active'?'paused':'active')} style={{padding:'5px 12px',borderRadius:'20px',border:`1px solid ${m.status==='active'?S.green+'40':S.textDim+'40'}`,background:'transparent',color:m.status==='active'?S.green:S.textDim,fontFamily:S.fontMono,fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>{m.status||'active'}</button>
        <button onClick={()=>remove(m.id)} title="Remove member" style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'18px',padding:'4px'}}>×</button></div>
    </Card>);})}</div>}
  </div>);
}

// ══ ADMIN — ANNOUNCEMENTS ══
function AdminAnnouncementsPage({announcements,setAnnouncements,saveAnnouncements}){
  const[draft,setDraft]=useState({title:'',content:''});const[editId,setEditId]=useState(null);const[ed,setEd]=useState({title:'',content:''});
  const persist=a=>{setAnnouncements(a);saveAnnouncements(a);};
  const add=()=>{if(!draft.title.trim())return;persist([{id:'a-'+Date.now(),date:new Date().toISOString().split('T')[0],title:draft.title.trim(),content:draft.content.trim()},...announcements]);setDraft({title:'',content:''});};
  const startEdit=a=>{setEditId(a.id);setEd({title:a.title,content:a.content});};
  const saveEdit=()=>{persist(announcements.map(a=>a.id===editId?{...a,title:ed.title,content:ed.content}:a));setEditId(null);};
  const remove=id=>persist(announcements.filter(a=>a.id!==id));
  return(<div><SectionTitle sub="Published to the member Dashboard and Events">Announcements</SectionTitle>
    <Card style={{marginBottom:'24px',borderColor:S.gold+'30'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>New Announcement</h3>
      <TextInput label="Title" value={draft.title} onChange={v=>setDraft({...draft,title:v})} placeholder="Announcement title"/>
      <TextInput label="Content" value={draft.content} onChange={v=>setDraft({...draft,content:v})} placeholder="What do you want members to know?" multiline/>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={add} disabled={!draft.title.trim()}>Publish</PrimaryButton></div>
    </Card>
    {announcements.length===0?<EmptyState icon="◈" message="No announcements yet."/>:
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{announcements.map(a=>(<Card key={a.id}>
      {editId===a.id?(<div>
        <TextInput label="Title" value={ed.title} onChange={v=>setEd({...ed,title:v})}/>
        <TextInput label="Content" value={ed.content} onChange={v=>setEd({...ed,content:v})} multiline/>
        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}><SecondaryButton onClick={()=>setEditId(null)}>Cancel</SecondaryButton><PrimaryButton onClick={saveEdit}>Save</PrimaryButton></div>
      </div>):(<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}><h3 style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text,margin:0}}>{a.title}</h3>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim}}>{formatDate(a.date)}</span>
            <button onClick={()=>startEdit(a)} style={{border:'none',background:'none',color:S.gold,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer',padding:0}}>Edit</button>
            <button onClick={()=>remove(a.id)} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'17px',padding:'2px'}}>×</button></div></div>
        <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:0,lineHeight:1.6}}>{a.content}</p></div>)}
    </Card>))}</div>}
  </div>);
}

// ══ ADMIN — EVENTS ══
function AdminEventsPage({events,setEvents,saveEvents}){
  const TYPES=['workshop','circle','course','qa'];const tc={workshop:S.purple,circle:S.gold,course:S.green,qa:S.blue};
  const[draft,setDraft]=useState({title:'',date:'',time:'',type:'workshop',desc:''});const[editId,setEditId]=useState(null);const[ed,setEd]=useState({});
  const persist=e=>{setEvents(e);saveEvents(e);};
  const add=()=>{if(!draft.title.trim()||!draft.date.trim())return;persist([...events,{id:'e-'+Date.now(),...draft,title:draft.title.trim()}].sort((a,b)=>new Date(a.date)-new Date(b.date)));setDraft({title:'',date:'',time:'',type:'workshop',desc:''});};
  const startEdit=e=>{setEditId(e.id);setEd({...e});};
  const saveEdit=()=>{persist(events.map(e=>e.id===editId?{...ed}:e).sort((a,b)=>new Date(a.date)-new Date(b.date)));setEditId(null);};
  const remove=id=>persist(events.filter(e=>e.id!==id));
  const sorted=[...events].sort((a,b)=>new Date(a.date)-new Date(b.date));
  return(<div><SectionTitle sub="Published to the member Events and Attunement Circles">Events</SectionTitle>
    <Card style={{marginBottom:'24px',borderColor:S.gold+'30'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>New Event</h3>
      <TextInput label="Title" value={draft.title} onChange={v=>setDraft({...draft,title:v})} placeholder="Event title"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
        <TextInput label="Date (YYYY-MM-DD)" value={draft.date} onChange={v=>setDraft({...draft,date:v})} placeholder="2026-07-01"/>
        <TextInput label="Time" value={draft.time} onChange={v=>setDraft({...draft,time:v})} placeholder="7:00 PM CST"/>
        <div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Type</label><select value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})} style={{...selStyle,fontSize:'14px',padding:'10px 14px',width:'100%'}}>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div></div>
      <TextInput label="Description" value={draft.desc} onChange={v=>setDraft({...draft,desc:v})} placeholder="Short description" multiline/>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={add} disabled={!draft.title.trim()||!draft.date.trim()}>Add Event</PrimaryButton></div>
    </Card>
    {sorted.length===0?<EmptyState icon="▸" message="No events scheduled."/>:
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{sorted.map(e=>(<Card key={e.id}>
      {editId===e.id?(<div>
        <TextInput label="Title" value={ed.title} onChange={v=>setEd({...ed,title:v})}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}><TextInput label="Date" value={ed.date} onChange={v=>setEd({...ed,date:v})}/><TextInput label="Time" value={ed.time} onChange={v=>setEd({...ed,time:v})}/>
          <div style={{marginBottom:'16px'}}><label style={{display:'block',marginBottom:'6px',fontFamily:S.fontSans,fontSize:'13px',color:S.textMuted,fontWeight:500}}>Type</label><select value={ed.type} onChange={ev=>setEd({...ed,type:ev.target.value})} style={{...selStyle,fontSize:'14px',padding:'10px 14px',width:'100%'}}>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div></div>
        <TextInput label="Description" value={ed.desc} onChange={v=>setEd({...ed,desc:v})} multiline/>
        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}><SecondaryButton onClick={()=>setEditId(null)}>Cancel</SecondaryButton><PrimaryButton onClick={saveEdit}>Save</PrimaryButton></div>
      </div>):(<div style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
        <div style={{width:'52px',flexShrink:0,textAlign:'center',padding:'8px',borderRadius:'10px',background:`${tc[e.type]||S.purple}12`,border:`1px solid ${tc[e.type]||S.purple}25`}}>
          <div style={{fontFamily:S.fontHead,fontSize:'19px',fontWeight:500,color:tc[e.type]||S.purple,lineHeight:1}}>{new Date(e.date+'T12:00:00').getDate()||'—'}</div>
          <div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.textMuted,textTransform:'uppercase'}}>{e.date?new Date(e.date+'T12:00:00').toLocaleDateString('en-US',{month:'short'}):''}</div></div>
        <div style={{flex:1}}><div style={{fontFamily:S.fontSans,fontSize:'15px',fontWeight:600,color:S.text}}>{e.title}</div><div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.gold,margin:'3px 0'}}>{e.time}</div><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>{e.desc}</p></div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}><Badge label={e.type} color={tc[e.type]||S.purple}/>
          <button onClick={()=>startEdit(e)} style={{border:'none',background:'none',color:S.gold,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer',padding:0}}>Edit</button>
          <button onClick={()=>remove(e.id)} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'17px',padding:'2px'}}>×</button></div>
      </div>)}
    </Card>))}</div>}
  </div>);
}

// ══ ADMIN — GUIDES ══
function AdminGuidesPage({guides,setGuides,saveGuides}){
  const[draft,setDraft]=useState({name:'',specialty:'',bio:''});const[editId,setEditId]=useState(null);const[ed,setEd]=useState({});
  const persist=g=>{setGuides(g);saveGuides(g);};
  const add=()=>{if(!draft.name.trim())return;persist([...guides,{id:'g-'+Date.now(),name:draft.name.trim(),specialty:draft.specialty.trim(),bio:draft.bio.trim()}]);setDraft({name:'',specialty:'',bio:''});};
  const startEdit=g=>{setEditId(g.id);setEd({...g});};
  const saveEdit=()=>{persist(guides.map(g=>g.id===editId?{...ed}:g));setEditId(null);};
  const remove=id=>persist(guides.filter(g=>g.id!==id));
  return(<div><SectionTitle sub="Published to the member Coaching directory">Guides</SectionTitle>
    <Card style={{marginBottom:'24px',borderColor:S.gold+'30'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text,margin:'0 0 14px'}}>New Guide</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}><TextInput label="Name" value={draft.name} onChange={v=>setDraft({...draft,name:v})} placeholder="Guide name"/><TextInput label="Specialty" value={draft.specialty} onChange={v=>setDraft({...draft,specialty:v})} placeholder="Area of focus"/></div>
      <TextInput label="Bio" value={draft.bio} onChange={v=>setDraft({...draft,bio:v})} placeholder="Short biography" multiline/>
      <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={add} disabled={!draft.name.trim()}>Add Guide</PrimaryButton></div>
    </Card>
    {guides.length===0?<EmptyState icon="⚘" message="No guides in the directory."/>:
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>{guides.map(g=>(<Card key={g.id}>
      {editId===g.id?(<div>
        <TextInput label="Name" value={ed.name} onChange={v=>setEd({...ed,name:v})}/>
        <TextInput label="Specialty" value={ed.specialty} onChange={v=>setEd({...ed,specialty:v})}/>
        <TextInput label="Bio" value={ed.bio} onChange={v=>setEd({...ed,bio:v})} multiline/>
        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}><SecondaryButton onClick={()=>setEditId(null)}>Cancel</SecondaryButton><PrimaryButton onClick={saveEdit}>Save</PrimaryButton></div>
      </div>):(<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'50%',marginBottom:'12px',background:`linear-gradient(135deg, ${S.gold}30, ${S.gold}10)`,border:`1px solid ${S.gold}25`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'16px',color:S.gold}}>{g.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}><button onClick={()=>startEdit(g)} style={{border:'none',background:'none',color:S.gold,fontFamily:S.fontSans,fontSize:'12px',cursor:'pointer',padding:0}}>Edit</button><button onClick={()=>remove(g.id)} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'17px',padding:'2px'}}>×</button></div></div>
        <h3 style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:S.text,margin:'0 0 4px'}}>{g.name}</h3>
        <div style={{fontFamily:S.fontSans,fontSize:'12px',color:S.purple,marginBottom:'8px'}}>{g.specialty}</div>
        <p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textMuted,margin:0,lineHeight:1.5}}>{g.bio}</p></div>)}
    </Card>))}</div>}
  </div>);
}

const ADMIN_NAV = [
  {id:'overview',icon:'▦',label:'Overview'},{id:'members',icon:'☷',label:'Members'},
  {id:'announcements',icon:'◈',label:'Announcements'},{id:'events',icon:'▸',label:'Events'},
  {id:'guides',icon:'⚘',label:'Guides'},
];

// ══ EVENT DECODER (Cosmic Reality Framework) ══
// Keyword signals per phase, drawn from each phase's life-events + themes.
const PHASE_KEYWORDS = [
  ['new','start','begin','beginning','launch','project','fresh','initiate','first','idea','impulse','vision','identity','born','spark'],
  ['stability','stable','build','building','resource','routine','money','financial','finance','security','secure','health','save','saving','foundation','steady','patience','body','habit'],
  ['learn','learning','study','studying','education','course','school','class','network','networking','question','curious','skill','conversation','information','writing','reading','research'],
  ['family','home','emotion','emotional','feeling','feelings','healing','belonging','care','child','parent','mother','father','safe','vulnerable','nurture','roots','community'],
  ['creative','create','creating','lead','leader','leadership','visible','visibility','perform','performance','art','express','expression','confidence','seen','recognition','stage','voice','spotlight'],
  ['improve','improving','fix','fixing','optimize','optimise','analyze','analyse','system','detail','refine','mistake','criticism','organize','organise','clean','precision','efficiency','perfection'],
  ['relationship','partner','partnership','negotiate','negotiation','conflict','collaborate','collaboration','balance','fairness','marriage','dating','diplomacy','compromise','harmony','agreement'],
  ['crisis','loss','lost','death','died','end','ending','grief','grieving','breakup','divorce','betrayal','power','intense','transform','transformation','letting go','release','reinvent','trauma'],
  ['travel','travelling','traveling','philosophy','teach','teaching','meaning','mission','expand','expansion','grow','growth','faith','belief','adventure','explore','purpose','horizon','abroad'],
  ['career','promotion','achievement','achieve','goal','authority','legacy','responsibility','ambition','discipline','success','master','mastery','institution','status','recognition'],
  ['innovation','innovate','technology','tech','freedom','rebel','reform','break','unconventional','future','independence','disrupt','breakthrough','change','redesign','progressive'],
  ['rest','reflection','reflect','spiritual','spirituality','forgiveness','forgive','closure','surrender','let go','dream','retreat','completion','complete','dissolve','ending','peace','meditation'],
];
// ── Framework analysis engine: bridges everyday language to the 12 phases ──
// Concept lexicon: terms (everyday words/phrases) → phase indices, with weight.
const CONCEPT_LEXICON = [
  // Emotions & inner states
  {w:3,t:['afraid','fear','scared','terrified','dread','fearful','frightened'],p:[7,1]},
  {w:3,t:['loss','lose','lost','losing','grief','grieve','mourn','bereaved','bereavement'],p:[7,11]},
  {w:2,t:['let go','letting go','release','surrender','holding on','cling','clinging','hold on'],p:[7,11]},
  {w:2,t:['anxious','anxiety','worried','worry','nervous','unsettled','uncertain','insecure','insecurity'],p:[1,7]},
  {w:2,t:['lonely','loneliness','alone','isolated','disconnected','left out'],p:[3]},
  {w:2,t:['overwhelmed','burnout','burned out','exhausted','drained','depleted','need rest','need a break'],p:[11]},
  {w:2,t:['stuck','trapped','stagnant','going nowhere'],p:[7,10]},
  {w:2,t:['resentment','resentful','bitter','grudge'],p:[11]},
  {w:2,t:['ashamed','shame','guilt','guilty','unworthy'],p:[11,3]},
  {w:2,t:['excited','eager','inspired','motivated','energized'],p:[0,8]},
  {w:2,t:['restless','impatient'],p:[0,8]},
  {w:2,t:['confused','lost direction','no clarity','searching for'],p:[2,8,11]},
  {w:2,t:['angry','anger','furious','rage','frustrated','frustration'],p:[7,5]},
  {w:2,t:['jealous','jealousy','envy','obsessed','obsession'],p:[7]},
  {w:2,t:['betrayed','betrayal','deceived','lied to'],p:[7]},
  {w:2,t:['judged','rejected','not seen','invisible','overlooked','unrecognized'],p:[4]},
  // Phase 0 Ignition
  {w:3,t:['new beginning','fresh start','starting over','start over','new chapter','new project','new venture','new job','new business','new relationship'],p:[0]},
  {w:2,t:['begin','beginning','start','launch','embark','initiate','first step'],p:[0]},
  {w:2,t:['impulse','urge','spark','initiative'],p:[0]},
  {w:2,t:['courage','brave','dare','take the leap','take a risk','go for it'],p:[0]},
  {w:2,t:['reinvent myself','new identity','new life'],p:[0,7]},
  // Phase 1 Foundation
  {w:3,t:['stability','stable','security','secure','financial security','job security'],p:[1]},
  {w:2,t:['build','foundation','establish','settle','put down roots'],p:[1]},
  {w:3,t:['money','finances','financial','income','salary','savings','debt','bills','rent','mortgage','budget'],p:[1]},
  {w:2,t:['routine','habit','consistency','steady','reliable'],p:[1]},
  {w:2,t:['home','house','property','possessions','belongings'],p:[1,3]},
  {w:2,t:['scarcity','not enough','provide','make ends meet'],p:[1]},
  {w:2,t:['comfort zone','too comfortable','complacent'],p:[1]},
  // Phase 2 Intelligence
  {w:3,t:['learn','learning','study','studying','education','school','college','university','course','class','degree','exam'],p:[2]},
  {w:2,t:['curious','curiosity','question','wonder','figure out'],p:[2]},
  {w:2,t:['skill','training','practice','upskilling'],p:[2]},
  {w:2,t:['network','networking','contacts'],p:[2]},
  {w:2,t:['communicate','communication','conversation','writing','speaking'],p:[2]},
  {w:2,t:['information','research','reading','data'],p:[2]},
  {w:2,t:['scattered','distracted','overthinking','spread thin'],p:[2]},
  // Phase 3 Inner Root
  {w:3,t:['family','parents','parent','children','kids','child','mother','father','sibling','spouse'],p:[3]},
  {w:2,t:['belonging','belong','community','roots'],p:[3]},
  {w:2,t:['emotional','emotions','feelings','feeling'],p:[3]},
  {w:2,t:['nurture','caring for','caregiver','caregiving','take care','look after'],p:[3]},
  {w:2,t:['inner child','childhood','past wounds'],p:[3]},
  {w:2,t:['safe','safety','protected','vulnerable','vulnerability'],p:[3]},
  {w:2,t:['homesick','nest'],p:[3]},
  // Phase 4 Authority
  {w:3,t:['creative','creativity','create','art','artist','design'],p:[4]},
  {w:2,t:['express','expression','my voice','self expression'],p:[4]},
  {w:2,t:['lead','leader','leadership','take charge','step up'],p:[4]},
  {w:3,t:['visible','visibility','be seen','recognition','spotlight','audience','put myself out there'],p:[4]},
  {w:2,t:['perform','performance','stage','present'],p:[4]},
  {w:2,t:['confidence','confident','self worth','self esteem','pride'],p:[4]},
  {w:2,t:['authentic','be myself','true self'],p:[4]},
  // Phase 5 Correction
  {w:3,t:['improve','improvement','optimize','optimise','refine','perfect','make better'],p:[5]},
  {w:2,t:['fix','repair','correct','adjust','tweak'],p:[5]},
  {w:2,t:['analyze','analyse','analysis','detail','details','precise','precision'],p:[5]},
  {w:2,t:['system','process','method','organize','organise','streamline','workflow'],p:[5]},
  {w:2,t:['productivity','efficiency','efficient'],p:[5]},
  {w:2,t:['mistake','error','flaw','criticism','critique'],p:[5]},
  {w:2,t:['perfectionism','perfectionist','never good enough','overcritical'],p:[5]},
  {w:2,t:['health','diet','exercise','fitness','workout','nutrition'],p:[5,1]},
  // Phase 6 Balance
  {w:3,t:['relationship','partner','partnership','dating','romance','romantic','boyfriend','girlfriend','husband','wife'],p:[6]},
  {w:2,t:['balance','imbalance','equilibrium','work life balance'],p:[6]},
  {w:3,t:['conflict','disagreement','argument','fight with','tension with'],p:[6]},
  {w:2,t:['negotiate','negotiation','compromise','agreement','deal','contract'],p:[6]},
  {w:2,t:['fairness','fair','unfair','justice','injustice'],p:[6]},
  {w:2,t:['cooperation','collaborate','collaboration','teamwork'],p:[6]},
  {w:2,t:['harmony','peace','diplomacy','mediate'],p:[6]},
  {w:2,t:['people pleasing','please everyone','avoid conflict','keep the peace'],p:[6]},
  {w:2,t:['torn between','indecisive','two options','weighing'],p:[6]},
  // Phase 7 Transformation
  {w:3,t:['crisis','collapse','rock bottom','falling apart','fell apart','breakdown'],p:[7]},
  {w:3,t:['ending','ended','breakup','break up','divorce','separation','split up'],p:[7,11]},
  {w:3,t:['death','died','dying','passed away','funeral'],p:[7]},
  {w:3,t:['transform','transformation','deep change','metamorphosis','rebirth','reborn'],p:[7]},
  {w:2,t:['power','powerless','control','out of control'],p:[7]},
  {w:2,t:['trauma','deep wound','shadow work','dark night'],p:[7]},
  {w:2,t:['reinvent','reinvention','completely change'],p:[7,0]},
  // Phase 8 Expansion
  {w:3,t:['travel','traveling','travelling','abroad','overseas','journey','trip','relocate'],p:[8]},
  {w:3,t:['meaning','purpose','bigger picture','my calling','mission'],p:[8]},
  {w:2,t:['philosophy','belief','beliefs','worldview'],p:[8]},
  {w:2,t:['teach','teaching','mentor','guide others'],p:[8]},
  {w:2,t:['expand','expansion','grow','growth','broaden','horizons'],p:[8]},
  {w:2,t:['adventure','explore','wanderlust'],p:[8]},
  {w:2,t:['optimistic','hope','possibility'],p:[8]},
  // Phase 9 Mastery
  {w:3,t:['career','job','work','profession','promotion','workplace'],p:[9]},
  {w:3,t:['achieve','achievement','accomplish','goal','goals','ambition','ambitious'],p:[9]},
  {w:2,t:['success','succeed','results'],p:[9]},
  {w:2,t:['responsibility','duty','obligation','burden'],p:[9]},
  {w:2,t:['authority','status','reputation','respect'],p:[9]},
  {w:2,t:['legacy','lasting','long term'],p:[9]},
  {w:2,t:['discipline','hard work','grind'],p:[9]},
  {w:2,t:['pressure','expectations','prove myself','fear of failure','failing','failure'],p:[9]},
  {w:2,t:['manage','managing','run a team','run a company'],p:[9]},
  // Phase 10 Liberation
  {w:3,t:['innovation','innovate','invent','new idea','breakthrough','disrupt','disruption'],p:[10]},
  {w:2,t:['technology','tech','digital','software','startup'],p:[10]},
  {w:3,t:['freedom','independence','liberation','break free','free myself'],p:[10]},
  {w:2,t:['rebel','rebellion','unconventional','outsider','dont fit in','dont belong'],p:[10,3]},
  {w:2,t:['reform','change the system','redesign','overhaul','rethink'],p:[10]},
  {w:2,t:['collective','society','social change','movement','cause'],p:[10]},
  {w:2,t:['detached','aloof'],p:[10]},
  // Phase 11 Dissolution
  {w:3,t:['rest','retreat','withdraw','solitude','step back','time alone','pause'],p:[11]},
  {w:2,t:['reflection','reflect','contemplate','look back','take stock'],p:[11]},
  {w:3,t:['spiritual','spirituality','transcend','oneness','divine','meditation','prayer'],p:[11]},
  {w:3,t:['forgive','forgiveness','make peace'],p:[11]},
  {w:3,t:['closure','complete','completion','finish','finishing','end of a chapter','wrap up'],p:[11]},
  {w:2,t:['surrender','acceptance','accept','flow','allow'],p:[11]},
  {w:2,t:['dream','dreams','imagination','intuition','intuitive'],p:[11]},
  {w:2,t:['dissolve','dissolving','losing myself','empty'],p:[11]},
  {w:2,t:['escape','escapism','numb','checked out'],p:[11]},
  // Belonging / social / fitting in
  {w:3,t:['belong','belonging','fit in','fitting in','out of place','dont belong','dont fit','left out','accepted','acceptance','newcomer','homesick'],p:[3]},
  {w:2,t:['unfamiliar','new people','new group','new team','new community','new environment','new place','new school','strangers','first day','joining','group','dont know anyone','do not know anyone'],p:[3,2]},
  {w:2,t:['shy','awkward','self conscious','social anxiety','nervous around people','intimidated','timid'],p:[3,4]},
  {w:2,t:['outsider','misfit','different from everyone','on the outside','dont fit in'],p:[10,3]},
  {w:2,t:['insecure','unsure of myself','self doubt','doubt myself','not confident','impostor','imposter','inadequate'],p:[4,3]},
];
// Tokens derived straight from the framework data per phase (weight 1).
const FW_TOKENS = PHASES.map(p=>{const out=new Set();const push=s=>{if(!s)return;String(s).toLowerCase().replace(/[^a-z ]/g,' ').split(' ').forEach(w=>{if(w.length>=4)out.add(w);});};push(p.name);push(p.seeks);push(p.func);push(p.funcPurpose);push(p.patternWord);push(p.rhythmWord);push(p.dev.intelligence);push(p.dev.character);push(p.dev.capability);push(p.dev.consciousness);(p.eventsList||[]).forEach(push);return Array.from(out);});
function _infl(t){const f=new Set([t,t+'s',t+'es',t+'ed',t+'ing',t+'d']);if(t.endsWith('e'))f.add(t.slice(0,-1)+'ing');if(t.endsWith('y'))f.add(t.slice(0,-1)+'ies');return f;}
function _lev(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;const d=[];for(let i=0;i<=m;i++)d[i]=[i];for(let j=0;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n];}
const _SINGLE=[];CONCEPT_LEXICON.forEach(c=>c.t.forEach(t=>{if(t.indexOf(' ')<0)_SINGLE.push({term:t,p:c.p,w:c.w});}));PHASE_KEYWORDS.forEach((kw,i)=>kw.forEach(t=>{if(t.indexOf(' ')<0)_SINGLE.push({term:t,p:[i],w:1});}));
const _EXACT=new Set();_SINGLE.forEach(o=>_infl(o.term).forEach(x=>_EXACT.add(x)));FW_TOKENS.forEach(tk=>tk.forEach(x=>_EXACT.add(x)));
const _FUZZ_TERMS=Array.from(new Set(_SINGLE.filter(o=>o.term.length>=5).map(o=>o.term)));
function suggestPhases(text){
  const clean=(text||'').toLowerCase().replace(/['\u2019]/g,'');
  const words=clean.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean);
  const padded=' '+words.join(' ')+' ';
  const scores=new Array(12).fill(0);const hits=Array.from({length:12},()=>new Set());
  const hasTerm=term=>{if(term.indexOf(' ')>=0)return padded.indexOf(' '+term+' ')>=0;const inf=_infl(term);return words.some(w=>inf.has(w));};
  const apply=(terms,phases,w)=>{for(const term of terms){if(hasTerm(term)){for(const pi of phases){scores[pi]+=w;hits[pi].add(term);}}}};
  for(const c of CONCEPT_LEXICON)apply(c.t,c.p,c.w);
  PHASE_KEYWORDS.forEach((kw,i)=>apply(kw,[i],1));
  FW_TOKENS.forEach((tk,i)=>apply(tk,[i],1));
  for(const w of words){ if(w.length<6||_EXACT.has(w))continue; let best=null,bd=3; for(const ft of _FUZZ_TERMS){ if(Math.abs(ft.length-w.length)>2)continue; const dd=_lev(w,ft); if(dd<bd){bd=dd;best=ft;if(dd===1)break;} } if(best&&bd<=2){ _SINGLE.filter(o=>o.term===best).forEach(o=>{ for(const pi of o.p){scores[pi]+=1;hits[pi].add(best);} }); } }
  return scores.map((s,i)=>({i,score:s,hits:Array.from(hits[i])})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
}
const MICRO_META=[
  {name:'Initiation',desc:'the spark — it has only just begun',move:'commit to the beginning without over-planning'},
  {name:'Expansion',desc:'growth — energy is increasing',move:'build momentum and say yes to what is growing'},
  {name:'Contraction',desc:'tension — refinement and correction are required',move:'refine and conserve rather than force the outcome'},
  {name:'Integration',desc:'completion — wisdom is being gathered',move:'harvest the lesson and prepare to complete or transition'},
];
const DECODER_STEPS=['Describe','Locate','Decode','Integrate'];

function EventDecoderPage({profile,decodings,setDecodings,saveDecodings,setProfile,saveProfile,goTo,openCodex}){
  const[step,setStep]=useState(1);
  const[text,setText]=useState('');
  const[primary,setPrimary]=useState(null);
  const[secondary,setSecondary]=useState(null);
  const[micro,setMicro]=useState(null);
  const[showSec,setShowSec]=useState(false);
  const[reading,setReading]=useState('');
  const[note,setNote]=useState('');
  const[saved,setSaved]=useState(false);
  const[posSet,setPosSet]=useState(false);
  const lens=id=>LENSES.find(x=>x.id===id);
  const persist=list=>{setDecodings(list);saveDecodings(list);};
  const analysis=text.trim().length>2?suggestPhases(text):[];
  const maxScore=analysis.length?analysis[0].score:1;
  const suggestedSet=new Set(analysis.map(a=>a.i));
  const canLocate=primary!==null&&micro!==null;
  const p=primary!==null?PHASES[primary]:null;const d=primary!==null?PHASE_DETAIL[primary]:null;
  const sec=secondary!==null?PHASES[secondary]:null;const mm=micro!==null?MICRO_META[micro]:null;
  const prevI=primary!==null?(primary+11)%12:0;const nextI=primary!==null?(primary+1)%12:0;

  const reset=()=>{setStep(1);setText('');setPrimary(null);setSecondary(null);setMicro(null);setShowSec(false);setReading('');setNote('');};
  const goStep=s=>{if(s===1||(s===2&&text.trim())||((s===3||s===4)&&canLocate))setStep(s);};
  const save=()=>{if(!canLocate||!text.trim())return;const entry={id:'dec-'+Date.now(),date:new Date().toISOString(),text:text.trim(),phaseIndex:primary,secondaryIndex:secondary,micro,reading:reading.trim(),note:note.trim()};persist([entry,...decodings]);setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const removeDec=id=>persist(decodings.filter(x=>x.id!==id));
  const loadDec=dec=>{setText(dec.text);setPrimary(dec.phaseIndex);setSecondary(dec.secondaryIndex!=null?dec.secondaryIndex:null);setMicro(dec.micro!=null?dec.micro:null);setShowSec(dec.secondaryIndex!=null);setReading(dec.reading||'');setNote(dec.note||'');setStep(dec.micro!=null?3:2);window.scrollTo&&window.scrollTo({top:0,behavior:'smooth'});};
  const setPosition=()=>{if(primary===null||!setProfile)return;const u={...profile,currentPhase:primary,currentMicroState:micro!=null?micro:0};setProfile(u);saveProfile&&saveProfile(u);setPosSet(true);setTimeout(()=>setPosSet(false),1800);};
  const openInWisdom=()=>{setPosition();goTo&&goTo('phases');};

  const trace=(p&&mm)?[
    {id:'events',label:'Event',head:'What you are living.'},
    {id:'rhythm',label:'Rhythm',head:`The movement of ${p.rhythmWord}.`,body:`${d.rhythm} You placed yourself in its ${mm.name} micro-state — ${mm.desc}.`},
    {id:'pattern',label:'Pattern',head:`The pattern of ${p.patternWord}.`,body:d.pattern},
    {id:'structure',label:'Structure',head:`The ${p.func} Function — to ${p.funcPurpose.toLowerCase()}.`,body:d.structure},
    {id:'intelligent-order',label:'Intelligent Order',head:`Life seeks ${p.seeks}.`,body:d.io},
  ]:[];
  const synth=(p&&mm)?('You are reading: \u201c'+text.trim()+'\u201d. Through '+p.name+' \u2014 the '+p.func+' Function \u2014 this is life seeking '+p.seeks+'. You placed yourself in its '+mm.name+' micro-state: '+mm.desc+'. '+(sec?('A second current runs through it \u2014 '+sec.name+' (life seeks '+sec.seeks+') \u2014 marking a transition between the two. '):'')+'The shadow to watch: '+p.shadow+' The gift to claim: '+p.gift+' Your aligned move now is to '+mm.move+'.'):'';

  return(<div><SectionTitle sub="A guided practice: trace any event down through the five layers to its source">Event Decoder</SectionTitle>

    {/* Stepper */}
    <div style={{display:'flex',gap:'6px',marginBottom:'24px',flexWrap:'wrap'}}>{DECODER_STEPS.map((lbl,i)=>{const n=i+1;const active=step===n;const reachable=n===1||(n===2&&text.trim())||((n>=3)&&canLocate);return(
      <button key={n} onClick={()=>goStep(n)} disabled={!reachable} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',borderRadius:'20px',border:`1px solid ${active?S.gold:reachable?S.border:'transparent'}`,background:active?S.goldDim:'transparent',color:active?S.gold:reachable?S.textMuted:S.textDim,fontFamily:S.fontSans,fontSize:'12px',fontWeight:active?600:400,cursor:reachable?'pointer':'default'}}>
        <span style={{width:'18px',height:'18px',borderRadius:'50%',border:`1px solid ${active?S.gold:S.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontMono,fontSize:'10px'}}>{n}</span>{lbl}</button>);})}</div>

    {/* STEP 1 — DESCRIBE */}
    {step===1&&<div>
      <Card style={{marginBottom:'24px',borderColor:'rgba(224,182,92,0.16)',background:'linear-gradient(135deg, rgba(224,182,92,0.05), rgba(155,143,199,0.03) 60%, rgba(236,231,221,0.01))'}}>
        <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,margin:'0 0 12px',lineHeight:1.7}}>Pattern Literacy is the art of tracing experience back to its source. Name something you are living; the decoder will help you locate the phase and micro-state it belongs to, then read it down through all five layers.</p>
        <div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.gold,fontStyle:'italic',lineHeight:1.7}}>Every event is an expression of a rhythm · every rhythm the movement of a pattern · every pattern emerges from a structure · every structure serves an Intelligent Order.</div>
      </Card>
      <Card style={{marginBottom:'24px'}}>
        <TextInput label="Describe an event or experience you are living" value={text} onChange={setText} placeholder="e.g. I just left a job I held for years and feel unmoored, excited and afraid at once." multiline/>
        <div style={{display:'flex',justifyContent:'flex-end'}}><PrimaryButton onClick={()=>goStep(2)} disabled={!text.trim()}>Locate the phase →</PrimaryButton></div>
      </Card>

      {decodings.length>0&&<div>
        <h3 style={{fontFamily:S.fontHead,fontSize:'14px',color:S.textMuted,margin:'0 0 16px',textTransform:'uppercase',letterSpacing:'1px'}}>Your past decodings</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{decodings.map(dec=>{const ph=PHASES[dec.phaseIndex];return(<Card key={dec.id} hover onClick={()=>loadDec(dec)}>
          <div style={{display:'flex',gap:'14px',alignItems:'flex-start'}}>
            <span style={{fontSize:'22px',flexShrink:0}}>{ph?ph.icon:'✶'}</span>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:S.fontBody,fontSize:'14px',color:S.text,lineHeight:1.5}}>{dec.text.length>140?dec.text.slice(0,140)+'…':dec.text}</div>
              <div style={{display:'flex',gap:'8px',alignItems:'center',marginTop:'7px',flexWrap:'wrap'}}>{ph&&<Badge label={ph.name} color={S.purple}/>}{dec.micro!=null&&<Badge label={MICRO_STATES[dec.micro]} color={S.gold}/>}{dec.secondaryIndex!=null&&PHASES[dec.secondaryIndex]&&<Badge label={'→ '+PHASES[dec.secondaryIndex].name} color={S.blue}/>}<span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim}}>{formatDate(dec.date)}</span></div></div>
            <button onClick={(e)=>{e.stopPropagation();removeDec(dec.id);}} style={{border:'none',background:'none',color:S.textDim,cursor:'pointer',fontSize:'17px',padding:'2px',flexShrink:0}}>×</button></div>
        </Card>);})}</div>
      </div>}
    </div>}

    {/* STEP 2 — LOCATE */}
    {step===2&&<div>
      <Card style={{marginBottom:'16px',background:'rgba(236,231,221,0.02)'}}><div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textDim,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'6px'}}>The event</div><p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,fontStyle:'italic',margin:0,lineHeight:1.6}}>{'\u201c'+text.trim()+'\u201d'}</p></Card>

      {analysis.length>0?(<Card style={{marginBottom:'16px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Framework analysis — where this belongs</div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{analysis.slice(0,4).map(a=>{const ph=PHASES[a.i];const on=primary===a.i;return(<button key={a.i} onClick={()=>setPrimary(a.i)} style={{textAlign:'left',padding:'12px 14px',borderRadius:'10px',border:`1px solid ${on?S.gold:S.border}`,background:on?S.goldDim:'rgba(255,255,255,0.02)',cursor:'pointer'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}><span style={{fontSize:'20px'}}>{ph.icon}</span>
            <span style={{fontFamily:S.fontSans,fontSize:'14px',fontWeight:600,color:on?S.gold:S.text}}>{ph.name}</span>
            <span style={{fontFamily:S.fontSans,fontSize:'11px',color:S.textMuted}}>Life seeks {ph.seeks} · {ph.func} Function</span>
            <div style={{flex:1,height:'6px',borderRadius:'3px',background:'rgba(236,231,221,0.06)',overflow:'hidden',minWidth:'40px'}}><div style={{height:'100%',width:`${a.score/maxScore*100}%`,background:S.gold,borderRadius:'3px'}}/></div></div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>{a.hits.slice(0,6).map((h,j)=><span key={j} style={{fontFamily:S.fontMono,fontSize:'9.5px',color:S.textDim,padding:'2px 7px',borderRadius:'10px',border:`1px solid ${S.border}`}}>{h}</span>)}</div></button>);})}</div>
      </Card>):(<Card style={{marginBottom:'16px'}}><p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0}}>The framework couldn’t read a clear signal from those words. Trust your own reading and choose the phase that resonates below.</p></Card>)}

      <Card style={{marginBottom:'16px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textMuted,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>{analysis.length>0?'Or choose any phase':'Choose the phase that resonates'}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:'8px'}}>{PHASES.map((ph,i)=>{const on=primary===i;const sug=suggestedSet.has(i);return(<button key={i} onClick={()=>setPrimary(i)} style={{padding:'10px 4px',borderRadius:'10px',border:`1px solid ${on?S.gold:sug?S.gold+'40':S.border}`,background:on?S.goldDim:'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
          <span style={{fontSize:'20px'}}>{ph.icon}</span><span style={{fontFamily:S.fontSans,fontSize:'10px',color:on?S.gold:S.textMuted}}>{ph.name}</span></button>);})}</div>
      </Card>

      {primary!==null&&<Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.gold}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'}}>Where in {p.name} are you?</div>
        <p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textDim,margin:'0 0 12px'}}>Every phase moves through four micro-states. Which quarter are you in?</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'8px'}}>{MICRO_META.map((ms,i)=>{const on=micro===i;return(<button key={i} onClick={()=>setMicro(i)} style={{textAlign:'left',padding:'12px',borderRadius:'10px',border:`1px solid ${on?S.gold:S.border}`,background:on?S.goldDim:'rgba(255,255,255,0.02)',cursor:'pointer'}}>
          <div style={{fontFamily:S.fontHead,fontSize:'14px',fontWeight:500,color:on?S.gold:S.text,marginBottom:'3px'}}>{ms.name}</div>
          <div style={{fontFamily:S.fontBody,fontSize:'11.5px',color:S.textMuted,lineHeight:1.4}}>{ms.desc}</div></button>);})}</div>
      </Card>}

      {primary!==null&&<Card style={{marginBottom:'24px'}}>
        <button onClick={()=>{setShowSec(!showSec);if(showSec)setSecondary(null);}} style={{border:'none',background:'none',color:S.purple,fontFamily:S.fontSans,fontSize:'13px',cursor:'pointer',padding:0}}>{showSec?'− Remove secondary phase':'+ Add a secondary active phase (for transitions)'}</button>
        {showSec&&<div style={{marginTop:'14px'}}><p style={{fontFamily:S.fontBody,fontSize:'13px',color:S.textDim,margin:'0 0 10px'}}>Many events sit between two phases — one completing as another begins. Choose a second, if any:</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:'8px'}}>{PHASES.map((ph,i)=>{if(i===primary)return null;const on=secondary===i;return(<button key={i} onClick={()=>setSecondary(on?null:i)} style={{padding:'9px 4px',borderRadius:'10px',border:`1px solid ${on?S.blue:S.border}`,background:on?'rgba(123,160,196,0.12)':'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
            <span style={{fontSize:'18px'}}>{ph.icon}</span><span style={{fontFamily:S.fontSans,fontSize:'9.5px',color:on?S.blue:S.textMuted}}>{ph.name}</span></button>);})}</div></div>}
      </Card>}

      <div style={{display:'flex',justifyContent:'space-between',gap:'12px'}}><SecondaryButton onClick={()=>goStep(1)}>← Back</SecondaryButton><PrimaryButton onClick={()=>goStep(3)} disabled={!canLocate}>Decode →</PrimaryButton></div>
    </div>}

    {/* STEP 3 — DECODE */}
    {step===3&&p&&mm&&<div>
      <Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.gold}`}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}><span style={{fontSize:'28px'}}>{p.icon}</span>
          <div><div style={{fontFamily:S.fontHead,fontSize:'20px',fontWeight:500,color:S.text}}>Reading through {p.name}{sec?' → '+sec.name:''}</div>
            <div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'1px'}}>{p.sign} · {p.func} Function · {mm.name} micro-state</div></div></div>
        <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.gold,fontStyle:'italic',margin:'14px 0 0',lineHeight:1.6}}>{p.teaching}</p>
      </Card>

      {/* Cycle position */}
      <Card style={{marginBottom:'16px'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.textMuted,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Where this sits in the cycle</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
          {[{i:prevI,role:'coming from'},{i:primary,role:'here'},{i:nextI,role:'moving toward'}].map((c,k)=>{const ph=PHASES[c.i];const here=c.role==='here';return(<React.Fragment key={k}>
            {k>0&&<span style={{color:S.textDim,fontSize:'16px'}}>→</span>}
            <div style={{textAlign:'center',padding:'12px 10px',borderRadius:'12px',flex:here?'0 0 auto':'0 0 auto',minWidth:here?'120px':'90px',border:`1px solid ${here?S.gold:S.border}`,background:here?S.goldDim:'transparent'}}>
              <div style={{fontSize:here?'26px':'20px'}}>{ph.icon}</div>
              <div style={{fontFamily:S.fontSans,fontSize:here?'13px':'11px',fontWeight:here?600:400,color:here?S.gold:S.textMuted,marginTop:'3px'}}>{ph.name}</div>
              <div style={{fontFamily:S.fontMono,fontSize:'8.5px',color:S.textDim,letterSpacing:'0.5px',textTransform:'uppercase',marginTop:'3px'}}>{here?mm.name:c.role}</div></div>
          </React.Fragment>);})}</div>
      </Card>

      {sec&&<Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.blue}`,background:'rgba(123,160,196,0.05)'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.blue,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Transition</div>
        <p style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.textMuted,margin:0,lineHeight:1.6}}>This event sits between two currents: <span style={{color:S.text}}>{p.name}</span> (life seeks {p.seeks}) and <span style={{color:S.text}}>{sec.name}</span> (life seeks {sec.seeks}). One cycle is completing as another begins — expect to feel both at once.</p>
      </Card>}

      <div style={{display:'flex',flexDirection:'column',gap:'2px',marginBottom:'10px'}}>
        {trace.map((row,i)=>{const c=lens(row.id).color;return(<div key={row.id}>
          <Card style={{borderLeft:`3px solid ${c}`,padding:'16px 20px',background:`${c}08`,borderRadius:i===0?'14px 14px 4px 4px':i===trace.length-1?'4px 4px 14px 14px':'4px'}}>
            <div style={{display:'flex',alignItems:'baseline',gap:'10px',marginBottom:'5px',flexWrap:'wrap'}}>
              <span style={{fontFamily:S.fontMono,fontSize:'10px',color:c,letterSpacing:'1.5px',minWidth:'135px'}}>{row.label.toUpperCase()}</span>
              <span style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text}}>{row.head}</span></div>
            <div style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.textMuted,lineHeight:1.6}}>{i===0?<span style={{fontStyle:'italic',color:S.text}}>{'\u201c'+text.trim()+'\u201d'}</span>:row.body}</div>
            <div style={{fontFamily:S.fontBody,fontSize:'12.5px',color:S.textDim,fontStyle:'italic',marginTop:'7px'}}>{lens(row.id).question}</div>
          </Card>
          {i<trace.length-1&&<div style={{textAlign:'center',color:S.textDim,fontSize:'12px',lineHeight:1}}>↓</div>}
        </div>);})}
      </div>
      <p style={{fontFamily:S.fontBody,fontSize:'12.5px',color:S.textDim,margin:'0 0 20px',textAlign:'center',fontStyle:'italic'}}>Reading downward traces this event from the surface back to the source it serves.</p>

      <Card style={{marginBottom:'24px'}}>
        <TextInput label="Read it in your own words (optional)" value={reading} onChange={setReading} placeholder="What is repeating? What is being built? What is life asking of you here?" multiline/>
      </Card>

      <div style={{display:'flex',justifyContent:'space-between',gap:'12px'}}><SecondaryButton onClick={()=>goStep(2)}>← Back</SecondaryButton><PrimaryButton onClick={()=>goStep(4)}>Integrate →</PrimaryButton></div>
    </div>}

    {/* STEP 4 — INTEGRATE */}
    {step===4&&p&&mm&&<div>
      <Card style={{marginBottom:'16px',borderColor:'rgba(224,182,92,0.16)',background:'linear-gradient(135deg, rgba(224,182,92,0.06), rgba(236,231,221,0.012))'}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Synthesis</div>
        <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.text,margin:0,lineHeight:1.75}}>{synth}</p>
        {reading.trim()&&<div style={{marginTop:'14px',paddingTop:'14px',borderTop:`1px solid ${S.border}`}}><div style={{fontFamily:S.fontMono,fontSize:'9.5px',color:S.textDim,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>Your reading</div><p style={{fontFamily:S.fontBody,fontSize:'14.5px',color:S.textMuted,fontStyle:'italic',margin:0,lineHeight:1.6}}>{reading.trim()}</p></div>}
      </Card>

      <Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.blue}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.blue,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>What this is cultivating in you</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>{[['Intelligence',p.dev.intelligence],['Character',p.dev.character],['Capability',p.dev.capability],['Consciousness',p.dev.consciousness]].map(([k,v],i)=>(<div key={i} style={{padding:'12px 14px',borderRadius:'10px',background:`${S.blue}0A`,border:`1px solid ${S.blue}1F`}}>
          <div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.blue,letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>{k}</div>
          <div style={{fontFamily:S.fontHead,fontSize:'14.5px',fontWeight:500,color:S.text}}>{v}</div></div>))}</div>
      </Card>

      <Card style={{marginBottom:'16px',borderLeft:`3px solid ${S.gold}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Aligned action</div>
        <div style={{padding:'12px 14px',borderRadius:'10px',background:S.goldDim,border:`1px solid ${S.gold}30`,marginBottom:'14px'}}><div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.gold,letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>Your move now — {mm.name}</div><div style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,lineHeight:1.55}}>In this micro-state, {mm.move}.</div></div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'14px'}}>{p.practices.map((pr,i)=>(<div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <span style={{flexShrink:0,fontFamily:S.fontMono,fontSize:'12px',color:S.gold,marginTop:'2px'}}>{String(i+1).padStart(2,'0')}</span>
          <span style={{fontFamily:S.fontBody,fontSize:'15px',color:S.textMuted,lineHeight:1.5}}>{pr}</span></div>))}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div style={{padding:'12px 14px',borderRadius:'10px',background:`${S.red}0A`,border:`1px solid ${S.red}24`}}><div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.red,letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>Shadow to watch</div><div style={{fontFamily:S.fontBody,fontSize:'13.5px',color:S.textMuted,lineHeight:1.5}}>{p.shadow}</div></div>
          <div style={{padding:'12px 14px',borderRadius:'10px',background:`${S.green}0A`,border:`1px solid ${S.green}24`}}><div style={{fontFamily:S.fontMono,fontSize:'9px',color:S.green,letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>Gift to claim</div><div style={{fontFamily:S.fontBody,fontSize:'13.5px',color:S.textMuted,lineHeight:1.5}}>{p.gift}</div></div>
        </div>
      </Card>

      <Card style={{marginBottom:'16px',borderLeft:`3px solid ${ELEMENT_COLOR[p.element]}`}}>
        <div style={{fontFamily:S.fontMono,fontSize:'10px',color:ELEMENT_COLOR[p.element],letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>A parable for this phase</div>
        <div style={{fontFamily:S.fontHead,fontSize:'20px',color:ELEMENT_COLOR[p.element],marginBottom:'10px'}}>{CODEX.PARABLES[primary].title}</div>
        <p style={{fontFamily:S.fontBody,fontSize:'15px',color:S.text,lineHeight:1.7,margin:'0 0 12px'}}>{CODEX.PARABLES[primary].story}</p>
        <p style={{fontFamily:S.fontBody,fontSize:'13.5px',color:S.textMuted,fontStyle:'italic',lineHeight:1.6,margin:'0 0 12px',paddingLeft:'12px',borderLeft:`1px solid ${S.border}`}}><span style={{fontFamily:S.fontSans,fontWeight:600,fontStyle:'normal',fontSize:'11px',color:ELEMENT_COLOR[p.element]}}>THE READING&nbsp;&nbsp;</span>{CODEX.PARABLES[primary].reading}</p>
        <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.text,lineHeight:1.6,margin:'0 0 14px'}}><span style={{fontFamily:S.fontSans,fontWeight:600,fontSize:'11px',color:ELEMENT_COLOR[p.element]}}>THIS WEEK&nbsp;&nbsp;</span>{CODEX.PARABLES[primary].invitation}</p>
        {openCodex&&<div style={{display:'flex',justifyContent:'flex-end'}}><SecondaryButton onClick={()=>openCodex(primary,'parables')}>Open in the Codex \u2192</SecondaryButton></div>}
      </Card>

      <Card style={{marginBottom:'24px'}}>
        <TextInput label="A note on how you will move with this (optional)" value={note} onChange={setNote} placeholder="What is one aligned step you will take?" multiline/>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-end'}}>
          {posSet&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.green}}>Position set ✓</span>}
          <SecondaryButton onClick={setPosition}>Set as my current position</SecondaryButton>
          <SecondaryButton onClick={openInWisdom}>Open in Phase Wisdom →</SecondaryButton>
          {saved&&<span style={{fontFamily:S.fontSans,fontSize:'12px',color:S.green}}>Saved ✓</span>}
          <PrimaryButton onClick={save}>Save decoding</PrimaryButton></div>
      </Card>

      <div style={{display:'flex',justifyContent:'space-between',gap:'12px'}}><SecondaryButton onClick={()=>goStep(3)}>← Back</SecondaryButton><SecondaryButton onClick={reset}>Decode another</SecondaryButton></div>
    </div>}
  </div>);
}

// ══ WHY ATTUNED ══
function WhyAttunedPage({goTo}){
  const triad=[
    {k:'Learn the Order',c:S.gold,d:'Understand the architecture beneath everything. One coherent model — five layers, twelve phases, twelve developmental functions — that explains career, relationships, crises, and creativity alike.',f:['The Cosmic Reality Framework','Phase Wisdom & the Five Lenses','The Learning curriculum','Wisdom Tracks across six traditions'],cta:'Explore the phases',go:'phases'},
    {k:'Read the Pattern',c:S.purple,d:'See where you actually are and what is really happening. Locate yourself in the cycle, then trace any event back to its source instead of reacting to the surface.',f:['My Journey & micro-states','The Rhythm Calendar\u2019s current season','The Event Decoder','Saved decodings & Journal'],cta:'Decode an event',go:'decoder'},
    {k:'Move with the Rhythm',c:S.green,d:'Act in alignment and in right timing. Know when to begin, when to refine, when to release — and move with the season rather than against it.',f:['Aligned-action guidance','Seasonal gatherings','Attunement Circles','Coaching & Guides'],cta:'See this season',go:'rhythm'},
  ];
  const pillars=[
    {i:'◈',t:'One coherent lens',d:'A single framework makes sense of every area of life — not a dozen disconnected self-help ideas.'},
    {i:'⌖',t:'Insight becomes action',d:'The Event Decoder turns the philosophy into a daily practice: name an event, trace it to its source, receive aligned action.'},
    {i:'◐',t:'Orientation & right timing',d:'Always know where you are in the cycle, and when to act, wait, or let go — the rarest skill the framework teaches.'},
    {i:'✦',t:'Wisdom bigger than one app',d:'The same pattern is echoed across Ifá, Kabbalah, the I Ching, Scripture, Buddhism, and Hermetic philosophy.'},
    {i:'☉',t:'A path of mastery',d:'Five levels from Observer to Guide, each deepening your access, your practice, and your identity in the community.'},
    {i:'◎',t:'Belonging & shared language',d:'A community that speaks one vocabulary — circles, guides, gatherings, and a continuous record of your own work.'},
  ];
  return(<div><SectionTitle sub="What the Attuned Community offers its members">Why Attuned</SectionTitle>

    {/* Hero */}
    <div style={{...glassCard,padding:'34px',marginBottom:'26px',background:'linear-gradient(135deg, rgba(224,182,92,0.08), rgba(155,143,199,0.04) 55%, rgba(236,231,221,0.012))',borderColor:'rgba(224,182,92,0.18)'}}>
      <div style={{fontFamily:S.fontMono,fontSize:'10px',color:S.gold,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'14px'}}>Twelvefold Institute</div>
      <h1 style={{fontFamily:S.fontHead,fontSize:'30px',fontWeight:500,color:S.text,margin:'0 0 14px',letterSpacing:'-0.5px',lineHeight:1.15}}>Learn the Order. Read the Pattern. Move with the Rhythm.</h1>
      <p style={{fontFamily:S.fontBody,fontSize:'17px',color:S.textMuted,margin:0,lineHeight:1.7,maxWidth:'640px'}}>Attuned gives you the literacy to read your own life — and the practices to move with it consciously. It turns experience from something random and reactive into something legible, developmental, and participatable.</p>
    </div>

    {/* The triad */}
    <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'28px'}}>{triad.map((t,i)=>(<Card key={i} style={{borderLeft:`3px solid ${t.c}`}}>
      <div style={{display:'flex',alignItems:'baseline',gap:'12px',marginBottom:'10px',flexWrap:'wrap'}}><span style={{fontFamily:S.fontMono,fontSize:'10px',color:t.c,letterSpacing:'1.5px'}}>{String(i+1).padStart(2,'0')}</span><h3 style={{fontFamily:S.fontHead,fontSize:'21px',fontWeight:500,color:S.text,margin:0}}>{t.k}</h3></div>
      <p style={{fontFamily:S.fontBody,fontSize:'15.5px',color:S.textMuted,margin:'0 0 14px',lineHeight:1.65}}>{t.d}</p>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'16px'}}>{t.f.map((f,j)=><span key={j} style={{fontFamily:S.fontSans,fontSize:'11.5px',color:t.c,padding:'4px 11px',borderRadius:'20px',border:`1px solid ${t.c}33`,background:`${t.c}0F`}}>{f}</span>)}</div>
      <SecondaryButton onClick={()=>goTo&&goTo(t.go)}>{t.cta} →</SecondaryButton>
    </Card>))}</div>

    {/* Value pillars */}
    <h3 style={{fontFamily:S.fontHead,fontSize:'15px',color:S.textMuted,margin:'0 0 16px',textTransform:'uppercase',letterSpacing:'1.5px'}}>What members gain</h3>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'28px'}}>{pillars.map((p,i)=>(<Card key={i}>
      <div style={{fontSize:'22px',color:S.gold,marginBottom:'10px'}}>{p.i}</div>
      <h4 style={{fontFamily:S.fontHead,fontSize:'17px',fontWeight:500,color:S.text,margin:'0 0 7px'}}>{p.t}</h4>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textMuted,margin:0,lineHeight:1.6}}>{p.d}</p>
    </Card>))}</div>

    {/* Membership path */}
    <Card style={{marginBottom:'26px'}}>
      <h3 style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:S.text,margin:'0 0 4px'}}>A path, not a subscription</h3>
      <p style={{fontFamily:S.fontBody,fontSize:'14px',color:S.textDim,margin:'0 0 18px'}}>Each level answers a deeper question and unlocks more of the practice.</p>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{LEVELS.map((l,i)=>(<div key={l.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'12px 14px',borderRadius:'10px',background:`${l.color}0A`,border:`1px solid ${l.color}24`}}>
        <span style={{fontFamily:S.fontMono,fontSize:'11px',color:l.color,minWidth:'18px'}}>{i+1}</span>
        <div style={{flex:1}}><div style={{display:'flex',gap:'10px',alignItems:'baseline',flexWrap:'wrap'}}><span style={{fontFamily:S.fontHead,fontSize:'16px',fontWeight:500,color:S.text}}>{l.label}</span><span style={{fontFamily:S.fontBody,fontSize:'13px',color:l.color,fontStyle:'italic'}}>{'\u201c'+l.question+'\u201d'}</span></div></div>
        <span style={{fontFamily:S.fontMono,fontSize:'11px',color:S.textMuted,flexShrink:0}}>{l.price}</span></div>))}</div>
    </Card>

    {/* Closing */}
    <Card style={{background:'linear-gradient(135deg, rgba(224,182,92,0.06), rgba(236,231,221,0.012))',borderColor:'rgba(224,182,92,0.16)'}}>
      <p style={{fontFamily:S.fontBody,fontSize:'16px',color:S.gold,fontStyle:'italic',margin:'0 0 18px',lineHeight:1.7}}>Every event is an expression of a rhythm · every rhythm the movement of a pattern · every pattern emerges from a structure · every structure serves an Intelligent Order. To read reality is to participate in it consciously.</p>
      <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}><PrimaryButton onClick={()=>goTo&&goTo('decoder')}>Decode an event</PrimaryButton><SecondaryButton onClick={()=>goTo&&goTo('learning')}>Begin learning</SecondaryButton></div>
    </Card>
  </div>);
}

const NAV_ITEMS = [
  {id:'dashboard',icon:'◈',label:'Dashboard'},{id:'journey',icon:'◇',label:'My Journey'},{id:'decoder',icon:'⌖',label:'Event Decoder'},
  {id:'phases',icon:'☉',label:'Phase Wisdom'},{id:'rhythm',icon:'◐',label:'Rhythm Calendar'},
  {id:'wisdom',icon:'✦',label:'Wisdom Tracks'},{id:'learning',icon:'▣',label:'Learning'},
  {id:'community',icon:'◎',label:'Community'},{id:'coaching',icon:'⚘',label:'Coaching'},
  {id:'circles',icon:'◉',label:'Attunement Circles'},{id:'events',icon:'▸',label:'Events'},
  {id:'journal',icon:'✎',label:'Journal'},{id:'codex',icon:'❖',label:'The Codex'},{id:'why',icon:'❂',label:'Why Attuned'},
];


// ❖ THE CODEX OF INTELLIGENT ORDER — content + in-app view (pass two)
const CODEX = {
 "LAYERS": [
  {
   "id": "io",
   "book": "I",
   "title": "Of Intelligent Order",
   "subtitle": "The Source",
   "color": "#E0B65C"
  },
  {
   "id": "structure",
   "book": "II",
   "title": "Of Structure",
   "subtitle": "The Architecture",
   "color": "#9B8FC7"
  },
  {
   "id": "pattern",
   "book": "III",
   "title": "Of Pattern",
   "subtitle": "What Repeats",
   "color": "#7BA0C4"
  },
  {
   "id": "rhythm",
   "book": "IV",
   "title": "Of Rhythm",
   "subtitle": "The Timing",
   "color": "#7FB39A"
  },
  {
   "id": "events",
   "book": "V",
   "title": "Of Events",
   "subtitle": "The Lived Surface",
   "color": "#D98C7A"
  }
 ],
 "PHASES": [
  {
   "sign": "Aries",
   "name": "Ignition",
   "icon": "♈",
   "seeks": "emergence",
   "gift": "The courage to begin before conditions are perfect.",
   "shadow": "Impulsiveness without direction — starting without the willingness to sustain."
  },
  {
   "sign": "Taurus",
   "name": "Foundation",
   "icon": "♉",
   "seeks": "stability",
   "gift": "The patience to let something become what it is meant to be.",
   "shadow": "Clinging to comfort — stubbornness mistaken for commitment."
  },
  {
   "sign": "Gemini",
   "name": "Intelligence",
   "icon": "♊",
   "seeks": "understanding",
   "gift": "The capacity to see patterns across seemingly unrelated domains.",
   "shadow": "Scattered attention — knowledge gathered but never connected."
  },
  {
   "sign": "Cancer",
   "name": "Inner Root",
   "icon": "♋",
   "seeks": "connection",
   "gift": "The ability to feel truth, not only think it.",
   "shadow": "Withdrawal disguised as self-care — understanding raised as a wall."
  },
  {
   "sign": "Leo",
   "name": "Authority",
   "icon": "♌",
   "seeks": "expression",
   "gift": "The courage to be visible and accountable for what you create.",
   "shadow": "Performance in place of substance — seeking applause instead of truth."
  },
  {
   "sign": "Virgo",
   "name": "Correction",
   "icon": "♍",
   "seeks": "refinement",
   "gift": "The ability to refine without destroying what has been built.",
   "shadow": "Perfectionism that prevents completion — criticism disguised as help."
  },
  {
   "sign": "Libra",
   "name": "Balance",
   "icon": "♎",
   "seeks": "harmony",
   "gift": "The ability to hold two truths at once without collapsing into one.",
   "shadow": "People-pleasing disguised as harmony — avoiding conflict at the cost of truth."
  },
  {
   "sign": "Scorpio",
   "name": "Transformation",
   "icon": "♏",
   "seeks": "transformation",
   "gift": "The ability to let something die so something real can be born.",
   "shadow": "Control disguised as intensity — a grip that calls itself devotion."
  },
  {
   "sign": "Sagittarius",
   "name": "Expansion",
   "icon": "♐",
   "seeks": "expansion",
   "gift": "The ability to turn lived suffering into wisdom worth sharing.",
   "shadow": "Preaching without practice — expansion that outruns its roots."
  },
  {
   "sign": "Capricorn",
   "name": "Mastery",
   "icon": "♑",
   "seeks": "mastery",
   "gift": "The ability to build something that endures beyond your enthusiasm.",
   "shadow": "Rigidity and ambition disconnected from service."
  },
  {
   "sign": "Aquarius",
   "name": "Liberation",
   "icon": "♒",
   "seeks": "evolution",
   "gift": "The ability to evolve a system without destroying what it serves.",
   "shadow": "Rebellion without purpose — detachment disguised as independence."
  },
  {
   "sign": "Pisces",
   "name": "Dissolution",
   "icon": "♓",
   "seeks": "integration",
   "gift": "The ability to surrender to completion and trust what comes next.",
   "shadow": "Escapism and martyrdom — refusing to let a cycle end."
  }
 ],
 "PASSAGES": {
  "io": [
   {
    "open": "Every Book begins where every life begins: with an impulse that has not yet found its form.",
    "verses": [
     "Before the first form there is the impulse toward form.",
     "And before you were anything you could name, you were a longing the Order felt, and answered.",
     "Life seeks emergence — and the seed does not wait for the soil's permission, nor need you wait for the world's.",
     "What you have been calling courage, the Order has been calling beginning all along; they were never two things.",
     "Do not be ashamed of how new it is, how unproven, how small. Everything that now seems inevitable was once only a first day.",
     "The fear you feel at the threshold is not a sign that you are wrong; it is the weight of a real thing about to become real.",
     "There is a shadow here: to begin everything and finish nothing, to mistake the thrill of the spark for the patience of the fire.",
     "But the deeper danger is never to begin at all — to keep the impulse safe and unborn until it goes quiet.",
     "So light it. A beginning does not ask you to see the whole road; it asks for the step that lets the next step appear.",
     "You are allowed to begin before you are ready. That is what beginning means."
    ],
    "reflection": "What new impulse is trying to emerge in you right now, and where are you waiting for a permission that is yours alone to give?",
    "practice": "Name one thing you will initiate today — small is fine — and take its first visible step within the hour.",
    "blessing": "May you trust the stirring, and begin."
   },
   {
    "open": "After the spark, the Order asks a quieter, harder thing: stay.",
    "verses": [
     "The Order does not rush; it abides.",
     "Life seeks stability — not the stillness of fear, but the steadiness of a thing that has found its ground.",
     "What is sparked must be given earth to stand on, or it returns to smoke.",
     "There is a patience the world mistakes for slowness, and it is the patience of everything that has ever lasted.",
     "Be patient with what is taking root in you. Roots do their work in the dark, unseen, and they are not idle.",
     "The shadow here is to confuse stubbornness with commitment, to cling to a comfort long after it has stopped being a foundation.",
     "Ask of each thing you are holding: am I rooting, or am I merely refusing to let go?",
     "What you tend faithfully through an unglamorous season becomes the floor that later holds your whole house.",
     "Do not despise the ordinary days of building. They are not the wait before your life; they are its making."
    ],
    "reflection": "What in your life needs patient tending rather than another new beginning, and where are you rushing past the rooting it requires?",
    "practice": "Choose one commitment you have been neglecting and recommit to it this week, in one concrete, repeatable way.",
    "blessing": "May you have the patience to let a thing become what it is meant to be."
   },
   {
    "open": "Once a thing is rooted, it must learn — and the Order delights to be understood.",
    "verses": [
     "The Order is intelligible, and it longs to be understood.",
     "Life seeks understanding — not the hoarding of facts, but the seeing of how all things lean toward one another.",
     "To learn is to discover the hidden kinship between things that looked, until now, like strangers.",
     "Knowledge is not a pile you accumulate; it is a sight you slowly acquire.",
     "Ask freely. The questions you are afraid are foolish are very often the doors.",
     "The shadow here is scattered attention — a mind so busy gathering that it never pauses to understand what it holds.",
     "Information that never becomes insight is only weight; let your learning resolve, sometimes, into sight.",
     "Stay curious longer than is comfortable. The answer that arrives too quickly is usually the question in disguise.",
     "You are not scattered when you wander widely; you are mapping. Trust that the threads will gather."
    ],
    "reflection": "What are you learning right now that is quietly changing how you see, and where might you be confusing information with understanding?",
    "practice": "Read something outside your usual domain this week, and write down three connections it makes to what you already know.",
    "blessing": "May you see the kinship between things, and call it wisdom."
   },
   {
    "open": "And then the Order asks that the knowing come home — down out of the head, into the body, into belonging.",
    "verses": [
     "The Order is not cold; it desires to be felt.",
     "Life seeks connection — that what you know in your mind might descend and be felt in the body, and that you be held while it happens.",
     "Knowledge that has never moved you cannot yet guide you; until it becomes felt-truth, it remains a rumor.",
     "What do you actually feel about what you know? The Order waits for that answer more patiently than for any other.",
     "There is a safety that is not a feeling first but an architecture — built, beam by beam, by those who keep returning.",
     "The shadow here is the withdrawal that calls itself self-care, the wall built so high that even love cannot reach you.",
     "Let yourself be vulnerable in the one place that has earned it. Connection is the risk that makes a self worth having.",
     "Whom you keep returning to tells you where your roots already are; tend those roots before you envy other gardens.",
     "You were never meant to carry knowing alone."
    ],
    "reflection": "What truth have you understood with your mind but not yet allowed yourself to feel, and who is safe enough to feel it beside?",
    "practice": "Sit with one emotion for five minutes today without trying to fix or explain it; simply let it be felt.",
    "blessing": "May you feel the truth, and not only think it."
   },
   {
    "open": "What has been felt asks, at last, to be shown — and the Order does not hide its light.",
    "verses": [
     "The Order does not hide its light, and it asks the same of you.",
     "Life seeks expression — that what you have felt and learned might be authored into the open, signed in your own hand.",
     "To be seen as you truly are is not vanity; it is the Source completing itself through a particular life, which is yours.",
     "Authority is not dominion over others; it is authorship — the willingness to stand behind what you have built, learned, and felt.",
     "Can you express your truth without needing the applause? The Order can; teach your heart its patience.",
     "The shadow here is performance: the polished surface offered in place of the real, the costume worn so long it forgets the body beneath.",
     "Ask yourself who you are when no one is watching — and then dare to let that one become public.",
     "Hiding your real capacity is not humility; it is a quiet theft from everyone your gift was meant to reach.",
     "Stand behind what you have made. You need no permission to be the author of your own life."
    ],
    "reflection": "Where are you hiding your real capacity, and what would it look like to lead from authenticity rather than performance?",
    "practice": "Share one genuine opinion today without softening it, and notice what you feared would happen, but did not.",
    "blessing": "May you have the courage to be seen, and to be accountable for what you create."
   },
   {
    "open": "After the boldness of being seen comes the humility of being made better.",
    "verses": [
     "The Order tends toward the excellent, gently and without end.",
     "Life seeks refinement — not perfection, which is only a polished kind of fear, but the loving precision of craft.",
     "Correction is not the Order's judgment of you; it is its care for what you are building.",
     "To refine is to love a thing enough to improve it without condemning it.",
     "After the radiance of Authority comes the quiet of the workbench, where excellence is made one detail at a time.",
     "The shadow here is the perfectionism that never finishes — criticism wearing the mask of helpfulness, fear wearing the mask of standards.",
     "Receive correction as you would a gift from one who wants you to flourish, for that is what, at its best, it is.",
     "External order and inner clarity are the same beam seen from two rooms; tidy one and you steady the other.",
     "Improve the single thing in front of you. The Order is not built in leaps but in faithful, small adjustments."
    ],
    "reflection": "What in your life is functional but not yet excellent, and where are you avoiding a needed correction out of comfort?",
    "practice": "Choose one piece of your work and improve a single detail today; then ask one trusted person for honest feedback, and receive it without defending.",
    "blessing": "May you refine without destroying what you have built."
   },
   {
    "open": "Refined within, you turn outward, where self meets other and must find its right proportion.",
    "verses": [
     "The Order holds opposites without crushing either.",
     "Life seeks harmony — not sameness, but right proportion, the just weight given to each thing.",
     "Balance does not mean an equal split; it means the proportion that lets two true things stand together without collapse.",
     "Beauty and fairness are not ornaments upon reality; they are its load-bearing beams.",
     "You may hold two truths at once. The Order does, eternally, and does not break.",
     "The shadow here is the peace that is really avoidance — the people-pleasing that surrenders truth to keep a fragile quiet.",
     "Notice where you give too much, and where too little; the scale is asking to be made honest, not heavy.",
     "Justice in a relationship is not coldness; it is the warmth that refuses to let love become a place where one person disappears.",
     "Make something fair today, and you will have done, in miniature, the work the whole Order is always doing."
    ],
    "reflection": "Which relationship in your life needs recalibration right now — where are you giving too much, and where too little?",
    "practice": "Have one conversation this week that restores balance in a relationship, naming honestly where the proportion has slipped.",
    "blessing": "May you hold two truths at once without collapsing into either."
   },
   {
    "open": "And then, sometimes, the Order asks the hardest thing: that something be allowed to end.",
    "verses": [
     "The Order is not afraid of endings; it composes with them.",
     "Life seeks transformation — and what can no longer live is gathered, tenderly, as fuel for what comes next.",
     "This is the depth most people resist and most people need.",
     "Every pattern that no longer serves you becomes, when released, the very material of your becoming.",
     "The death you are resisting may be the doorway you have been praying for.",
     "The shadow here is control disguised as intensity — a grip so tight on what is already over that nothing new can be born.",
     "You must be willing to let go completely; half-releases only prolong the dying.",
     "Honor the ending. Grief is not the opposite of faith; it is faith, keeping watch beside what it loved.",
     "Nothing real is ever lost here. It is only changing form."
    ],
    "reflection": "What are you holding onto that has already ended, and what would you need to release to become who you are becoming?",
    "practice": "Name one thing you must let go of, write it down, and mark its ending with a small deliberate act — then sit with the discomfort for ten minutes without distraction.",
    "blessing": "May you let what must die become the ground of what is to be born."
   },
   {
    "open": "Having survived the depth, you rise asking what it all meant — and the Order is vast.",
    "verses": [
     "The Order is vast, and it invites you outward.",
     "Life seeks expansion — that the meaning you earned in the depths might widen until it can shelter others.",
     "Having come through transformation, you now ask the larger question: what does this mean, not only for me, but for the whole?",
     "This is where private experience becomes teaching, where the wound that healed becomes the medicine you can offer.",
     "What you suffered and survived was never only yours to keep.",
     "The shadow here is the preaching that outruns the practice — a vision so busy expanding that it forgets to stay rooted.",
     "Let your reach and your depth grow together; meaning untethered from life becomes only noise with good posture.",
     "Where is your vision too small for what reality is asking of you? Dare, sometimes, to want more on the world's behalf.",
     "Let your vision grow as large as the love that is asking to move through it."
    ],
    "reflection": "What has your recent experience taught you that could now serve others, and where is your vision too small for what is being asked of you?",
    "practice": "Share one hard-won insight this week with someone who needs it, offered as a gift rather than a sermon.",
    "blessing": "May you find meaning in what you suffered, and turn it into a lamp for someone's road."
   },
   {
    "open": "Vision, to serve beyond you, must take durable form — and the Order builds to last.",
    "verses": [
     "The Order builds slowly, and what it builds endures.",
     "Life seeks mastery — not dominion, but the patient raising of something that will outlast your enthusiasm.",
     "A vision that cannot be built into form cannot serve beyond the one who held it.",
     "Mastery is not the same as ambition; ambition wants to be seen as great, mastery wants the work to be good.",
     "The discipline you give a thing today is the love it returns to you on the day your enthusiasm runs dry.",
     "The shadow here is rigidity — control mistaken for excellence, an ambition that has forgotten whom it was meant to serve.",
     "Build for the version of you who will one day inherit this, and for the others who will live inside what you make.",
     "Do the unglamorous task. Mastery is mostly the willingness to keep doing well what no one is applauding.",
     "What you build well becomes, in time, a shelter — first for you, and then for those who come after."
    ],
    "reflection": "What vision do you hold that needs durable form, and where are you relying on inspiration where discipline is what is required?",
    "practice": "Make a 90-day plan for one important project this week, and do today the single unglamorous task you have been postponing.",
    "blessing": "May you build something that endures beyond your enthusiasm, and serves beyond yourself."
   },
   {
    "open": "And what is built well must still, in time, be freed to change — for the Order is alive.",
    "verses": [
     "The Order is alive, and the living must change to stay alive.",
     "Life seeks evolution — the wisdom that knows the hour when a once-good rule has finished its work.",
     "Liberation is not rebellion; it is the intelligence that can tell a constraint from a support.",
     "To liberate is not to burn the house down, but to open its windows so the house can keep breathing.",
     "The very structures that once freed you can become, unexamined, the next thing you must outgrow.",
     "The shadow here is rebellion without purpose — a breaking for the thrill of breaking, a detachment that calls itself freedom.",
     "Ask of every rule you obey: is this mine, or only inherited? Keep what serves the living; release the rest with thanks.",
     "Freedom is not the absence of structure; it is structure that still serves life rather than the other way round.",
     "To evolve a thing without destroying what it was for — this is the most delicate craft the Order knows."
    ],
    "reflection": "What structure in your life has quietly become a constraint rather than a support, and where are you conforming to expectations that no longer serve?",
    "practice": "Question one belief you hold this week — ask whether it is truly yours or merely inherited — and break one routine to feel the room it makes.",
    "blessing": "May you evolve what no longer serves, without destroying what it was for."
   },
   {
    "open": "And at the last the cycle completes, returning to the field from which it came.",
    "verses": [
     "The Order receives all things back into itself, and calls it not failure but completion.",
     "Life seeks integration — the gathering of a whole cycle into a single, quiet knowing.",
     "Everything dissolves into the field it came from; this is not the end of the story but its breathing.",
     "The next ignition is already forming in the stillness; rest is not the opposite of beginning but its womb.",
     "There is a season to stop starting things, to let the hands grow empty and the heart grow wide.",
     "The shadow here is escapism — the dissolving that refuses to integrate, the surrender that is really a flight.",
     "Do not refuse the ending out of fear; a cycle that is not allowed to close cannot release its gift.",
     "Carry forward only what this cycle taught you; lay the rest down with gratitude, and let it return.",
     "You are allowed to rest. Endings are holy, and you have earned this one."
    ],
    "reflection": "What cycle in your life is completing right now, and what has it taught you that you wish to carry into the next?",
    "practice": "Write a completion letter to something that is ending this week, then take one hour to do nothing productive at all — simply to practice being.",
    "blessing": "May you surrender to completion, and trust what is already forming beneath the stillness."
   }
  ],
  "structure": [
   {
    "open": "The Order's first act of building is, surprisingly, an act of clearing.",
    "verses": [
     "So the Order builds you a beginning — and a beginning is mostly empty space, on purpose.",
     "The architecture of ignition is the cleared ground: the calendar opened, the old thing set down, the yes spoken aloud.",
     "Before you can raise the new, you must make room; emptiness is not the absence of structure but its first stroke.",
     "Do not over-furnish the room before you have entered it; a beginning crowded with plans is no beginning at all.",
     "The first structure you ever need is permission, and it is the one structure no one else can build for you.",
     "The shadow here is the false start that is really avoidance — endless preparation standing in for the frightening first step.",
     "Clear one thing. Decline one thing. Open one space. The Order will meet you in the room you make.",
     "A scaffold is not the building; let your early structures be light enough to take down again.",
     "Build the doorway first, and walk through it."
    ],
    "reflection": "What would you have to clear — a commitment, a clutter, a belief — to make real room for the thing trying to begin?",
    "practice": "Remove one obligation or object this week that is occupying space the new thing needs, and leave that space deliberately empty.",
    "blessing": "May you build the permission, and enter the room."
   },
   {
    "open": "Now the Order lays the walls that everything later will lean upon.",
    "verses": [
     "Here the Order lays the load-bearing walls of your life.",
     "The architecture of foundation is the habit, the routine, the resource quietly stored, the body cared for.",
     "These are not glamorous beams, but everything you will one day build rests upon them.",
     "A foundation is invisible by design; its whole virtue is that you can forget it is there and still be held.",
     "Tend the unseen supports. A life, like a house, is held up by what no one applauds.",
     "The shadow here is the comfort that has hardened into a cage — a stability so guarded it has stopped letting life in.",
     "Build routines that serve you, then guard them as you would guard the floor you stand on.",
     "Steadiness is not glamour, but it is the quiet condition of everything glamorous that will ever happen to you.",
     "What you establish twice becomes a floor; what you establish faithfully becomes a foundation."
    ],
    "reflection": "Which load-bearing habit or resource in your life needs reinforcing before you build anything new upon it?",
    "practice": "Spend twenty minutes on one foundational task this week with no multitasking — fully present to the unglamorous beam you are laying.",
    "blessing": "May the unseen supports of your life be strong, and faithfully tended."
   },
   {
    "open": "The Order frames a mind wide enough to hold more than it currently knows.",
    "verses": [
     "The Order frames a mind that can hold more than it knew.",
     "The architecture of intelligence is the open question, the good teacher, the company you keep, the language you learn to think in.",
     "You become the conversations you choose to sit inside; choose them as you would choose the rooms you live in.",
     "A narrow structure can hold only narrow thoughts; widen the frame and watch what suddenly fits.",
     "Build rooms in yourself wide enough for ideas that disagree, and you will never again be a prisoner of a single one.",
     "The shadow here is the structure so rigid it can only confirm itself, mistaking the echo of its own walls for truth.",
     "Seek the teacher and the text that unsettle you a little; growth lives at the edge of your current architecture.",
     "Language is structure too: learn the words for a thing and you gain the rooms in which to think it.",
     "Frame your mind for kinship, and the scattered facts of your life will begin to find one another."
    ],
    "reflection": "Whose company or which conversations are quietly shaping the architecture of your thinking, and is that the structure you would choose?",
    "practice": "Practice articulating one complex idea in simple language this week, and listen to someone fully without preparing your reply.",
    "blessing": "May you build rooms in yourself wide enough for ideas that disagree."
   },
   {
    "open": "And the Order raises the warmest architecture of all: a place to belong.",
    "verses": [
     "And so it builds you a vessel of belonging — a home, a bond, a held place where you may set down your guard at last.",
     "The architecture of inner root is trust: the relationships strong enough to carry your weight when you are tired.",
     "Safety is not a feeling first; it is an architecture, built beam by beam by those who keep returning.",
     "Belonging is constructed the way anything sturdy is — slowly, faithfully, through a thousand small acts of showing up.",
     "Let yourself be held by what you have helped to build; the vessel is only real if you climb inside it.",
     "The shadow here is the over-protection that walls out the very connection it was built to keep safe.",
     "A home with no doors is a prison; build belonging with thresholds, not only walls.",
     "Tend the relationships that have earned your weight, and let the others be acquaintances without resentment.",
     "What you build with those who keep returning becomes the floor beneath your feeling life."
    ],
    "reflection": "What relationships form the load-bearing structure of your belonging, and where might your walls be keeping out the very closeness you long for?",
    "practice": "Reach toward one person this week in a small, concrete act of care — a message, a meal, a shared hour — and let yourself receive their care in return.",
    "blessing": "May you be held by what you have helped to build."
   },
   {
    "open": "The Order raises a place for you to stand and be seen — and to answer for what you make.",
    "verses": [
     "The Order raises a place for you to stand and be seen.",
     "The architecture of authority is authorship: the body of work, the stated value, the role you are willing to own in daylight.",
     "Confidence built on performance is a stage; confidence built on substance is a foundation. Know which you are standing on.",
     "Authorship means your name is on the thing — not for the credit, but for the accountability that makes it trustworthy.",
     "Let what you create bear your name without apology, and let your name mean something because of what you create.",
     "The shadow here is the structure of image with no substance behind it — a facade that must be endlessly maintained, and so can never rest.",
     "Build a body of real work, and you will no longer need to perform confidence; the work will speak it for you.",
     "Stand behind your decisions in the open. The room trusts the one who owns their part in it.",
     "An authority that cannot be questioned is not authority; it is only fear in a tall chair."
    ],
    "reflection": "Where are you maintaining an image rather than building substance, and what would it take to let your real work stand in your name?",
    "practice": "Put your name openly on one thing this week — a decision, a creation, a stated value — and stand behind it without softening.",
    "blessing": "May you stand in the open, and answer gladly for what you create."
   },
   {
    "open": "The Order installs in you a quiet machinery for mending.",
    "verses": [
     "The Order installs, in you, a quiet capacity to mend.",
     "The architecture of correction is the system, the standard, the honest feedback you have learned to receive without flinching.",
     "A good system catches the error before it becomes a wound; build the structure that lets you improve without shame.",
     "Standards are not cruelty; they are care, made repeatable.",
     "External order and inner clarity are the same beam seen from two rooms; arrange one and you steady the other.",
     "The shadow here is the standard so high it paralyzes — a perfectionism that has confused the inability to finish with the love of excellence.",
     "Build a practice of receiving feedback without defending; the defended self learns nothing.",
     "Design the system once, and it will correct a thousand times without your anxiety.",
     "Mend the small thing now, within the structure you have made, and the large breakdown need never come."
    ],
    "reflection": "What system or standard, if you built it now, would let you correct gently and early instead of harshly and late?",
    "practice": "Build one small system this week that catches a recurring mistake before it grows — a checklist, a review, a standing question.",
    "blessing": "May your structures let you improve a thing without condemning it."
   },
   {
    "open": "The Order frames, with care, the fragile space between you and another.",
    "verses": [
     "The Order frames the space between you and another.",
     "The architecture of balance is the agreement, the boundary, the reciprocity that keeps a bond from tilting into harm.",
     "A partnership without architecture slowly becomes a place where one person disappears; build the beams that keep both visible.",
     "Boundaries are not walls against love; they are the framing that lets love bear weight.",
     "The clearest agreements make the warmest relationships; ambiguity is where resentment quietly takes up residence.",
     "The shadow here is the structure of appeasement — a peace kept by one person's steady self-erasure.",
     "Build arrangements explicit enough that fairness does not depend on anyone's mood.",
     "Reciprocity is structural: design the give-and-take so that neither has to keep secret count.",
     "Frame the space between you well, and love will have a sturdy room to live in."
    ],
    "reflection": "Which relationship needs a clearer agreement or boundary so that fairness no longer depends on someone disappearing?",
    "practice": "Name one boundary or agreement aloud this week in a relationship where the proportion has quietly tilted.",
    "blessing": "May you build the arrangements that let love stay fair."
   },
   {
    "open": "The Order makes room, even in you, for what must be allowed to end.",
    "verses": [
     "The Order makes room, even in you, for what must end.",
     "The architecture of transformation is the threshold: the ritual, the conversation, the door you finally let close.",
     "You cannot rebuild on ground you refuse to clear; demolition, done with reverence, is also construction.",
     "An ending without a structure becomes mere wreckage; give your endings a threshold and they become passages.",
     "Build the container strong enough to hold a grief while it does its slow and necessary work.",
     "The shadow here is the structure of avoidance — a refusal to build the doorway, so one stays trapped in the room that is already burning.",
     "A ritual is structure for feeling: it gives the heart a shape to move through what it could not otherwise survive.",
     "Have the conversation that closes the door cleanly; an unclosed door lets the cold of the old thing keep blowing in.",
     "Make the threshold, and what felt like collapse becomes a passage you can walk."
    ],
    "reflection": "What ending in your life needs a threshold — a ritual, a conversation, a clean close — rather than being left to drag on unmarked?",
    "practice": "Mark one ending this week with a deliberate ritual, however small, that gives the closing a shape you can walk through.",
    "blessing": "May you build the container strong enough to hold what must change."
   },
   {
    "open": "The Order widens your walls until the horizon shows through them.",
    "verses": [
     "The Order widens the walls until the horizon shows.",
     "The architecture of expansion is the vision, the teaching, the journey that carries you past your own borders.",
     "A meaning kept private narrows; a meaning given structure becomes a road that others can walk.",
     "Build the framework that turns your experience into something teachable, and your private survival becomes a public gift.",
     "Expansion needs scaffolding too; a vision without a structure is only a mood that will pass by evening.",
     "The shadow here is the structure that grows faster than its foundation — a reach so wide it cannot hold its own weight.",
     "Let your framework grow from what you have actually lived; borrowed visions collapse under the first real wind.",
     "Build outward and downward at once: every new horizon needs a deeper root to hold it.",
     "Give your meaning a shape others can enter, and you will find you were never expanding alone."
    ],
    "reflection": "What have you lived that could become a teachable framework, and where is your reach outrunning the foundation that must hold it?",
    "practice": "Sketch one simple framework this week that turns a lesson you have lived into something you could offer another.",
    "blessing": "May your walls widen until the horizon shows, and your roots deepen to hold it."
   },
   {
    "open": "The Order raises the lasting institutions of a life.",
    "verses": [
     "The Order raises the lasting institutions of a life.",
     "The architecture of mastery is the system that runs without you, the plan that survives your moods, the standard you uphold when tired.",
     "What you build well today will hold you up on the day the climbing tires you.",
     "An institution is a structure that keeps serving after the founder's enthusiasm has cooled; build for that day, not only for today.",
     "Build for the version of you who will one day inherit this, and for the others who will live inside what you make.",
     "The shadow here is the rigid structure that has forgotten its purpose — an institution preserved for its own sake, serving no one.",
     "Systematize the things worth repeating, and free your attention for the things only you can do.",
     "A plan that survives your moods is a kindness you give your future self.",
     "What you institutionalize outlives the mood that made it; choose carefully what you make permanent."
    ],
    "reflection": "What in your life deserves to become a durable system — one that keeps serving when your enthusiasm runs low — and what should be left flexible?",
    "practice": "Turn one thing you keep re-deciding into a standing system this week, so it runs without your daily willpower.",
    "blessing": "May you build institutions that serve long after the enthusiasm that made them has rested."
   },
   {
    "open": "And the Order keeps a door in every wall, so the house can change without falling.",
    "verses": [
     "The Order keeps a door in every wall, so the house can change without falling.",
     "The architecture of liberation is the redesign: the rule retired, the system reformed, the inherited belief examined in the light.",
     "Freedom is not the absence of structure; it is structure that still serves the living rather than the dead.",
     "Build what can be rebuilt. Leave the windows able to open, the walls able to move.",
     "A structure that cannot change is already beginning to die; design for revision as you design for strength.",
     "The shadow here is the demolition that calls itself liberation — tearing down the load-bearing wall along with the locked door.",
     "Reform the system; do not abandon it. Keep the beam that holds, and free the rule that binds.",
     "Examine the inherited belief in good light before you keep it or discard it; much of what binds you, you never chose.",
     "Build houses with doors. The living must be able to leave the rooms they have outgrown."
    ],
    "reflection": "Which inherited structure in your life deserves a redesign rather than either blind keeping or blind breaking?",
    "practice": "Redesign one outgrown rule or routine this week — keep what still serves, change what binds — and notice the room it makes.",
    "blessing": "May you build what can be rebuilt, with doors in every wall."
   },
   {
    "open": "And the Order builds, gently, a place to lay all things down.",
    "verses": [
     "The Order builds, gently, a place to lay things down.",
     "The architecture of dissolution is the closure: the completion offered, the forgiveness extended, the rest finally permitted.",
     "Even endings need architecture, or they become merely loss; build the quiet room where a cycle is allowed to finish.",
     "Forgiveness is a structure too — the deliberate dismantling of a wall you have carried so long you mistook it for yourself.",
     "Build the room with no agenda, where being is permitted and producing is not required.",
     "The shadow here is the refusal to build the closing room — staying perpetually busy so that no cycle is ever allowed to end.",
     "Permit the rest. A structure of stillness is not idleness; it is the architecture in which integration happens.",
     "Offer the completion you have been withholding; an unfinished ending quietly consumes the energy a beginning will need.",
     "Make the quiet room, and let the whole tired house finally exhale."
    ],
    "reflection": "What needs a structure of closure or forgiveness in your life — a room where it can finally be laid down and allowed to rest?",
    "practice": "Build one small space of deliberate stillness this week — a walk, an hour, an evening — with nothing to produce and nothing to prove.",
    "blessing": "May you build the quiet room where a cycle is allowed to finish."
   }
  ],
  "pattern": [
   {
    "open": "Set in motion, the impulse to begin reveals itself as a pattern that returns and returns.",
    "verses": [
     "And the pattern it returns to is Beginning.",
     "Watch how often life hands you a first day — a new project, a new face, a new self trying to be born.",
     "The pattern is not that you must finish everything you start, but that you are forever being offered the chance to start.",
     "Each beginning is the same courage, wearing a new face; recognize the old friend beneath the new fear.",
     "See how the threshold returns, and how, each time, you are a little less surprised by your own trembling.",
     "The shadow of this pattern is the serial beginner, addicted to the spark, who has mistaken starting for living.",
     "Notice which beginnings you keep choosing, for they are telling you, in a language older than words, what you are for.",
     "The Order is not punishing you with first days; it is generous with them, knowing how often a life needs to start again.",
     "When the next beginning comes, you will know it. You have done this before, and you are allowed to do it again."
    ],
    "reflection": "What kind of beginning keeps recurring in your life, and what might its return be trying to tell you about what you are for?",
    "practice": "When the pull to start something arrives this week, follow it for one hour rather than postponing it into a plan.",
    "blessing": "May you recognize the old courage in each new beginning."
   },
   {
    "open": "And the steadying work, too, repeats: again and again you are asked to make a thing real.",
    "verses": [
     "The pattern that repeats here is Establishment.",
     "Again and again you are asked to make a thing real — to root it, to fund it, to schedule it, to keep it.",
     "Notice where you keep almost-building, and where you finally stay; the difference between them is your whole foundation.",
     "What you establish twice becomes the floor you walk on; what you abandon twice becomes the doubt you carry.",
     "The pattern returns until you learn that staying is also a creative act, perhaps the bravest one.",
     "The shadow of this pattern is the rut mistaken for a foundation — repetition that has stopped building and started merely circling.",
     "See which routines still root you and which only repeat you; keep the first, and gently retire the second.",
     "The Order asks for faithfulness, not novelty; the same patient act, repeated, is how every solid thing is made.",
     "You are not stuck when you keep returning to the work; you are building the only way anything is ever built."
    ],
    "reflection": "Where do you keep almost-building without staying, and what would it mean to finally establish that thing for good?",
    "practice": "Identify one half-built commitment this week and take the single repeatable step that begins to truly establish it.",
    "blessing": "May you learn that staying, too, is a creative act."
   },
   {
    "open": "The mind's reaching is a pattern: each answer opens three more doors.",
    "verses": [
     "The pattern is Exploration, endlessly recurring.",
     "The question answered opens three more; this is not the failure of learning but its very shape.",
     "See how your curiosity circles back to the same true north, no matter how far afield it wanders.",
     "The pattern returns you, again and again, to the questions that are actually yours; trust the ones you cannot stop asking.",
     "What you keep wanting to understand is a map of who you are becoming; read it.",
     "The shadow of this pattern is the wandering that never lands — a curiosity so restless it gathers everything and integrates nothing.",
     "Notice the difference between exploring and escaping; the first widens you, the second only moves you.",
     "The Order is not scattering you with endless questions; it is drawing you, by curiosity, toward the thing you are meant to know.",
     "You are not lost in your wandering. You are mapping, and the map is of yourself."
    ],
    "reflection": "What question keeps returning to you no matter how far your curiosity roams, and what might its persistence be revealing?",
    "practice": "Follow your most recurring question this week to one new source, and write down where it leads rather than where you expected.",
    "blessing": "May your wandering always circle back to your true north."
   },
   {
    "open": "The heart's tending is a pattern: to make safe, again and again, what fear made small.",
    "verses": [
     "The pattern it returns to is Nurturing — to tend, to come back for, to make small and safe again what fear once made enormous.",
     "Watch how the care you withhold from yourself you lavish freely on others; the pattern is asking, patiently, to be turned around.",
     "Belonging is not found once and kept; it is renewed, like a meal, again and again.",
     "Whom you keep returning to tells you where your roots are; what you keep tending tells you what you love.",
     "The pattern returns until you learn that you, too, are among the things worth nurturing.",
     "The shadow of this pattern is the caretaking that depletes — a giving so constant it becomes a way of never being seen.",
     "Notice where your nurturing has become a hiding place; even love can be used to avoid being loved.",
     "The Order returns you to tenderness so that you might learn, slowly, to receive it as well as give it.",
     "Come back for yourself, too. You are not the only one in your life who deserves your care."
    ],
    "reflection": "Where does the care you give others so freely fail to circle back to you, and what would it mean to turn that nurturing around?",
    "practice": "Offer yourself this week one act of care you would readily give a beloved friend, and receive it without earning it first.",
    "blessing": "May you make safe and small again what fear made enormous — including, at last, your own heart."
   },
   {
    "open": "The longing to be seen is a pattern: at each threshold, the choice returns — perform, or be seen.",
    "verses": [
     "The pattern that repeats is Self-Revelation.",
     "Notice the recurring moment when you must choose: to perform, or to be seen.",
     "The same fear of visibility returns at each new threshold of your becoming, a little quieter each time you choose truth.",
     "What you keep almost-saying is the very thing the pattern is asking you, at last, to say.",
     "Each time you let the real you be public, the pattern loosens its grip; courage, repeated, becomes character.",
     "The shadow of this pattern is the performance that hardens into identity — a mask worn so faithfully the face forgets itself.",
     "Watch where you reach for applause; the pattern is showing you the exact place you do not yet believe you are enough.",
     "The Order returns you to the threshold not to torment you but to free you, one honest appearance at a time.",
     "You have hidden before, and survived it. Try, this time, being seen, and survive that instead."
    ],
    "reflection": "Where does the choice between performing and being seen keep recurring for you, and what truth keeps almost arriving?",
    "practice": "Let the real you be visible in one small public way this week — an honest word, an unedited creation — and notice the relief beneath the fear.",
    "blessing": "May each honest appearance loosen the old grip of hiding."
   },
   {
    "open": "The work of refining is a pattern: the same flaw returns until it is met with craft.",
    "verses": [
     "The pattern here is Improvement.",
     "The same flaw returns until it is met — not with shame, but with craft.",
     "See how the lesson you avoid keeps arriving in new clothing, patient as the tide.",
     "What you refine once, you will be asked to refine again, more gently, until refining becomes a way of loving.",
     "The pattern returns not to accuse you but to teach you; mastery is mostly the same correction, welcomed enough times.",
     "The shadow of this pattern is the perfectionism that never lands — an improving so endless it becomes its own kind of avoidance.",
     "Notice the one flaw that keeps returning; it is not your enemy but your curriculum.",
     "The Order returns the lesson in kindness, dressed differently each time, hoping this will be the time you receive it.",
     "Meet the recurring flaw with craft, and watch it slowly become a skill."
    ],
    "reflection": "What recurring flaw keeps arriving in new clothing, and what would it mean to meet it with craft instead of shame?",
    "practice": "Take the lesson that keeps returning and address it once, concretely, this week — improving one detail rather than condemning the whole.",
    "blessing": "May you meet the returning flaw as a curriculum, and refine it into a gift."
   },
   {
    "open": "Relationship is a pattern: the see-saw tips, and rights itself, and tips again.",
    "verses": [
     "The pattern that repeats is Balancing.",
     "Watch the see-saw of giving and taking tip, and right itself, and tip again; this is the breathing of every bond.",
     "The same dynamic returns until the proportion is made just, and then it returns once more, to be kept just.",
     "What keeps tilting in your relationships is showing you exactly where the fairness has not yet been built.",
     "Balance is not a state you reach but a motion you tend; the scale is alive, and asks for attention, not perfection.",
     "The shadow of this pattern is the chronic imbalance defended as devotion — the same self-erasure, dressed each time as love.",
     "Notice which way the see-saw always tips for you; the pattern is naming a wound, gently, so you can tend it.",
     "The Order returns you to the scale so that you might learn the true weight of giving and the true grace of receiving.",
     "You are not failing at peace each time it tips. You are learning, by repetition, its real and living weight."
    ],
    "reflection": "Which way does the see-saw of giving and receiving habitually tip for you, and what wound might that recurring tilt be naming?",
    "practice": "In one relationship this week, deliberately correct the habitual tilt — give where you usually take, or receive where you usually give.",
    "blessing": "May you learn, by its returning, the true and living weight of balance."
   },
   {
    "open": "Death and rebirth is the oldest pattern: what you cling to is taken, what you release is transformed.",
    "verses": [
     "The pattern it returns to is Death and Rebirth.",
     "What you cling to is taken; what you release is transformed; this is the oldest pattern there is.",
     "See how each ending you survived made room for a self you could not have planned, and could not now give back.",
     "The pattern returns because life is not a line but a spiral; the same death, deeper each time, opens the same new room, wider.",
     "What is dying in you now has died in you before, in another form; you have always, somehow, been reborn.",
     "The shadow of this pattern is the resurrection refused — clinging to the corpse of what is over until it poisons the living.",
     "Notice what you are gripping; the pattern is asking, as gently as it can, for your open hand.",
     "The Order is not cruel in its endings; it is faithful — it has never once let a death be the last word.",
     "The pattern is not punishment. It is renewal, wearing again the familiar mask of loss."
    ],
    "reflection": "What is asking to die in you again, in a new form, and have you noticed how every past ending eventually made you?",
    "practice": "Release one thing you are gripping this week — name it, loosen your hold, and let the discomfort of the open hand be felt.",
    "blessing": "May you trust the oldest pattern: that nothing real is ever only lost."
   },
   {
    "open": "The search for meaning is a pattern: again you reach past the known edge, asking what it is all for.",
    "verses": [
     "The pattern that repeats is the Exploration of meaning.",
     "Again you reach past the known edge, asking what it is all for; this restlessness is holy, not a flaw.",
     "Notice how your hardest seasons keep becoming your truest teachings, as if suffering were the Order's slow tuition.",
     "The pattern carries your private experience outward, toward the whole; what you learn alone you are meant, eventually, to share.",
     "What you keep wanting to understand about the meaning of things is itself a meaning, pointing at your purpose.",
     "The shadow of this pattern is the seeking that never arrives — a hunger for meaning that consumes every meaning it is offered.",
     "Watch where your reach outruns your roots; meaning that floats free of a lived life becomes only beautiful noise.",
     "The Order returns you to the larger question so that your small life might keep discovering it is not small at all.",
     "You are not greedy for reaching past the edge. You are doing exactly what a soul is for."
    ],
    "reflection": "What larger question about meaning keeps drawing you past your known edges, and how have your hardest seasons been quietly teaching it?",
    "practice": "Name the three biggest lessons of your last year this week, find the single pattern beneath them, and offer one of them to someone who needs it.",
    "blessing": "May your reaching always return you, enlarged, to the life it came from."
   },
   {
    "open": "Building to last is a pattern: the impulse returns to take what works and make it endure.",
    "verses": [
     "The pattern here is Institution Building.",
     "The same impulse returns: to take what works and make it last, to turn effort into structure, to outlive the mood.",
     "Watch where you build to serve, and where you build merely to control; the pattern reveals which is which.",
     "What you institutionalize outlives the mood that made it; the pattern asks you to choose, with care, what you make permanent.",
     "The same drive to build returns at each new level of your life, asking for a worthier thing to build.",
     "The shadow of this pattern is the empire built for its own sake — structure piled on structure, serving nothing but its own continuance.",
     "Notice what you keep trying to make permanent; the pattern is asking whether it is truly worthy of permanence.",
     "The Order returns the builder's impulse to you so that, across a life, you might raise things that genuinely serve.",
     "You are not merely ambitious in your building. You are trying, again, to make your care endure beyond yourself."
    ],
    "reflection": "What do you keep trying to make permanent, and is it worthy of the endurance you are giving it — does it serve, or merely control?",
    "practice": "Examine one thing you are building this week and ask honestly whom it serves; adjust one element toward service over control.",
    "blessing": "May you build, again and again, only what is worthy of enduring."
   },
   {
    "open": "Reformation is a pattern: again the once-freeing rule hardens into a cage.",
    "verses": [
     "The pattern it returns to is Reformation.",
     "Again the once-liberating rule hardens into a cage, and again you are asked to reform it.",
     "See how the very structures that freed you can become, in time, the next thing you must outgrow.",
     "The pattern is not betrayal of what you built; it is loyalty to what it was for.",
     "What once set you free and now confines you is not your failure; it is simply a structure that has finished its season.",
     "The shadow of this pattern is the perpetual revolutionary — breaking each new structure before it can ever serve, addicted to the rupture.",
     "Notice which of your liberations has quietly become a new orthodoxy; the pattern returns to free you from your own freedoms.",
     "The Order returns the reformer's task to you because the living must keep being freed, even from yesterday's liberation.",
     "You are not disloyal when you reform what you built. You are keeping faith with the life it was meant to serve."
    ],
    "reflection": "Which of your past liberations has quietly hardened into a new cage, and how might you reform it while keeping faith with its purpose?",
    "practice": "Identify one rule you once chose freely that now merely binds you, and reform it this week toward what it was originally for.",
    "blessing": "May you keep faith with the purpose, even as you reform the structure."
   },
   {
    "open": "Surrender is the pattern that completes them all: the grip loosens, the cycle returns to the field.",
    "verses": [
     "The pattern that repeats is Surrender.",
     "The grip loosens, the cycle closes, the held thing returns to the field from which it came.",
     "Watch how every completion you trusted made room for an unplanned beginning; the letting-go was never the end of the story.",
     "The pattern is not giving up; it is giving back, which is a harder and a holier thing.",
     "What you surrender well returns to you transformed; what you refuse to surrender, you are condemned to carry.",
     "The shadow of this pattern is the surrender that is really collapse — a giving-up dressed as letting-go, an escape disguised as peace.",
     "Notice the difference between releasing and abandoning; the first completes a cycle, the second merely flees it.",
     "The Order returns you to surrender so that you might learn, across a lifetime, the grace of the open and ungrasping hand.",
     "You are not weak when you surrender what is complete. You are practicing the last and finest art there is."
    ],
    "reflection": "What is asking to be surrendered — truly given back, not merely abandoned — and what unplanned beginning might its release make room for?",
    "practice": "Practice one deliberate, complete surrender this week: release something finished with gratitude rather than letting it merely drift away.",
    "blessing": "May you learn the grace of the open hand, that gives back what is complete."
   }
  ],
  "rhythm": [
   {
    "open": "Every pattern moves in time, and the rhythm of beginning is Birth.",
    "verses": [
     "In time, this moves as Birth.",
     "There is a season for starting, and you are right to feel the quickening of it in you.",
     "Do not measure a newborn thing by what it will one day become; let it first simply be new.",
     "The rhythm of birth asks only this: begin, and breathe.",
     "A beginning has its own tempo — urgent and tender at once; honor both the urgency and the tenderness.",
     "The shadow of this rhythm is forcing the newborn to run before it can stand — demanding maturity from what has only just arrived.",
     "Read the season honestly: if it is a beginning, your task is not yet to perfect but simply to start.",
     "When the quickening comes, it will not wait politely for your readiness; move with it while it is moving.",
     "This is a birth-season. Treat what is emerging with the gentleness you would give anything newly alive."
    ],
    "reflection": "What in your life is in its birth-season right now, and are you letting it be new, or already demanding it be finished?",
    "practice": "Treat one newly-begun thing this week with a beginner's gentleness — protect it from premature judgment, and simply let it grow.",
    "blessing": "May you move with the quickening, and let what is new simply be new."
   },
   {
    "open": "The rhythm of foundation is Rooting — slow, hidden, and never idle.",
    "verses": [
     "This moves slowly, in the rhythm of Rooting.",
     "Some seasons are meant to look like nothing is happening. They are the rooting times.",
     "Do not mistake patience for delay. The tree is busy beneath the soil, doing the work that storms will later test.",
     "Honor the slow rhythm. What roots deep stands long; what rises fast falls first.",
     "A rooting-season rewards consistency, not intensity; show up small and often, and let the depth accumulate.",
     "The shadow of this rhythm is the impatience that keeps pulling up the seedling to check whether it is growing.",
     "Read the season: if it is a time for rooting, the pressure you feel to show results is a temptation, not a truth.",
     "Trust what is happening underground. The most important growth of your life is often the least visible.",
     "This is a rooting-season. Be faithful in the dark, and let the depth do its quiet work."
    ],
    "reflection": "Where are you mistaking a necessary rooting-season for failure, and what depth is forming beneath the surface you cannot yet see?",
    "practice": "Commit to one small, repeatable action this week and do it daily without checking for results — trusting the underground work.",
    "blessing": "May you be faithful in the dark, where the deepest roots are made."
   },
   {
    "open": "The rhythm of intelligence is Discovery, when not-knowing is itself the work.",
    "verses": [
     "The rhythm here is Discovery.",
     "There are seasons that open like questions, when not-knowing is the work itself.",
     "Let yourself stay curious longer than is comfortable; the answer ripens on its own time, not on your impatience.",
     "This is a time to gather, not yet to conclude; premature certainty is the enemy of real discovery.",
     "A discovery-season asks you to hold the question open, to resist the relief of a quick and false answer.",
     "The shadow of this rhythm is the rush to conclude — grasping at any certainty to escape the discomfort of the open mind.",
     "Read the season: if it is a time for learning, then not-yet-knowing is not your failure but your assignment.",
     "Stay in the question. The richest answers are given only to those willing to wait inside the not-knowing.",
     "This is a discovery-season. Gather widely, conclude slowly, and let understanding ripen."
    ],
    "reflection": "What question are you rushing to close that this season is actually asking you to hold open a little longer?",
    "practice": "Resist concluding one open question this week; instead, gather three new perspectives on it before allowing yourself any answer.",
    "blessing": "May you stay in the question long enough for real understanding to ripen."
   },
   {
    "open": "The rhythm of belonging is Bonding — the patient time by which strangers become your people.",
    "verses": [
     "This moves slowly, in the rhythm of Bonding — the patient time by which strangers become your people.",
     "Closeness keeps its own calendar; it cannot be hurried into being, no matter how lonely the waiting.",
     "Some seasons ask you only to stay, and to let yourself be known a little more each time.",
     "Trust the rhythm of bonding. It is building, slowly, something you cannot yet see and will one day lean upon.",
     "A bonding-season rewards presence over performance; you deepen a bond not by impressing but by remaining.",
     "The shadow of this rhythm is forcing intimacy — demanding depth on a timeline, and mistaking exposure for closeness.",
     "Read the season: if it is a time for bonding, the slowness you feel is not rejection but the natural pace of trust.",
     "Let yourself be known gradually. What is built at the speed of safety is what lasts.",
     "This is a bonding-season. Stay, return, and let belonging accumulate at the speed of trust."
    ],
    "reflection": "Which relationship is in a bonding-season that you are tempted to rush, and what would it mean to let it deepen at the speed of trust?",
    "practice": "Show up for one relationship this week through simple presence — staying, returning, being known — without trying to accelerate the closeness.",
    "blessing": "May you let belonging build at the patient speed of trust."
   },
   {
    "open": "The rhythm of authority is Radiance, when hiding is the only mistake.",
    "verses": [
     "The rhythm here is Radiance.",
     "There are seasons to step forward and let your light be counted.",
     "Even the sun has its hour; do not apologize for the season that asks you to shine.",
     "When the rhythm of radiance comes, hiding is the only mistake.",
     "A radiance-season is not arrogance; it is the simple obedience of a thing doing what it is, in the hour it is meant to do it.",
     "The shadow of this rhythm is the false modesty that dims the light the moment is calling for — a hiding mistaken for humility.",
     "Read the season: if it is your hour to be visible, then shrinking is not virtue but a kind of refusal.",
     "Let your light be counted while the season lasts; radiance, unlike rooting, does not keep.",
     "This is a radiance-season. Step forward, and let yourself be seen doing the thing you are for."
    ],
    "reflection": "Where is this a season for you to step forward and shine, and what false modesty is tempting you to dim a light the moment is calling for?",
    "practice": "Take one visible step this week into a role or expression you have been shrinking from, and let yourself be fully counted.",
    "blessing": "May you shine without apology in the hour that asks for your light."
   },
   {
    "open": "The rhythm of refinement is Correction — a season of attention, not anxiety.",
    "verses": [
     "This moves in the rhythm of Correction.",
     "There are seasons for tending and adjusting, when small repairs matter more than grand gestures.",
     "Be gentle in the correcting season; it is care, not punishment, that mends a thing.",
     "The rhythm of correction asks for attention, not anxiety; the difference between them is everything.",
     "A correction-season is not the time for new visions; it is the time for honest maintenance of the ones you have.",
     "The shadow of this rhythm is the anxious overcorrection that, in fixing everything, breaks the very thing it loves.",
     "Read the season: if it is a time for refining, then the small adjustment, not the dramatic overhaul, is your right task.",
     "Tend the details with a steady hand. In a correction-season, attention itself is the cure.",
     "This is a correction-season. Mend gently, adjust patiently, and let care — not fear — guide your hand."
    ],
    "reflection": "What in your life is asking for gentle attention rather than dramatic overhaul, and where is anxiety tempting you to overcorrect?",
    "practice": "Choose one thing this week to improve with steady, unhurried attention — a single detail mended in care, not in fear.",
    "blessing": "May you mend with attention rather than anxiety."
   },
   {
    "open": "The rhythm of relationship is Reciprocity — the turning of give and receive.",
    "verses": [
     "The rhythm here is Reciprocity.",
     "There are seasons of giving and seasons of receiving, and wisdom is knowing which one you are in.",
     "Let yourself be carried sometimes; the rhythm of relationship cannot flow forever in one direction.",
     "Tend the back-and-forth, and it will tend you.",
     "A reciprocity-season asks you to read the flow honestly: is it your turn to pour out, or your turn to be filled?",
     "The shadow of this rhythm is the refusal to receive — a giving so constant it quietly starves the bond it means to feed.",
     "Read the season: if it is your turn to receive, then accepting help is not weakness but the completion of the rhythm.",
     "Let the current reverse when it must. A relationship breathes only when both giving and receiving are allowed.",
     "This is a reciprocity-season. Read which way the current is meant to flow, and let it flow both ways in time."
    ],
    "reflection": "Are you in a season of giving or of receiving right now, and which one are you resisting that the rhythm is asking you to allow?",
    "practice": "Let yourself receive one thing this week without immediately repaying it — a help, a kindness, a rest — and let the rhythm complete itself.",
    "blessing": "May you let the current of giving and receiving flow both ways in its season."
   },
   {
    "open": "The rhythm of transformation is Metamorphosis — the dark season that is doing the deepest work.",
    "verses": [
     "This moves in the rhythm of Metamorphosis.",
     "There are seasons that dismantle you, and they are not the end of you.",
     "The cocoon is not a tomb; the dark of metamorphosis is doing the deepest and most invisible work.",
     "Be patient in the changing season. You are between two shapes, and that is allowed; that is, in fact, the whole point.",
     "A metamorphosis-season cannot be hurried or skipped; the only way through the dissolving is through it.",
     "The shadow of this rhythm is the panic that tears open the cocoon too soon, ending the change before it can complete.",
     "Read the season: if you are between shapes, your formlessness is not failure but the very process of becoming.",
     "Trust the dark. What feels like falling apart is, from the inside, exactly how a new thing is assembled.",
     "This is a metamorphosis-season. Stay in the cocoon. The dissolving is the making."
    ],
    "reflection": "What dismantling are you in the midst of, and can you trust that the formlessness you feel is the change itself, not its failure?",
    "practice": "When the urge to rush the change arises this week, pause and stay with the in-between for ten quiet minutes instead of forcing resolution.",
    "blessing": "May you trust the dark of the cocoon, where the new shape is made."
   },
   {
    "open": "The rhythm of expansion is Adventure — the season that rewards the willing foot.",
    "verses": [
     "The rhythm here is Adventure.",
     "There are seasons to go further than you have gone, to follow the meaning out past the edge of the map.",
     "Do not stay small in a season built for reaching.",
     "The rhythm of adventure rewards the willing foot; the door opens for those already walking toward it.",
     "An adventure-season asks for movement and faith more than for certainty; you find the road by taking it.",
     "The shadow of this rhythm is the recklessness that confuses motion with meaning — wandering for its own sake, rooted in nothing.",
     "Read the season: if it is a time to expand, then your caution may be the very thing standing between you and the horizon.",
     "Go while the season of going lasts. There are doors that open only to those who are already in motion.",
     "This is an adventure-season. Take the step past the known, and trust the road to appear beneath it."
    ],
    "reflection": "Where is this a season built for reaching, and what caution is keeping you small when the horizon is asking you to move?",
    "practice": "Take one concrete step this week toward a larger horizon — a journey, a teaching, a stretch beyond your map — before you feel fully ready.",
    "blessing": "May you move boldly in the season built for reaching."
   },
   {
    "open": "The rhythm of mastery is Ascension — the long climb measured in years, not days.",
    "verses": [
     "This moves in the long rhythm of Ascension.",
     "There are seasons of patient climbing, where progress is measured in years, not days.",
     "Do not despise the slow ascent; the view is earned a single step at a time.",
     "The rhythm of mastery is long. Pace yourself for the summit, not for the sprint.",
     "An ascension-season asks for endurance over intensity; the climbers who last are the ones who learn to keep a sustainable pace.",
     "The shadow of this rhythm is the burnout of the sprinter who treated a mountain like a dash, and collapsed before the ridge.",
     "Read the season: if you are climbing a long ascent, then your impatience with the pace is your greatest danger.",
     "Measure your progress in years and you will not be discouraged by a slow week; the mountain does not care about your Tuesdays.",
     "This is an ascension-season. Find the pace you can keep for years, and then keep it."
    ],
    "reflection": "What long ascent are you on that you keep judging by a sprinter's timeline, and what sustainable pace could you actually keep for years?",
    "practice": "Set one milestone this week measured in months, not days, and choose the steady pace you could genuinely sustain toward it.",
    "blessing": "May you find the pace you can keep for years, and keep it to the summit."
   },
   {
    "open": "The rhythm of liberation is Breakthrough — when long-held tension finally gives.",
    "verses": [
     "The rhythm here is Breakthrough.",
     "There are seasons when the held tension finally gives, and everything seems to move at once.",
     "Trust the sudden openings; they have been preparing in secret for a long, invisible time.",
     "The rhythm of breakthrough rewards those who were ready while they waited.",
     "A breakthrough-season looks sudden but never is; the long, hidden pressure is what makes the swift opening possible.",
     "The shadow of this rhythm is the impatience that forces a breakthrough before its time, shattering what only needed to ripen.",
     "Read the season: if the pressure has been building, the opening you long for may be far nearer than it feels.",
     "Stay ready in the waiting. Breakthroughs come to the prepared, and pass by those who gave up the week before.",
     "This is a breakthrough-season. The long tension is about to give; be ready to move when it does."
    ],
    "reflection": "Where has long-held tension been quietly building toward a breakthrough, and are you staying ready, or giving up just before it gives?",
    "practice": "Prepare this week for the opening you sense coming — ready one concrete thing now, so that when the tension gives, you can move.",
    "blessing": "May you stay ready in the waiting, for the breakthrough that comes to the prepared."
   },
   {
    "open": "The rhythm of dissolution is Dissolution itself — rhythm's quietest measure.",
    "verses": [
     "This moves, at last, in the rhythm of Dissolution.",
     "There are seasons to stop, to soften, to let the cycle return to stillness.",
     "Rest is not the absence of rhythm; it is rhythm's quietest measure.",
     "Let the dissolving season be. The next beginning is already stirring underneath the stillness.",
     "A dissolution-season asks for less, not more; its work is the unfamiliar labor of release and rest.",
     "The shadow of this rhythm is the refusal to stop — the frantic busyness that will not let a cycle end, and so forbids the next to start.",
     "Read the season: if it is a time to dissolve, then your productivity is no longer a virtue but an avoidance.",
     "Soften into the ending. The pause you fear is empty is actually the womb of everything that comes next.",
     "This is a dissolution-season. Stop, soften, rest — and trust the stillness to do its hidden, generative work."
    ],
    "reflection": "What in your life is in a dissolution-season that you keep refusing to let rest, filling the silence with busyness it does not want?",
    "practice": "Take one real pause this week — an evening, a day, an hour of genuine rest — and resist the urge to fill it with anything productive.",
    "blessing": "May you soften into the rest that is rhythm's quietest and most generative measure."
   }
  ],
  "events": [
   {
    "open": "And so the whole descent arrives, at last, as a beginning you can actually touch.",
    "verses": [
     "And so it reaches you, at the surface, as a beginning you can touch.",
     "It arrives as a new project, a new face across a table, a vision you cannot shake, a self you are becoming.",
     "When the new thing comes, you will be tempted to wait until you are ready. Begin anyway.",
     "This small first step is the whole Order, arriving as your ordinary Tuesday.",
     "Do not wait for the grand and obvious sign; the beginning usually arrives disguised as something small and easy to dismiss.",
     "The new project you keep almost-starting is the Source, knocking quietly at the most ordinary door of your life.",
     "Honor the threshold when it appears, however humble; most of your life will turn on first steps no one else even noticed.",
     "You do not need the whole road to be lit. You need only enough light for the next step, and you have that now.",
     "Begin. The Order has come all this way — through Structure, Pattern, and Rhythm — to meet you in this single act."
    ],
    "reflection": "What small beginning has been quietly knocking at an ordinary door of your life, and what would it cost you to simply answer it today?",
    "practice": "Take the first visible step on one thing you have been postponing this week — not the whole plan, only the step that makes the next step appear.",
    "blessing": "May you answer the beginning when it knocks, however ordinary its disguise."
   },
   {
    "open": "And so it arrives as the ordinary, holy work of making a life stable.",
    "verses": [
     "And so it reaches you as the ordinary, holy work of building a life.",
     "It arrives as savings slowly gathered, a routine kept, a body tended, a home made stable.",
     "These quiet days are not the wait before your life; they are your life, taking root.",
     "Be proud of what you have steadied. It cost more than anyone sees.",
     "The Order does not always arrive as lightning; far more often it comes as the faithful Tuesday, the kept promise, the made bed.",
     "Do not despise the smallness of the steadying acts; they are the floor on which everything larger will one day stand.",
     "When the urge comes to abandon the foundation for something newer, remember that you are building a life, not chasing a feeling.",
     "The body you tend, the home you keep, the resource you store — these are prayers said with your hands.",
     "Stay. The steadiness you are building in obscurity is the very thing that will hold you when the storms arrive."
    ],
    "reflection": "What ordinary, steadying work in your life deserves more pride and faithfulness than you have been giving it?",
    "practice": "Tend one foundational thing this week with full presence — your body, your home, your resources — honoring it as the holy work it is.",
    "blessing": "May you be proud of what you have steadied, though it cost more than anyone sees."
   },
   {
    "open": "And so it arrives as the wide, bright world of learning.",
    "verses": [
     "And so it reaches you as the wide, bright world of learning.",
     "It arrives as a class, a conversation, a question you finally ask, a skill that changes how you see.",
     "Stay curious out loud. The thing you are embarrassed not to know is your next door.",
     "Every honest question you let yourself ask is the Order, meeting you halfway.",
     "Do not let pride guard the doorway of your learning; the unasked question is the most expensive thing you will ever keep.",
     "The conversation you have been avoiding may be the very classroom you have been needing.",
     "When the chance to learn arrives, choose understanding over the appearance of already knowing; the second costs you the first.",
     "Listen to one person today as if they might hold a piece of your next understanding — because, more often than not, they do.",
     "Ask. The Order has arranged this teacher, this book, this question, precisely for the person you are becoming."
    ],
    "reflection": "What question are you embarrassed to ask, and whose answer might be the very door you have been standing outside of?",
    "practice": "Ask one question out loud this week that your pride usually silences, and listen to the answer without rushing to seem already-knowing.",
    "blessing": "May every honest question you dare to ask meet the Order halfway."
   },
   {
    "open": "And so it arrives as the things that hold a heart: family, community, the door you can finally walk through.",
    "verses": [
     "And so it reaches you: as family, as community, as an old wound quietly healing, as the door you are finally able to walk through.",
     "It arrives as a hand held, a table set, a place where you need not perform to be welcome.",
     "When belonging comes, let yourself receive it. You do not have to earn the chair you are offered.",
     "You were never meant to carry knowing alone — and here, at last, you do not.",
     "Do not flee the very closeness you have prayed for; when the door opens, the old habit will whisper that you are safer outside it.",
     "The community that welcomes you is the Order, arranging at last the held place your earlier seasons were preparing you to enter.",
     "Let the old wound be tended by the new belonging; some healings only happen in the presence of people who stay.",
     "Receive the offered chair. The whole long descent has been, in part, a labor to bring you home.",
     "You are allowed to belong. You are allowed to be cared for. You are allowed, finally, to walk through the door."
    ],
    "reflection": "What belonging is being offered to you that the old habit of self-protection is tempting you to refuse?",
    "practice": "Let yourself receive one offered kindness or welcome this week without earning it first — and, if you can, walk through one door you have been hovering outside of.",
    "blessing": "May you let yourself be held, and walk at last through the open door."
   },
   {
    "open": "And so it arrives as the moment of being seen — the room, the role, the real voice.",
    "verses": [
     "And so it reaches you as the moment of being seen.",
     "It arrives as a chance to lead, to create, to stand visible, to put your real voice into the room.",
     "When the spotlight comes, you will want to perform. Be true instead; it carries further.",
     "What you make and sign in your own name is the Order, shining through you in plain daylight.",
     "Do not waste the moment of visibility on a polished version of someone else; the room is waiting, whether it knows it or not, for you.",
     "The chance to lead or create that has come to you is not a test to pass but a light to let through.",
     "When fear says hide, remember that your hiding helps no one, and your honest visibility may help more than you will ever know.",
     "Offer the real thing. The applause for a performance fades; the trust earned by truth compounds.",
     "Step into the light when it finds you. This moment, too, is the whole Order, arriving as your chance to be seen."
    ],
    "reflection": "Where is a moment of visibility being offered to you, and will you meet it with performance or with your real, accountable voice?",
    "practice": "Put your true voice — not a polished substitute — into one room this week where you would normally perform, and let it carry.",
    "blessing": "May you meet the spotlight with truth, which always carries further."
   },
   {
    "open": "And so it arrives as the small, faithful work of making things better.",
    "verses": [
     "And so it reaches you as the work of making things better.",
     "It arrives as a system to fix, a habit to refine, a body to tend, a skill to sharpen.",
     "When the flaw shows itself, meet it kindly. You are not being judged; you are being invited to craft.",
     "The small thing you improve today is love, expressed as attention.",
     "Do not let the flaw that surfaces become a verdict on your worth; it is only the next stitch in a long and patient making.",
     "The correction that arrives — from a person, a result, a quiet inner knowing — is the Order offering you a finer version of the thing you love.",
     "When perfectionism tempts you to despair, remember that excellence is not a leap but a thousand small, welcomed adjustments.",
     "Improve the one detail in front of you. The faithful refining of small things is how every masterpiece was ever made.",
     "Refine, and be gentle. The Order is not grading you; it is, patiently, helping you make the thing beautiful."
    ],
    "reflection": "What flaw or correction has surfaced that you could meet with craft and kindness instead of shame?",
    "practice": "Improve a single concrete detail this week — in your work, your habits, your craft — treating the refinement as an act of attention and love.",
    "blessing": "May you meet each flaw as an invitation to craft, not a verdict on your worth."
   },
   {
    "open": "And so it arrives in the company of others, asking for fairness.",
    "verses": [
     "And so it reaches you in the company of others.",
     "It arrives as a partnership, a negotiation, a collaboration, a moment that asks for fairness.",
     "When the relationship tilts, you need not abandon truth to keep the peace. Speak, and stay.",
     "The justice you make in one honest conversation is the Order, restoring its proportion through you.",
     "Do not buy a fragile quiet with your own erasure; a peace that requires your disappearance is not peace but slow surrender.",
     "The partnership or negotiation before you is a small chance to practice the harmony the whole Order is always making.",
     "When conflict frightens you into silence, remember that the truth spoken in care is what keeps a relationship honest enough to last.",
     "Restore one proportion today — give where you have withheld, or ask where you have only given — and call it justice.",
     "Speak, and stay. The Order makes its harmony not by avoiding the hard conversation but by surviving it together."
    ],
    "reflection": "Where is a relationship tilting, and what truth could you speak — in care — that would restore its proportion without your disappearing?",
    "practice": "Have one honest conversation this week that restores fairness in a relationship, speaking the truth you have been swallowing to keep the peace.",
    "blessing": "May you speak and stay, and make justice where the proportion has slipped."
   },
   {
    "open": "And so it arrives, sometimes, as loss — and even this the Order is composing.",
    "verses": [
     "And so it reaches you, sometimes, as loss.",
     "It arrives as a crisis, an ending, a deep healing, a reinvention you did not choose.",
     "When the death comes, you are allowed to grieve it fully before you are asked to be reborn.",
     "Even this — especially this — is the Order, clearing the ground for a self you have not yet met.",
     "Do not rush past the grief toward a tidy meaning; the meaning, when it comes, will rise from the grief, not instead of it.",
     "The crisis you did not choose is not proof that the Order has abandoned you; it is the hardest and most faithful of its labors.",
     "When you are tempted to cling to what is already gone, remember that the open hand, though it aches, is the only one that can receive what is coming.",
     "Honor what is ending. To grieve well is itself a form of faith — it says the thing mattered, and that you trusted it.",
     "You have survived endings before, and been remade by them. You will be remade by this one too."
    ],
    "reflection": "What ending or loss are you being asked to grieve fully before you are asked to be reborn, and where are you rushing toward meaning to avoid the grief?",
    "practice": "Give one grief its due this week — name what has ended, let it be mourned without hurry, and resist the urge to immediately make it tidy.",
    "blessing": "May you grieve fully, and trust the Order even as it clears the ground."
   },
   {
    "open": "And so it arrives as the call to go further, and to share what you have found.",
    "verses": [
     "And so it reaches you as the call to go further.",
     "It arrives as a journey, a teaching, a philosophy, a mission larger than your own comfort.",
     "When the meaning asks to be shared, do not keep it small for fear of being seen as much.",
     "What you learned in the dark becomes, here, a lamp for someone else's road.",
     "Do not bury the hard-won wisdom out of false modesty; the insight you withhold is a light someone is presently stumbling without.",
     "The journey or mission calling you is the Order inviting your private meaning to become a public good.",
     "When the horizon frightens you with its size, remember that you are not asked to fill it alone, only to take the next true step toward it.",
     "Offer one lesson today as a gift rather than a sermon, and watch your survival become someone else's map.",
     "Go further. The meaning you earned was never only yours; it has been waiting, all along, to become a lamp."
    ],
    "reflection": "What hard-won lesson is asking to be shared, and what false modesty is keeping its light hidden from someone who needs it?",
    "practice": "Offer one piece of your hard-won wisdom this week to someone who needs it — as a gift, freely, without making it a sermon.",
    "blessing": "May what you learned in the dark become a lamp for another's road."
   },
   {
    "open": "And so it arrives as the long climb — the work the world calls achievement.",
    "verses": [
     "The world will see your work as title, as office, as the long climb finally named.",
     "But you and I know the truth: the achievement is only the visible weight of all you quietly built beneath it.",
     "So do not envy the one handed authority without foundation, and do not be hard on yourself for building slowly.",
     "The legacy you long for is not what you announce, but what keeps growing softly after your enthusiasm has gone to rest.",
     "Do not mistake the visible summit for the climb; the title is only the surface of years of unseen, faithful labor.",
     "The achievement that arrives is the Order, making durable at last the vision you carried so patiently up the mountain.",
     "When ambition tempts you toward control, remember that the masteries that last are the ones that learned, somewhere, to serve.",
     "Build the unglamorous thing today, and let it endure quietly past the applause; that endurance is your real legacy.",
     "You have climbed further than you know. Honor the foundation no one sees — it is the truest part of what you have built."
    ],
    "reflection": "What long climb are you on whose unseen foundation deserves honoring, and where are you measuring yourself against someone handed the summit without it?",
    "practice": "Do the unglamorous task this week that no one will applaud but that quietly builds what endures — and honor the foundation beneath your visible work.",
    "blessing": "May your truest legacy be what keeps growing softly after the applause has gone to rest."
   },
   {
    "open": "And so it arrives as the urge to do it differently — the freedom you can no longer postpone.",
    "verses": [
     "And so it reaches you as the urge to do it differently.",
     "It arrives as a new idea, an innovation, a system redesigned, a freedom you can no longer postpone.",
     "When the breakthrough comes, do not tear down everything; keep what still serves, and free the rest.",
     "The rule you outgrow and lovingly retire is the Order, evolving through your hands.",
     "Do not confuse the thrill of breaking with the wisdom of reforming; true liberation keeps the beam and frees the cage.",
     "The restlessness you feel toward an old system is not mere discontent; it is the Order, asking through you for the next evolution.",
     "When you are tempted to burn it all down, remember that the living must be freed without being destroyed.",
     "Retire one outgrown rule this week with gratitude rather than rage; even what now binds you once kept you safe.",
     "Evolve the thing. The Order has always changed in order to stay alive, and now it is asking to change through you."
    ],
    "reflection": "What outgrown rule or system is asking to be lovingly retired, and how can you free what binds without destroying what still holds?",
    "practice": "Redesign one outgrown system in your life this week — keeping what still serves and releasing the rest, with gratitude rather than rage.",
    "blessing": "May you evolve what no longer serves, keeping the beam and freeing the cage."
   },
   {
    "open": "And so it arrives, gently, as completion — the held breath before the next beginning.",
    "verses": [
     "And so it reaches you, gently, as completion.",
     "It arrives as reflection, as forgiveness, as closure, as a quiet that asks nothing of you.",
     "When the cycle ends, let it. You do not have to start again before you have rested.",
     "This ending is not the opposite of your life. It is the held breath before its next beginning.",
     "Do not flee the stillness by manufacturing the next urgency; the pause you are tempted to fill is the very rest you have earned.",
     "The closure that arrives — the forgiveness offered, the cycle acknowledged complete — is the Order, receiving you home before it sends you out again.",
     "When restlessness insists you must already be doing the next thing, remember that integration is also work, and it is done lying still.",
     "Offer the forgiveness, write the closing line, and let your hands be empty for a while; emptiness, here, is not lack but readiness.",
     "Rest. The next ignition is already forming in the quiet — and it will find you better for having let this cycle truly end."
    ],
    "reflection": "What cycle is asking to be allowed its completion, and what restlessness keeps tempting you to start the next thing before you have rested?",
    "practice": "Let one thing genuinely complete this week — write the closing line, offer the forgiveness, take the rest — without rushing to fill the quiet that follows.",
    "blessing": "May you let this cycle truly end, and trust the next beginning already forming in the stillness."
   }
  ]
 },
 "PSALMS": [
  {
   "open": "There is a trembling in you that will not be talked out of itself — the ache of a thing that wants, at last, to begin.",
   "descent": [
    "Life seeks emergence in you — the longing for form before any form exists.",
    "So it clears you a beginning: an open room, an emptied hour, a single spoken yes.",
    "The same first courage returns, wearing each time a new and frightening face.",
    "It moves now in the tempo of Birth — urgent and tender at once, asking only that you breathe.",
    "Until it reaches your hands as a project, a love, a self, knocking at an ordinary door."
   ],
   "aligned": "When Ignition is true in you, you step before you are certain, and you stay to tend the flame.",
   "distorted": "When it is distorted, you strike a hundred matches for the thrill of the spark and light nothing — or you wait at the river for a depth that never comes.",
   "response": "So let me not wait to be sure. Let me wet my feet in the cold water, and hold the one small fire until it stands on its own.",
   "ascent": "And tracing it upward — event to rhythm, rhythm to pattern, pattern to structure — I come home to the Source that wanted, all along, to begin again as me."
  },
  {
   "open": "Something in you is tired of beginning, and longs only to last — to set down roots the next wind cannot take.",
   "descent": [
    "Life seeks stability in you — the steadiness of a thing that has found its ground.",
    "So it lays the load-bearing walls: a habit, a resource, a body tended in the dark.",
    "The patient making-real returns: not the thrill of the new, but the grace of the kept.",
    "It moves in the slow tempo of Rooting, where nothing seems to happen and everything does.",
    "Until it reaches you as savings gathered, a promise kept, a home made quietly stable."
   ],
   "aligned": "When Foundation is true in you, you stay through the unglamorous season and let the depth accumulate.",
   "distorted": "When it is distorted, you clutch the small safe pot until your own roots strangle, and call the cage a comfort.",
   "response": "So let me tend what no one applauds. Let me break the pot I have outgrown, and bear the long uncertain season while I root again.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to give my life a floor to stand on."
  },
  {
   "open": "There is a hunger in you to understand — not to be told, but to see how all things lean toward one another.",
   "descent": [
    "Life seeks understanding in you — the sight that finds the kinship between strangers.",
    "So it frames a mind wide enough to hold the ideas that disagree.",
    "The open question returns, and every answer it gives you opens three more doors.",
    "It moves in the tempo of Discovery, where not-yet-knowing is the work itself.",
    "Until it reaches you as a question you finally dare to ask, a conversation that rearranges your sight."
   ],
   "aligned": "When Intelligence is true in you, you let the facts speak to one another until they become a single map.",
   "distorted": "When it is distorted, you hoard a thousand bright facts in their separate drawers, and understand none of them.",
   "response": "So let me pull two drawers at once. Let me ask the question my pride would answer for me, and follow it through the open gate.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to be understood through me."
  },
  {
   "open": "Beneath all you have learned, there is a child still asking whether it is safe, here, to be known.",
   "descent": [
    "Life seeks connection in you — that what you know might descend from the head and be felt.",
    "So it builds you a vessel of belonging: a held place to set the heavy guard down.",
    "The tending returns — the coming-back-for, the making-small-and-safe again of what fear enlarged.",
    "It moves in the tempo of Bonding, by which, slowly, strangers become your people.",
    "Until it reaches you as a hand held, a table set, a door you are finally able to walk through."
   ],
   "aligned": "When Inner Root is true in you, you let yourself be held, and let a truth be felt and not only explained.",
   "distorted": "When it is distorted, you raise your understanding as a wall, call the withdrawal self-care, and are admirably alone.",
   "response": "So let me stop explaining what I have understood too well. Let me feel it, and let one person be near while I do.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to be felt — and to teach me I was never meant to carry knowing alone."
  },
  {
   "open": "There is a light in you that you have learned to dim — a true voice you have hidden beneath a borrowed one.",
   "descent": [
    "Life seeks expression in you — your own truth authored into the open, signed in your hand.",
    "So it raises a place for you to stand and be seen, and to answer for what you make.",
    "The choice returns at every threshold: to perform, or to be seen.",
    "It moves in the tempo of Radiance, the hour when hiding is the only mistake.",
    "Until it reaches you as a chance to lead, to create, to put your real voice into the room."
   ],
   "aligned": "When Authority is true in you, you let the plain light spill, and one true listener is changed by it.",
   "distorted": "When it is distorted, you sing in borrowed voices, and the crowd applauds the mask and forgets you by morning.",
   "response": "So let me take the bowl off the lamp. Let me show one true thing without the polish, and stand accountable for it.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to shine in plain daylight as me."
  },
  {
   "open": "There is a thing in you almost-good, almost-whole, asking not to be condemned, but to be made well.",
   "descent": [
    "Life seeks refinement in you — the loving precision of craft, not the fear called perfection.",
    "So it installs in you a quiet capacity to mend, a standard that is care made repeatable.",
    "The lesson returns in new clothing, patient as the tide, until it is met.",
    "It moves in the tempo of Correction: attention, not anxiety; the small repair, not the grand gesture.",
    "Until it reaches you as a flaw surfacing, a feedback offered, a thing you can make better."
   ],
   "aligned": "When Correction is true in you, you mend the crack with gold and let the bowl be used.",
   "distorted": "When it is distorted, you shatter every flawed thing, and your shelves stay proudly empty while others drink from cupped hands.",
   "response": "So let me not break what is merely flawed. Let me improve one detail, receive one honest word, and let the work stay in use.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to love a thing enough to refine it without ending it."
  },
  {
   "open": "You have given until you have vanished, or kept a peace by swallowing every true word.",
   "descent": [
    "Life seeks harmony in you — not sameness, but the just weight given to each thing.",
    "So it frames the space between you and another with fair and stated arrangements.",
    "The see-saw returns, tipping and righting and tipping again: the breathing of every bond.",
    "It moves in the tempo of Reciprocity, the turning of the giving and the receiving.",
    "Until it reaches you as a partnership, a negotiation, a moment that asks you to be fair."
   ],
   "aligned": "When Balance is true in you, you hold two truths at once and do not collapse into either.",
   "distorted": "When it is distorted, you agree with everyone to keep the peace, and give yourself away until no self is left to choose with.",
   "response": "So let me stop agreeing only to be loved. Let me say the true word I have swallowed, and hold both sides of it at once.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to hold the opposites without breaking, through me."
  },
  {
   "open": "Something in you is over, and will not stop dying, because your hands will not yet open.",
   "descent": [
    "Life seeks transformation in you — gathering what can no longer live as fuel for what comes.",
    "So it makes you a threshold: a ritual, a closing door, a container strong enough to hold a grief.",
    "The oldest pattern returns: what you clutch is taken, what you release is transformed.",
    "It moves in the tempo of Metamorphosis, the dark cocoon doing its deepest, most invisible work.",
    "Until it reaches you as a crisis, a loss, a healing, a reinvention you did not choose."
   ],
   "aligned": "When Transformation is true in you, you let the fire go out, and find the hearth at last has room.",
   "distorted": "When it is distorted, you feed the dying fire your last wood and call the grip devotion, and are left with only smoke.",
   "response": "So let me stop feeding what is already over. Let me grieve it fully, open my hands, and keep the kindling for what is to be born.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to clear the ground for a self I have not yet met."
  },
  {
   "open": "You survived something, and it taught you — and the meaning is too large now to keep only for yourself.",
   "descent": [
    "Life seeks expansion in you — the meaning earned in the depths, widened until it shelters others.",
    "So it widens your walls until the horizon shows, and gives your experience a teachable shape.",
    "The reaching returns, past the known edge, asking again what it is all for.",
    "It moves in the tempo of Adventure, rewarding the willing foot and the road taken before it is sure.",
    "Until it reaches you as a journey, a teaching, a mission larger than your comfort."
   ],
   "aligned": "When Expansion is true in you, you teach only what you have lived, and your students live by it.",
   "distorted": "When it is distorted, you preach the mountains you have never climbed, and your beautiful map fails the one who trusts it.",
   "response": "So let me climb before I map. Let me carry what I actually suffered back across the sand, and offer it with the scars still on it.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to turn what I survived into a lamp for another's road."
  },
  {
   "open": "You long to build a thing that lasts — but is it the work you love, or only your name upon it?",
   "descent": [
    "Life seeks mastery in you — not dominion, but the patient raising of what outlasts your enthusiasm.",
    "So it raises the lasting institutions of a life: the system that runs without you, the plan that survives your moods.",
    "The builder's impulse returns, asking each season for a worthier thing to make.",
    "It moves in the long tempo of Ascension, measured in years, never in a single bright day.",
    "Until it reaches you as a calling, a discipline, a legacy that keeps growing softly after you."
   ],
   "aligned": "When Mastery is true in you, you dig the well that serves, and it gives water long after your name is forgotten.",
   "distorted": "When it is distorted, you raise a monument to be admired, and it crumbles the moment your enthusiasm cools.",
   "response": "So let me lay the stone no one will see. Let me build to serve and not to be seen, and let the work outlast my name.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to build through me something that serves beyond me."
  },
  {
   "open": "A rule you once chose now binds you, and something in you is ready, at last, to be free.",
   "descent": [
    "Life seeks evolution in you — the wisdom that knows the hour a once-good rule has finished its work.",
    "So it keeps a door in every wall, that the house may change without falling.",
    "The reformation returns: the cage that was once a key, the freedom that has hardened into orthodoxy.",
    "It moves in the tempo of Breakthrough, the long-held tension finally giving all at once.",
    "Until it reaches you as a new idea, a system redesigned, a freedom you can no longer postpone."
   ],
   "aligned": "When Liberation is true in you, you free the lock and keep the wall that still protects.",
   "distorted": "When it is distorted, you tear down the bell and the boundary along with the broken gate, and call the wreckage freedom.",
   "response": "So let me find which stones still bear weight before I pull them. Let me free what binds, and keep, with thanks, what still serves.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to stay alive by evolving through my hands."
  },
  {
   "open": "You are afraid to let it end, as if the ending were an erasing.",
   "descent": [
    "Life seeks integration in you — a whole cycle gathered into a single, quiet knowing.",
    "So it builds you a place to lay things down: a closure, a forgiveness, a permitted rest.",
    "The surrender returns, the giving-back that is not a giving-up.",
    "It moves in the tempo of Dissolution, rhythm's quietest and most generative measure.",
    "Until it reaches you as reflection, as forgiveness, as a quiet that asks nothing of you at all."
   ],
   "aligned": "When Dissolution is true in you, you let the river reach the sea, and are not lost but widened by it.",
   "distorted": "When it is distorted, you refuse the last mile and pool into a stagnant stillness, and call the clinging faithfulness.",
   "response": "So let me let one river arrive. Let me allow what is complete to truly end, and trust that it returns to me as rain.",
   "ascent": "And tracing it upward, I come home to the Source that wanted, all along, to receive me home before the next beginning."
  }
 ],
 "PARABLES": [
  {
   "title": "The Hundred Matches",
   "color": "#D98C7A",
   "story": "A man had fire in his hands — give him a single match and he could kindle a blaze from almost nothing, and he loved the leap of each new flame. But he loved the leap so well that he never stayed with it: he struck a match, thrilled at the flare, tossed it aside, and reached for the next, and so a hundred sparks flared and died while the lamp he had been given to light stayed dark. Only when night fell and a single match remained did the leaping have to become tending; he cupped the last flame against the wind and held it to the wick, not letting go through all its sputtering until it caught — and the same fire that had flared and died a hundred times stood, at last, and lit the room.",
   "reading": "The pile of spent matches was the event. Beneath it moved the rhythm of Birth; beneath that, the pattern of Beginning; beneath that, the structure of an impulse that loved the spark but would not tend the flame; and beneath all of it, Life seeking emergence — which asks not for a hundred starts but for one begun and kept.",
   "invitation": "This week, stop striking new matches. Take the one beginning you keep restarting, and hold it to the wick until it catches."
  },
  {
   "title": "The Tree She Would Not Repot",
   "color": "#7FB39A",
   "story": "A gardener loved a young tree so well that she could not bear to disturb it, and so she left it in the small pot it had come in, year after year, where it was safe and close and hers. The tree did not die, but it did not grow; its roots circled the inside of the pot until they had bound themselves, and it stood no taller than the day she bought it. One spring she saw the roots strangling at the surface and understood what her tenderness had done. She broke the pot, set the bound roots into open ground, and waited through a long, doubtful season while the tree, shocked and bare, decided whether to live — and then it began, at last, to become the thing the pot had never let it be.",
   "reading": "The choked roots were the event. Beneath them moved the rhythm of Rooting; beneath that, the pattern of Establishment; beneath that, the structure of a comfort guarded so tightly it had become a cage; and beneath all of it, Life seeking stability — which is not the safety of the small pot but the patience to be planted in open ground.",
   "invitation": "This week, find the pot you have outgrown and will not leave. Break it, plant yourself in larger ground, and bear the long uncertain season while you root again."
  },
  {
   "title": "The Collector of Drawers",
   "color": "#7BA0C4",
   "story": "A man had a genius for gathering: he filled a great house with beautiful facts, each one labeled and laid in its own drawer, and he could open any drawer on request and recite what lay inside. Scholars came to test him and left amazed. But he so loved the gathering that the drawers never spoke to one another, and when a child asked him a question that no single drawer could answer, he found that for all his thousands of facts he understood nothing. Stung, he began pulling drawers open at once — and saw the same hidden shape in two of them, then a third, then a fourth, until the thousand separate facts, for the first time, gathered themselves into a single map he could read.",
   "reading": "The silent drawers were the event. Beneath them moved the rhythm of Discovery; beneath that, the pattern of Exploration; beneath that, the structure of a mind that gathered endlessly and connected nothing; and beneath all of it, Life seeking understanding — which is not the hoarding of facts but the sight that joins them.",
   "invitation": "This week, pull two drawers at once. Take two things you know separately and ask what single truth they might share."
  },
  {
   "title": "The Woman Who Understood Her Grief",
   "color": "#9B8FC7",
   "story": "After a loss, a woman learned to understand her sorrow so well that she could explain exactly why it had happened and exactly what it had taught her, and everyone marveled at her composure. But she so loved the safety of understanding that it became a wall: behind her wise explanations she felt nothing at all, and was perfectly, admirably alone. Then a second grief came, and at its edge she reached for her explanations and found them hollow — and the feeling she had held off for years finally broke through, and she wept. She understood her sorrow no less than before; but now she understood it with her whole body, and in the weeping she was, for the first time, not alone.",
   "reading": "The unwept grief was the event. Beneath it moved the rhythm of Bonding; beneath that, the pattern of Nurturing; beneath that, the structure of an understanding raised as a wall against feeling; and beneath all of it, Life seeking connection — which begins the moment a truth is felt and not only explained.",
   "invitation": "This week, stop explaining one thing you have understood too well. Let yourself feel it instead, and let someone be near while you do."
  },
  {
   "title": "The Borrowed Voice",
   "color": "#D98C7A",
   "story": "A singer had a true voice — rough, plain, and entirely her own — and it was a gift. But she feared it too ordinary to be loved, and so she learned to imitate the famous voices the crowd adored; they applauded the imitation warmly and forgot it before they reached home, and she, applauded every night, was never once actually heard. One evening, reaching for a note that belonged to someone else's voice, her own gave out mid-phrase, and the borrowed costume fell away, and she had nothing left to sing with but herself. So she sang plainly — fewer hands clapped, but one person in the back row sat very still, and came again the next night, and the next, having finally heard someone real.",
   "reading": "The borrowed voice was the event. Beneath it moved the rhythm of Radiance; beneath that, the pattern of Self-Revelation; beneath that, the structure of a performance offered in place of the self; and beneath all of it, Life seeking expression — which is heard by one true listener more than by a thousand who applaud a mask.",
   "invitation": "This week, sing in your own plain voice once. Show one true thing without borrowing the polish the crowd already loves."
  },
  {
   "title": "The Potter and the Golden Seam",
   "color": "#7FB39A",
   "story": "A potter had such an eye for excellence that her bowls were treasured across the province — it was a true gift. But she so loved perfection that she came to shatter every bowl bearing the faintest flaw, until her shelves stood proudly empty and the village drank from cupped hands. One day a bowl she had long ago thrown out came back to her on a neighbor's table: a stranger had mended its crack with a seam of gold, and it had been in daily use for years, the gold worn smooth by a thousand grateful hands. She turned it over a long while, and said nothing. The next bowl that came off her wheel with a flaw, she did not break — she reached, instead, for the gold.",
   "reading": "The empty shelf was the event. Beneath it moved the rhythm of Correction; beneath that, the pattern of Improvement; beneath that, the structure of a perfectionism that would rather break a thing than finish it; and beneath all of it, Life seeking refinement — which mends the crack with gold and lets the bowl be used.",
   "invitation": "This week, mend one thing you were about to discard for its flaw. Improve a single detail, and let it stay in use."
  },
  {
   "title": "The Man Who Agreed with Everyone",
   "color": "#7BA0C4",
   "story": "There was a man with a true gift for peace: he could stand between any two quarrelers and make each feel understood, and for a while the whole town loved him for it. But he so loved the calm that he gave away every true word to keep it, telling each side of every quarrel that they were right, and so no quarrel he touched ever actually resolved. When two old friends at last forced him to choose between them, he found he had given so much of himself away that he had no self left to choose with. Shaken, he learned a harder kindness, and for the first time said: you are both right about this, and both wrong about that. The friends bristled — and then, for the first time, the quarrel began to move.",
   "reading": "The unresolved quarrel was the event. Beneath it moved the rhythm of Reciprocity; beneath that, the pattern of Balancing; beneath that, the structure of a peace kept by erasing every true word; and beneath all of it, Life seeking harmony — which is not agreeing with everyone but holding two truths without collapsing into one.",
   "invitation": "This week, stop agreeing just to keep the peace. Say the true word you have been swallowing, and hold both sides of it at once."
  },
  {
   "title": "The Man Who Fed the Fire",
   "color": "#9B8FC7",
   "story": "Through a long cold night a man tended a fire faithfully, and his tending kept everyone warm — it was a good and loving thing. But when morning came and warmed the air, he could not bear to let the fire die, and kept feeding it the last of his wood, calling the grip devotion. By noon the wood was gone, the fire gave only smoke, and he could feel the next night's cold coming. He sat with the failing coals a long while — and then, instead of feeding them, he let them go out. In the cleared and quiet hearth he found he had room at last, and dry kindling he had been too afraid to save, to tend the fire the evening would actually need.",
   "reading": "The dying fire was the event. Beneath it moved the rhythm of Metamorphosis; beneath that, the pattern of Death and Rebirth; beneath that, the structure of a grip that called itself devotion; and beneath all of it, Life seeking transformation — which clears the cold hearth so the evening's true fire can be lit.",
   "invitation": "This week, let one fire go out. Stop feeding what is already over, and keep the kindling for the fire the evening actually needs."
  },
  {
   "title": "The Teacher Who Had Never Climbed",
   "color": "#D98C7A",
   "story": "A man read everything ever written of the high mountains and became their most celebrated teacher — he drew the maps, named the dangers, and sent many students up the slopes inspired by his words, though he had never climbed so much as a foothill himself. He loved the teaching so well that he never tested it on his own feet, and one student, following his beautiful map, came to a crevasse the map did not show, and the teaching failed them both. Humbled, the man finally went up — and fell, and froze, and nearly did not return. He came back with far less to say and far more to give, and from then on, when he taught, his students lived.",
   "reading": "The failed map was the event. Beneath it moved the rhythm of Adventure; beneath that, the pattern of Exploration; beneath that, the structure of a wisdom preached but never lived; and beneath all of it, Life seeking expansion — which turns what you have actually suffered into something that keeps others alive.",
   "invitation": "This week, teach only what you have lived. Climb the mountain before you map it, and offer the lesson with the scars still on it."
  },
  {
   "title": "The Monument and the Well",
   "color": "#7FB39A",
   "story": "In his hungry years a man dug a well for his village, plain and unsigned, and it was a good thing, and the village drank from it gladly. But as he rose he grew hungry to be remembered, and spent the rest of his life raising a great monument with his name carved deep across its face, driving his workers hard and cutting whatever would not show. The monument rose fast on his enthusiasm and his name, and was much admired — but it was built to be looked at, not used, and when his enthusiasm cooled and his name faded from mouths, no one tended it, and it began to crumble. Old now, he walked past its falling stones one dry afternoon and, thirsty, stopped to drink — from the well, still giving cold water to people who had no idea whose hands had dug it.",
   "reading": "The crumbling monument was the event. Beneath it moved the long rhythm of Ascension; beneath that, the pattern of Institution Building; beneath that, the structure of an ambition built to be admired rather than to serve; and beneath all of it, Life seeking mastery — which endures, unnamed, in the well that still gives water.",
   "invitation": "This week, dig a well instead of a monument. Build one unglamorous thing meant to serve, not to be seen, and let it outlast your name."
  },
  {
   "title": "The Gate He Tore Down",
   "color": "#7BA0C4",
   "story": "A young reformer had a real gift for seeing what no longer made sense: he found an old gate standing alone in a field where its wall had long since crumbled, and saw at once how absurd it was that the village still filed through it from habit. But his zeal did not stop at the useless gate; calling all old things chains, he tore down the boundary stones too, and the festival arch, and the night bell that called the lost ones home. When winter came the village had nothing to bar the wolves and no bell to gather the strayed. An old woman walked him back through the wreckage and, saying little, laid her hand first on the stones that had still borne weight and then on the locks that had only bound — and his good eye, chastened, learned at last to tell the difference between what must be freed and what must be kept.",
   "reading": "The wolves at the unguarded edge were the event. Beneath them moved the rhythm of Breakthrough; beneath that, the pattern of Reformation; beneath that, the structure of a rebellion that could not tell a chain from a wall; and beneath all of it, Life seeking evolution — which frees the lock and keeps the wall that still protects.",
   "invitation": "This week, before you tear something down, find which stones still bear weight. Free the rule that binds, and keep the one that still serves."
  },
  {
   "title": "The River That Would Not Arrive",
   "color": "#9B8FC7",
   "story": "For a hundred miles a river had carried farms and forests on its back, and its banks and its name had served it and everything along it well. But as it neared the sea and saw that to arrive meant losing its banks, its name, the very shape it had carried so far, it was seized with fear, and slowed, and pooled, and refused the last mile, telling itself that holding its course was faithfulness. The pool sat still and turned green, and the living water went stagnant. Then the rain kept falling in the high mountains, and the new water behind it pressed and pressed until the river could keep its shape no longer and spilled at last into the sea — where it was not erased but widened beyond anything its banks had ever allowed, and rose again, in time, as rain over the very peaks it had been so afraid to leave.",
   "reading": "The stagnant pool was the event. Beneath it moved the rhythm of Dissolution; beneath that, the pattern of Surrender; beneath that, the structure of a self that mistook ending for erasure; and beneath all of it, Life seeking integration — the river not lost in the sea but widened by it, and risen again as rain.",
   "invitation": "This week, let one river reach the sea. Allow something complete to truly end, and trust that what dissolves will return to you in another form."
  }
 ],
 "PARABLES_INTRO": "Twelve stories, one for each phase. What the Books explain and the Psalms sing, the Parables show. Each ends by tracing itself down the chain — from the event on its surface to the Intelligent Order beneath — and then asks one small thing of you this week. Read the parable of the phase you are living now, and let the story do what argument cannot.",
 "DAILY_WORDS": [
  "What wants to begin in you will not wait for you to feel ready.",
  "What truly supports your growth will not require you to remain small.",
  "Understanding is not how much you have gathered, but how much of it speaks to itself.",
  "What you have understood will not warm you until you let yourself feel it.",
  "One true word reaches further than a thousand borrowed ones.",
  "A thing mended with care feeds more than a perfection never finished.",
  "A peace that requires your silence is not yet peace.",
  "What you will not release will not stop dying in your hands.",
  "Teach only the mountain you have actually climbed.",
  "What you build to be admired will outlast you far less than what you build to serve.",
  "Freedom is knowing which walls still hold the roof, and which are only habit.",
  "What is ending is not erasing you; it is widening you."
 ],
 "SACRED_QUESTIONS": [
  "What are you waiting to be certain of before you begin?",
  "Where has protection become confinement?",
  "What two things you know separately are asking to be joined?",
  "Where has your understanding become a wall against feeling?",
  "Where are you performing what you could simply be?",
  "What are you about to discard for a flaw you could instead refine?",
  "Where are you keeping the peace by erasing your own true word?",
  "What are you still feeding that is already over?",
  "What have you survived that is now ready to become a lamp for someone else?",
  "Are you raising a monument, or digging a well?",
  "Which of your rules still serves you, and which do you merely obey?",
  "What complete thing are you refusing to let reach the sea?"
 ],
 "CREED": [
  "We believe reality is intelligible.",
  "We believe events are not isolated.",
  "We believe patterns reveal deeper structures.",
  "We believe rhythms guide development.",
  "We believe wisdom comes through attunement.",
  "We commit to observation before reaction,",
  "learning before blame,",
  "alignment before force,",
  "and participation before prediction.",
  "We seek to live in harmony with Intelligent Order."
 ],
 "CHAIN": [
  "Every event is an expression of a rhythm.",
  "Every rhythm is the movement of a pattern.",
  "Every pattern emerges from a structure.",
  "Every structure serves an Intelligent Order."
 ],
 "INVOCATION": [
  "In the beginning was not the event, but the Order beneath it.",
  "Before the world that happens, there is the world that holds; and beneath all that holds, a coherence that makes the holding legible.",
  "Reality is intelligible — this is the first faith, and the last.",
  "What you live at the surface as Events rises from Rhythm; and Rhythm is the movement of Pattern; and Pattern emerges from Structure; and Structure, in the end, serves an Intelligent Order that has loved you the whole way down.",
  "This book is written so that you might read your life at all five depths — and, reading, find yourself accompanied.",
  "Descend, then, from the Source to the lived day. Or begin where you stand, at some small event, and trace it gently home."
 ],
 "BOOK_MEDITATIONS": {
  "io": "Of all five depths, this is the one you cannot point to. You can show me an event; you can trace a rhythm, name a pattern, diagram a structure. But Intelligent Order is the coherence that makes all of them legible at once — the reason reality holds together rather than flying apart. It is not a god you must believe in, nor a force you must prove; it is the quiet assumption beneath every act of understanding: that things mean something, that they are going somewhere, that beneath the noise there is order, and that the order is kind. In this Book you will hear, twelve times, the sentence that is its heartbeat — Life seeks. Read them slowly. They are the Source, speaking in the only grammar it has: the grammar of longing.",
  "structure": "If Intelligent Order is the why, Structure is the how it holds. Nothing in your life stands on nothing. Beneath every recurring joy and every recurring grief there is an architecture — a belief, an incentive, a relationship, a habit, an assumption you have never named — quietly producing it. This is the most practical of the depths, and the most hopeful: because what was built can be rebuilt. In this Book the Order takes up its tools. For each phase of your becoming it raises a different vessel, and asks of you the builder's humble courage — to tend the beams no one applauds, and to trust that what is well-framed will one day hold your weight.",
  "pattern": "Structure, set in motion, repeats — and what repeats is Pattern. This is the Order's signature, the way you recognize its hand at work across the scattered events of a life. The same lesson returns in new clothing; the same gift keeps being offered; the same threshold appears again, a little wider each time. To read Pattern is to stop experiencing your life as a string of unrelated accidents and begin to see the shape it has been making all along. In this Book the Order shows you its repetitions — not to trap you in them, but so that, seeing them, you might at last choose your part in them freely.",
  "rhythm": "A pattern does not repeat all at once; it moves in time, and its movement is Rhythm. There is a season for beginning and a season for rooting, a season to shine and a season to dissolve — and almost all needless suffering comes from doing the right thing in the wrong season. To read Rhythm is to learn the quality of the present moment: what it is asking, what it is forbidding, what it is quietly making possible. In this Book the Order teaches you timing — the difference between patience and delay, between rest and avoidance — so that your action might land in harmony with the hour rather than against it.",
  "events": "Here, at last, is the surface you can touch: the actual Tuesday, the phone call, the diagnosis, the open door. Events are where the whole descent arrives — where Intelligent Order, having moved through Structure and Pattern and Rhythm, finally becomes something you can hold in your two hands. It is tempting to live only here, to mistake the surface for the whole. But it is also here, and only here, that you participate; the deeper layers you read, but the events you live. In this Book the Order speaks most intimately, because it is speaking of your ordinary days — and reminding you that none of them are only ordinary."
 },
 "BENEDICTION": [
  "And now you have read your life at all five depths.",
  "You have seen the Source beneath the structure, the structure beneath the pattern, the pattern beneath the rhythm, and the rhythm beneath the ordinary day.",
  "Go back, then, to your events — to the project and the table, the climb and the closing door — and live them knowing what they rest upon.",
  "When you forget, as you will, return here and read again; the Codex is not a thing to finish but a place to come home to.",
  "May you learn the Order, read the Pattern, and move with the Rhythm.",
  "And may every event of your life, however small, be met as what it truly is: an expression, all the way down, of an Intelligent Order that has loved you the whole way through."
 ],
 "TITLE": "The Codex of Intelligent Order",
 "SUBTITLE": "Psalms, Parables, and Sacred Readings of the Cosmic Reality Framework",
 "ATTRIB": "Attuned Community  ·  Twelvefold Institute"
};

function CodexPage({ profile, setProfile, saveProfile, codex, setCodex, saveCodex, jump, goTo, onConsumeJump, onSaveToJournal }) {
  const { LAYERS, PHASES, PASSAGES, PSALMS, PARABLES, PARABLES_INTRO, DAILY_WORDS, SACRED_QUESTIONS,
          CREED, CHAIN, INVOCATION, BOOK_MEDITATIONS, BENEDICTION, TITLE, SUBTITLE } = CODEX;

  const [tab, setTab] = useState("sanctuary");
  const [li, setLi] = useState(0);
  const [pi, setPi] = useState(profile && typeof profile.currentPhase === "number" ? profile.currentPhase : 0);
  const [mode, setMode] = useState("cell"); // cell | book | psalm
  const [toast, setToast] = useState("");
  useEffect(() => { if (jump && typeof jump.phase === "number") { setPi(jump.phase); if (jump.tab) setTab(jump.tab); if (onConsumeJump) onConsumeJump(); } }, [jump]);

  // persistence with graceful in-memory fallback
  const [localStore, setLocalStore] = useState({ bookmarks: [], notes: {} });
  const store = codex || localStore;
  const writeStore = (next) => { if (setCodex) setCodex(next); else setLocalStore(next);
    if (saveCodex) saveCodex(next); };
  useEffect(() => { if (["matrix","psalms","parables"].includes(tab)) { if (!store.last || store.last.tab !== tab || store.last.phase !== pi) writeStore({ ...store, last: { tab, phase: pi } }); } }, [tab, pi]);

  const layer = LAYERS[li], phase = PHASES[pi];
  const cellKey = (l, p) => l + ":" + p;

  const toggleBookmark = (k) => {
    const has = store.bookmarks.includes(k);
    writeStore({ ...store, bookmarks: has ? store.bookmarks.filter(x => x !== k) : [...store.bookmarks, k] });
  };
  const setNote = (k, val) => writeStore({ ...store, notes: { ...store.notes, [k]: val } });

  const setCurrentPhase = (p) => {
    if (!setProfile) return;
    const next = { ...profile, currentPhase: p };
    setProfile(next); if (saveProfile) saveProfile(next);
  };

  const todayPhase = (() => { const t = new Date(); const s = new Date(t.getFullYear(), 0, 0); const doy = Math.floor((t - s) / 86400000); return ((doy % 12) + 12) % 12; })();
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1900); };
  const listen = (txt) => { try { if (typeof window !== "undefined" && window.speechSynthesis) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.rate = 0.92; window.speechSynthesis.speak(u); flash("Reading aloud\u2026"); } else { flash("Audio isn't available here"); } } catch (e) { flash("Audio isn't available here"); } };
  const enterReading = (phase) => { setPi(phase); setTab("matrix"); };
  const saveInvocation = () => {
    const ph = PHASES[todayPhase];
    const entry = { id: "j-" + Date.now(), title: "Daily Word \u2014 " + ph.name, content: DAILY_WORDS[todayPhase] + "\n\nSacred question: " + SACRED_QUESTIONS[todayPhase], phase: todayPhase, microState: 0, patternName: "", lens: null, date: new Date().toISOString().split("T")[0] };
    if (onSaveToJournal) { onSaveToJournal(entry); flash("Saved to Journal"); }
    else { writeStore({ ...store, saved: [entry, ...(store.saved || [])] }); flash("Saved"); }
  };

  // ── Audio Sanctuary ──
  const AUDIO_TYPES = [
    {id:"psalm",label:"Spoken Psalm",g:"\u2609",desc:"The full psalm read aloud, line by sacred line."},
    {id:"parable",label:"Spoken Parable",g:"\u25EC",desc:"The parable of your phase, with its reading and invitation."},
    {id:"contemplation",label:"Guided Contemplation",g:"\u25CE",desc:"A gentle guided meditation through the sacred question."},
    {id:"meditation",label:"Five-Layer Meditation",g:"\u25C8",desc:"Walk the descent from Source to surface, layer by layer."},
    {id:"morning",label:"Morning Invocation",g:"\u25B3",desc:"Begin the day with today's word and your phase's invitation."},
    {id:"evening",label:"Evening Examen",g:"\u25BD",desc:"Close the day reflecting on gift, shadow, and the sacred question."},
  ];
  const audioContent = (type, ph) => {
    const P = PHASES[ph], ps = PSALMS[ph], par = PARABLES[ph];
    const s = (t, p) => ({ text: t, pause: p || 2200 });
    switch (type) {
      case "psalm": return [s(ps.open, 3500), ...ps.descent.map((l, i) => s(LAYERS[i].title.replace("Of ", "") + ". " + l, 2800)), s("When true. " + ps.aligned, 3500), s("When distorted. " + ps.distorted, 3500), s("The response. " + ps.response, 4500), s(ps.ascent, 3500)];
      case "parable": { const sents = par.story.match(/[^.!?\u2014]+[.!?\u2014]+/g) || [par.story]; return [s("The parable of " + P.name + ". " + par.title + ".", 2800), ...sents.map(x => s(x.trim(), 1800)), s("The reading. " + par.reading, 3800), s("This week. " + par.invitation, 3200)]; }
      case "contemplation": return [s("Find a comfortable position. Close your eyes if it feels right.", 5000), s("Take three slow breaths. Let each one be a little longer than the last.", 7000), s(ps.open, 6000), s("Sit with this for a moment. What does it stir in you?", 9000), s(SACRED_QUESTIONS[ph], 12000), s("There is no rush to answer. Let the question hold you.", 10000), s(ps.response, 6000), s("When you are ready, take one more breath, and return.", 5000)];
      case "meditation": return [s("A five-layer reading meditation through " + P.name + ".", 3500), s("We begin at the source. Intelligent Order.", 3500), s(ps.descent[0], 5000), s("Now, Structure. How the Order builds.", 3500), s(ps.descent[1], 5000), s("Pattern. What repeats.", 3500), s(ps.descent[2], 5000), s("Rhythm. The timing.", 3500), s(ps.descent[3], 5000), s("Events. The lived surface.", 3500), s(ps.descent[4], 5000), s("Trace it upward now. " + ps.ascent, 6000)];
      case "morning": return [s("Good morning. Today's word is " + P.name + ".", 3500), s(DAILY_WORDS[ph], 4500), s(ps.open, 4500), s(ps.response, 4500), s("Carry this with you today.", 3500)];
      case "evening": return [s("The day is closing. Take a moment to settle.", 5000), s("Today you moved within " + P.name + ". Life was seeking " + P.seeks + ".", 4500), s("Where did you see the gift today? " + P.gift, 7000), s("Where did the shadow appear? " + P.shadow, 7000), s(SACRED_QUESTIONS[ph], 10000), s(ps.ascent, 4500), s("Rest now. The next beginning is already forming.", 5000)];
      default: return [];
    }
  };

  const [audioOpen, setAudioOpen] = useState(false);
  const [audioSel, setAudioSel] = useState({ type: "psalm", phase: (profile && typeof profile.currentPhase === "number" ? profile.currentPhase : todayPhase) });
  const [audioState, setAudioState] = useState(null);
  const ambientRef = useRef(null);
  const sleepRef = useRef(null);
  const aLineIdx = audioState ? audioState.lineIdx : -1;
  const aPlaying = audioState ? audioState.playing : false;
  const aSpeed = audioState ? audioState.speed : 0.92;

  useEffect(() => {
    if (!audioState || !aPlaying || typeof window === "undefined" || !window.speechSynthesis) return;
    if (aLineIdx >= audioState.lines.length) { setAudioState(a => a ? { ...a, playing: false } : null); return; }
    const line = audioState.lines[aLineIdx];
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(line.text); utt.rate = aSpeed;
    utt.onend = () => { setTimeout(() => { setAudioState(a => a && a.playing ? { ...a, lineIdx: a.lineIdx + 1 } : a); }, line.pause); };
    window.speechSynthesis.speak(utt);
    return () => { window.speechSynthesis && window.speechSynthesis.cancel(); };
  }, [aLineIdx, aPlaying]);

  const startAmbient = () => { if (ambientRef.current) return; try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const bs = ctx.sampleRate * 2; const buf = ctx.createBuffer(1, bs, ctx.sampleRate); const d = buf.getChannelData(0); let last = 0; for (let i = 0; i < bs; i++) { const w = Math.random() * 2 - 1; d[i] = (last + 0.02 * w) / 1.02; last = d[i]; d[i] *= 3.5; } const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; const g = ctx.createGain(); g.gain.value = 0.12; src.connect(g); g.connect(ctx.destination); src.start(); ambientRef.current = { ctx, src, g }; } catch (e) {} };
  const stopAmbient = () => { if (ambientRef.current) { try { ambientRef.current.src.stop(); ambientRef.current.ctx.close(); } catch (e) {} ambientRef.current = null; } };
  useEffect(() => { if (audioState && audioState.ambience) startAmbient(); else stopAmbient(); return () => stopAmbient(); }, [audioState && audioState.ambience]);
  useEffect(() => { if (sleepRef.current) clearTimeout(sleepRef.current); if (audioState && audioState.sleepMin > 0 && aPlaying) { sleepRef.current = setTimeout(() => { setAudioState(a => a ? { ...a, playing: false } : null); if (window.speechSynthesis) window.speechSynthesis.cancel(); stopAmbient(); }, audioState.sleepMin * 60000); } return () => { if (sleepRef.current) clearTimeout(sleepRef.current); }; }, [audioState && audioState.sleepMin, aPlaying]);

  const beginAudio = () => { const lines = audioContent(audioSel.type, audioSel.phase); setAudioState({ type: audioSel.type, phase: audioSel.phase, lines, lineIdx: 0, playing: true, speed: 0.92, ambience: false, sleepMin: 0 }); };
  const togglePlay = () => { if (!audioState) return; if (audioState.playing) { window.speechSynthesis && window.speechSynthesis.cancel(); } setAudioState(a => a ? { ...a, playing: !a.playing } : null); };
  const repeatLine = () => { window.speechSynthesis && window.speechSynthesis.cancel(); setAudioState(a => a ? { ...a, lineIdx: a.lineIdx, playing: true } : null); };
  const closeAudio = () => { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); stopAmbient(); if (sleepRef.current) clearTimeout(sleepRef.current); setAudioState(null); setAudioOpen(false); };
  const abtn = { border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.fontSans };

  const head = (txt, color, sz) => (
    <div style={{ fontFamily: S.fontMono, fontSize: (sz||10) + "px", color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{txt}</div>
  );

  // ---------- a single chapter (opening, verses, reflection, practice, blessing) ----------
  const Chapter = ({ lIdx, pIdx }) => {
    const L = LAYERS[lIdx], P = PHASES[pIdx], ch = PASSAGES[L.id][pIdx];
    const k = cellKey(L.id, pIdx);
    const bookmarked = store.bookmarks.includes(k);
    return (
      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
          <div style={{ fontFamily: S.fontMono, fontSize: "12px", color: L.color }}>
            {P.icon}{"  "}{L.book}.{pIdx + 1} &nbsp; {P.name}
            <span style={{ color: S.textMuted }}> · Life seeks {P.seeks}</span>
          </div>
          <button onClick={() => toggleBookmark(k)} title="Bookmark this passage"
            style={{ border: "none", background: "none", cursor: "pointer",
                     color: bookmarked ? S.gold : S.textDim, fontSize: "15px", lineHeight: 1 }}>
            {bookmarked ? "\u2605" : "\u2606"}
          </button>
        </div>
        <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "14px", lineHeight: 1.7,
                    color: S.textMuted, margin: "8px 0 14px" }}>{ch.open}</p>
        {ch.verses.map((v, vn) => (
          <p key={vn} style={{ fontFamily: S.fontBody, fontSize: "15px", lineHeight: 1.75, color: S.text,
              margin: "0 0 7px", paddingLeft: "22px", textIndent: "-22px" }}>
            <span style={{ color: L.color, fontFamily: S.fontMono, fontSize: "12px", marginRight: "9px" }}>{vn + 1}</span>{v}
          </p>
        ))}
        <div style={{ marginTop: "14px", padding: "14px 16px", borderRadius: "10px",
                      background: "rgba(236,231,221,0.02)", border: `1px solid ${S.border}` }}>
          <p style={{ fontFamily: S.fontBody, fontSize: "14px", lineHeight: 1.65, color: S.text, margin: "0 0 8px" }}>
            <span style={{ color: L.color, fontFamily: S.fontSans, fontWeight: 600, fontSize: "12px" }}>REFLECTION&nbsp;&nbsp;</span>{ch.reflection}
          </p>
          <p style={{ fontFamily: S.fontBody, fontSize: "14px", lineHeight: 1.65, color: S.text, margin: "0 0 8px" }}>
            <span style={{ color: L.color, fontFamily: S.fontSans, fontWeight: 600, fontSize: "12px" }}>PRACTICE&nbsp;&nbsp;</span>{ch.practice}
          </p>
          <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "14px", lineHeight: 1.6, color: S.textMuted, margin: 0 }}>
            <span style={{ color: L.color, fontFamily: S.fontSans, fontWeight: 600, fontSize: "12px", fontStyle: "normal" }}>BLESSING&nbsp;&nbsp;</span>{ch.blessing}
          </p>
          <textarea value={store.notes[k] || ""} onChange={(e) => setNote(k, e.target.value)}
            placeholder="Your reflection…" rows={2}
            style={{ width: "100%", marginTop: "12px", padding: "9px 12px", borderRadius: "8px",
              border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.03)", color: S.text,
              fontFamily: S.fontBody, fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        </div>
      </div>
    );
  };

  const Psalm = ({ pIdx }) => {
    const ps = PSALMS[pIdx], P = PHASES[pIdx];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: S.fontHead, fontSize: "24px", color: S.text, marginBottom: "4px" }}>
            {P.icon} The Psalm of {P.name}<span style={{ color: S.textDim, fontSize: "15px" }}> ({P.sign})</span>
          </div>
          {setProfile && (
            <button onClick={() => setCurrentPhase(pIdx)}
              style={{ border: `1px solid ${profile && profile.currentPhase === pIdx ? S.gold : S.border}`,
                background: profile && profile.currentPhase === pIdx ? S.goldDim : "transparent",
                color: profile && profile.currentPhase === pIdx ? S.gold : S.textMuted,
                borderRadius: "7px", padding: "5px 11px", cursor: "pointer",
                fontFamily: S.fontMono, fontSize: "10px" }}>
              {profile && profile.currentPhase === pIdx ? "Your current phase" : "Set as my phase"}
            </button>
          )}
        </div>
        {head("Read down the column — source to surface", S.textDim)}
        <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "15px", lineHeight: 1.7, color: S.textMuted, margin: "14px 0 18px" }}>{ps.open}</p>
        <div>
          {ps.descent.map((line, k) => (
            <p key={k} style={{ fontFamily: S.fontBody, fontSize: "15px", lineHeight: 1.7, color: S.text,
                margin: "0 0 11px", paddingLeft: "96px", textIndent: "-96px" }}>
              <span style={{ color: LAYERS[k].color, fontFamily: S.fontMono, fontSize: "10.5px" }}>
                {LAYERS[k].title.replace("Of ", "").toUpperCase()}</span>{"  —  "}{line}
            </p>
          ))}
          <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: `1px solid ${S.border}` }}>
            <p style={{ fontFamily: S.fontBody, fontSize: "14px", lineHeight: 1.65, color: S.text, margin: "0 0 8px" }}>
              <span style={{ color: S.green, fontFamily: S.fontSans, fontWeight: 600, fontSize: "11px" }}>WHEN TRUE&nbsp;&nbsp;</span>{ps.aligned}
            </p>
            <p style={{ fontFamily: S.fontBody, fontSize: "14px", lineHeight: 1.65, color: S.text, margin: "0 0 14px" }}>
              <span style={{ color: S.red, fontFamily: S.fontSans, fontWeight: 600, fontSize: "11px" }}>WHEN DISTORTED&nbsp;&nbsp;</span>{ps.distorted}
            </p>
            <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "15px", lineHeight: 1.7, color: S.text, margin: "0 0 16px", paddingLeft: "14px", borderLeft: `2px solid ${S.gold}` }}>
              <span style={{ color: S.gold, fontStyle: "normal", fontFamily: S.fontSans, fontWeight: 600, fontSize: "11px" }}>THE RESPONSE&nbsp;&nbsp;</span>{ps.response}
            </p>
          </div>
          <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "14px", lineHeight: 1.7,
              color: S.textMuted, marginTop: "6px", borderTop: `1px solid ${S.border}`, paddingTop: "14px" }}>{ps.ascent}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ color: S.text, fontFamily: S.fontBody, minHeight: "100%",
        padding: "30px 26px", borderRadius: "16px",
        background: `radial-gradient(1200px 800px at 78% -8%, rgba(224,182,92,0.07), transparent 55%), radial-gradient(900px 700px at 12% 8%, rgba(155,143,199,0.06), transparent 50%), ${S.bg}` }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');\n@keyframes acBreathe { 0%,100% { transform: translate(-50%,-50%) scale(0.9); opacity:.5 } 50% { transform: translate(-50%,-50%) scale(1.12); opacity:.85 } }@keyframes acBreatheSmall { 0%,100% { transform: scale(.9); opacity:.55 } 50% { transform: scale(1.1); opacity:.95 } }@keyframes acFade { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }@media (prefers-reduced-motion: reduce) { .ac-anim { animation: none !important } }`}</style>
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={{ fontFamily: S.fontHead, fontSize: "32px", fontWeight: 500, color: S.text, lineHeight: 1.1 }}>{TITLE}</div>
        <div style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "13px", color: S.textDim, marginTop: "6px" }}>{SUBTITLE}</div>
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "22px 0 18px", flexWrap: "wrap" }}>
        {[["sanctuary","Sanctuary"],["matrix","The Matrix"],["psalms","The Psalms"],["parables","The Parables"],["front","Front Matter"],["bene","Benediction"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "7px 15px", borderRadius: "20px", cursor: "pointer",
            fontFamily: S.fontMono, fontSize: "11px", border: `1px solid ${tab === id ? S.gold : S.border}`,
            background: tab === id ? S.goldDim : "transparent", color: tab === id ? S.gold : S.textMuted }}>{lbl}</button>
        ))}
      </div>

      {toast && <div style={{ textAlign: "center", marginBottom: "14px" }}><span style={{ fontFamily: S.fontSans, fontSize: "12px", color: S.green, background: `${S.green}14`, border: `1px solid ${S.green}33`, borderRadius: "20px", padding: "5px 14px" }}>{toast}</span></div>}

      {tab === "sanctuary" && (() => {
        const tp = todayPhase, tph = PHASES[tp], tc = PARABLES[tp].color;
        const cp = profile && typeof profile.currentPhase === "number" ? profile.currentPhase : null;
        const last = store.last;
        return (
          <div>
            <p style={{ fontFamily: S.fontBody, fontSize: "13px", color: S.textMuted, textAlign: "center", lineHeight: 1.6, margin: "0 auto 22px", maxWidth: "560px" }}>What does today ask you to encounter? Begin here, then enter the readings as you are moved.</p>

            <div style={{ ...glassCard, padding: "26px 24px", marginBottom: "16px", borderLeft: `3px solid ${tc}` }}>
              <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: tc, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Daily Invocation</div>
              <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: S.textDim, letterSpacing: "1px", marginBottom: "10px" }}>Today's word &middot; <span style={{ color: tc }}>{tph.icon} {tph.name}</span></div>
              <p style={{ fontFamily: S.fontHead, fontSize: "23px", fontWeight: 500, color: S.text, lineHeight: 1.35, margin: "0 0 20px" }}>{DAILY_WORDS[tp]}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => enterReading(tp)} style={{ border: "none", background: tc, color: "#15110b", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontFamily: S.fontSans, fontWeight: 600, fontSize: "12px" }}>Enter the Reading</button>
                <button onClick={saveInvocation} style={{ border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontFamily: S.fontSans, fontSize: "12px" }}>Save to Journal</button>
                <button onClick={() => listen("Today's word. " + tph.name + ". " + DAILY_WORDS[tp])} style={{ border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontFamily: S.fontSans, fontSize: "12px" }}>{"\u25B6"} Listen</button>
              </div>
            </div>

            <div style={{ ...glassCard, padding: "26px 24px", marginBottom: "16px" }}>
              <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.gold, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Your Current Reading</div>
              {cp === null ? (
                <div>
                  <p style={{ fontFamily: S.fontBody, fontSize: "15px", color: S.textMuted, lineHeight: 1.7, margin: "0 0 14px" }}>No active lens has emerged yet. Let the Event Decoder trace something you are living, or choose a phase to contemplate \u2014 and a reading will settle here.</p>
                  {goTo && <button onClick={() => goTo("decoder")} style={{ border: `1px solid ${S.gold}`, background: S.goldDim, color: S.gold, borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontFamily: S.fontSans, fontSize: "12px" }}>Open the Event Decoder {"\u2192"}</button>}
                </div>
              ) : (() => {
                const ph = PHASES[cp], c = PARABLES[cp].color;
                return (
                  <div>
                    <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "15px", color: S.textMuted, lineHeight: 1.6, margin: "0 0 16px" }}>Your recent reflections suggest that {ph.name} may be the active lens.</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "34px", color: c }}>{ph.icon}</span>
                      <div>
                        <div style={{ fontFamily: S.fontHead, fontSize: "22px", color: c }}>{ph.name} <span style={{ color: S.textDim, fontSize: "14px" }}>&middot; {ph.sign}</span></div>
                        <div style={{ fontFamily: S.fontBody, fontSize: "13px", color: S.textMuted }}>Life seeks {ph.seeks}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px", marginBottom: "14px" }}>
                      <div style={{ padding: "12px 14px", borderRadius: "10px", background: `${S.green}0A`, border: `1px solid ${S.green}24` }}><div style={{ fontFamily: S.fontSans, fontSize: "10px", fontWeight: 600, color: S.green, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Gift</div><div style={{ fontFamily: S.fontBody, fontSize: "13.5px", color: S.text, lineHeight: 1.5 }}>{ph.gift}</div></div>
                      <div style={{ padding: "12px 14px", borderRadius: "10px", background: `${S.red}0A`, border: `1px solid ${S.red}24` }}><div style={{ fontFamily: S.fontSans, fontSize: "10px", fontWeight: 600, color: S.red, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Shadow</div><div style={{ fontFamily: S.fontBody, fontSize: "13.5px", color: S.text, lineHeight: 1.5 }}>{ph.shadow}</div></div>
                    </div>
                    <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "14.5px", color: S.textMuted, lineHeight: 1.7, margin: "0 0 8px", paddingLeft: "12px", borderLeft: `2px solid ${S.gold}` }}><span style={{ fontStyle: "normal", fontFamily: S.fontSans, fontWeight: 600, fontSize: "11px", color: S.gold }}>INVITATION&nbsp;&nbsp;</span>{PSALMS[cp].response}</p>
                    <p style={{ fontFamily: S.fontBody, fontSize: "14px", color: S.text, lineHeight: 1.6, margin: "10px 0 16px" }}><span style={{ fontFamily: S.fontSans, fontWeight: 600, fontSize: "11px", color: c }}>CURRENT PRACTICE&nbsp;&nbsp;</span>{PARABLES[cp].invitation}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => { setPi(cp); setTab("psalms"); }} style={{ border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "7px", padding: "6px 13px", cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px" }}>The Psalm of {ph.name}</button>
                      <button onClick={() => { setPi(cp); setTab("parables"); }} style={{ border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "7px", padding: "6px 13px", cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px" }}>Its Parable</button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <button onClick={() => setAudioOpen(true)} style={{ display: "block", width: "100%", marginBottom: "16px", padding: "18px", borderRadius: "12px", border: `1px solid ${S.gold}44`, background: "linear-gradient(135deg, rgba(224,182,92,0.08), rgba(155,143,199,0.05))", cursor: "pointer", fontFamily: S.fontHead, fontSize: "17px", color: S.gold, textAlign: "center" }}>{"\u2609"} Enter the Audio Sanctuary</button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div style={{ ...glassCard, padding: "22px 20px" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.purple, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Continue Reading</div>
                {last ? (
                  <div>
                    <p style={{ fontFamily: S.fontBody, fontSize: "14px", color: S.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>{last.tab === "psalms" ? "You were in the Psalm of " + PHASES[last.phase].name : last.tab === "parables" ? "You were reading \u201c" + PARABLES[last.phase].title + "\u201d" : "You were reading within " + PHASES[last.phase].name}.</p>
                    <button onClick={() => { setPi(last.phase); setTab(last.tab); }} style={{ border: `1px solid ${S.gold}`, background: S.goldDim, color: S.gold, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontFamily: S.fontSans, fontSize: "12px" }}>Resume {"\u2192"}</button>
                  </div>
                ) : (
                  <p style={{ fontFamily: S.fontBody, fontSize: "14px", color: S.textMuted, lineHeight: 1.6, margin: 0 }}>Open a Psalm, Parable, or Reading and your place will be kept here.</p>
                )}
                {goTo && <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${S.border}` }}>
                  <button onClick={() => goTo("journey")} style={{ border: "none", background: "none", color: S.textDim, cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px", padding: 0, textDecoration: "underline" }}>My Journey</button>
                  <button onClick={() => goTo("journal")} style={{ border: "none", background: "none", color: S.textDim, cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px", padding: 0, textDecoration: "underline" }}>Journal</button>
                </div>}
              </div>
              <div style={{ ...glassCard, padding: "22px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: tc, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Sacred Question</div>
                <p style={{ fontFamily: S.fontHead, fontSize: "20px", fontWeight: 500, color: S.text, lineHeight: 1.4, margin: "0 0 16px", flex: 1 }}>{SACRED_QUESTIONS[tp]}</p>
                <button onClick={() => listen(SACRED_QUESTIONS[tp])} style={{ alignSelf: "flex-start", border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "8px", padding: "6px 13px", cursor: "pointer", fontFamily: S.fontSans, fontSize: "11px" }}>{"\u25B6"} Listen</button>
              </div>
            </div>
          </div>
        );
      })()}

      {tab === "matrix" && (
        <div>
          <p style={{ fontFamily: S.fontBody, fontSize: "13px", color: S.textMuted, textAlign: "center", lineHeight: 1.6, margin: "0 0 16px" }}>
            Five Books down, twelve phases across. Tap any cell to read it — then read the whole Book across the phases, or turn the column into its Psalm.
          </p>
          <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
            <div style={{ minWidth: "540px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "92px repeat(12, 1fr)", gap: "5px", alignItems: "center", marginBottom: "5px" }}>
                <div />
                {PHASES.map((p, i) => (
                  <div key={i} title={p.name} style={{ textAlign: "center", fontSize: "15px", color: pi === i ? S.gold : S.textDim }}>{p.icon}</div>
                ))}
              </div>
              {LAYERS.map((L, rowI) => (
                <div key={rowI} style={{ display: "grid", gridTemplateColumns: "92px repeat(12, 1fr)", gap: "5px", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ fontFamily: S.fontMono, fontSize: "9px", color: L.color, textAlign: "right", lineHeight: 1.2 }}>
                    {L.title.replace("Of ", "").toUpperCase()}
                  </div>
                  {PHASES.map((p, colI) => {
                    const on = rowI === li && colI === pi;
                    const marked = store.bookmarks.includes(cellKey(L.id, colI));
                    return (
                      <button key={colI} title={L.title + " — " + p.name}
                        onClick={() => { setLi(rowI); setPi(colI); setMode("cell"); }}
                        style={{ width: "100%", aspectRatio: "1", borderRadius: "7px",
                          border: `1px solid ${on ? L.color : (marked ? S.gold + "66" : S.border)}`,
                          background: on ? L.color + "33" : L.color + "10", cursor: "pointer",
                          color: L.color, fontSize: "10px", fontFamily: S.fontMono,
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {L.book + "." + (colI + 1)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", margin: "20px 0 14px", flexWrap: "wrap" }}>
            {[["cell", phase.name + " · " + layer.title.replace("Of ", "")],
              ["book", "Read all of Book " + layer.book],
              ["psalm", "The Psalm of " + phase.name]].map(([m, lbl]) => (
              <button key={m} onClick={() => setMode(m)} style={{ padding: "6px 13px", borderRadius: "7px", cursor: "pointer",
                fontFamily: S.fontMono, fontSize: "10.5px", border: `1px solid ${mode === m ? S.gold : S.border}`,
                background: mode === m ? S.goldDim : "transparent", color: mode === m ? S.gold : S.textMuted }}>{lbl}</button>
            ))}
          </div>

          <div style={{ ...glassCard, padding: "24px 22px" }}>
            {mode === "psalm" ? <Psalm pIdx={pi} /> : (
              <div>
                <div style={{ fontFamily: S.fontHead, fontSize: "23px", color: layer.color, marginBottom: "2px" }}>
                  Book {layer.book} · {layer.title}
                </div>
                {head(layer.subtitle, S.textDim)}
                {mode === "book" && (
                  <p style={{ fontFamily: S.fontBody, fontSize: "14px", lineHeight: 1.7, color: S.textMuted, margin: "16px 0 4px" }}>
                    {BOOK_MEDITATIONS[layer.id]}
                  </p>
                )}
                <div style={{ marginTop: "20px" }}>
                  {(mode === "book" ? PHASES.map((_, i) => i) : [pi]).map((idx) => (
                    <Chapter key={idx} lIdx={li} pIdx={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "psalms" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px", margin: "0 0 20px" }}>
            {PHASES.map((p, i) => (
              <button key={i} onClick={() => setPi(i)} style={{ padding: "12px 8px", borderRadius: "9px", cursor: "pointer",
                border: `1px solid ${pi === i ? S.gold : S.border}`, background: pi === i ? S.goldDim : "rgba(236,231,221,0.02)",
                color: pi === i ? S.gold : S.textMuted, fontFamily: S.fontBody,
                display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
                <span style={{ fontSize: "18px" }}>{p.icon}</span>
                <span style={{ fontSize: "12.5px" }}>{p.name}</span>
              </button>
            ))}
          </div>
          <div style={{ ...glassCard, padding: "24px 22px" }}><Psalm pIdx={pi} /></div>
        </div>
      )}

      {tab === "parables" && (
        <div>
          <p style={{ fontFamily: S.fontBody, fontSize: "13px", color: S.textMuted, textAlign: "center", lineHeight: 1.6, margin: "0 auto 18px", maxWidth: "640px" }}>{PARABLES_INTRO}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px", margin: "0 0 20px" }}>
            {PHASES.map((p, i) => {
              const on = pi === i; const c = PARABLES[i].color;
              return (
                <button key={i} onClick={() => setPi(i)} style={{ padding: "12px 8px", borderRadius: "9px", cursor: "pointer",
                  border: `1px solid ${on ? c : S.border}`, background: on ? c + "1f" : "rgba(236,231,221,0.02)",
                  color: on ? c : S.textMuted, fontFamily: S.fontBody, display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px" }}>{p.icon}</span>
                  <span style={{ fontSize: "12.5px" }}>{p.name}</span>
                </button>
              );
            })}
          </div>
          {(() => {
            const par = PARABLES[pi], P = PHASES[pi], c = par.color;
            return (
              <div style={{ ...glassCard, padding: "26px 24px", borderLeft: `3px solid ${c}` }}>
                <div style={{ fontFamily: S.fontHead, fontSize: "25px", color: c, lineHeight: 1.15 }}>{par.title}</div>
                <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textDim, letterSpacing: "1.5px", textTransform: "uppercase", margin: "4px 0 16px" }}>{P.icon} {P.name} · {P.sign}</div>
                <p style={{ fontFamily: S.fontBody, fontSize: "16px", lineHeight: 1.8, color: S.text, margin: "0 0 16px" }}>{par.story}</p>
                <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "14px", lineHeight: 1.7, color: S.textMuted, margin: "0 0 12px", paddingLeft: "14px", borderLeft: `1px solid ${S.border}` }}>
                  <span style={{ color: c, fontStyle: "normal", fontWeight: 600, fontFamily: S.fontSans, fontSize: "12px" }}>THE READING&nbsp;&nbsp;</span>{par.reading}
                </p>
                <p style={{ fontFamily: S.fontBody, fontSize: "15px", lineHeight: 1.7, color: S.text, margin: "0 0 16px", paddingLeft: "14px" }}>
                  <span style={{ color: c, fontWeight: 600, fontFamily: S.fontSans, fontSize: "12px" }}>THIS WEEK&nbsp;&nbsp;</span>{par.invitation}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: `1px solid ${S.border}`, paddingTop: "14px" }}>
                  <button onClick={() => setTab("psalms")} style={{ border: `1px solid ${S.border}`, background: "transparent", color: S.textMuted, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px" }}>Read the Psalm of {P.name}</button>
                  {setProfile && (
                    <button onClick={() => setCurrentPhase(pi)} style={{ border: `1px solid ${profile && profile.currentPhase === pi ? S.gold : S.border}`, background: profile && profile.currentPhase === pi ? S.goldDim : "transparent", color: profile && profile.currentPhase === pi ? S.gold : S.textMuted, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontFamily: S.fontMono, fontSize: "10px" }}>{profile && profile.currentPhase === pi ? "Your current phase" : "Set as my phase"}</button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {tab === "front" && (
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          {head("Invocation", S.textDim, 11)}
          <div style={{ height: "12px" }} />
          {INVOCATION.map((l, i) => (
            <p key={i} style={{ fontFamily: S.fontBody, fontSize: "15px", lineHeight: 1.8, color: S.text, margin: "0 0 12px", textAlign: "justify" }}>{l}</p>
          ))}
          <div style={{ height: "28px" }} />{head("The Creed", S.textDim, 11)}<div style={{ height: "14px" }} />
          {CREED.map((l, i) => (
            <p key={i} style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "15px", lineHeight: 1.75, color: S.text, textAlign: "center", margin: "0 0 6px" }}>{l}</p>
          ))}
          <div style={{ height: "28px" }} />{head("The Teaching Chain", S.textDim, 11)}<div style={{ height: "14px" }} />
          {CHAIN.map((l, i) => (
            <p key={i} style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "16px", lineHeight: 1.8, color: i === 3 ? S.gold : S.text, textAlign: "center", margin: "0 0 6px" }}>{l}</p>
          ))}
        </div>
      )}

      {tab === "bene" && (
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          {head("Benediction", S.textDim, 11)}<div style={{ height: "14px" }} />
          {BENEDICTION.map((l, i) => (
            <p key={i} style={{ fontFamily: S.fontBody, fontSize: "15px", lineHeight: 1.85, color: i === BENEDICTION.length - 1 ? S.gold : S.text, margin: "0 0 13px", textAlign: "justify", fontStyle: i === BENEDICTION.length - 1 ? "italic" : "normal" }}>{l}</p>
          ))}
        </div>
      )}

      {audioOpen && (() => {
        const accent = PARABLES[(audioState ? audioState.phase : audioSel.phase)].color;
        return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: audioState ? "center" : "flex-start", padding: audioState ? "24px" : "46px 24px",
          background: `radial-gradient(900px 720px at 50% ${audioState ? "46%" : "28%"}, ${accent}16, transparent 60%), radial-gradient(1100px 900px at 50% 118%, rgba(155,143,199,0.06), transparent 60%), #08070d` }}>
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 46%, transparent 38%, rgba(0,0,0,0.6) 100%)" }} />
          <button onClick={closeAudio} style={{ position: "fixed", top: "18px", right: "22px", background: "none", border: "none", color: S.textDim, fontSize: "24px", cursor: "pointer", zIndex: 10001 }}>&times;</button>

          {!audioState ? (
            <div style={{ position: "relative", zIndex: 2, maxWidth: "620px", width: "100%", textAlign: "center" }}>
              <div className="ac-anim" style={{ width: "60px", height: "60px", margin: "6px auto 20px", borderRadius: "50%", background: `radial-gradient(circle, ${accent}, ${accent}33 55%, transparent 72%)`, animation: "acBreatheSmall 8s ease-in-out infinite" }} />
              <div style={{ fontFamily: S.fontMono, fontSize: "11px", color: accent, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "14px" }}>Audio Sanctuary</div>
              <p style={{ fontFamily: S.fontBody, fontStyle: "italic", fontSize: "16px", color: S.textMuted, lineHeight: 1.6, margin: "0 0 34px" }}>Choose a reading and a phase, then cross into the listening space.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px", marginBottom: "34px" }}>{AUDIO_TYPES.map(at => {
                const on = audioSel.type === at.id;
                return (<button key={at.id} onClick={() => setAudioSel(s => ({ ...s, type: at.id }))} style={{ padding: "22px 16px", borderRadius: "14px", border: `1px solid ${on ? accent : S.border}`, background: on ? `${accent}12` : "rgba(236,231,221,0.02)", cursor: "pointer", textAlign: "center", transition: "all 0.25s", boxShadow: on ? `0 0 34px ${accent}22` : "none" }}>
                  <div style={{ width: "42px", height: "42px", margin: "0 auto 12px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${on ? accent : S.border}`, color: on ? accent : S.textMuted, fontSize: "17px", background: on ? `${accent}14` : "transparent" }}>{at.g}</div>
                  <div style={{ fontFamily: S.fontHead, fontSize: "15.5px", fontWeight: 500, color: on ? accent : S.text, marginBottom: "6px" }}>{at.label}</div>
                  <div style={{ fontFamily: S.fontBody, fontSize: "12.5px", color: S.textDim, lineHeight: 1.5 }}>{at.desc}</div>
                </button>);
              })}</div>
              <div style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Choose a phase</div>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", justifyContent: "center", marginBottom: "12px" }}>{PHASES.map((p, i) => {
                const on = audioSel.phase === i, c = PARABLES[i].color;
                return (<button key={i} onClick={() => setAudioSel(s => ({ ...s, phase: i }))} style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${on ? c : S.border}`, background: on ? `${c}1f` : "transparent", cursor: "pointer", color: on ? c : S.textDim, fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: on ? `0 0 18px ${c}44` : "none" }}>{p.icon}</button>);
              })}</div>
              <div style={{ fontFamily: S.fontBody, fontSize: "14.5px", color: S.textMuted, marginBottom: "30px" }}>{PHASES[audioSel.phase].name} <span style={{ color: S.textDim }}>&middot; Life seeks {PHASES[audioSel.phase].seeks}</span></div>
              <button onClick={beginAudio} style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 42px", borderRadius: "30px", border: "none", background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, color: "#15110b", cursor: "pointer", fontFamily: S.fontSans, fontWeight: 600, fontSize: "14px", letterSpacing: "0.5px", boxShadow: `0 0 44px ${accent}3a` }}>Cross the Threshold</button>
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 2, maxWidth: "620px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="ac-anim" style={{ position: "absolute", top: "52%", left: "50%", width: "340px", height: "340px", transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${accent}33, ${accent}10 55%, transparent 70%)`, animation: "acBreathe 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1, fontFamily: S.fontMono, fontSize: "10px", color: accent, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>{AUDIO_TYPES.find(t => t.id === audioState.type) ? AUDIO_TYPES.find(t => t.id === audioState.type).label : ""}</div>
              <div style={{ position: "relative", zIndex: 1, fontFamily: S.fontMono, fontSize: "11px", color: S.textDim, marginBottom: "40px" }}>{PHASES[audioState.phase].icon} {PHASES[audioState.phase].name}</div>
              <div style={{ position: "relative", zIndex: 1, minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
                {aLineIdx < audioState.lines.length ? (
                  <p key={aLineIdx} style={{ fontFamily: S.fontBody, fontSize: "23px", lineHeight: 1.7, color: S.text, fontStyle: "italic", margin: 0, animation: "acFade 0.9s ease" }}>{audioState.lines[aLineIdx].text}</p>
                ) : (
                  <p style={{ fontFamily: S.fontBody, fontSize: "18px", color: S.textMuted, margin: 0 }}>The reading is complete. Rest a while.</p>
                )}
              </div>
              <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "300px", height: "2px", background: S.border, borderRadius: "2px", margin: "30px auto 30px", overflow: "hidden" }}>
                <div style={{ height: "100%", background: accent, borderRadius: "2px", transition: "width 0.5s", width: `${audioState.lines.length ? ((aLineIdx / audioState.lines.length) * 100) : 0}%`, boxShadow: `0 0 8px ${accent}` }} />
              </div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", marginBottom: "30px" }}>
                <button onClick={() => setAudioState(a => a ? { ...a, lineIdx: Math.max(0, a.lineIdx - 1) } : null)} style={abtn}>{"\u23EE"}</button>
                <button onClick={repeatLine} title="Repeat this line" style={abtn}>{"\u21BB"}</button>
                <button onClick={togglePlay} style={{ ...abtn, width: "60px", height: "60px", fontSize: "22px", background: accent, color: "#15110b", borderColor: accent, boxShadow: `0 0 30px ${accent}55` }}>{aPlaying ? "\u23F8" : "\u25B6"}</button>
                <button onClick={() => setAudioState(a => a ? { ...a, lineIdx: Math.min(a.lines.length, a.lineIdx + 1) } : null)} style={abtn}>{"\u23ED"}</button>
              </div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                <label style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textDim, display: "flex", alignItems: "center", gap: "6px" }}>Speed <select value={audioState.speed} onChange={e => setAudioState(a => a ? { ...a, speed: parseFloat(e.target.value) } : null)} style={{ background: "transparent", border: `1px solid ${S.border}`, borderRadius: "6px", color: S.textMuted, fontFamily: S.fontMono, fontSize: "11px", padding: "4px 8px" }}>{[0.7, 0.8, 0.9, 1.0, 1.1].map(v => <option key={v} value={v}>{v}x</option>)}</select></label>
                <button onClick={() => setAudioState(a => a ? { ...a, ambience: !a.ambience } : null)} style={{ ...abtn, borderRadius: "8px", width: "auto", height: "auto", padding: "5px 12px", fontSize: "11px", fontFamily: S.fontMono, background: audioState.ambience ? `${S.purple}22` : "transparent", borderColor: audioState.ambience ? S.purple : S.border, color: audioState.ambience ? S.purple : S.textDim }}>{"\u223F"} Ambience {audioState.ambience ? "On" : "Off"}</button>
                <label style={{ fontFamily: S.fontMono, fontSize: "10px", color: S.textDim, display: "flex", alignItems: "center", gap: "6px" }}>Sleep <select value={audioState.sleepMin} onChange={e => setAudioState(a => a ? { ...a, sleepMin: parseInt(e.target.value) } : null)} style={{ background: "transparent", border: `1px solid ${S.border}`, borderRadius: "6px", color: S.textMuted, fontFamily: S.fontMono, fontSize: "11px", padding: "4px 8px" }}>{[0, 5, 10, 15, 30].map(v => <option key={v} value={v}>{v ? v + "m" : "Off"}</option>)}</select></label>
              </div>
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}

export default function CommunityClient(){
  const[page,setPage]=useState('dashboard');
  const[adminMode,setAdminMode]=useState(false);
  const[adminPage,setAdminPage]=useState('overview');
  const[profile,setProfile]=useState(()=>load(KEYS.profile,DEFAULT_PROFILE));
  // Server-authoritative tier from /api/me/membership (Stripe subscription state).
  // We sync the local profile.level to the server tier when fetched, so the
  // tier shown in the UI always reflects payment status, not the profile editor.
  const[serverTier,setServerTier]=useState(null);
  const[membershipStatus,setMembershipStatus]=useState('active');
  // Server-authoritative admin flag from /api/me/admin (ADMIN_EMAILS env var).
  // NEVER trust profile.role for admin gating — that field is user-editable
  // and would let any member self-promote to admin. The Admin Console toggle,
  // the admin page renders, and any admin-only side effects must all check
  // serverIsAdmin, not profile.role.
  const[serverIsAdmin,setServerIsAdmin]=useState(false);
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const res=await fetch('/api/me/membership');
        if(!res.ok) return;
        const data=await res.json();
        if(cancelled) return;
        setServerTier(data.tier);
        setMembershipStatus(data.status||'active');
        // If server tier differs from local profile.level, the server wins.
        setProfile(prev=>{
          if(prev.level===data.tier) return prev;
          const updated={...prev,level:data.tier};
          save(KEYS.profile,updated);
          return updated;
        });
      }catch(e){
        console.error('membership fetch failed:',e);
      }
    })();
    (async()=>{
      try{
        const res=await fetch('/api/me/admin');
        if(!res.ok) return;
        const data=await res.json();
        if(cancelled) return;
        setServerIsAdmin(!!data.isAdmin);
        // If server says not admin, force-clear any adminMode that may have
        // been set in this session (defense against stale local state).
        if(!data.isAdmin) setAdminMode(false);
      }catch(e){
        console.error('admin fetch failed:',e);
      }
    })();
    return ()=>{cancelled=true;};
  },[]);
  const[journalEntries,setJournalEntries]=useState(()=>load(KEYS.journal,[]));
  const[posts,setPosts]=useState(()=>load(KEYS.posts,[]));
  const[events,setEvents]=useState(()=>load(KEYS.events,DEFAULT_EVENTS));
  const[announcements,setAnnouncements]=useState(()=>load(KEYS.announcements,DEFAULT_ANNOUNCEMENTS));
  const[progress,setProgress]=useState(()=>load(KEYS.progress,{}));
  const[circleNotes,setCircleNotes]=useState(()=>load(KEYS.circleNotes,[]));
  const[coachingNotes,setCoachingNotes]=useState(()=>load(KEYS.coachingNotes,[]));
  const[members,setMembers]=useState(()=>load(KEYS.members,DEFAULT_MEMBERS));
  const[guides,setGuides]=useState(()=>load(KEYS.guides,GUIDES));
  const[decodings,setDecodings]=useState(()=>load(KEYS.decodings,[]));
  const[codex,setCodex]=useState(()=>load(KEYS.codex,{bookmarks:[],notes:{}}));const[codexJump,setCodexJump]=useState(null);

  const saveProfile=p=>save(KEYS.profile,p);const saveEntries=e=>save(KEYS.journal,e);
  const savePosts=p=>save(KEYS.posts,p);const saveProgress=p=>save(KEYS.progress,p);
  const saveCircleNotes=n=>save(KEYS.circleNotes,n);const saveCoachingNotes=n=>save(KEYS.coachingNotes,n);
  const saveEvents=e=>save(KEYS.events,e);const saveAnnouncements=a=>save(KEYS.announcements,a);
  const saveMembers=m=>save(KEYS.members,m);const saveGuides=g=>save(KEYS.guides,g);
  const saveDecodings=dz=>save(KEYS.decodings,dz);const saveCodex=c=>save(KEYS.codex,c);const openCodex=(phase,tab)=>{setCodexJump({phase,tab,t:Date.now()});setPage('codex');};
  const level=LEVELS.find(l=>l.id===profile.level)||LEVELS[0];

  const resetAll=()=>{Object.values(KEYS).forEach(k=>localStorage.removeItem(k));setProfile(DEFAULT_PROFILE);setJournalEntries([]);setPosts([]);setProgress({});setCircleNotes([]);setCoachingNotes([]);setEvents(DEFAULT_EVENTS);setAnnouncements(DEFAULT_ANNOUNCEMENTS);setMembers(DEFAULT_MEMBERS);setGuides(GUIDES);setDecodings([]);setCodex({bookmarks:[],notes:{}});setAdminMode(false);setPage('dashboard');};

  const[isMobile,setIsMobile]=useState(typeof window!=='undefined'&&window.matchMedia?window.matchMedia('(max-width: 820px)').matches:false);
  const[drawerOpen,setDrawerOpen]=useState(false);
  useEffect(()=>{ if(typeof window==='undefined'||!window.matchMedia) return; const mq=window.matchMedia('(max-width: 820px)'); const h=e=>{setIsMobile(e.matches); if(!e.matches) setDrawerOpen(false);}; if(mq.addEventListener) mq.addEventListener('change',h); else mq.addListener(h); return ()=>{ if(mq.removeEventListener) mq.removeEventListener('change',h); else mq.removeListener(h); }; },[]);
  const navTo=(fn,id)=>{fn(id);setDrawerOpen(false);};

  return(
    <div style={{display:'flex',minHeight:'100vh',color:S.text,fontFamily:S.fontBody,background:`radial-gradient(1200px 800px at 78% -8%, rgba(224,182,92,0.07), transparent 55%), radial-gradient(900px 700px at 12% 8%, rgba(155,143,199,0.06), transparent 50%), ${S.bg}`}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${S.bg};margin:0;overflow-x:hidden;}
        ::-webkit-scrollbar{width:7px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(224,182,92,0.18);border-radius:4px;}::-webkit-scrollbar-thumb:hover{background:rgba(224,182,92,0.32);}
        ::selection{background:${S.gold}33;color:${S.text};}
        @keyframes acFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes acGlow{0%,100%{opacity:0.5;}50%{opacity:0.85;}}
        .ac-page{animation:acFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
        @media (max-width: 820px){
          .ac-main [style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr !important;}
          .ac-main [style*="grid-template-columns: 1fr 1fr 1fr"]{grid-template-columns:1fr !important;}
          .ac-main [style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important;}
          .ac-main [style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr !important;}
          .ac-main [style*="grid-template-columns: repeat(4"]{grid-template-columns:repeat(2,1fr) !important;}
          .ac-main [style*="grid-template-columns: repeat(6"]{grid-template-columns:repeat(4,1fr) !important;}
        }
      `}</style>

      {/* Mobile top bar */}
      {isMobile&&<header style={{position:'fixed',top:0,left:0,right:0,height:'54px',zIndex:50,display:'flex',alignItems:'center',gap:'12px',padding:'0 14px',background:'rgba(11,10,18,0.92)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',borderBottom:`1px solid ${S.border}`}}>
        <button onClick={()=>setDrawerOpen(true)} aria-label="Open menu" style={{border:'none',background:'none',color:S.text,fontSize:'22px',cursor:'pointer',padding:'4px 6px',lineHeight:1}}>☰</button>
        <div style={{display:'flex',alignItems:'baseline',gap:'6px'}}><span style={{fontFamily:S.fontHead,fontSize:'18px',fontWeight:500,color:S.gold,letterSpacing:'-0.3px'}}>Attuned</span><span style={{width:'3px',height:'3px',borderRadius:'50%',background:S.gold,marginBottom:'3px'}}/></div>
        <span style={{marginLeft:'auto',fontFamily:S.fontMono,fontSize:'9px',color:(adminMode&&serverIsAdmin)?S.gold:S.textDim,letterSpacing:'2px',textTransform:'uppercase'}}>{(adminMode&&serverIsAdmin)?'Admin':'Community'}</span>
      </header>}

      {/* Drawer backdrop */}
      {isMobile&&drawerOpen&&<div onClick={()=>setDrawerOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:60}}/>}

      {/* Sidebar / Drawer */}
      <aside style={isMobile?{position:'fixed',top:0,left:0,height:'100vh',width:'272px',zIndex:70,transform:drawerOpen?'translateX(0)':'translateX(-100%)',transition:'transform 0.28s cubic-bezier(0.16,1,0.3,1)',background:'#0E0D16',borderRight:`1px solid ${S.border}`,display:'flex',flexDirection:'column',padding:'20px 12px',overflowY:'auto'}:{width:'232px',flexShrink:0,background:'linear-gradient(180deg, rgba(236,231,221,0.025), rgba(236,231,221,0.008))',borderRight:`1px solid ${S.border}`,display:'flex',flexDirection:'column',padding:'24px 12px',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{padding:'0 14px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><div style={{display:'flex',alignItems:'baseline',gap:'7px'}}>
            <span style={{fontFamily:S.fontHead,fontSize:'22px',fontWeight:500,color:S.gold,letterSpacing:'-0.3px'}}>Attuned</span>
            <span style={{width:'4px',height:'4px',borderRadius:'50%',background:S.gold,display:'inline-block',marginBottom:'4px'}}/></div>
          <div style={{fontFamily:S.fontMono,fontSize:'9.5px',color:(adminMode&&serverIsAdmin)?S.gold:S.textDim,letterSpacing:'3px',textTransform:'uppercase',marginTop:'2px'}}>{(adminMode&&serverIsAdmin)?'Admin Console':'Community'}</div></div>
          {isMobile&&<button onClick={()=>setDrawerOpen(false)} aria-label="Close menu" style={{border:'none',background:'none',color:S.textMuted,fontSize:'22px',cursor:'pointer',padding:'0 4px',lineHeight:1}}>×</button>}</div>
        <div style={{padding:'0 14px',marginBottom:'26px',fontFamily:S.fontBody,fontSize:'11px',color:S.textMuted,fontStyle:'italic',lineHeight:1.5}}>Learn the Order. Read the Pattern. Move with the Rhythm.</div>

        <nav style={{display:'flex',flexDirection:'column',gap:'2px',flex:1}}>
          {((adminMode&&serverIsAdmin)?ADMIN_NAV:NAV_ITEMS).map(item=><SidebarIcon key={item.id} icon={item.icon} label={item.label} active={(adminMode?adminPage:page)===item.id} onClick={()=>navTo(adminMode?setAdminPage:setPage,item.id)}/>)}
        </nav>

        {serverIsAdmin&&<button onClick={()=>{setAdminMode(!adminMode);setDrawerOpen(false);}} style={{display:'flex',alignItems:'center',gap:'10px',width:'100%',padding:'11px 16px',marginTop:'8px',borderRadius:'10px',cursor:'pointer',border:`1px solid ${adminMode?S.gold:S.gold+'30'}`,background:adminMode?S.goldDim:'transparent',color:S.gold,fontFamily:S.fontSans,fontSize:'13px',fontWeight:600,transition:'all 0.2s'}}>
          <span style={{fontSize:'15px'}}>{adminMode?'←':'⚙'}</span><span>{adminMode?'Member Portal':'Admin Console'}</span></button>}

        {/* User footer */}
        <div style={{padding:'14px',borderRadius:'10px',background:'rgba(255,255,255,0.02)',border:`1px solid ${S.border}`,marginTop:'12px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:`linear-gradient(135deg, ${level.color}40, ${level.color}20)`,border:`1px solid ${level.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:S.fontHead,fontSize:'13px',color:level.color,marginBottom:'8px'}}>{(profile.name||'A')[0].toUpperCase()}</div>
          <div style={{fontFamily:S.fontSans,fontSize:'13px',color:S.text,fontWeight:500}}>{profile.name||'Set your name'}</div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'2px'}}>
            <span style={{fontFamily:S.fontSans,fontSize:'11px',color:level.color}}>{level.label}</span>
            <button onClick={()=>navTo(setPage,'profile')} style={{border:'none',background:'none',color:S.textDim,fontFamily:S.fontSans,fontSize:'10px',cursor:'pointer',padding:0,textDecoration:'underline'}}>Edit</button></div>
          <button onClick={()=>{resetAll();setDrawerOpen(false);}} style={{border:'none',background:'none',color:S.textDim,fontFamily:S.fontSans,fontSize:'10px',cursor:'pointer',marginTop:'8px',padding:0}}>Reset</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ac-main" style={{flex:1,minWidth:0,width:'100%',padding:isMobile?'70px 16px 32px':'32px 44px',maxWidth:isMobile?'100%':'1000px',overflowX:'hidden'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px',paddingBottom:'18px',borderBottom:`1px solid ${S.border}`,gap:'10px',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:S.gold}}/>
            <span style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textMuted,letterSpacing:'2.5px',textTransform:'uppercase'}}>{(adminMode&&serverIsAdmin)?'Admin Console · Twelvefold Institute':'Twelvefold Institute'}</span></div>
          {!isMobile&&<div style={{fontFamily:S.fontMono,fontSize:'10.5px',color:S.textDim,letterSpacing:'0.5px'}}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>}</div>

        <div key={adminMode?('admin-'+adminPage):page} className="ac-page">
        {adminMode&&serverIsAdmin?(<>
          {adminPage==='overview'&&<AdminOverviewPage members={members} events={events} announcements={announcements} guides={guides} goAdmin={setAdminPage}/>}
          {adminPage==='members'&&<AdminMembersPage members={members} setMembers={setMembers} saveMembers={saveMembers}/>}
          {adminPage==='announcements'&&<AdminAnnouncementsPage announcements={announcements} setAnnouncements={setAnnouncements} saveAnnouncements={saveAnnouncements}/>}
          {adminPage==='events'&&<AdminEventsPage events={events} setEvents={setEvents} saveEvents={saveEvents}/>}
          {adminPage==='guides'&&<AdminGuidesPage guides={guides} setGuides={setGuides} saveGuides={saveGuides}/>}
        </>):(<>
        {page==='dashboard'&&<DashboardPage profile={profile} journalEntries={journalEntries} posts={posts} events={events} announcements={announcements} goTo={setPage}/>}
        {page==='journey'&&<MyJourneyPage profile={profile} progress={progress} setProfile={setProfile} saveProfile={saveProfile}/>}
        {page==='decoder'&&<EventDecoderPage profile={profile} decodings={decodings} setDecodings={setDecodings} saveDecodings={saveDecodings} setProfile={setProfile} saveProfile={saveProfile} goTo={setPage} openCodex={openCodex}/>}
        {page==='phases'&&<PhaseWisdomPage profile={profile}/>}
        {page==='rhythm'&&<RhythmCalendarPage profile={profile} openCodex={openCodex}/>}
        {page==='wisdom'&&<WisdomTracksPage profile={profile} progress={progress} setProgress={setProgress} saveProgress={saveProgress}/>}
        {page==='learning'&&<LearningPage profile={profile} progress={progress} setProgress={setProgress} saveProgress={saveProgress}/>}
        {page==='community'&&<CommunityPage profile={profile} posts={posts} setPosts={setPosts} savePosts={savePosts}/>}
        {page==='coaching'&&<CoachingPage profile={profile} guides={guides} coachingNotes={coachingNotes} setCoachingNotes={setCoachingNotes} saveCoachingNotes={saveCoachingNotes}/>}
        {page==='circles'&&<CirclesPage events={events} circleNotes={circleNotes} setCircleNotes={setCircleNotes} saveCircleNotes={saveCircleNotes}/>}
        {page==='events'&&<EventsPage events={events} announcements={announcements}/>}
        {page==='journal'&&<JournalPage profile={profile} entries={journalEntries} setEntries={setJournalEntries} saveEntries={saveEntries}/>}
        {page==='why'&&<WhyAttunedPage goTo={setPage}/>}
        {page==='profile'&&<ProfilePage profile={profile} setProfile={setProfile} saveProfile={saveProfile}/>}
        {page==='codex'&&<CodexPage profile={profile} setProfile={setProfile} saveProfile={saveProfile} codex={codex} setCodex={setCodex} saveCodex={saveCodex} jump={codexJump} goTo={setPage} onConsumeJump={()=>setCodexJump(null)} onSaveToJournal={(entry)=>{const u=[entry,...journalEntries];setJournalEntries(u);saveEntries(u);}}/>}
        </>)}
        </div>
      </main>
    </div>
  );
}
