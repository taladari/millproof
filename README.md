# Millproof

Per-SKU metal content and origin substantiation for US importers under Section 232.

This repository is the **week-one demand experiment**, not the product. It is one static page
plus the material needed to run the test and judge it honestly.

```
index.html                    the landing page and the free content-gap check (open it in a browser)
tools/build_scope.py          regenerates the scope data from the tariff schedule (run at each BIS window)
data/scope.json               719 in-scope HTSUS provisions from U.S. Note 16(c), with lists and rates
data/scope.js                 the same payload as window.MILLPROOF_SCOPE, loaded by index.html
docs/experiment.md            the experiment: hypothesis, budget, timebox, pass/fail thresholds
docs/outreach.md              the 25 messages, the ICPA post, the group posts, the pilot ask
docs/supplier-request-email.md  the template the tool emails out - also the first product artifact
docs/compliance-boundary.md   what the page and the product may never say or do (19 CFR 111.1)
docs/sources.md               every dated claim on the page, with its primary source
docs/tracking.csv             the log the pass/fail decision is read off
```

## Run it

```
open index.html
```

No build, no dependencies, no network calls. The gap check runs in the browser against
`data/scope.js`; if the form endpoint is unset, leads land in `localStorage` under
`millproof_leads`.

## Refresh the scope data

```
python3 tools/build_scope.py     # needs curl + pdftotext
```

Pulls the current chapter 99 from the USITC, parses U.S. Note 16(c), and rewrites
`data/scope.json` and `data/scope.js`. Run it at every BIS inclusion window - January, May,
September - and whenever CBP issues a CSMS bulletin that changes reporting. The script prints
each list and its code count so a suspicious diff is obvious.

## Before it goes live

Six placeholders, all in `index.html` unless noted:

| Placeholder | What to put there |
|---|---|
| `FORM_ENDPOINT` | Formspree or Tally endpoint for the results-and-template capture |
| `PILOT_URL` | Stripe payment link, $299/month, 3 months prepaid |
| `REPLACE@millproof.com` (2 places) | `hello@millproof.com` |
| Domain | `millproof.com` - registered 2026-07-27 |
| Trademark | Clear "Millproof" against USPTO and EUIPO classes 9 and 42 before printing anything |

## The decision this repository exists to make

Pass and the pilot runs. Fail and the idea goes in `../escape-room/GRAVEYARD.md` with a
one-line obituary. Thresholds are in `docs/experiment.md` and are not to be renegotiated after
seeing the results.
