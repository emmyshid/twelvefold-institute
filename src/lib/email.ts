import "server-only";

// ════════════════════════════════════════════════════════════════
// Email — Resend-backed transactional emails for Twelvefold.
//
// Design principles:
//   1. Email failures are NEVER fatal. The form/payment must succeed
//      even if Resend is down. We log and move on.
//   2. Light theme. Dark-themed HTML breaks in too many email clients.
//   3. Inline CSS only. No <style> blocks (Gmail strips them).
//   4. Brand voice: warm, grounded, not gushy. "We received your
//      application" not "Yay! Welcome to the journey!"
//
// Required env vars:
//   RESEND_API_KEY              — from resend.com → API Keys
//   RESEND_FROM_EMAIL           — verified sender, e.g. "Twelvefold Institute <hello@twelvefold.institute>"
//   ADMIN_NOTIFICATION_EMAIL    — where to send "new submission" alerts (can equal ADMIN_EMAILS[0])
// ════════════════════════════════════════════════════════════════

interface SendOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface ResendResponse {
  id?: string;
  error?: { message: string };
}

async function send(opts: SendOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Twelvefold Institute <hello@twelvefold.institute>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", opts.to);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });

    const data = (await res.json()) as ResendResponse;

    if (!res.ok || data.error) {
      console.error("[email] send failed:", data.error?.message || `HTTP ${res.status}`);
      return false;
    }
    console.log("[email] sent:", opts.subject, "→", opts.to, `id=${data.id}`);
    return true;
  } catch (e) {
    console.error("[email] send threw:", e);
    return false;
  }
}

