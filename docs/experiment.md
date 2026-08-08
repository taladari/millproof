# Week-one experiment

Written 2026-07-27. Runs the week of **2026-07-27 → 2026-08-02**.

## Hypothesis

Trade compliance staff at mid-market US importers of Section 232 derivative articles cannot
evidence metal weight and melt/pour or smelt/cast origin per part number, know it, and will
pay to fix it before they are asked to prove it.

## What is being tested, in order

1. **Recognition** - does the problem statement land in one sentence, from a stranger?
2. **Gap** - when they run their own part numbers, do they find missing data?
3. **Money** - will they prepay $897 to a company they had not heard of on Monday?

Only the third is the real test. The first two are how we earn the right to ask.

## Timebox - 10 hours

| Hours | Work |
|---|---|
| 4.0 | Landing page and gap check (done - `index.html`) |
| 1.0 | Scope data built from U.S. Note 16(c) (done - `tools/build_scope.py`, 719 provisions) |
| 0.5 | Wire the form endpoint, the inbox, and the invoice flow |
| 1.0 | Build the target list: 25 named people, verified in-scope importers |
| 2.0 | Send 25 direct messages, one ICPA list post, ~30 broker-newsletter offers |
| 1.0 | Reply handling and the pilot ask |
| 1.0 | Log results, write the verdict |

Hard stop at 10 hours. Overrun is itself a fail signal - this is meant to be a cheap test.

## Budget - $131 planned, ~$30 actually spent as of 2026-08-08

| Item | Planned | Actual |
|---|---|---|
| LinkedIn Premium, one month | $99 | not bought, no messages sent yet |
| Domains (`millproof.com`, `taladari.com`) | $12 | ~$25-30 |
| Extraction and drafting tokens | $20 | $0 |
| Hosting: Vercel, Resend, GitHub, Payoneer | $0 | $0, all free tiers |
| **Total** | **$131** | **~$30** |

Ceiling is $300. Google Workspace at about €8.10/month is a real recurring cost but it belongs
to the operator identity, not to this experiment, and it survives whatever happens here.

There is no sunk cost to defend. The only question is whether the next three hours are worth
spending.

## Reach - who counts

A **real target buyer** is a named individual, at a named US company, where:

- the company imports articles whose HTS falls in a Section 232 derivative family, and
- the person's title contains trade, customs, compliance, import, logistics, supply chain or
  materials, and
- the message is sent to them directly - not a group blast, not a company inbox.

Target: **25 sent, ≥20 qualifying**. Sourcing: ICPA member directory, LinkedIn search by title
plus industry (fasteners, HVAC, appliances, furniture, e-bikes, machinery), and the exhibitor
lists of any 2026 metals or fastener trade show, which are public.

Channel mix: 25 direct messages, 1 ICPA email-list post, and a free-tool offer to ~30 customs
brokers who publish CSMS explainers to importer mailing lists. No organic social posting.
Everything asynchronous; no calls are booked or needed to reach the threshold.

## Pass / fail

**Pass, both conditions:**

- **≥6 of 25** run the gap check with their own part data and submit an email for the results
  (24% completion), **and**
- **≥3** accept a paid 3-month pilot at $299/month prepaid - **≥$2,691 collected, cash in the
  account, not verbal agreement.**

**Fail, either condition:**

- fewer than **2** completions, **or**
- **zero** pilot acceptances by 2026-08-02.

Between the two - say 4 completions and 1 pilot - is a **re-run**, once, with a rewritten
offer and a different segment. One re-run only. A second inconclusive week is a fail.

## How each number is counted

| Metric | Source of truth |
|---|---|
| Sent | `docs/tracking.csv`, one row per person, timestamped at send |
| Qualifying | Same row, `qualifies` column, judged before sending, never after |
| Completion | Form submission carrying non-example part lines (the default sample lines do not count) |
| Pilot | Money received and settled - ACH, wire, PayPal or card, any rail. An issued invoice is not a pilot. A verbal yes is not a pilot. A signed order form is not a pilot. |

## Re-dated 2026-08-08, thresholds unchanged

Nothing was sent in the first window. Payoneer has been stuck for over two weeks and the whole
test was queued behind it, wrongly: the reach half never needed a payment rail. The numbers
below are not softened. The two conditions are now judged separately, because they depend on
different things.

**Interest.** Needs only the page and the sends. Send by **2026-08-10**, judged **2026-08-17**:
6 completions out of 25.

**Money.** Needs an invoice rail, which does not have to be Payoneer. A wire to an Israeli USD
account works today, as does a PayPal invoice. Judged **7 days after the first invoice is
issued**, hard stop **2026-08-31**: 3 pilots, $2,691 collected and settled.

**New founder-side kill, and the one that matters.** If the 25 messages are not sent by
**2026-08-12**, the idea dies that day. Cause of death: not executed. That is a legitimate way
for an idea to end and it goes in the graveyard with that wording, not disguised as a market
verdict. An idea nobody will spend three hours testing is not an idea, whatever its merits.

The copper hook has expired. The replacement opening is that the first entries under the new
copper rules are being filed now and CBP has live ACE error codes for content reporting.

Rule: the thresholds above are frozen. If the result is a fail, the obituary goes into
`../escape-room/GRAVEYARD.md` the same day and the idea is finished.

## What a pass buys

Six paid pilot slots, three months of runway on customer money, and the right to spend the
following four weeks building the supplier portal for real. Nothing more is promised to
anyone until the pilots produce a usable ledger.
