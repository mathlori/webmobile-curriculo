"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

// Confirma o salvamento e permite baixar o currículo gerado pela API.
export default function Concluido({ rotaBase = "/curriculo" }) {
  const [baixando, setBaixando] = useState(false);
  const [erroDownload, setErroDownload] = useState("");

  async function baixarCurriculo() {
    setBaixando(true);
    setErroDownload("");

    try {
      const dados = JSON.parse(localStorage.getItem("worclick-curriculo"));
      if (!dados) {
        setErroDownload("Não foi encontrado um currículo salvo. Volte ao formulário e salve seus dados.");
        return;
      }

      const resposta = await fetch("/api/gera_curriculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const resultado = await resposta.json();
        setErroDownload(resultado.error || "Não foi possível gerar o currículo. Tente novamente.");
        return;
      }

      const arquivo = await resposta.blob();
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement("a");
      const nomeArquivo = resposta.headers
        .get("Content-Disposition")
        ?.match(/filename="([^"]+)"/)?.[1] || "curriculo.doc";
      link.href = url;
      link.download = nomeArquivo;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErroDownload("Não foi possível acessar os dados ou gerar o currículo. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <section aria-label="Conclusão do currículo" className={styles.completionPage}>
        <header className={styles.completionIntro}>
          <span className={styles.completionMark} aria-hidden="true">✓</span>
          <p className={styles.eyebrow}>Etapa concluída</p>
          <h1 id="completion-heading">Seu próximo passo começa agora.</h1>
          <p>Suas informações foram salvas. Baixe seu currículo em um documento Word quando estiver pronto.</p>
        </header>

        <section aria-label="Download do currículo" className={styles.deliveryOptions}>
          <article className={styles.deliveryOption}>
            <header>
              <h2>Baixar currículo</h2>
              <p>Gere um documento Word com as informações salvas no seu perfil.</p>
            </header>
            <button
              className={styles.downloadButton}
              disabled={baixando}
              onClick={baixarCurriculo}
              type="button"
            >
              {baixando ? "Gerando currículo..." : "Baixar currículo"}
            </button>
          </article>
          {erroDownload && <p aria-live="polite" className={styles.downloadError} role="alert">{erroDownload}</p>}
          <Link className={styles.completionBack} href={rotaBase}>Voltar ao formulário</Link>
        </section>
      </section>
    </main>
  );
}