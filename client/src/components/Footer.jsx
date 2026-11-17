import { Link } from 'react-router-dom';
import { BookOpen, Linkedin, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    api.get('/site').then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  const socials = settings?.socials || {};
  const contact = settings?.contact || {};

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Ola<span className="text-accent dark:text-accent-dark">Martins</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            {settings?.tagline || 'Business Intelligence Consultant'} — clarity from complexity.
          </p>
          <div className="mt-4 flex gap-2">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="badge hover:text-accent">
                <Linkedin size={15} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="badge hover:text-accent">
                <Twitter size={15} />
              </a>
            )}
            {socials.medium && (
              <a href={socials.medium} target="_blank" rel="noreferrer" aria-label="Medium" className="badge hover:text-accent">
                <BookOpen size={15} />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="label">Explore</p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            <li><Link className="hover:text-accent dark:hover:text-accent-dark" to="/about">About</Link></li>
            <li><Link className="hover:text-accent dark:hover:text-accent-dark" to="/resources">Resources</Link></li>
            <li><Link className="hover:text-accent dark:hover:text-accent-dark" to="/shop">Shop</Link></li>
            <li><Link className="hover:text-accent dark:hover:text-accent-dark" to="/articles">Articles</Link></li>
          </ul>
        </div>

        <div>
          <p className="label">Contact</p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            {contact.email && <li>{contact.email}</li>}
            {contact.phone && <li>{contact.phone}</li>}
            {contact.address && <li>{contact.address}</li>}
          </ul>
        </div>

        <div>
          <p className="label">Get started</p>
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Book a free consultation or grab a ready-made dashboard template.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/contact" className="btn-primary !px-4 !py-2">Free Consultation</Link>
            <Link to="/shop" className="btn-secondary !px-4 !py-2">Visit Shop</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-5 dark:border-neutral-800">
        <p className="container-site text-center text-xs text-neutral-500 dark:text-neutral-400">
          © {year} {settings?.siteName || 'Ola Martins'}. All rights reserved. Digital products are delivered securely via{' '}
          <a href="https://selar.co" target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline dark:text-accent-dark">
            Selar
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
