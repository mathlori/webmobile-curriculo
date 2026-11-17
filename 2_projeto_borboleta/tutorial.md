# Worclick - Evolução do projeto

## Objetivo desta etapa

O projeto anterior, na pasta `1_projeto_lagarta`, apresenta o Worclick em HTML, CSS e JavaScript. Nesta etapa, a interface está sendo migrada para React com Next.js: o foco é construir as telas do wireframe, adaptar a experiência para celular e permitir a navegação entre elas.

O projeto oferece cadastro e login com sessão, formulário para várias experiências, formações e projetos, e download do currículo gerado por uma API. Os dados do currículo continuam no armazenamento local do navegador. Não há opção de envio por Telegram ou por outro serviço de mensagens.

## Wireframe da jornada

![Wireframe do Worclick: início, sessão, cadastro, criação do currículo e escolha de recebimento](wireframe-do-projeto.jpg)

O esboço conecta cinco momentos do uso: apresentação do Worclick, início de sessão, cadastro, preenchimento do currículo e conclusão. Essa sequência dá contexto às rotas e às alterações descritas a seguir. A interface React implementada segue esses momentos, e a conclusão permite baixar o currículo gerado pela API.

## O que esta etapa inclui

- Páginas responsivas para início, sessão, cadastro, preenchimento do currículo e conclusão.
- Navegação entre as telas com o roteamento do Next.js.
- Campos organizados pelos mesmos grupos de informação do formulário HTML original, com validação nativa dos campos obrigatórios e dos formatos de e-mail e URL.
- Inclusão e remoção de experiências profissionais; ao começar a preencher uma experiência, todos os campos dessa entrada tornam-se obrigatórios.
- Inclusão e remoção de várias formações acadêmicas e projetos; a formação alterna entre curso em andamento e concluído.
- Cadastro e login com usuários mantidos em memória no servidor, senhas armazenadas como hash e sessão em cookie HttpOnly.
- Salvamento de um único currículo no armazenamento local do navegador. Um novo salvamento substitui o anterior.
- Geração de um documento Word pela API e download na página de conclusão.

## Migração para Next.js

A migração parte dos arquivos `index.html`, `style.css` e `script.js` da pasta `1_projeto_lagarta`. Em vez de concentrar toda a interface em um único documento, o Next.js organiza cada tela em um arquivo `page.js` dentro de uma pasta de rota. O componente `layout.js` compartilha o cabeçalho, a navegação e o rodapé entre essas páginas.

| Projeto HTML/CSS/JS | Projeto React/Next.js |
| --- | --- |
| `index.html` e seus blocos de conteúdo | `src/app/page.js` para o início e páginas próprias para cada rota |
| Elementos repetidos do cabeçalho | `src/app/components/Navegacao.js`, incluído pelo layout compartilhado e estruturado com `header`, `nav`, `ul` e `li` |
| Campos do formulário no HTML | Grupos de campos renderizados em `src/app/curriculo/page.js` |
| `style.css` | `src/app/globals.css` para regras globais e CSS Modules específicos para cada tela e componente |
| Links e navegação da página única | `next/link` e pastas do App Router |
| `script.js` para validar dados e gerar Word | A validação dos formulários usa recursos nativos do HTML; `src/app/api/gera_curriculo/route.js` gera o documento Word no servidor |

O visual também foi aproximado do original: o azul `#0056b3` permanece como cor principal, com fundo cinza-claro, áreas de conteúdo brancas, campos com bordas neutras e rodapé grafite. A home conserva a apresentação do Worclick e exemplos decorativos de currículo. O formulário organiza os campos em grupos temáticos e oferece controles para adicionar e remover experiências, formações e projetos.

O App Router associa a pasta ao endereço: `src/app/sessao/page.js` atende `/sessao`; `src/app/cadastro/page.js` atende `/cadastro`; `src/app/curriculo/page.js` atende `/curriculo`; e `src/app/curriculo/concluido/page.js` atende `/curriculo/concluido`. Os componentes de página são React e a navegação usa `Link`, sem recarregar o documento inteiro.

Os formulários de sessão e cadastro validam os dados no navegador e também os enviam à API `/api/auth`. O cadastro adiciona o usuário à lista em memória do servidor; o login só é aceito para uma conta existente com senha correspondente. Após autenticar, a API cria uma sessão e define um cookie HttpOnly. A navegação mostra o nome e a ação para encerrar a sessão enquanto o cookie for válido. No formulário, nome, título profissional, cidade e e-mail são obrigatórios; campos de e-mail e URL também são validados pelo navegador. Ao salvar, os dados do currículo são gravados localmente e a pessoa segue para a conclusão, onde pode baixar o documento Word gerado pela API.

## 1. Rotas do site

As rotas abaixo representam telas da aplicação ou endpoints da API. Elas não carregam identificadores ou outros valores na URL. Os dados do currículo são salvos no armazenamento local do navegador; a API os recebe somente para gerar o documento solicitado.

