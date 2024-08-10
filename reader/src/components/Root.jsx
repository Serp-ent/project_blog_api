import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer"
import Header from "./header/Header"
import { AuthProvider } from "../utils/AuthProvider";

export default function Root() {
  return (
    <AuthProvider>
      <Header />
      <Outlet></Outlet>
      <Footer />
    </AuthProvider>
  );
}