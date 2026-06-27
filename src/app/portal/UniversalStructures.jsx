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

// ── Natural Allies ─────────────────────────────────────────────
// 60 structures × 3 types (planets, animals, plants) × 2 allies each.
const NATURAL_ALLIES = {
  // ── UNIVERSAL FORMS ──────────────────────────────────────────
  circle: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Wholeness & radiance', use: 'The Sun holds its solar system in a unified field without losing itself. Work with this ally when you need to restore coherence to scattered energy — returning to center before extending outward again.' },
      { name: 'Moon', glyph: '☽', role: 'Cyclical completion', use: 'The Moon completes its circle every 29.5 days without exception. An empowerment ally for projects requiring faithful return to origin — checking that what you started has been honored before beginning again.' },
    ],
    animals: [
      { name: 'Whale', glyph: '🐋', role: 'Deep containment', use: 'Whales navigate vast oceans while holding their pod in a coherent social circle. A restoration ally when belonging feels fractured — use this principle to locate and return to your real center of care.' },
      { name: 'Tortoise', glyph: '🐢', role: 'Carried wholeness', use: 'The tortoise carries its whole home on its back — complete wherever it goes. An empowerment ally for self-sufficiency and internal wholeness that does not depend on external conditions.' },
    ],
    plants: [
      { name: 'Lotus', glyph: '🪷', role: 'Rising to wholeness', use: 'The lotus rises from mud to open a perfect circular bloom above the water. A restoration ally for situations of contamination or difficulty — wholeness is the destination, not the origin.' },
      { name: 'Sunflower', glyph: '🌻', role: 'Solar tracking circle', use: 'Young sunflowers trace the sun\'s arc in a daily circle before setting permanently east. An empowerment ally for the phase of active seeking before you find and commit to your fixed orientation.' },
    ],
  },
  sphere: {
    planets: [
      { name: 'Earth', glyph: '♁', role: 'Stable completeness', use: 'Earth holds life in all its variety within one spherical boundary. A restoration ally when you need to hold more than feels containable — a strong boundary is what makes abundance possible inside.' },
      { name: 'Jupiter', glyph: '♃', role: 'Generous expansion', use: 'Jupiter is the largest sphere in the solar system and acts as a gravitational shield for inner planets. An empowerment ally for those who carry protective responsibility — those whose scale shields others.' },
    ],
    animals: [
      { name: 'Hedgehog', glyph: '🦔', role: 'Spherical self-protection', use: 'The hedgehog rolls into a perfect sphere when threatened. A restoration ally for boundary repair: when you\'ve been too open too long, closing is wisdom, not failure.' },
      { name: 'Blowfish', glyph: '🐡', role: 'Expanded defense', use: 'The blowfish inflates to a sphere when under threat. An empowerment ally for negotiations or situations requiring you to occupy more space than feels natural.' },
    ],
    plants: [
      { name: 'Dandelion', glyph: '🌼', role: 'Spherical dispersal', use: 'The dandelion\'s seed head is a perfect sphere of potential, dispersed by a single breath. A restoration ally for releasing — when something needs to be let go in all directions at once.' },
      { name: 'Coconut', glyph: '🥥', role: 'Protected inner abundance', use: 'The coconut holds water, oil, and flesh inside a nearly indestructible sphere. An empowerment ally for protecting and developing inner resources before they are shared.' },
    ],
  },
  spiral: {
    planets: [
      { name: 'Jupiter', glyph: '♃', role: 'Expansion & growth', use: 'Jupiter governs the force that enlarges without breaking — useful in growth phases, creative blocks, or when a situation needs to be opened rather than solved.' },
      { name: 'Venus', glyph: '♀', role: 'Unfolding beauty', use: 'Venus governs the spiral of attraction and refinement. Invoke this ally when cultivating something that needs to develop slowly into its fullness — relationships, creative work, self-expression.' },
    ],
    animals: [
      { name: 'Nautilus', glyph: '🐚', role: 'Living golden ratio', use: 'The nautilus builds a new chamber at each stage of growth, never abandoning the old — it carries its whole history forward. A restoration ally when you need to honor what you\'ve been while expanding into what you\'re becoming.' },
      { name: 'Hawk', glyph: '🦅', role: 'Ascending spiral flight', use: 'Hawks ride thermal spirals upward with minimal effort. An empowerment ally for gaining altitude and perspective without force — when you need to see the full pattern, not just the next step.' },
    ],
    plants: [
      { name: 'Fern', glyph: '🌿', role: 'Fractal unfolding', use: 'Ferns emerge from a tight coil that unfurls patiently into its full form. A restoration ally when a part of yourself or a project is still tightly wound and needs patient conditions — not force — to open.' },
      { name: 'Sunflower', glyph: '🌻', role: 'Fibonacci spiral seeds', use: 'The sunflower\'s seed head encodes two interlocking spirals. An empowerment ally for any creative or organizational challenge requiring maximum output from ordered structure.' },
    ],
  },
  branching: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Branching communication', use: 'Mercury governs the forking of one signal into many channels. Work with this ally when a message or resource needs to reach many ends simultaneously without losing fidelity.' },
      { name: 'Jupiter', glyph: '♃', role: 'Expansive reach', use: 'Jupiter\'s influence branches outward through opportunity and connection. An empowerment ally for expanding into new territory when it is time to fork and grow, not to consolidate.' },
    ],
    animals: [
      { name: 'Elk', glyph: '🦌', role: 'Antler branching', use: 'An elk grows and sheds its antlers annually — rebuilt from scratch each year. A restoration ally for cyclical renewal of reach: what reaches outward can be shed and regrown stronger.' },
      { name: 'Octopus', glyph: '🐙', role: 'Distributed intelligence', use: 'Two-thirds of an octopus\'s neurons live in its eight arms — intelligence distributed through the branches. An empowerment ally for delegation and decentralized leadership.' },
    ],
    plants: [
      { name: 'Oak', glyph: '🌳', role: 'Deep root, wide branch', use: 'The oak\'s canopy matches the spread of its root system below — its reach is only as wide as its depth. A restoration ally when you\'ve been reaching without deepening: return to the roots before extending further.' },
      { name: 'River Willow', glyph: '🌾', role: 'Flexible branching', use: 'The willow\'s branches bend dramatically without breaking, returning after each storm. An empowerment ally for resilient reach — extending into difficulty without snapping.' },
    ],
  },
  network: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Communication & connection', use: 'Mercury governs all transmission — signals, messages, the channels between nodes. Invoke Mercury when a network is blocked or communication is breaking down.' },
      { name: 'Uranus', glyph: '♅', role: 'Novel connections', use: 'Uranus makes unexpected links — the sudden bridge between unrelated domains. A useful ally when a network has become insular and needs new, unconventional connections.' },
    ],
    animals: [
      { name: 'Mycelium (Fungi)', glyph: '🍄', role: 'Underground web intelligence', use: 'Mycelial networks distribute resources to where they\'re most needed without central control. A restoration ally for community health and collaborative projects.' },
      { name: 'Starling', glyph: '🐦', role: 'Emergent collective intelligence', use: 'A murmuration moves as a single responsive form — no leader, no delay. An empowerment ally for teams learning to act with spontaneous coherence.' },
    ],
    plants: [
      { name: 'Clover', glyph: '🍀', role: 'Soil network enrichment', use: 'Clover fixes nitrogen and improves the soil network for surrounding plants. A restoration ally for depleted communities — one that enriches the ground so others can grow stronger.' },
      { name: 'Banyan Tree', glyph: '🌴', role: 'Aerial root network', use: 'The banyan sends roots from its branches downward until they become new trunks. An empowerment ally for building networks that generate their own support structures as they expand.' },
    ],
  },
  helix: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Structure & continuity', use: 'Saturn governs the encoding of form across time — inheritance, endurance, and the structures that outlast individual lives. Work with Saturn when building something meant to persist beyond you.' },
      { name: 'Mercury', glyph: '☿', role: 'Coded information', use: 'Mercury governs the transmission of coded message across distance. An empowerment ally for any work requiring precise encoding — where the message must arrive intact.' },
    ],
    animals: [
      { name: 'Climbing Vine', glyph: '🌿', role: 'Helical climbing', use: 'Climbing vines wrap their growth in a helix around any available support. An empowerment ally for work that advances by wrapping around existing structures rather than fighting them.' },
      { name: 'DNA Itself', glyph: '🧬', role: 'Living information', use: 'Every living organism carries its complete identity in a double helix in every cell. A restoration ally for identity work — returning to what is fundamentally encoded in you before the distortions of circumstance.' },
    ],
    plants: [
      { name: 'Morning Glory', glyph: '🌸', role: 'Helical tendrils', use: 'Morning glory\'s tendrils spiral clockwise as they climb — a living helix advancing daily. A restoration ally for gradual, faithful advance — consistent small movement in the right direction compounds into height.' },
      { name: 'Pine', glyph: '🌲', role: 'Helical needle arrangement', use: 'Pine needles arrange themselves in a helix around each branch to maximize light capture. An empowerment ally for optimization — finding the arrangement that extracts the most from what is available.' },
    ],
  },
  wave: {
    planets: [
      { name: 'Neptune', glyph: '♆', role: 'Ocean & resonance', use: 'Neptune governs waves, tides, and the diffusion of influence across vast mediums. An empowerment ally for those whose work moves through culture slowly — whose influence travels further than they can see.' },
      { name: 'Sun', glyph: '☉', role: 'Light & transmission', use: 'The Sun transmits its energy across 93 million miles as electromagnetic waves. A restoration ally when energy feels blocked — what radiates from a true source reaches its destination.' },
    ],
    animals: [
      { name: 'Dolphin', glyph: '🐬', role: 'Echolocation & wave navigation', use: 'Dolphins navigate by sending and interpreting sound waves. An empowerment ally for communication-dependent work: send a signal and trust the echo to tell you what\'s true.' },
      { name: 'Cicada', glyph: '🦗', role: 'Synchronized wave emergence', use: 'Cicadas emerge in perfect synchronized waves after years underground. A restoration ally for timing — when something has been building beneath the surface and is ready to emerge in a wave, not a trickle.' },
    ],
    plants: [
      { name: 'Wheat in Wind', glyph: '🌾', role: 'Wave made visible', use: 'A field of wheat makes wind-waves visible — the invisible force made legible in rippling form. A restoration ally for making the unseen tangible: when you need evidence that an invisible influence is moving through the field.' },
      { name: 'Seagrass', glyph: '🌿', role: 'Wave-adapted resilience', use: 'Seagrass bends completely with passing waves and springs back to vertical after each one. An empowerment ally for flexibility without loss of rootedness.' },
    ],
  },
  cycle: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Cyclical renewal', use: 'The Moon\'s 29.5-day cycle is the most visible embodiment of return and renewal. Work consciously with lunar phases — new moon for initiating, full moon for culminating, waning for releasing.' },
      { name: 'Saturn', glyph: '♄', role: 'Completion and closure', use: 'Saturn governs the close of cycles — the accounting, the harvest of what was sown. Invoke Saturn when a cycle refuses to complete, when you\'re holding what should be released.' },
    ],
    animals: [
      { name: 'Salmon', glyph: '🐟', role: 'Full-circle return', use: 'Salmon complete one of nature\'s most demanding cycles — returning to the exact place of their origin to close the loop. A restoration ally when you need to return to a source, complete something unfinished.' },
      { name: 'Monarch Butterfly', glyph: '🦋', role: 'Multigenerational cycle', use: 'The monarch\'s migration is multigenerational — no single butterfly completes it, yet the pattern persists. An empowerment ally for long-arc projects that outlast any single phase of effort.' },
    ],
    plants: [
      { name: 'Oak', glyph: '🌳', role: 'Acorn-to-acorn cycle', use: 'The oak completes its cycle across centuries. A restoration ally for cultivating patience with long cycles and trusting that the return is built into the form.' },
      { name: 'Wheat', glyph: '🌾', role: 'Harvest and seed cycle', use: 'Wheat encodes the full agricultural cycle in a single plant. An empowerment ally for any endeavor with a clear season — planting, tending, harvesting, releasing to seed the next.' },
    ],
  },
  symmetry: {
    planets: [
      { name: 'Venus', glyph: '♀', role: 'Beauty & balance', use: 'Venus governs proportion, harmony, and the aesthetic intelligence that recognizes balance. A restoration ally when you need to restore beauty or coherence to something that has become distorted or harsh.' },
      { name: 'Sun', glyph: '☉', role: 'Radial symmetry', use: 'The Sun radiates equally in all directions — perfect radial symmetry of energy. An empowerment ally when you need to offer the same quality of attention in every direction, without favoritism.' },
    ],
    animals: [
      { name: 'Butterfly', glyph: '🦋', role: 'Bilateral symmetry', use: 'The butterfly\'s wings are a near-perfect mirror image. A restoration ally for integration of opposites: when two sides of a situation or self need to be brought into correspondence.' },
      { name: 'Starfish', glyph: '⭐', role: 'Five-fold symmetry', use: 'A starfish demonstrates five-fold radial symmetry. An empowerment ally for situations with multiple stakeholders requiring equal care from a single center.' },
    ],
    plants: [
      { name: 'Snowflake Crystal', glyph: '❄️', role: 'Six-fold symmetry', use: 'No two snowflakes are identical, yet all express six-fold symmetry — individuality within universal law. A restoration ally for reconciling personal uniqueness with the demands of a shared order.' },
      { name: 'Rose', glyph: '🌹', role: 'Spiral symmetry', use: 'The rose arranges its petals in a symmetrical spiral that is also mathematically perfect. An empowerment ally for creative work that must be both orderly and beautiful.' },
    ],
  },
  fractal: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Rings within rings', use: 'Saturn\'s ring system is fractal — structure at every scale. Work with this ally when designing systems that must be coherent at every level — from the smallest interaction to the largest structure.' },
      { name: 'Uranus', glyph: '♅', role: 'Recursive order', use: 'Uranus governs recursion — the same logic appearing at different scales. An empowerment ally for working with complex systems: find the simple rule that generates the whole.' },
    ],
    animals: [
      { name: 'Crow', glyph: '🐦', role: 'Recursive problem solving', use: 'Crows use recursive logic — solving problems that require thinking through multi-step consequences. An empowerment ally for strategic planning when a situation requires thinking several orders deep.' },
      { name: 'Romanesco Broccoli', glyph: '🥦', role: 'Visible fractal growth', use: 'Romanesco is one of nature\'s clearest fractal forms — each spire a miniature of the whole. A restoration ally for self-similar consistency: ensuring your values show up at every scale of your life.' },
    ],
    plants: [
      { name: 'Fern', glyph: '🌿', role: 'Self-similar fronds', use: 'Each fern frond is a miniature of the whole leaf. A restoration ally for finding the essential pattern in complexity — zoom out until you see the same shape repeating at every level.' },
      { name: 'Cauliflower', glyph: '🥦', role: 'Nested self-similarity', use: 'Cauliflower\'s structure nests itself inside itself through multiple iterations. An empowerment ally for building organizations where the culture of the whole is visible in every team and every interaction.' },
    ],
  },
  goldenRatio: {
    planets: [
      { name: 'Venus', glyph: '♀', role: 'Harmonic proportion', use: 'Venus traces a five-pointed star — a golden ratio figure — in the sky over eight years. Work with Venus for calibrating proportion: the golden ratio is not decoration, it is the proportion that growth finds naturally.' },
      { name: 'Neptune', glyph: '♆', role: 'Aesthetic harmony', use: 'Neptune governs the sense that something is deeply right. A restoration ally when something feels off-balance without your being able to say why: find the proportion that resolves the dissonance.' },
    ],
    animals: [
      { name: 'Nautilus', glyph: '🐚', role: 'Golden spiral shell', use: 'The nautilus shell is a near-perfect golden spiral. An empowerment ally for growth that preserves its essential form — expanding while remaining recognizably itself at every stage.' },
      { name: 'Honeybee', glyph: '🐝', role: 'Golden ratio in hive', use: 'Honeybee colonies maintain a golden ratio between workers and drones. A restoration ally for proportional balance in any community — the right ratio between different kinds of contribution sustains the whole.' },
    ],
    plants: [
      { name: 'Pinecone', glyph: '🌲', role: 'Fibonacci spirals', use: 'Pinecone scales arrange in Fibonacci spirals — a direct expression of the golden ratio. An empowerment ally for arrangements and systems: when the order of things matters as much as the things themselves.' },
      { name: 'Aloe Vera', glyph: '🌵', role: 'Spiral leaf arrangement', use: 'Aloe vera\'s leaves spiral from the center in golden ratio increments. A restoration ally for personal organization — arrange your commitments so that nothing blocks the light from reaching the whole.' },
    ],
  },
  tessellation: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Hexagonal pole', use: 'Saturn\'s north pole features a persistent hexagonal storm — tessellation at planetary scale. An empowerment ally for large-scale coordination: when many pieces must fit together without gaps.' },
      { name: 'Earth', glyph: '♁', role: 'Tectonic tiling', use: 'Earth\'s tectonic plates tessellate to cover the whole surface. A restoration ally for working with boundaries: each domain must know exactly where it ends and where the next begins.' },
    ],
    animals: [
      { name: 'Honeybee', glyph: '🐝', role: 'Hexagonal honeycomb', use: 'Bees tessellate perfect hexagons — the most efficient shape for covering a surface with the least wax. An empowerment ally for resource-constrained design: maximum coverage, minimum material.' },
      { name: 'Pangolin', glyph: '🦔', role: 'Scale tessellation', use: 'Pangolin scales tessellate perfectly to cover the whole body without gaps. A restoration ally for protection that is complete — no exposure, no overlap, every part covered.' },
    ],
    plants: [
      { name: 'Duckweed', glyph: '🌿', role: 'Surface tessellation', use: 'Duckweed tessellates across a water surface — tiny plants covering every gap, collectively. An empowerment ally for distributed effort: many small consistent acts together leave no surface uncovered.' },
      { name: 'Cactus Surface', glyph: '🌵', role: 'Geometric surface tiling', use: 'Some cacti develop perfect tessellated surface patterns. A restoration ally for sustainable coverage: how to cover the most ground with what you have, without strain or waste.' },
    ],
  },
  vortex: {
    planets: [
      { name: 'Mars', glyph: '♂', role: 'Concentrated force', use: 'Mars governs concentrated, focused action — energy gathered and released toward a point. Work with Mars when you need to stop diffusing effort and gather everything toward a single center of action.' },
      { name: 'Jupiter', glyph: '♃', role: 'Great Red Spot vortex', use: 'Jupiter\'s Great Red Spot is a storm vortex that has persisted for centuries. A restoration ally for sustained, self-renewing focus — maintained across a very long time by drawing continuously on what surrounds it.' },
    ],
    animals: [
      { name: 'Eagle', glyph: '🦅', role: 'Vortex dive', use: 'Eagles fold into a vortex when diving — concentrating everything toward a single point of contact. An empowerment ally for decisive action: when the moment for circling has passed and everything must be concentrated into one decisive move.' },
      { name: 'Shark', glyph: '🦈', role: 'Vortex predator efficiency', use: 'Sharks move through water with almost no turbulence — their form creates a clean vortex behind them. A restoration ally for moving through resistance: streamline rather than force.' },
    ],
    plants: [
      { name: 'Venus Flytrap', glyph: '🌿', role: 'Concentrated capture', use: 'The Venus flytrap concentrates everything into a single rapid closing motion. An empowerment ally for high-stakes moments requiring total commitment: when you have one chance to close, gather everything and release it in that instant.' },
      { name: 'Pitcher Plant', glyph: '🌱', role: 'Vortex trap', use: 'Pitcher plants use a downward spiral interior to prevent escape. A restoration ally for containment: when something needs to be held rather than released, use the inward spiral.' },
    ],
  },
  torus: {
    planets: [
      { name: 'Earth\'s Magnetosphere', glyph: '♁', role: 'Toroidal field protection', use: 'Earth\'s magnetic field forms a torus — pouring out at the poles, wrapping around, feeding back in. A restoration principle when your energy is leaking: the torus asks that output curves back to nourish your source before it dissipates.' },
      { name: 'Sun', glyph: '☉', role: 'Solar toroidal flow', use: 'The Sun\'s magnetic field circulates in a toroidal structure. An empowerment ally for sustainable output — what you give out must find a way to return to you, not as selfishness but as the physics of sustained giving.' },
    ],
    animals: [
      { name: 'Jellyfish', glyph: '🪼', role: 'Toroidal locomotion', use: 'Jellyfish move by creating a toroidal vortex with each pulse — the most energy-efficient locomotion in the animal kingdom. An empowerment ally for effortless advancement: when you\'re working too hard to move forward, is your effort circling back to power itself?' },
      { name: 'Hummingbird', glyph: '🐦', role: 'Toroidal wing vortex', use: 'Hummingbirds generate a toroidal vortex with each wingbeat that enables hovering. A restoration ally for sustained presence in one place — when the moment requires staying still and engaged rather than advancing.' },
    ],
    plants: [
      { name: 'Apple', glyph: '🍎', role: 'Toroidal form', use: 'An apple is topologically a torus — its stem to core channel making it a closed loop of nutrition. A restoration ally for nourishment that feeds the cycle: what in your life completes a loop rather than ending in consumption?' },
      { name: 'Sunflower Head', glyph: '🌻', role: 'Self-returning center', use: 'The sunflower\'s head is organized around a center that feeds its own perimeter, which feeds the center. An empowerment ally for self-sustaining systems — built to nourish itself from its own outputs.' },
    ],
  },
  catenary: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Structural efficiency', use: 'Saturn\'s rings distribute mass in exactly the catenary proportion — the shape that carries load with the least material. Work with Saturn when designing anything that must hold weight: seek the curve that distributes, not the wall that resists.' },
      { name: 'Moon', glyph: '☽', role: 'Arc and trajectory', use: 'The Moon holds its position in the catenary-like balance between Earth\'s gravity and its own momentum. A restoration ally for finding your natural position: not the one you force, but the one the forces around you would naturally hold you in.' },
    ],
    animals: [
      { name: 'Spider', glyph: '🕷️', role: 'Catenary web threads', use: 'Spider silk hangs in a catenary curve between anchor points — the strongest possible shape for a hanging structure. An empowerment ally for load-bearing work: when you must hold tension across a span, the catenary does it with least strain.' },
      { name: 'Elephant', glyph: '🐘', role: 'Arch spine structure', use: 'The elephant\'s spine arches in a catenary — distributing enormous weight efficiently to four points. A restoration ally for those carrying more than feels sustainable: are you distributing load properly, or concentrating it at a weak point?' },
    ],
    plants: [
      { name: 'Weeping Willow', glyph: '🌿', role: 'Catenary drape', use: 'Weeping willow branches hang in perfect catenary curves — grace achieved through yielding to gravity rather than resisting it. An empowerment ally for flexible strength: achieving the most beautiful form by surrendering to what pulls it down.' },
      { name: 'Grapevine', glyph: '🍇', role: 'Hanging abundance', use: 'Grapevines hang their fruit in catenary clusters — weight distributed along the natural curve. A restoration ally for bearing fruit without strain: find the shape that lets the harvest hang naturally.' },
    ],
  },
  gradient: {
    planets: [
      { name: 'Mars', glyph: '♂', role: 'Pressure gradient drive', use: 'Mars\'s thin atmosphere creates sharp gradients that drive its intense dust storms. An empowerment ally when a situation requires creating a strong differential to generate movement.' },
      { name: 'Neptune', glyph: '♆', role: 'Depth gradient', use: 'Neptune\'s atmospheric layers create gradients of pressure and temperature. A restoration ally for situations requiring transition rather than sudden change: the gradient is the kinder teacher.' },
    ],
    animals: [
      { name: 'Salmon', glyph: '🐟', role: 'Chemical gradient navigation', use: 'Salmon navigate home by following chemical gradients in the water. A restoration ally for finding your way back: when you\'re lost, follow the gradient toward what feels increasingly right, not the map.' },
      { name: 'Migratory Bird', glyph: '🦢', role: 'Magnetic gradient sensing', use: 'Migratory birds sense Earth\'s magnetic gradient to navigate. An empowerment ally for orientation in uncertainty: trust the internal sensing that detects increasing rightness.' },
    ],
    plants: [
      { name: 'Mangrove', glyph: '🌿', role: 'Salinity gradient life', use: 'Mangroves thrive in the gradient between salt water and fresh — a zone most plants cannot survive. A restoration ally for in-between conditions: the gradient zone is an ecological niche that supports forms of life nothing else can.' },
      { name: 'Alpine Flowers', glyph: '🌸', role: 'Altitude gradient', use: 'Alpine flowers grow in the gradient between harsh rock and sheltered valley — small, potent, specialized. An empowerment ally for finding the narrow band where you thrive: not everywhere, but exactly in your gradient.' },
    ],
  },
  foam: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Cratered partitioning', use: 'The Moon\'s surface is partitioned by overlapping craters into foam-like cells. Work with this ally when organizing a shared space where many domains must coexist with minimal boundary material.' },
      { name: 'Saturn', glyph: '♄', role: 'Ring foam structure', use: 'Saturn\'s rings contain foam-like clumping structures. An empowerment ally for resource-efficient organization: when you have many things to hold and must use the least possible separating material.' },
    ],
    animals: [
      { name: 'Sea Sponge', glyph: '🧽', role: 'Foam-structured filter', use: 'Sea sponges are essentially living foam — porous structure that filters enormous volumes through minimal material. A restoration ally for high-throughput work: maximize contact surface when you need to process much through little.' },
      { name: 'Coral', glyph: '🪸', role: 'Calcified foam colony', use: 'Coral builds a foam-like calcium structure — many cells sharing walls, creating immense shelter from tiny effort. An empowerment ally for collective building across time.' },
    ],
    plants: [
      { name: 'Cactus Interior', glyph: '🌵', role: 'Water-storing foam cells', use: 'Cactus interiors are foam-like cellular structures that store water with maximum efficiency. A restoration ally for holding more than seems possible: the foam stores by sharing walls.' },
      { name: 'Mushroom Cap', glyph: '🍄', role: 'Foam gill structure', use: 'Mushroom gills are a foam-like structure maximizing spore surface. An empowerment ally for dispersal and reach: when you need to touch the largest possible surface, increase internal complexity rather than just size.' },
    ],
  },
  threshold: {
    planets: [
      { name: 'Pluto', glyph: '♇', role: 'Irreversible transformation', use: 'Pluto governs thresholds that, once crossed, cannot be uncrossed — death, birth, fundamental transformation. Work with Pluto when you are at a threshold that requires honest naming: this is a one-way door, and crossing it changes everything.' },
      { name: 'Saturn', glyph: '♄', role: 'Time thresholds', use: 'Saturn marks life thresholds at ages 29, 58, and 87 that bring fundamental reevaluation. A restoration ally for threshold recognition: when what you\'re experiencing is not a setback but a developmental gate.' },
    ],
    animals: [
      { name: 'Caterpillar', glyph: '🐛', role: 'Metamorphosis threshold', use: 'Inside the chrysalis, the caterpillar dissolves almost completely before reorganizing as a butterfly. A restoration ally for complete transformations: when what is happening is not a change of degree but a change of kind.' },
      { name: 'Snake', glyph: '🐍', role: 'Shedding threshold', use: 'A snake cannot grow without shedding — the skin that protected it becomes the constraint that must be released. An empowerment ally for threshold readiness: what you are outgrowing must be left behind for the next form to emerge.' },
    ],
    plants: [
      { name: 'Seed Germination', glyph: '🌱', role: 'Dormancy threshold', use: 'A seed crosses a threshold — warmth, moisture, light — after which germination is irreversible. A restoration ally for identifying your own threshold conditions: what specific combination, when present, makes your next phase inevitable?' },
      { name: 'Bamboo', glyph: '🎋', role: 'Sudden visible threshold', use: 'Bamboo grows its root system for years with nothing visible above ground, then surges upward. An empowerment ally for trust in invisible preparation: the threshold will come.' },
    ],
  },
  feedbackLoop: {
    planets: [
      { name: 'Earth', glyph: '♁', role: 'Climate feedback systems', use: 'Earth\'s climate operates through interlocking feedback loops. Work with Earth when designing self-regulating processes: build in the return signal before the system grows too large to correct.' },
      { name: 'Moon', glyph: '☽', role: 'Tidal feedback', use: 'The Moon\'s tidal feedback with Earth has been gradually synchronizing the Moon\'s rotation for billions of years. A restoration ally for patient self-regulation: the feedback loop works, but it works over a long time.' },
    ],
    animals: [
      { name: 'Bat', glyph: '🦇', role: 'Echolocation feedback', use: 'Bats send signals and use the returning echo to navigate in real time. An empowerment ally for iterative work: the key is not the signal you send but your quality of listening to the return.' },
      { name: 'Humpback Whale', glyph: '🐋', role: 'Song feedback culture', use: 'Humpback whale songs change annually through cultural feedback — innovations spread until the whole population adopts them. A restoration ally for cultural change through the loop of imitation and adoption.' },
    ],
    plants: [
      { name: 'Sundew', glyph: '🌿', role: 'Sensory feedback capture', use: 'The sundew triggers its capture mechanism only when a specific feedback threshold is met — multiple touches confirming real prey. An empowerment ally for decision-making: wait for the feedback loop to confirm, not just the first signal.' },
      { name: 'Mimosa', glyph: '🌱', role: 'Touch-response feedback', use: 'The mimosa folds its leaves on touch and reopens when the threat has passed — a visible feedback loop. A restoration ally for recovery: the folding is not damage, it is appropriate response; reopening comes when the signal says it is safe.' },
    ],
  },
  lattice: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Ring lattice structure', use: 'Saturn\'s rings form a lattice of orbiting particles — a framework that distributes mass across an enormous plane. Work with Saturn for building frameworks that distribute load evenly — the lattice is strong because no single point carries everything.' },
      { name: 'Uranus', glyph: '♅', role: 'Crystal lattice regularity', use: 'Uranus governs the geometric regularity underlying physical forms. A restoration ally for bringing regularity to a chaotic situation — find the underlying unit that can be tiled to create the whole.' },
    ],
    animals: [
      { name: 'Spider', glyph: '🕷️', role: 'Web lattice', use: 'A spider\'s web is a radial lattice — regular enough to hold and catch, varied enough to be unpredictable. An empowerment ally for building catch structures: a good lattice catches what comes to it; you don\'t need to chase.' },
      { name: 'Firefly', glyph: '✨', role: 'Synchronized lattice signaling', use: 'In some species, fireflies synchronize into a spatially-distributed lattice of coordinated light. A restoration ally for coordination without central control: each aligns to neighbors, not to a single center.' },
    ],
    plants: [
      { name: 'Leaf Venation', glyph: '🍃', role: 'Supply lattice', use: 'A leaf\'s vein network is a lattice that guarantees every cell is within two cells of supply. An empowerment ally for organizational design: what is the lattice that puts every person within reach of what they need?' },
      { name: 'Timber Bamboo', glyph: '🎋', role: 'Structural lattice', use: 'Bamboo\'s hollow interior with regularly spaced nodes forms an internal lattice. A restoration ally for structural integrity from lightness — strong without being heavy, distributing what must be held across many internal nodes.' },
    ],
  },
  // ── HEAVENLY BODIES ──────────────────────────────────────────
  galaxy: {
    planets: [
      { name: 'Jupiter', glyph: '♃', role: 'Ordered vastness', use: 'Jupiter holds its moon system in an ordered array that mirrors galactic structure at smaller scale. Work with Jupiter when the scale of what you are building feels overwhelming — the same organizing principle works at every size.' },
      { name: 'Sun', glyph: '☉', role: 'Central radiance', use: 'The Sun is the center of its own miniature galaxy. A restoration ally for those who have lost their center: galactic structure does not work without a clear, stable, radiating center. What is yours?' },
    ],
    animals: [
      { name: 'Starling Murmuration', glyph: '🐦', role: 'Spiral collective motion', use: 'Murmurations of starlings form galaxy-like spirals in the sky. An empowerment ally for leading large collectives without central control — each unit responds locally to its neighbors.' },
      { name: 'Migratory Eel', glyph: '🐍', role: 'Navigating vast scales', use: 'European eels navigate thousands of miles across ocean and river. A restoration ally for navigating at a scale that feels too large to comprehend — trust the encoded direction when the full map cannot be seen.' },
    ],
    plants: [
      { name: 'Giant Sequoia', glyph: '🌲', role: 'Long-scale presence', use: 'Giant sequoias live for over 3,000 years — their scale is galactic in time if not space. An empowerment ally for building with a truly long horizon.' },
      { name: 'Mycelium Network', glyph: '🍄', role: 'Vast distributed web', use: 'A single mycelial network can span hundreds of acres — a galaxy of connection beneath the surface. A restoration ally for invisible large-scale influence: the network does not need to be seen to be real.' },
    ],
  },
  solarSystem: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Harmonic center', use: 'The Sun holds nine wildly different bodies in stable, harmonious relationship. Work with the Sun for centering complex systems: the question is what is the center strong enough to hold them all.' },
      { name: 'Jupiter', glyph: '♃', role: 'Protective mass', use: 'Jupiter\'s gravitational mass shields inner planets from most asteroid impacts. A restoration ally for those in protective roles: sometimes your most important function is the threats you intercept before they reach those closer to the center.' },
    ],
    animals: [
      { name: 'Wolf Pack', glyph: '🐺', role: 'Hierarchical harmony', use: 'A wolf pack maintains harmony through clear, respected roles. An empowerment ally for organizational clarity: harmony requires clear relational structure, not just goodwill.' },
      { name: 'Elephant Herd', glyph: '🐘', role: 'Matriarchal solar system', use: 'An elephant herd orbits its matriarch — the one whose wisdom holds the group in coherence. A restoration ally for identifying who holds the real center of your relational system.' },
    ],
    plants: [
      { name: 'Old Growth Forest', glyph: '🌲', role: 'Ecosystem solar system', use: 'An old-growth forest is its own solar system — a center tree connected to a web of relationships at every distance. An empowerment ally for ecosystem building.' },
      { name: 'Fig Tree', glyph: '🌳', role: 'Keystone solar system', use: 'The fig tree supports 1,274 other species — the solar center of its ecological system. A restoration ally for keystone roles: what are you the center of, and are you tending that responsibility?' },
    ],
  },
  orbit: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Faithful orbital return', use: 'The Moon has kept its orbit for 4.5 billion years without missing a cycle. An empowerment ally for reliability and faithful return: the most powerful commitments are the ones that orbit without exception.' },
      { name: 'Mercury', glyph: '☿', role: 'Rapid orbit', use: 'Mercury completes an orbit every 88 days — the fastest planet, closest to the center. A restoration ally when you\'ve been moving too slowly: proximity to the source sometimes requires faster cycling.' },
    ],
    animals: [
      { name: 'Arctic Tern', glyph: '🦢', role: 'Orbital migration', use: 'The Arctic tern makes an annual pole-to-pole migration — the most orbital path of any creature. An empowerment ally for commitments requiring full-cycle completion: the tern does not stop halfway.' },
      { name: 'Homing Pigeon', glyph: '🕊️', role: 'Reliable return', use: 'Homing pigeons always return — their commitment to orbit is encoded. A restoration ally for loyalty and return: when you need to commit to being the one who comes back.' },
    ],
    plants: [
      { name: 'Annual Flowers', glyph: '🌸', role: 'Seasonal orbital return', use: 'Annual flowers complete their full orbit in one year — seed to flower to seed — and return the following year. An empowerment ally for annual commitments: a full orbit completed, then willingly begun again.' },
      { name: 'Deciduous Trees', glyph: '🍂', role: 'Orbital shedding and renewal', use: 'Deciduous trees orbit through full seasonal cycles of growth and release. A restoration ally for the shedding phase of your orbit: the leaf must fall before the next can come.' },
    ],
  },
  planet: {
    planets: [
      { name: 'Earth', glyph: '♁', role: 'Living stability', use: 'Earth maintains conditions for life through constant self-regulation. A restoration ally when your own conditions for living have become destabilized: what does your inner Earth need to rebalance?' },
      { name: 'Venus', glyph: '♀', role: 'Extreme example', use: 'Venus shows what a planet becomes without regulatory feedback loops. A restoration ally for recognizing runaway conditions: when a system has lost its regulating feedback, Venus shows the direction of unchecked drift.' },
    ],
    animals: [
      { name: 'Earthworm', glyph: '🪱', role: 'Planetary soil health', use: 'Earthworms are the stewards of planetary soil health — their work makes the ground fertile enough to support all land life. An empowerment ally for foundational, unglamorous work.' },
      { name: 'Bee', glyph: '🐝', role: 'Planetary pollination', use: 'Bees are responsible for one-third of all food humans eat. A restoration ally for those whose work touches more than they can see — the bee does not know it is holding the food system together.' },
    ],
    plants: [
      { name: 'Phytoplankton', glyph: '🌊', role: 'Planetary oxygen', use: 'Phytoplankton produce 50–80% of Earth\'s oxygen. An empowerment ally for invisible foundational contribution: the work that makes everything else possible is often invisible and unremarkable from the outside.' },
      { name: 'Amazon Rainforest', glyph: '🌳', role: 'Planetary climate regulation', use: 'The Amazon regulates planetary rainfall patterns across South America. A restoration ally for those in stewardship roles: what is the living system you maintain that regulates far more than your immediate environment?' },
    ],
  },
  moon: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Reflected light', use: 'The Moon shines not by its own light but by faithfully reflecting the Sun. A restoration ally when your role is to reflect rather than originate — the reflected light is not lesser than the source.' },
      { name: 'Neptune', glyph: '♆', role: 'Tidal pull', use: 'Neptune governs the deep emotional pull of cycles, tides, and the unconscious. An empowerment ally for understanding the invisible forces that move people: the strongest influences are often the ones that cannot be directly seen.' },
    ],
    animals: [
      { name: 'Sea Turtle', glyph: '🐢', role: 'Lunar navigation', use: 'Sea turtles navigate to their birth beach guided by the Moon and stars. A restoration ally for returning to origin: the encoded direction home is still present, waiting to be followed.' },
      { name: 'Wolf', glyph: '🐺', role: 'Lunar resonance', use: 'Wolves are deeply responsive to lunar cycles. An empowerment ally for working with cycles rather than against them: the wolf does not question the Moon\'s influence, it lives within it.' },
    ],
    plants: [
      { name: 'Night-Blooming Flowers', glyph: '🌸', role: 'Lunar timing', use: 'Night-blooming plants time their bloom to the Moon and nocturnal pollinators. A restoration ally for those whose timing is different from the solar majority, but perfectly calibrated to their own conditions.' },
      { name: 'Tidal Seaweeds', glyph: '🌿', role: 'Lunar rhythm responsiveness', use: 'Tidal seaweeds grow and reproduce in synchrony with lunar cycles. An empowerment ally for biological timing: align your significant acts with the phase that matches their nature.' },
    ],
  },
  stars: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Life-giving star', use: 'The Sun gives constantly without diminishing. An empowerment ally for generosity that does not drain: what radiates from a true source is not lost in the giving.' },
      { name: 'Fixed Stars', glyph: '★', role: 'Navigational fixed point', use: 'Fixed stars have been reference points for navigation for millennia. A restoration ally for orientation: find your fixed star — the value or commitment that does not move — and navigate from there.' },
    ],
    animals: [
      { name: 'Firefly', glyph: '✨', role: 'Bioluminescent light', use: 'Fireflies produce their own cold light. An empowerment ally for self-generated illumination: find the light you produce from within, not merely reflected light of others\' approval.' },
      { name: 'Dung Beetle', glyph: '🪲', role: 'Stellar navigation', use: 'Dung beetles navigate by the Milky Way — the only known insect to use stars for orientation. A restoration ally for finding direction from vastness: the right orientation point may be far away and faint, but it is reliable.' },
    ],
    plants: [
      { name: 'Star Anise', glyph: '⭐', role: 'Star-shaped form', use: 'Star anise grows in a perfect eight-pointed star. An empowerment ally for radiating from a center in all directions with equal intensity.' },
      { name: 'Astrantia', glyph: '🌸', role: 'Star flower structure', use: 'Astrantia flowers are organized in a star pattern. A restoration ally for radiating care equally in all directions when you must tend multiple relationships simultaneously.' },
    ],
  },
  // ── EARTH ────────────────────────────────────────────────────
  mountains: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Endurance and depth', use: 'Saturn governs what is built to last — permanence through depth of foundation. Work with Saturn for building anything meant to endure: slow, thorough, rooted in what will not shift.' },
      { name: 'Mars', glyph: '♂', role: 'Volcanic uplift', use: 'Mars has the solar system\'s tallest mountain — Olympus Mons. A restoration ally for those who have risen through difficulty: the highest peaks are often formed by the most intense pressures acting over the longest times.' },
    ],
    animals: [
      { name: 'Snow Leopard', glyph: '🐆', role: 'Mountain mastery', use: 'Snow leopards move with extraordinary sureness across terrain that would stop most creatures. An empowerment ally for high-altitude work: the mountain is your natural territory. What expertise lets you move where others cannot?' },
      { name: 'Golden Eagle', glyph: '🦅', role: 'Summit perspective', use: 'Golden eagles nest at altitude and hunt from the height of mountains. A restoration ally for regaining perspective: when you\'ve been too close to a problem, return to altitude to see the whole landscape.' },
    ],
    plants: [
      { name: 'Edelweiss', glyph: '🌸', role: 'High-altitude resilience', use: 'Edelweiss grows only at high altitude, in thin air and harsh conditions. An empowerment ally for those who thrive in demanding conditions: the conditions that screen out others are the ones that make you.' },
      { name: 'Mountain Pine', glyph: '🌲', role: 'Wind-shaped endurance', use: 'Mountain pines growing at treeline are sculpted by constant wind into dramatic bent forms — still alive, completely adapted. A restoration ally for those who have been bent but not broken by circumstances.' },
    ],
  },
  rivers: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Tidal flow', use: 'The Moon\'s gravity moves the largest bodies of water on Earth. Work with the Moon when working with large-scale flow: the most powerful influence on a river is not inside it but above it.' },
      { name: 'Neptune', glyph: '♆', role: 'Flow and yielding', use: 'Neptune governs water in all its forms — its essential quality is yielding to find the path. A restoration ally for persistent, soft movement through difficulty: the river does not fight the rock; it finds the way around.' },
    ],
    animals: [
      { name: 'River Otter', glyph: '🦦', role: 'Joyful flow navigation', use: 'River otters navigate current and obstacles with playful efficiency. An empowerment ally for finding delight in the navigation itself: use the current rather than fight it, and enjoy the motion.' },
      { name: 'Beaver', glyph: '🦫', role: 'Intentional flow shaping', use: 'Beavers reshape rivers to create the conditions they need. A restoration ally for those who must work with their environment rather than wait for it to change: the beaver does not complain about the river; it builds.' },
    ],
    plants: [
      { name: 'Willow', glyph: '🌿', role: 'Riverbank stabilization', use: 'Willows root deeply along riverbanks, preventing erosion while bending completely with the water. An empowerment ally for flexible stability: your deepest roots allow your branches to bend without breaking.' },
      { name: 'Lotus', glyph: '🪷', role: 'Rising through water', use: 'The lotus rises through water and mud to bloom above the surface. A restoration ally for emergence from difficulty: the water that seems to be the problem is also what the lotus requires to bloom.' },
    ],
  },
  oceans: {
    planets: [
      { name: 'Neptune', glyph: '♆', role: 'Depth and mystery', use: 'Neptune governs the vast, largely unexplored depths of experience. A restoration ally when you need to stop skimming the surface and go deep: most of the ocean is unmapped, and so are most of us.' },
      { name: 'Moon', glyph: '☽', role: 'Tidal rhythm', use: 'The Moon pulls the oceans in a global rhythm that has not missed a cycle in 4.5 billion years. An empowerment ally for long-sustained, rhythmic work.' },
    ],
    animals: [
      { name: 'Blue Whale', glyph: '🐋', role: 'Deep abundance', use: 'The blue whale is the largest creature that has ever lived on Earth. An empowerment ally for those operating at large scale: the blue whale does not apologize for its size; the ocean sustains what it requires.' },
      { name: 'Deep Sea Fish', glyph: '🐟', role: 'Thriving in depth', use: 'Deep sea creatures have adapted to conditions that would destroy surface life. A restoration ally for finding your natural depth: you are not broken by the pressure; you are adapted to it.' },
    ],
    plants: [
      { name: 'Kelp Forest', glyph: '🌿', role: 'Underwater forest abundance', use: 'Kelp forests support as much biodiversity as tropical rainforests, entirely hidden beneath the surface. A restoration ally for invisible abundance: the richest ecosystems are sometimes the ones no one can see from above.' },
      { name: 'Sea Grass Meadows', glyph: '🌿', role: 'Oceanic foundation', use: 'Sea grass meadows support fisheries that feed billions while sequestering carbon. An empowerment ally for foundational, unrecognized contribution: the work that makes everything else possible.' },
    ],
  },
  forests: {
    planets: [
      { name: 'Jupiter', glyph: '♃', role: 'Interconnected abundance', use: 'Jupiter governs the principle of abundance through interconnection. Work with Jupiter for building forest-like systems: diverse, layered, deeply interconnected.' },
      { name: 'Earth', glyph: '♁', role: 'Living interdependence', use: 'Earth\'s forests are one of the planet\'s primary life-support systems. A restoration ally for remembering your own interdependence: no tree is truly separate from its forest.' },
    ],
    animals: [
      { name: 'Wild Boar', glyph: '🐗', role: 'Forest regeneration', use: 'Wild boars till the forest floor as they forage, opening soil for new growth. An empowerment ally for disruptive renewal: the boar\'s disturbance looks like damage but enables the next generation of growth.' },
      { name: 'Woodpecker', glyph: '🐦', role: 'Forest architect', use: 'Woodpeckers create cavities that become homes for dozens of other species. A restoration ally for generative work: by doing what you do naturally, you create conditions that benefit others who would otherwise have no home.' },
    ],
    plants: [
      { name: 'Mother Tree', glyph: '🌲', role: 'Hub tree of the forest web', use: 'Old mother trees are hubs of the forest\'s mycorrhizal network — feeding seedlings, sharing resources through drought. An empowerment ally for elder and mentor roles: the mother tree does not compete with the seedlings; she sustains them.' },
      { name: 'Moss', glyph: '🌿', role: 'Forest floor preparation', use: 'Moss prepares the forest floor for larger plants — retaining moisture, breaking down rock, building soil. A restoration ally for foundational preparation that makes everything else possible.' },
    ],
  },
  soil: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Hidden depth', use: 'Saturn governs what is built through patient, hidden work. Work with Saturn for soil-like preparation: the richest ground is made by the slowest processes, invisible until the harvest makes them undeniable.' },
      { name: 'Pluto', glyph: '♇', role: 'Transformation through decomposition', use: 'Pluto governs decomposition and the transformation of what has ended into what can begin. A restoration ally for working with endings: what has died in your life is becoming the soil for what comes next.' },
    ],
    animals: [
      { name: 'Earthworm', glyph: '🪱', role: 'Living soil builder', use: 'Earthworms are the most important soil-building creatures on Earth. An empowerment ally for unglamorous foundational work: the earthworm moves through the dark, turning what has ended into what makes growth possible.' },
      { name: 'Dung Beetle', glyph: '🪲', role: 'Recycler and enricher', use: 'Dung beetles bury waste, enriching the soil while removing what would otherwise contaminate the surface. A restoration ally for transformative work: what others discard, you convert into fertility.' },
    ],
    plants: [
      { name: 'Clover', glyph: '🍀', role: 'Nitrogen fixation', use: 'Clover enriches the soil by fixing nitrogen from the air — giving to the ground more than it takes. An empowerment ally for generous contribution that builds capacity for others.' },
      { name: 'Decomposing Leaves', glyph: '🍂', role: 'Return to soil', use: 'Fallen leaves decompose into the richest soil. A restoration ally for release: what falls and seems lost is actually entering the most generative phase of its existence.' },
    ],
  },
  seasons: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Seasonal driver', use: 'Earth\'s tilt relative to the Sun creates all seasons. Work with the Sun when understanding that no season is the Sun\'s preference — it simply shines; the angle changes. The seasons are in you, not in the source.' },
      { name: 'Saturn', glyph: '♄', role: 'Winter and necessary limitation', use: 'Saturn governs the winter principle — limitation, dormancy, and the productive stillness that prepares the next spring. A restoration ally for winter phases: limitation is not punishment; it is preparation.' },
    ],
    animals: [
      { name: 'Bear', glyph: '🐻', role: 'Hibernation and restoration', use: 'Bears enter true hibernation in winter — a state of deep restoration that makes spring\'s activity possible. An empowerment ally for deliberate rest: the bear\'s winter is not a failure to produce; it is what makes the summer\'s abundance possible.' },
      { name: 'Salmon', glyph: '🐟', role: 'Seasonal timing', use: 'Salmon spawn in autumn with perfect seasonal timing — everything built toward that one act, in that one season. A restoration ally for seasonal action: know which season is yours, and be fully present for it.' },
    ],
    plants: [
      { name: 'Tulip', glyph: '🌷', role: 'Spring emergence', use: 'Tulips require a cold winter to bloom in spring. An empowerment ally for those emerging from a hard season: the cold was required; the bloom is not despite the winter but because of it.' },
      { name: 'Oak in Autumn', glyph: '🍂', role: 'Graceful release', use: 'The oak releases its leaves completely in autumn — no hesitation, no attachment. A restoration ally for releasing what the season is asking you to let go of: the oak does not grieve its leaves.' },
    ],
  },
  // ── HUMAN BODY ──────────────────────────────────────────────
  brain: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Mental integration', use: 'Mercury governs thought, communication, and the integration of perception. Work with Mercury for cognitive work — particularly when disparate pieces need to be woven into a coherent understanding.' },
      { name: 'Uranus', glyph: '♅', role: 'Neural innovation', use: 'Uranus governs the sudden, unexpected connection — the insight that reorganizes everything. A restoration ally for creative blocks: the brain under Uranus\'s principle doesn\'t think harder; it relaxes until the unexpected link appears.' },
    ],
    animals: [
      { name: 'Crow', glyph: '🐦', role: 'Tool use and insight', use: 'Crows demonstrate insight-based problem solving — the sudden realization of a solution rather than trial and error. An empowerment ally for problems that don\'t yield to analysis: step back and wait for the flash of seeing.' },
      { name: 'Elephant', glyph: '🐘', role: 'Long memory integration', use: 'Elephants have exceptional long-term memory — they remember drought routes, lost companions. A restoration ally for integrating long experience: recover and integrate what your own deep memory holds.' },
    ],
    plants: [
      { name: 'Ginkgo', glyph: '🍃', role: 'Ancient neural nourishment', use: 'Ginkgo biloba has supported human cognition for millennia. An empowerment ally for sustained mental clarity: long, patient nourishment of the structures that support thought.' },
      { name: 'Brahmi', glyph: '🌿', role: 'Mind-body integration', use: 'Brahmi (bacopa) has been used for centuries to support memory and mind-body integration. A restoration ally for situations where the mind and body feel disconnected.' },
    ],
  },
  heart: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Central radiance', use: 'The Sun is the heart of its solar system — giving constantly, holding everything in relationship. Work with the Sun for wholehearted giving: the Sun\'s giving does not deplete it; the heart that beats does not exhaust itself.' },
      { name: 'Venus', glyph: '♀', role: 'Love and relationship', use: 'Venus governs the heart\'s domain — love, beauty, and the feeling of connection. A restoration ally for healing the heart: allow beauty back in, seek connection, give the heart what it needs to reopen.' },
    ],
    animals: [
      { name: 'Horse', glyph: '🐴', role: 'Heart coherence', use: 'Horses have the largest heart of any land mammal relative to body size, and they entrain to human heartbeats. An empowerment ally for heart coherence work: be with a horse when you need to come back into rhythmic coherence.' },
      { name: 'Humpback Whale', glyph: '🐋', role: 'Great-hearted presence', use: 'The blue whale\'s heart beats once every ten seconds. A restoration ally for expanding the capacity of care: not faster, but larger and slower.' },
    ],
    plants: [
      { name: 'Hawthorn', glyph: '🌸', role: 'Heart medicine', use: 'Hawthorn is one of the oldest known heart-supporting plants. A restoration ally for heart restoration after difficulty — physical, emotional, or both.' },
      { name: 'Rose', glyph: '🌹', role: 'Heart opening', use: 'The rose has been associated with the heart\'s opening across cultures. An empowerment ally for allowing vulnerability: the rose is both beautiful and thorned — opening and protection can coexist.' },
    ],
  },
  lungs: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Exchange and communication', use: 'Mercury governs exchange — the in and out of communication. Work with Mercury for improving exchange in any system: what flows in must be matched by what flows out.' },
      { name: 'Venus', glyph: '♀', role: 'Breath and beauty', use: 'Venus governs the arts that require breath — singing, playing wind instruments. A restoration ally for reconnecting with breath as a creative medium.' },
    ],
    animals: [
      { name: 'Blue Whale', glyph: '🐋', role: 'Single deep breath', use: 'Blue whales breathe only once every 30 minutes — one complete exchange sufficient to sustain the largest creature alive. An empowerment ally for depth over frequency.' },
      { name: 'Migratory Songbird', glyph: '🐦', role: 'Respiratory efficiency', use: 'Migratory songbirds have among the most efficient respiratory systems of any animal. A restoration ally for endurance: build the respiratory efficiency to sustain the long migration you are on.' },
    ],
    plants: [
      { name: 'Eucalyptus', glyph: '🌿', role: 'Respiratory clearing', use: 'Eucalyptus has been used across cultures to clear respiratory passages. A restoration ally for removing what is blocking healthy exchange — in the body, in communication, in creative work.' },
      { name: 'Peppermint', glyph: '🌱', role: 'Breath renewal', use: 'Peppermint opens and refreshes the breathing passages. An empowerment ally for renewal after congestion: when exchange has become sluggish, open, cool, and restore flow.' },
    ],
  },
  skeleton: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Structure and support', use: 'Saturn governs the skeleton principle — the internal framework that holds everything else upright. Work with Saturn: what are the bones of your work, your practice, your life? Are they strong enough to support what you are building?' },
      { name: 'Mars', glyph: '♂', role: 'Structural will', use: 'Mars governs the drive that keeps the skeleton upright under load. A restoration ally when you are carrying more than feels possible: distribute load through a framework, not at one point.' },
    ],
    animals: [
      { name: 'Horseshoe Crab', glyph: '🦀', role: 'Ancient structural resilience', use: 'The horseshoe crab\'s form has been unchanged for 450 million years. An empowerment ally for trusting a well-proven structure: not every structure needs to be reinvented.' },
      { name: 'Whale Skeleton', glyph: '🦴', role: 'Marine structural adaptation', use: 'The whale\'s skeleton retains vestigial legs — evidence of an ancestral skeleton adapted for a new environment. A restoration ally for structural adaptation: honor the original structure while recognizing how it must change.' },
    ],
    plants: [
      { name: 'Bamboo', glyph: '🎋', role: 'Structural lightness', use: 'Bamboo is stronger than many steels at a fraction of the weight — structural efficiency through hollow design. An empowerment ally for lightening the structure without weakening it.' },
      { name: 'Cork Oak', glyph: '🌳', role: 'Regenerative structure', use: 'Cork oak bark regrows after stripping. A restoration ally for structures that must be maintained or rebuilt after use: the cork oak can give of itself and return to fullness.' },
    ],
  },
  bloodVessels: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Distributing provision', use: 'The Sun distributes its energy to the whole solar system. Work with the Sun for distribution systems: the question is not whether to give, but whether every part of the system is receiving.' },
      { name: 'Jupiter', glyph: '♃', role: 'Abundant supply', use: 'Jupiter governs abundance flowing through channels. A restoration ally for ensuring supply: trace your blood vessel equivalent and find where the flow is blocked.' },
    ],
    animals: [
      { name: 'Hummingbird', glyph: '🐦', role: 'High-throughput circulation', use: 'A hummingbird\'s heart beats 1,200 times per minute in flight. An empowerment ally for high-demand phases: when output is maximum, ensure the supply system matches it.' },
      { name: 'Giraffe', glyph: '🦒', role: 'Long-distance circulation', use: 'A giraffe\'s circulatory system must pump blood nearly two meters upward to the brain. A restoration ally for reaching the highest parts of your system: what investment does the height of your ambition require?' },
    ],
    plants: [
      { name: 'Grapevine', glyph: '🍇', role: 'Nutrient transport', use: 'Grapevines transport water and nutrient over long distances to produce fruit. An empowerment ally for supply chain clarity: trace the flow from source to fruit and ensure nothing is blocked in transit.' },
      { name: 'Cacao', glyph: '🌱', role: 'Heart circulation support', use: 'Cacao has been used for centuries to support heart health and circulation. A restoration ally for restoring flow — physical and relational — when it has slowed.' },
    ],
  },
  nervousSystem: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Signal and response', use: 'Mercury governs the nervous system principle — rapid signal, accurate response, clear communication between all parts. Work with Mercury for communication infrastructure: every node should be able to send and receive clearly.' },
      { name: 'Uranus', glyph: '♅', role: 'Sudden insight transmission', use: 'Uranus governs the sudden, system-wide transmission of a new signal. A restoration ally for nervous system reset after shock: a new signal can reorganize the whole system when the old pattern has become disabling.' },
    ],
    animals: [
      { name: 'Octopus', glyph: '🐙', role: 'Distributed nervous system', use: 'The octopus has a distributed nervous system — most of its neurons live in its arms. An empowerment ally for distributed intelligence: what does your system know at its edges that the center has not yet received?' },
      { name: 'Honeybee', glyph: '🐝', role: 'Collective nervous system', use: 'A beehive operates as a superorganism with a collective nervous system. A restoration ally for team nervous systems: when a group has been traumatized together, the whole system needs regulation.' },
    ],
    plants: [
      { name: 'Ashwagandha', glyph: '🌿', role: 'Nervous system restoration', use: 'Ashwagandha is one of the most researched plants for supporting nervous system resilience under stress. A restoration ally for depleted nervous system states.' },
      { name: 'Holy Basil (Tulsi)', glyph: '🌱', role: 'Adaptogenic nervous support', use: 'Tulsi helps the nervous system respond appropriately to stressors rather than overreacting or underreacting. An empowerment ally for calibration: the goal is not to eliminate response but to ensure it is proportionate.' },
    ],
  },
  dna: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Identity continuity', use: 'Saturn governs what is encoded and passed on — lineage, inheritance, persistence of pattern across time. Work with Saturn for identity questions: what is essential in your encoded nature, and what is inherited without examination?' },
      { name: 'Mercury', glyph: '☿', role: 'Coded information', use: 'Mercury governs all coded systems — language, signals, and the transmission of precise information. A restoration ally for decoding: look at the code that was written before the current expression.' },
    ],
    animals: [
      { name: 'Elephant', glyph: '🐘', role: 'Encoded ancestral memory', use: 'Elephants carry encoded behavioral memory across generations. An empowerment ally for working with ancestral patterns: what in your behavior is faithfully encoding what came before you?' },
      { name: 'Tardigrade', glyph: '🔬', role: 'Indestructible encoded core', use: 'Tardigrades survive extreme conditions by entering a state where only their encoded information is preserved. A restoration ally for crisis survival: the essential encoded core will reconstitute when conditions improve.' },
    ],
    plants: [
      { name: 'Ancient Seeds', glyph: '🌱', role: 'Encoded dormant potential', use: 'Seeds viable after thousands of years carry full encoded potential through extremes of time. An empowerment ally for dormant potential: what is encoded in you that has not yet found its germination condition?' },
      { name: 'Heirloom Varieties', glyph: '🍅', role: 'Preserved genetic heritage', use: 'Heirloom varieties carry genetic heritage carefully preserved against homogenization. A restoration ally for protecting essential diversity: what in your encoded heritage is worth protecting against pressure to conform?' },
    ],
  },
  skin: {
    planets: [
      { name: 'Venus', glyph: '♀', role: 'Boundary and beauty', use: 'Venus governs the skin principle — the beautiful, sensitive boundary between self and world. Work with Venus for boundary clarity: a healthy boundary is permeable and sensitive, knowing what to let in and what to keep out.' },
      { name: 'Saturn', glyph: '♄', role: 'Protective boundary', use: 'Saturn governs the boundary principle — containment, protection, the definition of where the self ends. A restoration ally for boundary repair: when the skin of your life has become too porous, where do the edges need reinforcing?' },
    ],
    animals: [
      { name: 'Chameleon', glyph: '🦎', role: 'Responsive surface', use: 'Chameleons change their skin in response to environment, mood, and communication. An empowerment ally for adaptive response: the skin that can read its environment and respond is more powerful than the skin that merely defends.' },
      { name: 'Axolotl', glyph: '🦎', role: 'Skin regeneration', use: 'Axolotls can regenerate their skin completely after damage. A restoration ally for skin-level repair: after exposure or damage to your outer self, this is the principle of complete regenerative return.' },
    ],
    plants: [
      { name: 'Aloe Vera', glyph: '🌵', role: 'Healing the outer surface', use: 'Aloe vera has been used for millennia to heal damaged skin. A restoration ally for literal and metaphorical skin healing: restore the surface that mediates your contact with the world.' },
      { name: 'Calendula', glyph: '🌼', role: 'Gentle boundary restoration', use: 'Calendula is one of the gentlest plants for skin restoration. A restoration ally for gentle repair of boundaries that have been worn or breached — not through hardening, but through nourishing the tissue itself.' },
    ],
  },
  // ── PLANTS ──────────────────────────────────────────────────
  roots: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Foundation and depth', use: 'Saturn governs the root principle — depth before height, foundation before structure. Work with Saturn in any building phase: you cannot go higher than your roots go deep.' },
      { name: 'Earth', glyph: '♁', role: 'Grounding', use: 'Earth itself is the root ally — the ground into which all roots go. A restoration ally for grounding: when life feels unmoored, where are your roots, and are they going deep enough?' },
    ],
    animals: [
      { name: 'Mole', glyph: '🦔', role: 'Underground worker', use: 'Moles live and work entirely underground — building elaborate root-like tunnel systems. An empowerment ally for invisible preparatory work: the mole does not surface until the underground work is complete.' },
      { name: 'Badger', glyph: '🦡', role: 'Deep digger', use: 'Badgers dig deep, persistent burrow systems. A restoration ally for patience with the deep process: the work that happens at root-depth is not visible but is foundational.' },
    ],
    plants: [
      { name: 'Dandelion Root', glyph: '🌼', role: 'Surprising depth', use: 'Dandelion roots go surprisingly deep for such a small plant — and are among the most medicinal parts. An empowerment ally for the unexpected depth that small, overlooked things can have.' },
      { name: 'Carrot', glyph: '🥕', role: 'Nourishing depth', use: 'The carrot stores the plant\'s nourishment underground. A restoration ally for preserving and accessing what was stored in earlier seasons.' },
    ],
  },
  trunk: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Strength through time', use: 'Saturn governs what is built ring by ring — strength that cannot be rushed. Work with Saturn for patience with slow-building strength: the trunk\'s rings do not lie; every year of growth is recorded.' },
      { name: 'Sun', glyph: '☉', role: 'Central support', use: 'The Sun drives the growth that adds each ring. A restoration ally for sustaining the central column of your work: what is the inner sun that drives your annual growth?' },
    ],
    animals: [
      { name: 'Elephant', glyph: '🐘', role: 'Trunk as extension', use: 'The elephant\'s trunk is a powerful, sensitive extension of its central body. An empowerment ally for extending capability from a strong center.' },
      { name: 'Bison', glyph: '🦬', role: 'Massive central strength', use: 'Bison carry enormous central strength — their bulk is the source of their endurance. A restoration ally for those who need to recognize the strength they have already built.' },
    ],
    plants: [
      { name: 'Redwood', glyph: '🌲', role: 'Ancient trunk strength', use: 'Redwood trunks are fire-resistant, rot-resistant, and insect-resistant — built for maximum longevity. An empowerment ally for building with maximum durability.' },
      { name: 'Baobab', glyph: '🌳', role: 'Water-storing trunk', use: 'Baobab trunks store thousands of gallons of water. A restoration ally for those in drought conditions: what have you stored in your central column that can sustain you through scarcity?' },
    ],
  },
  branchesPlant: {
    planets: [
      { name: 'Jupiter', glyph: '♃', role: 'Expansive reach', use: 'Jupiter governs expansion from a stable center. Work with Jupiter for extending into new territory while remaining connected to your trunk.' },
      { name: 'Mercury', glyph: '☿', role: 'Branching communication', use: 'Mercury governs the branching of signals into many channels. A restoration ally for communication that must reach many places at once from a single source.' },
    ],
    animals: [
      { name: 'Spider Monkey', glyph: '🐒', role: 'Branch navigation', use: 'Spider monkeys navigate the forest canopy using branches as the primary medium of movement. An empowerment ally for those who move through relational or organizational branches rather than linear paths.' },
      { name: 'Bird', glyph: '🐦', role: 'Branch as rest point', use: 'Birds use branches as perches — points of rest and observation between flights. A restoration ally for finding the right stopping points in your work: not every branch is a destination, but each is a necessary rest.' },
    ],
    plants: [
      { name: 'Apple Tree', glyph: '🍎', role: 'Fruit-bearing branches', use: 'Apple tree branches bear fruit only when properly pruned — too many branches reduces the harvest. An empowerment ally for strategic pruning: the branches you cut are what make the remaining branches productive.' },
      { name: 'Wisteria', glyph: '🌸', role: 'Reaching branches', use: 'Wisteria branches reach far from the main trunk, finding and covering new surfaces. A restoration ally for extending reach where the trunk itself cannot go.' },
    ],
  },
  leaves: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Light reception', use: 'The Sun is what leaves are designed to receive. Work with the Sun for receptivity work: the leaf does not make the light; it positions itself to receive what is freely given.' },
      { name: 'Mercury', glyph: '☿', role: 'Information processing', use: 'Mercury governs the leaf\'s function — receiving and processing incoming signal and converting it to usable form. A restoration ally for integration: when you have received more than you\'ve processed.' },
    ],
    animals: [
      { name: 'Butterfly', glyph: '🦋', role: 'Leaf surface dweller', use: 'Butterflies rest on leaves, using the leaf\'s surface as a platform for basking and nourishment. An empowerment ally for using available surfaces: what surfaces in your life are available for you to rest on and receive from?' },
      { name: 'Caterpillar', glyph: '🐛', role: 'Leaf consumer', use: 'The caterpillar consumes leaf matter and converts it into the material of transformation. A restoration ally for phases of intake and conversion: before the chrysalis, there is the consumption.' },
    ],
    plants: [
      { name: 'Mint', glyph: '🌿', role: 'Aromatic leaf', use: 'Mint leaves are concentrated aromatic medicine — small but powerful. An empowerment ally for making the most of what you have: the mint leaf does not need to be large to be potent.' },
      { name: 'Tea', glyph: '🍃', role: 'Leaf as wisdom medium', use: 'Tea leaves have been used across cultures for millennia as a medium for clarity and contemplation. A restoration ally for returning to clarity: patient reception of what is offered, careful attention to what emerges.' },
    ],
  },
  flowers: {
    planets: [
      { name: 'Venus', glyph: '♀', role: 'Beauty as function', use: 'Venus governs the flower principle — that beauty is not decoration but serves the continuation of life. An empowerment ally for any work that combines beauty and purpose: the flower is not beautiful despite being functional; it is beautiful because it must be.' },
      { name: 'Sun', glyph: '☉', role: 'Blooming in fullness', use: 'The Sun draws the flower out of the bud — fullness of expression in response to warmth. A restoration ally for those who are still in bud: what warmth, what source of sun, draws you into blooming?' },
    ],
    animals: [
      { name: 'Honeybee', glyph: '🐝', role: 'Pollinator partnership', use: 'The honeybee and the flower are one of nature\'s oldest partnerships — each requiring the other. An empowerment ally for identifying your necessary partners: what is the bee to your flower?' },
      { name: 'Hummingbird', glyph: '🐦', role: 'Nectar partnership', use: 'Hummingbirds and flowers have co-evolved — the bird\'s beak fits the flower exactly. A restoration ally for perfect fit: the right partnership is not a compromise but an exact match.' },
    ],
    plants: [
      { name: 'Lavender', glyph: '💜', role: 'Calming flower', use: 'Lavender\'s flower has been used across traditions for calming and grounding. A restoration ally for settling what has been stirred: returning to stillness without suppressing the complexity underneath.' },
      { name: 'Chamomile', glyph: '🌼', role: 'Gentle flower medicine', use: 'Chamomile\'s small flowers are among the most used medicinal plants globally. An empowerment ally for underestimated gentleness: the chamomile flower looks modest and delivers healing of remarkable depth.' },
    ],
  },
  fruit: {
    planets: [
      { name: 'Jupiter', glyph: '♃', role: 'Abundant harvest', use: 'Jupiter governs abundance and the generosity of the harvest. Work with Jupiter for harvest phases: abundance moves through you, carried outward by the very generosity that produced it.' },
      { name: 'Venus', glyph: '♀', role: 'Sweet reward', use: 'Venus governs the fruit principle — sweetness as a lure that serves life\'s continuation. A restoration ally for rewarding labor: the fruit is the evidence of a season well lived.' },
    ],
    animals: [
      { name: 'Fruit Bat', glyph: '🦇', role: 'Fruit disperser', use: 'Fruit bats disperse seeds across large distances. An empowerment ally for distribution: your fruit reaches further than you can carry it if you find the right distributors.' },
      { name: 'Crow', glyph: '🐦', role: 'Fruit and seed carrier', use: 'Crows carry and cache fruit — sometimes forgetting where, planting new trees in the process. A restoration ally for unintentional generosity: sometimes what you give away plants things you will never see.' },
    ],
    plants: [
      { name: 'Pomegranate', glyph: '🍎', role: 'Many seeds in one fruit', use: 'The pomegranate holds hundreds of seeds in one fruit. An empowerment ally for generative output: one good work, one true harvest, contains the seeds of hundreds of futures.' },
      { name: 'Fig', glyph: '🫐', role: 'Keystone fruit', use: 'The fig supports more species than almost any other fruit tree. A restoration ally for those whose output sustains a community: the fig simply fruits, and its abundance is the ground of an ecosystem.' },
    ],
  },
  seeds: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Encoded potential', use: 'Saturn governs what is contained, protected, and held in reserve. Work with Saturn for phases of concentrated potential: before the expression comes the encoding, the protection, the patient waiting.' },
      { name: 'Pluto', glyph: '♇', role: 'Dormant transformation', use: 'Pluto governs what remains alive in complete stillness, awaiting conditions for transformation. A restoration ally for trust in dormancy: the seed appears dead; it is not. Your quiet phase is not an end.' },
    ],
    animals: [
      { name: 'Squirrel', glyph: '🐿️', role: 'Seed caching', use: 'Squirrels cache seeds for winter and forget enough to plant forests. An empowerment ally for letting go of what you have prepared: the seeds you release, trusting them to the ground, become something you could not have planted deliberately.' },
      { name: 'Dung Beetle', glyph: '🪲', role: 'Accidental seed planter', use: 'Dung beetles accidentally plant seeds while rolling dung balls. A restoration ally for trusting the accidental: sometimes the most generative planting is the unintentional one.' },
    ],
    plants: [
      { name: 'Lotus Seed', glyph: '🪷', role: 'Thousand-year viability', use: 'Lotus seeds have been germinated after more than 1,300 years of dormancy. An empowerment ally for trust in potential that has been waiting a very long time: the conditions for germination will come.' },
      { name: 'Acorn', glyph: '🌰', role: 'Whole oak encoded in a seed', use: 'An acorn contains the complete instruction set for a 500-year oak. A restoration ally for the phase before beginning: everything needed is already in you, encoded and waiting for the right ground.' },
    ],
  },
  // ── ANIMALS ──────────────────────────────────────────────────
  wings: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Winged messenger', use: 'Mercury carries wings in every depiction — flight as the symbol of rapid, accurate transmission. Work with Mercury for any work requiring both speed and precision: the wing that is properly formed makes both possible.' },
      { name: 'Uranus', glyph: '♅', role: 'Freedom through alignment', use: 'Uranus governs liberation — the breakthrough into new possibility. A restoration ally for those who have been grounded too long: freedom comes not from breaking rules but from perfect alignment with natural law that makes flight inevitable.' },
    ],
    animals: [
      { name: 'Albatross', glyph: '🦅', role: 'Effortless long-distance flight', use: 'Albatrosses fly thousands of miles on almost no muscular effort — using wind currents with extraordinary skill. An empowerment ally for sustainable long-distance movement: the albatross does not flap; it reads the wind and glides.' },
      { name: 'Dragonfly', glyph: '🐛', role: 'Multi-directional flight mastery', use: 'Dragonflies can fly in any direction — forward, backward, sideways, hovering. A restoration ally for agility: when a situation requires the ability to move in unexpected directions without losing orientation.' },
    ],
    plants: [
      { name: 'Dandelion Seeds', glyph: '🌼', role: 'Wind-wing dispersal', use: 'Dandelion seeds have their own tiny wings. An empowerment ally for light-touch dispersal: not everything needs a strong launch; some things need only to be released to the right conditions to travel far.' },
      { name: 'Maple Samara', glyph: '🍁', role: 'Rotating seed wing', use: 'Maple seeds spin like helicopter blades as they fall — their wing form slowing descent and carrying them on the wind. A restoration ally for graceful descent: the samara does not fight gravity; it uses it to extend its reach.' },
    ],
  },
  honeycomb: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Efficient structure', use: 'Saturn governs maximum efficiency in structure. Work with Saturn for organizational design: the hexagon is what you get when you let the constraints of reality determine the form.' },
      { name: 'Venus', glyph: '♀', role: 'Beauty through mathematics', use: 'Venus governs the beauty that emerges from mathematical rightness. A restoration ally for situations where the right form has not yet been found: when the form is truly right, it will also be beautiful.' },
    ],
    animals: [
      { name: 'Honeybee', glyph: '🐝', role: 'Cooperative builders', use: 'Honeybees build the honeycomb through cooperative labor — no single bee knows the whole; the structure emerges from local decisions. An empowerment ally for collective intelligence: the most efficient form emerges from many right local decisions.' },
      { name: 'Wasp', glyph: '🐝', role: 'Independent hexagon builders', use: 'Wasps independently invented the hexagonal cell structure. A restoration ally for convergent solutions: when different groups arrive at the same form independently, it is the form that reality is selecting for.' },
    ],
    plants: [
      { name: 'Honeysuckle', glyph: '🌸', role: 'Nectar abundance', use: 'Honeysuckle produces the nectar that the honeycomb stores. An empowerment ally for generating what sustains the community: what is the honeysuckle in your system, and is it supported to produce abundantly?' },
      { name: 'Clover', glyph: '🍀', role: 'Bee habitat support', use: 'Clover is essential bee habitat — without clover meadows, the bee colony weakens. A restoration ally for habitat maintenance: the honeycomb\'s abundance depends on the health of the foraging ground.' },
    ],
  },
  spiderWeb: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Sensitive detection network', use: 'Mercury governs sensitivity to signals across a network. Work with Mercury for building detection systems: the spider web\'s principle is that you feel everything that touches the network, anywhere.' },
      { name: 'Saturn', glyph: '♄', role: 'Patient structure', use: 'Saturn governs patient, precise construction. A restoration ally for disciplined building: the spider does not rush the web. Each radial spoke is placed with precision before the capturing spiral begins.' },
    ],
    animals: [
      { name: 'Spider', glyph: '🕷️', role: 'Patient centered waiting', use: 'The spider builds its structure and then waits at the center. An empowerment ally for knowing when to act and when to wait: once the network is properly built, the spider does not chase — it receives what comes to it.' },
      { name: 'Orb Weaver Spider', glyph: '🕷️', role: 'Daily rebuild discipline', use: 'Orb weavers often eat and rebuild their web daily. A restoration ally for daily practice: the web that must be rebuilt each day is not a failure — it is the natural pace of the work.' },
    ],
    plants: [
      { name: 'Dew-catching Grass', glyph: '🌿', role: 'Morning capture', use: 'Grass catches morning dew in fine networks of drops — like a spider web. A restoration ally for the morning practices that catch what the night has distilled.' },
      { name: 'Climbing Roses', glyph: '🌹', role: 'Thorned net structure', use: 'Climbing roses create a web-like structure — beautiful but defensive, soft and thorned together. An empowerment ally for boundaries that are attractive and permeable but not without protection.' },
    ],
  },
  antColony: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Signal-based coordination', use: 'Mercury governs coordination through signals — pheromones and chemical communication are the ant colony\'s Mercury. Work with Mercury for designing communication systems that coordinate without centralized control.' },
      { name: 'Saturn', glyph: '♄', role: 'Patient collective building', use: 'Saturn governs long-term collective construction. A restoration ally for projects that take longer than any individual term: the colony outlasts every ant in it; the structure is what persists.' },
    ],
    animals: [
      { name: 'Ant', glyph: '🐜', role: 'Simple rule, complex result', use: 'Each ant follows a few simple rules; the colony produces complex intelligence. An empowerment ally for distributed systems: simple, clear principles at the local level generate complex effectiveness at the whole level.' },
      { name: 'Termite', glyph: '🦗', role: 'Climate-controlled construction', use: 'Termite mounds maintain stable internal temperature through sophisticated ventilation architecture. A restoration ally for internal environment management: design the structure so the environment regulates itself.' },
    ],
    plants: [
      { name: 'Acacia', glyph: '🌿', role: 'Mutualistic ant habitat', use: 'Some acacias have hollow thorns that house ant colonies — the tree and colony protect each other. An empowerment ally for mutualistic design: what structure can you offer that provides home for those who will protect and extend your reach?' },
      { name: 'Myrmecophytes', glyph: '🌱', role: 'Ant-plant partnership', use: 'Myrmecophyte plants have evolved specifically to house and feed ant colonies. A restoration ally for committed partnership: when the relationship is truly symbiotic, both partners build their entire structure around it.' },
    ],
  },
  fishSchool: {
    planets: [
      { name: 'Neptune', glyph: '♆', role: 'Collective fluid movement', use: 'Neptune governs collective, fluid, responsive movement. Work with Neptune for team dynamics: the school moves as one because each member is exquisitely sensitive to the motion of its neighbors.' },
      { name: 'Moon', glyph: '☽', role: 'Rhythmic synchronization', use: 'The Moon pulls living things into synchronized rhythm. A restoration ally for re-synchronizing a group that has lost its coherence: find the common rhythm, and coherent movement will re-emerge.' },
    ],
    animals: [
      { name: 'Sardine', glyph: '🐟', role: 'Safety in school', use: 'Sardines school for protection — the predator cannot easily target one individual in a moving mass. An empowerment ally for collective security: belonging to a coherent group is itself a form of protection no individual can replicate.' },
      { name: 'Dolphin Pod', glyph: '🐬', role: 'Coordinated intelligence', use: 'Dolphin pods coordinate complex hunting strategies with no visible communication. A restoration ally for team intelligence: when a team has worked together long enough, the coordination becomes effortless.' },
    ],
    plants: [
      { name: 'Kelp Forest', glyph: '🌿', role: 'Collective fish habitat', use: 'Kelp forests are the environment in which fish schools thrive. An empowerment ally for habitat design: the school finds and inhabits the environment that supports its particular kind of movement.' },
      { name: 'Eelgrass Meadow', glyph: '🌿', role: 'Protected nursery ground', use: 'Eelgrass meadows provide the nursery grounds where fish schools originate. A restoration ally for early-phase support: the school that will move the ocean begins in the protected meadow.' },
    ],
  },
  birdMigration: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Seasonal solar signal', use: 'The Sun\'s changing angle triggers migration. Work with the Sun for reading the signal to move: the bird does not decide to migrate through reasoning; it responds to a signal encoded in the light. What signal in you says it is time to move?' },
      { name: 'Jupiter', glyph: '♃', role: 'Long-range travel', use: 'Jupiter governs long journeys and the expansion of range. A restoration ally for those undertaking long migrations — physical, vocational, or personal: the journey is as important as the destination.' },
    ],
    animals: [
      { name: 'Arctic Tern', glyph: '🦢', role: 'Maximum distance migration', use: 'Arctic terns travel 70,000 km annually — from Arctic to Antarctic and back. An empowerment ally for those undertaking the longest journeys: the tern rests, feeds, but does not turn back before completing the full arc.' },
      { name: 'Bar-tailed Godwit', glyph: '🐦', role: 'Nonstop marathon flight', use: 'Bar-tailed godwits fly 12,000 km nonstop — no food, no rest. An empowerment ally for the phases that require everything without respite: the sustained push is possible when you know the landing is coming.' },
    ],
    plants: [
      { name: 'Stopover Habitat Plants', glyph: '🌾', role: 'Migration rest support', use: 'Plants along migration routes provide the food and shelter that make the long journey possible. A restoration ally for those who support others\' journeys: the stopover habitat does not migrate itself; its role is to sustain those who do.' },
      { name: 'Berry-producing Shrubs', glyph: '🫐', role: 'Migratory fueling', use: 'Berry-producing plants time their fruiting to coincide with migration. An empowerment ally for timing your generosity: the berry that is ripe when the migrant passes is the one that matters.' },
    ],
  },
  // ── NATURE'S PHENOMENA ──────────────────────────────────────
  snowflake: {
    planets: [
      { name: 'Uranus', glyph: '♅', role: 'Unique expression of law', use: 'Uranus governs individuality within universal law — the snowflake principle. Work with Uranus for your own unique expression: you are not outside the law; you are a unique expression of it.' },
      { name: 'Mercury', glyph: '☿', role: 'Precise formation', use: 'Mercury governs the precision with which the snowflake\'s form is determined by its journey through varying air conditions. A restoration ally for trusting that your current form has been precisely shaped by what you have moved through.' },
    ],
    animals: [
      { name: 'Snow Leopard', glyph: '🐆', role: 'Unique in the cold', use: 'Snow leopards have unique rosette patterns — each one distinct, like a snowflake. An empowerment ally for embracing your individual markings: what makes you distinct is your individual expression of a universal type.' },
      { name: 'Arctic Fox', glyph: '🦊', role: 'Adaptation to cold uniqueness', use: 'Arctic foxes change coat color seasonally. A restoration ally for situational adaptation: the uniqueness of your expression is partly in how you read and respond to the specific conditions you are in.' },
    ],
    plants: [
      { name: 'Ice Plant', glyph: '🌸', role: 'Cold-climate bloom', use: 'Ice plants bloom brilliantly in harsh cold conditions. An empowerment ally for those who discover their most vivid expression in difficult conditions: the cold is not the enemy of the bloom; it draws it out.' },
      { name: 'Winter Jasmine', glyph: '🌸', role: 'Beauty in winter', use: 'Winter jasmine blooms in the coldest months. A restoration ally for those in hard seasons: beauty has its own timing, and sometimes the most striking expression comes in conditions that seem least suited to it.' },
    ],
  },
  crystal: {
    planets: [
      { name: 'Saturn', glyph: '♄', role: 'Internal order made visible', use: 'Saturn governs the crystal principle — deep internal order reveals itself in outer form. Work with Saturn for alignment between inner and outer: when your inner order is clear and consistent, your outer expression becomes as precise as a crystal.' },
      { name: 'Uranus', glyph: '♅', role: 'Geometric revelation', use: 'Uranus governs the moment when hidden structure becomes suddenly visible. A restoration ally for revealing inner order: what is already structured within you that has not yet found its crystalline external form?' },
    ],
    animals: [
      { name: 'Nautilus', glyph: '🐚', role: 'Living crystal structure', use: 'The nautilus shell is a biological crystal — precise mathematical form produced by living process. An empowerment ally for building structures that are both alive and mathematically precise.' },
      { name: 'Bone Structure', glyph: '🦴', role: 'Biological crystal lattice', use: 'Bone is a crystal lattice of calcium and collagen. A restoration ally for structural integrity: the inner crystalline order of your life\'s framework determines how much it can bear.' },
    ],
    plants: [
      { name: 'Desert Crystals', glyph: '🌵', role: 'Mineral precision', use: 'Some desert plants thrive in mineral-rich soils heavy with crystals. An empowerment ally for thriving in precise, sharp environments: some plants grow best where the mineral order is most exact.' },
      { name: 'Selenite Environment Algae', glyph: '🌿', role: 'Crystal environment pioneer', use: 'Some algae grow in saline environments where crystals form. A restoration ally for those living at the edge of crystalline harshness: life finds the mineral lattice not a barrier but a substrate.' },
    ],
  },
  lightning: {
    planets: [
      { name: 'Uranus', glyph: '♅', role: 'Sudden transformation', use: 'Uranus governs the lightning principle — sudden, irreversible breakthrough that reorganizes everything it touches. Work with Uranus for moments of breakthrough: the lightning does not hesitate, does not apologize, and does not repeat the same path.' },
      { name: 'Mars', glyph: '♂', role: 'Decisive release', use: 'Mars governs the decisive release of concentrated force. A restoration ally for situations requiring sudden, complete action: the lightning releases everything at once along the single path that opens.' },
    ],
    animals: [
      { name: 'Electric Eel', glyph: '🐍', role: 'Living lightning', use: 'Electric eels generate enough electricity to stun large prey. An empowerment ally for concentrated power release: the eel\'s principle is not to be large but to be able to release everything in a single moment.' },
      { name: 'Mantis Shrimp', glyph: '🦐', role: 'Fastest strike in nature', use: 'The mantis shrimp strikes with the speed and force of a bullet — the fastest appendage movement in nature. A restoration ally for decisive action that has been postponed: when it is time to strike, commit completely.' },
    ],
    plants: [
      { name: 'Lightning-struck Tree', glyph: '🌲', role: 'Transformation through strike', use: 'Trees struck by lightning are often killed but enrich the soil and open the forest for new growth. A restoration ally for what has been struck and seems destroyed: the lightning-struck tree feeds the forest for decades after its own death.' },
      { name: 'Mimosa Pudica', glyph: '🌿', role: 'Instantaneous response', use: 'Mimosa pudica folds its leaves faster than almost any other plant. An empowerment ally for lightning-fast response: the mimosa does not deliberate; it responds.' },
    ],
  },
  rainbow: {
    planets: [
      { name: 'Sun', glyph: '☉', role: 'Hidden fullness revealed', use: 'The Sun\'s white light contains every color — the rainbow reveals what was always there. Work with the Sun for revelation: what you have been calling simple or unified is actually more diverse than it appears.' },
      { name: 'Neptune', glyph: '♆', role: 'Integration of diversity', use: 'Neptune governs the dissolution of hard edges into spectrum. A restoration ally for situations of apparent division: the rainbow shows that what looks like many separate things is one light refracted through many angles.' },
    ],
    animals: [
      { name: 'Peacock', glyph: '🦚', role: 'Iridescent spectrum display', use: 'The peacock\'s tail refracts light to display a full spectrum of color. An empowerment ally for full-spectrum expression: when showing your full range, nothing should be held back — all of it is the display.' },
      { name: 'Mandarin Duck', glyph: '🦆', role: 'Spectrum of color in one being', use: 'The mandarin duck carries the full spectrum of the rainbow in its plumage. A restoration ally for integration of apparent opposites within one self: you do not have to choose which color to be.' },
    ],
    plants: [
      { name: 'Rainbow Eucalyptus', glyph: '🌈', role: 'Living rainbow bark', use: 'Rainbow eucalyptus reveals different colors as its bark peels — a living spectrum. An empowerment ally for revealing depth through time: what you are becomes more colorful and complex as layers are shed.' },
      { name: 'Iris', glyph: '🌸', role: 'Named for the rainbow', use: 'The iris is named for the goddess of the rainbow. A restoration ally for hope and integration: the iris blooms where sky and earth meet, bridging what was separated.' },
    ],
  },
  fire: {
    planets: [
      { name: 'Mars', glyph: '♂', role: 'Transformative force', use: 'Mars governs fire — the directed force that transforms what it touches. Work with Mars for decisive transformation: fire converts what it encounters into something that cannot return to what it was.' },
      { name: 'Sun', glyph: '☉', role: 'Sustaining fire', use: 'The Sun is fire that sustains rather than consumes — controlled fusion rather than burning out. A restoration ally for sustainable intensity: the question is not whether to burn but whether your fire is a sun or a wildfire.' },
    ],
    animals: [
      { name: 'Phoenix (Mythological)', glyph: '🦅', role: 'Renewal through fire', use: 'The phoenix principle — known across cultures — is renewal through the fire that destroys. An empowerment ally for those in the burning phase: the fire that consumes what you were is also clearing the ground for what you are becoming.' },
      { name: 'Firefly', glyph: '✨', role: 'Cold light', use: 'Fireflies produce light without fire — cold bioluminescence. A restoration ally for illumination without burning: there is a form of light that does not consume. Find the one that sustains rather than depletes.' },
    ],
    plants: [
      { name: 'Fireweed', glyph: '🌸', role: 'First growth after fire', use: 'Fireweed is the first plant to colonize ground after a wildfire. An empowerment ally for post-transformation growth: what blooms first after the fire? You are the fireweed of your own landscape.' },
      { name: 'Serotinous Pine', glyph: '🌲', role: 'Fire-released seeds', use: 'Some pine trees open their cones only in fire — releasing seeds when the ground has been cleared and fertilized by burning. A restoration ally for waiting for the right conditions: what you carry will be released when the fire creates the ground it requires.' },
    ],
  },
  waterPh: {
    planets: [
      { name: 'Moon', glyph: '☽', role: 'Water\'s ruler', use: 'The Moon governs all water on Earth. Work with the Moon for water-like adaptability: water takes the shape of its container without losing its nature. What is your nature that remains constant across all the forms you take?' },
      { name: 'Neptune', glyph: '♆', role: 'Deep water principle', use: 'Neptune governs water in its deepest and most fluid aspects. A restoration ally for dissolving resistance: Neptune\'s water does not force; it finds the opening and flows through.' },
    ],
    animals: [
      { name: 'Water Strider', glyph: '🐛', role: 'Surface tension mastery', use: 'Water striders walk on the surface of water by using its tension. An empowerment ally for finding the threshold that supports you: distribute your weight exactly right.' },
      { name: 'Axolotl', glyph: '🦎', role: 'Permanent water being', use: 'Axolotls remain in water their entire lives — never completing the metamorphosis other salamanders undergo. A restoration ally for those who have chosen to remain in their element rather than transform away from it.' },
    ],
    plants: [
      { name: 'Water Lily', glyph: '🌸', role: 'Water surface bloom', use: 'Water lilies root in mud and bloom on the surface. An empowerment ally for staying rooted in difficult ground while still reaching the surface to bloom.' },
      { name: 'Cattail', glyph: '🌿', role: 'Wetland pioneer', use: 'Cattails are among the first plants to establish in new wetlands. A restoration ally for establishing yourself in wet, uncertain, shifting ground — the pioneer of the waterline.' },
    ],
  },
  wind: {
    planets: [
      { name: 'Mercury', glyph: '☿', role: 'Invisible carrier of influence', use: 'Mercury governs transmission through invisible medium — like wind carrying signal across distance. Work with Mercury for understanding how influence travels: you do not need to be seen to move things.' },
      { name: 'Uranus', glyph: '♅', role: 'Sudden directional change', use: 'Uranus governs the sudden shift in direction — the wind that turns without warning. A restoration ally for sudden reorientation: the wind does not apologize for changing direction; it simply moves toward the next balance.' },
    ],
    animals: [
      { name: 'Albatross', glyph: '🦅', role: 'Wind rider', use: 'The albatross spends years at sea, riding wind currents with barely a wingbeat. An empowerment ally for using invisible forces rather than fighting them: what wind currents are available in your domain right now?' },
      { name: 'Monarch Butterfly', glyph: '🦋', role: 'Wind-assisted migration', use: 'Monarchs time their migration to catch favorable wind currents. A restoration ally for timing: when is the wind with you, and are you moving in those moments?' },
    ],
    plants: [
      { name: 'Grass', glyph: '🌿', role: 'Wind-visible responsiveness', use: 'Grass makes wind visible — its response to the invisible force is the evidence of the force. A restoration ally for making the invisible visible: your responsiveness to what moves you is what others see.' },
      { name: 'Tumbleweed', glyph: '🌿', role: 'Wind-carried dispersal', use: 'Tumbleweeds release from their roots and let the wind carry them — dispersing seeds across enormous distances. An empowerment ally for releasing what has rooted too long in one place and allowing the wind to carry you to new ground.' },
    ],
  },
};

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

