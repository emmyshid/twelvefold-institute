"use client";
     
import React, { useEffect, useMemo, useRef, useState } from 'react';

// ── Local data (50 structures · five-layer mappings) ──
// ── The five framework layers ─────────────────────────────────
const FRAMEWORK_LAYERS = [
  {
    id: 'Intelligent Order',
    short: 'The invisible organizing wisdom behind reality.',
    description:
      'The unseen intelligence from which all form proceeds. It is never observed directly — only inferred from the order it leaves behind.',
    colorVar: 'order',
  },
  {
    id: 'Structure',
    short: 'The visible form through which order takes shape.',
    description:
      'Where intelligence becomes architecture. Structure is order made visible and touchable.',
    colorVar: 'structure',
  },
  {
    id: 'Pattern',
    short: 'The recurring relationship inside the structure.',
    description:
      'The relationship that repeats within a structure. What repeats reveals what is operating.',
    colorVar: 'pattern',
  },
  {
    id: 'Rhythm',
    short: 'The movement of pattern through time.',
    description:
      'Pattern set in motion. Rhythm is the timing by which a structure breathes, turns, and renews.',
    colorVar: 'rhythm',
  },
  {
    id: 'Events',
    short: 'The observable outcomes produced in life.',
    description:
      'The visible surface — the fruit of everything beneath it. Events reveal, but do not explain, the order that produced them.',
    colorVar: 'event',
  },
];

// ── Categories ────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'universal', label: 'Universal Forms', blurb: 'The shapes order takes everywhere at once.' },
  { id: 'heavenly', label: 'Heavenly Bodies', blurb: 'Order written across the largest scale.' },
  { id: 'earth', label: 'Earth', blurb: 'The living ground and its slow intelligence.' },
  { id: 'human', label: 'Human Body', blurb: 'A cosmos of order carried within you.' },
  { id: 'plants', label: 'Plants', blurb: 'Patient architecture rising toward light.' },
  { id: 'animals', label: 'Animals', blurb: 'Order expressed as instinct and cooperation.' },
  { id: 'phenomena', label: "Nature's Phenomena", blurb: 'Order revealed in fleeting, vivid form.' },
];

