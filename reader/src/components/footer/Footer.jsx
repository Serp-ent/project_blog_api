import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.footerList}>
        <li>Newsletter</li>
        <li>Github</li>
      </ul>
    </footer>
  );
} 