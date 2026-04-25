import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-slate-400 font-bold text-sm tracking-widest animate-pulse text-center">SYNCING</div>
      </div>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