// ─── Branded HTML shell ──────────────────────────────────────
// One shell function, every email uses it. Centralizes design.
function shell({
  preheader,
  body,
}: {
  preheader: string;
  body: string;
}): string {
  // Preheader = the snippet that appears in the inbox preview after the subject.
  // Hidden visually but read by email clients.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,'Times New Roman',serif;color:#1a1a2e;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f4ef;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e8e2d5;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e8e2d5;">
              <div style="font-family:'Courier New',monospace;font-size:13px;letter-spacing:1.5px;font-weight:700;color:#1a1a2e;">
                <span>Twelvefold</span> <span style="color:#7C3AED;">Institute</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 32px;font-size:16px;line-height:1.65;color:#1a1a2e;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background:#f7f4ef;border-top:1px solid #e8e2d5;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;color:#6b6b7a;text-align:center;">
              Pattern literacy &middot; for the long arc<br>
              <a href="https://twelvefold.institute" style="color:#7C3AED;text-decoration:none;">twelvefold.institute</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── TEMPLATES ────────────────────────────────────────────────

// 1. Certification application — confirmation to applicant
export async function emailCertApplicationReceived(args: {
  name: string;
  email: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "We received your application for the Twelvefold Practitioner Certification.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Your application is received.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">Thank you for applying to the Twelvefold Practitioner Certification. This is the most rigorous training in pattern literacy we offer, and the fact that you're applying tells us you're serious about the work.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">What happens next</p>
      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:6px;">We review every application personally — usually within 5 business days.</li>
        <li style="margin-bottom:6px;">If we want to learn more, we'll schedule a 30-minute conversation.</li>
        <li style="margin-bottom:6px;">If admitted, you'll receive enrollment details, the preparatory reading list, and your cohort start date.</li>
      </ol>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">In the meantime, you can deepen your reading on the framework at <a href="https://twelvefold.institute/pattern-literacy" style="color:#7C3AED;">twelvefold.institute/pattern-literacy</a>.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold certification application",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 2. Institutional consult — acknowledgement to requester
export async function emailConsultReceived(args: {
  name: string;
  email: string;
  organization: string;
  scope?: string | null;
}): Promise<boolean> {
  const html = shell({
    preheader: "We received your consult request from " + args.organization + ".",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Your consult request is in.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">Thank you for reaching out from ${escape(args.organization)}. Institutional partnerships begin with a conversation, not a checkout — and that conversation matters.</p>
      ${args.scope ? `<p style="margin:0 0 18px;">You indicated <strong>${escape(args.scope)}</strong> as the likely scope. We'll factor that into the call.</p>` : ""}
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">What happens next</p>
      <p style="margin:0 0 24px;">We respond personally to every institutional request within five business days. The first conversation is exploratory — what your organization is facing, which phase you may be in, whether the framework fits. No pitch, no pressure.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold consult request",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 3. Payment welcome — sent after successful Stripe checkout
export async function emailPaymentWelcome(args: {
  email: string;
  amount: number; // cents
  currency: string;
  product: string;
}): Promise<boolean> {
  const dollars = (args.amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const html = shell({
    preheader: "Your spot in the Twelvefold Practitioner Certification is reserved.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Your spot is reserved.</p>
      <p style="margin:0 0 18px;">Welcome to the Twelvefold Practitioner Certification. Stripe has sent a separate receipt for your <strong>${args.currency.toUpperCase()} $${dollars}</strong> payment — this email is the welcome.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">What happens next</p>
      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:6px;">Within five business days you'll receive your cohort enrollment paperwork and the preparatory reading list.</li>
        <li style="margin-bottom:6px;">Phase I (Foundation) materials are released two weeks before your cohort begins.</li>
        <li style="margin-bottom:6px;">Your supervised practicum opens after Phase II is complete.</li>
        <li style="margin-bottom:6px;">Certification review is the final phase, followed by your formal designation as a Twelvefold-certified practitioner.</li>
      </ol>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">The work begins quietly. Most of it is just learning to see what was already there.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Welcome to the Twelvefold Practitioner Certification",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 4. Admin notification — pings you when a new submission lands
export async function emailAdminNotification(args: {
  subject: string;
  body: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return false;
  const html = shell({
    preheader: args.subject,
    body: `
      <p style="font-size:18px;font-weight:600;margin:0 0 16px;">${escape(args.subject)}</p>
      <pre style="white-space:pre-wrap;font-family:'Courier New',monospace;font-size:13px;background:#f7f4ef;padding:16px 18px;border-radius:8px;border:1px solid #e8e2d5;margin:0 0 18px;line-height:1.55;">${escape(args.body)}</pre>
      <p style="margin:0 0 0;font-size:13px;color:#6b6b7a;">View and triage at <a href="https://twelvefold.institute/admin" style="color:#7C3AED;">twelvefold.institute/admin</a></p>
    `,
  });
  return send({
    to: adminEmail,
    subject: `[Twelvefold] ${args.subject}`,
    html,
  });
}

// 5. Reading delivered to a client — sent by a Twelvefold-certified practitioner.
//    The practitioner's name appears in the subject and body; their email is
//    set as Reply-To so the client replies directly to them.
interface SixTraditionsLite {
  ifa?: string;
  kabbalah?: string;
  i_ching?: string;
  scripture?: string;
  buddhism?: string;
  hermetic?: string;
}

interface TechnicalReadingLite {
  phase_nature?: string;
  micro_state_work?: string;
  what_to_do?: string;
  what_to_avoid?: string;
  the_unseen?: string;
}

interface RecognitionLite {
  what_is_happening?: string;
  evidence_from_their_words?: string[];
}

interface TeachingLite {
  core_teaching?: string;
  what_is_being_asked?: string;
  tradition_wisdom?: string;
  existential_permission?: string;
}

interface AlignmentLite {
  status?: string;
  reading?: string;
  signs_of_alignment?: string;
  signs_of_misalignment?: string;
}

interface ParticipationLite {
  recommended_participation?: string;
  what_to_avoid?: string;
  pattern_rule?: string;
}

export async function emailReadingToClient(args: {
  clientName: string;
  clientEmail: string;
  practitionerName: string;
  practitionerEmail?: string;
  patternName?: string;
  phase?: string;
  microState?: string;
  archetype?: string;
  // Legacy fields (preserved for old readings being re-sent)
  curriculum?: string;
  activeLesson?: string;
  recommendedParticipation?: string;
  technical?: TechnicalReadingLite;
  // New v10 layers
  recognition?: RecognitionLite;
  teaching?: TeachingLite;
  alignment?: AlignmentLite;
  participation?: ParticipationLite;
  traditions?: SixTraditionsLite;
}): Promise<boolean> {
  const fieldRow = (label: string, value: string | undefined, accentColor: string) =>
    value
      ? `
    <div style="padding:18px 22px;background:#f7f4ef;border-left:3px solid ${accentColor};border-radius:6px;margin-bottom:12px;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:${accentColor};text-transform:uppercase;margin-bottom:8px;font-weight:700;">${escape(label)}</div>
      <div style="font-size:16px;color:#1a1a2e;line-height:1.6;">${escape(value)}</div>
    </div>`
      : "";

  const traditionRow = (label: string, value: string | undefined) =>
    value
      ? `
      <tr>
        <td style="padding:12px 14px;border-bottom:1px solid #e8e2d5;vertical-align:top;width:110px;">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.2px;color:#7C3AED;text-transform:uppercase;font-weight:700;">${escape(label)}</div>
        </td>
        <td style="padding:12px 14px;border-bottom:1px solid #e8e2d5;font-size:14px;color:#1a1a2e;line-height:1.55;">
          ${escape(value)}
        </td>
      </tr>`
      : "";

  // ─── Detect schema: v10 layers present? Or legacy technical reading? ───
  const hasV10 = !!(args.recognition?.what_is_happening || args.teaching?.core_teaching);

  // ─── V10 sections ───
  let recognitionSection = "";
  if (hasV10 && args.recognition) {
    const evidenceHtml = (args.recognition.evidence_from_their_words || [])
      .map(
        (q) =>
          `<div style="font-size:14px;color:#6b6b7a;font-style:italic;padding:6px 0 6px 12px;border-left:2px solid #FBBF24;margin-bottom:4px;">&ldquo;${escape(q)}&rdquo;</div>`,
      )
      .join("");
    recognitionSection = `
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:14px;text-align:center;">— What's Happening —</div>
        <div style="padding:18px 22px;background:#f7f4ef;border-radius:6px;margin-bottom:12px;">
          <div style="font-size:17px;font-style:italic;color:#1a1a2e;line-height:1.7;">${escape(args.recognition.what_is_happening ?? "")}</div>
          ${
            evidenceHtml
              ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid #e8e2d5;">
                  <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.5px;color:#6b6b7a;text-transform:uppercase;margin-bottom:8px;">From your words</div>
                  ${evidenceHtml}
                </div>`
              : ""
          }
        </div>
      </div>`;
  }

  let teachingSection = "";
  if (hasV10 && args.teaching) {
    teachingSection = `
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:14px;text-align:center;">— The Teaching —</div>
        ${fieldRow("Core teaching", args.teaching.core_teaching, "#7C3AED")}
        ${fieldRow("What is being asked", args.teaching.what_is_being_asked, "#F59E0B")}
        ${fieldRow("Tradition wisdom", args.teaching.tradition_wisdom, "#7C3AED")}
        ${
          args.teaching.existential_permission
            ? `<div style="padding:18px 22px;background:linear-gradient(135deg,#f7f4ef,#fff8e8);border:1px solid #e8e2d5;border-radius:6px;text-align:center;font-size:16px;font-style:italic;color:#1a1a2e;line-height:1.65;">${escape(args.teaching.existential_permission)}</div>`
            : ""
        }
      </div>`;
  }

  let alignmentSection = "";
  if (hasV10 && args.alignment?.status) {
    const c =
      args.alignment.status === "Aligned"
        ? "#16a34a"
        : args.alignment.status === "Misaligned"
          ? "#dc2626"
          : args.alignment.status === "Testing"
            ? "#F59E0B"
            : "#7C3AED";
    alignmentSection = `
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:14px;text-align:center;">— Alignment —</div>
        <div style="padding:18px 22px;background:#f7f4ef;border-radius:6px;border:1px solid ${c}30;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:${args.alignment.reading ? "10px" : "0"};">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:${c};text-transform:uppercase;font-weight:700;">Status</div>
            <div style="padding:4px 12px;border-radius:999px;background:${c}15;border:1px solid ${c}40;font-family:'Courier New',monospace;font-size:11px;color:${c};font-weight:700;letter-spacing:1px;text-transform:uppercase;">${escape(args.alignment.status)}</div>
          </div>
          ${args.alignment.reading ? `<div style="font-size:15px;color:#1a1a2e;line-height:1.6;">${escape(args.alignment.reading)}</div>` : ""}
        </div>
      </div>`;
  }

  let participationSection = "";
  if (hasV10 && args.participation) {
    participationSection = `
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:14px;text-align:center;">— Recommended Participation —</div>
        ${fieldRow("This week", args.participation.recommended_participation, "#F59E0B")}
        ${fieldRow("What to avoid", args.participation.what_to_avoid, "#dc2626")}
        ${
          args.participation.pattern_rule
            ? `<div style="padding:18px 22px;background:#fff8e8;border:1px solid #FBBF2444;border-radius:6px;text-align:center;">
                <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#F59E0B;text-transform:uppercase;font-weight:700;margin-bottom:8px;">The pattern rule</div>
                <div style="font-size:16px;font-style:italic;color:#1a1a2e;line-height:1.6;">${escape(args.participation.pattern_rule)}</div>
              </div>`
            : ""
        }
      </div>`;
  }

  // ─── LEGACY: technical reading section (for older readings being re-sent) ───
  const legacyTechnicalSection =
    !hasV10 && args.technical
      ? `
    <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
      <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:18px;text-align:center;">— Going Deeper —</div>
      ${fieldRow("Phase nature", args.technical.phase_nature, "#7C3AED")}
      ${fieldRow("Micro-state work", args.technical.micro_state_work, "#F59E0B")}
      ${fieldRow("What to do", args.technical.what_to_do, "#7C3AED")}
      ${fieldRow("What to avoid", args.technical.what_to_avoid, "#dc2626")}
      ${fieldRow("The unseen", args.technical.the_unseen, "#7C3AED")}
    </div>`
      : "";

  // Legacy summary fields (used only if v10 layers not present)
  const legacySummarySection = !hasV10
    ? `
      ${fieldRow("The curriculum", args.curriculum, "#7C3AED")}
      ${fieldRow("The lesson active now", args.activeLesson, "#F59E0B")}
      ${fieldRow("Recommended participation", args.recommendedParticipation, "#7C3AED")}`
    : "";

  // ─── Six Traditions section ───
  const traditionsSection =
    args.traditions &&
    (args.traditions.ifa ||
      args.traditions.kabbalah ||
      args.traditions.i_ching ||
      args.traditions.scripture ||
      args.traditions.buddhism ||
      args.traditions.hermetic)
      ? `
    <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e2d5;">
      <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#7C3AED;text-transform:uppercase;font-weight:700;margin-bottom:14px;text-align:center;">— Six Traditions on this Pattern —</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e8e2d5;border-radius:8px;overflow:hidden;">
        ${traditionRow("Ifá", args.traditions.ifa)}
        ${traditionRow("Kabbalah", args.traditions.kabbalah)}
        ${traditionRow("I Ching", args.traditions.i_ching)}
        ${traditionRow("Scripture", args.traditions.scripture)}
        ${traditionRow("Buddhism", args.traditions.buddhism)}
        ${traditionRow("Hermetic", args.traditions.hermetic)}
      </table>
    </div>`
      : "";

  const phaseLine =
    args.phase || args.microState
      ? `<div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#6b6b7a;text-transform:uppercase;margin-top:8px;">${escape([args.phase, args.microState].filter(Boolean).join(" · "))}</div>`
      : "";

  const archetypeLine = args.archetype
    ? `<div style="font-family:Georgia,serif;font-size:14px;font-style:italic;color:#6b6b7a;margin-top:6px;">${escape(args.archetype)}</div>`
    : "";

  const html = shell({
    preheader: `Your pattern reading from ${args.practitionerName}: ${args.patternName || "a recurring pattern"}.`,
    body: `
      <p style="margin:0 0 24px;">${escape(args.clientName)},</p>
      <p style="margin:0 0 30px;">Following our session, here is your pattern reading. Take it slowly. The layers move from the felt surface to the structure beneath.</p>

      <!-- HERO -->
      <div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#f7f4ef,#ffffff);border:1px solid #e8e2d5;border-radius:10px;margin-bottom:24px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#F59E0B;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Your Pattern</div>
        <div style="font-family:Georgia,serif;font-size:30px;font-style:italic;color:#1a1a2e;line-height:1.1;letter-spacing:-0.5px;">${escape(args.patternName || "Unnamed Pattern")}</div>
        ${archetypeLine}
        ${phaseLine}
      </div>

      ${legacySummarySection}
      ${recognitionSection}
      ${teachingSection}
      ${alignmentSection}
      ${participationSection}
      ${legacyTechnicalSection}
      ${traditionsSection}

      <div style="margin-top:36px;padding-top:24px;border-top:1px solid #e8e2d5;font-size:15px;color:#6b6b7a;line-height:1.7;">
        <p style="margin:0 0 14px;">If anything in this reading lands strangely or sharply — that is the curriculum working. You don't have to act on it immediately. You only have to notice it.</p>
        <p style="margin:0 0 14px;">Reply to this email any time with questions, or to talk further.</p>
        <p style="margin:0;font-style:italic;">— ${escape(args.practitionerName)}<br/><span style="font-size:13px;color:#6b6b7a;">Twelvefold-certified practitioner</span></p>
      </div>
    `,
  });

  return send({
    to: args.clientEmail,
    subject: `Your pattern reading from ${args.practitionerName}`,
    html,
    replyTo: args.practitionerEmail,
  });
}

// ─── 6. Status-change templates ──────────────────────────────
// Fired from /api/admin/status when an admin flips a record's status
// in the admin dashboard. Each function returns a Promise<boolean>
// matching the pattern of other templates; failures are non-blocking.

// CERT APPLICATIONS

export async function emailCertApplicationReviewing(args: {
  name: string;
  email: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "Your Twelvefold Practitioner Certification application is in active review.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Your application is in review.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">A quick note — your application for the Twelvefold Practitioner Certification has moved into active review. We're reading it carefully.</p>
      <p style="margin:0 0 18px;">If we want to learn more about you, we'll be in touch within the next two weeks to schedule a brief conversation. If not, you'll hear from us either way — we respond to every application.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">No action needed from you right now. Thank you for your patience.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "We're reviewing your Twelvefold application",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

export async function emailCertApplicationAdmitted(args: {
  name: string;
  email: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "Your offer to the Twelvefold Practitioner Certification.",
    body: `
      <p style="font-size:26px;font-weight:600;margin:0 0 22px;letter-spacing:-0.4px;">Welcome.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">After reading your application carefully, we're offering you a place in the next Twelvefold Practitioner Certification cohort.</p>
      <p style="margin:0 0 18px;">This is a real practice — not a credential collection — and admission means we believe you're ready to train rigorously in pattern literacy and to carry the work into your own community with seriousness and care.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">What happens next</p>
      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:6px;">Reply to this email confirming you'd like to accept your place.</li>
        <li style="margin-bottom:6px;">We'll send your enrollment paperwork, tuition payment link ($6,500), and your cohort start date.</li>
        <li style="margin-bottom:6px;">Phase I (Foundation) materials are released two weeks before the cohort begins.</li>
        <li style="margin-bottom:6px;">Your supervised practicum opens after Phase II is complete.</li>
        <li style="margin-bottom:6px;">Certification review is the final phase, followed by your formal designation as a Twelvefold-certified practitioner.</li>
      </ol>
      <p style="margin:0 0 18px;">You have <strong>14 days</strong> to confirm your place before we release the seat to the next applicant on the list. If you need more time or have questions, just reply — we're here.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">Take a moment with this. Most of the practitioners we admit say yes; some discover the timing isn't right for them. Either answer is honest, and we want yours.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold Practitioner Certification offer",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

export async function emailCertApplicationDeclined(args: {
  name: string;
  email: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "An update on your Twelvefold Practitioner Certification application.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Thank you for applying.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">We've completed our review of your application for the Twelvefold Practitioner Certification, and we won't be offering you a place in the current cohort.</p>
      <p style="margin:0 0 18px;">This isn't a judgment of you. The certification is small and rigorous, and we admit only the applicants we believe are the right fit for this particular cohort, at this particular moment. Timing and fit matter more than worth.</p>
      <p style="margin:0 0 18px;">You're welcome to apply again in the future — many of our certified practitioners applied more than once. If you'd like specific feedback on your application, simply reply and we'll be honest with you.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">In the meantime, if pattern literacy interests you, you can continue your own practice at <a href="https://twelvefold.institute/read" style="color:#7C3AED;">twelvefold.institute/read</a> — free, no certification required.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold application",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// INSTITUTIONAL CONSULTS

export async function emailConsultQualified(args: {
  name: string;
  email: string;
  organization: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "Your Twelvefold consult — we'd like to talk further.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Let's talk.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">Thank you for your consult request from ${escape(args.organization)}. Based on what you've shared, we'd like to schedule a conversation to explore whether and how the Twelvefold framework fits your organization's situation.</p>
      <p style="margin:0 0 18px;">We'll be in touch within the next few days to propose a few times. Please reply with any windows that work for you, or just wait for our outreach — whichever's easier.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">The first conversation is exploratory and free. No pitch, no pressure — we want to understand your situation first and see if we're the right partners for it.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold consult — next step",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

export async function emailConsultScheduled(args: {
  name: string;
  email: string;
  organization: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "Your Twelvefold consult conversation is being scheduled.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Your consult is on the calendar.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">Your conversation with us is being scheduled. You'll receive a separate calendar invitation shortly with the date, time, and meeting link.</p>
      <p style="margin:0 0 18px;">In the meantime, if there's any context about ${escape(args.organization)}'s situation you'd like us to read before we meet, simply reply and send it along.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">If something changes and the proposed time doesn't work, just let us know — we'll find another.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold consult — scheduling",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

export async function emailConsultClosed(args: {
  name: string;
  email: string;
  organization: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "An update on your Twelvefold consult request.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Thank you for reaching out.</p>
      <p style="margin:0 0 18px;">${escape(args.name)},</p>
      <p style="margin:0 0 18px;">We've completed our review of your consult request from ${escape(args.organization)}. At this time, we don't see a strong fit between what your organization is asking for and what the Twelvefold framework is designed to address.</p>
      <p style="margin:0 0 18px;">That's a fit assessment, not a judgment. If your circumstances change or your needs evolve in a direction where pattern literacy might serve you, you're welcome to reach out again.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;">If you'd like to understand our reasoning, simply reply — we're happy to be specific about why this didn't feel like a match.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Your Twelvefold consult",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 7. Welcome email — fired on first authenticated visit, idempotent
//    via the `profiles` table primary-key insert. See src/lib/welcome.ts
//    for the dispatcher.
export async function emailWelcomeNewUser(args: {
  name: string | null;
  email: string;
}): Promise<boolean> {
  const greeting = args.name ? escape(args.name) : "Hello";
  const html = shell({
    preheader: "Welcome to Twelvefold Institute. Here's where to begin.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">Welcome to Twelvefold.</p>
      <p style="margin:0 0 18px;">${greeting},</p>
      <p style="margin:0 0 18px;">Your account is created. Whatever brought you here — curiosity, a recurring situation you can feel but can't quite name, an interest in the framework itself — we're glad you've come.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">A place to start</p>
      <p style="margin:0 0 18px;">The fastest way to feel what pattern literacy actually is, is to use it on something real in your life. Visit <a href="https://twelvefold.institute/read" style="color:#7C3AED;font-weight:600;">twelvefold.institute/read</a> and describe a situation that keeps repeating — anything you've been turning over. You'll get a three-layer reading: the pattern, the structural diagnostic, and how six wisdom traditions illuminate the same state.</p>
      <p style="margin:0 0 18px;">Your readings save to your account. Over time, you'll see how patterns move through you across months — and that's where the real curriculum becomes visible.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">If you want to go further</p>
      <p style="margin:0 0 24px;">The <a href="https://twelvefold.institute/pattern-literacy" style="color:#7C3AED;">framework explainer</a> is the long-form introduction. The <a href="https://twelvefold.institute/certification" style="color:#7C3AED;">Practitioner Certification</a> is the rigorous training path for people who want to read patterns for others. Both are there when you're ready.</p>
      <p style="margin:0 0 18px;color:#6b6b7a;font-size:14px;font-style:italic;">Most people come back to one reading three or four times before its real meaning lands. Be patient with the work. Pattern literacy isn't acquired — it's noticed, slowly, in your own life.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "Welcome to Twelvefold Institute",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 8. Book launch subscriber confirmation — warm acknowledgement when
//    someone joins the Pattern Literacy launch list at /book.
export async function emailBookSubscribeConfirmation(args: {
  email: string;
}): Promise<boolean> {
  const html = shell({
    preheader: "You're on the Pattern Literacy launch list.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">You're on the list.</p>
      <p style="margin:0 0 18px;">Thank you for your interest in <em>Pattern Literacy</em>. You're now on the launch list — we'll write to you when there's news: a publisher announcement, pre-order availability, a release date, or any meaningful milestone.</p>
      <p style="margin:0 0 18px;">We won't write often. Your inbox is precious, and there's nothing to say until there is.</p>
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#7C3AED;text-transform:uppercase;">While you wait</p>
      <p style="margin:0 0 18px;">The framework the book teaches is already practicable. Visit <a href="https://twelvefold.institute/read" style="color:#7C3AED;font-weight:600;">twelvefold.institute/read</a> and describe a situation that keeps repeating in your life — you'll get a three-layer reading drawn from the same framework as the book.</p>
      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });
  return send({
    to: args.email,
    subject: "You're on the Pattern Literacy launch list",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// 9. Initiation completion confirmation — fired when someone reaches the
//    end of the /initiation experience and submits name + email + CTA.
export async function emailInitiationConfirmation(args: {
  name: string | null;
  email: string;
  phaseFelt: string | null; // "Sparking" / "Building" / etc.
  phaseAstro: string | null; // "Aries" / "Taurus" / etc.
  practiceCommitment: string | null;
  ctaChosen: "certification" | "consult" | "community" | null;
}): Promise<boolean> {
  const greeting = args.name ? escape(args.name) : "Hello";

  // Tailor the closing paragraph to whichever path they chose
  const closingByPath: Record<string, string> = {
    certification: `You also indicated interest in the Practitioner Certification. We'll follow up about your application within a few days. In the meantime, the cohort page is at <a href="https://twelvefold.institute/certification" style="color:#7C3AED;">twelvefold.institute/certification</a>.`,
    consult: `You also asked about a 1:1 consultation. We'll be in touch shortly to schedule.`,
    community: `You also asked to join the community. We'll add you to the next round of community updates.`,
  };
  const closing = args.ctaChosen
    ? closingByPath[args.ctaChosen]
    : `Whenever you're ready, the deeper layers — the framework explainer at <a href="https://twelvefold.institute/pattern-literacy" style="color:#7C3AED;">twelvefold.institute/pattern-literacy</a>, the reading app at <a href="https://twelvefold.institute/read" style="color:#7C3AED;">twelvefold.institute/read</a>, and the certification — are there.`;

  const phaseLine =
    args.phaseFelt && args.phaseAstro
      ? `<div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg,#f7f4ef,#ffffff);border:1px solid #e8e2d5;border-radius:10px;margin:24px 0;">
          <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#F59E0B;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Your Phase</div>
          <div style="font-family:Georgia,serif;font-size:30px;font-style:italic;color:#1a1a2e;line-height:1.1;letter-spacing:-0.5px;">${escape(args.phaseFelt)}</div>
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;color:#6b6b7a;text-transform:uppercase;margin-top:8px;">${escape(args.phaseAstro)}</div>
        </div>`
      : "";

  const practiceLine = args.practiceCommitment
    ? `<div style="padding:18px 22px;background:#f7f4ef;border-left:3px solid #4ADE80;border-radius:6px;margin:0 0 24px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#16a34a;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Your Practice This Week</div>
        <div style="font-size:16px;color:#1a1a2e;line-height:1.6;font-style:italic;">&ldquo;${escape(args.practiceCommitment)}&rdquo;</div>
      </div>`
    : "";

  const html = shell({
    preheader: "Your Twelvefold Initiation is complete. Here's what you carried out of it.",
    body: `
      <p style="font-size:24px;font-weight:600;margin:0 0 20px;letter-spacing:-0.3px;">You've completed the Initiation.</p>
      <p style="margin:0 0 18px;">${greeting},</p>
      <p style="margin:0 0 18px;">Thank you for sitting through the full Initiation. You've now done something most people never do — you've consciously read the phase you're in and looked at what it's actually asking of you.</p>

      ${phaseLine}
      ${practiceLine}

      <p style="margin:0 0 18px;">A few things worth saying out loud, now that the experience is behind you:</p>
      <ul style="margin:0 0 22px;padding-left:22px;color:#4a4a5a;">
        <li style="margin-bottom:8px;line-height:1.65;">The phase you recognized today is real, and it will keep moving. Most phases run a few weeks to a few months — they aren't permanent.</li>
        <li style="margin-bottom:8px;line-height:1.65;">If your practice this week starts to feel awkward or hard, that's the curriculum working. Stay with it.</li>
        <li style="margin-bottom:8px;line-height:1.65;">When something shifts — and it will — come back to <a href="https://twelvefold.institute/read" style="color:#7C3AED;font-weight:600;">the reading app</a> and describe it in your own words. You'll see how the pattern is moving.</li>
      </ul>

      <p style="margin:0 0 18px;">${closing}</p>

      <p style="margin:0;font-style:italic;color:#6b6b7a;">— The Twelvefold Institute</p>
    `,
  });

  return send({
    to: args.email,
    subject: "Your Twelvefold Initiation",
    html,
    replyTo: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}

// ─── Helpers ─────────────────────────────────────────────────
function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
