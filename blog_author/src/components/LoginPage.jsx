import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => {
        login();
        navigate('/');
      }}>Log in</button>
    </div>
  );
}