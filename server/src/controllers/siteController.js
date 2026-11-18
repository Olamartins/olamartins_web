import { query } from '../config/db.js';

// Fallbacks so the public site always renders, even before the admin saves settings
const DEFAULT_SETTINGS = {
  siteName: 'Ola Martins',
  tagline: 'Business Intelligence Consultant',
  hero: {
    eyebrow: "I'm Martins — Business Intelligence Consultant",
    title: 'Clarity from Complexity.',
    subtitle: 'I bridge the gap between raw data and transformative business strategy.',
    primaryCta: { label: 'Start Your Data Journey', href: '/contact' },
    secondaryCta: { label: 'Browse the Shop', href: '/shop' },
  },
  stats: [],
  services: [],
  highlights: [],
  experience: [],
  certifications: [],
  tools: [],
  about: { heading: '', subheading: '', body: [] },
  mission: '',
  vision: '',
  contact: { phone: '', email: '', address: '' },
  socials: { linkedin: '', twitter: '', medium: '' },
};

export async function getSite(req, res, next) {
  try {
    const { rows } = await query('SELECT data FROM site_settings WHERE id = 1');
    const stored = rows[0]?.data || {};
    res.json({ settings: { ...DEFAULT_SETTINGS, ...stored } });
  } catch (err) {
    next(err);
  }
}

// Admin-only: replace the whole settings document
export async function updateSite(req, res, next) {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ message: 'Settings must be a JSON object' });
    }
    await query(
      `INSERT INTO site_settings (id, data, updated_at) VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [JSON.stringify(data)]
    );
    res.json({ settings: data });
  } catch (err) {
    next(err);
  }
}
