"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
    id: "habilidades",
    titulo: "Competências e idiomas",
    descricao: "Complete seu perfil com outras habilidades relevantes.",
    campos: [
      { id: "competencias", label: "Competências", placeholder: "Ex.: Pesquisa, comunicação, organização", multiline: true },
      { id: "idiomas", label: "Idiomas", placeholder: "Ex.: Português (nativo), Inglês (intermediário)", multiline: true },
    ],
  },
];

const camposFormacao = [
  { id: "curso", label: "Curso", placeholder: "Ex.: Design Digital" },
  { id: "instituicao", label: "Instituição", placeholder: "Nome da instituição" },
  { id: "periodo", label: "Período cursado", placeholder: "Ex.: 2022 - 2025" },
  { id: "infoAcademica", label: "Informações adicionais", placeholder: "Atividades, certificações ou destaques.", multiline: true, full: true },
];

const camposProjeto = [
  { id: "projeto", label: "Nome do projeto", placeholder: "Nome do projeto" },
  { id: "tecnologias", label: "Tecnologias", placeholder: "Ex.: Figma, React" },
  { id: "descricao", label: "Descrição", placeholder: "Qual era o objetivo e qual foi sua contribuição?", multiline: true, full: true },
];

// Renderiza um campo com rótulo associado e seleciona textarea para respostas longas.
function Campo({ campo, id = campo.id, name = campo.id, onChange, required = campo.required, value }) {
  // Campos marcados como full ocupam a largura disponível no grid.
  const className = campo.full ? `${styles.field} ${styles.fieldFull}` : styles.field;
  // Propriedades comuns aos controles evitam repetir a mesma configuração no JSX.
  const propriedades = {
    className: campo.multiline ? styles.textarea : styles.input,
    id,
    name,
    onChange,
    required,
    value,
  };

  return (
    <label className={className} htmlFor={id}>
      <span>{campo.label}</span>
      {campo.options
        ? <select {...propriedades}>{campo.options.map((opcao) => <option key={opcao.value} value={opcao.value}>{opcao.label}</option>)}</select>
        : campo.multiline
          ? <textarea {...propriedades} autoComplete={campo.autocomplete} placeholder={campo.placeholder} />
          : <input {...propriedades} autoComplete={campo.autocomplete} placeholder={campo.placeholder} type={campo.type || "text"} />}
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
  // Mantém cada formação e projeto em uma lista para permitir incluir e remover entradas.
  const [formacoes, setFormacoes] = useState([
    { id: 0, curso: "", instituicao: "", periodo: "", concluido: "nao", dataConclusao: "", previsaoConclusao: "", infoAcademica: "" },
  ]);
  const [projetos, setProjetos] = useState([
    { id: 0, projeto: "", tecnologias: "", descricao: "" },
  ]);
  const proximoIdFormacao = useRef(1);
  const proximoIdProjeto = useRef(1);
  const proximoIdExperiencia = useRef(1);

  function atualizarExperiencia(id, campo, valor) {
    setExperiencias((atuais) => atuais.map((item) => (
      item.id === id ? { ...item, [campo]: valor } : item
    )));
  }

  // Atualiza um campo pelo identificador sem modificar a lista original.
  function atualizarItem(setItens, id, campo, valor) {
    setItens((atuais) => atuais.map((item) => (
      item.id === id ? { ...item, [campo]: valor } : item
    )));
  }

  function adicionarFormacao() {
    const id = proximoIdFormacao.current++;
    setFormacoes((atuais) => [
      ...atuais,
      {
        id,
        curso: "",
        instituicao: "",
        periodo: "",
        concluido: "nao",
        dataConclusao: "",
        previsaoConclusao: "",
        infoAcademica: "",
      },
    ]);
  }

  function adicionarExperiencia() {
    const id = proximoIdExperiencia.current++;
    setExperiencias((atuais) => [
      ...atuais,
      { id, empresa: "", cargo: "", periodo: "", responsabilidades: "" },
    ]);
  }

  function adicionarProjeto() {
    const id = proximoIdProjeto.current++;
    setProjetos((atuais) => [
      ...atuais,
      { id, projeto: "", tecnologias: "", descricao: "" },
    ]);
  }

  // Salva os grupos repetíveis como listas, omitindo entradas sem conteúdo.
  function salvarCurriculo(event) {
    event.preventDefault();
    const formulario = new FormData(event.currentTarget);
    const dados = {};

    formulario.forEach((valor, nome) => {
      if (!/^(experiencias|formacoes|projetos)\[/.test(nome)) dados[nome] = valor;
    });

    const registrosPreenchidos = (itens, ignorar = []) => itens
      .map(({ id, ...dadosExperiencia }) => dadosExperiencia)
      .filter((item) => Object.entries(item).some(
        ([campo, valor]) => !ignorar.includes(campo) && valor && valor.trim(),
      ));

    try {
      localStorage.setItem("worclick-curriculo", JSON.stringify({
        ...dados,
        experiencias: registrosPreenchidos(experiencias),
        formacoes: registrosPreenchidos(formacoes, ["concluido"]).map((formacao) => ({
          ...formacao,
          concluido: formacao.concluido === "sim",
        })),
        projetos: registrosPreenchidos(projetos),
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
        <p>Preencha os campos essenciais e inclua as experiências, formações e projetos que representam sua trajetória.</p>
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
                    onClick={adicionarExperiencia}
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

          <section aria-labelledby="titulo-formacao" className={styles.formSection}>
            <h2 id="titulo-formacao">Formação acadêmica</h2>
            <p>Adicione cursos e informe se cada formação foi concluída.</p>
            <ol className={styles.experienceList}>
              {formacoes.map((formacao, index) => {
                const preenchida = camposFormacao.some((campo) => formacao[campo.id].trim())
                  || Boolean(formacao.dataConclusao.trim() || formacao.previsaoConclusao.trim());
                const campoData = formacao.concluido === "sim"
                  ? { id: "dataConclusao", label: "Data de conclusão", placeholder: "Ex.: Dez/2025" }
                  : { id: "previsaoConclusao", label: "Previsão de conclusão", placeholder: "Ex.: Dez/2026" };

                return (
                  <li key={formacao.id}>
                    <fieldset className={styles.experienceEntry}>
                      <legend>Formação {index + 1}</legend>
                      <Campo
                        campo={{
                          id: "concluido",
                          label: "Curso concluído?",
                          options: [
                            { value: "nao", label: "Não, em andamento" },
                            { value: "sim", label: "Sim, concluído" },
                          ],
                        }}
                        id={`concluido-${formacao.id}`}
                        name={`formacoes[${index}][concluido]`}
                        onChange={(event) => atualizarItem(setFormacoes, formacao.id, "concluido", event.target.value)}
                        value={formacao.concluido}
                      />
                      {camposFormacao.slice(0, 3).map((campo) => (
                        <Campo
                          campo={campo}
                          id={`${campo.id}-${formacao.id}`}
                          key={campo.id}
                          name={`formacoes[${index}][${campo.id}]`}
                          onChange={(event) => atualizarItem(setFormacoes, formacao.id, campo.id, event.target.value)}
                          required={preenchida}
                          value={formacao[campo.id]}
                        />
                      ))}
                      <Campo
                        campo={campoData}
                        id={`${campoData.id}-${formacao.id}`}
                        name={`formacoes[${index}][${campoData.id}]`}
                        onChange={(event) => atualizarItem(setFormacoes, formacao.id, campoData.id, event.target.value)}
                        required={preenchida}
                        value={formacao[campoData.id]}
                      />
                      <Campo
                        campo={camposFormacao[3]}
                        id={`infoAcademica-${formacao.id}`}
                        name={`formacoes[${index}][infoAcademica]`}
                        onChange={(event) => atualizarItem(setFormacoes, formacao.id, "infoAcademica", event.target.value)}
                        value={formacao.infoAcademica}
                      />
                      {formacoes.length > 1 && (
                        <button
                          aria-label={`Remover formação ${index + 1}`}
                          className={styles.removeButton}
                          onClick={() => setFormacoes((atuais) => atuais.filter((item) => item.id !== formacao.id))}
                          type="button"
                        >
                          Remover formação
                        </button>
                      )}
                    </fieldset>
                  </li>
                );
              })}
            </ol>
            <button
              className={styles.addButton}
              onClick={adicionarFormacao}
              type="button"
            >
              Adicionar formação
            </button>
          </section>

          <section aria-labelledby="titulo-projetos" className={styles.formSection}>
            <h2 id="titulo-projetos">Projetos em destaque</h2>
            <p>Apresente trabalhos que mostram como você aplica seus conhecimentos.</p>
            <ol className={styles.experienceList}>
              {projetos.map((projeto, index) => {
                const preenchido = camposProjeto.some((campo) => projeto[campo.id].trim());

                return (
                  <li key={projeto.id}>
                    <fieldset className={styles.experienceEntry}>
                      <legend>Projeto {index + 1}</legend>
                      {camposProjeto.map((campo) => (
                        <Campo
                          campo={campo}
                          id={`${campo.id}-${projeto.id}`}
                          key={campo.id}
                          name={`projetos[${index}][${campo.id}]`}
                          onChange={(event) => atualizarItem(setProjetos, projeto.id, campo.id, event.target.value)}
                          required={preenchido}
                          value={projeto[campo.id]}
                        />
                      ))}
                      {projetos.length > 1 && (
                        <button
                          aria-label={`Remover projeto ${index + 1}`}
                          className={styles.removeButton}
                          onClick={() => setProjetos((atuais) => atuais.filter((item) => item.id !== projeto.id))}
                          type="button"
                        >
                          Remover projeto
                        </button>
                      )}
                    </fieldset>
                  </li>
                );
              })}
            </ol>
            <button
              className={styles.addButton}
              onClick={adicionarProjeto}
              type="button"
            >
              Adicionar projeto
            </button>
          </section>
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