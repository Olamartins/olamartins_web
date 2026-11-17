import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { api } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import ConsultationForm from '../components/ConsultationForm.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/site').then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  if (!settings) return <Spinner />;
  const contact = settings.contact || {};

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your data" subtitle="Book a free consultation — I usually reply within one business day." />

      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
          <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
            Whether you need a dashboard, an analytics audit or training for your team, send a message and let's
            figure out the fastest path to clarity.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {contact.phone && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  <Phone size={17} />
                </span>
                <a href={`tel:${contact.phone}`} className="font-medium hover:text-accent dark:hover:text-accent-dark">{contact.phone}</a>
              </li>
            )}
            {contact.email && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  <Mail size={17} />
                </span>
                <a href={`mailto:${contact.email}`} className="font-medium hover:text-accent dark:hover:text-accent-dark">{contact.email}</a>
              </li>
            )}
            {contact.address && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  <MapPin size={17} />
                </span>
                <span className="font-medium">{contact.address}</span>
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-5 text-2xl font-bold tracking-tight">Get a Free Consultation</h2>
          <ConsultationForm />
        </Reveal>
      </section>
    </>
  );
}
