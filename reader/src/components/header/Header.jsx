import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../utils/AuthProvider";

export default function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Logo
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navItems}>
          {/* TODO: create some list item */}
          <li>Home</li>
          <li>Posts</li>
          <li>Contact</li>
          <li>About</li>
        </ul>
        <div className={styles.searchBar}>
          <label>
            Search
            <input />
          </label>
        </div>
      </nav>
      <div>
        {
          isAuthenticated ? (
            <button onClick={localStorage.removeItem('authToken')}>Log out</button>
          ) : (
            <>
              <Link to={'signin'}>Sign in</Link>
              <Link to={'signup'}>Sign up</Link>
            </>
          )
        }
      </div>
    </header >
  );
}
