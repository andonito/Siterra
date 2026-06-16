/**
 * Topographic contour field — Siterra's signature hero motif.
 *
 * Renders slowly drifting elevation contour lines (the brand's "terra" idea):
 *  - value noise sampled on a grid, animated by a slow time offset
 *  - marching squares traces iso-lines at several elevation thresholds
 *  - colors read live from CSS custom properties, so it matches every theme
 *  - pauses when offscreen (IntersectionObserver) and respects reduced motion
 *  - device-pixel-ratio capped at 2 for performance
 */

type RGB = [number, number, number];

function cssColor(el: HTMLElement, prop: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(prop).trim();
  return v || fallback;
}

// Parse hsl()/hex from a computed accent value into rgb for canvas strokes.
function toRGB(color: string): RGB {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d');
  if (!ctx) return [120, 200, 230];
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

// ── Lightweight value noise (no deps) ────────────────────────────
function makePermutation(seed: number) {
  const p = new Uint8Array(512);
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  return p;
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function valueNoise(p: Uint8Array, x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const tl = p[p[xi] + yi];
  const tr = p[p[xi + 1] + yi];
  const bl = p[p[xi] + yi + 1];
  const br = p[p[xi + 1] + yi + 1];
  const u = fade(xf);
  const v = fade(yf);
  return lerp(lerp(tl, tr, u), lerp(bl, br, u), v) / 255;
}

export function initTerrain(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const root = document.documentElement;
  const reduce =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    root.getAttribute('data-motion') === 'low';

  const perm = makePermutation(1337);

  let W = 0;
  let H = 0;
  let dpr = 1;
  let inkRGB: RGB = [150, 170, 200];
  let accentRGB: RGB = [120, 200, 230];

  const COLS = 48; // grid resolution
  const cell = () => W / COLS;
  const LEVELS = [0.34, 0.46, 0.58, 0.7, 0.82];

  function readColors() {
    inkRGB = toRGB(cssColor(root, '--mute', '#99a5b8'));
    accentRGB = toRGB(cssColor(root, '--accent', '#5fe0ff'));
  }

  function resize() {
    const rect = canvas!.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(rect.width, 320);
    H = Math.max(rect.height, 320);
    canvas!.width = Math.floor(W * dpr);
    canvas!.height = Math.floor(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Marching-squares iso-line for a scalar field at threshold `lv`.
  function drawField(t: number) {
    const c = cell();
    const rows = Math.ceil(H / c) + 1;
    const cols = COLS + 1;
    const fieldVal = (ix: number, iy: number) => {
      const nx = ix * 0.18;
      const ny = iy * 0.18;
      return (
        valueNoise(perm, nx + t, ny - t * 0.35) * 0.7 +
        valueNoise(perm, nx * 2.3 - t * 0.6, ny * 2.3) * 0.3
      );
    };

    for (let li = 0; li < LEVELS.length; li++) {
      const lv = LEVELS[li];
      const isAccent = li === 2; // mid contour highlighted
      const [r, g, b] = isAccent ? accentRGB : inkRGB;
      ctx!.strokeStyle = `rgba(${r},${g},${b},${isAccent ? 0.55 : 0.22})`;
      ctx!.lineWidth = isAccent ? 1.4 : 1;
      ctx!.beginPath();

      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const x0 = ix * c;
          const y0 = iy * c;
          const a = fieldVal(ix, iy);
          const b2 = fieldVal(ix + 1, iy);
          const c2 = fieldVal(ix + 1, iy + 1);
          const d = fieldVal(ix, iy + 1);
          let idx = 0;
          if (a > lv) idx |= 8;
          if (b2 > lv) idx |= 4;
          if (c2 > lv) idx |= 2;
          if (d > lv) idx |= 1;
          if (idx === 0 || idx === 15) continue;

          const top = () => [x0 + (c * (lv - a)) / (b2 - a), y0];
          const right = () => [x0 + c, y0 + (c * (lv - b2)) / (c2 - b2)];
          const bottom = () => [x0 + (c * (lv - d)) / (c2 - d), y0 + c];
          const left = () => [x0, y0 + (c * (lv - a)) / (d - a)];

          const seg = (p1: number[], p2: number[]) => {
            ctx!.moveTo(p1[0], p1[1]);
            ctx!.lineTo(p2[0], p2[1]);
          };

          switch (idx) {
            case 1: case 14: seg(left(), bottom()); break;
            case 2: case 13: seg(bottom(), right()); break;
            case 3: case 12: seg(left(), right()); break;
            case 4: case 11: seg(top(), right()); break;
            case 5: seg(left(), top()); seg(bottom(), right()); break;
            case 6: case 9: seg(top(), bottom()); break;
            case 7: case 8: seg(left(), top()); break;
            case 10: seg(left(), bottom()); seg(top(), right()); break;
          }
        }
      }
      ctx!.stroke();
    }
  }

  let raf = 0;
  let t = 0;
  let running = false;

  function frame() {
    ctx!.clearRect(0, 0, W, H);
    drawField(t);
    t += 0.0016;
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function setup() {
    resize();
    readColors();
    if (reduce) {
      ctx!.clearRect(0, 0, W, H);
      drawField(0); // single static frame
    } else {
      start();
    }
  }

  // Pause when offscreen.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) start();
        else stop();
      }
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  let rt: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      resize();
      if (reduce) {
        ctx!.clearRect(0, 0, W, H);
        drawField(0);
      }
    }, 180);
  });

  // React to live theme changes from the Style Studio.
  const themeObserver = new MutationObserver(() => readColors());
  themeObserver.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme', 'style'],
  });

  setup();
}
