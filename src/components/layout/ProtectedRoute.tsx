import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

export function ProtectedRoute({ role, children }: { role?: UserRole; children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
