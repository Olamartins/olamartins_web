import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Briefcase, Github, Linkedin, Mail, MapPin, Phone, Target, Eye } from 'lucide-react';
import { api } from '../api/client.js';
import { whatsappLink } from '../utils/countries.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { Markdown } from '../utils/markdown.jsx';

const DEFAULT_PROFILE = '/olamartins-profile.jpg';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/site').then((d) => setSettings(d.settings)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="container-site py-24 text-center text-red-500">{error}</div>;
  if (!settings) return <Spinner />;

  const about = settings.about || {};
  const experience = settings.experience || [];
  const certifications = settings.certifications || [];
  const tools = settings.tools || [];

  return (
    <>
      <PageHero
        eyebrow="Who I am"
        title="The architect of actionable insight"
        subtitle="Senior Data & Business Intelligence Leader — 9+ years turning complex data into decisions across Oil & Gas, retail, e-commerce, healthcare and NGOs."
      />

      {/* Profile card */}
      <section className="container-site pb-16">
        <Reveal>
          <div className="card relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <img
                src={settings.branding?.profileImage || DEFAULT_PROFILE}
                alt="Olawumi (Ola) Martins"
                className="h-32 w-32 shrink-0 rounded-[18px] object-cover shadow-glow ring-4 ring-blue-50 dark:ring-white/10 sm:h-40 sm:w-40"
              />
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Olawumi Fadero (Ola Martins)</h2>
                <p className="mt-1 font-display text-base font-bold text-blue-700 dark:text-blue-300">{settings.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
                  {settings.contact?.address && (
                    <span className="badge"><MapPin size={13} /> {settings.contact.address}</span>
                  )}
                  {settings.contact?.email && (
                    <a className="badge hover:border-blue-300" href={`mailto:${settings.contact.email}`}><Mail size={13} /> {settings.contact.email}</a>
                  )}
                  {settings.contact?.phone && (
                    <a className="badge hover:border-blue-300" href={`tel:${settings.contact.phone}`}><Phone size={13} /> {settings.contact.phone}</a>
                  )}
                  {whatsappLink(settings.contact?.whatsapp) && (
                    <a className="badge hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-500/10" href={whatsappLink(settings.contact.whatsapp)} target="_blank" rel="noreferrer">
                      WhatsApp {settings.contact.whatsapp}
                    </a>
                  )}
                  {settings.socials?.linkedin && (
                    <a className="badge hover:border-blue-300" href={settings.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={13} /> LinkedIn</a>
                  )}
                  <a className="badge hover:border-blue-300" href="https://github.com/Olamartins" target="_blank" rel="noreferrer"><Github size={13} /> GitHub</a>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a href="https://calendly.com/olamartins/30min" target="_blank" rel="noreferrer" className="btn-primary !rounded-[12px] !px-4 !py-2 text-[13px]">
                    Book a call <ArrowRight size={14} />
                  </a>
                  <Link to="/contact" className="btn-secondary !rounded-[12px] !px-4 !py-2 text-[13px]">Send a message</Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Bio */}
      <section className="container-site pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{about.heading}</h2>
            <p className="mt-3 font-display text-lg font-bold text-blue-700 dark:text-blue-300">{about.subheading}</p>
            <div className="mt-4 leading-8 text-neutral-600 dark:text-neutral-400">
              <Markdown text={(about.body || []).join('\n\n')} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal delay={0.05} className="card p-6 hover:border-blue-300 dark:hover:border-blue-700">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/25">
                <Target size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">Mission</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{settings.mission}</p>
            </Reveal>
            <Reveal delay={0.12} className="card p-6 hover:border-blue-300 dark:hover:border-blue-700">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/25">
                <Eye size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">Vision</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{settings.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience timeline */}
      {experience.length > 0 && (
        <section className="border-t border-blue-100 bg-white/60 py-20 dark:border-blue-900/40 dark:bg-navy-950/60">
          <div className="container-site">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Experience</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">9+ years, role by role</h2>
            </Reveal>
            <div className="relative mx-auto mt-12 max-w-3xl">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-blue-600/60 via-blue-400/40 to-transparent" />
              <div className="space-y-10">
                {experience.map((job, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="relative pl-10">
                      <span className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-blue-500 bg-white dark:bg-navy-975">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      </span>
                      <div className="card p-6 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                            <Briefcase size={17} className="text-blue-600 dark:text-blue-400" /> {job.role}
                          </h3>
                          <span className="badge">{job.period}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-blue-300">{job.company}</p>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                          {(job.points || []).map((p, j) => (
                            <li key={j}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="container-site py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Certifications</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Certified, not just experienced</h2>
          </Reveal>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {certifications.map((c, i) => (
              <Reveal key={c} delay={i * 0.04}>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm dark:border-blue-900/50 dark:bg-navy-950/70 dark:text-blue-100">
                  <Award size={14} className="text-blue-600 dark:text-blue-400" /> {c}
                </span>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Stats strip */}
      {settings.stats?.length > 0 && (
        <section className="border-t border-blue-100 bg-white/60 dark:border-blue-900/40 dark:bg-navy-950/60">
          <div className="container-site grid gap-8 py-14 text-center sm:grid-cols-2 lg:grid-cols-4">
            {settings.stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p className="text-gradient-blue font-display text-5xl font-extrabold tracking-tight">{s.value}</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-site py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to make decisions with confidence?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">
              Book a free consultation <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn-secondary">Browse templates</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
