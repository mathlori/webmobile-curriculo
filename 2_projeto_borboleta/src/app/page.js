import Link from "next/link";
import styles from "./page.module.css";

const etapas = [
  { numero: "01", titulo: "Conte sua história", texto: "Preencha suas experiências, formação e habilidades." },
  { numero: "02", titulo: "Revise seu perfil", texto: "Organize as informações que melhor representam você." },
  { numero: "03", titulo: "Leve seu currículo", texto: "Escolha como quer receber o documento final." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <article className={styles.heroArticle}>
          <div className={styles.resumeSample} aria-hidden="true">
            <span className={styles.sampleTitle}>PERFIL</span>
            <i className={styles.sampleLineShort} />
            <i />
            <i />
            <span className={styles.sampleHeading}>EXPERIÊNCIA</span>
            <i />
            <i />
            <span className={styles.sampleHeading}>FORMAÇÃO</span>
            <i />
            <i />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Bem-vindo ao Worclick</p>
            <h1>Um clique que impulsiona sua carreira.</h1>
            <p className={styles.heroText}>
              Organize sua trajetória profissional e prepare um currículo claro para apresentar suas experiências e conquistas.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/cadastro">Criar meu currículo <span aria-hidden="true">↗</span></Link>
              <Link className={styles.textLink} href="/sessao">Já tenho cadastro</Link>
            </div>
          </div>
          <div className={`${styles.resumeSample} ${styles.resumeSampleAlt}`} aria-hidden="true">
            <span className={styles.sampleTitle}>CURRÍCULO</span>
            <i className={styles.sampleLineShort} />
            <i />
            <span className={styles.sampleHeading}>RESUMO</span>
            <i />
            <i />
            <i />
            <span className={styles.sampleHeading}>PROJETOS</span>
            <i />
            <i />
          </div>
        </article>
      </section>

      <section className={styles.stepSection} id="como-funciona">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>A jornada do Worclick</p>
          <h2>Seu currículo, em três etapas.</h2>
        </div>
        <div className={styles.steps}>
          {etapas.map((etapa) => (
            <article className={styles.step} key={etapa.numero}>
              <span>{etapa.numero}</span>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
