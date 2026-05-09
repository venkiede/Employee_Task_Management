import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary-500/20 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-heading mb-4">Page Not Found</h2>
        <p className="text-subtle mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Check the URL or navigate back to the dashboard.
        </p>
        <Link to="/dashboard">
          <Button icon={<Home size={18} />} size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
