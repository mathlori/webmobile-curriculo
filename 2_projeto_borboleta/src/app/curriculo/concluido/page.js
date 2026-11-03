import Link from "next/link";
import styles from "../../page.module.css";

// Página apresentada após o formulário; as opções descritas ainda são etapas futuras.
export default function ConcluidoPage() {
  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <section aria-label="Conclusão do currículo" className={styles.completionPage}>
        {/* Confirma o avanço na interface e informa quais integrações ainda serão feitas. */}
        <header className={styles.completionIntro}>
          <span className={styles.completionMark} aria-hidden="true">✓</span>
          <p className={styles.eyebrow}>Etapa concluída</p>
          <h1 id="completion-heading">Seu próximo passo começa agora.</h1>
          <p>As formas de gerar e receber o currículo serão conectadas em uma próxima etapa do projeto.</p>
        </header>

        {/* Alternativas ilustrativas para baixar o documento ou recebê-lo no celular. */}
        <section aria-label="Opções futuras para receber o currículo" className={styles.deliveryOptions}>
          <article className={styles.deliveryOption}>
            <header>
              <h2>Baixar currículo</h2>
              <p>Gerar o documento com as informações do perfil.</p>
            </header>
            <span className={styles.comingSoon}>Próxima etapa</span>
          </article>
          <article className={styles.deliveryOption}>
            <header>
              <h2>Receber no celular</h2>
              <p>Escolher um número e solicitar o envio do documento.</p>
            </header>
            <span className={styles.comingSoon}>Próxima etapa</span>
          </article>
          <Link className={styles.completionBack} href="/curriculo">Voltar ao formulário</Link>
        </section>
      </section>
    </main>
  );
}