// ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthed = () => !!localStorage.getItem("token"); // بدّليها بمصدر التوثيق عندك

export default function ProtectedRoute() {
  const location = useLocation();
  return isAuthed() ? (
    <Outlet />
  ) : (
    <Navigate to="/SentNumber" replace state={{ from: location }} />
  );
}
