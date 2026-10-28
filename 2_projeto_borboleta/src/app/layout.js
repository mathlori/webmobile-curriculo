import Link from "next/link";
import "./globals.css";
import Nav from "./components/Navegacao";
import styles from "./page.module.css";

export const metadata = {
  title: "Worclick | Seu currículo, novos caminhos",
  description: "Organize sua trajetória profissional com o Worclick.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <main className={styles.siteMain}>{children}</main>
        <footer className={styles.siteFooter}>
          <Link className={styles.footerBrand} href="/">Worclick</Link>
          <p>Um projeto acadêmico para aproximar pessoas de novas oportunidades.</p>
          <span>© 2026 Worclick</span>
        </footer>
      </body>
    </html>
  );
}
