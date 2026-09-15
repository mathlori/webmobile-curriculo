const campos = ["nome", "titulo", "cidade", "telefone", "email", "linkedin", "github", "resumo", "empresa", "cargo", "periodo", "responsabilidades", "curso", "instituicao", "semestre", "conclusao", "infoAcademica", "projeto", "tecnologias", "descricao", "competencias", "idiomas"];

function valor(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function coletarCurriculo() {
    const dados = {};
    campos.forEach((id) => {
        dados[id] = valor(id);
    });
    return dados;
}

function escapar(texto) {
    return texto.replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[caractere]);
}

function paragrafo(texto) {
    return texto ? escapar(texto).replace(/\n/g, "<br>") : "";
}

function secao(titulo, conteudo) {
    return conteudo ? `<h2>${titulo}</h2>${conteudo}` : "";
}

function gerarDocumento(dados) {
    const contato = [dados.cidade, dados.telefone, dados.email, dados.linkedin, dados.github].filter(Boolean).map(escapar).join(" | ");
    const experiencia = dados.empresa || dados.cargo || dados.periodo || dados.responsabilidades ? `<h3>${escapar(dados.cargo || "Experiência profissional")}</h3><p><strong>${escapar(dados.empresa)}</strong>${dados.periodo ? ` | ${escapar(dados.periodo)}` : ""}</p><p>${paragrafo(dados.responsabilidades)}</p>` : "";
    const formacao = dados.curso || dados.instituicao || dados.semestre || dados.conclusao || dados.infoAcademica ? `<h3>${escapar(dados.curso || "Formação acadêmica")}</h3><p><strong>${escapar(dados.instituicao)}</strong>${dados.semestre ? ` | ${escapar(dados.semestre)}` : ""}${dados.conclusao ? ` | Conclusão: ${escapar(dados.conclusao)}` : ""}</p><p>${paragrafo(dados.infoAcademica)}</p>` : "";
    const projeto = dados.projeto || dados.tecnologias || dados.descricao ? `<h3>${escapar(dados.projeto || "Projeto")}</h3><p><strong>Tecnologias:</strong> ${escapar(dados.tecnologias)}</p><p>${paragrafo(dados.descricao)}</p>` : "";
    const lista = (texto) => texto ? `<p>${paragrafo(texto)}</p>` : "";
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Currículo - ${escapar(dados.nome || "Profissional")}</title><style>body{font-family:Arial,sans-serif;color:#202020;max-width:760px;margin:36px auto;line-height:1.45;font-size:11pt}h1{text-align:center;font-size:21pt;margin:0 0 4px}h2{font-size:12pt;text-transform:uppercase;border-bottom:1px solid #202020;margin:18px 0 7px;padding-bottom:3px}h3{font-size:11pt;margin:10px 0 1px}p{margin:3px 0}header{text-align:center}strong{font-weight:bold}</style></head><body><header><h1>${escapar(dados.nome || "Currículo profissional")}</h1><p><strong>${escapar(dados.titulo)}</strong></p><p>${contato}</p></header>${secao("Resumo profissional", lista(dados.resumo))}${secao("Experiência profissional", experiencia)}${secao("Formação acadêmica", formacao)}${secao("Projetos em destaque", projeto)}${secao("Competências", lista(dados.competencias))}${secao("Idiomas", lista(dados.idiomas))}</body></html>`;
}

function mostrarStatus(mensagem) {
    let status = document.getElementById("status-geracao");
    if (!status) {
        status = document.createElement("p");
        status.id = "status-geracao";
        status.setAttribute("role", "status");
        document.getElementById("enviar")?.after(status);
    }
    status.textContent = mensagem;
}

function gerarCurriculo() {
    const dados = coletarCurriculo();
    if (!dados.nome) {
        mostrarStatus("Preencha pelo menos o nome completo para gerar o currículo.");
        document.getElementById("nome")?.focus();
        return;
    }
    const arquivo = new Blob([gerarDocumento(dados)], { type: "application/msword;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = `curriculo-${dados.nome.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "profissional"}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarStatus("Currículo gerado. O download do arquivo Word foi iniciado.");
}