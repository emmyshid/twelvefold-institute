// ════════════════════════════════════════════════════════════════
// Sector content configuration for /for-institutions/[sector].
//
// Each sector page renders from this config. To add a new sector,
// add an entry here and it becomes routable at /for-institutions/{key}.
//
// Content is intentionally sector-specific: a healthcare CMO reads
// different signals than a school superintendent than a corporate
// CLO. The generic /institutions page still exists as a hub for
// visitors who haven't self-identified.
// ════════════════════════════════════════════════════════════════

export type Sector = "schools" | "healthcare" | "corporate";

export interface SectorConfig {
  key: Sector;
  navLabel: string;                // small nav pill
  eyebrow: string;                 // uppercase eyebrow above hero
  hero: {
    lead: string;                  // first line of hero H1
    accent: string;                // italic phrase on second line
    sub: string;                   // sub-hero paragraph
  };
  painPoint: {
    heading: string;
    body: string;
    bullets: string[];             // 4 concrete scenarios
  };
  useCases: Array<{
    label: string;                 // small eyebrow (e.g. "K-12 Superintendent")
    title: string;                 // what pattern literacy does for them
    body: string;                  // how it plays out in practice
  }>;
  roi: {
    heading: string;
    body: string;
    metrics: Array<{
      value: string;               // e.g. "12–18 months"
      label: string;               // e.g. "typical implementation arc"
    }>;
  };
  testimonial: {
    quote: string;
    name: string;
    context: string;
  };
  cta: {
    heading: string;
    body: string;
    scopeValue: Sector;            // sent to /api/institutions/consult
  };
}

