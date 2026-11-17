import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '../api/client.js';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import PostCard from '../components/PostCard.jsx';
import ConsultationForm from '../components/ConsultationForm.jsx';
import Spinner from '../components/Spinner.jsx';

// Decorative "dashboard" mock in the hero, pure CSS + framer-motion
function DashboardMock() {
  const bars = [42, 68, 55, 84, 62, 92, 74];
  return (
    <div className="card relative overflow-hidden p-5 shadow-soft">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-medium text-neutral-400">analytics / overview</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {['Revenue', 'Churn', 'NPS'].map((kpi) => (
          <div key={kpi} className="rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-800">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{kpi}</p>
            <p className="mt-1 text-sm font-bold">—</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-32 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-accent dark:bg-accent-dark' : 'bg-neutral-200 dark:bg-neutral-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/site'),
      api.get('/products?featured=true'),
      api.get('/resources?limit=3'),
      api.get('/posts?limit=3'),
    ])
      .then(([site, products, resources, posts]) =>
        setData({
          settings: site.settings,
          products: products.products,
          resources: resources.resources,
          posts: posts.posts,
        })
      )
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="container-site py-24 text-center text-red-500">{error}</div>;
  if (!data) return <Spinner label="Loading…" />;

  const { settings, products, resources, posts } = data;
  const hero = settings.hero || {};

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 w-[42rem] rounded-full bg-accent/15 blur-3xl dark:bg-accent-dark/15" />
        <div className="container-site grid items-center gap-12 pb-20 pt-16 sm:pt-24 lg:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-widest text-accent dark:text-accent-dark"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            >
              {hero.title?.split('.')[0]}.
              <span className="block bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                {hero.title?.split('.').slice(1).join('.').trim() || ''}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 dark:text-neutral-400"
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to={hero.primaryCta?.href || '/contact'} className="btn-primary">
                {hero.primaryCta?.label || 'Get in touch'} <ArrowRight size={16} />
              </Link>
              <Link to={hero.secondaryCta?.href || '/shop'} className="btn-secondary">
                {hero.secondaryCta?.label || 'Browse the shop'}
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {settings.stats?.length > 0 && (
        <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="container-site grid gap-8 py-10 sm:grid-cols-3">
            {settings.stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08} className="text-center">
                <p className="text-4xl font-bold tracking-tight text-accent dark:text-accent-dark">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {settings.services?.length > 0 && (
        <section className="container-site py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Consulting Services</h2>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              I don't just build reports and dashboards; I architect intelligent solutions that illuminate pathways to growth.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {settings.services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="card p-7 transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  <Icon name={s.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{s.description}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="container-site py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Templates</h2>
                <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">
                  Production-ready Power BI, Excel and Tableau templates — delivered instantly via Selar.
                </p>
              </div>
              <Link to="/shop" className="btn-secondary">
                View all products <ArrowRight size={15} />
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Free resources */}
      {resources.length > 0 && (
        <section className="container-site py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Resources</h2>
              <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">
                Ebooks, videos and guides to level up your analytics skills — free for every visitor.
              </p>
            </div>
            <Link to="/resources" className="btn-secondary">
              Browse resources <ArrowRight size={15} />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <ResourceCard resource={r} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Latest articles */}
      {posts.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="container-site py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Articles</h2>
                <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">
                  Practical writing on analytics, dashboards and data storytelling.
                </p>
              </div>
              <Link to="/articles" className="btn-secondary">
                All articles <ArrowRight size={15} />
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Consultation CTA */}
      <section id="contact" className="container-site py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start Your Data Journey</h2>
            <p className="mt-4 max-w-lg text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              In today's digital landscape, data is abundant, but insight is rare. Tell me about your project and get a
              free consultation — no strings attached.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ConsultationForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
