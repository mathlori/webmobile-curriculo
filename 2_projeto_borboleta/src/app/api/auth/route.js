import {
  buscarUsuario,
  buscarUsuarioDaSessao,
  criarSessao,
  criarUsuario,
  removerSessao,
  verificarSenha,
} from "@/lib/db";

const nomeCookie = "worclick-session";
const duracaoSessao = 7 * 24 * 60 * 60;

function lerToken(request) {
  const cookie = request.headers.get("cookie") || "";
  const item = cookie.split(";").map((parte) => parte.trim())
    .find((parte) => parte.startsWith(`${nomeCookie}=`));
  return item?.slice(nomeCookie.length + 1) || "";
}

// Centraliza respostas sem cache e a configuração do cookie de sessão.
function respostaJson(dados, status = 200, token) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  });

  if (token !== undefined) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    headers.set(
      "Set-Cookie",
      `${nomeCookie}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${token ? duracaoSessao : 0}${secure}`,
    );
  }

  return Response.json(dados, { status, headers });
}

// Retorna somente os dados públicos do usuário associado ao cookie de sessão.
export async function GET(request) {
  const usuario = buscarUsuarioDaSessao(lerToken(request));
  return usuario
    ? respostaJson({ usuario })
    : respostaJson({ usuario: null }, 401);
}

// Cadastra uma conta ou verifica as credenciais e inicia uma sessão.
export async function POST(request) {
  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return respostaJson({ error: "Envie os dados de acesso em um JSON válido." }, 400);
  }

  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    return respostaJson({ error: "Os dados de acesso são inválidos." }, 400);
  }

  const email = typeof corpo.email === "string" ? corpo.email.trim() : "";
  const senha = typeof corpo.senha === "string" ? corpo.senha : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 8 || senha.length > 128) {
    return respostaJson({ error: "Informe um e-mail válido e uma senha de 8 a 128 caracteres." }, 400);
  }

  let usuario;
  if (corpo.acao === "cadastro") {
    const nome = typeof corpo.nome === "string" ? corpo.nome.trim() : "";
    if (nome.length < 2 || nome.length > 100) {
      return respostaJson({ error: "Informe um nome com pelo menos 2 caracteres." }, 400);
    }

    usuario = criarUsuario({ nome, email, senha });
    if (!usuario) {
      return respostaJson({ error: "Já existe uma conta cadastrada com este e-mail." }, 409);
    }
  } else if (corpo.acao === "login") {
    usuario = buscarUsuario(email);
    if (!usuario || !verificarSenha(usuario, senha)) {
      return respostaJson({ error: "E-mail ou senha incorretos." }, 401);
    }
  } else {
    return respostaJson({ error: "Ação de acesso inválida." }, 400);
  }

  const token = criarSessao(usuario.id);
  return respostaJson({ usuario: { nome: usuario.nome, email: usuario.email } }, 200, token);
}

// Encerra a sessão atual e invalida o cookie no navegador.
export async function DELETE(request) {
  const token = lerToken(request);
  if (token) removerSessao(token);
  return respostaJson({ usuario: null }, 200, "");
}
