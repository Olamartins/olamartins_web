import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice, prettify } from '../utils/format.js';

export function Thumbnail({ src, alt, category }) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className="h-44 w-full rounded-xl object-cover" />;
  }
  return (
    <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500">
      <div className="bg-grid-blue absolute inset-0 opacity-60" />
      <ShoppingBag size={42} className="relative text-white/90 drop-shadow-lg" />
    </div>
  );
}

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:hover:border-blue-700"
    >
      <div className="p-3 pb-0">
        <Thumbnail src={product.thumbnail} alt={product.title} category={product.category} />
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="flex items-center justify-between">
          <span className="badge">{prettify(product.category)}</span>
          <span className="font-display text-base font-bold text-blue-700 dark:text-blue-300">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight transition group-hover:text-blue-700 dark:group-hover:text-blue-300">
          {product.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 line-clamp-2 dark:text-neutral-400">
          {product.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
          View details <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
