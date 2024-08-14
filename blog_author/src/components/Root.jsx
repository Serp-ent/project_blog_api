import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <Link to={'/create'}>Create Post</Link>
      <Link to={'/posts'}>Show Posts</Link>
      <Link to={'/login'}>Login</Link>
      <Link to={'/register'}>Register</Link>
      <Outlet />
    </div>
  );
}