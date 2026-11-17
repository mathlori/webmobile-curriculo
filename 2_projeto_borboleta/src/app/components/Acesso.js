"use client";

// useRouter permite avançar após a validação do formulário.
import { useRouter } from "next/navigation";
import { useState } from "react";
// Link navega entre as páginas de sessão e cadastro.
import Link from "next/link";
// Estilos modulares das telas de sessão e cadastro.
import styles from "./Acesso.module.css";

// Apresenta a interface de cadastro ou de início de sessão conforme a prop modo.
export default function Acesso({ modo }) {
  // O modo cadastro acrescenta o campo de nome e adapta textos e autocomplete.
  const cadastro = modo === "cadastro";
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Envia cadastro ou credenciais à API e avança somente após a autenticação.
  async function continuar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    const campos = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const resposta = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...campos,
          acao: cadastro ? "cadastro" : "login",
        }),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErro(resultado.error || "Não foi possível concluir o acesso. Tente novamente.");
        return;
      }

      window.dispatchEvent(new CustomEvent("worclick-auth-change", {
        detail: { usuario: resultado.usuario },
      }));
      router.push("/curriculo");
    } catch {
      setErro("Não foi possível conectar ao serviço de acesso. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <section className={styles.authPage}>
        {/* Apresentação textual correspondente ao modo selecionado. */}
        <section className={styles.authIntro}>
          <p className={styles.eyebrow}>{cadastro ? "Comece por você" : "Que bom ter você de volta"}</p>
          <h1>{cadastro ? "Uma nova etapa começa com sua história." : "Sua próxima oportunidade está mais perto."}</h1>
          <p>{cadastro ? "Crie seu acesso para começar a organizar seu perfil profissional." : "Acesse sua conta para continuar a jornada de criação do seu currículo."}</p>
        </section>

        {/* Campos de acesso, ação de continuidade e link para alternar entre os modos. */}
        <form className={styles.authAside} onSubmit={continuar}>
          <span>{cadastro ? "Criar acesso" : "Acessar conta"}</span>
          <h2>{cadastro ? "Seus dados de acesso" : "Acesse o Worclick"}</h2>
          {/* Nome é solicitado somente no cadastro; e-mail e senha aparecem nos dois modos. */}
          <fieldset aria-label="Campos de acesso" className={styles.authFields}>
            {cadastro && (
              <article className={styles.field}>
                <label htmlFor="nome">Nome completo</label>
                <input className={styles.input} autoComplete="name" id="nome" maxLength={100} minLength={2} name="nome" placeholder="Como podemos chamar você?" required />
              </article>
            )}
            <article className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input className={styles.input} autoComplete="email" id="email" maxLength={254} name="email" placeholder="voce@email.com" required type="email" />
            </article>
            <article className={styles.field}>
              <label htmlFor="senha">Senha</label>
              <input className={styles.input} autoComplete={cadastro ? "new-password" : "current-password"} id="senha" maxLength={128} minLength={8} name="senha" placeholder="Sua senha" required type="password" />
            </article>
          </fieldset>

          {erro && <p aria-live="polite" className={styles.authError} role="alert">{erro}</p>}
          <button className={styles.primaryButton} disabled={enviando} type="submit">
            {enviando ? "Aguarde..." : cadastro ? "Continuar para o currículo" : "Acessar e continuar"}
            <span aria-hidden="true">↗</span>
          </button>

          <p className={styles.authSwitch}>
            {cadastro ? "Já tem cadastro?" : "Ainda não tem cadastro?"}{" "}
            <Link href={cadastro ? "/sessao" : "/cadastro"}>{cadastro ? "Acessar conta" : "Criar acesso"}</Link>
          </p>
        </form>
      </section>
    </main>
  );
}