| Rota | Tela | Comportamento |
| --- | --- | --- |
| `/` | Início do site | Apresenta o Worclick e oferece acesso para iniciar uma sessão ou criar um currículo. |
| `/sessao` | Acesso à conta | Envia e-mail e senha à API e inicia uma sessão quando as credenciais correspondem a um usuário cadastrado. |
| `/cadastro` | Cadastro | Envia nome, e-mail e senha à API, registra um usuário e inicia uma sessão. |
| `/curriculo` | Criar currículo | Permite preencher os dados, adicionar ou remover experiências, formações e projetos e salvar o currículo no navegador. |
| `/curriculo/concluido` | Conclusão | Confirma o salvamento e permite gerar e baixar o currículo em formato Word. |
| `/api/auth` | Cadastro e sessão | `POST` cadastra ou autentica; `GET` consulta a sessão atual; `DELETE` encerra a sessão. |
| `/api/gera_curriculo` | API de geração | Recebe os dados do currículo em JSON via `POST` e responde com um documento Word para download. |

O roteador associa cada caminho a uma tela e indica uma tela de não encontrado para caminhos inválidos. Ao acessar diretamente uma dessas rotas, o servidor de hospedagem também deverá entregar a aplicação; caso contrário, a atualização do navegador pode resultar em erro 404.

O login cria uma sessão, mas as páginas do currículo não exigem essa sessão para serem abertas. A autenticação desta etapa não deve ser tratada como autorização para proteger dados ou operações no servidor. Como as URLs não têm parâmetros, dados pessoais não devem ser colocados no caminho.

## 2. Navegação das telas

1. A pessoa acessa `/` e escolhe acessar uma conta existente ou fazer o cadastro.
2. Em `/sessao` ou `/cadastro`, envia os campos à API. No cadastro, o servidor cria a conta; no login, confere o e-mail e a senha. Em caso de sucesso, a resposta define o cookie de sessão e a pessoa segue para `/curriculo`.
3. Em `/curriculo`, preenche dados pessoais e competências, além de adicionar ou remover experiências, formações e projetos. Uma experiência ou projeto parcialmente preenchido exige o preenchimento de todos os seus campos. A formação indica se o curso foi concluído e solicita a data de conclusão ou a previsão correspondente.
4. Ao salvar, o formulário grava um único objeto JSON com a chave `worclick-curriculo` em `localStorage`. Os campos obrigatórios e os formatos inválidos são bloqueados pelo navegador; se o armazenamento falhar, uma mensagem de erro é apresentada.
5. Após o salvamento, a aplicação abre `/curriculo/concluido`. Ao solicitar o download, a página envia os dados salvos à API e inicia o download do documento Word retornado.

O armazenamento é local ao navegador e não equivale a uma conta ou cópia de segurança. Limpar os dados do navegador remove o currículo, e outro dispositivo não tem acesso a ele. Os dados só são enviados à API quando o download é solicitado; o endpoint não os armazena nem sincroniza.

## 3. API de geração e download

O App Router implementa a API em `src/app/api/gera_curriculo/route.js`, que atende `POST /api/gera_curriculo`. A página de conclusão lê o currículo salvo no navegador e envia um JSON para esse endpoint somente quando a pessoa seleciona o download:

A requisição enviada pela interface usa este endpoint:

```http
POST /api/gera_curriculo
Content-Type: application/json
```

O corpo contém os campos do currículo, incluindo as listas de experiências profissionais, formações e projetos. A API verifica o JSON, os campos obrigatórios e o e-mail, escapa o texto antes de incluí-lo no documento e responde com o conteúdo Word (`application/msword`) e um cabeçalho de download. Dados inválidos recebem uma resposta de erro; a interface apresenta a mensagem e permite tentar novamente. O endpoint não grava o currículo no servidor.

O documento HTML formatado é compatível com o formato `.doc` e pode ser aberto em editores de texto como o Word. A única forma de recebimento disponibilizada nesta versão é o download pelo navegador; não há envio por Telegram ou integração com serviços de mensagens.

## 4. Cadastro, login e sessão

`src/app/api/auth/route.js` implementa os métodos da API de acesso:

| Método | Comportamento |
| --- | --- |
| `POST` com `acao: "cadastro"` | Valida nome, e-mail e senha, cria a conta e inicia a sessão. |
| `POST` com `acao: "login"` | Confere as credenciais de uma conta cadastrada e inicia a sessão. |
| `GET` | Retorna os dados públicos do usuário associado à sessão atual. |
| `DELETE` | Invalida a sessão e remove o cookie do navegador. |

`src/lib/db.js` mantém usuários e sessões em listas na memória do processo. O e-mail é normalizado para evitar contas duplicadas por diferença de maiúsculas/minúsculas; senhas são armazenadas com salt e hash, não em texto simples. O token aleatório da sessão é enviado em cookie HttpOnly, SameSite=Lax e com validade de sete dias. A navegação consulta a API e mostra o nome e a ação de saída para uma sessão ativa; sem sessão, oferece acesso e cadastro.

