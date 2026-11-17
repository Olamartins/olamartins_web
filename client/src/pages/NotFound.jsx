import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="Page not found" subtitle="The page you are looking for doesn't exist or has moved." />
      <div className="container-site pb-24 text-center">
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </>
  );
}