// ── Natural Allies ────────────────────────────────────────────
const ALLY_TYPE_COLOR = { planet: '#7C9ED9', animal: '#82B89A', plant: '#A8C07A' };
const ALLY_TYPE_GLYPH = { planet: '✦', animal: '⌖', plant: '⚘' };
const ALLY_TYPE_LABEL = { planet: 'Planets', animal: 'Animals', plant: 'Plants' };

function AllyCard({ ally, type, onCarryApply, onCarryInvoke, pinned, onPin }) {
  const [open, setOpen] = useState(false);
  const color = ALLY_TYPE_COLOR[type];
  return (
    <div style={{ borderRadius: '12px', border: `1px solid ${open ? color + '44' : 'var(--border)'}`, background: open ? color + '08' : 'var(--chip)', transition: 'all 0.2s', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 15px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{ally.glyph}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT.head, fontSize: '15px', color: 'var(--text)', fontWeight: 600 }}>{ally.name}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color, marginTop: '2px' }}>{ally.role}</div>
        </div>
        {pinned && <span style={{ fontFamily: FONT.mono, fontSize: '8px', letterSpacing: '1px', color: '#FBBF24', background: '#FBBF2420', border: '1px solid #FBBF2440', borderRadius: '999px', padding: '2px 7px', flexShrink: 0 }}>PRACTICE</span>}
        <span style={{ fontFamily: FONT.mono, fontSize: '11px', color: 'var(--dim)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 15px 14px' }}>
          <p style={{ fontFamily: FONT.body, fontSize: '14.5px', lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>{ally.use}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onCarryApply && <button onClick={() => onCarryApply(ally)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: `1px solid ${color}44`, background: color + '10', color, fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>⊕ Carry to Apply</button>}
            {onCarryInvoke && <button onClick={() => onCarryInvoke(ally, type)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: `1px solid ${ALLY_TYPE_COLOR.planet}44`, background: ALLY_TYPE_COLOR.planet + '10', color: ALLY_TYPE_COLOR.planet, fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>✦ Carry to Invoke</button>}
            <button onClick={onPin} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: `1px solid ${pinned ? '#FBBF2466' : 'var(--border)'}`, background: pinned ? '#FBBF2412' : 'transparent', color: pinned ? '#FBBF24' : 'var(--dim)', fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>{pinned ? '★ Pinned' : '☆ Pin as Practice'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AllyGroup({ type, allies, open: defaultOpen, onCarryApply, onCarryInvoke, pinnedAlly, onPin }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const color = ALLY_TYPE_COLOR[type];
  return (
    <div style={{ marginBottom: '18px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', borderBottom: '1px solid var(--border)', marginBottom: '10px' }}>
        <span style={{ fontFamily: FONT.mono, fontSize: '11px', color, width: '14px' }}>{ALLY_TYPE_GLYPH[type]}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color, flex: 1, textAlign: 'left' }}>{ALLY_TYPE_LABEL[type]}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: '10px', color: 'var(--dim)' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allies.map(a => {
            const pid = `${type}:${a.name}`;
            return <AllyCard key={a.name} ally={a} type={type} onCarryApply={onCarryApply} onCarryInvoke={onCarryInvoke} pinned={pinnedAlly === pid} onPin={() => onPin(pid)} />;
          })}
        </div>
      )}
    </div>
  );
}

