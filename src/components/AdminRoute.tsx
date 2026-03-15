import { Navigate, useLocation } from "react-router-dom";
import { useAdminStore } from "@/stores/adminStore";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const adminKey = useAdminStore((s) => s.adminKey);
  const location = useLocation();

  if (!adminKey) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
