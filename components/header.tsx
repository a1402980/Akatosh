import Link from "next/link"
import styles from "./header.module.css" // Using CSS module instead of SCSS

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>Akatosh</h1>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/history" className={styles.navLink}>
            History
          </Link>
          <Link href="/export" className={styles.navLink}>
            Export
          </Link>
        </nav>
      </div>
    </header>
  )
}

