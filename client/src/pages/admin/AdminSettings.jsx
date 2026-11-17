import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';

// Edits the public site content: hero, about, mission/vision, contact, socials.
// services/stats stay as JSON (editable here too, carefully).
export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [servicesJson, setServicesJson] = useState('');
  const [statsJson, setStatsJson] = useState('');
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
      setServicesJson(JSON.stringify(s.services || [], null, 2));
      setStatsJson(JSON.stringify(s.stats || [], null, 2));
    }).catch((err) => setStatus({ type: 'error', message: err.message }));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setHero = (key) => (e) => setForm((f) => ({ ...f, hero: { ...f.hero, [key]: e.target.value } }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });
    let services;
    let stats;
    try {
      services = JSON.parse(servicesJson || '[]');
      stats = JSON.parse(statsJson || '[]');
      if (!Array.isArray(services) || !Array.isArray(stats)) throw new Error('Services and stats must be JSON arrays');
    } catch {
      setStatus({ type: 'error', message: 'Services / stats must be valid JSON arrays.' });
      setSaving(false);
      return;
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
      stats,
      services,
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
      <h1 className="text-3xl font-bold tracking-tight">Site settings</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Edit the public hero, about, contact details and social links.</p>

      <form onSubmit={submit} className="card mt-8 space-y-6 p-6 sm:p-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Brand</h2>
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
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Hero (home page)</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label className="label">Eyebrow</label>
              <input className="input" value={form.hero.eyebrow} onChange={setHero('eyebrow')} />
            </div>
            <div>
              <label className="label">Title</label>
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
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">About</h2>
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
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Contact & socials</h2>
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
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Services & stats (JSON)</h2>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="label">Services array — [{`{"icon","title","description"}`}]</label>
              <textarea className="input min-h-40 resize-y font-mono text-xs" value={servicesJson} onChange={(e) => setServicesJson(e.target.value)} />
            </div>
            <div>
              <label className="label">Stats array — [{`{"value","label"}`}]</label>
              <textarea className="input min-h-40 resize-y font-mono text-xs" value={statsJson} onChange={(e) => setStatsJson(e.target.value)} />
            </div>
          </div>
        </section>

        {status.type && (
          <p
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              status.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
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
