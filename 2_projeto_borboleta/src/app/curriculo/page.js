"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

// Grupos e campos do formulário definidos como dados para manter a estrutura consistente.
const grupos = [
  {
    id: "perfil",
    titulo: "Sobre você",
    descricao: "Informações para as empresas conhecerem seu perfil.",
    campos: [
      { id: "nome", label: "Nome completo", placeholder: "Ex.: Marina Costa", autocomplete: "name", required: true },
      { id: "titulo", label: "Área ou título profissional", placeholder: "Ex.: Designer de produto", required: true },
      { id: "cidade", label: "Cidade e estado", placeholder: "Ex.: São Paulo, SP", required: true },
      { id: "telefone", label: "Telefone", placeholder: "Ex.: +55 11 99999-9999", type: "tel", autocomplete: "tel" },
      { id: "email", label: "E-mail", placeholder: "voce@email.com", type: "email", autocomplete: "email", required: true },
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
function Campo({ campo, id = campo.id, name = campo.id, onChange, required = campo.required, value }) {
  // Campos marcados como full ocupam a largura disponível no grid.
  const className = campo.full ? `${styles.field} ${styles.fieldFull}` : styles.field;
  // Propriedades comuns aos controles evitam repetir a mesma configuração no JSX.
  const propriedades = {
    autoComplete: campo.autocomplete,
    className: campo.multiline ? styles.textarea : styles.input,
    id,
    name,
    onChange,
    placeholder: campo.placeholder,
    required,
    type: campo.type || "text",
    value,
  };

  return (
    <label className={className} htmlFor={id}>
      <span>{campo.label}</span>
      {campo.multiline ? <textarea {...propriedades} /> : <input {...propriedades} />}
    </label>
  );
}

// Rota /curriculo com grupos de dados, experiências repetíveis e validação nativa.
export default function CurriculoPage() {
  const router = useRouter();
  const [erroSalvar, setErroSalvar] = useState("");
  const [experiencias, setExperiencias] = useState([
    { id: 0, empresa: "", cargo: "", periodo: "", responsabilidades: "" },
  ]);

  function atualizarExperiencia(id, campo, valor) {
    setExperiencias((atuais) => atuais.map((item) => (
      item.id === id ? { ...item, [campo]: valor } : item
    )));
  }

  function salvarCurriculo(event) {
    event.preventDefault();
    const formulario = new FormData(event.currentTarget);
    const dados = {};

    formulario.forEach((valor, nome) => {
      if (!nome.startsWith("experiencias[")) dados[nome] = valor;
    });

    const experienciasPreenchidas = experiencias
      .map(({ id, ...dadosExperiencia }) => dadosExperiencia)
      .filter((experiencia) => Object.values(experiencia).some((valor) => valor.trim()));

    try {
      localStorage.setItem("worclick-curriculo", JSON.stringify({
        ...dados,
        experiencias: experienciasPreenchidas,
      }));
    } catch {
      setErroSalvar("Não foi possível salvar o currículo neste navegador. Tente novamente.");
      return;
    }

    setErroSalvar("");
    router.push("/curriculo/concluido");
  }

  return (
    <main className={`${styles.siteMain} ${styles.page}`}>
      <header className={styles.pageHeading}>
        <p className={styles.eyebrow}>Worclick · seu perfil profissional</p>
        <h1 id="curriculo-heading">Formulário para currículo</h1>
        <p>Preencha os campos essenciais e inclua as experiências que representam sua trajetória antes de salvar.</p>
      </header>

      {/* Área principal do formulário, organizada em dados e próxima etapa. */}
      <form aria-label="Preenchimento do currículo" className={styles.formLayout} onSubmit={salvarCurriculo}>
        <section aria-label="Dados do currículo" className={styles.formSections}>
          {/* Cada grupo apresenta seu título, descrição e conjunto de campos correspondente. */}
          {grupos.map((grupo) => (
            <section aria-labelledby={`titulo-${grupo.id}`} className={styles.formSection} key={grupo.id}>
              <h2 id={`titulo-${grupo.id}`}>{grupo.titulo}</h2>
              <p>{grupo.descricao}</p>
              {grupo.id === "experiencia" ? (
                <>
                  <ol className={styles.experienceList}>
                    {experiencias.map((experiencia, index) => {
                      const preenchida = grupo.campos.some((campo) => experiencia[campo.id].trim());

                      return (
                        <li key={experiencia.id}>
                          <fieldset className={styles.experienceEntry}>
                            <legend>Experiência {index + 1}</legend>
                            {grupo.campos.map((campo) => (
                              <Campo
                                campo={campo}
                                id={`${campo.id}-${experiencia.id}`}
                                key={campo.id}
                                name={`experiencias[${index}][${campo.id}]`}
                                onChange={(event) => atualizarExperiencia(experiencia.id, campo.id, event.target.value)}
                                required={preenchida}
                                value={experiencia[campo.id]}
                              />
                            ))}
                            {experiencias.length > 1 && (
                              <button
                                aria-label={`Remover experiência ${index + 1}`}
                                className={styles.removeButton}
                                onClick={() => setExperiencias((atuais) => atuais.filter((item) => item.id !== experiencia.id))}
                                type="button"
                              >
                                Remover experiência
                              </button>
                            )}
                          </fieldset>
                        </li>
                      );
                    })}
                  </ol>
                  <button
                    className={styles.addButton}
                    onClick={() => setExperiencias((atuais) => [
                      ...atuais,
                      {
                        id: atuais.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1,
                        empresa: "",
                        cargo: "",
                        periodo: "",
                        responsabilidades: "",
                      },
                    ])}
                    type="button"
                  >
                    Adicionar nova experiência
                  </button>
                </>
              ) : (
                <fieldset aria-labelledby={`titulo-${grupo.id}`} className={styles.fieldGrid}>
                  {grupo.campos.map((campo) => <Campo campo={campo} key={campo.id} />)}
                </fieldset>
              )}
            </section>
          ))}
        </section>

        {/* Um único currículo é salvo e pode substituir o anterior. */}
        <aside className={styles.formAside}>
          <span>Próxima etapa</span>
          <h2>Crie seu currículo</h2>
          <p>Seus dados serão salvos em um único currículo. Ao salvar novamente, este currículo será substituído.</p>
          {erroSalvar && <p aria-live="polite" className={styles.saveError} role="alert">{erroSalvar}</p>}
          <button className={styles.primaryButton} type="submit">Salvar currículo <span aria-hidden="true">↗</span></button>
          <Link className={styles.backLink} href="/">Voltar ao início</Link>
        </aside>
      </form>
    </main>
  );
}