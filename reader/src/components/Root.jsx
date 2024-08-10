import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer"
import Header from "./header/Header"
import { AuthProvider } from "../utils/AuthProvider";

import styles from "./Root.module.css";

export default function Root() {
  return (
    <div className={styles.gridContainer} >
      <AuthProvider>
        <Header />
        <Outlet></Outlet>
        <Footer />
      </AuthProvider>

    </div>
  );
}