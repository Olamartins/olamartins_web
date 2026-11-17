import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { RESOURCE_TYPES, prettify } from '../utils/format.js';

export default function Resources() {
  const [resources, setResources] = useState(null);
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (q) params.set('q', q);
    api
      .get(`/resources?${params.toString()}`)
      .then((d) => setResources(d.resources))
      .catch((err) => setError(err.message));
  }, [type, q]);

  return (
    <>
      <PageHero
        eyebrow="Learn with me"
        title="Resources"
        subtitle="Free ebooks, videos, guides and courses to help you master analytics and dashboard design — no sign-up required."
      />

      <section className="container-site pb-20">
        <Reveal className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              className="input !pl-11"
              placeholder="Search resources…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setType('')}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                !type ? 'bg-accent text-white dark:bg-accent-dark' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              All
            </button>
            {RESOURCE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType((cur) => (cur === t ? '' : t))}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  type === t
                    ? 'bg-accent text-white dark:bg-accent-dark'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {prettify(t)}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10">
          {error && <p className="py-16 text-center text-red-500">{error}</p>}
          {!error && resources === null && <Spinner />}
          {!error && resources !== null && resources.length === 0 && (
            <EmptyState title="No resources found" message="Try a different search or filter." />
          )}
          {!error && resources !== null && resources.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.07}>
                  <ResourceCard resource={r} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
