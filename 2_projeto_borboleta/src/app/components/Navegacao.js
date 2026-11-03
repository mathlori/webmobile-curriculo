// Link faz a navegação interna sem recarregar o documento.
import Link from "next/link";
// Estilos compartilhados da navegação e do restante da aplicação.
import styles from "../page.module.css";

// Cabeçalho comum às páginas, com links agrupados em uma lista semântica.
export default function Nav() {
  return (
    <header className={styles.siteHeader}>
      <nav className={styles.nav} aria-label="Navegação principal">
        <Link className={styles.brand} href="/" aria-label="Worclick, página inicial">
          <span className={styles.brandMark} aria-hidden="true">W</span>
          <span>Worclick</span>
        </Link>
        <ul className={styles.navLinks}>
          <li><Link className={styles.navSecondary} href="/sessao">Entrar</Link></li>
          <li><Link className={styles.navAction} href="/cadastro">Criar currículo <span aria-hidden="true">↗</span></Link></li>
        </ul>
      </nav>
    </header>
  );
}