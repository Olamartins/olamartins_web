import { useEffect, useState } from 'react';
import { CheckCircle2, ImagePlus } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';
import { ArrayEditor, StringListEditor } from '../../components/admin/ArrayEditor.jsx';

const ICON_OPTIONS = ['BarChart3', 'LineChart', 'Database', 'PenTool', 'Rocket', 'Target', 'Cpu', 'Zap'];

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [arrays, setArrays] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    api.get('/admin/settings').then((d) => {
      const s = d.settings;
      setForm({
        siteName: s.siteName || '',
        tagline: s.tagline || '',
        logoUrl: s.branding?.logoUrl || '',
        profileImage: s.branding?.profileImage || '',
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
        contactWhatsapp: s.contact?.whatsapp || '',
        linkedin: s.socials?.linkedin || '',
        twitter: s.socials?.twitter || '',
        medium: s.socials?.medium || '',
      });
      setArrays({
        services: s.services || [],
        stats: s.stats || [],
        highlights: s.highlights || [],
        experience: s.experience || [],
        certifications: s.certifications || [],
        tools: s.tools || [],
      });
    }).catch((err) => setStatus({ type: 'error', message: err.message }));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setHero = (key) => (e) => setForm((f) => ({ ...f, hero: { ...f.hero, [key]: e.target.value } }));
  const setArr = (key) => (val) => setArrays((a) => ({ ...a, [key]: val }));

  const insertImageIntoAbout = (url) => {
    if (!url) return;
    setForm((f) => ({ ...f, aboutBody: `${f.aboutBody}\n\n![image](${url})`.trim() }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });
    const cleanLines = (arr) => arr.map((s) => String(s).trim()).filter(Boolean);
    const payload = {
      siteName: form.siteName,
      tagline: form.tagline,
      branding: { logoUrl: form.logoUrl, profileImage: form.profileImage },
      hero: {
        eyebrow: form.hero.eyebrow,
        title: form.hero.title,
        subtitle: form.hero.subtitle,
        primaryCta: { label: form.hero.primaryLabel, href: form.hero.primaryHref || '/contact' },
        secondaryCta: { label: form.hero.secondaryLabel, href: form.hero.secondaryHref || '/shop' },
      },
      services: arrays.services,
      stats: arrays.stats,
      highlights: arrays.highlights,
      experience: arrays.experience.map((j) => ({ ...j, points: cleanLines(j.points || []) })),
      certifications: cleanLines(arrays.certifications),
      tools: cleanLines(arrays.tools),
      about: {
        heading: form.aboutHeading,
        subheading: form.aboutSubheading,
        body: form.aboutBody.split('\n\n').map((p) => p.trim()).filter(Boolean),
      },
      mission: form.mission,
      vision: form.vision,
      contact: { phone: form.contactPhone, email: form.contactEmail, address: form.contactAddress, whatsapp: form.contactWhatsapp },
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

  if (!form || !arrays) return <Spinner label="Loading settings…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Site settings</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Edit everything visually — text, images, lists — no JSON needed. Changes go live immediately.
      </p>

      <form onSubmit={submit} className="card mt-8 space-y-8 p-6 sm:p-8">
        <section>
          <h2 className="label">Branding</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <ImageUpload label="Site logo (navbar & footer)" value={form.logoUrl} onChange={(v) => setForm((f) => ({ ...f, logoUrl: v }))} />
            <ImageUpload label="Profile photo (About page)" value={form.profileImage} onChange={(v) => setForm((f) => ({ ...f, profileImage: v }))} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <label className="label">Title (split on "." — the rest becomes the gradient line)</label>
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
                <label className="label">Primary button link (internal path or full https:// URL)</label>
                <input className="input" value={form.hero.primaryHref} onChange={setHero('primaryHref')} placeholder="/contact or https://calendly.com/…" />
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
          <h2 className="label">About page</h2>
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
              <label className="label">Bio text (paragraphs separated by a blank line)</label>
              <textarea className="input min-h-32 resize-y" value={form.aboutBody} onChange={set('aboutBody')} />
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Insert an image into the bio:</span>
                <ImageUpload value="" onChange={insertImageIntoAbout} />
                <ImagePlus size={0} className="hidden" />
              </div>
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
              <label className="label">WhatsApp number (with country code, e.g. +23412345678)</label>
              <input className="input" value={form.contactWhatsapp} onChange={set('contactWhatsapp')} placeholder="+23412345678" />
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

        <section className="space-y-6">
          <h2 className="label">Home & about content lists</h2>
          <ArrayEditor
            label="Services (home)"
            value={arrays.services}
            onChange={setArr('services')}
            addLabel="Add service"
            fields={[
              { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
          <ArrayEditor
            label="Stats (home / about)"
            value={arrays.stats}
            onChange={setArr('stats')}
            addLabel="Add stat"
            fields={[
              { key: 'value', label: 'Value (e.g. 9+, 45%)', type: 'text' },
              { key: 'label', label: 'Label', type: 'text' },
            ]}
          />
          <ArrayEditor
            label="Selected results / highlights (home)"
            value={arrays.highlights}
            onChange={setArr('highlights')}
            addLabel="Add highlight"
            fields={[
              { key: 'metric', label: 'Metric (e.g. +45%)', type: 'text' },
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'tag', label: 'Tag (e.g. company)', type: 'text' },
            ]}
          />
          <ArrayEditor
            label="Experience timeline (about)"
            value={arrays.experience}
            onChange={setArr('experience')}
            addLabel="Add role"
            fields={[
              { key: 'role', label: 'Role', type: 'text' },
              { key: 'company', label: 'Company', type: 'text' },
              { key: 'period', label: 'Period (e.g. Jul 2022 – Present)', type: 'text' },
              { key: 'points', label: 'Achievements (one per line)', type: 'lines' },
            ]}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <StringListEditor label="Certifications (about)" value={arrays.certifications} onChange={setArr('certifications')} addLabel="Add certification" />
            <StringListEditor label="Tools / skills chips (about)" value={arrays.tools} onChange={setArr('tools')} addLabel="Add tool" />
          </div>
        </section>

        {status.type && (
          <p
            className={`flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-medium ${
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
