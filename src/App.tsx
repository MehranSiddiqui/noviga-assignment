import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { publicRoutes, privateRoutes } from "./routes"
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./HOC/ProtectedRoute";
import PublicRoute from "./HOC/PublicRoute";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retries failed requests (like HTTP 500) a couple of times[cite: 1]
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Prevents aggressive refetching while developing
    },
  },
});
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}

      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedRoute>{route.element}</ProtectedRoute>}
        />
      ))}

      <Route path="*" element={<Navigate to="/401" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>);
}

export default App;