// ── Structures ────────────────────────────────────────────────
const STRUCTURES = [
  // ============ UNIVERSAL FORMS ============
  {
    id: 'circle', name: 'Circle', category: 'universal', icon: 'circle',
    principle: 'Unity, wholeness, continuity',
    description: 'A line that returns to itself — no beginning, no end, every point equal to the center.',
    physicalExample: 'The horizon, the pupil of an eye, ripples on still water.',
    primaryLayer: 'Intelligent Order',
    mapping: {
      intelligentOrder: 'Wholeness is the native state of things; fragmentation is the exception.',
      structure: 'A boundary equidistant from a single governing center.',
      pattern: 'Every point relates to the center in exactly the same way.',
      rhythm: 'Return — the end meets the beginning without break.',
      events: 'Completion, belonging, and a sense of things made whole.',
    },
  },
  {
    id: 'sphere', name: 'Sphere', category: 'universal', icon: 'sphere',
    principle: 'Completeness, stability',
    description: 'The circle made whole in three dimensions — the most efficient, stable form in nature.',
    physicalExample: 'Planets, raindrops, bubbles, seeds, the eye.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Order minimizes waste; completeness is achieved with the least surface.',
      structure: 'Every point on the surface held at equal distance from the core.',
      pattern: 'Uniform tension distributed evenly in all directions.',
      rhythm: 'A stable form that holds rather than changes over time.',
      events: 'Resilience, containment, and the capacity to endure pressure.',
    },
  },
  {
    id: 'spiral', name: 'Spiral', category: 'universal', icon: 'spiral',
    principle: 'Growth, unfolding, transformation',
    description: 'A path that expands as it turns — growth that never simply repeats the same circle.',
    physicalExample: 'Galaxies, shells, ferns unfurling, water draining, DNA.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Growth is not repetition; each turn carries the last forward, enlarged.',
      structure: 'A curve whose radius increases at a constant proportion.',
      pattern: 'Return to a familiar position, but always at a higher level.',
      rhythm: 'Cyclical motion that advances rather than circles in place.',
      events: 'Development, maturation, and progress that honors what came before.',
    },
  },
  {
    id: 'branching', name: 'Branching', category: 'universal', icon: 'branching',
    principle: 'Distribution, multiplication',
    description: 'One channel dividing into many, carrying resource or signal outward to the edges.',
    physicalExample: 'Trees, rivers, lungs, lightning, blood vessels, nerves.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Abundance reaches the many through faithful division from the one.',
      structure: 'A trunk that splits, and splits again, to fill a whole space.',
      pattern: 'Each branch repeats the logic of the branch before it.',
      rhythm: 'Outward growth at the tips while the core thickens and holds.',
      events: 'Reach, supply, and resilience through many redundant paths.',
    },
  },
  {
    id: 'network', name: 'Network', category: 'universal', icon: 'network',
    principle: 'Interconnection',
    description: 'Many nodes bound by relationship, where no single point carries the whole.',
    physicalExample: 'Mycelium, neurons, ecosystems, social bonds.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Strength lives in relationship, not in any isolated part.',
      structure: 'Distributed nodes joined by many crossing links.',
      pattern: 'Connection over hierarchy; influence flows along the threads.',
      rhythm: 'Continuous exchange and adjustment among the parts.',
      events: 'Resilience, emergence, and intelligence greater than any node.',
    },
  },
  {
    id: 'helix', name: 'Helix', category: 'universal', icon: 'helix',
    principle: 'Information and continuity',
    description: 'A spiral wound around an axis — a structure built to carry and protect information.',
    physicalExample: 'DNA, climbing vines, springs, certain shells.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'What must endure is encoded, paired, and protected.',
      structure: 'Two strands wound in step around a shared axis.',
      pattern: 'Complementary pairing — each side implies and guards the other.',
      rhythm: 'Faithful copying across generations of cells and time.',
      events: 'Inheritance, identity, and continuity of life across ages.',
    },
  },
  {
    id: 'wave', name: 'Wave', category: 'universal', icon: 'wave',
    principle: 'Rhythm and transmission',
    description: 'Energy moving through a medium without the medium itself travelling.',
    physicalExample: 'Light, sound, water, heat, signals.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Influence travels while the ground stays; energy moves, matter rests.',
      structure: 'Repeating crests and troughs along a line of travel.',
      pattern: 'Regular oscillation between two opposite states.',
      rhythm: 'Frequency — the steady beat that carries the message.',
      events: 'Communication, resonance, and energy delivered at a distance.',
    },
  },
  {
    id: 'cycle', name: 'Cycle', category: 'universal', icon: 'cycle',
    principle: 'Renewal',
    description: 'A sequence that returns to its origin to begin again, refreshed.',
    physicalExample: 'Water cycle, seasons, day and night, breath.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Endings are not final; they are the door to renewal.',
      structure: 'A closed loop of ordered stages, each feeding the next.',
      pattern: 'Recurrence — the same phases arriving in the same order.',
      rhythm: 'Turning at a reliable pace, neither rushed nor skipped.',
      events: 'Renewal, sustainability, and the return of what was spent.',
    },
  },
  {
    id: 'symmetry', name: 'Symmetry', category: 'universal', icon: 'symmetry',
    principle: 'Balance and coherence',
    description: 'Correspondence of parts across an axis or center — order you can feel as beauty.',
    physicalExample: 'Faces, butterflies, crystals, snowflakes, leaves.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Coherence is legible; true order can be recognized at a glance.',
      structure: 'Parts that mirror one another across a shared axis.',
      pattern: 'Balanced correspondence — what appears on one side answers the other.',
      rhythm: 'Stable proportion held steady through growth.',
      events: 'Beauty, trust, and the immediate sense that a thing is sound.',
    },
  },
  {
    id: 'fractal', name: 'Fractal', category: 'universal', icon: 'fractal',
    principle: 'The whole reflected in the parts',
    description: 'A form whose smallest pieces echo the shape of the whole, at every scale.',
    physicalExample: 'Coastlines, ferns, broccoli, clouds, lungs, river deltas.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'The same wisdom governs the part and the whole alike.',
      structure: 'Self-similar shapes nested within themselves repeatedly.',
      pattern: 'One rule applied again and again across changing scales.',
      rhythm: 'Iteration — the rule re-run until detail fills the form.',
      events: 'Efficiency, richness, and unity between the small and the vast.',
    },
  },

  // ============ HEAVENLY BODIES ============
  {
    id: 'galaxy', name: 'Galaxy', category: 'heavenly', icon: 'galaxy',
    principle: 'Ordered expansion',
    description: 'Hundreds of billions of stars held in graceful spiral by unseen gravity.',
    physicalExample: 'The Milky Way; Andromeda; spiral and barred galaxies.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Vastness need not mean chaos; immensity can be exquisitely ordered.',
      structure: 'A rotating disc of stars arranged in spiral arms around a core.',
      pattern: 'Spiral distribution repeated across billions of bodies.',
      rhythm: 'Slow majestic rotation over hundreds of millions of years.',
      events: 'Star formation, stability, and a home for worlds to arise.',
    },
  },
  {
    id: 'solarSystem', name: 'Solar System', category: 'heavenly', icon: 'solarSystem',
    principle: 'Harmony through relationship',
    description: 'Worlds of vastly different sizes held in balanced relationship around one star.',
    physicalExample: 'The Sun and its planets, moons, and belts.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Diverse bodies flourish when each keeps its proper place.',
      structure: 'Planets ordered by distance around a central gravitational anchor.',
      pattern: 'Balance of pull and motion that holds each orbit steady.',
      rhythm: 'Each world keeping its own year, all turning together.',
      events: 'Stability, seasons, and conditions in which life becomes possible.',
    },
  },
  {
    id: 'orbit', name: 'Orbit', category: 'heavenly', icon: 'orbit',
    principle: 'Faithful rhythm',
    description: 'The endless, reliable path a body traces around the one that holds it.',
    physicalExample: 'Earth around the Sun; the Moon around Earth.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Freedom and constraint are not enemies; the bond enables the flight.',
      structure: 'An elliptical path balanced between momentum and gravity.',
      pattern: 'The same path retraced with extraordinary precision.',
      rhythm: 'A fixed period — the dependable return, year after year.',
      events: 'Predictability, calendars, and the trust of reliable time.',
    },
  },
  {
    id: 'planet', name: 'Planet', category: 'heavenly', icon: 'planet',
    principle: 'Stability and stewardship',
    description: 'A world large enough to hold an atmosphere, steady enough to cradle life.',
    physicalExample: 'Earth — water, air, and soil held in balance.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Life requires a stable home prepared and kept in balance.',
      structure: 'Layered core, mantle, crust, water, and atmosphere.',
      pattern: 'Cycles of matter and energy circulating through the layers.',
      rhythm: 'Daily rotation and yearly orbit setting the tempo of life.',
      events: 'Climate, habitability, and the flourishing of living things.',
    },
  },
  {
    id: 'moon', name: 'Moon', category: 'heavenly', icon: 'moon',
    principle: 'Cycles and reflection',
    description: 'A body that shines not by its own light but by faithfully reflecting another.',
    physicalExample: 'Earth\u2019s Moon and its phases; the tides it pulls.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Influence can be quiet, borrowed, and steady rather than blazing.',
      structure: 'A satellite locked in companionship with its planet.',
      pattern: 'Waxing and waning through a fixed sequence of phases.',
      rhythm: 'A monthly cycle governing tides and many living clocks.',
      events: 'Tides, seasons of growth, and rhythm for life below.',
    },
  },
  {
    id: 'stars', name: 'Stars', category: 'heavenly', icon: 'stars',
    principle: 'Light, guidance, continuity',
    description: 'Furnaces of light that forge the very elements of which we are made.',
    physicalExample: 'The Sun; distant suns used for navigation for millennia.',
    primaryLayer: 'Intelligent Order',
    mapping: {
      intelligentOrder: 'Light is given to be shared; what shines also makes and guides.',
      structure: 'A balanced sphere of fusion, gravity pressing, energy pushing out.',
      pattern: 'Steady output sustained by equilibrium of opposing forces.',
      rhythm: 'A long life cycle from birth in nebulae to return as dust.',
      events: 'Warmth, navigation, the elements of life, and constancy.',
    },
  },

  // ============ EARTH ============
  {
    id: 'mountains', name: 'Mountains', category: 'earth', icon: 'mountains',
    principle: 'Stability',
    description: 'The slow uplift of the earth into forms that endure across ages.',
    physicalExample: 'The Himalayas, the Andes, ancient eroded ranges.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Permanence is built slowly and rests on hidden depth.',
      structure: 'Vast mass with roots set deeper than the visible peak.',
      pattern: 'Pressure over time lifting and folding the land.',
      rhythm: 'Geological tempo — rising and weathering across eons.',
      events: 'Watersheds, shelter, climate, and a sense of the enduring.',
    },
  },
  {
    id: 'rivers', name: 'Rivers', category: 'earth', icon: 'rivers',
    principle: 'Flow and adaptation',
    description: 'Water finding its way to the sea, shaping the land as it yields to it.',
    physicalExample: 'The Nile, the Amazon, mountain streams.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Persistence wins by yielding; softness carves the hardest stone.',
      structure: 'A branching channel gathering from many tributaries to one mouth.',
      pattern: 'Always moving toward the lowest path open to it.',
      rhythm: 'Seasonal flood and ebb shaping the valley over years.',
      events: 'Fertile plains, transport, and the carving of canyons.',
    },
  },
  {
    id: 'oceans', name: 'Oceans', category: 'earth', icon: 'oceans',
    principle: 'Depth and abundance',
    description: 'The vast reservoir that holds most of life and drives the planet\u2019s climate.',
    physicalExample: 'The Pacific; deep trenches; coral reefs.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'The greatest abundance lies beneath the visible surface.',
      structure: 'Layered depths, currents, and basins covering the globe.',
      pattern: 'Circulation moving heat and nutrient around the world.',
      rhythm: 'Tides and currents on daily, seasonal, and decadal cycles.',
      events: 'Climate regulation, rainfall, and a cradle teeming with life.',
    },
  },
  {
    id: 'forests', name: 'Forests', category: 'earth', icon: 'forests',
    principle: 'Interdependence',
    description: 'A community of trees, fungi, and creatures sharing one living economy.',
    physicalExample: 'Rainforests; old-growth woodland; the fungal "wood-wide web."',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'No one thrives alone; the whole sustains each part.',
      structure: 'Layered canopy, understory, and roots joined underground.',
      pattern: 'Exchange of nutrient, water, and signal among many species.',
      rhythm: 'Seasonal cycles of growth, fall, decay, and return.',
      events: 'Clean air, stored carbon, biodiversity, and shelter.',
    },
  },
  {
    id: 'soil', name: 'Soil', category: 'earth', icon: 'soil',
    principle: 'Hidden preparation',
    description: 'The unseen, living medium where decay becomes the ground of new growth.',
    physicalExample: 'Topsoil teeming with microbes, worms, and roots.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'What is hidden and humble prepares what is visible and grand.',
      structure: 'Layered horizons of mineral, organic matter, air, and water.',
      pattern: 'Decay continually recycled into fertility.',
      rhythm: 'Slow seasonal building and replenishing of richness.',
      events: 'Harvests, forests, and the foundation of the food web.',
    },
  },
  {
    id: 'seasons', name: 'Seasons', category: 'earth', icon: 'seasons',
    principle: 'Renewal through cycles',
    description: 'The year\u2019s turning that gives each living thing its time to act and to rest.',
    physicalExample: 'Spring, summer, autumn, winter; planting and harvest.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'There is a time for every purpose; nothing is meant to be constant.',
      structure: 'Four phases set by the planet\u2019s tilt toward the Sun.',
      pattern: 'Growth, fullness, release, and rest in fixed succession.',
      rhythm: 'An annual cycle pacing all of life and agriculture.',
      events: 'Harvests, migrations, dormancy, and renewal.',
    },
  },

  // ============ HUMAN BODY ============
  {
    id: 'brain', name: 'Brain', category: 'human', icon: 'brain',
    principle: 'Integration',
    description: 'Billions of cells weaving sensation, memory, and meaning into one self.',
    physicalExample: 'The human cortex; the networks of neurons.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Wholeness of self emerges from countless parts in concert.',
      structure: 'Networked regions, each specialized, densely interlinked.',
      pattern: 'Signals integrated across the whole into unified experience.',
      rhythm: 'Continuous electrical activity in waves and sleep cycles.',
      events: 'Thought, choice, learning, and conscious awareness.',
    },
  },
  {
    id: 'heart', name: 'Heart', category: 'human', icon: 'heartOrgan',
    principle: 'Sustaining rhythm',
    description: 'A tireless pump whose steady beat carries life to every cell.',
    physicalExample: 'The four-chambered heart; the pulse.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Life is sustained by faithful, unseen, ceaseless service.',
      structure: 'Four chambers and valves directing one-way flow.',
      pattern: 'Contraction and release alternating without pause.',
      rhythm: 'A steady beat adjusting to rest and exertion.',
      events: 'Circulation, vitality, and endurance over a lifetime.',
    },
  },
  {
    id: 'lungs', name: 'Lungs', category: 'human', icon: 'lungs',
    principle: 'Exchange',
    description: 'A branching tree of air where the body trades waste for what renews it.',
    physicalExample: 'Bronchi branching into millions of alveoli.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Life is sustained by giving away as much as taking in.',
      structure: 'Branching airways ending in vast surface for exchange.',
      pattern: 'Reciprocity — oxygen received, carbon dioxide released.',
      rhythm: 'Inhale and exhale in continuous, automatic cycle.',
      events: 'Energy, balance, and a body kept clean and alive.',
    },
  },
  {
    id: 'skeleton', name: 'Skeleton', category: 'human', icon: 'skeleton',
    principle: 'Support',
    description: 'The hidden frame that gives the body its shape, motion, and protection.',
    physicalExample: 'The 206 bones; the spine; the rib cage.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Freedom of movement rests on a faithful inner frame.',
      structure: 'A jointed framework of strong yet living bone.',
      pattern: 'Rigidity and flexibility balanced at every joint.',
      rhythm: 'Constant renewal as bone is dissolved and rebuilt.',
      events: 'Posture, protection, movement, and blood made in the marrow.',
    },
  },
  {
    id: 'bloodVessels', name: 'Blood Vessels', category: 'human', icon: 'bloodVessels',
    principle: 'Distribution',
    description: 'A vast branching highway delivering nourishment to every living cell.',
    physicalExample: 'Arteries, veins, and capillaries — thousands of miles in one body.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Provision must reach the least and most distant part.',
      structure: 'A branching tree narrowing from arteries to fine capillaries.',
      pattern: 'Outward supply paired with a returning path for renewal.',
      rhythm: 'Pulsing flow timed to the beat of the heart.',
      events: 'Nourishment, healing, warmth, and life to every tissue.',
    },
  },
  {
    id: 'nervousSystem', name: 'Nervous System', category: 'human', icon: 'nervousSystem',
    principle: 'Communication',
    description: 'A living wiring that lets the whole body sense, decide, and respond as one.',
    physicalExample: 'Brain, spinal cord, and nerves reaching the skin.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'A body acts as one only when every part can speak and listen.',
      structure: 'A central cord branching into a web reaching everywhere.',
      pattern: 'Signal and response relayed at extraordinary speed.',
      rhythm: 'Continuous feedback between sensing and acting.',
      events: 'Coordination, reflex, perception, and unified action.',
    },
  },
  {
    id: 'dna', name: 'DNA', category: 'human', icon: 'dna',
    principle: 'Identity and continuity',
    description: 'A coded helix carrying the instructions for a whole living being.',
    physicalExample: 'The double helix within every cell\u2019s nucleus.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Identity is written, guarded, and faithfully passed on.',
      structure: 'Two complementary strands coiled around one axis.',
      pattern: 'Paired bases spelling instructions in a four-letter code.',
      rhythm: 'Copied precisely each time a cell divides.',
      events: 'Inheritance, growth, repair, and the continuity of life.',
    },
  },
  {
    id: 'skin', name: 'Skin', category: 'human', icon: 'skin',
    principle: 'Boundary and protection',
    description: 'The living border that both protects the self and connects it to the world.',
    physicalExample: 'The body\u2019s largest organ; its layers and pores.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'A healthy boundary both protects within and permits exchange.',
      structure: 'Layered barrier, renewing outer cells over living depths.',
      pattern: 'Selective passage — keeping out harm, letting through signal.',
      rhythm: 'Constant shedding and renewal of the surface.',
      events: 'Protection, temperature, sensation, and contact with the world.',
    },
  },

  // ============ PLANTS ============
  {
    id: 'roots', name: 'Roots', category: 'plants', icon: 'roots',
    principle: 'Foundation',
    description: 'The hidden anchor that feeds the plant and holds it against every storm.',
    physicalExample: 'Taproots and fine root hairs spreading underground.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'What rises high must first reach deep, unseen.',
      structure: 'A branching system spreading wide below the surface.',
      pattern: 'Depth before height; anchoring before reaching.',
      rhythm: 'Seasonal absorption of water and nutrient from the soil.',
      events: 'Stability, nourishment, and resilience against the wind.',
    },
  },
  {
    id: 'trunk', name: 'Trunk', category: 'plants', icon: 'trunk',
    principle: 'Strength',
    description: 'The strong central column that lifts the canopy and carries its supply.',
    physicalExample: 'A tree\u2019s growth rings; bark; the load-bearing core.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Strength is built one ring at a time and proven by load.',
      structure: 'A central column of layered wood adding rings yearly.',
      pattern: 'Concentric growth thickening with each passing season.',
      rhythm: 'Annual rings recording years of plenty and of want.',
      events: 'Height, support for the canopy, and longevity.',
    },
  },
  {
    id: 'branchesPlant', name: 'Branches', category: 'plants', icon: 'branchesPlant',
    principle: 'Expansion',
    description: 'Arms reaching outward to claim light and air for the whole.',
    physicalExample: 'A canopy spreading to capture sunlight.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Growth reaches outward only as far as the core can support.',
      structure: 'Repeated forking that fills space toward the light.',
      pattern: 'Division and spread balanced against the trunk\u2019s strength.',
      rhythm: 'New shoots in spring, hardening through the year.',
      events: 'Greater reach, more leaves, and a fuller harvest of light.',
    },
  },
  {
    id: 'leaves', name: 'Leaves', category: 'plants', icon: 'leaves',
    principle: 'Reception',
    description: 'Solar panels of the living world, turning light into the food of life.',
    physicalExample: 'Broad leaves; veins; the green of chlorophyll.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Receiving freely given light is itself a kind of work.',
      structure: 'Thin, broad surfaces veined for supply and exchange.',
      pattern: 'Maximum surface turned to catch the most light.',
      rhythm: 'Daily opening to sun; seasonal leafing and falling.',
      events: 'Photosynthesis — sugar, growth, and oxygen for all.',
    },
  },
  {
    id: 'flowers', name: 'Flowers', category: 'plants', icon: 'flowers',
    principle: 'Beauty, attraction, reproduction',
    description: 'Beauty with purpose — drawing in partners to carry life forward.',
    physicalExample: 'Petals, nectar, and the dance of bee and bloom.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Beauty is not idle; it serves the continuation of life.',
      structure: 'Petals, color, and scent arranged around the seed-makers.',
      pattern: 'Attraction offered in exchange for pollination.',
      rhythm: 'Blooming in season, timed to the presence of pollinators.',
      events: 'Pollination, fruit, seeds, and the next generation.',
    },
  },
  {
    id: 'fruit', name: 'Fruit', category: 'plants', icon: 'fruit',
    principle: 'Multiplication',
    description: 'The sweet vessel that protects the seed and recruits help to spread it.',
    physicalExample: 'Apples, berries, grains carrying seed within.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Generosity multiplies; what is given away seeds the future.',
      structure: 'Nourishing flesh enclosing and protecting the seed.',
      pattern: 'Reward offered so that seeds are carried and sown afar.',
      rhythm: 'Ripening at season\u2019s end, the fruit of a year\u2019s work.',
      events: 'Food for many and seeds dispersed to new ground.',
    },
  },
  {
    id: 'seeds', name: 'Seeds', category: 'plants', icon: 'seeds',
    principle: 'Future potential',
    description: 'A whole tree folded, waiting, into a form small enough to be carried.',
    physicalExample: 'An acorn; a grain of wheat; a dormant seed.',
    primaryLayer: 'Intelligent Order',
    mapping: {
      intelligentOrder: 'Immense futures rest, complete, inside the smallest beginning.',
      structure: 'A protected embryo packed with its own first food.',
      pattern: 'Potential held dormant until the conditions are right.',
      rhythm: 'Waiting through season, then germinating in its time.',
      events: 'New plants, harvests, and the renewal of whole forests.',
    },
  },

  // ============ ANIMALS ============
  {
    id: 'wings', name: 'Wings', category: 'animals', icon: 'wings',
    principle: 'Freedom and lift',
    description: 'Form shaped so precisely to air that it turns effort into flight.',
    physicalExample: 'A bird\u2019s wing; the feather; the soaring hawk.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Freedom is earned by perfect alignment with a law, not against it.',
      structure: 'A curved airfoil of light bone, muscle, and feather.',
      pattern: 'Shape that converts forward motion into upward lift.',
      rhythm: 'The beat of flapping alternating with the glide.',
      events: 'Flight, migration, escape, and the reach of new ground.',
    },
  },
  {
    id: 'honeycomb', name: 'Honeycomb', category: 'animals', icon: 'honeycomb',
    principle: 'Efficient cooperation',
    description: 'A perfect tiling that stores the most with the least, built by a community.',
    physicalExample: 'The hexagonal wax cells of a beehive.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Cooperation discovers the most efficient possible form.',
      structure: 'Identical hexagonal cells tiled without any gap.',
      pattern: 'Hexagons — maximum storage for minimum material.',
      rhythm: 'Built cell by cell in the steady labor of the hive.',
      events: 'Stored honey, raised young, and a thriving colony.',
    },
  },
  {
    id: 'spiderWeb', name: 'Spider Web', category: 'animals', icon: 'spiderWeb',
    principle: 'Precision and sensitivity',
    description: 'A structure that is at once a trap, a home, and an instrument of sense.',
    physicalExample: 'The radial orb web strung with sticky spirals.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Strength and sensitivity can be woven into a single design.',
      structure: 'Radial spokes anchoring a capturing spiral.',
      pattern: 'Tension distributed so any touch is felt at the center.',
      rhythm: 'Rebuilt and repaired in patient daily cycles.',
      events: 'Capture of prey, shelter, and survival.',
    },
  },
  {
    id: 'antColony', name: 'Ant Colony', category: 'animals', icon: 'antColony',
    principle: 'Collective organization',
    description: 'Thousands of simple individuals producing intelligence none alone possesses.',
    physicalExample: 'Foraging trails, chambers, and the division of labor.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Order can rise from the bottom up, without a single ruler.',
      structure: 'A society of specialized roles serving one colony.',
      pattern: 'Simple local rules producing complex collective behavior.',
      rhythm: 'Continuous foraging, building, and tending the brood.',
      events: 'Resilient shelter, abundant supply, and a thriving colony.',
    },
  },
  {
    id: 'fishSchool', name: 'Fish School', category: 'animals', icon: 'fishSchool',
    principle: 'Coordinated movement',
    description: 'Many bodies moving as one, turning together as if of a single mind.',
    physicalExample: 'A silver school flashing and turning in unison.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Unity of motion gives the many a strength of the one.',
      structure: 'A loose, fluid formation with no fixed leader.',
      pattern: 'Each one matching the speed and heading of its neighbors.',
      rhythm: 'Instant, synchronized turning through the water.',
      events: 'Protection from predators and efficient travel.',
    },
  },
  {
    id: 'birdMigration', name: 'Bird Migration', category: 'animals', icon: 'birdMigration',
    principle: 'Seasonal rhythm',
    description: 'A journey of thousands of miles, timed and navigated without a map.',
    physicalExample: 'Geese in formation; terns crossing hemispheres.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Life reads the season and moves to meet it.',
      structure: 'Flocks in efficient formation along ancient routes.',
      pattern: 'Departure and return keyed to light and climate.',
      rhythm: 'Annual migration in step with the turning year.',
      events: 'Survival, breeding, and the spread of life across the globe.',
    },
  },

  // ============ NATURE'S PHENOMENA ============
  {
    id: 'snowflake', name: 'Snowflake', category: 'phenomena', icon: 'snowflake',
    principle: 'Ordered uniqueness',
    description: 'Six-fold symmetry expressed in endless, never-repeated variation.',
    physicalExample: 'A single ice crystal magnified.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'A shared law and unrepeatable individuality coexist perfectly.',
      structure: 'Six-armed crystal grown from water\u2019s molecular geometry.',
      pattern: 'One rule of symmetry, infinite particular expressions.',
      rhythm: 'Formed in moments as it falls through changing air.',
      events: 'Snow, beauty, and the slow recharge of mountain water.',
    },
  },
  {
    id: 'crystal', name: 'Crystal', category: 'phenomena', icon: 'crystal',
    principle: 'Internal order',
    description: 'Visible order on the outside that simply reveals a hidden order within.',
    physicalExample: 'Quartz, salt, gemstones, mineral lattices.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Outer form faithfully expresses an inner ordering.',
      structure: 'Atoms locked in a repeating three-dimensional lattice.',
      pattern: 'The same unit cell repeated to fill the whole.',
      rhythm: 'Slow, patient growth atom by atom over time.',
      events: 'Strength, clarity, and beauty arising from inner order.',
    },
  },
  {
    id: 'lightning', name: 'Lightning', category: 'phenomena', icon: 'lightning',
    principle: 'Sudden transformation',
    description: 'A long, hidden buildup released in a single decisive instant.',
    physicalExample: 'A bolt branching from cloud to ground.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Hidden imbalance resolves the moment a path is found.',
      structure: 'A branching channel of superheated, ionized air.',
      pattern: 'Charge accumulating until it must discharge.',
      rhythm: 'Long, quiet buildup; sudden, brilliant release.',
      events: 'Thunder, nitrogen fixed for soil, and abrupt change.',
    },
  },
  {
    id: 'rainbow', name: 'Rainbow', category: 'phenomena', icon: 'rainbow',
    principle: 'Integration of diversity',
    description: 'Single white light revealed to contain every color in ordered array.',
    physicalExample: 'An arc after rain when sun meets falling water.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Apparent oneness can hold a hidden, ordered diversity.',
      structure: 'An arc of separated wavelengths, bent by water drops.',
      pattern: 'Light split into a fixed sequence of colors.',
      rhythm: 'Appearing only when sun and rain are rightly aligned.',
      events: 'Beauty, wonder, and a sign of light\u2019s hidden fullness.',
    },
  },
  {
    id: 'fire', name: 'Fire', category: 'phenomena', icon: 'fire',
    principle: 'Transformation',
    description: 'The rapid release that turns one form of matter and energy into another.',
    physicalExample: 'A flame; wildfire that clears and renews a forest.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Release of stored energy both destroys and renews.',
      structure: 'A self-sustaining reaction of fuel, heat, and air.',
      pattern: 'Consumption feeding the heat that consumes still more.',
      rhythm: 'Ignition, blaze, and burning down to ember.',
      events: 'Warmth, cooking, clearing, and the renewal of growth.',
    },
  },
  {
    id: 'waterPh', name: 'Water', category: 'phenomena', icon: 'waterPh',
    principle: 'Adaptability',
    description: 'A substance that takes any shape, yet wears down all that resists it.',
    physicalExample: 'Ice, liquid, vapor; water taking the shape of its vessel.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'True strength adapts its form while keeping its nature.',
      structure: 'A simple molecule able to be solid, liquid, or vapor.',
      pattern: 'Yielding to every container while dissolving and carrying much.',
      rhythm: 'Endless cycle of evaporation, rain, flow, and return.',
      events: 'Life, climate, erosion, and nourishment everywhere.',
    },
  },
  {
    id: 'wind', name: 'Wind', category: 'phenomena', icon: 'wind',
    principle: 'Invisible influence',
    description: 'An unseen force known only by what it moves, carries, and shapes.',
    physicalExample: 'Breezes that carry seed; gales that shape the dunes.',
    primaryLayer: 'Intelligent Order',
    mapping: {
      intelligentOrder: 'The unseen can be the most powerful mover of the seen.',
      structure: 'Air flowing from high pressure toward low.',
      pattern: 'Movement driven by differences seeking balance.',
      rhythm: 'Daily and seasonal patterns of prevailing winds.',
      events: 'Weather, pollination, seed dispersal, and erosion.',
    },
  },
];

