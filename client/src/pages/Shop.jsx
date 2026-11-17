import { useEffect, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { api } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { PRODUCT_CATEGORIES, prettify } from '../utils/format.js';

export default function Shop() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    api
      .get(`/products?${params.toString()}`)
      .then((d) => setProducts(d.products))
      .catch((err) => setError(err.message));
  }, [category, q]);

  return (
    <>
      <PageHero
        eyebrow="Digital products"
        title="Shop"
        subtitle="Ready-made Power BI, Excel and Tableau templates plus ebooks — checkout is handled securely on Selar."
      />

      <section className="container-site pb-20">
        <Reveal className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              className="input !pl-11"
              placeholder="Search templates…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                !category ? 'bg-accent text-white dark:bg-accent-dark' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              All
            </button>
            {PRODUCT_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory((cur) => (cur === c ? '' : c))}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  category === c
                    ? 'bg-accent text-white dark:bg-accent-dark'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {prettify(c)}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10">
          {error && <p className="py-16 text-center text-red-500">{error}</p>}
          {!error && products === null && <Spinner />}
          {!error && products !== null && products.length === 0 && (
            <EmptyState title="No products found" message="Try a different search or category." />
          )}
          {!error && products !== null && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.07}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Reveal className="mt-12 flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <ShieldCheck size={16} className="text-accent dark:text-accent-dark" />
          Payments and delivery are processed securely by{' '}
          <a href="https://selar.co" target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline dark:text-accent-dark">
            Selar (selar.co)
          </a>
        </Reveal>
      </section>
    </>
  );
}
