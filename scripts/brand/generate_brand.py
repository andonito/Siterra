#!/usr/bin/env python3
"""
Siterra brand generator.
Produces the full logo system as SVG, plus the OG image and a brand sheet.
Wordmark is rendered as vector paths extracted from the Sora typeface so the
assets have no font dependency.
"""
import math
import os
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "public" / "brand"
BRAND.mkdir(parents=True, exist_ok=True)

SORA = ROOT / "node_modules" / "@fontsource" / "sora" / "files" / "sora-latin-700-normal.woff2"

# ── Palette ──────────────────────────────────────────────────────
INK_DARK = "#07090d"      # obsidian background
INK_LIGHT = "#eef2f8"     # light ink
ACCENT = "#5fe0ff"        # obsidian accent (glacial cyan)
MUTE = "#99a5b8"

# ── Contour Summit geometry (matches Logo.astro) ─────────────────
RINGS = [
    (46, 50, 31, False),
    (49, 47, 23, False),
    (53, 43, 15, False),
    (57, 39, 8, True),
]
SUMMIT = (61, 35, 4.6)
GAP_HALF = 23  # degrees
CENTER_ANGLE = 135


def arc_path(cx, cy, r):
    start = math.radians(CENTER_ANGLE + GAP_HALF)
    end = math.radians(CENTER_ANGLE - GAP_HALF + 360)
    x1, y1 = cx + r * math.cos(start), cy + r * math.sin(start)
    x2, y2 = cx + r * math.cos(end), cy + r * math.sin(end)
    return f"M {x1:.2f} {y1:.2f} A {r} {r} 0 1 1 {x2:.2f} {y2:.2f}"


def icon_svg(ink, accent, size=96):
    paths = []
    for (cx, cy, r, is_acc) in RINGS:
        col = accent if is_acc else ink
        op = "1" if is_acc else "0.92"
        paths.append(
            f'<path d="{arc_path(cx, cy, r)}" stroke="{col}" stroke-width="5" '
            f'stroke-linecap="round" fill="none" opacity="{op}"/>'
        )
    sx, sy, sr = SUMMIT
    paths.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{accent}"/>')
    body = "\n  ".join(paths)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 96 96" fill="none">\n  {body}\n</svg>\n'
    )


# ── Wordmark paths from Sora ─────────────────────────────────────
def wordmark_glyphs(text="Siterra", upm_size=72):
    font = TTFont(SORA)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = upm_size / upm
    hmtx = font["hmtx"]

    out = []
    x = 0.0
    for ch in text:
        gname = cmap.get(ord(ch))
        if not gname:
            continue
        pen = SVGPathPen(glyph_set)
        glyph_set[gname].draw(pen)
        d = pen.getCommands()
        adv = hmtx[gname][0]
        # Flip vertically (font y-up → svg y-down) and place along x.
        transform = f"translate({x:.2f},0) scale({scale:.5f},{-scale:.5f})"
        if d:
            out.append(f'<path d="{d}" transform="{transform}"/>')
        x += adv * scale
    font.close()
    return out, x  # paths, total advance width in px


def horizontal_svg(ink, accent, height=40):
    # icon at left, wordmark to the right
    icon_box = 46
    gap = 12
    glyphs, w = wordmark_glyphs(upm_size=34)
    # baseline so caps roughly center on the icon
    baseline_y = 31
    icon_paths = []
    for (cx, cy, r, is_acc) in RINGS:
        col = accent if is_acc else ink
        op = "1" if is_acc else "0.92"
        icon_paths.append(
            f'<path d="{arc_path(cx, cy, r)}" stroke="{col}" stroke-width="5" '
            f'stroke-linecap="round" fill="none" opacity="{op}"/>'
        )
    sx, sy, sr = SUMMIT
    icon_paths.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{accent}"/>')
    icon_group = (
        f'<g transform="translate(0,4) scale({icon_box/96:.4f})">'
        + "".join(icon_paths)
        + "</g>"
    )
    word_group = (
        f'<g transform="translate({icon_box + gap},{baseline_y})" fill="{ink}">'
        + "".join(glyphs)
        + "</g>"
    )
    total_w = icon_box + gap + w + 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w:.0f}" height="54" '
        f'viewBox="0 0 {total_w:.0f} 54" fill="none">\n  {icon_group}\n  {word_group}\n</svg>\n'
    )