// Convenience lookups
const STRUCTURE_BY_ID = Object.fromEntries(
  STRUCTURES.map((s) => [s.id, s]),
);

// ═══════════════════════════════════════════════════════════════
// UNIVERSAL STRUCTURES — Study & Application module
// Universal Structures module · Twelvefold Institute
// ───────────────────────────────────────────────────────────────
// Study the forms of creation; apply the order they reveal.
// Tabs: Overview · Explore · Mapping · Apply · Journal
//
// MOCKUP NOTE: progress + applications live in root React state so
// they survive tab navigation (artifact-safe — no localStorage).
// In the live build these persist to:
//   ac-usio-studied  ·  ac-usio-applications
// The "Carry to Aligned Action" handoff posts into the member's
// practice queue alongside Canon OS readings.
// ═══════════════════════════════════════════════════════════════

const ACCENT = {
  'Intelligent Order': '#E0B65C', Structure: '#9B8FC7', Pattern: '#7BA0C4', Rhythm: '#7FB39A', Events: '#D98C7A',
};
const FONT = {
  head: "'Fraunces', Georgia, serif", body: "'Spectral', Georgia, serif",
  sans: "'Hanken Grotesk', system-ui, sans-serif", mono: "'Space Mono', monospace",
};
const ICON_NAME = {
  circle:'Circle', sphere:'Globe', spiral:'Tornado', branching:'GitBranch', network:'Network',
  helix:'Spline', wave:'Waves', cycle:'RefreshCcw', symmetry:'Shapes', fractal:'Hexagon',
  galaxy:'Sparkles', solarSystem:'Atom', orbit:'Orbit', planet:'Globe', moon:'Moon', stars:'Star',
  mountains:'Mountain', rivers:'Waves', oceans:'Droplets', forests:'Trees', soil:'Sprout', seasons:'RefreshCcw',
  brain:'Brain', heartOrgan:'Heart', lungs:'Activity', skeleton:'Bone', bloodVessels:'Workflow',
  nervousSystem:'Network', dna:'Dna', skin:'Shield',
  roots:'Sprout', trunk:'TreePine', branchesPlant:'GitBranch', leaves:'Leaf', flowers:'Flower2',
  fruit:'Apple', seeds:'Cherry',
  wings:'Feather', honeycomb:'Hexagon', spiderWeb:'Workflow', antColony:'Bug', fishSchool:'Fish',
  birdMigration:'Bird',
  snowflake:'Snowflake', crystal:'Gem', lightning:'CloudLightning', rainbow:'Rainbow', fire:'Flame',
  waterPh:'Droplet', wind:'Wind',
};
const DOMAINS = ['Life', 'Leadership', 'Body', 'Family', 'Community'];
const LAYER_PROMPTS = {
  'Intelligent Order': 'What invisible wisdom does this reveal?',
  Structure: 'What form does it take?',
  Pattern: 'What relationship repeats?',
  Rhythm: 'How does it move through time?',
  Events: 'What outcomes does it produce?',
};

