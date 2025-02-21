import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem(`${role}Token`);

  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};