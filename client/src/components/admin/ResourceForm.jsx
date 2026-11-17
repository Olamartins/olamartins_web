import { useState } from 'react';
import { api } from '../../api/client.js';
import { RESOURCE_TYPES, prettify } from '../../utils/format.js';

const EMPTY = {
  title: '',
  description: '',
  type: 'ebook',
  format: 'pdf',
  file_url: '',
  thumbnail: '',
  tags: '',
  published: true,
};

export default function ResourceForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY, ...initial, tags: (initial.tags || []).join(', ') } : EMPTY));
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
      type: form.type,
      format: form.format,
      file_url: form.file_url,
      thumbnail: form.thumbnail,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: form.published,
    };
    try {
      if (initial?.id) {
        await api.put(`/admin/resources/${initial.id}`, payload);
      } else {
        await api.post('/admin/resources', payload);
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
        <label className="label" htmlFor="r-title">Title *</label>
        <input id="r-title" className="input" required value={form.title} onChange={update('title')} />
      </div>
      <div>
        <label className="label" htmlFor="r-desc">Description</label>
        <textarea id="r-desc" className="input min-h-24 resize-y" value={form.description} onChange={update('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="r-type">Type *</label>
          <select id="r-type" className="input" value={form.type} onChange={update('type')}>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>{prettify(t)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="r-format">Format</label>
          <input id="r-format" className="input" value={form.format} onChange={update('format')} placeholder="pdf, mp4, link…" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="r-url">File / page URL</label>
        <input id="r-url" className="input" value={form.file_url} onChange={update('file_url')} placeholder="https://…" />
      </div>
      <div>
        <label className="label" htmlFor="r-thumb">Thumbnail URL</label>
        <input id="r-thumb" className="input" value={form.thumbnail} onChange={update('thumbnail')} placeholder="https://… (optional)" />
      </div>
      <div>
        <label className="label" htmlFor="r-tags">Tags (comma separated)</label>
        <input id="r-tags" className="input" value={form.tags} onChange={update('tags')} placeholder="power-bi, free, beginner" />
      </div>
      <label className="flex items-center gap-2.5 text-sm font-medium">
        <input type="checkbox" checked={form.published} onChange={update('published')} className="h-4 w-4 rounded accent-accent" />
        Published (visible to visitors)
      </label>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save resource'}</button>
      </div>
    </form>
  );
}
