import React, { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// PartnershipMap — Structural Partnership Map + Institutional Diagnostic
//
// Portal-integrated build. Was v2 preview (session-only). Now:
//   • Persists to localStorage under key "tfi-partnership-map"
//   • Calls /api/org-diagnostic (server-side) instead of the browser
//     making direct requests to api.anthropic.com
//   • Uses portal design tokens (dark cosmic aesthetic) for chrome,
//     retains the framework's semantic colors (phases, status weights)
//
// Data model:
//   • Contributors — people who own or share capacity areas
//   • Areas — units of organizational work, each tagged with owner(s),
//     category, ownership status (single/shared/distributed), notes,
//     and (once diagnosed) a phase relevance from the org reading
//   • Org reading — the AI-generated institutional diagnostic that
//     names the org's current pattern, phase, and recommended
//     participation
// ---------------------------------------------------------------------------

const CATEGORIES = [
  "Certification",
  "Institutional Licensing",
  "Community",
  "Research & Thought Leadership",
  "Books & Media",
  "Operations",
  "Other",
];

const STATUS = {
  single: { label: "Single-owner", color: "#B5652D", weight: 1 },
  shared: { label: "Shared", color: "#C9A227", weight: 2 },
  distributed: { label: "Distributed", color: "#6B8F6B", weight: 3 },
};

const PHASES = [
  { id: 1, name: "Aries", label: "Ignition", color: "#FF6B6B" },
  { id: 2, name: "Taurus", label: "Foundation", color: "#8B7355" },
  { id: 3, name: "Gemini", label: "Intelligence", color: "#6BC5FF" },
  { id: 4, name: "Cancer", label: "Inner Root", color: "#C5A3FF" },
  { id: 5, name: "Leo", label: "Authority", color: "#FFB347" },
  { id: 6, name: "Virgo", label: "Correction", color: "#7BBF7B" },
  { id: 7, name: "Libra", label: "Balance", color: "#FFB6C1" },
  { id: 8, name: "Scorpio", label: "Transformation", color: "#8B0000" },
  { id: 9, name: "Sagittarius", label: "Expansion", color: "#9B59B6" },
  { id: 10, name: "Capricorn", label: "Structure", color: "#5B5B5B" },
  { id: 11, name: "Aquarius", label: "Liberation", color: "#00CED1" },
  { id: 12, name: "Pisces", label: "Dissolution", color: "#4169E1" },
];

const MICRO_STATES = ["Initiation", "Expansion", "Contraction", "Integration"];

const uid = () => Math.random().toString(36).slice(2, 10);

// ---------------------------------------------------------------------------
// Institutional Diagnostic System Prompt
// Grounded in Chapter 11's organizational pattern types and the 48-state
// Pattern Name Library. Produces a structured institutional reading.
// ---------------------------------------------------------------------------

const ORG_DIAGNOSTIC_SYSTEM_PROMPT = `You are the PatternOS Institutional Diagnostic Engine — an extension of the Pattern Institute's framework that reads organizational patterns the same way PatternOS reads individual patterns.

You apply the 12-phase x 4-micro-state framework (48 states) to organizations, teams, and institutions.

## ORGANIZATIONAL PATTERN TYPES (from the framework)

These are recurring organizational archetypes. An organization may exhibit one or blend several:

**The Aries Organization (Perpetual Beginning):** Excellent at launching, poor at sustaining. Many initiatives, few completions. Culture rewards novelty. Teaching needed: Taurus (foundation, sustained commitment).

**The Virgo Organization (Perfectionism Without Shipping):** Expert at identifying problems, slow to act. Reviews multiply, committees form, nothing ships until perfect. Teaching: done and learning beats perpetually refining.

**The Scorpio Organization (Recurring Crisis):** Cycles through crises — breakdown, reconstruction, apparent stability, repeat. Usually a fundamental tension that hasn't been faced directly. Teaching: face the root cause.

**The Libra Organization (Paralysis by Fairness):** Values inclusion so highly that decisions become impossible. Extensive consultation, required consensus, very slow movement. Teaching: real fairness sometimes requires difficult decisions.

## THE 12 PHASES (applied to organizations)

1. Aries (Ignition) — New initiatives, founding energy, breaking organizational inertia
2. Taurus (Foundation) — Building infrastructure, stabilizing operations, patient growth
3. Gemini (Intelligence) — Information gathering, communication systems, learning culture
4. Cancer (Inner Root) — Organizational identity, culture, emotional safety of members
5. Leo (Authority) — Leadership visibility, brand expression, organizational confidence
6. Virgo (Correction) — Process refinement, quality systems, operational healing
7. Libra (Balance) — Partnerships, stakeholder relationships, fairness structures
8. Scorpio (Transformation) — Deep structural change, crisis as catalyst, ego death of old identity
9. Sagittarius (Expansion) — Vision casting, scaling, reaching new audiences
10. Capricorn (Structure) — Legacy building, governance, long-term architecture
11. Aquarius (Liberation) — Innovation, breaking outdated structures, systemic reinvention
12. Pisces (Dissolution) — Completing cycles, releasing what's finished, organizational rest

## THE 4 MICRO-STATES (organizational)

1. Initiation — The pattern is emerging. First signals in the organizational field.
2. Expansion — The pattern intensifies. Organizational pressure builds.
3. Contraction — Resistance, setbacks, what doesn't serve dissolves.
4. Integration — The lesson is absorbed. New organizational capacity crystallizes.

## YOUR TASK

Given:
1. A description of the organization's current situation
2. The organization's capacity areas and their dependency status

Produce a structured institutional pattern reading. Identify the PRIMARY organizational phase and micro-state. Name the collective curriculum. Identify avoidance zones. Provide recommended participation for the organization.

## OUTPUT FORMAT

Respond ONLY with valid JSON. No text outside the JSON. No markdown fences.

{
  "org_reading": {
    "phase_number": 1-12,
    "phase_name": "Aries|Taurus|...|Pisces",
    "phase_label": "Ignition|Foundation|...|Dissolution",
    "micro_state": "Initiation|Expansion|Contraction|Integration",
    "state_code": "1.1-12.4",
    "pattern_name": "The human-readable Pattern Name for this state",
    "org_pattern_type": "Aries Organization|Virgo Organization|Scorpio Organization|Libra Organization|[or another phase-named type if none of the four fit]",
    "collective_curriculum": "What the organization is being taught right now — 2-3 sentences",
    "active_lesson": "The specific instruction for the organization — 1-2 sentences",
    "avoidance_zone": "What the organization is systematically not facing — 1-2 sentences",
    "recommended_participation": "How the organization should cooperate with this phase — 2-3 sentences of concrete guidance",
    "what_breaks_if_ignored": "What will happen if the organization resists this curriculum — 1-2 sentences",
    "next_phase_signal": "What will indicate the organization is ready to move to the next phase — 1 sentence"
  },
  "capacity_tags": [
    {
      "area_name": "Name of the capacity area",
      "phase_relevance": "Which phase this area is most connected to and why — 1 sentence"
    }
  ]
}`;

// ─── Storage ─────────────────────────────────────────────────
// SSR-safe localStorage with in-memory fallback. Mirrors the pattern
// used across the rest of PortalClient. Data persists across page
// refreshes on the same device; multi-device sync would require a
// server-persisted version (Supabase table + API endpoint).

const STORAGE_KEY = "tfi-partnership-map";
const DEFAULT_DATA = { contributors: [], areas: [] };
const _mem = {};

function loadPersistent() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    }
    return _mem[STORAGE_KEY] !== undefined ? _mem[STORAGE_KEY] : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function savePersistent(val) {
  _mem[STORAGE_KEY] = val;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    }
  } catch {
    // Quota errors or private-mode restrictions — silently degrade
    // to in-memory. The user still sees their edits in this session.
  }
}

