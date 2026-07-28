#!/usr/bin/env python3
"""
Rebuild the Section 232 scope data from the primary source.

Source of truth: U.S. Note 16 to subchapter III of chapter 99, Harmonized Tariff
Schedule of the United States, published by the USITC. Subdivision (c) of that note
carries eleven lists of HTSUS provisions - the actual scope of the metals tariffs -
and the Chapter 99 headings 9903.82.01-.26 carry the rates.

Run at every BIS inclusion window (January, May, September) and whenever CBP issues
a CSMS bulletin that changes reporting. Requires: curl, pdftotext (poppler).

    python3 tools/build_scope.py

Writes:
    data/scope.json   structured, for humans and other tools
    data/scope.js     window.MILLPROOF_SCOPE, loaded by index.html (works over file://)
"""

import json, re, subprocess, sys, collections, datetime, pathlib, tempfile

HTS_JSON = "https://hts.usitc.gov/reststop/exportList?from=9903.80&to=9903.86&format=JSON&styles=false"
HTS_PDF  = "https://hts.usitc.gov/reststop/file?release=currentRelease&filename=Chapter%2099"

ROOT = pathlib.Path(__file__).resolve().parent.parent
LIST_HDR = re.compile(
    r"^\s+\((i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)\)\s+"
    r"(Articles of (aluminum|steel|copper)|Derivative (aluminum|steel|copper) articles)", re.I)
CODE = re.compile(r"^\d{4}(\.\d{2}(\.\d{2}(\d{2})?)?)?$")
PAGE_NOISE = ("Harmonized Tariff", "Annotated for", "U.S. Notes", "Revision", "XXII", "99 - III")


def fetch(url, dest):
    subprocess.run(["curl", "-sSfL", "-m", "180", url, "-o", str(dest)], check=True)
    return dest


def note16_lines(text):
    lines = text.split("\n")
    start = end = None
    for i, ln in enumerate(lines):
        if start is None and re.match(r"^16\.\s+\(a\)", ln):
            start = i
        elif start is not None and re.match(r"^17\.\s+\(a\)", ln):
            end = i
            break
    if start is None or end is None:
        sys.exit("could not locate U.S. note 16 - the chapter layout changed, inspect by hand")
    return lines[start:end]


def parse_lists(lines):
    lists, cur = collections.OrderedDict(), None
    for ln in lines:
        if any(n in ln for n in PAGE_NOISE):
            continue
        m = LIST_HDR.match(ln)
        if m:
            metal = (m.group(3) or m.group(4)).lower()
            cur = f"(c)({m.group(1).lower()}) {m.group(2).strip()}"
            lists[cur] = {
                "metal": metal,
                "kind": "derivative" if m.group(2).lower().startswith("derivative") else "primary",
                "codes": [],
            }
            ln = ln[m.end():]
        if cur is None:
            continue
        # a new lettered subdivision ends the current list
        if re.match(r"^\s+\([a-z]+\)\s+[A-Z]", ln) and not LIST_HDR.match(ln):
            cur = None
            continue
        for tok in ln.split():
            if CODE.match(tok):
                lists[cur]["codes"].append(tok)
    for v in lists.values():
        v["codes"] = sorted(set(v["codes"]))
    return lists


def parse_headings(raw):
    out = {}
    for r in json.loads(raw):
        h = r.get("htsno") or ""
        if h.startswith(("9903.82", "9903.85")):
            out[h] = {
                "description": " ".join((r.get("description") or "").split()),
                "rate": " ".join((r.get("general") or "").split()),
            }
    return out


def main():
    tmp = pathlib.Path(tempfile.mkdtemp())
    raw_json = fetch(HTS_JSON, tmp / "ch99.json").read_text()
    pdf = fetch(HTS_PDF, tmp / "ch99.pdf")
    subprocess.run(["pdftotext", "-layout", str(pdf), str(tmp / "ch99.txt")], check=True)
    text = (tmp / "ch99.txt").read_text()

    rev = re.search(r"Harmonized Tariff Schedule of the United States (Revision \d+ \(\d{4}\))", text)
    lists = parse_lists(note16_lines(text))
    headings = parse_headings(raw_json)

    # code -> which lists it appears on, and therefore which metals it carries
    index = collections.OrderedDict()
    for name, v in lists.items():
        for c in v["codes"]:
            e = index.setdefault(c, {"metals": [], "lists": []})
            if v["metal"] not in e["metals"]:
                e["metals"].append(v["metal"])
            e["lists"].append(name)

    payload = {
        "source": {
            "authority": "U.S. Note 16 to subchapter III, chapter 99, HTSUS (USITC)",
            "revision": rev.group(1) if rev else "unknown",
            "urls": [HTS_PDF, HTS_JSON],
            "retrieved": datetime.date.today().isoformat(),
            "grade": "hard",
        },
        "rules": {
            "threshold_pct": 15,
            "threshold_note": ("For articles classified in the listed provisions that are not in chapters 72, 73, 74 "
                               "or 76 of the HTSUS, the metals headings only apply where the weight of the applicable "
                               "metal is at least 15 percent of the weight of the imported article. Articles below "
                               "that threshold are provided for in heading 9903.82.03. If an article is classified in "
                               "a provision present on multiple lists, use the aggregate weight of the listed metals."),
            "no_metal_heading": "9903.82.01",
            "below_threshold_heading": "9903.82.03",
            "reporting": {
                "steel": ["country of melt and pour", "aggregate metal weight in kg as second quantity"],
                "aluminum": ["primary (and secondary) country of smelt", "country of cast",
                             "aggregate metal weight in kg as second quantity"],
                "copper": ["primary country of smelt", "country of cast",
                           "aggregate metal weight in kg as second quantity"],
            },
            "csms": ["#68253075 (2026-04-03)", "#69252300 (2026-07-15)"],
        },
        "lists": lists,
        "codes": index,
        "headings": headings,
    }

    (ROOT / "data" / "scope.json").write_text(json.dumps(payload, indent=1) + "\n")
    (ROOT / "data" / "scope.js").write_text(
        "/* generated by tools/build_scope.py - do not edit by hand */\n"
        "window.MILLPROOF_SCOPE = " + json.dumps(payload, separators=(",", ":")) + ";\n")

    print(f"{payload['source']['revision']} - {len(lists)} lists, {len(index)} distinct codes")
    for name, v in lists.items():
        print(f"  {name:52} {v['metal']:9} {len(v['codes']):4}")


if __name__ == "__main__":
    main()
