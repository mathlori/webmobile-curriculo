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

function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

function textoComQuebras(texto) {
  return escaparHtml(texto).replace(/\r?\n/g, "<br>");
}

function secao(titulo, conteudo) {
  return conteudo ? `<section><h2>${titulo}</h2>${conteudo}</section>` : "";
}

function normalizarNome(nome) {
  const slug = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `curriculo-${slug || "profissional"}.doc`;
}

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

  const formacao = [dados.curso, dados.instituicao, dados["periodo-curso"], dados.conclusao, dados.infoAcademica]
    .some(Boolean)
    ? `<article>
        <h3>${escaparHtml(dados.curso || "Formação acadêmica")}</h3>
        <p><strong>${escaparHtml(dados.instituicao)}</strong>${dados["periodo-curso"] ? ` | ${escaparHtml(dados["periodo-curso"])}` : ""}${dados.conclusao ? ` | Conclusão: ${escaparHtml(dados.conclusao)}` : ""}</p>
        ${dados.infoAcademica ? `<p>${textoComQuebras(dados.infoAcademica)}</p>` : ""}
      </article>`
    : "";

  const projeto = [dados.projeto, dados.tecnologias, dados["descricao-projeto"]]
    .some(Boolean)
    ? `<article>
        <h3>${escaparHtml(dados.projeto || "Projeto")}</h3>
        ${dados.tecnologias ? `<p><strong>Tecnologias:</strong> ${escaparHtml(dados.tecnologias)}</p>` : ""}
        ${dados["descricao-projeto"] ? `<p>${textoComQuebras(dados["descricao-projeto"])}</p>` : ""}
      </article>`
    : "";

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
    ${secao("Formação acadêmica", formacao)}
    ${secao("Projetos em destaque", projeto)}
    ${secao("Competências", paragrafo(dados.competencias))}
    ${secao("Idiomas", paragrafo(dados.idiomas))}
  </body>
</html>`;
}

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

  const experiencias = corpo.experiencias ?? [];
  if (!Array.isArray(experiencias) || experiencias.some((experiencia) => (
    !experiencia
    || typeof experiencia !== "object"
    || Array.isArray(experiencia)
    || ["empresa", "cargo", "periodo", "responsabilidades"].some(
      (campo) => experiencia[campo] !== undefined && typeof experiencia[campo] !== "string",
    )
  ))) {
    return Response.json({ error: "As experiências profissionais são inválidas." }, { status: 400 });
  }

  const dados = Object.fromEntries(camposTexto.map((campo) => [campo, corpo[campo]?.trim() ?? ""]));
  dados.experiencias = experiencias.map((experiencia) => ({
    empresa: experiencia.empresa?.trim() ?? "",
    cargo: experiencia.cargo?.trim() ?? "",
    periodo: experiencia.periodo?.trim() ?? "",
    responsabilidades: experiencia.responsabilidades?.trim() ?? "",
  }));
  const documento = gerarDocumento(dados);

  return new Response(documento, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${normalizarNome(dados.nome)}"`,
      "Content-Type": "application/msword; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
