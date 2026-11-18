import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Github, Linkedin, Twitter } from 'lucide-react';
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
    <footer className="relative overflow-hidden bg-navy-950 text-blue-100/80">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="container-site relative grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white">
              <BarChart3 size={18} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Ola<span className="text-blue-400">Martins</span>
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-blue-200/60">
            {settings?.tagline || 'Senior Data & Business Intelligence Leader'} — clarity from complexity.
          </p>
          <div className="mt-4 flex gap-2">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-200 transition hover:border-blue-400/50 hover:text-blue-300">
                <Linkedin size={15} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-200 transition hover:border-blue-400/50 hover:text-blue-300">
                <Twitter size={15} />
              </a>
            )}
            {socials.medium && (
              <a href={socials.medium} target="_blank" rel="noreferrer" aria-label="Medium" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-200 transition hover:border-blue-400/50 hover:text-blue-300">
                <BookOpen size={15} />
              </a>
            )}
            <a href="https://github.com/Olamartins" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-200 transition hover:border-blue-400/50 hover:text-blue-300">
              <Github size={15} />
            </a>
          </div>
        </div>

        <div>
          <p className="label !text-blue-300/60">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="transition hover:text-blue-300" to="/about">About</Link></li>
            <li><Link className="transition hover:text-blue-300" to="/resources">Resources</Link></li>
            <li><Link className="transition hover:text-blue-300" to="/shop">Shop</Link></li>
            <li><Link className="transition hover:text-blue-300" to="/articles">Articles</Link></li>
          </ul>
        </div>

        <div>
          <p className="label !text-blue-300/60">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            {contact.email && <li>{contact.email}</li>}
            {contact.phone && <li>{contact.phone}</li>}
            {contact.address && <li>{contact.address}</li>}
          </ul>
        </div>

        <div>
          <p className="label !text-blue-300/60">Get started</p>
          <p className="mt-3 text-sm leading-6 text-blue-200/60">
            Book a free consultation or grab a ready-made dashboard template.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/contact" className="btn-primary !px-4 !py-2 text-[13px]">Free consultation</Link>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-semibold text-blue-100 transition hover:bg-white/10">
              Visit shop
            </Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5">
        <p className="container-site text-center text-xs text-blue-200/50">
          © {year} {settings?.siteName || 'Ola Martins'}. All rights reserved. Digital products are delivered securely via{' '}
          <a href="https://selar.co" target="_blank" rel="noreferrer" className="font-semibold text-blue-300 hover:underline">
            Selar
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
