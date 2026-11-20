import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/format.js';

const STATUSES = ['new', 'read', 'responded'];

export default function AdminMessages() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api.get('/admin/consultations').then((d) => setItems(d.consultations)).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/consultations/${id}`, { status });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.del(`/admin/consultations/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight">Consultation requests</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Messages sent through the "Get a Free Consultation" form.</p>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</p>}
      {!items && <Spinner />}

      {items && items.length === 0 && (
        <div className="mt-8"><EmptyState title="No messages yet" message="New consultation requests will appear here." /></div>
      )}

      {items && items.length > 0 && (
        <div className="mt-8 space-y-4">
          {items.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {m.first_name} {m.last_name}
                    <span className="ml-2 font-normal text-neutral-400">{formatDate(m.created_at)}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {m.email}
                    {m.phone ? (
                      <> · <a className="font-medium text-blue-700 hover:underline dark:text-blue-300" href={`tel:${m.phone}`}>{m.phone}</a></>
                    ) : m.code && m.zip_code ? ` · ${m.code} ${m.zip_code}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="input !w-auto !py-1.5 text-xs"
                    value={m.status}
                    onChange={(e) => setStatus(m.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    aria-label="Delete message"
                    className="rounded-lg p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
