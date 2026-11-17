import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye } from 'lucide-react';
import { api } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/site').then((d) => setSettings(d.settings)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="container-site py-24 text-center text-red-500">{error}</div>;
  if (!settings) return <Spinner />;

  const about = settings.about || {};

  return (
    <>
      <PageHero eyebrow="Who I Am" title="About me" subtitle="Aiming to be the best at turning data into decisions." />

      <section className="container-site pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{about.heading}</h2>
            <p className="mt-3 text-lg font-semibold text-accent dark:text-accent-dark">{about.subheading}</p>
            {(about.body || []).map((para, i) => (
              <p key={i} className="mt-4 leading-8 text-neutral-600 dark:text-neutral-400">
                {para}
              </p>
            ))}
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal delay={0.05} className="card p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                <Target size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Mission</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{settings.mission}</p>
            </Reveal>
            <Reveal delay={0.12} className="card p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                <Eye size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Vision</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{settings.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="container-site grid gap-10 py-20 text-center sm:grid-cols-3">
          {(settings.stats || []).map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-5xl font-bold tracking-tight text-accent dark:text-accent-dark">{s.value}</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site py-20 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to make decisions with confidence?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">
              Get a free consultation <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn-secondary">Browse templates</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
