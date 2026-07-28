# Supplier request template

This is what the gap check emails out, and the first thing a pilot customer actually uses. It
exists because "please send your mill certs" has a terrible response rate and this does better:
it names the four fields, gives a deadline tied to a shipment, and states the consequence in
money rather than in compliance language.

---

## First request

> **Subject: Metal content data needed for [PART NUMBERS] - affects duty on your next shipment**
>
> Hello [NAME],
>
> US customs rules changed in April 2026. For the parts below we now have to declare, on every
> entry line, how much metal each part contains and where that metal was melted or smelted. We
> cannot ship these without it.
>
> For each part number, please reply with:
>
> | Field | Example |
> |---|---|
> | Net weight of steel / aluminum / copper in the part, in kg | 0.412 kg |
> | Value of that metal content, per part, in USD | $1.85 |
> | Country of melt and pour (steel) or smelt and cast (aluminum, copper) | India / Vietnam |
> | Mill certificate or material certificate for the heat used | PDF attached |
>
> Parts: [LIST]
>
> If the metal is under 15% of the part's weight, the part falls under tariff heading 9903.82.03
> and carries no additional duty at all. If we cannot show that, the duty is up to 50% on the
> full value of the part. An accurate number is worth the five minutes it takes you to look it up.
>
> Please reply by [DATE - tie to a PO or a shipment, not a round number of days]. If any field
> is genuinely unknown, write "unknown" rather than leaving it blank; we have to record what
> was asked and what came back.
>
> Thank you,
> [NAME], [COMPANY]

---

## Second request (7 days, no reply)

> **Subject: Re: Metal content data for [PART NUMBERS] - [DATE] shipment at risk**
>
> Following up on the metal content data below. Without it we have to declare the metal origin
> as unknown, which puts these parts in the worst duty treatment available and raises the
> landed cost of your shipment.
>
> Four fields, per part. The mill certificate alone usually covers three of them.

---

## Escalation (14 days, no reply)

Goes to the commercial contact, not the quality contact, and is copied to the buyer at your
own company:

> **Subject: [SUPPLIER] - metal content data outstanding, [N] parts, [DATE]**
>
> We have asked twice, on [DATE] and [DATE], for metal weight and country of melt/smelt on the
> parts listed. These are now being declared with unknown origin, at the higher duty treatment,
> and the cost difference is being tracked against this supplier.
>
> The request is four fields and one attachment. Whoever holds the mill certificates can answer
> it in ten minutes.

---

## Why the wording is like this

- **Money, not compliance.** The supplier does not care about your recordkeeping. They care
  about the PO and about being the expensive vendor.
- **"Unknown" is an acceptable answer.** CBP allows an unknown origin declaration; what it does
  not allow is a blank record. A supplier who writes "unknown" has still moved you forward.
- **Every send and every reply is timestamped in the ledger.** The escalation is not theatre -
  it is the diligence record that a 19 CFR 163 demand is actually testing.
