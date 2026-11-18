import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';

// Edits the public site content: brand, hero, about, contact/socials, plus
// the structured arrays (services, stats, highlights, experience,
// certifications, tools) as validated JSON.
const JSON_FIELDS = [
  { key: 'services', label: 'Services', hint: '[{"icon","title","description"}] — icon names: BarChart3, LineChart, Database, PenTool, Rocket, Target, Cpu, Zap' },
  { key: 'stats', label: 'Stats', hint: '[{"value","label"}]' },
  { key: 'highlights', label: 'Highlights (home)', hint: '[{"metric","title","description","tag"}]' },
  { key: 'experience', label: 'Experience (about)', hint: '[{"role","company","period","points":["…"]}]' },
  { key: 'certifications', label: 'Certifications', hint: '["…"]' },
  { key: 'tools', label: 'Tools / skills chips', hint: '["Power BI", "DAX", …]' },
];

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [json, setJson] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    api.get('/admin/settings').then((d) => {
      const s = d.settings;
      setForm({
        siteName: s.siteName || '',
        tagline: s.tagline || '',
        hero: {
          eyebrow: s.hero?.eyebrow || '',
          title: s.hero?.title || '',
          subtitle: s.hero?.subtitle || '',
          primaryLabel: s.hero?.primaryCta?.label || '',
          primaryHref: s.hero?.primaryCta?.href || '',
          secondaryLabel: s.hero?.secondaryCta?.label || '',
          secondaryHref: s.hero?.secondaryCta?.href || '',
        },
        aboutHeading: s.about?.heading || '',
        aboutSubheading: s.about?.subheading || '',
        aboutBody: (s.about?.body || []).join('\n\n'),
        mission: s.mission || '',
        vision: s.vision || '',
        contactPhone: s.contact?.phone || '',
        contactEmail: s.contact?.email || '',
        contactAddress: s.contact?.address || '',
        linkedin: s.socials?.linkedin || '',
        twitter: s.socials?.twitter || '',
        medium: s.socials?.medium || '',
      });
      const next = {};
      for (const f of JSON_FIELDS) next[f.key] = JSON.stringify(s[f.key] || [], null, 2);
      setJson(next);
    }).catch((err) => setStatus({ type: 'error', message: err.message }));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setHero = (key) => (e) => setForm((f) => ({ ...f, hero: { ...f.hero, [key]: e.target.value } }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });
    const parsed = {};
    for (const f of JSON_FIELDS) {
      try {
        parsed[f.key] = JSON.parse(json[f.key] || '[]');
        if (!Array.isArray(parsed[f.key])) throw new Error('not an array');
      } catch {
        setStatus({ type: 'error', message: `${f.label} must be a valid JSON array.` });
        setSaving(false);
        return;
      }
    }
    const payload = {
      siteName: form.siteName,
      tagline: form.tagline,
      hero: {
        eyebrow: form.hero.eyebrow,
        title: form.hero.title,
        subtitle: form.hero.subtitle,
        primaryCta: { label: form.hero.primaryLabel, href: form.hero.primaryHref || '/contact' },
        secondaryCta: { label: form.hero.secondaryLabel, href: form.hero.secondaryHref || '/shop' },
      },
      ...parsed,
      about: {
        heading: form.aboutHeading,
        subheading: form.aboutSubheading,
        body: form.aboutBody.split('\n\n').map((p) => p.trim()).filter(Boolean),
      },
      mission: form.mission,
      vision: form.vision,
      contact: { phone: form.contactPhone, email: form.contactEmail, address: form.contactAddress },
      socials: { linkedin: form.linkedin, twitter: form.twitter, medium: form.medium },
    };
    try {
      await api.put('/admin/settings', payload);
      setStatus({ type: 'success', message: 'Settings saved. Changes are live on the site.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Spinner label="Loading settings…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Site settings</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Edit the public hero, about, experience, contact details and social links.</p>

      <form onSubmit={submit} className="card mt-8 space-y-6 p-6 sm:p-8">
        <section>
          <h2 className="label">Brand</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Site name</label>
              <input className="input" value={form.siteName} onChange={set('siteName')} />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={form.tagline} onChange={set('tagline')} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="label">Hero (home page)</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label className="label">Eyebrow</label>
              <input className="input" value={form.hero.eyebrow} onChange={setHero('eyebrow')} />
            </div>
            <div>
              <label className="label">Title (split on "." for the gradient line)</label>
              <input className="input" value={form.hero.title} onChange={setHero('title')} />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <textarea className="input min-h-20 resize-y" value={form.hero.subtitle} onChange={setHero('subtitle')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Primary button label</label>
                <input className="input" value={form.hero.primaryLabel} onChange={setHero('primaryLabel')} />
              </div>
              <div>
                <label className="label">Primary button link</label>
                <input className="input" value={form.hero.primaryHref} onChange={setHero('primaryHref')} placeholder="/contact" />
              </div>
              <div>
                <label className="label">Secondary button label</label>
                <input className="input" value={form.hero.secondaryLabel} onChange={setHero('secondaryLabel')} />
              </div>
              <div>
                <label className="label">Secondary button link</label>
                <input className="input" value={form.hero.secondaryHref} onChange={setHero('secondaryHref')} placeholder="/shop" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="label">About</h2>
          <div className="mt-3 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Heading</label>
                <input className="input" value={form.aboutHeading} onChange={set('aboutHeading')} />
              </div>
              <div>
                <label className="label">Subheading</label>
                <input className="input" value={form.aboutSubheading} onChange={set('aboutSubheading')} />
              </div>
            </div>
            <div>
              <label className="label">Body (paragraphs separated by a blank line)</label>
              <textarea className="input min-h-32 resize-y" value={form.aboutBody} onChange={set('aboutBody')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Mission</label>
                <textarea className="input min-h-20 resize-y" value={form.mission} onChange={set('mission')} />
              </div>
              <div>
                <label className="label">Vision</label>
                <textarea className="input min-h-20 resize-y" value={form.vision} onChange={set('vision')} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="label">Contact & socials</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.contactPhone} onChange={set('contactPhone')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.contactEmail} onChange={set('contactEmail')} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.contactAddress} onChange={set('contactAddress')} />
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" value={form.linkedin} onChange={set('linkedin')} placeholder="https://…" />
            </div>
            <div>
              <label className="label">X / Twitter URL</label>
              <input className="input" value={form.twitter} onChange={set('twitter')} placeholder="https://…" />
            </div>
            <div>
              <label className="label">Medium URL</label>
              <input className="input" value={form.medium} onChange={set('medium')} placeholder="https://…" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="label">Structured content (JSON arrays)</h2>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {JSON_FIELDS.map((f) => (
              <div key={f.key} className={f.key === 'experience' ? 'lg:col-span-2' : ''}>
                <label className="label">{f.label} — {f.hint}</label>
                <textarea
                  className="input min-h-32 resize-y font-mono text-xs"
                  value={json[f.key] || ''}
                  onChange={(e) => setJson((j) => ({ ...j, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </section>

        {status.type && (
          <p
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            {status.type === 'success' && <CheckCircle2 size={16} />}
            {status.message}
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
        </div>
      </form>
    </div>
  );
}
