// Link permite navegar entre rotas do Next.js sem recarregar a página.
import Link from "next/link";
// O CSS Module limita os estilos desta interface ao escopo da aplicação.
import styles from "./page.module.css";

// Conteúdo apresentado nos três passos da jornada para criar um currículo.
const etapas = [
  // Primeira etapa: reunir as informações profissionais.
  { numero: "01", titulo: "Conte sua história", texto: "Preencha suas experiências, formação e habilidades." },
  // Segunda etapa: revisar e organizar as informações reunidas.
  { numero: "02", titulo: "Revise seu perfil", texto: "Organize as informações que melhor representam você." },
  // Terceira etapa: indicar as opções de recebimento previstas.
  { numero: "03", titulo: "Leve seu currículo", texto: "Escolha como quer receber o documento final." },
];

// Página inicial: apresenta o serviço e explica a sequência de criação do currículo.
export default function Home() {
  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      {/* Seção de apresentação com exemplos visuais e ações para iniciar ou acessar uma conta. */}
      <section className={`${styles.hero} ${styles.heroArticle}`}>
        {/* Exemplo decorativo de currículo; o conteúdo não é anunciado por leitores de tela. */}
        <article className={styles.resumeSample} aria-hidden="true">
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
        </article>
        {/* Mensagem principal e links para cadastro ou início de sessão. */}
        <article className={styles.heroCopy}>
          <p className={styles.eyebrow}>Bem-vindo ao Worclick</p>
          <h1>Um clique que impulsiona sua carreira.</h1>
          <p className={styles.heroText}>
            Organize sua trajetória profissional e prepare um currículo claro para apresentar suas experiências e conquistas.
          </p>
          <nav className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/cadastro">Criar meu currículo <span aria-hidden="true">↗</span></Link>
            <Link className={styles.textLink} href="/sessao">Já tenho cadastro</Link>
          </nav>
        </article>
        {/* Segundo exemplo decorativo para ilustrar outro formato de currículo. */}
        <article className={`${styles.resumeSample} ${styles.resumeSampleAlt}`} aria-hidden="true">
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
        </article>
      </section>

      {/* Etapas renderizadas a partir dos dados definidos no início do arquivo. */}
      <section className={styles.stepSection} id="como-funciona">
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>A jornada do Worclick</p>
          <h2>Seu currículo, em três etapas.</h2>
        </header>
        {etapas.map((etapa) => (
          <article className={styles.step} key={etapa.numero}>
            <span>{etapa.numero}</span>
            <h3>{etapa.titulo}</h3>
            <p>{etapa.texto}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
