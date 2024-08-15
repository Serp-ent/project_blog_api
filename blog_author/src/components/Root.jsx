import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function Root() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
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
      <Outlet />
    </div >
  );
}