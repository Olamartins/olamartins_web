import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ResourceForm from '../../components/admin/ResourceForm.jsx';
import { prettify } from '../../utils/format.js';

export default function AdminResources() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, object = edit
  const [confirmId, setConfirmId] = useState(null);

  const load = () =>
    api.get('/admin/resources').then((d) => setItems(d.resources)).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const remove = async () => {
    try {
      await api.del(`/admin/resources/${confirmId}`);
      setConfirmId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePublished = async (item) => {
    try {
      await api.put(`/admin/resources/${item.id}`, { ...item, tags: item.tags || [], published: !item.published });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Free ebooks, videos and guides for your visitors.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing({})}>
          <Plus size={16} /> New resource
        </button>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}
      {!items && <Spinner />}

      {items && items.length === 0 && (
        <div className="mt-8"><EmptyState title="No resources yet" message="Add your first free resource." /></div>
      )}

      {items && items.length > 0 && (
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Title</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                  <td className="px-5 py-3.5 font-medium">{r.title}</td>
                  <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">{prettify(r.type)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => togglePublished(r)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {r.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => setEditing(r)} aria-label="Edit" className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-accent dark:hover:bg-neutral-800 dark:hover:text-accent-dark">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => setConfirmId(r.id)} aria-label="Delete" className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editing !== null} title={editing?.id ? 'Edit resource' : 'New resource'} onClose={() => setEditing(null)}>
        <ResourceForm
          initial={editing?.id ? editing : null}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <Modal open={confirmId !== null} title="Delete resource?" onClose={() => setConfirmId(null)}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">This permanently removes the resource from the site.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
          <button type="button" className="btn-primary !bg-red-600 hover:!bg-red-700" onClick={remove}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