function useStorage() {
  // Hydrate from localStorage on mount, not initial state, so SSR
  // and client-first-render agree (avoids hydration mismatches).
  const [data, setData] = useState(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadPersistent());
    setLoaded(true);
  }, []);

  const save = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePersistent(next);
      return next;
    });
    return true;
  }, []);

  return { data, save, loaded, status: "persistent", errorMsg: "" };
}

// --- Shared UI components ---

function Beam({ status }) {
  const s = STATUS[status];
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 22 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: i < s.weight ? 10 + i * 6 : 6,
            background: i < s.weight ? s.color : "rgba(255,255,255,0.08)",
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

function Badge({ children, color, subtle }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 3,
        fontSize: 11,
        fontFamily: "'Space Mono', 'Courier New', monospace",
        letterSpacing: 0.3,
        color: subtle ? "rgba(255,255,255,0.5)" : color,
        border: "1px solid " + (subtle ? "rgba(255,255,255,0.08)" : color),
        background: subtle ? "transparent" : (color + "14"),
      }}
    >
      {children}
    </span>
  );
}

function TextField({ label, value, onChange, placeholder, style, multiline }) {
  const shared = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
    padding: "8px 10px",
    color: "#E8E4F0",
    fontSize: 14,
    fontFamily: "'Crimson Text', Georgia, serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          style={{ ...shared, resize: "vertical", lineHeight: 1.5 }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={shared}
        />
      )}
    </label>
  );
}

