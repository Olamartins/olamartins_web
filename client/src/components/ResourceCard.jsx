import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, GraduationCap, Video } from 'lucide-react';
import { prettify } from '../utils/format.js';

const TYPE_ICONS = {
  ebook: BookOpen,
  video: Video,
  article: FileText,
  course: GraduationCap,
  guide: FileText,
};

export default function ResourceCard({ resource }) {
  const TypeIcon = TYPE_ICONS[resource.type] || FileText;
  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="card group flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
          <TypeIcon size={20} />
        </span>
        <span className="badge">{prettify(resource.type)}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 line-clamp-3">
        {resource.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(resource.tags || []).map((tag) => (
          <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-accent-dark">
        Access resource <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