function NaturalAlliesPanel({ structureId, onCarryApply, onCarryInvoke, pinnedAlly, onPin }) {
  const allies = NATURAL_ALLIES[structureId];
  if (!allies) return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--dim)', fontFamily: FONT.mono, fontSize: '10px', letterSpacing: '1.5px' }}>
      NATURAL ALLIES · COMING SOON FOR THIS STRUCTURE
    </div>
  );
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: FONT.body, fontSize: '14.5px', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
          These forms from the natural world embody the same organizing principle. Working with them — physically, symbolically, or contemplatively — reinforces the pattern and supports empowerment and restoration.
        </p>
      </div>
      <AllyGroup type="planet" allies={allies.planets} defaultOpen={true} onCarryApply={onCarryApply} onCarryInvoke={onCarryInvoke} pinnedAlly={pinnedAlly} onPin={onPin} />
      <AllyGroup type="animal" allies={allies.animals} defaultOpen={true} onCarryApply={onCarryApply} onCarryInvoke={onCarryInvoke} pinnedAlly={pinnedAlly} onPin={onPin} />
      <AllyGroup type="plant" allies={allies.plants} defaultOpen={true} onCarryApply={onCarryApply} onCarryInvoke={onCarryInvoke} pinnedAlly={pinnedAlly} onPin={onPin} />
      <div style={{ borderRadius: '12px', border: '1px solid rgba(167,139,250,0.15)', background: 'rgba(167,139,250,0.06)', padding: '15px 17px', marginTop: '4px' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#A78BFA', marginBottom: '6px' }}>HOW TO WORK WITH AN ALLY</div>
        <p style={{ fontFamily: FONT.body, fontSize: '14px', lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>
          Presence is the first move — spend time with the organism or image before applying it. Observation sharpens the principle. Then identify one current situation where that principle is missing or needed, and let the ally's example inform a specific, concrete action.
        </p>
      </div>
    </div>
  );
}

// ── Structure card ────────────────────────────────────────────
function Card({ s, onOpen, studied, hasAlly }) {
  const [h, setH] = useState(false);
  const a = ACCENT[s.primaryLayer];
  return (
    <button onClick={() => onOpen(s)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...glass, textAlign: 'left', display: 'flex', flexDirection: 'column', borderRadius: '16px', borderColor: h ? a + '66' : 'var(--border)', padding: '18px', cursor: 'pointer', transition: 'all 0.25s ease', transform: h ? 'translateY(-4px)' : 'none', boxShadow: h ? `0 12px 40px ${a}22` : 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        {hasAlly && <span title="Has Natural Allies" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: FONT.mono, fontSize: '8px', letterSpacing: '1px', color: ALLY_TYPE_COLOR.planet, background: ALLY_TYPE_COLOR.planet + '18', border: `1px solid ${ALLY_TYPE_COLOR.planet}33`, borderRadius: '999px', padding: '2px 6px' }}>✦⌖⚘</span>}
        {studied && <span title="Studied" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', ...mono({ color: ACCENT.Rhythm, fontSize: '9px' }) }}><Icon name="Check" size={12} color={ACCENT.Rhythm} /></span>}
      </div>
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
function Modal({ s, onClose, studied, onToggleStudied, onApply, onInvoke, pinnedAlly, onPin, onCarryApply, onCarryInvoke }) {
  const [modalTab, setModalTab] = useState('overview');
  useEffect(() => { setModalTab('overview'); }, [s?.id]);
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
        {/* Modal tab bar */}
        <div style={{ display: 'flex', gap: '2px', padding: '12px 16px 0', borderBottom: '1px solid var(--border)', background: 'var(--chip)' }}>
          {[['overview', 'Overview'], ['mapping', 'Five Layers'], ['allies', '✦ Natural Allies']].map(([tid, tlabel]) => {
            const on = modalTab === tid;
            return (
              <button key={tid} onClick={() => setModalTab(tid)} style={{ padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', background: on ? 'var(--bg)' : 'transparent', color: on ? (tid === 'allies' ? ALLY_TYPE_COLOR.planet : ACCENT['Intelligent Order']) : 'var(--dim)', borderBottom: on ? '2px solid ' + (tid === 'allies' ? ALLY_TYPE_COLOR.planet : ACCENT['Intelligent Order']) : '2px solid transparent' }}>
                {tlabel}
              </button>
            );
          })}
        </div>
        <div style={{ padding: '24px' }}>
          {modalTab === 'overview' && (
            <>
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
            </>
          )}
          {modalTab === 'mapping' && (
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
          )}
          {modalTab === 'allies' && (
            <NaturalAlliesPanel
              structureId={s.id}
              onCarryApply={(ally) => { onApply(s, ally); onClose(); }}
              onCarryInvoke={(ally, type) => { onCarryInvoke(s, ally, type); onClose(); }}
              pinnedAlly={pinnedAlly}
              onPin={onPin}
            />
          )}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
            <GoldBtn onClick={() => onApply(s)}><Icon name="PenLine" size={15} color="#1A150A" /> Apply this principle</GoldBtn>
            <GhostBtn color={ACCENT['Intelligent Order']} onClick={() => onInvoke(s)}><Icon name="Flame" size={15} color={ACCENT['Intelligent Order']} /> Invoke with this</GhostBtn>
            <GhostBtn color={ACCENT.Rhythm} onClick={() => onToggleStudied(s.id)}>
              {isStudied ? '✓ Studied' : 'Mark as studied'}
            </GhostBtn>
            {modalTab !== 'allies' && NATURAL_ALLIES[s.id] && (
              <GhostBtn color={ALLY_TYPE_COLOR.planet} onClick={() => setModalTab('allies')}>✦ Natural Allies</GhostBtn>
            )}
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
                  {r.ally && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', border: `1px solid ${ALLY_TYPE_COLOR[r.ally.type || 'planet']}33`, background: ALLY_TYPE_COLOR[r.ally.type || 'planet'] + '10', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px' }}>{r.ally.glyph}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: '8.5px', letterSpacing: '1px', color: ALLY_TYPE_COLOR[r.ally.type || 'planet'] }}>{r.ally.name}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: '8px', color: 'var(--dim)' }}> · {r.ally.role}</span>
                    </div>
                  )}
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
function InvokePanel({ seed, clearSeed, addInvocation, showToast, audio, allySeed, clearAllySeed }) {
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
  // Natural Ally state
  const [ally, setAlly] = useState(allySeed || null); // { name, glyph, role, use, type }
  const [allyPickOpen, setAllyPickOpen] = useState(false);
  const symbol = STRUCTURE_BY_ID[symbolId];
  const sA = ACCENT[symbol.primaryLayer];
  const bedOn = audio.tone && audio.audioSource === 'chamber';

  useEffect(() => { if (seed) { setSymbolId(seed); setSymbolAuto(false); setMatchReason('Carried from your study.'); setStage('attune'); clearSeed(); } /* eslint-disable-next-line */ }, [seed]);
  useEffect(() => { if (allySeed) { setAlly(allySeed); clearAllySeed && clearAllySeed(); } /* eslint-disable-next-line */ }, [allySeed]);
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
    const allyLine = ally ? `\nNatural Ally: ${ally.name} ${ally.glyph} (${ally.type || 'ally'}) — ${ally.role}. Empowerment/restoration principle: ${ally.use} Weave the ally's name or natural quality into the opening or one layer line as a living example of the same principle the symbol expresses — not as magic, as a concrete natural analogy.` : '';
    const prompt = `You are composing an Invocation for a practitioner of the Cosmic Reality Framework, spoken aloud from a calm, receptive (theta) state. It MUST be structured as a descent through the five layers of the framework, personalized to the practitioner's intention and the symbol they resonate with.\nIntention: \"${intention.trim() || 'to align with intelligent order'}\"\nDomain: ${domain}\nSymbol: ${symbol.name} — principle: \"${symbol.principle}\"\nFive layers of the symbol:\n- Intelligent Order: ${m.intelligentOrder}\n- Structure: ${m.structure}\n- Pattern: ${m.pattern}\n- Rhythm: ${m.rhythm}\n- Events: ${m.events}${allyLine}\nPower words to weave in CAPS: ${words}\n${tone_}\nProvide ONE first-person, present-tense line for EACH of the five layers, drawing on the symbol's quality and the intention, weaving a power word in CAPS where natural. Add a short opening line (layer null) naming the intention and symbol, and a short closing line (layer null) that seals it. The Events line speaks to it taking form in the physical. Honesty: the words align and commit the speaker; they do NOT promise instantaneous supernatural manifestation — the physical completes through aligned action.\nThen \"action\": one concrete Recommended Participation in their ${domain.toLowerCase()} that carries it into the physical.\nRespond ONLY with minified JSON: {\"invocation\":[{\"layer\":\"Intelligent Order|Structure|Pattern|Rhythm|Events|null\",\"text\":\"...\"}],\"action\":\"...\"}`;
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
    const rec = { id: Date.now(), ts: new Date().toISOString(), intention: intention.trim(), domain, symbolId, symbolName: symbol.name, register, powerWords: [...picked], ally: ally ? { name: ally.name, glyph: ally.glyph, role: ally.role, type: ally.type } : null, lines: invocation.length ? invocation : buildInvocation(symbol, register, picked, intention), action: action || localActionFor(symbol, domain) };
    addInvocation(rec); showToast('\u2726 Invocation saved to your Journal.');
  }
  function resetAll() { setStage('attune'); setIntention(''); setPicked([]); setInvocation([]); setAction(''); setFreq(0); setScriptIdx(0); setNote(''); setAlly(null); }

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
          {/* Natural Ally optional selector */}
          {NATURAL_ALLIES[symbolId] && (
            <div style={{ marginTop: '22px' }}>
              <button onClick={() => setAllyPickOpen(o => !o)} style={{ border: 'none', background: 'transparent', color: 'var(--muted)', fontFamily: FONT.sans, fontSize: '12px', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {allyPickOpen ? '▾' : '▸'} <span style={{ color: ally ? ALLY_TYPE_COLOR[ally.type || 'planet'] : 'var(--muted)' }}>{ally ? `Natural Ally: ${ally.glyph} ${ally.name}` : 'Attach a Natural Ally (optional)'}</span>
                {ally && <button onClick={(e) => { e.stopPropagation(); setAlly(null); }} style={{ border: 'none', background: 'transparent', color: 'var(--dim)', cursor: 'pointer', fontSize: '11px', padding: '0 4px' }}>✕</button>}
              </button>
              {allyPickOpen && (
                <div style={{ marginTop: '10px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--chip)', padding: '14px', maxHeight: '280px', overflowY: 'auto' }}>
                  <p style={{ fontFamily: FONT.body, fontSize: '13px', color: 'var(--dim)', margin: '0 0 10px' }}>Choose a natural form whose principle mirrors your intention. It will be woven into the forged invocation.</p>
                  {['planets', 'animals', 'plants'].map(typeKey => {
                    const type = typeKey === 'planets' ? 'planet' : typeKey === 'animals' ? 'animal' : 'plant';
                    const color = ALLY_TYPE_COLOR[type];
                    return (
                      <div key={typeKey} style={{ marginBottom: '10px' }}>
                        <div style={{ fontFamily: FONT.mono, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color, marginBottom: '5px' }}>{ALLY_TYPE_GLYPH[type]} {ALLY_TYPE_LABEL[type]}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {NATURAL_ALLIES[symbolId][typeKey].map(a => {
                            const isOn = ally && ally.name === a.name && ally.type === type;
                            return (
                              <button key={a.name} onClick={() => { setAlly({ ...a, type }); setAllyPickOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${isOn ? color + '66' : 'var(--border)'}`, background: isOn ? color + '12' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                                <span style={{ fontSize: '16px' }}>{a.glyph}</span>
                                <div>
                                  <div style={{ fontFamily: FONT.head, fontSize: '13px', color: isOn ? color : 'var(--text)' }}>{a.name}</div>
                                  <div style={{ fontFamily: FONT.mono, fontSize: '8px', color: color, letterSpacing: '1px', textTransform: 'uppercase' }}>{a.role}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
          {ally && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${ALLY_TYPE_COLOR[ally.type || 'planet']}33`, background: ALLY_TYPE_COLOR[ally.type || 'planet'] + '08', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>{ally.glyph}</span>
              <div>
                <div style={{ fontFamily: FONT.mono, fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: ALLY_TYPE_COLOR[ally.type || 'planet'], marginBottom: '2px' }}>NATURAL ALLY · {(ally.type || 'ally').toUpperCase()}</div>
                <div style={{ fontFamily: FONT.head, fontSize: '14px', color: 'var(--text)' }}>{ally.name} · {ally.role}</div>
              </div>
            </div>
          )}
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
  const [allySeed, setAllySeed] = useState(null); // { name, glyph, role, use, type }
  const [pinnedAlly, setPinnedAlly] = useState(null); // "type:name"
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

  const openApply = (s, ally) => { setApplyId(s.id); setSelected(null); setTab('apply'); };
  const addInvocation = (r) => setInvocations((xs) => [...xs, r]);
  const removeInvocation = (id) => setInvocations((xs) => xs.filter((x) => x.id !== id));
  const openInvoke = (s) => { setInvokeSeed(s.id); setSelected(null); setTab('invoke'); };
  const carryInvoke = (s, ally, type) => { setInvokeSeed(s.id); setAllySeed({ ...ally, type }); setSelected(null); setTab('invoke'); };

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
                  {filtered.map((s) => <Card key={s.id} s={s} onOpen={setSelected} studied={studied.has(s.id)} hasAlly={!!NATURAL_ALLIES[s.id]} />)}
                </div>
              )}
            </div>
          )}

          {tab === 'mapping' && <MappingPanel />}
          {tab === 'apply' && <ApplyPanel applyId={applyId} setApplyId={setApplyId} addApplication={addApplication} showToast={showToast} goJournal={() => setTab('journal')} />}
          {tab === 'invoke' && <InvokePanel seed={invokeSeed} clearSeed={() => setInvokeSeed(null)} addInvocation={addInvocation} showToast={showToast} audio={audio} allySeed={allySeed} clearAllySeed={() => setAllySeed(null)} />}
          {tab === 'journal' && <JournalPanel applications={applications} removeApplication={removeApplication} invocations={invocations} removeInvocation={removeInvocation} audio={audio} studiedCount={studied.size} goExplore={() => setTab('explore')} goApply={() => setTab('apply')} goInvoke={() => setTab('invoke')} />}
        </div>
      </div>

      <Modal s={selected} onClose={() => setSelected(null)} studied={studied} onToggleStudied={toggleStudied} onApply={openApply} onInvoke={openInvoke} pinnedAlly={pinnedAlly} onPin={setPinnedAlly} onCarryInvoke={carryInvoke} />

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
