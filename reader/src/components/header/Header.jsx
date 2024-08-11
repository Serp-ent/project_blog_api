import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../utils/AuthProvider";

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to={'/'}>
        <div className={styles.logo}>
          Awesome Blog
        </div>
      </Link>

      <nav className={styles.nav}>
        <ul className={styles.navItems}>
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"authors"}>
            <li>Authors</li>
          </Link>
          <Link to={"about"}>
            <li>About</li>
          </Link>
        </ul>

        <div className={styles.actions}>
          {
            isAuthenticated ? (
              <>
                <Link to={`profile/${user.id}`}>Profile</Link>
                <Link onClick={logout}>Logout</Link>
              </>
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
