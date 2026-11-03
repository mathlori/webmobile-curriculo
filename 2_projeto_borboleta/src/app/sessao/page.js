// Interface compartilhada entre cadastro e início de sessão.
import Acesso from "../components/Acesso";

// Define a rota /sessao e seleciona o modo de acesso de quem já tem cadastro.
export default function SessaoPage() {
  return <Acesso modo="sessao" />;
}