
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // User is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If children are provided, render them
  // This matches the way App.jsx is currently written.
  if (children) {
    return children;
  }

  // Also support Outlet-based routes if needed later
  return <Outlet />;
}

export default ProtectedRoute;
