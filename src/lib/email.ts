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

// ─── Helpers ─────────────────────────────────────────────────
function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
