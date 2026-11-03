// Carrega os estilos globais compartilhados por todas as rotas.
import "./globals.css";
// Cabeçalho e links principais compartilhados pelo site.
import Nav from "./components/Navegacao";
// Rodapé compartilhado pelo site.
import Footer from "./components/Footer";

// Metadados padrão usados pelo navegador e pelos mecanismos de busca.
export const metadata = {
  title: "Worclick | Seu currículo, novos caminhos",
  description: "Organize sua trajetória profissional com o Worclick.",
};

// Estrutura raiz do App Router; as páginas fornecidas em children ficam entre navegação e rodapé.
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