def stacked_svg(ink, accent):
    glyphs, w = wordmark_glyphs(upm_size=30)
    icon_box = 60
    canvas_w = max(icon_box, w) + 16
    icon_x = (canvas_w - icon_box) / 2
    icon_paths = []
    for (cx, cy, r, is_acc) in RINGS:
        col = accent if is_acc else ink
        op = "1" if is_acc else "0.92"
        icon_paths.append(
            f'<path d="{arc_path(cx, cy, r)}" stroke="{col}" stroke-width="5" '
            f'stroke-linecap="round" fill="none" opacity="{op}"/>'
        )
    sx, sy, sr = SUMMIT
    icon_paths.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{accent}"/>')
    icon_group = (
        f'<g transform="translate({icon_x:.1f},0) scale({icon_box/96:.4f})">'
        + "".join(icon_paths)
        + "</g>"
    )
    word_x = (canvas_w - w) / 2
    word_group = (
        f'<g transform="translate({word_x:.1f},{icon_box + 26}) " fill="{ink}">'
        + "".join(glyphs)
        + "</g>"
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{canvas_w:.0f}" height="{icon_box + 38:.0f}" '
        f'viewBox="0 0 {canvas_w:.0f} {icon_box + 38:.0f}" fill="none">\n  {icon_group}\n  {word_group}\n</svg>\n'
    )


def write(name, content):
    (BRAND / name).write_text(content)
    print(f"  ✓ {name}")


print("Generating brand SVGs…")

# Icons
write("icon.svg", icon_svg(INK_LIGHT, ACCENT))
write("icon-dark.svg", icon_svg(INK_DARK, ACCENT))
write("favicon.svg", icon_svg(INK_LIGHT, ACCENT, size=48))

# Monochrome icon (single color, for stamps/embroidery)
mono = icon_svg("#000000", "#000000")
write("icon-mono.svg", mono)

# Horizontal lockups
write("logo-horizontal.svg", horizontal_svg(INK_LIGHT, ACCENT))       # on dark
write("logo-horizontal-dark.svg", horizontal_svg(INK_DARK, ACCENT))   # on light

# Stacked lockups
write("logo-stacked.svg", stacked_svg(INK_LIGHT, ACCENT))
write("logo-stacked-dark.svg", stacked_svg(INK_DARK, ACCENT))

