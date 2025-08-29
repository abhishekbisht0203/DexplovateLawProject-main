import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while we're verifying the user's auth state
    return <div>Loading...</div>;
  }

  if (!user) {
    // If the user is not logged in, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, show the component they were trying to access
  return children;
};

export default ProtectedRoute;