import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PublicLayout from "../layouts/PublicLayout";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

export default PublicRoute;