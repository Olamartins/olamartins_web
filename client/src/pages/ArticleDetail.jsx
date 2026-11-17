import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api/client.js';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { Markdown } from '../utils/markdown.jsx';
import { formatDate } from '../utils/format.js';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/posts/${slug}`)
      .then((d) => setPost(d.post))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/articles" className="btn-secondary mt-6">Back to articles</Link>
      </div>
    );
  }
  if (!post) return <Spinner />;

  return (
    <article className="container-site max-w-3xl py-16 sm:py-24">
      <Reveal>
        <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-accent dark:text-neutral-400 dark:hover:text-accent-dark">
          <ArrowLeft size={15} /> All articles
        </Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-neutral-400">{formatDate(post.created_at)}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg leading-8 text-neutral-500 dark:text-neutral-400">{post.excerpt}</p>}
        {post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-8 w-full rounded-3xl object-cover" />}
        <div className="mt-8">
          <Markdown text={post.content} />
        </div>
      </Reveal>
    </article>
  );
}
