import styles from "./Header.module.css";

export default function Header() {
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
    </header >
  );
}