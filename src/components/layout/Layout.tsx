
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

const Layout = ({ children, requiresAuth = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  React.useEffect(() => {
    if (requiresAuth && !loading && !currentUser) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [currentUser, loading, navigate, requiresAuth, location.pathname]);

  // Show nothing while checking auth status
  if (loading && requiresAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and needs auth, Layout will render nothing (will redirect)
  if (requiresAuth && !currentUser) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Determine if we should show the sidebar
  const showSidebar = currentUser !== null;

  return (
    <div className="app-container">
      <Header toggleSidebar={showSidebar ? toggleSidebar : undefined} />
      <div className="flex flex-1">
        {showSidebar && <Sidebar isOpen={sidebarOpen} />}
        <main className={`flex-1 p-6 bg-slate-50 min-h-[calc(100vh-64px)]`}>
          <div className="container max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
