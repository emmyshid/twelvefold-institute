"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ── Local data (60 structures · five-layer mappings) ──
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

  {
    id: 'goldenRatio', name: 'Golden Ratio', category: 'universal', icon: 'goldenRatio',
    principle: 'Proportion that grows in harmony',
    description: 'A single ratio (about 1.618) that lets a thing grow larger while keeping the same balanced form.',
    physicalExample: 'Nautilus shells, sunflower seed heads, pinecones, spiral galaxies.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Growth can enlarge a thing without distorting what it is.',
      structure: 'Each part relates to the whole as the whole relates to the larger.',
      pattern: 'The same proportion repeated at every scale of growth.',
      rhythm: 'Increase that adds without ever needing to start over.',
      events: 'Forms that feel balanced, efficient, and quietly beautiful.',
    },
  },
  {
    id: 'tessellation', name: 'Tessellation', category: 'universal', icon: 'tessellation',
    principle: 'Filling space without gaps',
    description: 'Shapes repeated edge to edge to cover a whole surface, leaving nothing wasted.',
    physicalExample: 'Honeycomb, turtle shells, cracked mud, basalt columns, scales.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'A whole can be filled completely by faithful repetition of a part.',
      structure: 'Identical units meeting edge to edge with no overlap or gap.',
      pattern: 'One shape repeated to tile an entire surface.',
      rhythm: 'Built outward, unit by unit, until the field is whole.',
      events: 'Strength, economy, and complete coverage from simple parts.',
    },
  },
  {
    id: 'vortex', name: 'Vortex', category: 'universal', icon: 'vortex',
    principle: 'Energy gathered toward a center',
    description: 'A spinning flow that draws everything inward and concentrates its force at the core.',
    physicalExample: 'Whirlpools, tornadoes, draining water, hurricanes, galaxies.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'Scattered energy becomes powerful when it turns around one center.',
      structure: 'A spiral flow narrowing toward a still, central axis.',
      pattern: 'Rotation that pulls the surrounding inward as it turns.',
      rhythm: 'Self-sustaining spin, fed by what it draws in.',
      events: 'Concentrated force, movement, and rapid transport.',
    },
  },
  {
    id: 'torus', name: 'Torus', category: 'universal', icon: 'torus',
    principle: 'Self-returning circulation',
    description: 'A ring-shaped flow that pours out at the top, wraps around, and feeds back into itself.',
    physicalExample: 'Smoke rings, magnetic fields, apples, whirlpools, the heart\u2019s field.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'What circulates back to its source can sustain itself.',
      structure: 'A doughnut form whose flow loops continuously through the center.',
      pattern: 'Output returning to become input, around and through.',
      rhythm: 'Endless circulation with no true beginning or end.',
      events: 'Stable fields, self-renewal, and balanced exchange.',
    },
  },
  {
    id: 'catenary', name: 'Catenary & Arch', category: 'universal', icon: 'catenary',
    principle: 'Strength found in the curve',
    description: 'The natural curve a chain makes when it hangs — and, inverted, the strongest way to stand.',
    physicalExample: 'Hanging chains, spider silk, eggshells, arches, suspension bridges.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'There is a shape that carries weight with the least strain.',
      structure: 'A curve that channels load smoothly along its whole length.',
      pattern: 'Tension and compression distributed evenly, never concentrated.',
      rhythm: 'A form that holds steady under continuous load.',
      events: 'Bridges, domes, and shells that stand far beyond their weight.',
    },
  },
  {
    id: 'gradient', name: 'Gradient', category: 'universal', icon: 'gradient',
    principle: 'Order expressed as transition',
    description: 'A smooth grading from one state to another that drives flow and makes exchange possible.',
    physicalExample: 'Atmospheres, ocean depths, temperature, color, dawn and dusk.',
    primaryLayer: 'Pattern',
    mapping: {
      intelligentOrder: 'Difference, gently graded, is what sets everything in motion.',
      structure: 'A graded slope between two unlike states.',
      pattern: 'Continuous change rather than an abrupt edge.',
      rhythm: 'Flow that moves steadily from more toward less.',
      events: 'Wind, current, diffusion, and the meeting of habitats.',
    },
  },
  {
    id: 'foam', name: 'Foam', category: 'universal', icon: 'foam',
    principle: 'Partition with the least material',
    description: 'Many cells packed together, sharing walls in the most economical possible arrangement.',
    physicalExample: 'Soap foam, living tissue, bone interiors, basalt, bubble clusters.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Many can be held apart and together with the least between them.',
      structure: 'Cells meeting along shared walls of minimal surface.',
      pattern: 'Walls that settle into the most efficient possible junctions.',
      rhythm: 'Cells rearranging until tension is balanced everywhere.',
      events: 'Lightness, insulation, and strength for very little material.',
    },
  },
  {
    id: 'threshold', name: 'Threshold', category: 'universal', icon: 'threshold',
    principle: 'The point where one state becomes another',
    description: 'A critical line at which gradual change tips suddenly into a wholly new state.',
    physicalExample: 'Freezing and boiling, ice to water, dawn, a seed sprouting, tipping points.',
    primaryLayer: 'Events',
    mapping: {
      intelligentOrder: 'Slow change accumulates until a single point transforms everything.',
      structure: 'A boundary between two stable states of a system.',
      pattern: 'Pressure building quietly until a sudden reordering.',
      rhythm: 'Long approach, then an abrupt crossing.',
      events: 'Phase changes, breakthroughs, and irreversible turns.',
    },
  },
  {
    id: 'feedbackLoop', name: 'Feedback Loop', category: 'universal', icon: 'feedbackLoop',
    principle: 'Self-regulation through return',
    description: 'A circle of cause and effect in which the output of a system bends back to steer it.',
    physicalExample: 'Body temperature, predator and prey, thermostats, hormones, climate.',
    primaryLayer: 'Rhythm',
    mapping: {
      intelligentOrder: 'A system can govern itself when its results inform its next move.',
      structure: 'A loop where effect returns to adjust its own cause.',
      pattern: 'Correction that pulls a wandering system back toward balance.',
      rhythm: 'Continuous sensing and adjusting over time.',
      events: 'Stability, homeostasis, and resilience to disturbance.',
    },
  },
  {
    id: 'lattice', name: 'Lattice', category: 'universal', icon: 'lattice',
    principle: 'A framework that distributes order',
    description: 'A regular network of nodes and links that spreads load and order evenly across a whole.',
    physicalExample: 'Crystal lattices, scaffolding, graphene, leaf veins, trusses.',
    primaryLayer: 'Structure',
    mapping: {
      intelligentOrder: 'Order held in a repeating framework can bear far more than its parts.',
      structure: 'Nodes joined by links in a regular, repeating grid.',
      pattern: 'The same connective unit repeated through space.',
      rhythm: 'Built up unit by unit, sharing every load it meets.',
      events: 'Rigidity, lightness, and strength spread across the whole.',
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
// Universal Structures module v4 · Twelvefold Institute
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
  'Intelligent Order': '#FBBF24', Structure: '#9B8FC7', Pattern: '#7BA0C4', Rhythm: '#7FB39A', Events: '#D98C7A',
};
const FONT = {
  head: "'Crimson Text', Georgia, serif", body: "'Crimson Text', Georgia, serif",
  sans: "'Crimson Text', Georgia, serif", mono: "'Space Mono', 'Courier New', monospace",
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
  goldenRatio:'Shell', tessellation:'Grid3x3', vortex:'RotateCw', torus:'Donut', catenary:'Cable',
  gradient:'Blend', foam:'Grip', threshold:'DoorOpen', feedbackLoop:'IterationCw', lattice:'Grid2x2',
};
const DOMAINS = ['Life', 'Leadership', 'Body', 'Family', 'Community'];
const LAYER_PROMPTS = {
  'Intelligent Order': 'What invisible wisdom does this reveal?',
  Structure: 'What form does it take?',
  Pattern: 'What relationship repeats?',
  Rhythm: 'How does it move through time?',
  Events: 'What outcomes does it produce?',
};

const GLYPH = {
  Circle:'○', Globe:'◐', Tornado:'⧗', GitBranch:'⎇', Network:'⛓',
  Spline:'〰', Waves:'〰', RefreshCcw:'↻', Shapes:'◈', Hexagon:'⬢',
  Sparkles:'✳', Atom:'⚛', Orbit:'♁', Moon:'☽', Star:'★',
  Mountain:'⛰', Droplets:'∵', Trees:'⚘', Sprout:'↥', Brain:'⍟',
  Heart:'♥', Activity:'∿', Bone:'␢', Workflow:'⛓', Dna:'⧉',
  Shield:'⛨', TreePine:'⚘', Leaf:'⚘', Flower2:'⚘', Apple:'●',
  Cherry:'●', Feather:'✐', Bug:'⁂', Fish:'⧖', Bird:'⋀',
  Snowflake:'❄', Gem:'◈', CloudLightning:'⛈', Rainbow:'◜', Flame:'☲',
  Droplet:'∵', Wind:'↝', Compass:'⌖', Layers:'☰', Zap:'↯',
  Eye:'◉', Link:'⛓', Target:'◎', Sun:'☉', Infinity:'∞',
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

// ── Invocation Chamber helpers ────────────────────────────────
const lower1 = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const glyphOf = (s) => ICON_NAME[s.icon] || 'Circle';
const QUICK_SYMBOLS = ['circle', 'spiral', 'helix', 'roots', 'honeycomb', 'mountains', 'seeds', 'orbit'];
const FIVE = ['Intelligent Order', 'Structure', 'Pattern', 'Rhythm', 'Events'];
const POWER_WORDS = [
  { w: 'ORDER', layer: 'Intelligent Order' }, { w: 'ALIGN', layer: 'Intelligent Order' },
  { w: 'SEE', layer: 'Pattern' }, { w: 'ROOT', layer: 'Structure' }, { w: 'BUILD', layer: 'Structure' },
  { w: 'STEWARD', layer: 'Structure' }, { w: 'RELEASE', layer: 'Rhythm' }, { w: 'RENEW', layer: 'Rhythm' },
  { w: 'RISE', layer: 'Events' }, { w: 'BEGIN', layer: 'Events' },
];
const FREQ_STEPS = [
  { name: 'Beta', hz: '14–30 Hz' }, { name: 'Alpha', hz: '8–12 Hz' }, { name: 'Theta', hz: '4–8 Hz' },
];
const DESCENT_SCRIPT = [
  'Let your shoulders drop. Soften the jaw.', 'Let the breath slow on its own — no force.',
  'Rest your gaze on the symbol. Let it hold you.', 'With each exhale, settle one layer deeper.',
  'Beta loosens. The thinking quiets.', 'Alpha opens — calm, unhurried, wide.',
  'You arrive in theta: still, receptive, awake.',
];
const KEYWORDS = {
  circle: ['whole', 'unity', 'complete', 'closure', 'belong', 'together', 'oneness'],
  sphere: ['stable', 'contain', 'complete', 'whole', 'balanced', 'self'],
  spiral: ['grow', 'growth', 'evolve', 'transform', 'progress', 'develop', 'unfold', 'change', 'expand'],
  branching: ['distribute', 'spread', 'scale', 'multiply', 'delegate', 'reach', 'expand'],
  network: ['connect', 'connection', 'relationship', 'collaborate', 'team', 'network', 'support', 'community'],
  helix: ['identity', 'legacy', 'continuity', 'inherit', 'carry', 'preserve', 'information'],
  wave: ['communicate', 'message', 'influence', 'transmit', 'reach', 'signal', 'resonate'],
  cycle: ['renew', 'renewal', 'restart', 'recover', 'reset', 'repeat', 'habit', 'rhythm'],
  symmetry: ['balance', 'fairness', 'harmony', 'coherence', 'proportion', 'justice', 'beauty'],
  fractal: ['consistency', 'integrity', 'align', 'detail', 'pattern', 'whole'],
  galaxy: ['vision', 'scale', 'vast', 'expansion', 'order', 'big'],
  solarSystem: ['harmony', 'roles', 'coordinate', 'relationship', 'balance', 'team'],
  orbit: ['discipline', 'consistency', 'routine', 'faithful', 'reliable', 'commit', 'steady', 'habit'],
  planet: ['stability', 'home', 'steward', 'responsibility', 'ground', 'provide'],
  moon: ['reflect', 'cycle', 'emotion', 'intuition', 'rest', 'quiet', 'phase'],
  stars: ['guidance', 'purpose', 'light', 'lead', 'inspire', 'direction', 'navigate'],
  mountains: ['stability', 'endure', 'strong', 'steady', 'permanent', 'ground', 'resilience', 'immovable', 'patience'],
  rivers: ['flow', 'adapt', 'flexible', 'persist', 'move', 'yield'],
  oceans: ['depth', 'abundance', 'emotion', 'vast', 'calm', 'deep'],
  forests: ['interdependence', 'community', 'ecosystem', 'together', 'support', 'collaborate'],
  soil: ['prepare', 'foundation', 'hidden', 'patience', 'ground', 'nourish', 'humble'],
  seasons: ['timing', 'season', 'transition', 'change', 'rest', 'cycle', 'patience', 'wait'],
  brain: ['integrate', 'focus', 'clarity', 'think', 'decide', 'learn', 'understand'],
  heartOrgan: ['sustain', 'endurance', 'service', 'steady', 'care', 'consistency', 'love'],
  lungs: ['exchange', 'balance', 'breathe', 'give', 'receive', 'rest', 'recover'],
  skeleton: ['support', 'structure', 'strength', 'framework', 'backbone', 'discipline'],
  bloodVessels: ['distribute', 'provide', 'supply', 'nourish', 'reach', 'resource'],
  nervousSystem: ['communicate', 'coordinate', 'sense', 'respond', 'awareness', 'feedback'],
  dna: ['identity', 'values', 'core', 'authenticity', 'legacy', 'self', 'continuity'],
  skin: ['boundary', 'protect', 'limit', 'protection', 'contact'],
  roots: ['foundation', 'ground', 'anchor', 'stability', 'depth', 'security', 'base', 'grounded', 'stable'],
  trunk: ['strength', 'backbone', 'endure', 'support', 'core', 'longevity'],
  branchesPlant: ['expand', 'reach', 'grow', 'opportunity', 'spread'],
  leaves: ['receive', 'presence', 'nourish', 'attention', 'gather', 'open'],
  flowers: ['beauty', 'attract', 'express', 'create', 'invite', 'vulnerability'],
  fruit: ['result', 'harvest', 'generosity', 'give', 'share', 'multiply', 'outcome'],
  seeds: ['potential', 'begin', 'start', 'future', 'possibility', 'plant', 'patience', 'new', 'beginning'],
  wings: ['freedom', 'rise', 'lift', 'escape', 'release', 'fly', 'elevate'],
  honeycomb: ['cooperate', 'efficiency', 'community', 'build', 'collaborate', 'organize'],
  spiderWeb: ['precision', 'sensitivity', 'patience', 'detail', 'craft', 'attention'],
  antColony: ['organize', 'teamwork', 'collective', 'collaborate', 'community', 'order'],
  fishSchool: ['coordinate', 'unity', 'together', 'sync', 'team'],
  birdMigration: ['timing', 'journey', 'season', 'direction', 'transition'],
  snowflake: ['unique', 'individuality', 'identity', 'authentic', 'distinct'],
  crystal: ['order', 'clarity', 'integrity', 'focus', 'structure', 'clear', 'discipline'],
  lightning: ['breakthrough', 'sudden', 'decisive', 'release', 'transform', 'act', 'bold'],
  rainbow: ['integrate', 'diversity', 'hope', 'reconcile', 'unite', 'harmony'],
  fire: ['transform', 'energy', 'passion', 'change', 'purify', 'clear', 'renew'],
  waterPh: ['adapt', 'flexible', 'flow', 'soft', 'yield', 'persist', 'adaptable'],
  wind: ['influence', 'unseen', 'change', 'subtle', 'move', 'breath'],
};
function scoreStructure(s, tokens) {
  let score = 0;
  const hay = (s.name + ' ' + s.principle + ' ' + s.description + ' ' + Object.values(s.mapping).join(' ') + ' ' + catLabel(s.category)).toLowerCase();
  tokens.forEach((t) => { if (t.length > 3 && hay.includes(t)) score += 2; });
  (KEYWORDS[s.id] || []).forEach((k) => { tokens.forEach((t) => { if (t.length > 3 && (t.includes(k) || k.includes(t))) score += 3; }); });
  return score;
}
function bestSymbol(intention) {
  const tokens = (intention || '').toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if (!tokens.length) return null;
  let best = null, bs = 0;
  STRUCTURES.forEach((s) => { const sc = scoreStructure(s, tokens); if (sc > bs) { bs = sc; best = s; } });
  return best ? best.id : null;
}
const reasonFor = (s) => `Auto-matched · resonant with \u201C${lower1(s.principle)}\u201D`;
function renderCaps(line) {
  return line.split(/(\b[A-Z]{2,}\b)/g).map((p, i) => /^[A-Z]{2,}$/.test(p)
    ? <span key={i} style={{ color: ACCENT['Intelligent Order'], fontWeight: 600, letterSpacing: '0.5px' }}>{p}</span>
    : <span key={i}>{p}</span>);
}
function buildInvocation(symbol, register, picked, intention) {
  const m = symbol.mapping;
  const caps = picked.length ? picked.join(', ') : 'ORDER, ALIGN';
  const sacred = register === 'sacred';
  const head = sacred
    ? (intention.trim() ? `By the ${symbol.name}, I align with the Order beneath ${lower1(intention.trim())}.` : `By the ${symbol.name}, I enter the Order it reveals.`)
    : (intention.trim() ? `Through the ${symbol.name}, I align with the order beneath ${lower1(intention.trim())}.` : `I align with the order already at work.`);
  const wrap = sacred
    ? { io: 'Beneath it, an order I trust:', st: 'I take its form:', pa: 'I move by its pattern:', rh: 'I keep its rhythm:', ev: 'And so it takes form:' }
    : { io: 'The order here:', st: 'Its form:', pa: 'Its pattern:', rh: 'Its rhythm:', ev: 'Its fruit, made real:' };
  const close = sacred ? `By ${caps}, I align — and I act. So it is.` : `${caps}: I align, and I act. This pattern is teaching me.`;
  return [
    { layer: null, text: head },
    { layer: 'Intelligent Order', text: `${wrap.io} ${lower1(m.intelligentOrder)}` },
    { layer: 'Structure', text: `${wrap.st} ${lower1(m.structure)}` },
    { layer: 'Pattern', text: `${wrap.pa} ${lower1(m.pattern)}` },
    { layer: 'Rhythm', text: `${wrap.rh} ${lower1(m.rhythm)}` },
    { layer: 'Events', text: `${wrap.ev} ${lower1(m.events)}` },
    { layer: null, text: close },
  ];
}
const localActionFor = (symbol, domain) => `Carry the ${symbol.name} into your ${domain.toLowerCase()}: take one concrete step today that embodies "${lower1(symbol.principle)}".`;

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
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '10px', border: 'none', background: disabled ? 'rgba(224,182,92,0.3)' : h ? '#F59E0B' : '#FBBF24', color: '#1A150A', fontFamily: FONT.sans, fontSize: '13.5px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'all 0.2s ease', boxShadow: disabled ? 'none' : '0 2px 12px rgba(224,182,92,0.18)', ...style }}>
      {children}
    </button>
  );
}

