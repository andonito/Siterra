// Rasterize brand SVGs into PNGs at the sizes the site and platforms need.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRAND = join(__dirname, '..', '..', 'public', 'brand');

function render(svgName, outName, width) {
  const svgPath = join(BRAND, svgName);
  if (!existsSync(svgPath)) {
    console.warn(`  ! missing ${svgName}, skipping ${outName}`);
    return;
  }
  const svg = readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0,0,0,0)',
  });
  const png = resvg.render().asPng();
  writeFileSync(join(BRAND, outName), png);
  console.log(`  ✓ ${outName} (${width}px)`);
}

function renderSolid(svgName, outName, width, bg) {
  const svg = readFileSync(join(BRAND, svgName), 'utf8');
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: bg });
  writeFileSync(join(BRAND, outName), resvg.render().asPng());
  console.log(`  ✓ ${outName} (${width}px, solid)`);
}

console.log('Rendering brand PNGs…');

// Favicons (icon on transparent)
render('icon.svg', 'favicon-16.png', 16);
render('icon.svg', 'favicon-32.png', 32);
render('icon.svg', 'icon-192.png', 192);
render('icon.svg', 'icon-512.png', 512);

// Apple touch icon — solid obsidian background (iOS ignores transparency)
renderSolid('icon.svg', 'icon-180.png', 180, '#07090d');

// Social avatar — solid background, centered icon
renderSolid('icon.svg', 'social-avatar.png', 1024, '#07090d');

// Logo lockups (transparent)
render('logo-horizontal.svg', 'logo-horizontal.png', 720);
render('logo-horizontal-dark.svg', 'logo-horizontal-dark.png', 720);
render('logo-stacked.svg', 'logo-stacked.png', 480);

// OG image
render('og.svg', 'og.png', 1200);

// Brand sheet preview
render('brand-sheet.svg', 'brand-sheet.png', 800);

console.log('PNG rendering complete.');
