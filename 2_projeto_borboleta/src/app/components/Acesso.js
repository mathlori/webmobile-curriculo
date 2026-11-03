"use client";

// useRouter permite que o botão avance para o formulário ao ser acionado.
import { useRouter } from "next/navigation";
// Link navega entre as páginas de sessão e cadastro.
import Link from "next/link";
// Estilos compartilhados da interface.
import styles from "../page.module.css";

// Apresenta a interface de cadastro ou de início de sessão conforme a prop modo.
export default function Acesso({ modo }) {
  // O modo cadastro acrescenta o campo de nome e adapta textos e autocomplete.
  const cadastro = modo === "cadastro";
  const router = useRouter();

  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <section className={styles.authPage}>
        {/* Apresentação textual correspondente ao modo selecionado. */}
        <section className={styles.authIntro}>
          <p className={styles.eyebrow}>{cadastro ? "Comece por você" : "Que bom ter você de volta"}</p>
          <h1>{cadastro ? "Uma nova etapa começa com sua história." : "Sua próxima oportunidade está mais perto."}</h1>
          <p>{cadastro ? "Crie seu acesso para começar a organizar seu perfil profissional." : "Entre para continuar a jornada de criação do seu currículo."}</p>
        </section>

        {/* Campos de acesso, ação de continuidade e link para alternar entre os modos. */}
        <section className={styles.authAside}>
          <span>{cadastro ? "Criar acesso" : "Acessar conta"}</span>
          <h2>{cadastro ? "Seus dados de acesso" : "Entre no Worclick"}</h2>
          {/* Nome é solicitado somente no cadastro; e-mail e senha aparecem nos dois modos. */}
          <fieldset aria-label="Campos de acesso" className={styles.authFields}>
            {cadastro && (
              <article className={styles.field}>
                <label htmlFor="nome">Nome completo</label>
                <input className={styles.input} autoComplete="name" id="nome" name="nome" placeholder="Como podemos chamar você?" />
              </article>
            )}
            <article className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input className={styles.input} autoComplete="email" id="email" name="email" placeholder="voce@email.com" type="email" />
            </article>
            <article className={styles.field}>
              <label htmlFor="senha">Senha</label>
              <input className={styles.input} autoComplete={cadastro ? "new-password" : "current-password"} id="senha" name="senha" placeholder="Sua senha" type="password" />
            </article>
          </fieldset>

          {/* A navegação é demonstrativa; esta interface ainda não autentica nem salva os dados. */}
          <button className={styles.primaryButton} onClick={() => router.push("/curriculo")} type="button">
            {cadastro ? "Continuar para o currículo" : "Entrar e continuar"}
            <span aria-hidden="true">↗</span>
          </button>

          <p className={styles.authSwitch}>
            {cadastro ? "Já tem cadastro?" : "Ainda não tem cadastro?"} {" "}
            <Link href={cadastro ? "/sessao" : "/cadastro"}>{cadastro ? "Entrar" : "Criar acesso"}</Link>
          </p>
        </section>
      </section>
    </main>
  );
}