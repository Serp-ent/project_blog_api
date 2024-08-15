import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import Header from "./Header";

export default function Root() {
  return (
    <div>
      <Header></Header>
      <Outlet />
    </div >
  );
}