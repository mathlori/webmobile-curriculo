"use client";

// Link faz a navegação interna sem recarregar o documento.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// Estilos isolados do cabeçalho de navegação.
import styles from "./Navegacao.module.css";

// Cabeçalho comum às páginas, com links agrupados em uma lista semântica.
export default function Nav() {
  const [usuario, setUsuario] = useState(null);
  const [erroSair, setErroSair] = useState("");
  const versaoSessao = useRef(0);

  // Consulta a sessão e sincroniza o cabeçalho após login ou logout.
  useEffect(() => {
    let ativo = true;
    const versaoInicial = versaoSessao.current;
    const atualizarUsuario = (evento) => {
      versaoSessao.current += 1;
      setUsuario(evento.detail?.usuario ?? null);
    };

    fetch("/api/auth", { cache: "no-store" })
      .then((resposta) => resposta.ok ? resposta.json() : { usuario: null })
      .then((resultado) => {
        if (ativo && versaoInicial === versaoSessao.current) setUsuario(resultado.usuario);
      })
      .catch(() => {
        if (ativo && versaoInicial === versaoSessao.current) setUsuario(null);
      });

    window.addEventListener("worclick-auth-change", atualizarUsuario);
    return () => {
      ativo = false;
      window.removeEventListener("worclick-auth-change", atualizarUsuario);
    };
  }, []);

  async function sair() {
    setErroSair("");
    try {
      const resposta = await fetch("/api/auth", { method: "DELETE" });
      if (!resposta.ok) {
        setErroSair("Não foi possível encerrar a sessão.");
        return;
      }

      setUsuario(null);
      window.dispatchEvent(new CustomEvent("worclick-auth-change", { detail: { usuario: null } }));
    } catch {
      setErroSair("Não foi possível conectar para encerrar a sessão.");
    }
  }

  return (
    <header className={styles.siteHeader}>
      <nav className={styles.nav} aria-label="Navegação principal">
        <Link className={styles.brand} href="/" aria-label="Worclick, página inicial">
          <span className={styles.brandMark} aria-hidden="true">W</span>
          <span>Worclick</span>
        </Link>
        <ul className={styles.navLinks}>
          {usuario ? (
            <>
              <li><span className={styles.navGreeting}>Olá, {usuario.nome}</span></li>
              <li><button className={styles.navSecondary} onClick={sair} type="button">Sair</button></li>
            </>
          ) : (
            <>
              <li><Link className={styles.navSecondary} href="/sessao">Acessar conta</Link></li>
              <li><Link className={styles.navAction} href="/cadastro">Criar currículo <span aria-hidden="true">↗</span></Link></li>
            </>
          )}
        </ul>
      </nav>
      {erroSair && <p aria-live="polite" className={styles.navError} role="alert">{erroSair}</p>}
    </header>
  );
}