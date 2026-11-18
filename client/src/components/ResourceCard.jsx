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
      className="card group flex flex-col p-6 hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/25">
          <TypeIcon size={20} />
        </span>
        <span className="badge">{prettify(resource.type)}</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight transition group-hover:text-blue-700 dark:group-hover:text-blue-300">
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 line-clamp-3 dark:text-neutral-400">
        {resource.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(resource.tags || []).map((tag) => (
          <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
        Access resource <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
