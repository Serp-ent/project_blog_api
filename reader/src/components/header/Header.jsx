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
          <li>
            <Link to={"home"}>Home</Link>
          </li>
          <li>
            <Link to={"authors"}>Authors</Link>
          </li>
          <li>
            <Link to={"authors"}>About</Link>
          </li>
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
            <button onClick={logout}>Log out</button>
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
