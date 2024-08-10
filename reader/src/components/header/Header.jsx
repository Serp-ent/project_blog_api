import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../utils/AuthProvider";

export default function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Awesome Blog
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navItems}>
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"authors"}>
            <li>Authors</li>
          </Link>
          <Link to={"authors"}>
            <li>About</li>
          </Link>
        </ul>

        <div className={isAuthenticated ? styles.logoutButton : styles.accountSection}>
          {
            isAuthenticated ? (
              <button onClick={logout}>Log out</button>
            ) : (
              <>
                <Link to={'signin'}>Sign in</Link>
                <Link to={'signup'}>Sign up</Link>
              </>
            )
          }
        </div>
      </nav>
    </header >
  );
}
