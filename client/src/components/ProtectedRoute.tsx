import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin" | "worker";
  workerOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  workerOnly = false,
}: ProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (workerOnly) {
    const workerData = localStorage.getItem("worker");
    const workerToken = localStorage.getItem("workerToken");

    if (!workerData || !workerToken) {
      return <Navigate to="/worker/login" replace />;
    }

    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Проверяем оба варианта названия поля
  const needsPasswordChange =
    user.requiresPasswordChange || (user as any).requires_password_change;

  if (user.role === "worker" && needsPasswordChange) {
    const isOnPasswordPage =
      window.location.pathname === "/worker/change-password";

    if (!isOnPasswordPage) {
      return <Navigate to="/worker/change-password" replace />;
    }
  }

  return <>{children}</>;
};