export const SECTORS: Record<Sector, SectorConfig> = {
  // ──────────────────────────────────────────────────────────────
  schools: {
    key: "schools",
    navLabel: "Schools",
    eyebrow: "For schools & universities",
    hero: {
      lead: "Students graduate without understanding their own patterns.",
      accent: "Give them the framework before they need it.",
      sub: "Pattern literacy in K-12, higher ed, and educational leadership. A framework for student clarity, faculty coherence, and institutional decision-making that reads the phase — not just the metrics.",
    },
    painPoint: {
      heading: "The signals every educator is already reading — without the language for them.",
      body:
        "You watch cohorts move through the same patterns year after year. You feel the phase your institution is in before the board recognizes it. Pattern literacy gives you the framework to name what you already know — and act on it before the crisis phase arrives.",
      bullets: [
        "A capable student stalls mid-semester. You see it's not motivation — it's the wrong phase for the work being asked. Pattern literacy names which phase, and what that student actually needs.",
        "Faculty burnout keeps recurring in the same departments. The 12-phase reading shows it's institutional Contraction being met with Expansion strategy — a phase mismatch, not a people problem.",
        "Governance meetings feel stuck on tactics. Reading the institution's phase reveals whether the moment is asking for Foundation work, or whether Structure has calcified past its usefulness.",
        "A curriculum redesign fails to land. Pattern literacy shows the redesign was aligned to where the school was five years ago, not the phase it's currently in.",
      ],
    },
    useCases: [
      {
        label: "K-12 Superintendent",
        title: "Institutional phase diagnostic",
        body: "Six-week reading of where the district actually is, what the phase is asking, and which strategic moves cooperate with it. Includes leadership session, board briefing, and written diagnostic. Best used before major restructures, superintendent transitions, or strategic planning cycles.",
      },
      {
        label: "University leadership",
        title: "Faculty and student cohort pattern-reading",
        body: "Framework training for department chairs, deans, and student affairs. Reads cohort-level patterns rather than individual behavior. Particularly useful for retention, mental health, and academic advising in departments experiencing recurring student difficulties.",
      },
      {
        label: "Educational foundations",
        title: "Sector-wide pattern research and thought leadership",
        body: "Research partnerships that read patterns across a portfolio of grantees, cohorts, or member institutions. Produces original diagnostics on which phase the education sector is actually in — used by foundation staff, board, and grantee networks.",
      },
    ],
    roi: {
      heading: "What educational institutions typically see.",
      body:
        "Pattern literacy doesn't replace pedagogy, governance, or student services. It sharpens them. Institutions that adopt the framework report clearer strategic decisions, reduced faculty burnout in specific departments, and improved outcomes in the cohorts where the framework is applied directly. These are pattern-recognition tools, not curricula — the ROI comes from better decisions made faster, not from a new program.",
      metrics: [
        { value: "12–18 months", label: "typical time from pilot to institution-wide adoption" },
        { value: "3–5 leaders", label: "trained initially, before expanding to faculty or staff" },
        { value: "1 board session", label: "included in every institutional engagement" },
      ],
    },
    testimonial: {
      quote:
        "We ran the phase diagnostic before a major program restructure. It named things we all sensed but couldn't articulate — including that the restructure we were planning was fighting the phase, not cooperating with it. We paused, rebuilt the plan, and the outcome was measurably better. Six months later I still return to the framework.",
      name: "Provost, private university",
      context: "Institutional phase diagnostic, 2024",
    },
    cta: {
      heading: "Book a conversation for your institution.",
      body:
        "We'll listen first. If pattern literacy fits your moment, we'll design an engagement to match. If it doesn't, we'll say so directly.",
      scopeValue: "schools",
    },
  },

  // ──────────────────────────────────────────────────────────────
  healthcare: {
    key: "healthcare",
    navLabel: "Healthcare",
    eyebrow: "For healthcare systems",
    hero: {
      lead: "Clinicians burn out from reactive decision-making.",
      accent: "Pattern literacy sharpens clinical judgment before crisis.",
      sub: "For hospitals, clinical teams, and healthcare leadership. A framework for reading which phase a department is in before restructuring — and giving clinicians language for the patterns they're already navigating.",
    },
    painPoint: {
      heading: "The pattern most healthcare leaders can feel but rarely name.",
      body:
        "Departments cycle through the same crises. Restructures fail to reach root causes. Clinician retention efforts land after the phase has already shifted. Pattern literacy gives clinical leadership a framework for reading the phase — and intervening in the phase's actual timing, not the reactive one.",
      bullets: [
        "A capable department loses three physicians in a quarter. The framework reads the department as being in institutional Contraction while leadership was applying Expansion tactics — a phase mismatch, not a leadership failure.",
        "A restructure gets planned, funded, and executed — then quietly reverses within eighteen months. Pattern literacy shows the restructure was solving for the wrong phase.",
        "Burnout initiatives fail to reach the clinicians who most need them. Reading the phase shows why: the department is in Dissolution, and the initiative was designed for Foundation.",
        "A leadership transition creates six months of paralysis. The phase reading names the transition as an Ignition moment being met with Structure thinking — and shows what would actually move the department forward.",
      ],
    },
    useCases: [
      {
        label: "Chief Medical Officer",
        title: "Department-level phase reading",
        body: "Six-week diagnostic reading which phase each department is actually in, where phase mismatches are creating unnecessary friction, and what governance moves would cooperate with each department's current phase rather than fighting it. Includes CMO briefing, department chair sessions, and written phase map.",
      },
      {
        label: "Clinical leadership team",
        title: "Framework training for chairs and directors",
        body: "Direct training in pattern literacy for a leadership cohort — typically 8-15 chairs, medical directors, or nursing leaders. Six sessions over three months. Focused on reading department phase, recognizing team micro-states, and calibrating leadership response to the phase, not the personalities.",
      },
      {
        label: "Health system executive team",
        title: "System-wide pattern diagnostic and strategic partnership",
        body: "Deep engagement reading the phase of the system as a whole — service lines, region, board dynamics, market position. Produces a system-level phase map used in strategic planning. Often paired with framework training for the executive team so the reading survives past the engagement.",
      },
    ],
    roi: {
      heading: "What healthcare systems typically see.",
      body:
        "Pattern literacy doesn't replace clinical judgment, executive leadership, or evidence-based management. It's a diagnostic layer that surfaces phase-level realities other frameworks miss. Health systems that adopt it report faster and more accurate strategic decisions, targeted burnout interventions that actually land, and restructures that don't quietly reverse eighteen months later.",
      metrics: [
        { value: "6–12 weeks", label: "typical initial engagement, from intake to written diagnostic" },
        { value: "8–15 leaders", label: "in a first framework cohort — chairs, directors, or executives" },
        { value: "1 written map", label: "of every department's phase, delivered to leadership" },
      ],
    },
    testimonial: {
      quote:
        "We had spent two years trying to fix one department. Framework named it in the first session: the department was in a phase we were pretending it wasn't in. Once we saw that, the intervention was obvious — and it worked. I now use the framework informally with the other departments too.",
      name: "Chief Medical Officer, regional health system",
      context: "Department phase diagnostic, 2024",
    },
    cta: {
      heading: "Book a conversation for your health system.",
      body:
        "Tell us about the phase you're navigating. If pattern literacy is the right diagnostic layer for it, we'll design an engagement. If a different tool would serve you better, we'll say so.",
      scopeValue: "healthcare",
    },
  },

  // ──────────────────────────────────────────────────────────────
  corporate: {
    key: "corporate",
    navLabel: "Corporate",
    eyebrow: "For corporate leadership",
    hero: {
      lead: "Leaders and teams repeat the same conflicts.",
      accent: "Pattern literacy unlocks the phase-level reason why.",
      sub: "For organizational development, HR, and executive leadership. A framework for reading which phase your organization, team, or leadership is in — and calibrating strategy, culture, and decision-making to the phase you're actually in.",
    },
    painPoint: {
      heading: "The pattern most executive teams sense but can't quite locate.",
      body:
        "The same conflicts recur across quarters, across leaders, across restructures. The frameworks you already use — strengths-based, values-based, systems thinking — surface part of it, but miss the phase-level reality underneath. Pattern literacy names it. And once named, the leadership moves become clear.",
      bullets: [
        "An executive team keeps cycling back to the same strategic debate. Pattern literacy reads the org as being in institutional Contraction — and shows the debate is asking for a decision that only fits Expansion.",
        "A culture initiative launches with fanfare and quietly stalls. Reading the phase shows the culture change was designed for who the company was three years ago, not who it is now.",
        "A leadership transition creates six months of ambiguity. The phase reading names the moment as Ignition being handled with Structure thinking — and shows what the moment is actually asking of the incoming leader.",
        "A team keeps missing quarters. The framework reads the team as being in Correction phase while leadership is measuring against Expansion targets. Adjust the targets to the phase, and the team's performance shifts within a quarter.",
      ],
    },
    useCases: [
      {
        label: "Chief Learning Officer",
        title: "Framework training for leadership cohorts",
        body: "Direct pattern literacy training for a cohort of 12–20 executives or high-potential leaders. Typically six sessions over three months, focused on reading team and org phase, recognizing personal patterns as a leader, and calibrating leadership response to the actual phase. Often paired with 1:1 coaching engagements.",
      },
      {
        label: "Chief People Officer / HR leadership",
        title: "Organizational phase diagnostic",
        body: "Six-week reading of the organization as a whole — where each function is, where phase mismatches are creating unnecessary friction (attrition, culture drag, misaligned initiatives), and what governance moves would cooperate with each function's actual phase. Delivered as a written diagnostic and executive briefing.",
      },
      {
        label: "CEO / Executive Team",
        title: "Strategic phase reading and partnership",
        body: "Direct engagement reading the phase of the company at the strategic level: market position, board dynamics, executive team coherence, cultural phase. Produces a company-level phase map used in strategic planning, board meetings, and executive alignment. Often followed by ongoing quarterly readings.",
      },
    ],
    roi: {
      heading: "What organizations typically see.",
      body:
        "Pattern literacy doesn't replace strategy, culture work, or leadership development. It's a diagnostic layer that reveals phase-level realities other frameworks miss. Organizations that adopt it report faster strategic decisions, culture initiatives that actually land, executive teams that stop cycling on the same debates, and leadership cohorts who can read their teams' phases without needing HR to interpret.",
      metrics: [
        { value: "12–20 leaders", label: "in a typical framework cohort" },
        { value: "6–12 weeks", label: "from intake to written diagnostic or first cohort session" },
        { value: "1–3 years", label: "typical partnership arc, quarterly touchpoints" },
      ],
    },
    testimonial: {
      quote:
        "I brought Twelvefold in because our executive team kept cycling on the same strategic questions. The first phase reading named the actual reason — we were trying to make Expansion decisions in a Contraction moment. Within a quarter, decisions were faster and better. I now use the framework with my direct reports informally, every week.",
      name: "CEO, mid-market SaaS company",
      context: "Executive team framework engagement, 2024",
    },
    cta: {
      heading: "Book a conversation for your organization.",
      body:
        "Tell us what pattern you're seeing. We'll listen first. If pattern literacy is the right tool for your moment, we'll design an engagement that matches. If it isn't, we'll say so.",
      scopeValue: "corporate",
    },
  },
};

export const SECTOR_KEYS: Sector[] = ["schools", "healthcare", "corporate"];
