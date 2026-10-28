import Link from "next/link";
import styles from "../page.module.css";

const grupos = [
  {
    id: "perfil",
    titulo: "Sobre você",
    descricao: "Informações para as empresas conhecerem seu perfil.",
    campos: [
      { id: "nome", label: "Nome completo", placeholder: "Ex.: Marina Costa", autocomplete: "name" },
      { id: "titulo", label: "Área ou título profissional", placeholder: "Ex.: Designer de produto" },
      { id: "cidade", label: "Cidade e estado", placeholder: "Ex.: São Paulo, SP" },
      { id: "telefone", label: "Telefone", placeholder: "Ex.: +55 11 99999-9999", type: "tel", autocomplete: "tel" },
      { id: "email", label: "E-mail", placeholder: "voce@email.com", type: "email", autocomplete: "email" },
      { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/...", type: "url" },
      { id: "portfolio", label: "GitHub ou portfólio", placeholder: "https://...", type: "url" },
      { id: "resumo", label: "Resumo profissional", placeholder: "Conte brevemente sobre sua experiência e seus interesses.", multiline: true, full: true },
    ],
  },
  {
    id: "experiencia",
    titulo: "Experiência profissional",
    descricao: "Destaque suas responsabilidades e contribuições.",
    campos: [
      { id: "empresa", label: "Empresa", placeholder: "Nome da empresa" },
      { id: "cargo", label: "Cargo", placeholder: "Seu cargo" },
      { id: "periodo", label: "Período", placeholder: "Ex.: Jan/2024 - atual" },
      { id: "responsabilidades", label: "Principais responsabilidades", placeholder: "Descreva as atividades e contribuições.", multiline: true, full: true },
    ],
  },
  {
    id: "formacao",
    titulo: "Formação acadêmica",
    descricao: "Inclua cursos, instituições e previsão de conclusão.",
    campos: [
      { id: "curso", label: "Curso", placeholder: "Ex.: Design Digital" },
      { id: "instituicao", label: "Instituição", placeholder: "Nome da instituição" },
      { id: "periodo-curso", label: "Período atual", placeholder: "Ex.: 5º semestre" },
      { id: "conclusao", label: "Previsão de conclusão", placeholder: "Ex.: Dez/2026" },
      { id: "infoAcademica", label: "Informações adicionais", placeholder: "Atividades, certificações ou destaques.", multiline: true, full: true },
    ],
  },
  {
    id: "projetos",
    titulo: "Projetos em destaque",
    descricao: "Apresente trabalhos que mostram como você aplica seus conhecimentos.",
    campos: [
      { id: "projeto", label: "Nome do projeto", placeholder: "Nome do projeto" },
      { id: "tecnologias", label: "Tecnologias", placeholder: "Ex.: Figma, React" },
      { id: "descricao-projeto", label: "Descrição", placeholder: "Qual era o objetivo e qual foi sua contribuição?", multiline: true, full: true },
    ],
  },
  {
    id: "habilidades",
    titulo: "Competências e idiomas",
    descricao: "Complete seu perfil com outras habilidades relevantes.",
    campos: [
      { id: "competencias", label: "Competências", placeholder: "Ex.: Pesquisa, comunicação, organização", multiline: true },
      { id: "idiomas", label: "Idiomas", placeholder: "Ex.: Português (nativo), Inglês (intermediário)", multiline: true },
    ],
  },
];

function Campo({ campo }) {
  const className = campo.full ? `${styles.field} ${styles.fieldFull}` : styles.field;
  const propriedades = {
    autoComplete: campo.autocomplete,
    className: campo.multiline ? styles.textarea : styles.input,
    id: campo.id,
    name: campo.id,
    placeholder: campo.placeholder,
    type: campo.type || "text",
  };

  return (
    <div className={className}>
      <label htmlFor={campo.id}>{campo.label}</label>
      {campo.multiline ? <textarea {...propriedades} /> : <input {...propriedades} />}
    </div>
  );
}

export default function CurriculoPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeading}>
        <p className={styles.eyebrow}>Worclick · seu perfil profissional</p>
        <h1>Formulário para currículo</h1>
        <p>Preencha as informações que fazem sentido para sua trajetória. Você pode revisar tudo antes de continuar.</p>
      </header>

      <div className={styles.formLayout}>
        <div className={styles.formSections}>
          {grupos.map((grupo) => (
            <section aria-labelledby={`titulo-${grupo.id}`} className={styles.formSection} key={grupo.id}>
              <h2 id={`titulo-${grupo.id}`}>{grupo.titulo}</h2>
              <p>{grupo.descricao}</p>
              <div className={styles.fieldGrid}>
                {grupo.campos.map((campo) => <Campo campo={campo} key={campo.id} />)}
              </div>
              {grupo.id === "experiencia" && <button className={styles.addButton} disabled type="button">Adicionar nova experiência</button>}
              {grupo.id === "formacao" && <button className={styles.addButton} disabled type="button">Adicionar nova formação</button>}
              {grupo.id === "projetos" && <button className={styles.addButton} disabled type="button">Adicionar novo projeto</button>}
            </section>
          ))}
        </div>

        <section className={styles.templateSection} aria-labelledby="modelos-titulo">
          <h2 id="modelos-titulo">Modelos de currículo</h2>
          <p>Exemplos visuais de formatos que poderão ser gerados pelo Worclick.</p>
          <div className={styles.templateGrid}>
            {["Clássico", "Essencial", "Criativo", "Objetivo"].map((modelo, index) => (
              <article className={styles.templateCard} key={modelo}>
                <div className={`${styles.templatePreview} ${index % 2 ? styles.templatePreviewAlt : ""}`} aria-hidden="true">
                  <i />
                  <i />
                  <span />
                  <i />
                  <i />
                  <span />
                  <i />
                  <i />
                </div>
                <h3>{modelo}</h3>
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.formAside}>
          <span>Próxima etapa</span>
          <h2>Revise antes de concluir</h2>
          <p>Ao continuar, você verá as opções previstas para receber seu currículo.</p>
          <Link className={styles.primaryButton} href="/curriculo/concluido">Concluir etapa <span aria-hidden="true">↗</span></Link>
          <Link className={styles.backLink} href="/">Voltar ao início</Link>
        </aside>
      </div>
    </div>
  );
}