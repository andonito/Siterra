import { useEffect, useRef, useState } from 'react';

type ThemeId = 'obsidian' | 'atlas' | 'gallery' | 'terra' | 'graphite';

const THEMES: { id: ThemeId; name: string; note: string; swatch: string[] }[] = [
  { id: 'obsidian', name: 'Obsidian', note: 'Dark · cinematic · glacial cyan', swatch: ['#07090d', '#5fe0ff', '#eef2f8'] },
  { id: 'atlas', name: 'Atlas', note: 'Deep blue · electric · premium', swatch: ['#050b17', '#3aa0ff', '#e9f0ff'] },
  { id: 'gallery', name: 'Gallery', note: 'Light · minimal · brass', swatch: ['#fafaf7', '#8a6a35', '#15171c'] },
  { id: 'terra', name: 'Terra', note: 'Earthen · warm · amber', swatch: ['#100c07', '#e0a13c', '#f4ede1'] },
  { id: 'graphite', name: 'Graphite', note: 'Chrome · steel · monochrome', swatch: ['#0c0e11', '#c4ccd6', '#f1f4f7'] },
];

const DEFAULT_HUE: Record<ThemeId, number> = {
  obsidian: 191, atlas: 211, gallery: 38, terra: 38, graphite: 210,
};

export default function StyleStudio() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [checking, setChecking] = useState(false);
  const [authErr, setAuthErr] = useState('');

  const [theme, setTheme] = useState<ThemeId>('obsidian');
  const [hue, setHue] = useState(191);
  const [lowMotion, setLowMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync local state from the live DOM when the panel opens.
  useEffect(() => {
    const handler = () => {
      const root = document.documentElement;
      const t = (root.getAttribute('data-theme') as ThemeId) || 'obsidian';
      setTheme(t);
      const h = root.style.getPropertyValue('--accent-h').trim();
      setHue(h ? parseInt(h, 10) : DEFAULT_HUE[t]);
      setLowMotion(root.getAttribute('data-motion') === 'low');
      setOpen(true);
    };
    window.addEventListener('siterra:studio-open', handler);
    return () => window.removeEventListener('siterra:studio-open', handler);
  }, []);

  // Esc closes; lock focus lightly.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const applyTheme = (t: ThemeId) => {
    document.documentElement.setAttribute('data-theme', t);
    const h = DEFAULT_HUE[t];
    document.documentElement.style.setProperty('--accent-h', String(h));
    setTheme(t);
    setHue(h);
    try {
      localStorage.setItem('siterra-theme', t);
      localStorage.setItem('siterra-accent-h', String(h));
    } catch {}
  };

  const applyHue = (h: number) => {
    document.documentElement.style.setProperty('--accent-h', String(h));
    setHue(h);
    try {
      localStorage.setItem('siterra-accent-h', String(h));
    } catch {}
  };

  const applyMotion = (low: boolean) => {
    if (low) document.documentElement.setAttribute('data-motion', 'low');
    else document.documentElement.removeAttribute('data-motion');
    setLowMotion(low);
    try {
      localStorage.setItem('siterra-motion', low ? 'low' : 'normal');
    } catch {}
  };

  const resetHue = () => applyHue(DEFAULT_HUE[theme]);

  const unlock = async () => {
    setChecking(true);
    setAuthErr('');
    try {
      const res = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setAuthed(true);
        setPw('');
      } else {
        setAuthErr('That password didn’t match.');
      }
    } catch {
      setAuthErr('Couldn’t verify right now. Try again.');
    } finally {
      setChecking(false);
    }
  };

  const exportTokens = () => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const keys = ['--bg','--bg2','--surface','--surface2','--ink','--mute','--line','--accent','--accent-2'];
    const tokens: Record<string, string> = { theme, '--accent-h': String(hue) };
    keys.forEach((k) => (tokens[k] = cs.getPropertyValue(k).trim()));
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siterra-theme-${theme}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!open) return null;

  return (
    <div className="studio-overlay" role="dialog" aria-modal="true" aria-label="Style Studio">
      <div className="studio-scrim" onClick={() => setOpen(false)} />
      <div className="studio-panel" ref={panelRef}>
        <header className="studio-head">
          <div>
            <p className="studio-eyebrow">Siterra · Style Studio</p>
            <h2 className="studio-title">{authed ? 'Live theme controls' : 'Locked'}</h2>
          </div>
          <button className="studio-x" aria-label="Close" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </header>

        {!authed ? (
          <div className="studio-lock">
            <p className="studio-lock-copy">
              This panel changes the site’s live appearance. Enter the studio password to continue.
            </p>
            <div className="field">
              <label htmlFor="studio-pw">Password</label>
              <input
                id="studio-pw"
                type="password"
                className="input"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && unlock()}
                autoFocus
                aria-invalid={!!authErr}
              />
              {authErr && <span className="field-error">{authErr}</span>}
            </div>
            <button className="btn btn-block" onClick={unlock} disabled={checking || !pw}>
              {checking ? 'Checking…' : 'Unlock'}
            </button>
          </div>
        ) : (
          <div className="studio-body">
            <section className="studio-section">
              <h3 className="studio-h3">Theme</h3>
              <div className="studio-themes">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`studio-theme ${theme === t.id ? 'is-on' : ''}`}
                    onClick={() => applyTheme(t.id)}
                  >
                    <span className="studio-swatch">
                      {t.swatch.map((c, i) => <span key={i} style={{ background: c }} />)}
                    </span>
                    <span className="studio-theme-name">{t.name}</span>
                    <span className="studio-theme-note">{t.note}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="studio-section">
              <div className="studio-section-head">
                <h3 className="studio-h3">Accent hue</h3>
                <button className="studio-reset" onClick={resetHue}>Reset</button>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={hue}
                onChange={(e) => applyHue(parseInt(e.target.value, 10))}
                className="studio-range"
                style={{ ['--h' as any]: hue }}
                aria-label="Accent hue"
              />
              <div className="studio-hue-readout">
                <span className="studio-hue-chip" style={{ background: `hsl(${hue} 90% 60%)` }} />
                <span className="mono-note">hue {hue}°</span>
              </div>
            </section>

            <section className="studio-section">
              <h3 className="studio-h3">Motion</h3>
              <label className="studio-switch">
                <input type="checkbox" checked={lowMotion} onChange={(e) => applyMotion(e.target.checked)} />
                <span className="studio-switch-track"><span className="studio-switch-thumb" /></span>
                <span className="studio-switch-label">Reduce animation</span>
              </label>
            </section>

            <section className="studio-section">
              <button className="btn btn-ghost btn-block" onClick={exportTokens}>
                {copied ? 'Exported ✓' : 'Export theme tokens (.json)'}
              </button>
              <p className="studio-foot">Changes are saved to this browser and persist across visits.</p>
            </section>
          </div>
        )}
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.studio-overlay { position: fixed; inset: 0; z-index: 300; display: flex; justify-content: flex-end; }
.studio-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); }
.studio-panel {
  position: relative; width: min(25rem, 100%); height: 100%; overflow-y: auto;
  background: var(--surface); border-left: 1px solid var(--line-strong);
  box-shadow: -30px 0 80px -30px rgba(0,0,0,0.6);
  display: flex; flex-direction: column; animation: studio-in 0.32s cubic-bezier(0.2,0.7,0.2,1);
}
@keyframes studio-in { from { transform: translateX(100%); } to { transform: none; } }
.studio-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid var(--line); }
.studio-eyebrow { font: 500 0.66rem var(--font-mono); letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
.studio-title { font: 600 1.2rem var(--font-display); margin-top: 0.3rem; }
.studio-x { background: none; border: 1px solid var(--line); border-radius: 50%; width: 2rem; height: 2rem; display: grid; place-items: center; color: var(--ink); cursor: pointer; transition: border-color 0.2s; }
.studio-x:hover { border-color: var(--accent); }
.studio-lock, .studio-body { padding: 1.5rem; display: grid; gap: 1.25rem; }
.studio-lock-copy { color: var(--mute); font-size: 0.92rem; }
.studio-section { display: grid; gap: 0.85rem; }
.studio-section-head { display: flex; align-items: center; justify-content: space-between; }
.studio-h3 { font: 500 0.72rem var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--mute); }
.studio-reset { background: none; border: none; color: var(--accent); font: 500 0.78rem var(--font-body); cursor: pointer; }
.studio-themes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.studio-theme { text-align: left; background: var(--bg2); border: 1px solid var(--line); border-radius: 12px; padding: 0.85rem; cursor: pointer; display: grid; gap: 0.4rem; transition: border-color 0.2s, transform 0.2s; }
.studio-theme:hover { transform: translateY(-2px); border-color: var(--line-strong); }
.studio-theme.is-on { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.studio-swatch { display: flex; height: 1.5rem; border-radius: 6px; overflow: hidden; }
.studio-swatch span { flex: 1; }
.studio-theme-name { font: 600 0.92rem var(--font-display); }
.studio-theme-note { font-size: 0.72rem; color: var(--mute); }
.studio-range { width: 100%; appearance: none; height: 8px; border-radius: 999px; outline-offset: 4px;
  background: linear-gradient(90deg, hsl(0 90% 60%), hsl(60 90% 60%), hsl(120 90% 60%), hsl(180 90% 60%), hsl(240 90% 60%), hsl(300 90% 60%), hsl(360 90% 60%)); }
.studio-range::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid hsl(var(--h) 90% 55%); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.studio-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid hsl(var(--h) 90% 55%); cursor: pointer; }
.studio-hue-readout { display: flex; align-items: center; gap: 0.6rem; }
.studio-hue-chip { width: 1.4rem; height: 1.4rem; border-radius: 6px; border: 1px solid var(--line-strong); }
.studio-switch { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.studio-switch input { position: absolute; opacity: 0; }
.studio-switch-track { width: 2.8rem; height: 1.6rem; border-radius: 999px; background: var(--line-strong); position: relative; transition: background 0.2s; flex: none; }
.studio-switch-thumb { position: absolute; top: 3px; left: 3px; width: 1.2rem; height: 1.2rem; border-radius: 50%; background: var(--ink); transition: transform 0.2s; }
.studio-switch input:checked + .studio-switch-track { background: var(--accent); }
.studio-switch input:checked + .studio-switch-track .studio-switch-thumb { transform: translateX(1.2rem); background: var(--btn-ink); }
.studio-switch-label { font-size: 0.92rem; }
.studio-foot { font-size: 0.78rem; color: var(--mute); margin-top: 0.5rem; }
@media (max-width: 480px) { .studio-themes { grid-template-columns: 1fr; } }
`;
