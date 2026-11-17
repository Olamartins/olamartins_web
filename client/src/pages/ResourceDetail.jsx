import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, ExternalLink, FileText, GraduationCap, Video } from 'lucide-react';
import { api } from '../api/client.js';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { prettify } from '../utils/format.js';

const TYPE_ICONS = { ebook: BookOpen, video: Video, article: FileText, course: GraduationCap, guide: FileText };

export default function ResourceDetail() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/resources/${slug}`)
      .then((d) => setResource(d.resource))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/resources" className="btn-secondary mt-6">Back to resources</Link>
      </div>
    );
  }
  if (!resource) return <Spinner />;

  const TypeIcon = TYPE_ICONS[resource.type] || FileText;
  const isExternal = /^https?:\/\//.test(resource.file_url || '');

  return (
    <section className="container-site max-w-3xl py-16 sm:py-24">
      <Reveal>
        <Link to="/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-accent dark:text-neutral-400 dark:hover:text-accent-dark">
          <ArrowLeft size={15} /> All resources
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
            <TypeIcon size={26} />
          </span>
          <div>
            <span className="badge">{prettify(resource.type)}{resource.format ? ` · ${resource.format.toUpperCase()}` : ''}</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{resource.title}</h1>
          </div>
        </div>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">{resource.description}</p>

        {resource.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {resource.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        {resource.file_url && (
          <a
            href={resource.file_url}
            {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : { download: true })}
            className="btn-primary mt-8"
          >
            {resource.type === 'video' ? <Video size={16} /> : <Download size={16} />}
            {resource.type === 'video' ? 'Watch now' : 'Download / open resource'}
            {isExternal && <ExternalLink size={14} />}
          </a>
        )}
      </Reveal>
    </section>
  );
}
