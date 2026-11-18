import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { formatDate } from '../utils/format.js';

export default function PostCard({ post }) {
  return (
    <Link
      to={`/articles/${post.slug}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700"
    >
      {post.cover_image ? (
        <img src={post.cover_image} alt={post.title} loading="lazy" className="h-44 w-full object-cover" />
      ) : (
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-600 to-sky-500">
          <div className="bg-grid-blue absolute inset-0 opacity-60" />
          <Newspaper size={42} className="relative text-white/90 drop-shadow-lg" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          {formatDate(post.created_at)}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight transition group-hover:text-blue-700 dark:group-hover:text-blue-300">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 line-clamp-2 dark:text-neutral-400">{post.excerpt}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
          Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