Esse armazenamento em memória é apenas demonstrativo: reiniciar o servidor apaga usuários e sessões e várias instâncias não compartilham os registros. Para produção, substitua as listas por uma base de dados persistente, configure proteção contra tentativas automatizadas e implemente autorização no servidor para as rotas que precisarem de acesso restrito.

## 5. Organização do front-end

### React e rotas

- `layout.js` compartilha navegação e rodapé; `Navegacao.js` concentra os links principais.
- `Navegacao.js` usa `header` e `nav` para identificar a navegação principal, com os links em uma lista `ul`/`li`; as páginas priorizam elementos semânticos do HTML5 em vez de wrappers genéricos.
- As páginas usam um único `main` como região principal; seções, cabeçalhos, formulários, grupos de campos e listas usam elementos semânticos como `section`, `header`, `form`, `fieldset`, `label`, `ol` e `li`.
- Cada tela tem seu próprio `page.js`, seguindo a estrutura de pastas do App Router.
- `Acesso.js` envia cadastro e login à API e comunica a sessão à navegação.
- `Navegacao.js` consulta a sessão, mostra as opções adequadas e permite sair.
- `src/lib/db.js` mantém a lista de usuários e sessões em memória durante a execução do servidor.
- A página de currículo organiza os campos em grupos temáticos e permite gerenciar experiências, formações e projetos repetíveis.
- A formação apresenta a data de conclusão para cursos concluídos ou a previsão para cursos em andamento.
- `localStorage` guarda somente um currículo sob a chave `worclick-curriculo`; salvar novamente substitui o registro anterior.
- As listas `experiencias`, `formacoes` e `projetos` são enviadas como coleções à API de geração do documento.
- `src/app/api/gera_curriculo/route.js` valida os dados recebidos, gera o documento Word e o retorna como anexo para download.

### CSS

- `globals.css` define a base visual, tipografia, cores e normalização dos elementos.
- `src/app/page.module.css` contém os estilos exclusivos da página inicial.
- `src/app/curriculo/page.module.css` e `src/app/curriculo/concluido/page.module.css` isolam os estilos do formulário e da página de conclusão.
- `src/app/components/Acesso.module.css`, `Navegacao.module.css` e `Footer.module.css` isolam os estilos dos componentes compartilhados de acesso, cabeçalho e rodapé.
- As regras responsivas ficam junto à tela ou ao componente correspondente; `globals.css` permanece restrito à base global, às variáveis e à normalização.
- As páginas adaptam os exemplos, os grupos do formulário e as ações para telas estreitas, preservando a organização visual do projeto original.

### Limites desta versão

- O currículo é armazenado apenas no navegador, sem sincronização ou persistência no servidor.
- A página de conclusão baixa o arquivo quando solicitado; nenhuma opção de envio por mensagens é oferecida.
- A autenticação usa listas em memória e não persiste usuários após a reinicialização do servidor.

## 6. Privacidade e segurança

Currículos contêm dados pessoais. Os dados permanecem no `localStorage` do navegador até serem enviados à API para gerar um download; o endpoint não os persiste. Senhas são armazenadas como hash e o token de sessão fica em cookie HttpOnly. A lista em memória não oferece persistência nem compartilhamento entre instâncias; não é adequada para produção. Evite salvar informações sensíveis em dispositivos compartilhados. Em produção, use HTTPS e uma base de dados apropriada.

## 7. Verificações desta etapa

- Acessar diretamente `/`, `/sessao`, `/cadastro`, `/curriculo` e `/curriculo/concluido`.
- Cadastrar um usuário, acessar com as credenciais corretas e confirmar o nome e a ação de saída na navegação.
- Confirmar que login com usuário inexistente ou senha incorreta é rejeitado e que e-mail duplicado não cria outra conta.
- Encerrar a sessão e confirmar que a navegação volta a oferecer acesso e cadastro.
- Confirmar que os campos obrigatórios do currículo e do acesso são validados pelo navegador, incluindo formatos inválidos de e-mail e URL.
- Adicionar e remover experiências, formações e projetos; confirmar que entradas vazias são omitidas e entradas parcialmente preenchidas exigem seus campos.
- Alternar uma formação entre concluída e em andamento e verificar que o campo de data correspondente muda.
- Salvar um currículo e conferir `localStorage` sob a chave `worclick-curriculo`; salvar outro e confirmar que o registro anterior foi substituído.
- Confirmar que uma falha no armazenamento apresenta uma mensagem e não avança para a conclusão.
- Solicitar o download na página final e confirmar que o arquivo Word é gerado com os dados do currículo.
- Confirmar que o documento inclui todas as formações e projetos cadastrados.
- Verificar que uma falha na geração apresenta uma mensagem e permite tentar novamente.
- Confirmar que a API rejeita JSON inválido, campos obrigatórios ausentes e e-mail inválido.
- Verificar a leitura e o uso dos campos em larguras de celular e desktop.
