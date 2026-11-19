import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarPlus, ChevronDown, ShoppingBag } from 'lucide-react';
import { api } from '../api/client.js';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import PostCard from '../components/PostCard.jsx';
import ConsultationForm from '../components/ConsultationForm.jsx';
import Spinner from '../components/Spinner.jsx';

const INDUSTRIES = ['Oil & Gas', 'Retail', 'E-commerce', 'Healthcare', 'Non-profit', 'Finance', 'Telecom', 'Logistics'];

const FAQS = [
  {
    q: 'What do you actually do?',
    a: 'I design and deliver enterprise BI solutions: semantic models, DAX measures, KPI dashboards and ETL pipelines backed by data warehouses — plus process automation and training for teams.',
  },
  {
    q: 'Which tools do you work with?',
    a: 'Power BI, DAX, Microsoft Fabric, Tableau, SQL, Excel & Power Query, Python, Azure, SharePoint and more. I am a Microsoft Certified Power BI Data Analyst and Fabric Analytics Engineer.',
  },
  {
    q: 'How much does a dashboard project cost?',
    a: 'Every engagement is scoped in writing before work starts — no hourly billing. Book a free consultation and you get a fixed plan within 24 hours. Ready-made templates in the shop are fixed-price and delivered instantly via Selar.',
  },
  {
    q: 'Do you work remotely?',
    a: 'Yes. I am based in Port Harcourt, Nigeria and work with teams across Africa, the US and Europe — with a live review every week.',
  },
  {
    q: 'Can I get free learning materials?',
    a: 'Yes — the Resources page has free ebooks, videos and guides on Power BI, Excel, SQL, Tableau and dashboard design. No sign-up needed.',
  },
  {
    q: 'How do I buy a template from the shop?',
    a: 'Pick a product, click "Buy on Selar" and you are taken to a secure Selar checkout. After payment you get instant access to the files.',
  },
  {
    q: 'How do we start?',
    a: 'Send the consultation form on the Contact page. I reply within one business day with next steps and a free 30-minute call if it fits.',
  },
];

