import Link from "next/link";
import styles from "../../page.module.css";

export default function ConcluidoPage() {
  return (
    <div className={styles.page}>
      <section className={styles.completionPage}>
        <div className={styles.completionIntro}>
          <span className={styles.completionMark} aria-hidden="true">✓</span>
          <p className={styles.eyebrow}>Etapa concluída</p>
          <h1>Seu próximo passo começa agora.</h1>
          <p>As formas de gerar e receber o currículo serão conectadas em uma próxima etapa do projeto.</p>
        </div>

        <div>
          <div className={styles.deliveryOptions}>
            <article className={styles.deliveryOption}>
              <div>
                <h2>Baixar currículo</h2>
                <p>Gerar o documento com as informações do perfil.</p>
              </div>
              <span className={styles.comingSoon}>Próxima etapa</span>
            </article>
            <article className={styles.deliveryOption}>
              <div>
                <h2>Receber no celular</h2>
                <p>Escolher um número e solicitar o envio do documento.</p>
              </div>
              <span className={styles.comingSoon}>Próxima etapa</span>
            </article>
          </div>
          <Link className={styles.completionBack} href="/curriculo">Voltar ao formulário</Link>
        </div>
      </section>
    </div>
  );
}