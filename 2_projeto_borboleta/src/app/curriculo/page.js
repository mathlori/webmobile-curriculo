import Link from "next/link";
import styles from "../page.module.css";

// Grupos e campos do formulário definidos como dados para manter a estrutura consistente.
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

// Renderiza um campo com rótulo associado e seleciona textarea para respostas longas.
function Campo({ campo }) {
  // Campos marcados como full ocupam a largura disponível no grid.
  const className = campo.full ? `${styles.field} ${styles.fieldFull}` : styles.field;
  // Propriedades comuns aos controles evitam repetir a mesma configuração no JSX.
  const propriedades = {
    autoComplete: campo.autocomplete,
    className: campo.multiline ? styles.textarea : styles.input,
    id: campo.id,
    name: campo.id,
    placeholder: campo.placeholder,
    type: campo.type || "text",
  };

  return (
    <label className={className} htmlFor={campo.id}>
      <span>{campo.label}</span>
      {campo.multiline ? <textarea {...propriedades} /> : <input {...propriedades} />}
    </label>
  );
}

// Rota /curriculo com grupos de dados, modelos ilustrativos e navegação de continuidade.
export default function CurriculoPage() {
  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <header className={styles.pageHeading}>
        <p className={styles.eyebrow}>Worclick · seu perfil profissional</p>
        <h1 id="curriculo-heading">Formulário para currículo</h1>
        <p>Preencha as informações que fazem sentido para sua trajetória. Você pode revisar tudo antes de continuar.</p>
      </header>

      {/* Área principal do formulário, organizada em dados, modelos e próxima etapa. */}
      <section aria-label="Preenchimento do currículo" className={styles.formLayout}>
        <section aria-label="Dados do currículo" className={styles.formSections}>
          {/* Cada grupo apresenta seu título, descrição e conjunto de campos correspondente. */}
          {grupos.map((grupo) => (
            <section aria-labelledby={`titulo-${grupo.id}`} className={styles.formSection} key={grupo.id}>
              <h2 id={`titulo-${grupo.id}`}>{grupo.titulo}</h2>
              <p>{grupo.descricao}</p>
              <fieldset aria-labelledby={`titulo-${grupo.id}`} className={styles.fieldGrid}>
                {grupo.campos.map((campo) => <Campo campo={campo} key={campo.id} />)}
              </fieldset>
              {/* Ações de repetição ficam desativadas enquanto não houver lógica para duplicar grupos. */}
              {grupo.id === "experiencia" && <button className={styles.addButton} disabled type="button">Adicionar nova experiência</button>}
              {grupo.id === "formacao" && <button className={styles.addButton} disabled type="button">Adicionar nova formação</button>}
              {grupo.id === "projetos" && <button className={styles.addButton} disabled type="button">Adicionar novo projeto</button>}
            </section>
          ))}
        </section>

        {/* Pré-visualizações estáticas dos modelos previstos para o documento final. */}
        <section className={styles.templateSection} aria-labelledby="modelos-titulo">
          <h2 id="modelos-titulo">Modelos de currículo</h2>
          <p>Exemplos visuais de formatos que poderão ser gerados pelo Worclick.</p>
          <ul className={styles.templateGrid}>
            {["Clássico", "Essencial", "Criativo", "Objetivo"].map((modelo, index) => (
              <li key={modelo}>
                <article className={styles.templateCard}>
                  <figure className={`${styles.templatePreview} ${index % 2 ? styles.templatePreviewAlt : ""}`} aria-hidden="true">
                    <i />
                    <i />
                    <span />
                    <i />
                    <i />
                    <span />
                    <i />
                    <i />
                  </figure>
                  <h3>{modelo}</h3>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Links de continuidade; os dados preenchidos ainda não são processados nesta etapa. */}
        <aside className={styles.formAside}>
          <span>Próxima etapa</span>
          <h2>Revise antes de concluir</h2>
          <p>Ao continuar, você verá as opções previstas para receber seu currículo.</p>
          <Link className={styles.primaryButton} href="/curriculo/concluido">Concluir etapa <span aria-hidden="true">↗</span></Link>
          <Link className={styles.backLink} href="/">Voltar ao início</Link>
        </aside>
      </section>
    </main>
  );
}