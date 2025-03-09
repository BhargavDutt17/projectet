import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ requiredRole }) => {
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  if (!id || !role) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
