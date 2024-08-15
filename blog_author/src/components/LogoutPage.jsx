import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import { useEffect } from "react";

export default function LogoutPage() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout])

  return (
    <div>
      <Navigate to={'/'}></Navigate>
    </div>
  );
}