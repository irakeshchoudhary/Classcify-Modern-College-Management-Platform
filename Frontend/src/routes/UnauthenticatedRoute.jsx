// frontend/src/components/auth/UnauthenticatedRoute.jsx
import { Navigate } from 'react-router-dom';

export const UnauthenticatedRoute = ({ children, role }) => {
  const token = localStorage.getItem(`${role}Token`);
  return token ? <Navigate to={`/${role}/dashboard`} replace /> : children;
};