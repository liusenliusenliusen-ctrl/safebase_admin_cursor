import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useAdminStore } from "@/stores/adminStore";
import { AdminRoute } from "@/components/AdminRoute";
import { LoginPage } from "@/pages/LoginPage";
import { UserListPage } from "@/pages/UserListPage";
import { UserDetailPage } from "@/pages/UserDetailPage";

export default function App() {
  const hydrate = useAdminStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onLogout = () => useAdminStore.getState().logout();
    window.addEventListener("admin:logout", onLogout);
    return () => window.removeEventListener("admin:logout", onLogout);
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <AdminRoute>
                <UserDetailPage />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
