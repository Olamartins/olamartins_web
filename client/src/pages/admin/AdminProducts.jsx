import { useEffect, useState } from 'react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { formatPrice, prettify } from '../../utils/format.js';

export default function AdminProducts() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const load = () =>
    api.get('/admin/products').then((d) => setItems(d.products)).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const remove = async () => {
    try {
      await api.del(`/admin/products/${confirmId}`);
      setConfirmId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (item, key) => {
    try {
      await api.put(`/admin/products/${item.id}`, { ...item, features: item.features || [], [key]: !item[key] });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Digital products sold via Selar — paste the Selar checkout link for each one.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing({})}>
          <Plus size={16} /> New product
        </button>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}
      {!items && <Spinner />}

      {items && items.length === 0 && (
        <div className="mt-8"><EmptyState title="No products yet" message="Add your first digital product." /></div>
      )}

      {items && items.length > 0 && (
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Product</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                  <td className="px-5 py-3.5">
                    <span className="font-medium">{p.title}</span>
                    {p.is_featured && <Star size={13} className="ml-2 inline text-accent dark:text-accent-dark" />}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">{prettify(p.category)}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggle(p, 'published')}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => setEditing(p)} aria-label="Edit" className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-accent dark:hover:bg-neutral-800 dark:hover:text-accent-dark">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => setConfirmId(p.id)} aria-label="Delete" className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
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

      <Modal open={editing !== null} title={editing?.id ? 'Edit product' : 'New product'} onClose={() => setEditing(null)} wide>
        <ProductForm
          initial={editing?.id ? editing : null}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <Modal open={confirmId !== null} title="Delete product?" onClose={() => setConfirmId(null)}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">This permanently removes the product from the shop.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
          <button type="button" className="btn-primary !bg-red-600 hover:!bg-red-700" onClick={remove}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
