import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute() {
  const { isAuthenticated, isChecking } = useAuthStore();

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
