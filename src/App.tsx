import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

import Landing from '@/pages/Landing';
import UserLogin from '@/pages/UserLogin';
import AdminLogin from '@/pages/AdminLogin';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

import CustomCursor from '@/components/ui/CustomCursor';  

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Cursor must be here */}
        <CustomCursor />

        {/* All pages */}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
