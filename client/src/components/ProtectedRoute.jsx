import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user's role is included
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Redirect to home if unauthorized
  }

  return children;
};

export default ProtectedRoute;