import { useState } from 'react';
import { api } from '../../api/client.js';

const EMPTY = { title: '', excerpt: '', content: '', cover_image: '', published: true };

export default function PostForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY, ...initial } : EMPTY));
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
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image,
      published: form.published,
    };
    try {
      if (initial?.id) {
        await api.put(`/admin/posts/${initial.id}`, payload);
      } else {
        await api.post('/admin/posts', payload);
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
        <label className="label" htmlFor="a-title">Title *</label>
        <input id="a-title" className="input" required value={form.title} onChange={update('title')} />
      </div>
      <div>
        <label className="label" htmlFor="a-excerpt">Excerpt</label>
        <input id="a-excerpt" className="input" value={form.excerpt} onChange={update('excerpt')} placeholder="One-sentence summary" />
      </div>
      <div>
        <label className="label" htmlFor="a-cover">Cover image URL</label>
        <input id="a-cover" className="input" value={form.cover_image} onChange={update('cover_image')} placeholder="https://… (optional)" />
      </div>
      <div>
        <label className="label" htmlFor="a-content">Content * (supports # headings, ## subheadings, - bullets, **bold**)</label>
        <textarea id="a-content" className="input min-h-72 resize-y font-mono text-[13px]" required value={form.content} onChange={update('content')} />
      </div>
      <label className="flex items-center gap-2.5 text-sm font-medium">
        <input type="checkbox" checked={form.published} onChange={update('published')} className="h-4 w-4 rounded accent-accent" />
        Published (visible to visitors)
      </label>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save article'}</button>
      </div>
    </form>
  );
}
