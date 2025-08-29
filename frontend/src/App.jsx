import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import LoginPage from './components/loginPage.jsx';
import Signup from './components/signup.jsx';   // ✅ import signup
import DocumentUpload from './components/upload.jsx';   // ✅ import upload
import Dashboard from './components/Dashboard/dashboard.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';
import { useAuth } from './contexts/AuthContexts.jsx';

function App() {
  const { user, loading } = useAuth();

  // Show a loading screen while Firebase checks the auth state
  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Routes>
      {/* If a logged-in user tries to visit the home page, redirect to dashboard */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <HomePage />} 
      />

      {/* Login Route */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />

      {/* Signup Route */}
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" /> : <Signup />} 
      />

      {/* Upload Route (protected, only for logged-in users) */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <DocumentUpload />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard Route (protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
