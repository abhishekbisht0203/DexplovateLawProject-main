import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-teal-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, show the component they were trying to access
  return children;
};

export default ProtectedRoute;