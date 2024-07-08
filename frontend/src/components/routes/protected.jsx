import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === 'null') {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
  // return children;
};
