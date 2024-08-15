import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => {
        login('mockedToken');
        navigate('/');
      }}>Log in</button>
    </div>
  );
}