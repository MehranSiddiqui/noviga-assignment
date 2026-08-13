import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PrivateLayout from "../layouts/PrivateLayout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PrivateLayout>{children}</PrivateLayout>;
};

export default ProtectedRoute;