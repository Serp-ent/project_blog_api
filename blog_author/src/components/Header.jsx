import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";

export default function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header>
      <h1>Awesome Blog Admin</h1>
      <Link to={'/create'}>Create Post</Link>
      <Link to={'/posts'}>Show Posts</Link>
      {isAuthenticated ?
        <Link to={"/logout"}>Logout</Link>
        : (
          <>
            <Link to={'/login'}>Login</Link>
            <Link to={'/register'}>Register</Link>
          </>
        )
      }
    </header>
  );

}