import { useState } from 'react';
import { api } from '../../api/client.js';
import { PRODUCT_CATEGORIES, prettify } from '../../utils/format.js';

const EMPTY = {
  title: '',
  description: '',
  category: 'power-bi',
  price: '29',
  currency: 'USD',
  selar_url: '',
  thumbnail: '',
  features: '',
  is_featured: false,
  published: true,
};

export default function ProductForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...EMPTY, ...initial, price: String(initial.price ?? ''), features: (initial.features || []).join('\n') }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price) || 0,
      currency: form.currency,
      selar_url: form.selar_url,
      thumbnail: form.thumbnail,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      is_featured: form.is_featured,
      published: form.published,
    };
    try {
      if (initial?.id) {
        await api.put(`/admin/products/${initial.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="p-title">Title *</label>
        <input id="p-title" className="input" required value={form.title} onChange={update('title')} />
      </div>
      <div>
        <label className="label" htmlFor="p-desc">Description</label>
        <textarea id="p-desc" className="input min-h-24 resize-y" value={form.description} onChange={update('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="p-cat">Category *</label>
          <select id="p-cat" className="input" value={form.category} onChange={update('category')}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{prettify(c)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="p-price">Price *</label>
          <input id="p-price" className="input" type="number" min="0" step="0.01" required value={form.price} onChange={update('price')} />
        </div>
        <div>
          <label className="label" htmlFor="p-cur">Currency</label>
          <input id="p-cur" className="input" value={form.currency} onChange={update('currency')} maxLength={3} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="p-selar">Selar checkout URL *</label>
        <input id="p-selar" className="input" required value={form.selar_url} onChange={update('selar_url')} placeholder="https://selar.co/…" />
      </div>
      <div>
        <label className="label" htmlFor="p-thumb">Thumbnail URL</label>
        <input id="p-thumb" className="input" value={form.thumbnail} onChange={update('thumbnail')} placeholder="https://… (optional)" />
      </div>
      <div>
        <label className="label" htmlFor="p-feat">Features (one per line)</label>
        <textarea id="p-feat" className="input min-h-24 resize-y" value={form.features} onChange={update('features')} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input type="checkbox" checked={form.published} onChange={update('published')} className="h-4 w-4 rounded accent-accent" />
          Published
        </label>
        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input type="checkbox" checked={form.is_featured} onChange={update('is_featured')} className="h-4 w-4 rounded accent-accent" />
          Featured on home page
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
      </div>
    </form>
  );
}
