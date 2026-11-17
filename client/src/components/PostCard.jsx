import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { formatDate } from '../utils/format.js';

export default function PostCard({ post }) {
  return (
    <Link
      to={`/articles/${post.slug}`}
      className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      {post.cover_image ? (
        <img src={post.cover_image} alt={post.title} loading="lazy" className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-accent/15 via-neutral-100 to-neutral-200 dark:from-accent-dark/20 dark:via-neutral-800 dark:to-neutral-900">
          <Newspaper size={40} className="text-accent/60 dark:text-accent-dark/60" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{formatDate(post.created_at)}</p>
        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-accent-dark">
          Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