function Section({ children }) { return <div style={{ animation: 'fadeUp 0.4s ease both' }}>{children}</div>; }
function Eyebrow({ children, center }) { return <p style={{ ...mono(), textAlign: center ? 'center' : 'left', margin: 0 }}>{children}</p>; }
function Chip({ children, on, color, onClick }) { return <button onClick={onClick} style={{ padding: '8px 15px', borderRadius: '999px', cursor: 'pointer', fontFamily: FONT.sans, fontSize: '12.5px', fontWeight: on ? 600 : 500, border: `1px solid ${on ? color : 'var(--border)'}`, background: on ? color + '1A' : 'transparent', color: on ? color : 'var(--muted)' }}>{children}</button>; }
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: 'inline-flex', padding: '3px', borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--chip)' }}>
      {options.map(([v, label]) => { const on = value === v; return <button key={v} onClick={() => onChange(v)} style={{ padding: '6px 14px', borderRadius: '999px', border: 'none', cursor: 'pointer', fontFamily: FONT.sans, fontSize: '12px', fontWeight: 600, background: on ? ACCENT['Intelligent Order'] : 'transparent', color: on ? '#1A150A' : 'var(--muted)' }}>{label}</button>; })}
    </div>
  );
}
function Stepper({ stage }) {
  const order = ['attune', 'descend', 'invoke', 'seal']; const idx = order.indexOf(stage);
  return <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>{order.map((s, i) => <span key={s} style={{ width: i === idx ? '22px' : '8px', height: '8px', borderRadius: '999px', background: i <= idx ? ACCENT['Intelligent Order'] : 'var(--border)', transition: 'all 0.3s ease' }} />)}</div>;
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
function Modal({ s, onClose, studied, onToggleStudied, onApply, onInvoke }) {
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
            <GhostBtn color={ACCENT['Intelligent Order']} onClick={() => onInvoke(s)}><Icon name="Flame" size={15} color={ACCENT['Intelligent Order']} /> Invoke with this</GhostBtn>
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
function JournalPanel({ applications, removeApplication, invocations, removeInvocation, audio, studiedCount, goExplore, goApply, goInvoke }) {
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

      {/* Invocations */}
      <div style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <h3 style={{ fontFamily: FONT.head, fontSize: '18px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>Invocations</h3>
          <GhostBtn color={ACCENT['Intelligent Order']} onClick={goInvoke}>+ New invocation</GhostBtn>
        </div>
        {invocations.length === 0 ? (
          <div style={{ ...glass, borderRadius: '16px', padding: '28px 22px', textAlign: 'center' }}>
            <Icon name="Flame" size={24} color="var(--dim)" />
            <p style={{ fontFamily: FONT.body, fontSize: '14.5px', color: 'var(--muted)', margin: '10px 0 0' }}>No invocations yet. Enter the Invoke chamber, then seal a rite to keep it here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...invocations].reverse().map((r) => {
              const s = STRUCTURE_BY_ID[r.symbolId]; const a = s ? ACCENT[s.primaryLayer] : ACCENT['Intelligent Order'];
              const playing = audio.tone && audio.audioSource === r.id;
              return (
                <div key={r.id} style={{ ...glass, borderRadius: '16px', padding: '18px 20px', borderLeft: `3px solid ${a}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>{s && <Icon name={glyphOf(s)} size={16} color={a} />}<span style={{ fontFamily: FONT.head, fontSize: '15px', color: 'var(--text)' }}>{r.symbolName}</span></span>
                    <span style={{ padding: '2px 9px', borderRadius: '999px', background: ACCENT['Intelligent Order'] + '14', border: `1px solid ${ACCENT['Intelligent Order']}33`, ...mono({ color: ACCENT['Intelligent Order'], fontSize: '9px' }) }}>{r.register}</span>
                    <span style={{ padding: '2px 9px', borderRadius: '999px', background: ACCENT.Rhythm + '14', border: `1px solid ${ACCENT.Rhythm}33`, ...mono({ color: ACCENT.Rhythm, fontSize: '9px' }) }}>{r.domain}</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: '10px', color: 'var(--dim)', marginLeft: 'auto' }}>{fmt(r.ts)}</span>
                  </div>
                  {r.intention && <p style={{ fontFamily: FONT.body, fontSize: '13px', fontStyle: 'italic', color: 'var(--muted)', margin: '0 0 10px' }}>“{r.intention}”</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {r.lines.map((l, i) => { const tx = typeof l === 'string' ? l : l.text; const lay = typeof l === 'string' ? null : l.layer; return <p key={i} style={{ fontFamily: FONT.head, fontSize: '14.5px', color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>{lay && <span style={{ color: ACCENT[lay], fontFamily: FONT.mono, fontSize: '9px', marginRight: '6px' }}>{'\u25B8'}</span>}{renderCaps(tx)}</p>; })}
                  </div>
                  <div style={{ marginTop: '12px', borderRadius: '10px', background: ACCENT.Rhythm + '0C', border: `1px solid ${ACCENT.Rhythm}26`, padding: '10px 12px' }}>
                    <span style={mono({ color: ACCENT.Rhythm, fontSize: '9px' })}>Sealed action</span>
                    <p style={{ fontFamily: FONT.body, fontSize: '13.5px', color: 'var(--text)', margin: '4px 0 0', lineHeight: 1.5 }}>{r.action}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
                    <GhostBtn color={ACCENT['Intelligent Order']} onClick={() => (playing ? audio.stopBed() : audio.startBed(r.id))} style={{ padding: '6px 12px' }}><Icon name={playing ? 'Square' : 'Headphones'} size={13} color={ACCENT['Intelligent Order']} /> {playing ? 'Stop bed' : 'Play coherence bed'}</GhostBtn>
                    <GhostBtn color={ACCENT.Events} onClick={() => removeInvocation(r.id)} style={{ padding: '6px 12px' }}>Delete</GhostBtn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <h3 style={{ fontFamily: FONT.head, fontSize: '18px', fontWeight: 500, color: 'var(--text)', margin: '0 0 14px' }}>Applications</h3>
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

// ═══ INVOKE PANEL (Invocation Chamber) ════════════════════════
function InvokePanel({ seed, clearSeed, addInvocation, showToast, audio }) {
  const [stage, setStage] = useState('attune');
  const [register, setRegister] = useState('sacred');
  const [intention, setIntention] = useState('');
  const [domain, setDomain] = useState('Life');
  const [symbolId, setSymbolId] = useState(seed || 'circle');
  const [symbolAuto, setSymbolAuto] = useState(!seed);
  const [matchReason, setMatchReason] = useState(seed ? 'Carried from your study.' : '');
  const [matching, setMatching] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [picked, setPicked] = useState([]);
  const [freq, setFreq] = useState(0);
  const [breath, setBreath] = useState('in');
  const [scriptIdx, setScriptIdx] = useState(0);
  const [invocation, setInvocation] = useState([]);
  const [action, setAction] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const symbol = STRUCTURE_BY_ID[symbolId];
  const sA = ACCENT[symbol.primaryLayer];
  const bedOn = audio.tone && audio.audioSource === 'chamber';

  useEffect(() => { if (seed) { setSymbolId(seed); setSymbolAuto(false); setMatchReason('Carried from your study.'); setStage('attune'); clearSeed(); } /* eslint-disable-next-line */ }, [seed]);
  useEffect(() => { if (!symbolAuto) return; const t = setTimeout(() => { const id = bestSymbol(intention); if (id) { setSymbolId(id); setMatchReason(reasonFor(STRUCTURE_BY_ID[id])); } }, 350); return () => clearTimeout(t); }, [intention, symbolAuto]);
  useEffect(() => {
    if (stage !== 'descend') return;
    const b = setInterval(() => setBreath((p) => (p === 'in' ? 'out' : 'in')), 4000);
    const f = setInterval(() => setFreq((p) => Math.min(p + 1, FREQ_STEPS.length - 1)), 9000);
    const s = setInterval(() => setScriptIdx((p) => Math.min(p + 1, DESCENT_SCRIPT.length - 1)), 5200);
    return () => { clearInterval(b); clearInterval(f); clearInterval(s); };
  }, [stage]);

  const togglePick = (w) => setPicked((ps) => (ps.includes(w) ? ps.filter((x) => x !== w) : ps.length < 3 ? [...ps, w] : ps));

  async function aiAttune() {
    if (!intention.trim()) return;
    setMatching(true); setNote('');
    const list = STRUCTURES.map((s) => `${s.id}: ${s.name} — ${s.principle}`).join('\n');
    const prompt = `A practitioner seeks to align with: "${intention.trim()}". From this list of universal structures, choose the ONE whose principle best resonates as a symbol to focus on while invoking. Reply ONLY as minified JSON {"id":"<id>","reason":"<reason, max 12 words>"}.\n${list}`;
    try {
      const res = await fetch('/api/org-diagnostic', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      if (!res.ok) throw new Error('x');
      const parsed = await res.json();
      if (!parsed || !STRUCTURE_BY_ID[parsed.id]) throw new Error('x');
      setSymbolAuto(true); setSymbolId(parsed.id); setMatchReason('Attuned by the system · ' + (parsed.reason || 'resonant with your intention'));
    } catch { const id = bestSymbol(intention); if (id) { setSymbolId(id); setMatchReason(reasonFor(STRUCTURE_BY_ID[id])); } }
    finally { setMatching(false); }
  }

  async function forge() {
    setBusy(true); setNote('');
    const words = picked.length ? picked.join(', ') : 'ORDER, ALIGN';
    const tone_ = register === 'sacred' ? 'Tone: sacred script — elevated, reverent, liturgical, like a spoken rite.' : 'Tone: grounded and direct — plain, potent, unembellished.';
    const m = symbol.mapping;
    const prompt = `You are composing an Invocation for a practitioner of the Cosmic Reality Framework, spoken aloud from a calm, receptive (theta) state. It MUST be structured as a descent through the five layers of the framework, personalized to the practitioner's intention and the symbol they resonate with.
Intention: "${intention.trim() || 'to align with intelligent order'}"
Domain: ${domain}
Symbol: ${symbol.name} — principle: "${symbol.principle}"
Five layers of the symbol:
- Intelligent Order: ${m.intelligentOrder}
- Structure: ${m.structure}
- Pattern: ${m.pattern}
- Rhythm: ${m.rhythm}
- Events: ${m.events}
Power words to weave in CAPS: ${words}
${tone_}
Provide ONE first-person, present-tense line for EACH of the five layers, drawing on the symbol's quality and the intention, weaving a power word in CAPS where natural. Add a short opening line (layer null) naming the intention and symbol, and a short closing line (layer null) that seals it. The Events line speaks to it taking form in the physical. Honesty: the words align and commit the speaker; they do NOT promise instantaneous supernatural manifestation — the physical completes through aligned action.
Then "action": one concrete Recommended Participation in their ${domain.toLowerCase()} that carries it into the physical.
Respond ONLY with minified JSON: {"invocation":[{"layer":"Intelligent Order|Structure|Pattern|Rhythm|Events|null","text":"..."}],"action":"..."}`;
    try {
      const res = await fetch('/api/org-diagnostic', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      if (!res.ok) throw new Error('x');
      const parsed = await res.json();
      if (!parsed || !Array.isArray(parsed.invocation)) throw new Error('x');
      const norm = parsed.invocation.map((it) => (typeof it === 'string' ? { layer: null, text: it } : { layer: ACCENT[it.layer] ? it.layer : null, text: it.text || '' })).filter((it) => it.text);
      setInvocation(norm.length ? norm : buildInvocation(symbol, register, picked, intention)); setAction(parsed.action || localActionFor(symbol, domain));
    } catch { setNote('Live forge unavailable — composed from the symbol, the framework, and your power words.'); setInvocation(buildInvocation(symbol, register, picked, intention)); setAction(localActionFor(symbol, domain)); }
    finally { setBusy(false); }
  }

  function enterInvoke() { if (!invocation.length) { setInvocation(buildInvocation(symbol, register, picked, intention)); setAction(localActionFor(symbol, domain)); } setStage('invoke'); }
  function saveIt() {
    const rec = { id: Date.now(), ts: new Date().toISOString(), intention: intention.trim(), domain, symbolId, symbolName: symbol.name, register, powerWords: [...picked], lines: invocation.length ? invocation : buildInvocation(symbol, register, picked, intention), action: action || localActionFor(symbol, domain) };
    addInvocation(rec); showToast('✦ Invocation saved to your Journal.');
  }
  function resetAll() { setStage('attune'); setIntention(''); setPicked([]); setInvocation([]); setAction(''); setFreq(0); setScriptIdx(0); setNote(''); }

  const taStyle = { width: '100%', boxSizing: 'border-box', marginTop: '16px', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--chip)', color: 'var(--text)', fontFamily: FONT.body, fontSize: '16px', lineHeight: 1.5, outline: 'none', resize: 'vertical' };
  const h2s = { fontFamily: FONT.head, fontSize: 'clamp(22px,3.4vw,30px)', fontWeight: 500, color: 'var(--text)', margin: '8px 0 0', letterSpacing: '-0.4px' };
  const subs = { fontFamily: FONT.body, fontSize: '15px', color: 'var(--muted)', lineHeight: 1.55, margin: '10px 0 0' };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
        <Stepper stage={stage} />
        <Segmented value={register} onChange={setRegister} options={[['sacred', 'Sacred'], ['grounded', 'Grounded']]} />
      </div>

      {/* ATTUNE */}
      {stage === 'attune' && (
        <Section>
          <Eyebrow>Set the intention</Eyebrow>
          <h2 style={h2s}>What do you seek to align with?</h2>
          <p style={subs}>Name what you are bringing into order. A structure is auto-attuned to your words — the symbol your mind rests on to resonate with the Order it expresses.</p>
          <textarea value={intention} onChange={(e) => setIntention(e.target.value)} rows={3} placeholder="e.g. to lead my team through this transition without losing myself" style={taStyle} />
          <div style={{ ...mono(), marginTop: '18px', marginBottom: '8px' }}>Domain</div>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>{DOMAINS.map((d) => <Chip key={d} on={domain === d} color={ACCENT.Rhythm} onClick={() => setDomain(d)}>{d}</Chip>)}</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '22px', marginBottom: '10px' }}>
            <span style={mono()}>Your symbol — attuned to your intention</span>
            <div style={{ display: 'flex', gap: '7px' }}>
              <GhostBtn color={ACCENT['Intelligent Order']} onClick={aiAttune}>{matching ? 'Attuning…' : '✦ Attune with AI'}</GhostBtn>
              {!symbolAuto && <GhostBtn onClick={() => setSymbolAuto(true)}>↻ Auto</GhostBtn>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderRadius: '16px', border: `1px solid ${sA}33`, background: sA + '0E', padding: '18px', marginBottom: '12px' }}>
            <div style={{ width: '60px', height: '60px', flexShrink: 0, borderRadius: '14px', background: sA + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1px ${sA}44` }}><Icon name={glyphOf(symbol)} size={30} color={sA} /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT.head, fontSize: '18px', color: 'var(--text)' }}>{symbol.name}</span>
                <span style={{ ...mono(), color: sA }}>{symbol.primaryLayer}</span>
                {symbolAuto && <span style={{ padding: '2px 8px', borderRadius: '999px', background: ACCENT['Intelligent Order'] + '14', border: `1px solid ${ACCENT['Intelligent Order']}33`, ...mono({ color: ACCENT['Intelligent Order'], fontSize: '8.5px' }) }}>auto</span>}
              </div>
              <p style={{ fontFamily: FONT.body, fontSize: '14px', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.5 }}>{symbol.mapping.intelligentOrder}</p>
              {matchReason && <p style={{ fontFamily: FONT.body, fontSize: '12px', fontStyle: 'italic', color: sA, margin: '6px 0 0' }}>{matchReason}</p>}
            </div>
          </div>
          <button onClick={() => setManualOpen((o) => !o)} style={{ border: 'none', background: 'transparent', color: 'var(--muted)', fontFamily: FONT.sans, fontSize: '12px', cursor: 'pointer', padding: '4px 0' }}>{manualOpen ? '▾ Hide manual choice' : '▸ Choose a different symbol'}</button>
          {manualOpen && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {QUICK_SYMBOLS.map((id) => { const s = STRUCTURE_BY_ID[id]; const on = symbolId === id; const a = ACCENT[s.primaryLayer]; return <button key={id} onClick={() => { setSymbolAuto(false); setSymbolId(id); setMatchReason('Chosen by you.'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 13px', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${on ? a : 'var(--border)'}`, background: on ? a + '18' : 'transparent', color: on ? a : 'var(--muted)', fontFamily: FONT.sans, fontSize: '12px', fontWeight: on ? 600 : 500 }}><Icon name={glyphOf(s)} size={14} color={on ? a : 'var(--muted)'} />{s.name}</button>; })}
              </div>
              <select value={symbolId} onChange={(e) => { setSymbolAuto(false); setSymbolId(e.target.value); setMatchReason('Chosen by you.'); }} style={{ width: '100%', padding: '11px 14px', borderRadius: '11px', border: '1px solid var(--border)', background: 'var(--selbg)', color: 'var(--text)', fontFamily: FONT.sans, fontSize: '13.5px', cursor: 'pointer' }}>
                {STRUCTURES.map((o) => <option key={o.id} value={o.id} style={{ background: 'var(--selbg)' }}>{o.name} — {o.principle}</option>)}
              </select>
            </div>
          )}
          <div style={{ marginTop: '24px' }}><GoldBtn onClick={() => { setFreq(0); setScriptIdx(0); setStage('descend'); }} disabled={!intention.trim()}>Enter the Chamber <Icon name="ArrowRight" size={15} color="#1A150A" /></GoldBtn></div>
        </Section>
      )}

      {/* DESCEND */}
      {stage === 'descend' && (
        <Section>
          <Eyebrow>Descend into theta</Eyebrow>
          <h2 style={h2s}>Rest on the symbol; breathe down</h2>
          <p style={subs}>Let the {symbol.name} hold your attention. Follow the breath into theta (4–8 Hz) — the calm, receptive band.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ position: 'relative', width: '230px', height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '230px', height: '230px', borderRadius: '50%', background: `radial-gradient(circle, ${sA}26, transparent 70%)`, transform: breath === 'in' ? 'scale(1.12)' : 'scale(0.82)', transition: 'transform 4s ease-in-out' }} />
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: `1px solid ${sA}55`, background: `radial-gradient(circle, ${sA}1A, transparent)`, transform: breath === 'in' ? 'scale(1.18)' : 'scale(0.88)', transition: 'transform 4s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={glyphOf(symbol)} size={62} color={sA} /></div>
            </div>
            <span style={{ fontFamily: FONT.head, fontSize: '15px', color: sA, marginTop: '14px' }}>{breath === 'in' ? 'Breathe in' : 'Breathe out'}</span>
            <p style={{ fontFamily: FONT.body, fontSize: '15px', fontStyle: 'italic', color: 'var(--muted)', marginTop: '10px', minHeight: '22px', textAlign: 'center' }}>{DESCENT_SCRIPT[scriptIdx]}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {FREQ_STEPS.map((s, i) => { const on = i === freq, passed = i < freq; return <div key={s.name} style={{ textAlign: 'center', padding: '9px 13px', borderRadius: '11px', border: `1px solid ${on ? ACCENT['Intelligent Order'] + '66' : 'var(--border)'}`, background: on ? ACCENT['Intelligent Order'] + '12' : 'transparent', opacity: passed ? 0.5 : 1, minWidth: '88px' }}><div style={{ fontFamily: FONT.head, fontSize: '14px', color: on ? ACCENT['Intelligent Order'] : 'var(--muted)' }}>{s.name}</div><div style={{ fontFamily: FONT.mono, fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>{s.hz}</div></div>; })}
            </div>
            <button onClick={() => (bedOn ? audio.stopBed() : audio.startBed('chamber'))} style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${bedOn ? ACCENT['Intelligent Order'] + '66' : 'var(--border)'}`, background: bedOn ? ACCENT['Intelligent Order'] + '14' : 'transparent', color: bedOn ? ACCENT['Intelligent Order'] : 'var(--muted)', fontFamily: FONT.sans, fontSize: '12.5px', fontWeight: 500 }}>
              <Icon name={bedOn ? 'Volume2' : 'Headphones'} size={15} color={bedOn ? ACCENT['Intelligent Order'] : 'var(--muted)'} />{bedOn ? 'Coherence bed playing — tap to stop' : 'Begin the coherence bed'}
            </button>
            <span style={{ fontFamily: FONT.mono, fontSize: '9px', color: 'var(--dim)', marginTop: '6px', letterSpacing: '0.5px', textAlign: 'center' }}>ambient pad + 6 Hz binaural beat · eases left &amp; right hemispheres toward coherence · use headphones</span>
          </div>
          <Eyebrow>Carry up to three power words</Eyebrow>
          <p style={{ ...subs, marginTop: '4px' }}>Resonant words for the {symbol.name} are marked.</p>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '12px' }}>
            {POWER_WORDS.map((p) => { const on = picked.includes(p.w); const res = p.layer === symbol.primaryLayer; return <button key={p.w} onClick={() => togglePick(p.w)} style={{ padding: '8px 14px', borderRadius: '999px', cursor: 'pointer', fontFamily: FONT.mono, fontSize: '12px', letterSpacing: '1px', border: `1px solid ${on ? ACCENT[p.layer] : res ? ACCENT[p.layer] + '55' : 'var(--border)'}`, background: on ? ACCENT[p.layer] + '1A' : 'transparent', color: on ? ACCENT[p.layer] : res ? ACCENT[p.layer] : 'var(--muted)' }}>{p.w}{res && <span style={{ marginLeft: '6px', fontSize: '8px', opacity: 0.8 }}>✦</span>}</button>; })}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '26px' }}>
            <GoldBtn onClick={enterInvoke}>I am centered — Invoke <Icon name="Sparkles" size={15} color="#1A150A" /></GoldBtn>
            <GhostBtn onClick={() => setStage('attune')}>Back</GhostBtn>
          </div>
        </Section>
      )}

      {/* INVOKE */}
      {stage === 'invoke' && (
        <Section>
          <Eyebrow>Speak the invocation</Eyebrow>
          <h2 style={h2s}>{register === 'sacred' ? 'Pronounce the rite, slowly' : 'Declare it aloud, slowly'}</h2>
          <p style={subs}>The invocation descends the five layers of the Cosmic Order — from Intelligent Order to its taking form — shaped to what you seek and to the {symbol.name}.</p>
          <div style={{ borderRadius: '18px', border: `1px solid ${ACCENT['Intelligent Order']}2A`, background: `linear-gradient(160deg, ${ACCENT['Intelligent Order']}0E, ${sA}08)`, padding: '30px 26px', margin: '20px 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}><Icon name={glyphOf(symbol)} size={220} color={sA} /></div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {invocation.map((ln, i) => (
                <div key={i} style={{ textAlign: 'center', animation: `riseIn 0.5s ease ${i * 0.22}s both` }}>
                  {ln.layer && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT[ln.layer] }} /><span style={{ fontFamily: FONT.mono, fontSize: '8.5px', letterSpacing: '1.5px', textTransform: 'uppercase', color: ACCENT[ln.layer] }}>{ln.layer}</span></div>}
                  <p style={{ fontFamily: FONT.head, fontSize: ln.layer ? '18px' : '20px', fontWeight: 400, lineHeight: 1.5, color: 'var(--text)', margin: 0 }}>{renderCaps(ln.text)}</p>
                </div>
              ))}
            </div>
          </div>
          {note && <p style={{ fontFamily: FONT.sans, fontSize: '12px', color: ACCENT.Events, textAlign: 'center', margin: '0 0 12px' }}>{note}</p>}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <GoldBtn onClick={() => setStage('seal')}>Seal in action <Icon name="ArrowRight" size={15} color="#1A150A" /></GoldBtn>
            <GhostBtn color={ACCENT['Intelligent Order']} onClick={forge}>{busy ? 'Forging…' : '✦ Forge with AI'}</GhostBtn>
            <GhostBtn onClick={() => setInvocation(buildInvocation(symbol, register, picked, intention))}>Recompose</GhostBtn>
            <GhostBtn onClick={() => setStage('descend')}>Back</GhostBtn>
          </div>
        </Section>
      )}

      {/* SEAL */}
      {stage === 'seal' && (
        <Section>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', margin: '0 auto 14px', border: `1px solid ${ACCENT.Rhythm}4D`, background: ACCENT.Rhythm + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Sprout" size={24} color={ACCENT.Rhythm} /></div>
            <Eyebrow center>Seal it in the physical</Eyebrow>
            <h2 style={{ ...h2s, textAlign: 'center' }}>The word becomes real through action</h2>
            <p style={{ ...subs, textAlign: 'center', maxWidth: '520px', margin: '10px auto 0' }}>Intelligent Order reaches the physical — the Events layer — through structure and aligned action. This is where the invocation lands.</p>
          </div>
          <div style={{ borderRadius: '16px', borderLeft: `3px solid ${ACCENT.Rhythm}`, border: `1px solid ${ACCENT.Rhythm}33`, background: ACCENT.Rhythm + '0C', padding: '20px 22px', margin: '22px 0' }}>
            <div style={{ ...mono({ color: ACCENT.Rhythm }), marginBottom: '8px' }}>Recommended Participation · {domain}</div>
            <p style={{ fontFamily: FONT.body, fontSize: '16px', lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>{action || localActionFor(symbol, domain)}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <GoldBtn onClick={saveIt}><Icon name="Check" size={15} color="#1A150A" /> Save to Journal</GoldBtn>
            <GhostBtn onClick={() => setStage('invoke')}>Return to invocation</GhostBtn>
            <GhostBtn color={ACCENT.Structure} onClick={resetAll}>New invocation</GhostBtn>
            {audio.tone && <GhostBtn onClick={audio.stopBed}><Icon name="Square" size={13} color="var(--muted)" /> Stop coherence bed</GhostBtn>}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: '12.5px', fontStyle: 'italic', color: 'var(--dim)', textAlign: 'center', marginTop: '22px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>The invocation aligns and commits you. What appears in the physical follows through the action you now take.</p>
        </Section>
      )}
    </div>
  );
}

// ═══ ROOT MODULE ══════════════════════════════════════════════
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'Compass' },
  { id: 'explore', label: 'Explore', icon: 'LayoutGrid' },
  { id: 'mapping', label: 'Mapping', icon: 'Workflow' },
  { id: 'apply', label: 'Apply', icon: 'PenLine' },
  { id: 'invoke', label: 'Invoke', icon: 'Flame' },
  { id: 'journal', label: 'Journal', icon: 'NotebookPen' },
];

export default function UniversalStructures() {
  const [dark, setDark] = useState(true); // site is dark-only
  const [tab, setTab] = useState('overview');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [studied, setStudied] = useState(() => { try { const v = typeof window!=='undefined' && localStorage.getItem('tfi-usio-studied'); return v ? new Set(JSON.parse(v)) : new Set(); } catch { return new Set(); } }); // live: ac-usio-studied
  const [applications, setApplications] = useState(() => { try { const v = typeof window!=='undefined' && localStorage.getItem('tfi-usio-applications'); return v ? JSON.parse(v) : []; } catch { return []; } });     // live: ac-usio-applications
  const [applyId, setApplyId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [invocations, setInvocations] = useState([]); // live build: ac-invocations
  const [invokeSeed, setInvokeSeed] = useState(null);
  const [tone, setTone] = useState(false);
  const [vol, setVol] = useState(50);
  const [audioSource, setAudioSource] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const id = 'usio-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link'); link.id = id; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { const a = audioRef.current; if (a && a.ctx) { try { a.master.gain.setTargetAtTime((vol / 100) * 0.2, a.ctx.currentTime, 0.08); } catch {} } }, [vol]);
  useEffect(() => () => { const a = audioRef.current; if (a && a.ctx) { try { a.oscs.forEach((o) => { try { o.stop(); } catch {} }); a.ctx.close(); } catch {} } }, []);

  const showToast = (m) => { setToast(m); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2600); };
  const toggleStudied = (id) => setStudied((set) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addApplication = (a) => setApplications((xs) => [...xs, a]);
  const removeApplication = (id) => setApplications((xs) => xs.filter((x) => x.id !== id));

  // ── Hybrid sync: localStorage (instant) + Supabase (cross-device) ──
  // On mount: read localStorage first so the UI is instant, then pull from
  // Supabase in the background and merge (server wins on conflict).
  useEffect(() => {
    async function pullFromServer() {
      try {
        const res = await fetch('/api/universal-structures/journal');
        if (!res.ok) return; // signed out or server error — localStorage stands
        const data = await res.json();
        // Merge: union studied sets, concat non-duplicate applications/invocations
        if (Array.isArray(data.studied) && data.studied.length > 0) {
          setStudied(prev => {
            const merged = new Set([...prev, ...data.studied]);
            try { localStorage.setItem('tfi-usio-studied', JSON.stringify([...merged])); } catch {}
            return merged;
          });
        }
        if (Array.isArray(data.applications) && data.applications.length > 0) {
          setApplications(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const incoming = data.applications.filter(a => !existingIds.has(a.id));
            const merged = [...prev, ...incoming];
            try { localStorage.setItem('tfi-usio-applications', JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (Array.isArray(data.invocations) && data.invocations.length > 0) {
          setInvocations(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            return [...prev, ...data.invocations.filter(i => !existingIds.has(i.id))];
          });
        }
      } catch {} // silent — offline or unauthenticated
    }
    pullFromServer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On every state change: write localStorage immediately, then sync to server async.
  const syncToServer = (studiedSet, apps, invocs) => {
    try { localStorage.setItem('tfi-usio-studied', JSON.stringify([...studiedSet])); } catch {}
    try { localStorage.setItem('tfi-usio-applications', JSON.stringify(apps)); } catch {}
    fetch('/api/universal-structures/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studied: [...studiedSet], applications: apps, invocations: invocs }),
    }).catch(() => {}); // silent — localStorage already updated
  };

  const syncMounted = useRef(false);
  useEffect(() => {
    if (!syncMounted.current) { syncMounted.current = true; return; }
    syncToServer(studied, applications, invocations);
  }, [studied, applications, invocations]); // eslint-disable-line react-hooks/exhaustive-deps

  const openApply = (s) => { setApplyId(s.id); setSelected(null); setTab('apply'); };
  const addInvocation = (r) => setInvocations((xs) => [...xs, r]);
  const removeInvocation = (id) => setInvocations((xs) => xs.filter((x) => x.id !== id));
  const openInvoke = (s) => { setInvokeSeed(s.id); setSelected(null); setTab('invoke'); };

  function buildBed() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 700; filter.Q.value = 0.6;
      const padGain = ctx.createGain(); padGain.gain.value = 0.5; padGain.connect(filter); filter.connect(master);
      const oscs = [];
      [136.1, 204.2, 272.2, 163.3].forEach((f) => { [-2.5, 0, 2.5].forEach((det) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = det; const g = ctx.createGain(); g.gain.value = 0.05; o.connect(g); g.connect(padGain); o.start(); oscs.push(o); }); });
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05; const lfoG = ctx.createGain(); lfoG.gain.value = 220; lfo.connect(lfoG); lfoG.connect(filter.frequency); lfo.start(); oscs.push(lfo);
      const beatGain = ctx.createGain(); beatGain.gain.value = 0.3; beatGain.connect(master);
      const mkBin = (freqHz, pan) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freqHz; if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; o.connect(p); p.connect(beatGain); } else o.connect(beatGain); o.start(); return o; };
      oscs.push(mkBin(200, -1), mkBin(206, 1));
      master.gain.linearRampToValueAtTime((vol / 100) * 0.2, ctx.currentTime + 2.5);
      return { ctx, master, oscs };
    } catch { return null; }
  }
  function teardown(a) { if (!a || !a.ctx) return; try { a.master.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.5); setTimeout(() => { try { a.oscs.forEach((o) => { try { o.stop(); } catch {} }); a.ctx.close(); } catch {} }, 600); } catch {} }
  function startBed(src) { const prev = audioRef.current; if (prev) teardown(prev); const bed = buildBed(); if (!bed) { audioRef.current = null; setTone(false); setAudioSource(null); return; } audioRef.current = bed; setTone(true); setAudioSource(src); }
  function stopBed() { const a = audioRef.current; audioRef.current = null; teardown(a); setTone(false); setAudioSource(null); }
  const audio = { tone, vol, setVol, startBed, stopBed, audioSource };

  const q = query.trim().toLowerCase();
  const match = (s) => !q || [s.name, s.principle, s.description, s.category, s.primaryLayer, catLabel(s.category)].some((v) => v.toLowerCase().includes(q));
  const counts = useMemo(() => { const c = { all: 0 }; CATEGORIES.forEach((cat) => (c[cat.id] = 0)); STRUCTURES.forEach((s) => { if (match(s)) { c.all += 1; c[s.category] += 1; } }); return c; }, [q]);
  const filtered = useMemo(() => STRUCTURES.filter((s) => (category === 'all' || s.category === category) && match(s)), [category, q]);
  const tabs = [{ id: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];

  const vars = dark
    ? { '--bg': 'radial-gradient(1100px 600px at 78% -8%, rgba(124,58,237,0.16), transparent 60%), radial-gradient(900px 500px at 12% 4%, rgba(251,191,36,0.07), transparent 60%), #06060F',
        '--text': '#EDE9F5', '--muted': 'rgba(237,233,245,0.66)', '--dim': 'rgba(237,233,245,0.40)',
        '--card': 'rgba(255,255,255,0.025)',
        '--border': 'rgba(255,255,255,0.08)', '--chip': 'rgba(255,255,255,0.04)',
        '--nav': 'rgba(6,6,15,0.75)', '--ring': '#06060F', '--selbg': '#0E0E1A' }
    : { '--bg': 'radial-gradient(1100px 600px at 78% -8%, rgba(124,58,237,0.12), transparent 60%), radial-gradient(900px 500px at 12% 4%, rgba(251,191,36,0.05), transparent 60%), #0E0E1A',
        '--text': '#EDE9F5', '--muted': 'rgba(237,233,245,0.55)', '--dim': 'rgba(237,233,245,0.32)',
        '--card': 'rgba(255,255,255,0.04)',
        '--border': 'rgba(255,255,255,0.10)', '--chip': 'rgba(255,255,255,0.06)',
        '--nav': 'rgba(14,14,26,0.80)', '--ring': '#0E0E1A', '--selbg': '#16162A' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: FONT.sans, ...vars }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>

        {/* module header */}
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={mono({ letterSpacing: '2px' })}>Twelvefold Institute · Universal Structure</span>
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
          {tab === 'invoke' && <InvokePanel seed={invokeSeed} clearSeed={() => setInvokeSeed(null)} addInvocation={addInvocation} showToast={showToast} audio={audio} />}
          {tab === 'journal' && <JournalPanel applications={applications} removeApplication={removeApplication} invocations={invocations} removeInvocation={removeInvocation} audio={audio} studiedCount={studied.size} goExplore={() => setTab('explore')} goApply={() => setTab('apply')} goInvoke={() => setTab('invoke')} />}
        </div>
      </div>

      <Modal s={selected} onClose={() => setSelected(null)} studied={studied} onToggleStudied={toggleStudied} onApply={openApply} onInvoke={openInvoke} />

      {tone && (
        <div style={{ position: 'fixed', bottom: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', borderRadius: '999px', background: 'rgba(20,18,30,0.92)', border: `1px solid ${ACCENT['Intelligent Order']}33`, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 65 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT['Intelligent Order'], animation: 'pulseDot 1.6s ease-in-out infinite' }} />
          <span style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: ACCENT['Intelligent Order'] }}>{audioSource === 'chamber' ? 'coherence bed' : 'coherence bed · journal'}</span>
          <input type="range" min="0" max="100" value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ width: '84px', accentColor: ACCENT['Intelligent Order'] }} />
          <button onClick={stopBed} aria-label="Stop" style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}><Icon name="Square" size={12} color="var(--muted)" /></button>
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes riseIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes pulseDot{0%,100%{opacity:0.4}50%{opacity:1}}`}</style>

      {toast && <div style={{ position: 'fixed', bottom: '26px', left: '50%', transform: 'translateX(-50%)', padding: '12px 22px', borderRadius: '11px', background: 'rgba(20,18,30,0.96)', border: `1px solid ${ACCENT['Intelligent Order']}44`, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', fontFamily: FONT.sans, fontSize: '13.5px', color: '#ECE7DD', zIndex: 70, backdropFilter: 'blur(12px)' }}>{toast}</div>}
    </div>
  );
}
