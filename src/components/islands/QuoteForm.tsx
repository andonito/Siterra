import { useEffect, useMemo, useState } from 'react';

const BUSINESS_TYPES = [
  'Window tinting', 'Landscaping / lawn', 'Irrigation / sprinklers', 'Roofing',
  'HVAC', 'Plumbing', 'Electrical', 'Cleaning services', 'Med spa / aesthetics',
  'General contractor', 'Auto detailing', 'Other',
];
const BUDGETS = [
  { v: '$997', label: '$997 — Launch' },
  { v: '$2,500', label: '$2,500 — Local Site' },
  { v: '$5,000', label: '$5,000 — Premium Growth' },
  { v: '$10,000+', label: '$10,000+ — Custom Authority' },
  { v: 'Not sure yet', label: 'Not sure yet' },
];
const TIMELINES = ['As soon as possible', 'Within a month', '1–3 months', 'Just exploring'];
const CONTACT_PREFS = ['Email', 'Phone call', 'Text message'];

const STEPS = ['Contact', 'Business', 'Project', 'Fit', 'Review'];

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [f, setF] = useState({
    name: '', business: '', email: '', phone: '',
    website: '', type: '', services: '', city: '',
    budget: '', timeline: '', contact: 'Email', needs: '',
    'bot-field': '',
  });

  // Preselect budget if arriving from ?tier=authority
  useEffect(() => {
    const tier = new URLSearchParams(window.location.search).get('tier');
    if (tier === 'authority') setF((p) => ({ ...p, budget: '$10,000+' }));
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<any>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.name.trim()) e.name = 'Please add your name.';
      if (!f.email.trim()) e.email = 'We need an email to reach you.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'That email looks off.';
    }
    if (s === 1) {
      if (!f.business.trim()) e.business = 'What business is this for?';
      if (!f.type) e.type = 'Pick the closest match.';
    }
    if (s === 2) {
      if (!f.city.trim()) e.city = 'Where do you operate?';
    }
    if (s === 3) {
      if (!f.budget) e.budget = 'A rough range helps us scope.';
      if (!f.timeline) e.timeline = 'When would you like to launch?';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    // All prior steps already validated on the way here.
    if (f['bot-field']) return; // honeypot tripped
    setSubmitting(true);
    setSubmitErr('');
    try {
      const res = await fetch('/api/blueprint-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!res.ok) {
        // Surface the server's clear validation message (400) when present.
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      // Optional analytics — no-ops if GA isn't configured.
      (window as any).gtag?.('event', 'blueprint_submit');
      setDone(true);
    } catch (err) {
      console.error('Blueprint submit error:', err);
      const msg = err instanceof Error ? err.message : '';
      setSubmitErr(
        msg && msg !== 'Submission failed'
          ? msg
          : 'Something went wrong sending your request. Please email Hello@getsiterra.com and we’ll jump on it.'
      );
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => ((step + (done ? 1 : 0)) / STEPS.length) * 100, [step, done]);

  if (done) {
    return (
      <div className="qf-done card">
        <div className="qf-done-mark" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="h2">Your Blueprint request was sent.</h2>
        <p className="lead">
          Thanks{f.name.trim() ? ', ' + f.name.split(' ')[0] : ''}. We’ll review it and get back to
          you within 48 hours from Hello@getsiterra.com with a tailored plan and next steps.
        </p>
        <div className="qf-done-actions">
          <a href="/" className="btn btn-ghost">Back to home</a>
          <a href="/start" className="btn">Or start a build now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="qf">
      {/* Hidden static form is in quote.astro for Netlify detection. */}
      <div className="qf-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="qf-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <ol className="qf-steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'is-on' : i < step ? 'is-done' : ''}>
            <span className="qf-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="qf-step-label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="qf-card card">
        {/* Honeypot: no visible text, hidden from screen readers and tab order.
            A real user can't fill it; a bot that does is rejected server-side. */}
        <div className="qf-hp" aria-hidden="true">
          <input
            type="text"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            value={f['bot-field']}
            onChange={set('bot-field')}
          />
        </div>

        {step === 0 && (
          <fieldset className="qf-fields">
            <legend className="qf-legend">Let’s start with you</legend>
            <div className="field">
              <label htmlFor="q-name">Your name <span className="req">*</span></label>
              <input id="q-name" className="input" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} autoComplete="name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="qf-row">
              <div className="field">
                <label htmlFor="q-email">Email <span className="req">*</span></label>
                <input id="q-email" type="email" className="input" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} autoComplete="email" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="q-phone">Phone <span className="opt-label">optional</span></label>
                <input id="q-phone" type="tel" className="input" value={f.phone} onChange={set('phone')} autoComplete="tel" />
              </div>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="qf-fields">
            <legend className="qf-legend">About your business</legend>
            <div className="field">
              <label htmlFor="q-business">Business name <span className="req">*</span></label>
              <input id="q-business" className="input" value={f.business} onChange={set('business')} aria-invalid={!!errors.business} autoComplete="organization" />
              {errors.business && <span className="field-error">{errors.business}</span>}
            </div>
            <div className="field">
              <label htmlFor="q-type">Business type <span className="req">*</span></label>
              <select id="q-type" className="input" value={f.type} onChange={set('type')} aria-invalid={!!errors.type}>
                <option value="">Select…</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <span className="field-error">{errors.type}</span>}
            </div>
            <div className="field">
              <label htmlFor="q-services">Main services <span className="opt-label">optional</span></label>
              <input id="q-services" className="input" value={f.services} onChange={set('services')} placeholder="e.g. ceramic tint, residential film" />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="qf-fields">
            <legend className="qf-legend">Your project</legend>
            <div className="qf-row">
              <div className="field">
                <label htmlFor="q-city">City / service area <span className="req">*</span></label>
                <input id="q-city" className="input" value={f.city} onChange={set('city')} aria-invalid={!!errors.city} placeholder="e.g. Orlando, FL" />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="field">
                <label htmlFor="q-website">Current website <span className="opt-label">if any</span></label>
                <input id="q-website" className="input" value={f.website} onChange={set('website')} placeholder="https://" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="q-needs">What do you want the new site to do?</label>
              <textarea id="q-needs" className="input" value={f.needs} onChange={set('needs')} placeholder="More booked jobs, look more established, rank in your city…" />
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="qf-fields">
            <legend className="qf-legend">Scope & timing</legend>
            <div className="field">
              <span className="field-label">Budget range <span className="req">*</span></span>
              <div className="qf-choices">
                {BUDGETS.map((b) => (
                  <label key={b.v} className={`choice ${f.budget === b.v ? 'is-on' : ''}`}>
                    <input type="radio" name="budget" checked={f.budget === b.v} onChange={() => setF((p) => ({ ...p, budget: b.v }))} />
                    <span className="tick" aria-hidden="true" />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
              {errors.budget && <span className="field-error">{errors.budget}</span>}
            </div>
            <div className="field">
              <span className="field-label">Timeline <span className="req">*</span></span>
              <div className="qf-choices qf-choices-2">
                {TIMELINES.map((t) => (
                  <label key={t} className={`choice ${f.timeline === t ? 'is-on' : ''}`}>
                    <input type="radio" name="timeline" checked={f.timeline === t} onChange={() => setF((p) => ({ ...p, timeline: t }))} />
                    <span className="tick" aria-hidden="true" />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
              {errors.timeline && <span className="field-error">{errors.timeline}</span>}
            </div>
            <div className="field">
              <span className="field-label">Preferred contact</span>
              <div className="qf-choices qf-choices-3">
                {CONTACT_PREFS.map((c) => (
                  <label key={c} className={`choice ${f.contact === c ? 'is-on' : ''}`}>
                    <input type="radio" name="contact" checked={f.contact === c} onChange={() => setF((p) => ({ ...p, contact: c }))} />
                    <span className="tick" aria-hidden="true" />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div className="qf-fields">
            <h2 className="qf-legend">Review & send</h2>
            <dl className="qf-review">
              <Row k="Name" v={f.name} />
              <Row k="Email" v={f.email} />
              {f.phone && <Row k="Phone" v={f.phone} />}
              <Row k="Business" v={f.business} />
              <Row k="Type" v={f.type} />
              {f.services && <Row k="Services" v={f.services} />}
              <Row k="Service area" v={f.city} />
              {f.website && <Row k="Current site" v={f.website} />}
              <Row k="Budget" v={f.budget} />
              <Row k="Timeline" v={f.timeline} />
              <Row k="Contact via" v={f.contact} />
              {f.needs && <Row k="Goals" v={f.needs} />}
            </dl>
            {submitErr && <p className="field-error">{submitErr}</p>}
          </div>
        )}

        <div className="qf-nav">
          {step > 0 ? (
            <button className="btn btn-ghost btn-sm" onClick={back} disabled={submitting}>Back</button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button className="btn" onClick={next}>Continue</button>
          ) : (
            <button className="btn" onClick={submit} disabled={submitting}>
              {submitting ? 'Sending…' : 'Send my Blueprint request'}
            </button>
          )}
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="qf-review-row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

const css = `
.qf { display: grid; gap: 1.75rem; }
.qf-progress { height: 3px; border-radius: 999px; background: var(--line); overflow: hidden; }
.qf-progress-bar { height: 100%; background: var(--accent); transition: width 0.4s cubic-bezier(0.2,0.7,0.2,1); }
.qf-steps { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.qf-steps li { display: flex; align-items: center; gap: 0.5em; padding: 0.4em 0.9em; border-radius: 999px; border: 1px solid var(--line); font: 500 0.78rem var(--font-body); color: var(--mute); }
.qf-steps li.is-on { border-color: var(--accent); color: var(--ink); }
.qf-steps li.is-done { color: var(--ink); }
.qf-step-num { font: 500 0.66rem var(--font-mono); color: var(--accent); }
.qf-card { padding: clamp(1.4rem, 4vw, 2.25rem); }
.qf-fields { display: grid; gap: 1.2rem; border: none; }
.qf-legend { font: 600 1.3rem var(--font-display); letter-spacing: -0.01em; margin-bottom: 0.3rem; padding: 0; }
.qf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.qf-choices { display: grid; gap: 0.6rem; }
.qf-choices-2 { grid-template-columns: 1fr 1fr; }
.qf-choices-3 { grid-template-columns: repeat(3, 1fr); }
.qf-choices .choice { align-items: center; }
.req { color: var(--accent); }
.opt-label { font: 400 0.7rem var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--mute); margin-left: 0.5em; }
.qf-hp { display: none; }
.qf-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 1.75rem; gap: 1rem; }
.qf-review { display: grid; gap: 0.7rem; }
.qf-review-row { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; padding-bottom: 0.7rem; border-bottom: 1px solid var(--line); }
.qf-review-row dt { font: 500 0.72rem var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--mute); }
.qf-review-row dd { color: var(--ink); font-size: 0.95rem; }
.qf-done { padding: clamp(2rem, 5vw, 3.5rem); text-align: center; display: grid; gap: 1.1rem; justify-items: center; }
.qf-done-mark { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--btn-ink); }
.qf-done-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; justify-content: center; margin-top: 0.8rem; }
@media (max-width: 560px) {
  .qf-row, .qf-choices-2, .qf-choices-3 { grid-template-columns: 1fr; }
  .qf-review-row { grid-template-columns: 1fr; gap: 0.2rem; }
}
`;
