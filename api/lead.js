/**
 * POST /api/lead
 *
 * Receives a completed content-gap check from index.html, emails it to the inbox,
 * and sends the visitor an immediate reply carrying the supplier request template.
 *
 * Environment (Vercel project settings):
 *   RESEND_API_KEY   required
 *   LEAD_TO          optional, default hello@millproof.com
 *   MAIL_FROM        optional, default "Millproof <notify@send.millproof.com>"
 *                    must be on a domain verified in Resend
 */

const MAX_LINES_CHARS = 20000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function send(payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${await r.text()}`);
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ ok: false, error: "mail not configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const email = String(body.email || "").trim();
  const lines = String(body.lines || "").slice(0, MAX_LINES_CHARS);
  const trap = String(body.company_url || "").trim();   // honeypot, humans never fill it

  if (trap) return res.status(200).json({ ok: true });   // silently drop bots
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "invalid email" });
  if (!lines.trim()) return res.status(400).json({ ok: false, error: "no part lines" });

  const to = process.env.LEAD_TO || "hello@millproof.com";
  const from = process.env.MAIL_FROM || "Millproof <notify@send.millproof.com>";
  const domain = email.split("@")[1];
  const lineCount = lines.split("\n").filter(l => l.trim()).length;

  try {
    // 1. the lead, to the inbox
    await send({
      from,
      to: [to],
      reply_to: email,
      subject: `Gap check: ${domain} (${lineCount} lines)`,
      text: `${email}\n${lineCount} lines pasted at ${body.at || "unknown time"}\n\n${lines}\n`,
    });

    // 2. the promised reply, to the visitor
    await send({
      from,
      to: [email],
      reply_to: to,
      subject: "Your Section 232 content-gap check, and the supplier request email",
      text: [
        `You checked ${lineCount} part lines. The scope those were matched against is U.S. Note 16(c)`,
        `to subchapter III of chapter 99, HTSUS, Revision 12 (2026).`,
        ``,
        `Below is the request we use to get metal weight and origin out of a supplier. It works`,
        `better than asking for mill certs because it names the four fields and states the`,
        `consequence in money.`,
        ``,
        `---`,
        `Subject: Metal content data needed for [PART NUMBERS] - affects duty on your next shipment`,
        ``,
        `US customs rules changed in April 2026. For the parts below we have to declare, on every`,
        `entry line, how much metal each part contains and where that metal was melted or smelted.`,
        ``,
        `For each part number, please reply with:`,
        `  1. Net weight of steel / aluminum / copper in the part, in kg`,
        `  2. Value of that metal content, per part, in USD`,
        `  3. Country of melt and pour (steel) or smelt and cast (aluminum, copper)`,
        `  4. The mill certificate for the heat used`,
        ``,
        `If the metal is under 15% of the part's weight, the part falls under tariff heading`,
        `9903.82.03 and carries no additional duty. If we cannot show that, the duty is up to 50%`,
        `on the full value of the part.`,
        ``,
        `Please reply by [DATE]. If a field is genuinely unknown, write "unknown" rather than`,
        `leaving it blank, because we have to record what was asked and what came back.`,
        `---`,
        ``,
        `Reply to this email with a part number if you want it checked against the current lists.`,
        ``,
        `Millproof is not a customs broker. We keep the records behind what you declare. You and`,
        `your licensed broker decide what gets filed.`,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lead delivery failed", err);
    // the page keeps a localStorage copy, so tell it the truth and let it show the fallback
    return res.status(502).json({ ok: false, error: "delivery failed" });
  }
}
