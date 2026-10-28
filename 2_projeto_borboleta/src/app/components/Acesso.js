import Link from "next/link";
import styles from "../page.module.css";

export default function Acesso({ modo }) {
  const cadastro = modo === "cadastro";

  return (
    <div className={styles.page}>
      <section className={styles.authPage}>
        <div className={styles.authIntro}>
          <p className={styles.eyebrow}>{cadastro ? "Comece por você" : "Que bom ter você de volta"}</p>
          <h1>{cadastro ? "Uma nova etapa começa com sua história." : "Sua próxima oportunidade está mais perto."}</h1>
          <p>{cadastro ? "Crie seu acesso para começar a organizar seu perfil profissional." : "Entre para continuar a jornada de criação do seu currículo."}</p>
        </div>

        <div className={styles.authAside}>
          <span>{cadastro ? "Criar acesso" : "Acessar conta"}</span>
          <h2>{cadastro ? "Seus dados de acesso" : "Entre no Worclick"}</h2>
          <div className={styles.authFields}>
            {cadastro && (
              <div className={styles.field}>
                <label htmlFor="nome">Nome completo</label>
                <input className={styles.input} autoComplete="name" id="nome" name="nome" placeholder="Como podemos chamar você?" />
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input className={styles.input} autoComplete="email" id="email" name="email" placeholder="voce@email.com" type="email" />
            </div>
            <div className={styles.field}>
              <label htmlFor="senha">Senha</label>
              <input className={styles.input} autoComplete={cadastro ? "new-password" : "current-password"} id="senha" name="senha" placeholder="Sua senha" type="password" />
            </div>
          </div>
          <Link className={styles.primaryButton} href="/curriculo">
            {cadastro ? "Continuar para o currículo" : "Entrar e continuar"}
            <span aria-hidden="true">↗</span>
          </Link>
          <p className={styles.authSwitch}>
            {cadastro ? "Já tem cadastro?" : "Ainda não tem cadastro?"} {" "}
            <Link href={cadastro ? "/sessao" : "/cadastro"}>{cadastro ? "Entrar" : "Criar acesso"}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}