# ── OG image 1200×630 ────────────────────────────────────────────
def og_svg():
    glyphs, w = wordmark_glyphs(upm_size=46)
    icon_box = 74
    # logo group centered-left
    icon_paths = []
    for (cx, cy, r, is_acc) in RINGS:
        col = ACCENT if is_acc else INK_LIGHT
        op = "1" if is_acc else "0.92"
        icon_paths.append(
            f'<path d="{arc_path(cx, cy, r)}" stroke="{col}" stroke-width="5" '
            f'stroke-linecap="round" fill="none" opacity="{op}"/>'
        )
    sx, sy, sr = SUMMIT
    icon_paths.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{ACCENT}"/>')
    icon_g = f'<g transform="translate(80,64) scale({icon_box/96:.4f})">' + "".join(icon_paths) + "</g>"
    word_g = f'<g transform="translate({80 + icon_box + 18},124)" fill="{INK_LIGHT}">' + "".join(glyphs) + "</g>"

    # Headline paths
    head_glyphs_1, _ = wordmark_glyphs("Look like the", upm_size=78)
    head_glyphs_2, _ = wordmark_glyphs("obvious choice.", upm_size=78)
    h1 = f'<g transform="translate(80,330)" fill="{INK_LIGHT}">' + "".join(head_glyphs_1) + "</g>"
    h2 = f'<g transform="translate(80,430)" fill="{ACCENT}">' + "".join(head_glyphs_2) + "</g>"

    sub_glyphs, _ = wordmark_glyphs("Premium websites for service businesses", upm_size=26)
    sub = f'<g transform="translate(80,510)" fill="{MUTE}">' + "".join(sub_glyphs) + "</g>"

    # faint contour lines decoration on the right
    deco = []
    for i, r in enumerate([120, 175, 230, 285, 340]):
        col = ACCENT if i == 2 else MUTE
        op = 0.5 if i == 2 else 0.16
        d = arc_path(0, 0, r)
        deco.append(f'<path d="{d}" stroke="{col}" stroke-width="2" fill="none" opacity="{op}"/>')
    deco_g = f'<g transform="translate(1180,330)">' + "".join(deco) + "</g>"

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">\n'
        f'  <rect width="1200" height="630" fill="{INK_DARK}"/>\n'
        f'  <rect width="1200" height="630" fill="url(#g)"/>\n'
        f'  <defs><radialGradient id="g" cx="78%" cy="20%" r="80%">'
        f'<stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.10"/>'
        f'<stop offset="55%" stop-color="{INK_DARK}" stop-opacity="0"/></radialGradient></defs>\n'
        f'  {deco_g}\n  {icon_g}\n  {word_g}\n  {h1}\n  {h2}\n  {sub}\n</svg>\n'
    )


write("og.svg", og_svg())

# ── Brand sheet (overview) ───────────────────────────────────────
def brand_sheet():
    sw = []
    swatches = [("Obsidian", INK_DARK), ("Ink", INK_LIGHT), ("Accent", ACCENT), ("Mute", MUTE)]
    for i, (name, col) in enumerate(swatches):
        x = 80 + i * 175
        sw.append(f'<rect x="{x}" y="540" width="150" height="90" rx="10" fill="{col}" stroke="#ffffff22"/>')
        sw.append(f'<text x="{x}" y="655" fill="{INK_LIGHT}" font-family="monospace" font-size="15">{name}</text>')
        sw.append(f'<text x="{x}" y="675" fill="{MUTE}" font-family="monospace" font-size="13">{col}</text>')

    hero_icon = f'<g transform="translate(80,90) scale(1.6)">{icon_svg_inner(INK_LIGHT, ACCENT)}</g>'
    title_g, _ = wordmark_glyphs("Siterra", upm_size=60)
    title = f'<g transform="translate(260,210)" fill="{INK_LIGHT}">' + "".join(title_g) + "</g>"

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="740" viewBox="0 0 800 740" fill="none">\n'
        f'  <rect width="800" height="740" fill="{INK_DARK}"/>\n'
        f'  {hero_icon}\n  {title}\n'
        f'  <text x="260" y="245" fill="{MUTE}" font-family="monospace" font-size="16">Premium websites for service businesses</text>\n'
        f'  <text x="80" y="360" fill="{INK_LIGHT}" font-family="sans-serif" font-size="22" font-weight="600">Contour Summit — concentric arcs rising to a summit</text>\n'
        f'  <text x="80" y="400" fill="{MUTE}" font-family="sans-serif" font-size="15">Display: Sora · Body: Inter · Labels: IBM Plex Mono</text>\n'
        f'  <text x="80" y="510" fill="{MUTE}" font-family="monospace" font-size="14">PALETTE</text>\n'
        + "\n  ".join(sw)
        + "\n</svg>\n"
    )


def icon_svg_inner(ink, accent):
    paths = []
    for (cx, cy, r, is_acc) in RINGS:
        col = accent if is_acc else ink
        op = "1" if is_acc else "0.92"
        paths.append(
            f'<path d="{arc_path(cx, cy, r)}" stroke="{col}" stroke-width="5" '
            f'stroke-linecap="round" fill="none" opacity="{op}"/>'
        )
    sx, sy, sr = SUMMIT
    paths.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{accent}"/>')
    return "".join(paths)


write("brand-sheet.svg", brand_sheet())

print("Brand SVGs complete.")
