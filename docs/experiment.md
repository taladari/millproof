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

## Budget - $131

| Item | Cost |
|---|---|
| LinkedIn Premium, one month | $99 |
| Domain (`millproof.com`, first year) | $12 |
| Extraction and drafting tokens | $20 |
| Hosting (static page, free tier) | $0 |
| **Total** | **$131** |

Ceiling is $300. Nothing here is a recurring commitment.

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

Because pilots are invoiced rather than checked out, and US accounts payable moves at its own
pace, the **money condition is judged on 2026-08-09** - seven days for payment to clear. The
completion condition is still judged on 2026-08-02. This is a payment-rail allowance, not a
softer threshold: the number is still three, and it is still cash.

Rule: the thresholds above are frozen. If the result is a fail, the obituary goes into
`../escape-room/GRAVEYARD.md` the same day and the idea is finished.

## What a pass buys

Six paid pilot slots, three months of runway on customer money, and the right to spend the
following four weeks building the supplier portal for real. Nothing more is promised to
anyone until the pilots produce a usable ledger.