function SelectField({ label, value, onChange, options, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: "8px 10px",
          color: "#E8E4F0",
          fontSize: 14,
          fontFamily: "'Crimson Text', Georgia, serif",
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Button({ children, onClick, variant = "primary", style, disabled }) {
  const base = {
    padding: "9px 16px",
    borderRadius: 4,
    fontSize: 13,
    fontFamily: "'Space Mono', 'Courier New', monospace",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    letterSpacing: 0.3,
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "#C9A227", color: "#06060F", fontWeight: 600 },
    ghost: { background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" },
    danger: { background: "transparent", color: "#B5652D", border: "1px solid #3A2A20" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function SummaryStat({ label, value, color = "#E8E4F0" }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, color, fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

function EmptyState({ title, body, action, actionLabel }) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        border: "1px dashed rgba(255,255,255,0.08)",
        borderRadius: 6,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      <div style={{ color: "#E8E4F0", fontSize: 15, marginBottom: 6, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 13, maxWidth: 420, margin: "0 auto", lineHeight: 1.5 }}>{body}</div>
      {action && (
        <div style={{ marginTop: 16 }}>
          <Button onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

// --- Org Reading Result Display ---

function OrgReadingResult({ reading, onClear }) {
  if (!reading) return null;
  const r = reading.org_reading;
  const phase = PHASES.find((p) => p.id === r.phase_number) || PHASES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Phase header */}
      <div
        style={{
          padding: "20px 24px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid " + phase.color,
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: phase.color + "22",
              border: "2px solid " + phase.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Space Mono', 'Courier New', monospace",
              fontSize: 14,
              color: phase.color,
              fontWeight: 600,
            }}
          >
            {r.state_code}
          </div>
          <div>
            <div style={{ fontSize: 20, color: "#E8E4F0", fontWeight: 600 }}>
              {r.pattern_name}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              {r.phase_name} ({r.phase_label}) · {r.micro_state}
            </div>
          </div>
        </div>
        <Badge color={phase.color}>{r.org_pattern_type}</Badge>
      </div>

      {/* Curriculum */}
      <ReadingBlock label="COLLECTIVE CURRICULUM" text={r.collective_curriculum} />
      <ReadingBlock label="ACTIVE LESSON" text={r.active_lesson} />
      <ReadingBlock label="AVOIDANCE ZONE" text={r.avoidance_zone} color="#B5652D" />
      <ReadingBlock label="RECOMMENDED PARTICIPATION" text={r.recommended_participation} color="#C9A227" />
      <ReadingBlock label="WHAT BREAKS IF IGNORED" text={r.what_breaks_if_ignored} color="#8B0000" />
      <ReadingBlock label="NEXT PHASE SIGNAL" text={r.next_phase_signal} color="#6B8F6B" />

      {/* Capacity tags */}
      {reading.capacity_tags && reading.capacity_tags.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", letterSpacing: 0.8, marginBottom: 10 }}>
            CAPACITY AREA PHASE MAPPING
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reading.capacity_tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#E8E4F0", fontWeight: 500 }}>{tag.area_name}</span>
                <span style={{ color: "rgba(255,255,255,0.5)" }}> — {tag.phase_relevance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Button variant="ghost" onClick={onClear}>New reading</Button>
      </div>
    </div>
  );
}

function ReadingBlock({ label, text, color = "#E8E4F0" }) {
  return (
    <div
      style={{
        padding: "14px 18px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6,
      }}
    >
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

// ===== MAIN COMPONENT =====

export default function PartnershipMap() {
  const { data, save, loaded, status } = useStorage();
  const { contributors, areas } = data;

  const [tab, setTab] = useState("map");
  const [newContributor, setNewContributor] = useState({ name: "", role: "" });
  const [newArea, setNewArea] = useState({
    name: "",
    category: CATEGORIES[0],
    ownerIds: [],
    status: "single",
    notes: "",
  });

  // Org reading state
  const [orgInput, setOrgInput] = useState({
    situation: "",
    recurring: "",
    stuck: "",
    changing: "",
  });
  const [orgReading, setOrgReading] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");

  if (!loaded) {
    return (
      <div style={pageStyle}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", fontSize: 13 }}>
          Loading structural map...
        </div>
      </div>
    );
  }

  // --- Capacity Map handlers (all synchronous, functional updaters) ---

  const addContributor = () => {
    if (!newContributor.name.trim()) return;
    const c = { id: uid(), name: newContributor.name.trim(), role: newContributor.role.trim() };
    save((prev) => ({ ...prev, contributors: [...prev.contributors, c] }));
    setNewContributor({ name: "", role: "" });
  };

  const removeContributor = (id) => {
    save((prev) => ({
      contributors: prev.contributors.filter((c) => c.id !== id),
      areas: prev.areas.map((a) => ({
        ...a,
        ownerIds: a.ownerIds.filter((oid) => oid !== id),
      })),
    }));
  };

  const addArea = () => {
    if (!newArea.name.trim()) return;
    const a = {
      id: uid(),
      name: newArea.name.trim(),
      category: newArea.category,
      ownerIds: newArea.ownerIds,
      status: newArea.status,
      notes: newArea.notes.trim(),
      phaseTag: null,
    };
    save((prev) => ({ ...prev, areas: [...prev.areas, a] }));
    setNewArea({ name: "", category: CATEGORIES[0], ownerIds: [], status: "single", notes: "" });
    setTab("map");
  };

  const removeArea = (id) => {
    save((prev) => ({ ...prev, areas: prev.areas.filter((a) => a.id !== id) }));
  };

  const updateAreaStatus = (id, newStatus) => {
    save((prev) => ({
      ...prev,
      areas: prev.areas.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    }));
  };

  const toggleOwnerOnNewArea = (id) => {
    setNewArea((prev) => ({
      ...prev,
      ownerIds: prev.ownerIds.includes(id)
        ? prev.ownerIds.filter((x) => x !== id)
        : [...prev.ownerIds, id],
    }));
  };

  const contributorName = (id) => contributors.find((c) => c.id === id)?.name || "\u2014";

  // --- Org Reading handler ---

  const runOrgReading = () => {
    const situationText = orgInput.situation.trim();
    if (!situationText) {
      setOrgError("Describe the organization's current situation to get a reading.");
      return;
    }
    setOrgLoading(true);
    setOrgError("");
    setOrgReading(null);

    const capacityContext = areas.length > 0
      ? "\n\nCAPACITY AREAS:\n" + areas.map((a) => {
          const owners = a.ownerIds.map((oid) => contributorName(oid)).join(", ") || "unassigned";
          return "- " + a.name + " (" + a.category + ") — " + STATUS[a.status].label + " — owners: " + owners;
        }).join("\n")
      : "";

    const userMessage = "ORGANIZATIONAL SITUATION:\n" + situationText
      + (orgInput.recurring.trim() ? "\n\nRECURRING PATTERNS:\n" + orgInput.recurring.trim() : "")
      + (orgInput.stuck.trim() ? "\n\nWHAT'S STUCK:\n" + orgInput.stuck.trim() : "")
      + (orgInput.changing.trim() ? "\n\nWHAT'S CHANGING:\n" + orgInput.changing.trim() : "")
      + capacityContext;

    // /api/org-diagnostic accepts a single flat `prompt` field. Combine
    // the system prompt (framework instructions) with the user message
    // by prefixing the system prompt as context. The server handles
    // auth, rate limiting, and JSON salvage parsing — we just get back
    // the parsed diagnostic object.
    const combinedPrompt = ORG_DIAGNOSTIC_SYSTEM_PROMPT
      + "\n\n---\n\n"
      + userMessage;

    fetch("/api/org-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: combinedPrompt }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error || "Diagnostic service unavailable.");
        }
        return json;
      })
      .then((parsed) => {
        setOrgReading(parsed);

        // Apply phase tags to matching capacity areas
        if (parsed.capacity_tags && parsed.capacity_tags.length > 0) {
          save((prev) => ({
            ...prev,
            areas: prev.areas.map((a) => {
              const match = parsed.capacity_tags.find(
                (t) => t.area_name.toLowerCase() === a.name.toLowerCase()
              );
              if (match) {
                return { ...a, phaseTag: match.phase_relevance };
              }
              return a;
            }),
          }));
        }
      })
      .catch((e) => {
        console.error("Org diagnostic error:", e);
        setOrgError("The reading could not be completed: " + (e.message || "unknown error"));
      })
      .finally(() => {
        setOrgLoading(false);
      });
  };

  // --- Computed values ---

  const totalAreas = areas.length;
  const singlePoint = areas.filter((a) => a.status === "single");
  const distributionScore =
    totalAreas === 0
      ? 0
      : Math.round(
          (areas.reduce((sum, a) => sum + STATUS[a.status].weight, 0) / (totalAreas * 3)) * 100
        );

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: areas.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  // --- Render ---

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'Space Mono', 'Courier New', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            THE PATTERN INSTITUTE
          </div>
          <h1
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              fontWeight: 600,
              fontSize: 26,
              color: "#E8E4F0",
              margin: 0,
              letterSpacing: -0.3,
            }}
          >
            Structural Partnership Map
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8, maxWidth: 560, lineHeight: 1.5 }}>
            Capacity tracking + institutional diagnostic. Map who carries each function,
            then read the organization's pattern to see what it's being taught.
          </p>
          {status === "session" && (
            <div
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontFamily: "'Space Mono', 'Courier New', monospace",
                color: "#C9A227",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A227" }} />
              Preview only — resets on reload.
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            ["map", "Capacity Map"],
            ["contributors", "Contributors"],
            ["add", "Add Area"],
            ["reading", "Org Reading"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: "8px 14px",
                borderRadius: 4,
                fontSize: 13,
                fontFamily: "'Space Mono', 'Courier New', monospace",
                cursor: "pointer",
                background: tab === key ? "rgba(255,255,255,0.04)" : "transparent",
                color: tab === key ? (key === "reading" ? "#C9A227" : "#E8E4F0") : "rgba(255,255,255,0.5)",
                border: "1px solid " + (tab === key ? (key === "reading" ? "#C9A22744" : "rgba(255,255,255,0.08)") : "transparent"),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ============ MAP TAB ============ */}
        {tab === "map" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 24,
                padding: "16px 20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <SummaryStat label="CAPACITY AREAS" value={totalAreas} />
              <SummaryStat
                label="SINGLE-OWNER"
                value={singlePoint.length}
                color={singlePoint.length > 0 ? "#B5652D" : "#6B8F6B"}
              />
              <SummaryStat label="CONTRIBUTORS" value={contributors.length} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", marginBottom: 6 }}>
                  DISTRIBUTION SCORE
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        width: distributionScore + "%",
                        height: "100%",
                        background:
                          distributionScore < 40 ? "#B5652D" : distributionScore < 75 ? "#C9A227" : "#6B8F6B",
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', 'Courier New', monospace", fontSize: 13, color: "#E8E4F0" }}>
                    {distributionScore}%
                  </span>
                </div>
              </div>
            </div>

            {totalAreas === 0 ? (
              <EmptyState
                title="No capacity areas mapped yet."
                body="Add the functions the mission depends on, then run an Org Reading to see what phase the organization is in."
                action={() => setTab("add")}
                actionLabel="Add the first capacity area"
              />
            ) : (
              <>
                {singlePoint.length > 0 && (
                  <div
                    style={{
                      border: "1px solid #3A2A20",
                      background: "#B5652D0F",
                      borderRadius: 6,
                      padding: "14px 18px",
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ fontFamily: "'Space Mono', 'Courier New', monospace", fontSize: 11, color: "#B5652D", letterSpacing: 0.5, marginBottom: 8 }}>
                      SINGLE POINTS OF FAILURE — {singlePoint.length}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {singlePoint.map((a) => (
                        <div key={a.id} style={{ fontSize: 13, color: "#E8E4F0" }}>
                          <span style={{ color: "#B5652D" }}>{"\u2014"}</span> {a.name}
                          {a.ownerIds.length > 0 && (
                            <span style={{ color: "rgba(255,255,255,0.5)" }}> · held by {contributorName(a.ownerIds[0])}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {grouped.map((g) => (
                  <div key={g.category} style={{ marginBottom: 22 }}>
                    <div style={{ fontFamily: "'Space Mono', 'Courier New', monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 0.8, marginBottom: 10 }}>
                      {g.category.toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {g.items.map((a) => (
                        <div
                          key={a.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid " + (a.phaseTag ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)"),
                            borderRadius: 6,
                          }}
                        >
                          <Beam status={a.status} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: "#E8E4F0", fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                              {a.ownerIds.length === 0 ? (
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>No owner assigned</span>
                              ) : (
                                a.ownerIds.map((oid) => (
                                  <span key={oid} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                                    {contributorName(oid)}
                                  </span>
                                ))
                              )}
                            </div>
                            {a.phaseTag && (
                              <div style={{ fontSize: 12, color: "#C9A227", marginTop: 4, fontStyle: "italic" }}>
                                {a.phaseTag}
                              </div>
                            )}
                            {a.notes && !a.phaseTag && (
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{a.notes}</div>
                            )}
                          </div>
                          <select
                            value={a.status}
                            onChange={(e) => updateAreaStatus(a.id, e.target.value)}
                            style={{
                              background: "transparent",
                              border: "1px solid " + STATUS[a.status].color,
                              color: STATUS[a.status].color,
                              borderRadius: 4,
                              padding: "5px 8px",
                              fontSize: 12,
                              fontFamily: "'Space Mono', 'Courier New', monospace",
                            }}
                          >
                            {Object.entries(STATUS).map(([k, v]) => (
                              <option key={k} value={k} style={{ background: "rgba(255,255,255,0.04)", color: "#E8E4F0" }}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeArea(a.id)}
                            title="Remove"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "rgba(255,255,255,0.35)",
                              cursor: "pointer",
                              fontSize: 16,
                              lineHeight: 1,
                              padding: 4,
                            }}
                          >
                            {"\u00D7"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ============ CONTRIBUTORS TAB ============ */}
        {tab === "contributors" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
                padding: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                flexWrap: "wrap",
                alignItems: "flex-end",
              }}
            >
              <TextField
                label="NAME"
                value={newContributor.name}
                onChange={(v) => setNewContributor((p) => ({ ...p, name: v }))}
                placeholder="e.g. Maria Torres"
                style={{ flex: 1, minWidth: 160 }}
              />
              <TextField
                label="ROLE / DOMAIN"
                value={newContributor.role}
                onChange={(v) => setNewContributor((p) => ({ ...p, role: v }))}
                placeholder="e.g. Community moderation"
                style={{ flex: 1, minWidth: 160 }}
              />
              <Button onClick={addContributor}>Add contributor</Button>
            </div>

            {contributors.length === 0 ? (
              <EmptyState
                title="No contributors yet."
                body="Add anyone who currently carries a piece of the mission."
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {contributors.map((c) => {
                  const owned = areas.filter((a) => a.ownerIds.includes(c.id));
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "12px 16px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#E8E4F0", fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                        {c.role && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{c.role}</div>}
                      </div>
                      <Badge color="rgba(255,255,255,0.5)" subtle>
                        {owned.length} AREA{owned.length !== 1 ? "S" : ""}
                      </Badge>
                      <button
                        onClick={() => removeContributor(c.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.35)",
                          cursor: "pointer",
                          fontSize: 16,
                          lineHeight: 1,
                          padding: 4,
                        }}
                      >
                        {"\u00D7"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============ ADD AREA TAB ============ */}
        {tab === "add" && (
          <div
            style={{
              padding: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <TextField
              label="CAPACITY AREA NAME"
              value={newArea.name}
              onChange={(v) => setNewArea((p) => ({ ...p, name: v }))}
              placeholder="e.g. Certification cohort delivery"
            />
            <div style={{ display: "flex", gap: 16 }}>
              <SelectField
                label="CATEGORY"
                value={newArea.category}
                onChange={(v) => setNewArea((p) => ({ ...p, category: v }))}
                options={CATEGORIES}
                style={{ flex: 1 }}
              />
              <SelectField
                label="DEPENDENCY STATUS"
                value={newArea.status}
                onChange={(v) => setNewArea((p) => ({ ...p, status: v }))}
                options={Object.keys(STATUS)}
                style={{ flex: 1 }}
              />
            </div>

            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', 'Courier New', monospace", marginBottom: 8 }}>
                OWNERS
              </div>
              {contributors.length === 0 ? (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                  Add contributors first, or leave unassigned for now.
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {contributors.map((c) => {
                    const active = newArea.ownerIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleOwnerOnNewArea(c.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontFamily: "'Space Mono', 'Courier New', monospace",
                          cursor: "pointer",
                          background: active ? "#C9A22722" : "transparent",
                          color: active ? "#C9A227" : "rgba(255,255,255,0.5)",
                          border: "1px solid " + (active ? "#C9A227" : "rgba(255,255,255,0.08)"),
                        }}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <TextField
              label="NOTES (OPTIONAL)"
              value={newArea.notes}
              onChange={(v) => setNewArea((p) => ({ ...p, notes: v }))}
              placeholder="What would break if this owner stepped away?"
            />

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Button onClick={addArea}>Save capacity area</Button>
              <Button variant="ghost" onClick={() => setTab("map")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* ============ ORG READING TAB ============ */}
        {tab === "reading" && (
          <>
            {orgReading ? (
              <OrgReadingResult
                reading={orgReading}
                onClear={() => {
                  setOrgReading(null);
                  setOrgError("");
                }}
              />
            ) : (
              <div
                style={{
                  padding: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 14, color: "#E8E4F0", lineHeight: 1.6 }}>
                  Describe the organization as it is right now. The diagnostic reads
                  the same 12-phase framework that PatternOS applies to individuals —
                  extended to the collective level per Chapter 11.
                </div>

                {areas.length > 0 && (
                  <div style={{
                    padding: "10px 14px",
                    background: "#06060F",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    {areas.length} capacity area{areas.length !== 1 ? "s" : ""} will be included
                    automatically in the reading context.
                  </div>
                )}

                <TextField
                  label="CURRENT SITUATION"
                  value={orgInput.situation}
                  onChange={(v) => setOrgInput((p) => ({ ...p, situation: v }))}
                  placeholder="What is the organization doing right now? What phase of development is it in? What decisions are being made?"
                  multiline
                />

                <TextField
                  label="RECURRING PATTERNS (OPTIONAL)"
                  value={orgInput.recurring}
                  onChange={(v) => setOrgInput((p) => ({ ...p, recurring: v }))}
                  placeholder="What keeps happening? What dynamics repeat regardless of who's involved?"
                  multiline
                />

                <TextField
                  label="WHAT'S STUCK (OPTIONAL)"
                  value={orgInput.stuck}
                  onChange={(v) => setOrgInput((p) => ({ ...p, stuck: v }))}
                  placeholder="Where does progress stall? What conversations keep being avoided?"
                  multiline
                />

                <TextField
                  label="WHAT'S CHANGING (OPTIONAL)"
                  value={orgInput.changing}
                  onChange={(v) => setOrgInput((p) => ({ ...p, changing: v }))}
                  placeholder="What's in motion? What's dying? What's emerging?"
                  multiline
                />

                {orgError && (
                  <div style={{ fontSize: 13, color: "#B5652D", padding: "10px 14px", background: "#B5652D0F", border: "1px solid #3A2A20", borderRadius: 4 }}>
                    {orgError}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <Button onClick={runOrgReading} disabled={orgLoading}>
                    {orgLoading ? "Reading the pattern..." : "Run institutional diagnostic"}
                  </Button>
                </div>

                {orgLoading && (
                  <div style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'Space Mono', 'Courier New', monospace",
                    padding: "12px 0",
                  }}>
                    Applying the 12-phase framework to the organizational field...
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Space Mono', 'Courier New', monospace",
          }}
        >
          Vision holder → vision steward. Capacity map + institutional diagnostic.
          Data persists to your browser (localStorage) — sign in on the same
          browser to keep your work.
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#06060F",
  padding: "32px 20px 60px",
  fontFamily: "'Crimson Text', Georgia, serif",
};
