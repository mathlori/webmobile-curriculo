// Campos textuais aceitos no corpo; experiências são validadas separadamente.
const camposTexto = [
  "nome",
  "titulo",
  "cidade",
  "telefone",
  "email",
  "linkedin",
  "portfolio",
  "resumo",
  "curso",
  "instituicao",
  "periodo-curso",
  "conclusao",
  "infoAcademica",
  "projeto",
  "tecnologias",
  "descricao-projeto",
  "competencias",
  "idiomas",
];

// Evita que o conteúdo do currículo seja interpretado como marcação HTML.
function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

// Preserva as quebras de linha dos campos longos no documento.
function textoComQuebras(texto) {
  return escaparHtml(texto).replace(/\r?\n/g, "<br>");
}

// Não inclui seções que não tenham conteúdo.
function secao(titulo, conteudo) {
  return conteudo ? `<section><h2>${titulo}</h2>${conteudo}</section>` : "";
}

// Remove acentos e caracteres especiais para formar um nome de arquivo seguro.
function normalizarNome(nome) {
  const slug = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `curriculo-${slug || "profissional"}.doc`;
}

// Monta o documento e omite experiências e seções que estejam vazias.
function gerarDocumento(dados) {
  const contato = ["cidade", "telefone", "email", "linkedin", "portfolio"]
    .map((campo) => dados[campo])
    .filter(Boolean)
    .map(escaparHtml)
    .join(" | ");

  const experiencias = dados.experiencias
    .filter((experiencia) => Object.values(experiencia).some(Boolean))
    .map((experiencia) => `
      <article>
        <h3>${escaparHtml(experiencia.cargo || "Experiência profissional")}</h3>
        <p><strong>${escaparHtml(experiencia.empresa)}</strong>${experiencia.periodo ? ` | ${escaparHtml(experiencia.periodo)}` : ""}</p>
        ${experiencia.responsabilidades ? `<p>${textoComQuebras(experiencia.responsabilidades)}</p>` : ""}
      </article>
    `)
    .join("");

  const formacoes = dados.formacoes
    .filter((formacao) => [
      formacao.curso,
      formacao.instituicao,
      formacao.periodo,
      formacao.dataConclusao,
      formacao.previsaoConclusao,
      formacao.infoAcademica,
    ].some(Boolean))
    .map((formacao) => {
      const data = formacao.concluido
        ? formacao.dataConclusao && `Conclusão: ${escaparHtml(formacao.dataConclusao)}`
        : formacao.previsaoConclusao && `Previsão: ${escaparHtml(formacao.previsaoConclusao)}`;
      return `<article>
        <h3>${escaparHtml(formacao.curso || "Formação acadêmica")}</h3>
        <p><strong>${escaparHtml(formacao.instituicao)}</strong>${formacao.periodo ? ` | ${escaparHtml(formacao.periodo)}` : ""}${data ? ` | ${data}` : ""}</p>
        ${formacao.infoAcademica ? `<p>${textoComQuebras(formacao.infoAcademica)}</p>` : ""}
      </article>`;
    })
    .join("");

  const projetos = dados.projetos
    .filter((projeto) => Object.values(projeto).some(Boolean))
    .map((projeto) => `<article>
      <h3>${escaparHtml(projeto.projeto || "Projeto")}</h3>
      ${projeto.tecnologias ? `<p><strong>Tecnologias:</strong> ${escaparHtml(projeto.tecnologias)}</p>` : ""}
      ${projeto.descricao ? `<p>${textoComQuebras(projeto.descricao)}</p>` : ""}
    </article>`)
    .join("");

  const paragrafo = (texto) => texto ? `<p>${textoComQuebras(texto)}</p>` : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Currículo - ${escaparHtml(dados.nome)}</title>
    <style>
      body { color: #202020; font: 11pt/1.45 Arial, sans-serif; margin: 36px auto; max-width: 760px; }
      header { text-align: center; }
      h1 { font-size: 21pt; margin: 0 0 4px; }
      h2 { border-bottom: 1px solid #202020; font-size: 12pt; margin: 18px 0 7px; padding-bottom: 3px; text-transform: uppercase; }
      h3 { font-size: 11pt; margin: 10px 0 1px; }
      p { margin: 3px 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escaparHtml(dados.nome)}</h1>
      <p><strong>${escaparHtml(dados.titulo)}</strong></p>
      <p>${contato}</p>
    </header>
    ${secao("Resumo profissional", paragrafo(dados.resumo))}
    ${secao("Experiência profissional", experiencias)}
    ${secao("Formação acadêmica", formacoes)}
    ${secao("Projetos em destaque", projetos)}
    ${secao("Competências", paragrafo(dados.competencias))}
    ${secao("Idiomas", paragrafo(dados.idiomas))}
  </body>
</html>`;
}

// Valida os dados enviados antes de gerar o documento para download.
export async function POST(request) {
  let corpo;

  try {
    corpo = await request.json();
  } catch {
    return Response.json({ error: "O corpo da requisição deve conter um JSON válido." }, { status: 400 });
  }

  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    return Response.json({ error: "Os dados do currículo são inválidos." }, { status: 400 });
  }

  if (camposTexto.some((campo) => corpo[campo] !== undefined && typeof corpo[campo] !== "string")) {
    return Response.json({ error: "Os campos do currículo devem conter texto." }, { status: 400 });
  }

  if (!corpo.nome?.trim() || !corpo.titulo?.trim() || !corpo.cidade?.trim() || !corpo.email?.trim()) {
    return Response.json({ error: "Nome, título profissional, cidade e e-mail são obrigatórios." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corpo.email.trim())) {
    return Response.json({ error: "Informe um e-mail válido para gerar o currículo." }, { status: 400 });
  }

  const listas = [
    { nome: "experiencias", campos: ["empresa", "cargo", "periodo", "responsabilidades"] },
    {
      nome: "formacoes",
      campos: ["curso", "instituicao", "periodo", "dataConclusao", "previsaoConclusao", "infoAcademica"],
      booleanos: ["concluido"],
    },
    { nome: "projetos", campos: ["projeto", "tecnologias", "descricao"] },
  ];

  for (const lista of listas) {
    const registros = corpo[lista.nome] ?? [];
    const registroInvalido = !Array.isArray(registros) || registros.some((registro) => (
      !registro
      || typeof registro !== "object"
      || Array.isArray(registro)
      || lista.campos.some((campo) => registro[campo] !== undefined && typeof registro[campo] !== "string")
      || (lista.booleanos || []).some((campo) => registro[campo] !== undefined && typeof registro[campo] !== "boolean")
    ));

    if (registroInvalido) {
      return Response.json({ error: `A lista de ${lista.nome} é inválida.` }, { status: 400 });
    }
  }

  // Normaliza campos opcionais para simplificar a renderização do documento.
  const dados = Object.fromEntries(camposTexto.map((campo) => [campo, corpo[campo]?.trim() ?? ""]));
  dados.experiencias = (corpo.experiencias ?? []).map((experiencia) => ({
    empresa: experiencia.empresa?.trim() ?? "",
    cargo: experiencia.cargo?.trim() ?? "",
    periodo: experiencia.periodo?.trim() ?? "",
    responsabilidades: experiencia.responsabilidades?.trim() ?? "",
  }));
  dados.formacoes = (corpo.formacoes ?? (
    dados.curso || dados.instituicao || dados["periodo-curso"] || dados.conclusao || dados.infoAcademica
      ? [{
        curso: dados.curso,
        instituicao: dados.instituicao,
        periodo: dados["periodo-curso"],
        concluido: false,
        previsaoConclusao: dados.conclusao,
        infoAcademica: dados.infoAcademica,
      }]
      : []
  )).map((formacao) => ({
    curso: formacao.curso?.trim() ?? "",
    instituicao: formacao.instituicao?.trim() ?? "",
    periodo: formacao.periodo?.trim() ?? "",
    concluido: formacao.concluido ?? false,
    dataConclusao: formacao.dataConclusao?.trim() ?? "",
    previsaoConclusao: formacao.previsaoConclusao?.trim() ?? "",
    infoAcademica: formacao.infoAcademica?.trim() ?? "",
  }));
  dados.projetos = (corpo.projetos ?? (
    dados.projeto || dados.tecnologias || dados["descricao-projeto"]
      ? [{
        projeto: dados.projeto,
        tecnologias: dados.tecnologias,
        descricao: dados["descricao-projeto"],
      }]
      : []
  )).map((projeto) => ({
    projeto: projeto.projeto?.trim() ?? "",
    tecnologias: projeto.tecnologias?.trim() ?? "",
    descricao: projeto.descricao?.trim() ?? "",
  }));
  const documento = gerarDocumento(dados);

  // Entrega o documento como anexo e evita cache de dados pessoais.
  return new Response(documento, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${normalizarNome(dados.nome)}"`,
      "Content-Type": "application/msword; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
