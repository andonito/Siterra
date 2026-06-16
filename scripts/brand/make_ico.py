#!/usr/bin/env python3
"""Bundle favicon PNGs into a multi-resolution favicon.ico."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "public" / "brand"
PUBLIC = ROOT / "public"

sizes = [16, 32, 48]
imgs = []
for s in sizes:
    p = BRAND / f"favicon-{s}.png" if s != 48 else BRAND / "icon-192.png"
    if not p.exists():
        # fall back to the 512 master
        p = BRAND / "icon-512.png"
    img = Image.open(p).convert("RGBA").resize((s, s), Image.LANCZOS)
    imgs.append(img)

# Save multi-size .ico at the site root (referenced by Base.astro).
out = PUBLIC / "favicon.ico"
imgs[0].save(out, format="ICO", sizes=[(s, s) for s in sizes])
print(f"  ✓ favicon.ico ({', '.join(str(s) for s in sizes)})")
