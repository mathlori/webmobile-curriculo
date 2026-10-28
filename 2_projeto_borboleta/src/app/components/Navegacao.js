import Link from 'next/link';
import styles from '../page.module.css';

export default function Nav() {
  return (
    <header className={styles.siteHeader}>
      <nav className={styles.nav} aria-label="Navegação principal">
        <Link className={styles.brand} href="/" aria-label="Worclick, página inicial">
          <span className={styles.brandMark} aria-hidden="true">W</span>
          <span>Worclick</span>
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.navSecondary} href="/sessao">Entrar</Link>
          <Link className={styles.navAction} href="/cadastro">Criar currículo <span aria-hidden="true">↗</span></Link>
        </div>
      </nav>
    </header>
  );
}