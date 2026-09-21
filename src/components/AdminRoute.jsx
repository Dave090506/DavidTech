import { Navigate } from "react-router-dom";
import useAdmin from "../context/useAdmin";

function AdminRoute({ children }) {
  const { isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
