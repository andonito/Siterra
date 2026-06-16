import { useEffect, useMemo, useState } from 'react';
import {
  PACKAGES,
  ADDONS,
  CARE_PLANS,
  CARE_PLAN_TRIAL_DAYS,
  fmtUSD,
  type PackageId,
  type AddonId,
  type CarePlanId,
} from '../../data/pricing';

const BUSINESS_TYPES = [
  'Window tinting',
  'Landscaping / lawn',
  'Irrigation / sprinklers',
  'Roofing',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Cleaning services',
  'Med spa / aesthetics',
  'General contractor',
  'Auto detailing',
  'Other',
];

export default function Configurator() {
  const buyable = PACKAGES.filter((p) => !p.quoteOnly);

  const [pkg, setPkg] = useState<PackageId>('local');
  const [addons, setAddons] = useState<Set<AddonId>>(new Set());
  const [care, setCare] = useState<CarePlanId | null>(null);
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    website: '',
    type: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Preselect package from ?package= query param.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('package');
    if (p && buyable.some((b) => b.id === p)) setPkg(p as PackageId);
  }, []);

  const selectedPkg = buyable.find((p) => p.id === pkg)!;
  const selectedCare = care ? CARE_PLANS.find((c) => c.id === care)! : null;

  const dueToday = useMemo(() => {
    let total = selectedPkg.price;
    addons.forEach((id) => {
      const a = ADDONS.find((x) => x.id === id);
      if (a) total += a.price;
    });
    return total;
  }, [pkg, addons]);

  const toggleAddon = (id: AddonId) => {
    setAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Your name helps us personalize the kickoff.';
    if (!form.business.trim()) e.business = 'What business is this site for?';
    if (!form.email.trim()) e.email = 'We need an email to send your confirmation.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That email looks off.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkout = async () => {
    setServerError('');
    if (!validate()) {
      document.getElementById('config-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setSubmitting(true);
    // Optional analytics — no-ops if GA isn't configured.
    (window as any).gtag?.('event', 'checkout_started', {
      package: pkg,
      care_plan: care || 'none',
      addons: Array.from(addons).join(',') || 'none',
    });
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg,
          addonIds: Array.from(addons),
          carePlanId: care,
          customer: form,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Checkout could not start. Please try again.');
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error('No checkout URL was returned.');
    } catch (err) {
      // Surface a clear message to the user and log the exact error to the console.
      console.error('Checkout error:', err);
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong starting checkout. Please try again.'
      );
      setSubmitting(false);
    }
  };

  const set = (k: keyof typeof form) => (ev: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: ev.target.value }));

  return (
    <div className="cfg">
      <div className="cfg-main">
        {/* ── Package ── */}
        <section className="cfg-block" aria-labelledby="cfg-pkg">
          <div className="cfg-block-head">
            <span className="step-num">01 / Package</span>
            <h2 className="h3">Choose your build</h2>
          </div>
          <div className="cfg-pkgs">
            {buyable.map((p) => (
              <label key={p.id} className={`choice ${pkg === p.id ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="package"
                  value={p.id}
                  checked={pkg === p.id}
                  onChange={() => setPkg(p.id)}
                />
                <span className="tick" aria-hidden="true" />
                <span className="cfg-pkg-body">
                  <span className="cfg-pkg-top">
                    <span className="cfg-pkg-name">
                      {p.name}
                      {p.recommended && <span className="mini-badge">Recommended</span>}
                    </span>
                    <span className="cfg-pkg-price">{p.priceLabel}</span>
                  </span>
                  <span className="cfg-pkg-blurb">{p.blurb}</span>
                  <span className="mono-note">{p.delivery}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="cfg-hint">
            Need the flagship Custom Authority build? <a href="/quote?tier=authority" className="text-link">Request a quote →</a>
          </p>
        </section>

        {/* ── Add-ons ── */}
        <section className="cfg-block" aria-labelledby="cfg-add">
          <div className="cfg-block-head">
            <span className="step-num">02 / Add-ons</span>
            <h2 className="h3">Tune the scope <span className="opt">optional</span></h2>
          </div>
          <div className="cfg-addons">
            {ADDONS.map((a) => (
              <label key={a.id} className={`choice tick-square ${addons.has(a.id) ? 'is-on' : ''}`}>
                <input
                  type="checkbox"
                  checked={addons.has(a.id)}
                  onChange={() => toggleAddon(a.id)}
                />
                <span className="tick" aria-hidden="true" />
                <span className="cfg-addon-body">
                  <span className="cfg-addon-top">
                    <span>{a.name}</span>
                    <span className="cfg-addon-price">{a.priceLabel}</span>
                  </span>
                  <span className="cfg-addon-desc">{a.description}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* ── Care plan ── */}
        <section className="cfg-block" aria-labelledby="cfg-care">
          <div className="cfg-block-head">
            <span className="step-num">03 / Care plan</span>
            <h2 className="h3">Ongoing care <span className="opt">optional</span></h2>
          </div>
          <p className="cfg-care-note">
            Keep your site updated, protected, and improving. First 30 days included. Monthly billing
            starts after the trial. Cancel before the first monthly charge at no cost.
          </p>
          <div className="cfg-care">
            <label className={`choice ${care === null ? 'is-on' : ''}`}>
              <input type="radio" name="care" checked={care === null} onChange={() => setCare(null)} />
              <span className="tick" aria-hidden="true" />
              <span className="cfg-addon-body">
                <span className="cfg-addon-top">
                  <span>No plan for now</span>
                  <span className="cfg-addon-price">$0</span>
                </span>
                <span className="cfg-addon-desc">Includes 30 days of post-launch monitoring.</span>
              </span>
            </label>
            {CARE_PLANS.map((c) => (
              <label key={c.id} className={`choice ${care === c.id ? 'is-on' : ''}`}>
                <input type="radio" name="care" checked={care === c.id} onChange={() => setCare(c.id)} />
                <span className="tick" aria-hidden="true" />
                <span className="cfg-addon-body">
                  <span className="cfg-addon-top">
                    <span>
                      {c.name}
                      {c.popular && <span className="mini-badge">Most popular</span>}
                    </span>
                    <span className="cfg-addon-price">{c.priceLabel}</span>
                  </span>
                  <span className="cfg-addon-desc">{c.features[0]}{c.features[1] ? ` · ${c.features[1]}` : ''}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* ── Details ── */}
        <section className="cfg-block" id="config-details" aria-labelledby="cfg-det">
          <div className="cfg-block-head">
            <span className="step-num">04 / Details</span>
            <h2 className="h3">Where should we start?</h2>
          </div>
          <div className="cfg-form">
            <div className="field">
              <label htmlFor="c-name">Your name <span className="req">*</span></label>
              <input id="c-name" className="input" value={form.name} onChange={set('name')}
                aria-invalid={!!errors.name} autoComplete="name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="c-business">Business name <span className="req">*</span></label>
              <input id="c-business" className="input" value={form.business} onChange={set('business')}
                aria-invalid={!!errors.business} autoComplete="organization" />
              {errors.business && <span className="field-error">{errors.business}</span>}
            </div>
            <div className="field">
              <label htmlFor="c-email">Email <span className="req">*</span></label>
              <input id="c-email" type="email" className="input" value={form.email} onChange={set('email')}
                aria-invalid={!!errors.email} autoComplete="email" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor="c-phone">Phone <span className="opt-label">optional</span></label>
              <input id="c-phone" type="tel" className="input" value={form.phone} onChange={set('phone')}
                autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="c-type">Business type</label>
              <select id="c-type" className="input" value={form.type} onChange={set('type')}>
                <option value="">Select…</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="c-city">City / service area</label>
              <input id="c-city" className="input" value={form.city} onChange={set('city')}
                placeholder="e.g. Orlando, FL" />
            </div>
            <div className="field cfg-span">
              <label htmlFor="c-website">Current website <span className="opt-label">if any</span></label>
              <input id="c-website" className="input" value={form.website} onChange={set('website')}
                placeholder="https://" />
            </div>
            <div className="field cfg-span">
              <label htmlFor="c-notes">Anything we should know?</label>
              <textarea id="c-notes" className="input" value={form.notes} onChange={set('notes')}
                placeholder="Goals, deadlines, pages you have in mind…" />
            </div>
          </div>
        </section>
      </div>

      {/* ── Sticky summary ── */}
      <aside className="cfg-summary">
        <div className="cfg-summary-card card">
          <h2 className="h3">Your build</h2>
          <dl className="cfg-lines">
            <div className="cfg-line">
              <dt>{selectedPkg.name}</dt>
              <dd>{fmtUSD(selectedPkg.price)}</dd>
            </div>
            {Array.from(addons).map((id) => {
              const a = ADDONS.find((x) => x.id === id)!;
              return (
                <div className="cfg-line cfg-line-sub" key={id}>
                  <dt>{a.name.split(' — ')[0]}</dt>
                  <dd>{fmtUSD(a.price)}</dd>
                </div>
              );
            })}
          </dl>

          <div className="cfg-total">
            <span>Due today<small className="cfg-total-sub">upfront, one-time</small></span>
            <span className="cfg-total-amt">{fmtUSD(dueToday)}</span>
          </div>

          {selectedCare && (
            <div className="cfg-monthly">
              <span className="cfg-monthly-name">{selectedCare.name}</span>
              <span className="cfg-monthly-amt">
                {selectedCare.priceLabel}
                <small> first charge in {CARE_PLAN_TRIAL_DAYS} days, then monthly</small>
              </span>
            </div>
          )}

          {selectedCare && (
            <p className="cfg-care-clear">
              First 30 days included. Monthly billing starts after the trial. Cancel before the first
              monthly charge at no cost.
            </p>
          )}

          <button className="btn btn-block" onClick={checkout} disabled={submitting}>
            {submitting ? 'Starting secure checkout…' : `Continue to payment`}
          </button>

          {serverError && <p className="field-error cfg-server-err">{serverError}</p>}

          <ul className="cfg-assure">
            <li>Secure checkout via Stripe</li>
            <li>Design-first guarantee</li>
            <li>You own everything</li>
          </ul>

          <p className="cfg-reassure">
            After payment, you’ll receive a confirmation email and a short intake so we can collect
            your logo, business details, photos, and goals. We review your direction before building.
          </p>
        </div>
      </aside>

      <style>{css}</style>
    </div>
  );
}

const css = `
.cfg {
  display: grid;
  grid-template-columns: 1fr 22rem;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}
.cfg-main { display: grid; gap: 2.75rem; }
.cfg-block { display: grid; gap: 1.25rem; }
.cfg-block-head { display: grid; gap: 0.4rem; }
.cfg-block-head .opt, .opt-label {
  font: 400 0.7rem var(--font-mono); letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--mute); margin-left: 0.6em;
}
.cfg-pkgs, .cfg-addons, .cfg-care { display: grid; gap: 0.75rem; }
.cfg-pkg-body, .cfg-addon-body { display: grid; gap: 0.4rem; flex: 1; }
.cfg-pkg-top, .cfg-addon-top {
  display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;
}
.cfg-pkg-name { font: 600 1.05rem var(--font-display); display: flex; align-items: center; gap: 0.6rem; }
.cfg-pkg-price { font: 600 1.05rem var(--font-display); color: var(--accent); white-space: nowrap; }
.cfg-pkg-blurb { color: var(--mute); font-size: 0.9rem; }
.cfg-addon-top { font-size: 0.95rem; font-weight: 500; }
.cfg-addon-price { color: var(--accent); white-space: nowrap; font-variant-numeric: tabular-nums; }
.cfg-addon-desc { color: var(--mute); font-size: 0.86rem; }
.mini-badge {
  font: 600 0.6rem var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--btn-ink); background: var(--accent); padding: 0.25em 0.6em; border-radius: 999px;
}
.cfg-hint, .cfg-care-note { color: var(--mute); font-size: 0.9rem; }
.cfg-care-note { margin-top: -0.4rem; }
.cfg-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.cfg-span { grid-column: 1 / -1; }
.req { color: var(--accent); }

.cfg-summary { position: sticky; top: 5.5rem; }
.cfg-summary-card { padding: 1.5rem; display: grid; gap: 1.1rem; }
.cfg-lines { display: grid; gap: 0.6rem; }
.cfg-line { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.95rem; }
.cfg-line dd { color: var(--ink); font-variant-numeric: tabular-nums; }
.cfg-line-sub dt, .cfg-line-sub dd { color: var(--mute); font-size: 0.88rem; }
.cfg-total {
  display: flex; align-items: baseline; justify-content: space-between;
  padding-top: 1.1rem; border-top: 1px solid var(--line-strong);
}
.cfg-total span:first-child { font: 500 0.72rem var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--mute); display: flex; flex-direction: column; gap: 0.15rem; }
.cfg-total-sub { font: 400 0.62rem var(--font-mono); letter-spacing: 0.1em; opacity: 0.75; text-transform: none; }
.cfg-total-amt { font: 700 1.7rem var(--font-display); color: var(--ink); }
.cfg-monthly {
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  font-size: 0.86rem; color: var(--mute); padding: 0.7rem 0.85rem;
  background: var(--bg2); border: 1px solid var(--line); border-radius: 10px;
}
.cfg-monthly-name { font-weight: 500; color: var(--ink); }
.cfg-monthly-amt { text-align: right; display: flex; flex-direction: column; gap: 0.1rem; }
.cfg-monthly-amt small { opacity: 0.8; font-size: 0.72rem; }
.cfg-server-err { margin-top: -0.3rem; }
.cfg-assure { display: grid; gap: 0.5rem; }
.cfg-assure li { display: flex; gap: 0.6em; align-items: center; font-size: 0.82rem; color: var(--mute); }
.cfg-assure li::before {
  content: ''; width: 8px; height: 8px; border-radius: 50%;
  border: 1.4px solid var(--accent);
  background: radial-gradient(circle at 64% 36%, var(--accent) 0 1.4px, transparent 1.8px);
}
.cfg-care-clear {
  margin-top: -0.35rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg2);
  color: var(--mute);
  font-size: 0.78rem;
  line-height: 1.5;
}
.cfg-reassure {
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
  color: var(--mute);
  font-size: 0.8rem;
  line-height: 1.55;
}
@media (max-width: 920px) {
  .cfg { grid-template-columns: 1fr; }
  .cfg-summary { position: static; order: 3; }
}
@media (max-width: 520px) {
  .cfg-form { grid-template-columns: 1fr; }
}
`;
