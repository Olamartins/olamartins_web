import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice, prettify } from '../utils/format.js';

export function Thumbnail({ src, alt, category }) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className="h-44 w-full rounded-2xl object-cover" />;
  }
  return (
    <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 via-neutral-100 to-neutral-200 dark:from-accent-dark/20 dark:via-neutral-800 dark:to-neutral-900">
      <ShoppingBag size={40} className="text-accent/60 dark:text-accent-dark/60" />
    </div>
  );
}

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="p-4 pb-0">
        <Thumbnail src={product.thumbnail} alt={product.title} category={product.category} />
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <div className="flex items-center justify-between">
          <span className="badge">{prettify(product.category)}</span>
          <span className="text-base font-bold text-accent dark:text-accent-dark">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight group-hover:text-accent dark:group-hover:text-accent-dark">
          {product.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {product.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-accent-dark">
          View details <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
