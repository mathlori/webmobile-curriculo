const campos = ["nome", "titulo", "cidade", "telefone", "email", "linkedin", "github", "resumo", "empresa", "cargo", "periodo", "responsabilidades", "curso", "instituicao", "semestre", "conclusao", "infoAcademica", "projeto", "tecnologias", "descricao", "competencias", "idiomas"];

// Obtém o valor da textarea com base no id
function valor(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function coletarCurriculo() {
    // Obtém cada texto escrito em cada id
    const dados = {};
    campos.forEach((id) => {
        dados[id] = valor(id);
    });
    return dados;
}
// FUNÇÕES DE SUPORTE PARA CRIAÇÃO DO DOCUMENTO WORD

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
//====================================================

// Cria o html do currículo com base nos dados preenchidos
function gerarDocumento(dados) {
    const contato = [dados.cidade, dados.telefone, dados.email, dados.linkedin, dados.github].filter(Boolean).map(escapar).join(" | ");
    const experiencia = dados.empresa || dados.cargo || dados.periodo || dados.responsabilidades ? `<h3>${escapar(dados.cargo || "Experiência profissional")}</h3><p><strong>${escapar(dados.empresa)}</strong>${dados.periodo ? ` | ${escapar(dados.periodo)}` : ""}</p><p>${paragrafo(dados.responsabilidades)}</p>` : "";
    const formacao = dados.curso || dados.instituicao || dados.semestre || dados.conclusao || dados.infoAcademica ? `<h3>${escapar(dados.curso || "Formação acadêmica")}</h3><p><strong>${escapar(dados.instituicao)}</strong>${dados.semestre ? ` | ${escapar(dados.semestre)}` : ""}${dados.conclusao ? ` | Conclusão: ${escapar(dados.conclusao)}` : ""}</p><p>${paragrafo(dados.infoAcademica)}</p>` : "";
    const projeto = dados.projeto || dados.tecnologias || dados.descricao ? `<h3>${escapar(dados.projeto || "Projeto")}</h3><p><strong>Tecnologias:</strong> ${escapar(dados.tecnologias)}</p><p>${paragrafo(dados.descricao)}</p>` : "";
    const lista = (texto) => texto ? `<p>${paragrafo(texto)}</p>` : "";
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Currículo - ${escapar(dados.nome || "Profissional")}</title><style>body{font-family:Arial,sans-serif;color:#202020;max-width:760px;margin:36px auto;line-height:1.45;font-size:11pt}h1{text-align:center;font-size:21pt;margin:0 0 4px}h2{font-size:12pt;text-transform:uppercase;border-bottom:1px solid #202020;margin:18px 0 7px;padding-bottom:3px}h3{font-size:11pt;margin:10px 0 1px}p{margin:3px 0}header{text-align:center}strong{font-weight:bold}</style></head><body><header><h1>${escapar(dados.nome || "Currículo profissional")}</h1><p><strong>${escapar(dados.titulo)}</strong></p><p>${contato}</p></header>${secao("Resumo profissional", lista(dados.resumo))}${secao("Experiência profissional", experiencia)}${secao("Formação acadêmica", formacao)}${secao("Projetos em destaque", projeto)}${secao("Competências", lista(dados.competencias))}${secao("Idiomas", lista(dados.idiomas))}</body></html>`;
}

// Cria um elemento html para apresentar o status
function mostrarStatus(mensagem, erro = false) {
    let status = document.getElementById("status-geracao");
    if (!status) {
        status = document.createElement("p");
        status.id = "status-geracao";
        status.setAttribute("role", "status");
        document.getElementById("enviar")?.after(status);
    }
    status.style.color = erro ? "#d9534f" : "#28a745";
    status.style.marginTop = "10px";
    status.style.fontWeight = "bold";   
    status.textContent = mensagem;
}

function verificarDados(dados) {
    Object.entries(dados).forEach(function([chave, valor]) {
        switch (chave) {
            case "nome":
                if (length(valor.split(";") <= 1)) return 0;
        }
    });
}

function validador(dados) {
    const dados = coletarCurriculo();

    // 1. Validar Nome Completo (obrigatório)
    if (!dados.nome) {
        mostrarStatus("Por favor, preencha o seu nome completo.", true);
        document.getElementById("nome")?.focus();
        return -1;
    }

    // 2. Validar E-mail (precisa conter '@' e um ponto após o '@')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dados.email || !emailRegex.test(dados.email)) {
        mostrarStatus("Por favor, insira um e-mail válido (ex: nome@email.com).", true);
        document.getElementById("email")?.focus();
        return -1;
    }

    // 3. Validar Telefone (exigir DDD e números mínimos)
    // Remove caracteres não numéricos para contagem básica (mínimo de 10 dígitos considerando DDD + número)
    const apenasNumerosTel = dados.telefone.replace(/\D/g, "");
    if (!dados.telefone || apenasNumerosTel.length < 10) {
        mostrarStatus("Por favor, insira um telefone válido contendo o DDD (ex: +55 11 99999-9999).", true);
        document.getElementById("telefone")?.focus();
        return -1;
    }

    // 4. Validar Título ou Área Profissional
    if (!dados.titulo) {
        mostrarStatus("Por favor, preencha o seu título ou área profissional.", true);
        document.getElementById("titulo")?.focus();
        return -1;
    }
}

// Interação para baixar arquivo Word
function iniciarProcessamento() {
    
    let validador = validador(dados);

    if (validador === -1) return;
    
    // Se todas as validações passarem, gera o documento Word
    const arquivo = new Blob([gerarDocumento(dados)], { type: "application/msword;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = `curriculo-${dados.nome.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "profissional"}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    mostrarStatus("Currículo gerado com sucesso! O download do arquivo Word foi iniciado.");
}