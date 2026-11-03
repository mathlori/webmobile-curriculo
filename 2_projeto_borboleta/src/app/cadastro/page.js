// Reutiliza a interface compartilhada de acesso no modo de cadastro.
import Acesso from "../components/Acesso";

// Define a rota /cadastro e informa ao componente qual variação deve exibir.
export default function CadastroPage() {
  return <Acesso modo="cadastro" />;
}