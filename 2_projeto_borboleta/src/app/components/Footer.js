// Estilos isolados do rodapé.
import styles from "./Footer.module.css";
// Link retorna à página inicial usando a navegação do Next.js.
import Link from "next/link";

// Rodapé compartilhado com a marca, descrição do projeto e ano.
export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <Link className={styles.footerBrand} href="/">Worclick</Link>
      <p>Um projeto acadêmico para aproximar pessoas de novas oportunidades.</p>
      <span>© 2026 Worclick</span>
    </footer>
  );
}