# Sources

Every dated claim on the landing page, with where it comes from and how hard it is. Verified
2026-07-26/27. Vendor-graded material is never used to support a claim about the market or the
requirement - only to establish that a competitor exists.

| Claim on the page | Source | Date | Grade |
|---|---|---|---|
| Scope: 719 HTSUS provisions across 11 lists, with the metal each carries | U.S. Note 16(c) to subchapter III, ch. 99, HTSUS - Revision 12 (2026), retrieved from hts.usitc.gov, parsed by `tools/build_scope.py` | 2026-07-28 | hard |
| The 15% rule: metals headings apply "only … where the weight of the applicable metal is at least 15 percent of the weight of the imported article"; articles below it fall under 9903.82.03; provisions on multiple lists "use the aggregate weight of the listed metals" | U.S. Note 16(c); heading 9903.82.03 text | Revision 12 (2026) | hard |
| Rate on the primary lists: "the duty provided in the applicable subheading + 50%"; derivative tiers run +10% / +15% / +25% by origin | HTSUS headings 9903.82.02 and 9903.82.04–.26, column 1 general rates | Revision 12 (2026) | hard |
| Duties apply to the full customs value of covered derivatives; new tiers and Annex IV metal-content thresholds; effective 6 Apr 2026 | Presidential proclamation of 2 Apr 2026, as implemented in CBP CSMS #68253075; law-firm analyses (Foley & Lardner, Perkins Coie, BDO, Norton Rose Fulbright) | 2026-04 → 2026-06 | hard / solid |
| "Report the aggregate weight of the applicable metal(s) in kg as a second quantity on the entry summary line" | CBP CSMS #68253075 | 2026-04-03 | hard |
| 15% metal-content threshold exemption calculated on aggregate weight | CBP CSMS #68253075 | 2026-04-03 | hard |
| Copper smelt-and-cast reporting mandatory in ACE from 30 Jul 2026 for HTS 8544.42.10, 8544.42.20, 8544.42.90, 8544.49.10; "OTH" permitted where unknown | CBP CSMS #69252300 | 2026-07-15 | hard |
| Country of melt and pour for steel; primary/secondary country of smelt and country of cast for aluminum | CBP CSMS guidance, Base Metals Center guidance of 15 Mar 2026 | 2026 | hard |
| 407–428 HTSUS derivative subheadings added effective 18 Aug 2025; BIS inclusion windows three times a year (Jan / May / Sep) | BIS interim final rule, Federal Register 19 Aug 2025; ArentFox Schiff and Steptoe analyses | 2025-08 | hard / solid |
| Five-year recordkeeping and CBP demand/audit power | 19 CFR Part 163; 19 U.S.C. 1508, 1509 | current | hard |
| Software for an importer's own compliance is outside "customs business"; self-transacting importers need no license | 19 CFR 111.1, 111.2 (eCFR) | current | hard |
| Section 232 collections of $34.24B in FY2025 | Picard Kentz & Rowe analysis of CBP data | 2026 | solid |
| 239,231 identified US importers in 2024 | US Census Bureau, 2024 preliminary importer profile | 2025 | hard |
| ICPA "over 3000 members worldwide" | icpainc.org | 2026 | solid |
| IEEPA tariffs struck down 6–3 on 20 Feb 2026; Section 232 unaffected | Supreme Court opinion; WilmerHale, Ropes & Gray, Skadden alerts | 2026-02-20 | hard / solid |

## Not on the page, and why

- **Any dollar figure for a visitor's own exposure.** We do not know their entered values or
  their tier, and asserting it would be advice.
- **Any duty rate next to a specific HTS code.** Rates depend on origin, tier and metal, and a
  wrong number on a landing page is worse than no number.
- **Any claim about how many importers are affected.** The Census figure counts importers, not
  importers of derivative articles; the subset is an estimate and estimates do not belong in
  marketing copy.
- **Competitor comparisons.** Assent, Descartes, Caspian, Tandom and BITE Data all exist and are
  analysed in `../escape-room/IDEA.md`. None of that belongs on a page whose only job is to find
  out whether six people have this problem badly enough to say so.

## Refresh discipline

CSMS bulletins supersede each other constantly - there was already a technical-corrections
bulletin (CSMS #68554727, 6 May 2026) after the April guidance. Re-verify every CSMS citation on
this page at each BIS inclusion window: September 2026, January 2027, May 2027. A stale citation
on a compliance page is the fastest way to lose a compliance buyer.

Scope data has its own refresh path: `python3 tools/build_scope.py` re-reads the tariff schedule
and rewrites `data/scope.json`. The date and revision it was built from travel inside the file
under `source`, and the page prints them in the results footnote - so a stale build is visible to
the visitor rather than hidden from them.

Note that the Federal Register blocks automated fetches, which is why the pipeline reads the
tariff schedule itself rather than the proclamation annexes. The schedule is the operative legal
text a broker files against, so this is the better source anyway, not a workaround.
