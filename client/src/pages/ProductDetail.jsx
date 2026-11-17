import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, ShoppingBag } from 'lucide-react';
import { api } from '../api/client.js';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Thumbnail } from '../components/ProductCard.jsx';
import { formatPrice, prettify } from '../utils/format.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/products/${slug}`)
      .then((d) => {
        setProduct(d.product);
        return api.get(`/products?category=${d.product.category}`);
      })
      .then((d) => setRelated(d.products.filter((p) => p.slug !== slug).slice(0, 3)))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/shop" className="btn-secondary mt-6">Back to shop</Link>
      </div>
    );
  }
  if (!product) return <Spinner />;

  return (
    <section className="container-site py-16 sm:py-24">
      <Reveal>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-accent dark:text-neutral-400 dark:hover:text-accent-dark">
          <ArrowLeft size={15} /> Back to shop
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <Thumbnail src={product.thumbnail} alt={product.title} category={product.category} />
        </Reveal>
        <Reveal delay={0.1}>
          <span className="badge">{prettify(product.category)}</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
          <p className="mt-3 text-3xl font-bold text-accent dark:text-accent-dark">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-5 leading-8 text-neutral-600 dark:text-neutral-400">{product.description}</p>

          {Array.isArray(product.features) && product.features.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent dark:text-accent-dark" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={product.selar_url} target="_blank" rel="noreferrer" className="btn-primary">
              <ShoppingBag size={16} /> Buy on Selar <ExternalLink size={14} />
            </a>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Secure checkout & instant delivery via selar.co
            </span>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight">You may also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