// Glyph map — replaces lucide-react (the rest of the site is icon-library-free).
// Keyed by the lucide names ICON_NAME already produces, so callers are unchanged.
const GLYPH = {
  Circle:'○', Globe:'◐', Tornado:'⧗', GitBranch:'⎇', Network:'⛓',
  Spline:'〰', Waves:'〰', RefreshCcw:'↻', Shapes:'◈', Hexagon:'⬢',
  Sparkles:'✳', Atom:'⚛', Orbit:'♁', Moon:'☽', Star:'★',
  Mountain:'⛰', Droplets:'∵', Trees:'⚘', Sprout:'↥', Brain:'⍟',
  Heart:'♥', Activity:'∿', Bone:'␢', Workflow:'⛓', Dna:'⧉',
  Shield:'⛨', TreePine:'⚘', Leaf:'⚘', Flower2:'⚘', Apple:'●',
  Cherry:'●', Feather:'✐', Bug:'⁂', Fish:'⧖', Bird:'⋀',
  Snowflake:'❄', Gem:'◈', CloudLightning:'⛈', Rainbow:'◜', Flame:'☲',
  Droplet:'∵', Wind:'↝',
};
function Icon({ name, size = 20, color, style }) {
  const g = (name && GLYPH[name]) || '○';
  return <span style={{ fontSize: size, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}>{g}</span>;
}
function StructIcon({ k, size = 24, color }) { return <Icon name={ICON_NAME[k]} size={size} color={color} />; }
const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || id;
const glass = { background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' };
function mono(extra) { return { fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dim)', ...extra }; }

function salvageJSON(raw) {
  if (!raw) return null;
  let t = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a === -1 || b === -1) return null;
  try { return JSON.parse(t.slice(a, b + 1)); } catch { return null; }
}
function fallbackApplication(s, domain) {
  return `Bring the principle of ${s.name.toLowerCase()} — ${s.principle.toLowerCase()} — into your ${domain.toLowerCase()} this week. Choose one concrete place where this should change how you act, and take a single visible step there.`;
}

// ── Shared bits ───────────────────────────────────────────────
function Heading({ eyebrow, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      <p style={mono({ letterSpacing: '2.5px' })}>{eyebrow}</p>
      <h2 style={{ fontFamily: FONT.head, fontSize: 'clamp(22px,3.4vw,32px)', fontWeight: 500, color: 'var(--text)', margin: '8px 0 0' }}>{title}</h2>
      {sub && <p style={{ fontFamily: FONT.body, fontSize: '15px', color: 'var(--muted)', maxWidth: '620px', margin: '10px auto 0', lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}
function GhostBtn({ children, onClick, color = '#9B8FC7', style }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '9px 16px', borderRadius: '9px', border: `1px solid ${h ? color : 'var(--border)'}`, background: h ? color + '14' : 'transparent', color: h ? color : 'var(--muted)', fontFamily: FONT.sans, fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s ease', ...style }}>
      {children}
    </button>
  );
}
function GoldBtn({ children, onClick, disabled, style }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '10px', border: 'none', background: disabled ? 'rgba(224,182,92,0.3)' : h ? '#EAC274' : '#E0B65C', color: '#1A150A', fontFamily: FONT.sans, fontSize: '13.5px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'all 0.2s ease', boxShadow: disabled ? 'none' : '0 2px 12px rgba(224,182,92,0.18)', ...style }}>
      {children}
    </button>
  );
}

// ── Framework flow ────────────────────────────────────────────
function FrameworkFlow() {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {FRAMEWORK_LAYERS.map((l, i) => (
        <div key={l.id} style={{ ...glass, flex: '1 1 180px', borderRadius: '16px', borderColor: ACCENT[l.id] + '55', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: ACCENT[l.id] }} />
            <span style={mono()}>Layer {i + 1}</span>
          </div>
          <h3 style={{ fontFamily: FONT.head, fontSize: '18px', fontWeight: 500, color: ACCENT[l.id], margin: 0 }}>{l.id}</h3>
          <p style={{ fontFamily: FONT.body, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, margin: '6px 0 0' }}>{l.short}</p>
        </div>
      ))}
    </div>
  );
}

// ── Structure card ────────────────────────────────────────────
function Card({ s, onOpen, studied }) {
  const [h, setH] = useState(false);
  const a = ACCENT[s.primaryLayer];
  return (
    <button onClick={() => onOpen(s)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...glass, textAlign: 'left', display: 'flex', flexDirection: 'column', borderRadius: '16px', borderColor: h ? a + '66' : 'var(--border)', padding: '18px', cursor: 'pointer', transition: 'all 0.25s ease', transform: h ? 'translateY(-4px)' : 'none', boxShadow: h ? `0 12px 40px ${a}22` : 'none', position: 'relative' }}>
      {studied && <span title="Studied" style={{ position: 'absolute', top: '14px', right: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', ...mono({ color: ACCENT.Rhythm, fontSize: '9px' }) }}><Icon name="Check" size={12} color={ACCENT.Rhythm} /></span>}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: a + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${a}44` }}>
          <StructIcon k={s.icon} size={23} color={a} />
        </div>
      </div>
      <h3 style={{ fontFamily: FONT.head, fontSize: '16px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>{s.name}</h3>
      <p style={{ fontFamily: FONT.sans, fontSize: '11.5px', color: a, margin: '2px 0 0' }}>{s.principle}</p>
      <p style={{ fontFamily: FONT.body, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, margin: '10px 0 0', flex: 1 }}>{s.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '10px' }}>
        <span style={mono()}>{catLabel(s.category)}</span>
        <span style={{ ...mono({ color: a }), display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: a }} />{s.primaryLayer}
        </span>
      </div>
    </button>
  );
}

// ── Detail modal ──────────────────────────────────────────────
function Modal({ s, onClose, studied, onToggleStudied, onApply }) {
  useEffect(() => {
    if (!s) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [s, onClose]);
  if (!s) return null;
  const a = ACCENT[s.primaryLayer];
  const rows = [
    ['Intelligent Order', s.mapping.intelligentOrder], ['Structure', s.mapping.structure],
    ['Pattern', s.mapping.pattern], ['Rhythm', s.mapping.rhythm], ['Events', s.mapping.events],
  ];
  const isStudied = studied.has(s.id);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...glass, width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '22px' }}>
        <div style={{ position: 'relative', borderBottom: '1px solid var(--border)', padding: '24px' }}>
          <button onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="X" size={20} color="var(--muted)" /></button>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: a + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${a}44`, flexShrink: 0 }}>
              <StructIcon k={s.icon} size={28} color={a} />
            </div>
            <div>
              <span style={mono()}>{catLabel(s.category)}</span>
              <h2 style={{ fontFamily: FONT.head, fontSize: '24px', fontWeight: 500, color: 'var(--text)', margin: '2px 0' }}>{s.name}</h2>
              <p style={{ fontFamily: FONT.sans, fontSize: '13px', color: a, margin: 0 }}>{s.principle}</p>
            </div>
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, margin: '16px 0 0' }}>{s.description}</p>
          <div style={{ marginTop: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--chip)', padding: '12px 16px' }}>
            <span style={mono()}>In creation</span>
            <p style={{ fontFamily: FONT.body, fontSize: '14px', color: 'var(--text)', margin: '4px 0 0' }}>{s.physicalExample}</p>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={mono({ letterSpacing: '2px', marginBottom: '16px' })}>Cosmic Reality Framework mapping</p>
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            <span style={{ position: 'absolute', left: '9px', top: '8px', bottom: '8px', width: '1.5px', background: `linear-gradient(180deg, ${ACCENT['Intelligent Order']}, ${ACCENT.Pattern}, ${ACCENT.Events})`, opacity: 0.5 }} />
            {rows.map(([layer, val]) => (
              <div key={layer} style={{ position: 'relative', marginBottom: '10px' }}>
                <span style={{ position: 'absolute', left: '-26px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: ACCENT[layer], boxShadow: '0 0 0 4px var(--ring)' }} />
                <div style={{ borderRadius: '12px', border: `1px solid ${ACCENT[layer]}44`, background: ACCENT[layer] + '12', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: FONT.head, fontSize: '14px', fontWeight: 500, color: ACCENT[layer] }}>{layer}</span>
                    <span style={{ fontFamily: FONT.body, fontSize: '11px', fontStyle: 'italic', color: 'var(--dim)' }}>{LAYER_PROMPTS[layer]}</span>
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: '14px', color: 'var(--text)', lineHeight: 1.5, margin: '4px 0 0' }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', borderRadius: '16px', border: `1px solid ${ACCENT['Intelligent Order']}4D`, background: ACCENT['Intelligent Order'] + '10', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icon name="Sparkles" size={16} color={ACCENT['Intelligent Order']} />
              <span style={mono({ color: ACCENT['Intelligent Order'], letterSpacing: '2px' })}>Reflection</span>
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: '16px', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              How can this principle be applied to your life, leadership, body, family, or community?
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
            <GoldBtn onClick={() => onApply(s)}><Icon name="PenLine" size={15} color="#1A150A" /> Apply this principle</GoldBtn>
            <GhostBtn color={ACCENT.Rhythm} onClick={() => onToggleStudied(s.id)}>
              {isStudied ? '✓ Studied' : 'Mark as studied'}
            </GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Interactive mapping panel ─────────────────────────────────
function MappingPanel() {
  const [id, setId] = useState('roots');
  const s = STRUCTURE_BY_ID[id];
  const a = ACCENT[s.primaryLayer];
  const rows = [
    ['Intelligent Order', s.mapping.intelligentOrder], ['Structure', s.mapping.structure],
    ['Pattern', s.mapping.pattern], ['Rhythm', s.mapping.rhythm], ['Events', s.mapping.events],
  ];
  return (
    <div>
      <Heading eyebrow="Interactive Mapping" title="Read One Form Across the Five Layers"
        sub="Choose any structure and trace how a single principle descends from invisible order to visible outcome." />
      <div style={{ ...glass, borderRadius: '22px', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: a + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${a}44` }}>
              <StructIcon k={s.icon} size={24} color={a} />
            </div>
            <div>
              <h3 style={{ fontFamily: FONT.head, fontSize: '19px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>{s.name}</h3>
              <p style={{ fontFamily: FONT.sans, fontSize: '12px', color: a, margin: 0 }}>{s.principle}</p>
            </div>
          </div>
          <select value={id} onChange={(e) => setId(e.target.value)}
            style={{ minWidth: '220px', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--selbg)', color: 'var(--text)', fontFamily: FONT.sans, fontSize: '14px', cursor: 'pointer' }}>
            {STRUCTURES.map((o) => <option key={o.id} value={o.id} style={{ background: 'var(--selbg)', color: 'var(--text)' }}>{o.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(([layer, val]) => (
            <div key={layer} style={{ borderRadius: '14px', border: `1px solid ${ACCENT[layer]}44`, background: ACCENT[layer] + '12', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT[layer] }} />
                <span style={{ fontFamily: FONT.head, fontSize: '14px', fontWeight: 500, color: ACCENT[layer] }}>{layer}</span>
              </div>
              <p style={{ fontFamily: FONT.body, fontSize: '15px', color: 'var(--text)', lineHeight: 1.5, margin: '8px 0 0' }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Apply workspace ───────────────────────────────────────────
function ApplyPanel({ applyId, setApplyId, addApplication, showToast, goJournal }) {
  const [id, setId] = useState(applyId || 'roots');
  const [domain, setDomain] = useState('Life');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { if (applyId) { setId(applyId); setText(''); } }, [applyId]);
  const s = STRUCTURE_BY_ID[id];
  const a = ACCENT[s.primaryLayer];

  async function draw() {
    setBusy(true); setErr('');
    const prompt = `You help a student of the Cosmic Reality Framework apply a structural principle to real life.
Structure: ${s.name} — principle: ${s.principle}.
Its intelligent order: ${s.mapping.intelligentOrder}
Its pattern: ${s.mapping.pattern}
The student is applying it to the domain of ${domain}.
Propose one concrete Recommended Participation: a specific, grounded action or practice they can take in their ${domain.toLowerCase()} in the coming week, true to the principle. Keep it to 1-2 sentences, practical and non-mystical — no references to the universe, manifesting, fate, or the divine.
Respond ONLY with minified JSON, no preamble: {"application":"..."}`;
    try {
      // Routed through the server proxy — the API key never reaches the
      // browser. /api/org-diagnostic returns parsed JSON directly.
      const res = await fetch('/api/org-diagnostic', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('API ' + res.status);
      const parsed = await res.json();
      if (!parsed || !parsed.application) throw new Error('parse');
      setText(parsed.application);
    } catch (e) {
      setErr('Live suggestion unavailable — drafted a starting point you can edit.');
      setText(fallbackApplication(s, domain));
    } finally { setBusy(false); }
  }

  function save() {
    if (!text.trim()) return;
    addApplication({ id: Date.now(), ts: new Date().toISOString(), structureId: s.id, structureName: s.name, principle: s.principle, domain, text: text.trim() });
    showToast('✦ Application saved to your Journal.');
    setText('');
  }

  return (
    <div>
      <Heading eyebrow="Apply" title="From Principle to Aligned Action"
        sub="Take a structure's principle and translate it into one concrete practice in a chosen domain of your life." />

      <div style={{ ...glass, borderRadius: '22px', padding: '24px' }}>
        {/* structure picker */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: a + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${a}44` }}>
            <StructIcon k={s.icon} size={24} color={a} />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <select value={id} onChange={(e) => { setApplyId(null); setId(e.target.value); }}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '11px', border: '1px solid var(--border)', background: 'var(--selbg)', color: 'var(--text)', fontFamily: FONT.sans, fontSize: '14px', cursor: 'pointer' }}>
              {STRUCTURES.map((o) => <option key={o.id} value={o.id} style={{ background: 'var(--selbg)' }}>{o.name} — {o.principle}</option>)}
            </select>
          </div>
        </div>

        {/* principle anchor */}
        <div style={{ borderRadius: '12px', border: `1px solid ${a}33`, background: a + '0E', padding: '14px 16px', marginBottom: '18px' }}>
          <span style={mono({ color: a })}>The principle · {s.primaryLayer}</span>
          <p style={{ fontFamily: FONT.head, fontSize: '16px', color: 'var(--text)', margin: '6px 0 0', lineHeight: 1.45 }}>{s.mapping.intelligentOrder}</p>
        </div>

        {/* domain */}
        <div style={{ ...mono({ marginBottom: '8px' }) }}>Apply to which domain?</div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {DOMAINS.map((d) => {
            const on = domain === d;
            return <button key={d} onClick={() => setDomain(d)} style={{ padding: '8px 15px', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${on ? ACCENT.Rhythm : 'var(--border)'}`, background: on ? ACCENT.Rhythm + '1A' : 'var(--chip)', color: on ? ACCENT.Rhythm : 'var(--muted)', fontFamily: FONT.sans, fontSize: '12.5px', fontWeight: on ? 600 : 500 }}>{d}</button>;
          })}
        </div>

        {/* application text */}
        <div style={{ ...mono({ marginBottom: '8px' }) }}>Your Recommended Participation</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
          placeholder={`How does "${s.principle.toLowerCase()}" change one concrete thing in your ${domain.toLowerCase()} this week?`}
          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: '11px', border: '1px solid var(--border)', background: 'var(--chip)', color: 'var(--text)', fontFamily: FONT.body, fontSize: '15px', lineHeight: 1.55, outline: 'none', resize: 'vertical' }} />
        {err && <p style={{ fontFamily: FONT.sans, fontSize: '12px', color: ACCENT.Events, margin: '8px 0 0' }}>{err}</p>}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
          <GoldBtn onClick={save} disabled={!text.trim()}><Icon name="Check" size={15} color="#1A150A" /> Save to Journal</GoldBtn>
          <GhostBtn color={ACCENT['Intelligent Order']} onClick={draw} style={{ opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Drawing out…' : '✦ Draw out an application'}
          </GhostBtn>
          <GhostBtn onClick={goJournal}>View Journal →</GhostBtn>
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: '12px', fontStyle: 'italic', color: 'var(--dim)', margin: '14px 0 0' }}>
          The principle is the curriculum. Aligned action is doing what it asks, in real circumstances, while remaining yourself.
        </p>
      </div>
    </div>
  );
}

// ── Journal ───────────────────────────────────────────────────
function JournalPanel({ applications, removeApplication, studiedCount, goExplore, goApply }) {
  const domainCounts = {};
  DOMAINS.forEach((d) => (domainCounts[d] = 0));
  applications.forEach((ap) => { domainCounts[ap.domain] = (domainCounts[ap.domain] || 0) + 1; });
  const maxD = Math.max(1, ...Object.values(domainCounts));

  return (
    <div>
      <Heading eyebrow="Journal" title="Your Study & Practice"
        sub="A record of what you have studied and the principles you have put into practice." />

      {/* progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div style={{ ...glass, borderRadius: '16px', padding: '18px' }}>
          <span style={mono()}>Structures studied</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontFamily: FONT.head, fontSize: '30px', color: ACCENT.Rhythm }}>{studiedCount}</span>
            <span style={{ fontFamily: FONT.sans, fontSize: '13px', color: 'var(--dim)' }}>/ {STRUCTURES.length}</span>
          </div>
          <div style={{ height: '7px', borderRadius: '4px', background: 'var(--chip)', overflow: 'hidden', marginTop: '10px' }}>
            <div style={{ height: '100%', width: `${(studiedCount / STRUCTURES.length) * 100}%`, background: ACCENT.Rhythm, opacity: 0.85, transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <div style={{ ...glass, borderRadius: '16px', padding: '18px' }}>
          <span style={mono()}>Applications</span>
          <div style={{ fontFamily: FONT.head, fontSize: '30px', color: ACCENT['Intelligent Order'], marginTop: '6px' }}>{applications.length}</div>
          <p style={{ fontFamily: FONT.body, fontSize: '12.5px', color: 'var(--dim)', margin: '6px 0 0' }}>principles put into practice</p>
        </div>
        <div style={{ ...glass, borderRadius: '16px', padding: '18px' }}>
          <span style={mono()}>By domain</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
            {DOMAINS.map((d) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: FONT.sans, fontSize: '11px', color: 'var(--muted)', width: '74px' }}>{d}</span>
                <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--chip)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(domainCounts[d] / maxD) * 100}%`, background: ACCENT.Structure, opacity: 0.8 }} />
                </div>
                <span style={{ fontFamily: FONT.mono, fontSize: '10px', color: 'var(--dim)', width: '16px', textAlign: 'right' }}>{domainCounts[d]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div style={{ ...glass, borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
          <Icon name="NotebookPen" size={30} color="var(--dim)" />
          <p style={{ fontFamily: FONT.body, fontSize: '16px', color: 'var(--muted)', margin: '12px 0 18px' }}>No applications yet. Study a structure, then translate its principle into a practice.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldBtn onClick={goExplore}>Explore structures</GoldBtn>
            <GhostBtn onClick={goApply}>Go to Apply →</GhostBtn>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...applications].reverse().map((ap) => {
            const s = STRUCTURE_BY_ID[ap.structureId];
            const a = s ? ACCENT[s.primaryLayer] : ACCENT.Structure;
            return (
              <div key={ap.id} style={{ ...glass, borderRadius: '16px', padding: '18px 20px', borderLeft: `3px solid ${a}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {s && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><StructIcon k={s.icon} size={16} color={a} /><span style={{ fontFamily: FONT.head, fontSize: '15px', color: 'var(--text)' }}>{ap.structureName}</span></span>}
                  <span style={{ padding: '2px 10px', borderRadius: '999px', background: ACCENT.Rhythm + '1A', border: `1px solid ${ACCENT.Rhythm}33`, ...mono({ color: ACCENT.Rhythm, fontSize: '9.5px' }) }}>{ap.domain}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: '10px', color: 'var(--dim)', marginLeft: 'auto' }}>{fmt(ap.ts)}</span>
                </div>
                <p style={{ fontFamily: FONT.body, fontSize: '14.5px', color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>{ap.text}</p>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <GhostBtn color={ACCENT.Events} onClick={() => removeApplication(ap.id)} style={{ padding: '5px 11px', fontSize: '11.5px' }}>Delete</GhostBtn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────
function Overview({ goExplore, goApply, onOpen, studiedCount, appsCount }) {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const pod = STRUCTURES[day % STRUCTURES.length];
  const a = ACCENT[pod.primaryLayer];
  return (
    <div>
      {/* banner */}
      <div style={{ ...glass, borderRadius: '22px', padding: '32px', position: 'relative', overflow: 'hidden', marginBottom: '28px', borderColor: ACCENT['Intelligent Order'] + '2A' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT['Intelligent Order']}22, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '640px' }}>
          <p style={mono({ color: ACCENT['Intelligent Order'], letterSpacing: '2px' })}>The Study</p>
          <h2 style={{ fontFamily: FONT.head, fontSize: 'clamp(24px,3.6vw,34px)', fontWeight: 500, color: 'var(--text)', margin: '8px 0 0', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
            Creation is a living library of <span style={{ color: ACCENT['Intelligent Order'] }}>Intelligent Order</span>.
          </h2>
          <p style={{ fontFamily: FONT.body, fontSize: '16px', color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.55 }}>
            Study the forms of creation, read the principle each one reveals, and translate that principle into aligned action in your own life.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '22px' }}>
            <GoldBtn onClick={goExplore}>Explore structures <Icon name="ArrowRight" size={15} color="#1A150A" /></GoldBtn>
            <GhostBtn onClick={goApply}>Apply a principle →</GhostBtn>
          </div>
        </div>
      </div>

      {/* progress strip */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <div style={{ ...glass, flex: '1 1 160px', borderRadius: '14px', padding: '16px' }}>
          <span style={mono()}>Studied</span>
          <div style={{ fontFamily: FONT.head, fontSize: '24px', color: ACCENT.Rhythm, marginTop: '4px' }}>{studiedCount}<span style={{ fontSize: '14px', color: 'var(--dim)' }}> / {STRUCTURES.length}</span></div>
        </div>
        <div style={{ ...glass, flex: '1 1 160px', borderRadius: '14px', padding: '16px' }}>
          <span style={mono()}>Applications</span>
          <div style={{ fontFamily: FONT.head, fontSize: '24px', color: ACCENT['Intelligent Order'], marginTop: '4px' }}>{appsCount}</div>
        </div>
        <div style={{ ...glass, flex: '1 1 160px', borderRadius: '14px', padding: '16px' }}>
          <span style={mono()}>Structures</span>
          <div style={{ fontFamily: FONT.head, fontSize: '24px', color: ACCENT.Structure, marginTop: '4px' }}>{STRUCTURES.length}</div>
        </div>
      </div>

      {/* principle of the day */}
      <Heading eyebrow="Today" title="Principle of the Day" />
      <button onClick={() => onOpen(pod)} style={{ ...glass, width: '100%', textAlign: 'left', borderRadius: '18px', padding: '22px', cursor: 'pointer', borderColor: a + '40', marginBottom: '36px', display: 'flex', gap: '18px', alignItems: 'center' }}>
        <div style={{ width: '58px', height: '58px', flexShrink: 0, borderRadius: '14px', background: a + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${a}44` }}>
          <StructIcon k={pod.icon} size={28} color={a} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: FONT.head, fontSize: '20px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>{pod.name}</h3>
            <span style={mono({ color: a })}>{pod.primaryLayer}</span>
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: '15px', color: 'var(--muted)', margin: '6px 0 0', lineHeight: 1.5 }}>{pod.mapping.intelligentOrder}</p>
          <span style={{ fontFamily: FONT.sans, fontSize: '12px', color: a, marginTop: '8px', display: 'inline-block' }}>Open and apply →</span>
        </div>
      </button>

      {/* framework */}
      <Heading eyebrow="The Framework" title="Five Layers of Reality"
        sub="Every structure can be read downward — from the events you see, to the invisible order that produced them." />
      <FrameworkFlow />
    </div>
  );
}

const fmt = (ts) => { try { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch { return ''; } };

// ═══ ROOT MODULE ══════════════════════════════════════════════
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'Compass' },
  { id: 'explore', label: 'Explore', icon: 'LayoutGrid' },
  { id: 'mapping', label: 'Mapping', icon: 'Workflow' },
  { id: 'apply', label: 'Apply', icon: 'PenLine' },
  { id: 'journal', label: 'Journal', icon: 'NotebookPen' },
];

export default function UniversalStructures() {
  // persistence effects added below
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState('overview');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [studied, setStudied] = useState(() => {
    try { const v = typeof window !== 'undefined' && localStorage.getItem('tfi-usio-studied'); return v ? new Set(JSON.parse(v)) : new Set(); } catch { return new Set(); }
  });
  const [applications, setApplications] = useState(() => {
    try { const v = typeof window !== 'undefined' && localStorage.getItem('tfi-usio-applications'); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [applyId, setApplyId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Persist progress to localStorage so it survives refresh and returns.
  useEffect(() => {
    try { localStorage.setItem('tfi-usio-studied', JSON.stringify([...studied])); } catch {}
  }, [studied]);
  useEffect(() => {
    try { localStorage.setItem('tfi-usio-applications', JSON.stringify(applications)); } catch {}
  }, [applications]);

  useEffect(() => {
    const id = 'usio-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link'); link.id = id; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Spectral:ital,wght@0,400;0,500;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const showToast = (m) => { setToast(m); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2600); };
  const toggleStudied = (id) => setStudied((set) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addApplication = (a) => setApplications((xs) => [...xs, a]);
  const removeApplication = (id) => setApplications((xs) => xs.filter((x) => x.id !== id));
  const openApply = (s) => { setApplyId(s.id); setSelected(null); setTab('apply'); };

  const q = query.trim().toLowerCase();
  const match = (s) => !q || [s.name, s.principle, s.description, s.category, s.primaryLayer, catLabel(s.category)].some((v) => v.toLowerCase().includes(q));
  const counts = useMemo(() => { const c = { all: 0 }; CATEGORIES.forEach((cat) => (c[cat.id] = 0)); STRUCTURES.forEach((s) => { if (match(s)) { c.all += 1; c[s.category] += 1; } }); return c; }, [q]);
  const filtered = useMemo(() => STRUCTURES.filter((s) => (category === 'all' || s.category === category) && match(s)), [category, q]);
  const tabs = [{ id: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];

  const vars = dark
    ? { '--bg': 'radial-gradient(1100px 600px at 78% -8%, rgba(155,143,199,0.16), transparent 60%), radial-gradient(900px 500px at 12% 4%, rgba(224,182,92,0.07), transparent 60%), #0B0A12',
        '--text': '#ECE7DD', '--muted': '#9C968B', '--dim': '#615C54',
        '--card': 'linear-gradient(180deg, rgba(236,231,221,0.045), rgba(236,231,221,0.015))',
        '--border': 'rgba(236,231,221,0.09)', '--chip': 'rgba(236,231,221,0.05)',
        '--nav': 'rgba(11,10,18,0.75)', '--ring': '#0B0A12', '--selbg': '#14121E' }
    : { '--bg': 'radial-gradient(1100px 600px at 78% -8%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(900px 500px at 12% 4%, rgba(224,182,92,0.12), transparent 60%), #F6F3EC',
        '--text': '#2A2622', '--muted': '#6B6459', '--dim': '#9A9388',
        '--card': 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.42))',
        '--border': 'rgba(40,30,60,0.10)', '--chip': 'rgba(255,255,255,0.55)',
        '--nav': 'rgba(246,243,236,0.82)', '--ring': '#EFEAE0', '--selbg': '#FFFFFF' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: FONT.sans, ...vars }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>

        {/* module header */}
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={mono({ letterSpacing: '2px' })}>Attuned Community · Module</span>
            <button onClick={() => setDark((d) => !d)} aria-label="Toggle theme" style={{ border: '1px solid var(--border)', background: 'var(--chip)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
              <Icon name={dark ? 'Sun' : 'Moon'} size={16} color="var(--muted)" />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: ACCENT['Intelligent Order'] + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${ACCENT['Intelligent Order']}44` }}>
                <Icon name="Telescope" size={23} color={ACCENT['Intelligent Order']} />
              </div>
              <div>
                <h1 style={{ fontFamily: FONT.head, fontSize: '28px', fontWeight: 500, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Universal Structures</h1>
                <p style={{ fontFamily: FONT.body, fontSize: '14.5px', color: 'var(--muted)', margin: '2px 0 0' }}>Study the forms of creation. Apply the order they reveal.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', border: `1px solid ${ACCENT.Rhythm}33`, background: ACCENT.Rhythm + '12', ...mono({ color: ACCENT.Rhythm }) }}>
                <Icon name="Check" size={12} color={ACCENT.Rhythm} /> {studied.size}/{STRUCTURES.length} studied
              </span>
              <span style={{ padding: '5px 12px', borderRadius: '999px', border: `1px solid ${ACCENT.Structure}33`, background: ACCENT.Structure + '12', ...mono({ color: ACCENT.Structure }) }}>Reader+</span>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {NAV.map((n) => {
            const on = tab === n.id;
            const badge = n.id === 'journal' && applications.length > 0;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px', cursor: 'pointer', border: `1px solid ${on ? ACCENT['Intelligent Order'] + '59' : 'var(--border)'}`, background: on ? ACCENT['Intelligent Order'] + '1A' : 'transparent', color: on ? ACCENT['Intelligent Order'] : 'var(--muted)', fontFamily: FONT.sans, fontSize: '13px', fontWeight: on ? 600 : 500 }}>
                <Icon name={n.icon} size={15} color={on ? ACCENT['Intelligent Order'] : 'var(--muted)'} />{n.label}
                {badge && <span style={{ fontFamily: FONT.mono, fontSize: '10px', color: ACCENT['Intelligent Order'], background: ACCENT['Intelligent Order'] + '26', borderRadius: '999px', padding: '1px 7px' }}>{applications.length}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: '80px' }}>
          {tab === 'overview' && <Overview goExplore={() => setTab('explore')} goApply={() => setTab('apply')} onOpen={setSelected} studiedCount={studied.size} appsCount={applications.length} />}

          {tab === 'explore' && (
            <div>
              <Heading eyebrow="Explore" title="The Structures of Creation"
                sub={`Filter by category or search across ${STRUCTURES.length} structures. Open any one to study the principle it reveals and apply it.`} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}><Icon name="Search" size={16} color="var(--dim)" /></span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, principle, category, or layer…"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 40px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--chip)', color: 'var(--text)', fontFamily: FONT.sans, fontSize: '14px', outline: 'none' }} />
                  {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="X" size={16} color="var(--dim)" /></button>}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '30px' }}>
                {tabs.map((t) => {
                  const on = category === t.id;
                  return (
                    <button key={t.id} onClick={() => setCategory(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${on ? ACCENT['Intelligent Order'] + '66' : 'var(--border)'}`, background: on ? ACCENT['Intelligent Order'] + '1A' : 'var(--chip)', color: on ? ACCENT['Intelligent Order'] : 'var(--muted)', fontFamily: FONT.sans, fontSize: '12.5px', fontWeight: 500 }}>
                      {t.label}
                      <span style={{ fontFamily: FONT.mono, fontSize: '10px', borderRadius: '999px', padding: '1px 7px', background: on ? ACCENT['Intelligent Order'] + '33' : 'var(--chip)', color: on ? ACCENT['Intelligent Order'] : 'var(--dim)' }}>{counts[t.id] || 0}</span>
                    </button>
                  );
                })}
              </div>
              {filtered.length === 0 ? (
                <div style={{ ...glass, borderRadius: '16px', padding: '52px 24px', textAlign: 'center' }}>
                  <Icon name="SearchX" size={28} color="var(--dim)" />
                  <p style={{ fontFamily: FONT.body, fontSize: '16px', color: 'var(--muted)', marginTop: '12px' }}>No structures match your search.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))', gap: '16px' }}>
                  {filtered.map((s) => <Card key={s.id} s={s} onOpen={setSelected} studied={studied.has(s.id)} />)}
                </div>
              )}
            </div>
          )}

          {tab === 'mapping' && <MappingPanel />}
          {tab === 'apply' && <ApplyPanel applyId={applyId} setApplyId={setApplyId} addApplication={addApplication} showToast={showToast} goJournal={() => setTab('journal')} />}
          {tab === 'journal' && <JournalPanel applications={applications} removeApplication={removeApplication} studiedCount={studied.size} goExplore={() => setTab('explore')} goApply={() => setTab('apply')} />}
        </div>
      </div>

      <Modal s={selected} onClose={() => setSelected(null)} studied={studied} onToggleStudied={toggleStudied} onApply={openApply} />

      {toast && <div style={{ position: 'fixed', bottom: '26px', left: '50%', transform: 'translateX(-50%)', padding: '12px 22px', borderRadius: '11px', background: 'rgba(20,18,30,0.96)', border: `1px solid ${ACCENT['Intelligent Order']}44`, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', fontFamily: FONT.sans, fontSize: '13.5px', color: '#ECE7DD', zIndex: 70, backdropFilter: 'blur(12px)' }}>{toast}</div>}
    </div>
  );
}
