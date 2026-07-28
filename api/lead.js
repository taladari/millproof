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

const STATUS_TEXT = {
  named: "in scope, named by CBP",
  listed: "in scope",
  suffix: "depends on statistical suffix",
  out: "not listed",
  none: "no HTS code found",
};

/** The results the visitor saw, as plain text they can forward or file. */
function resultsBlock(run, rawLines) {
  if (!run || !Array.isArray(run.rows)) {
    return [`The list you checked:`, ``, rawLines.trim(), ``];
  }
  const s = run.summary;
  const out = [
    `${s.lines} lines checked. ${s.inScope} in scope. ${s.claims} where a 9903.82.03 claim`,
    `under 15% is available. ${s.gapCount} data points you said you cannot evidence today.`,
    ``,
    `--------------------------------------------------------------------`,
    `YOUR LINES`,
    `--------------------------------------------------------------------`,
  ];
  for (const r of run.rows) {
    out.push(``);
    out.push(`${r.n}. ${r.raw}`);
    out.push(`   ${r.hts || "no code"}  ${STATUS_TEXT[r.status] || r.status}` +
             (r.metals && r.metals.length ? `  (${r.metals.join(" + ")})` : ""));
    if (r.status === "suffix" && r.suffixes.length)
      out.push(`   listed only at: ${r.suffixes.join(", ")}`);
    if (r.matched && r.matched !== r.hts)
      out.push(`   matched provision: ${r.matched}`);
    if (r.canClaim15 && (r.status === "listed" || r.status === "named" || r.status === "suffix"))
      out.push(`   under 15% by weight would move this to 9903.82.03, no additional duty`);
    if (r.gaps && r.gaps.length)
      out.push(`   missing: ${r.gaps.join(", ")}`);
  }
  out.push(``);
  return out;
}

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

  const run = body.run && typeof body.run === "object" ? body.run : null;
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
      text: [
        email,
        `${lineCount} lines pasted at ${body.at || "unknown time"}`,
        run ? `${run.summary.inScope} in scope, ${run.summary.claims} with a 15% claim available, ${run.summary.gapCount} gaps` : "no run data",
        "",
        lines,
      ].join("\n"),
    });

    // 2. the promised reply, to the visitor
    await send({
      from,
      to: [email],
      reply_to: to,
      subject: `Your Section 232 gap check: ${run ? run.summary.inScope : "?"} of ${lineCount} lines in scope`,
      text: [
        ...resultsBlock(run, lines),
        `Scope source: U.S. Note 16(c) to subchapter III of chapter 99, HTSUS,`,
        `${(run && run.revision) || "Revision 12 (2026)"}. Lists change three times a year at the`,
        `BIS inclusion windows in January, May and September.`,
        ``,
        `--------------------------------------------------------------------`,
        `THE SUPPLIER REQUEST`,
        `--------------------------------------------------------------------`,
        ``,
        `Fill in the bracketed parts and send it to whoever holds the mill certificates.`,
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
        `--------------------------------------------------------------------`,
        `THE ESCALATION, AFTER TWO WEEKS OF SILENCE`,
        `--------------------------------------------------------------------`,
        ``,
        `Send this to the commercial contact, not the quality contact, and copy your own buyer.`,
        ``,
        `---`,
        `Subject: [SUPPLIER] - metal content data outstanding, [N] parts`,
        ``,
        `We asked twice, on [DATE] and [DATE], for metal weight and country of melt or smelt on`,
        `the parts listed. These are now being declared with unknown origin, at the higher duty`,
        `treatment, and the cost difference is being tracked against this supplier.`,
        ``,
        `The request is four fields and one attachment. Whoever holds the mill certificates can`,
        `answer it in ten minutes.`,
        `---`,
        ``,
        `Reply to this email with a part number if you want it checked against the current lists.`,
        ``,
        `Tal Adari`,
        `Millproof - hello@millproof.com`,
        ``,
        `Millproof is not a customs broker and performs no customs business. We do not classify`,
        `merchandise and we file nothing with CBP. You and your licensed broker decide what gets`,
        `declared; what we keep is the evidence behind it.`,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lead delivery failed", err);
    // the page keeps a localStorage copy, so tell it the truth and let it show the fallback
    return res.status(502).json({ ok: false, error: "delivery failed" });
  }
}