function DashboardMock() {
  const bars = [42, 68, 55, 84, 62, 92, 74];
  return (
    <div className="relative">
      <div className="card !border-blue-900/40 !bg-navy-950/90 p-5 shadow-glow dark:!bg-navy-950">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 font-mono text-[11px] text-blue-300/60">analytics / overview</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['Revenue', 'Churn', 'NPS'].map((kpi) => (
            <div key={kpi} className="rounded-xl border border-white/5 bg-white/5 p-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blue-300/60">{kpi}</p>
              <p className="mt-1 font-display text-sm font-bold text-white">—</p>
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
              className={`flex-1 rounded-t-lg ${
                i === 5 ? 'bg-gradient-to-t from-blue-700 to-sky-400' : 'bg-blue-500/25'
              }`}
            />
          ))}
        </div>
      </div>

      {[
        { label: '+45% data availability', className: '-left-4 top-10 sm:-left-8' },
        { label: '−30% manual processing', className: '-right-3 top-1/2 sm:-right-6' },
        { label: '120+ dashboards shipped', className: '-bottom-4 left-8' },
      ].map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{ duration: 3.2 + i, delay: 0.9 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
          className={`glass absolute hidden rounded-xl px-3.5 py-2 font-mono text-[11px] font-semibold text-blue-700 shadow-soft dark:text-blue-200 sm:block ${chip.className}`}
        >
          {chip.label}
        </motion.div>
      ))}
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[15px] font-bold tracking-tight">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-6 text-sm leading-7 text-neutral-500 dark:text-neutral-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

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
  const titleParts = String(hero.title || 'Clarity from complexity.').split('.');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid-blue pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-[30rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-[24rem] rounded-full bg-sky-400/20 blur-3xl" />

        <div className="container-site relative grid items-center gap-14 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 dark:border-blue-800/60 dark:bg-blue-500/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">
                Available for new BI projects
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="eyebrow mt-6"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-4 font-display text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]"
            >
              {titleParts[0]}.
              <span className="text-gradient-blue block">{titleParts.slice(1).join('.').trim() || ''}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-6 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400"
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.26 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              {(() => {
                const cta = hero.primaryCta || { label: 'Book a free consultation', href: '/contact' };
                const inner = (
                  <>
                    <CalendarPlus size={16} /> {cta.label}
                  </>
                );
                return cta.href?.startsWith('http') ? (
                  <a href={cta.href} target="_blank" rel="noreferrer" className="btn-primary">{inner}</a>
                ) : (
                  <Link to={cta.href || '/contact'} className="btn-primary">{inner}</Link>
                );
              })()}
              {(() => {
                const cta = hero.secondaryCta || { label: 'Browse the shop', href: '/shop' };
                const inner = (
                  <>
                    <ShoppingBag size={16} /> {cta.label}
                  </>
                );
                return cta.href?.startsWith('http') ? (
                  <a href={cta.href} target="_blank" rel="noreferrer" className="btn-secondary">{inner}</a>
                ) : (
                  <Link to={cta.href || '/shop'} className="btn-secondary">{inner}</Link>
                );
              })()}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* Industries marquee */}
      <section className="overflow-hidden border-y border-blue-100 bg-white/60 py-5 dark:border-blue-900/40 dark:bg-navy-950/60">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
          className="flex w-max items-center gap-10"
        >
          {[...INDUSTRIES, ...INDUSTRIES].map((item, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-blue-300/50">
              {item} <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50" />
            </span>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      {settings.stats?.length > 0 && (
        <section className="container-site grid gap-8 py-20 sm:grid-cols-2 lg:grid-cols-4">
          {settings.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.07} className="card p-6 text-center hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700">
              <p className="text-gradient-blue font-display text-4xl font-extrabold tracking-tight sm:text-[2.6rem]">{s.value}</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{s.label}</p>
            </Reveal>
          ))}
        </section>
      )}

      {/* Highlights / selected results */}
      {settings.highlights?.length > 0 && (
        <section className="container-site pb-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Selected results</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Work that moved the numbers</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {settings.highlights.map((h, i) => (
              <Reveal key={i} delay={i * 0.08} className="card group relative overflow-hidden p-7 hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />
                <p className="text-gradient-blue font-display text-4xl font-extrabold tracking-tight">{h.metric}</p>
                <h3 className="mt-3 font-display text-base font-bold tracking-tight">{h.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{h.description}</p>
                {h.tag && <span className="badge mt-4">{h.tag}</span>}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {settings.services?.length > 0 && (
        <section className="border-y border-blue-100 bg-white/60 py-20 dark:border-blue-900/40 dark:bg-navy-950/60">
          <div className="container-site">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">What I do</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Four ways I turn data into decisions</h2>
              <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                I don't just build reports — I architect analytics solutions that leadership actually uses.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {settings.services.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.07} className="card group p-7 hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/25">
                      <Icon name={s.icon} />
                    </span>
                    <span className="font-mono text-xs font-semibold text-blue-600/50 dark:text-blue-400/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{s.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="container-site py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Featured templates</h2>
              <p className="mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
                Production-ready Power BI, Excel and Tableau templates — fixed price, instant delivery via Selar.
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
        </section>
      )}

      {/* Free resources */}
      {resources.length > 0 && (
        <section className="border-y border-blue-100 bg-white/60 py-20 dark:border-blue-900/40 dark:bg-navy-950/60">
          <div className="container-site">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Free resources</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Learn analytics, free</h2>
                <p className="mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
                  Ebooks, videos and guides — no sign-up required.
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
          </div>
        </section>
      )}

      {/* Latest articles */}
      {posts.length > 0 && (
        <section className="container-site py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Writing</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Latest articles</h2>
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
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-blue-100 bg-white/60 py-20 dark:border-blue-900/40 dark:bg-navy-950/60">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow">Before you ask</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Straight answers on services, price and process
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Something else on your mind? <Link to="/contact" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Ask me directly</Link> — or try the chat bubble in the corner.
            </p>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <FaqItem
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq((cur) => (cur === i ? -1 : i))}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section id="contact" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="container-site relative grid items-center gap-10 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Start your data journey</h2>
            <p className="mt-4 max-w-lg text-lg leading-8 text-neutral-500 dark:text-neutral-400">
              Data is abundant; insight is rare. Tell me about your project and get a free consultation — a fixed plan
              in writing within 24 hours, no pitch.
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
