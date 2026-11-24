import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from "node:crypto";

// Mantém usuários e sessões disponíveis entre recargas do módulo em desenvolvimento.
const database = globalThis.worclickDatabase ??= {
  users: [],
  sessions: [],
};

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

// Armazena somente o salt e o hash da senha, nunca a senha original.
function gerarHashSenha(senha, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(senha, salt, 64).toString("hex");
  return { salt, hash };
}

export function buscarUsuario(email) {
  const emailNormalizado = normalizarEmail(email);
  return database.users.find((usuario) => usuario.email === emailNormalizado) ?? null;
}

// Adiciona à lista em memória e rejeita endereços já cadastrados.
export function criarUsuario({ nome, email, senha }) {
  const emailNormalizado = normalizarEmail(email);
  if (buscarUsuario(emailNormalizado)) return null;

  const { salt, hash } = gerarHashSenha(senha);
  const usuario = {
    id: randomUUID(),
    nome: nome.trim(),
    email: emailNormalizado,
    salt,
    hash,
  };
  database.users.push(usuario);
  return usuario;
}

// Compara hashes de tamanho fixo para evitar comparação direta de senhas.
export function verificarSenha(usuario, senha) {
  const hashInformado = Buffer.from(gerarHashSenha(senha, usuario.salt).hash, "hex");
  const hashArmazenado = Buffer.from(usuario.hash, "hex");
  return timingSafeEqual(hashInformado, hashArmazenado);
}

// Cria um token aleatório com prazo de validade de sete dias.
export function criarSessao(usuarioId) {
  const token = randomBytes(32).toString("hex");
  database.sessions.push({
    token,
    usuarioId,
    expiraEm: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

// Recupera o usuário da sessão e remove o registro se ela expirou.
export function buscarUsuarioDaSessao(token) {
  const sessao = database.sessions.find((item) => item.token === token);
  if (!sessao) return null;

  if (sessao.expiraEm <= Date.now()) {
    database.sessions = database.sessions.filter((item) => item.token !== token);
    return null;
  }

  const usuario = database.users.find((item) => item.id === sessao.usuarioId);
  return usuario ? { id: usuario.id, nome: usuario.nome, email: usuario.email } : null;
}

// Invalida o token no servidor ao encerrar a sessão.
export function removerSessao(token) {
  database.sessions = database.sessions.filter((item) => item.token !== token);
}
