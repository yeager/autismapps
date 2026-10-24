#!/usr/bin/env python3
"""Parse every SVG referenced by the Piktali manifest as well-formed XML."""

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "static/piktali-pictograms/manifest.json"
ASSET_ROOT = (ROOT / "static/piktali-pictograms/assets").resolve()

manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
errors = []
checked = 0

for item in manifest["pictograms"]:
    filename = item.get("file", "")
    if not filename.endswith(".svg"):
        continue
    path = (ROOT / "static/piktali-pictograms" / filename).resolve()
    if not path.is_relative_to(ASSET_ROOT):
        errors.append(f"{item.get('symbol', filename)}: asset path escapes assets/")
        continue
    try:
        ET.parse(path)
        checked += 1
    except (OSError, ET.ParseError) as exc:
        errors.append(f"{item.get('symbol', filename)}: invalid SVG XML ({exc})")

if errors:
    print("Invalid Piktali SVGs:", file=sys.stderr)
    print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
    sys.exit(1)

print(f"Parsed {checked} manifest SVGs as well-formed XML.")
