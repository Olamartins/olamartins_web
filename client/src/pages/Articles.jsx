import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Articles() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts').then((d) => setPosts(d.posts)).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="Articles"
        subtitle="Practical notes on analytics, dashboards, data storytelling and building a career in BI."
      />
      <section className="container-site pb-20">
        {error && <p className="py-16 text-center text-red-500">{error}</p>}
        {!error && posts === null && <Spinner />}
        {!error && posts !== null && posts.length === 0 && (
          <EmptyState title="No articles yet" message="Check back soon — new articles are on the way." />
        )}
        {!error && posts !== null && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.07}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
