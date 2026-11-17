import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessagesSquare, Newspaper, Package, Plus } from 'lucide-react';
import { api } from '../../api/client.js';
import Spinner from '../../components/Spinner.jsx';
import { formatDate } from '../../utils/format.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/consultations')])
      .then(([s, m]) => {
        setStats(s.stats);
        setMessages(m.consultations.slice(0, 5));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="py-16 text-center text-red-500">{error}</p>;
  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Published articles', value: stats.posts, icon: Newspaper, to: '/admin/articles' },
    { label: 'Free resources', value: stats.resources, icon: BookOpen, to: '/admin/resources' },
    { label: 'Shop products', value: stats.products, icon: Package, to: '/admin/products' },
    { label: 'New messages', value: stats.newMessages, icon: MessagesSquare, to: '/admin/messages' },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Manage everything on the site from here — visitors never need an account.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
              <c.icon size={19} />
            </span>
            <p className="mt-3 text-3xl font-bold tracking-tight">{c.value}</p>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Latest consultation requests</h2>
            <Link to="/admin/messages" className="text-sm font-semibold text-accent hover:underline dark:text-accent-dark">
              View all
            </Link>
          </div>
          {messages.length === 0 ? (
            <p className="py-8 text-sm text-neutral-500 dark:text-neutral-400">No messages yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {messages.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {m.first_name} {m.last_name} <span className="font-normal text-neutral-400">· {m.email}</span>
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">{m.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">{formatDate(m.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link to="/admin/resources" className="btn-secondary w-full !justify-start"><Plus size={15} /> Add a free resource</Link>
            <Link to="/admin/products" className="btn-secondary w-full !justify-start"><Plus size={15} /> Add a shop product</Link>
            <Link to="/admin/articles" className="btn-secondary w-full !justify-start"><Plus size={15} /> Write an article</Link>
            <Link to="/admin/settings" className="btn-secondary w-full !justify-start"><Plus size={15} /> Edit site settings</Link>
          </div>
          <p className="mt-5 rounded-xl bg-neutral-100 p-3.5 text-xs leading-5 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            Tip: products are sold through Selar — paste each product's Selar checkout link when adding it.
          </p>
        </div>
      </div>
    </div>
  );
}
