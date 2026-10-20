# Worclick - Evolução do projeto

## Objetivo desta etapa

O projeto anterior, disponível na pasta `projeto`, apresenta o Worclick como um site para preencher dados profissionais e gerar um currículo em arquivo Word. Nesta etapa, vamos evoluir essa experiência sem repetir a documentação da estrutura antiga: o foco será organizar o acesso às telas por rotas simples e permitir que o usuário receba o currículo no celular.

No estado atual, o navegador monta o documento e inicia o download. O envio para um celular ainda precisará ser implementado e dependerá de um serviço de comunicação e de uma API no servidor.

## O que será acrescentado

- Rotas fixas(simples), sem parâmetros, para a página inicial, o início de sessão e a criação do currículo.
- Uma etapa de confirmação do número de celular para o qual o currículo será enviado.
- Uma API no servidor para receber o currículo e encaminhá-lo ao celular, inicialmente considerando a integração com WhatsApp Business.
- Mensagens de sucesso e de erro para informar o resultado do envio.

## 1. Rotas do site

As rotas abaixo representam telas da aplicação. Elas não carregam identificadores ou outros valores na URL; os dados do usuário e do currículo serão tratados na sessão ou enviados no corpo das requisições.

| Rota | Tela | Comportamento |
| --- | --- | --- |
| `/` | Início do site | Apresenta o Worclick e oferece acesso para iniciar uma sessão ou criar um currículo. |
| `/sessao` | Iniciar sessão | Permite que o usuário entre ou, conforme a definição do projeto, inicie uma sessão de uso. |
| `/curriculo` | Criar currículo | Apresenta o formulário, a revisão dos dados e a ação para gerar e enviar o documento. |

O roteador deve associar cada caminho a uma tela e indicar uma tela de não encontrado para caminhos inválidos. Ao acessar diretamente `/sessao` ou `/curriculo`, o servidor de hospedagem também deverá entregar a aplicação; caso contrário, a atualização do navegador pode resultar em erro 404.

As rotas não substituem o controle de acesso. Se a criação do currículo exigir uma sessão iniciada, a aplicação verificará esse estado antes de abrir `/curriculo` e direcionará o usuário sem sessão para `/sessao`. Como as URLs não têm parâmetros, informações como o número de telefone não devem ser colocadas no caminho.

## 2. Fluxo para criar e enviar o currículo

1. O usuário acessa `/` e escolhe iniciar uma sessão ou criar um currículo.
2. Se necessário, inicia a sessão em `/sessao`.
3. Em `/curriculo`, preenche os dados profissionais e informa o número de celular com código do país e DDD.
4. O site valida os campos e permite revisar os dados antes de gerar o documento.
5. O usuário confirma que deseja enviar o currículo para o número informado.
6. O navegador envia o arquivo e o número para a API do projeto.
7. O servidor valida a solicitação, encaminha o documento pelo serviço de mensagens configurado e retorna o resultado.
8. O site mostra uma confirmação ou orienta o usuário a corrigir os dados e tentar novamente.

O envio deve acontecer somente após uma ação explícita do usuário. O site deve deixar claro qual número receberá o documento e não deve enviar o currículo automaticamente ao abrir a página.

## 3. API de envio

O navegador não deve chamar diretamente a API privada do provedor de mensagens. A chave de acesso e outras credenciais ficam no servidor, protegidas por variáveis de ambiente. Assim, elas não aparecem no JavaScript entregue ao público.

Uma proposta de endpoint do próprio projeto é:

```http
POST /api/curriculos/enviar
Content-Type: multipart/form-data
```

O corpo da requisição pode conter o número de celular e o arquivo do currículo, por exemplo nos campos `telefone` e `curriculo`. O caminho do endpoint é fixo e não possui parâmetro; os dados variáveis seguem no corpo da requisição. Essa API é diferente das rotas de tela `/`, `/sessao` e `/curriculo`.

O servidor deverá:

1. Verificar se o telefone e o arquivo foram enviados e se o formato e o tamanho do documento são permitidos.
2. Normalizar e validar o número, incluindo código do país e DDD.
3. Confirmar que o envio foi solicitado pelo usuário e respeitar os limites do serviço integrado.
4. Encaminhar o documento por uma API de mensagens, como a WhatsApp Business Platform, conforme as regras e configurações da conta do projeto.
5. Responder com um status adequado, sem expor credenciais nem dados pessoais desnecessários.

O formato final da mensagem e a configuração da conta do provedor serão definidos durante a implementação. O envio pode falhar por número inválido, indisponibilidade do serviço ou falta de configuração; nesses casos, o site deve preservar uma forma de o usuário baixar o currículo e tentar novamente mais tarde.

## 4. Alterações na interface e no código

### HTML

- Separar o conteúdo em telas ou seções identificadas para início, sessão e criação do currículo.
- Adicionar um campo de telefone para recebimento, com rótulo e exemplo de formato.
- Adicionar uma confirmação explícita de envio e uma área acessível para mensagens de status.
- Manter o botão de download como alternativa caso o envio não esteja disponível.

### CSS

- Adaptar o formulário e os estados das novas telas para uso em celular.
- Destacar o campo do telefone, a confirmação e as mensagens de envio sem confundir a ação de enviar com a de baixar.
- Exibir estados de carregamento e erro sem permitir cliques repetidos enquanto a solicitação estiver em andamento.

### JavaScript do navegador

- Implementar a navegação entre as rotas fixas e tratar caminhos inexistentes.
- Reaproveitar a geração do currículo existente para produzir o arquivo que será baixado ou enviado.
- Enviar o arquivo e o telefone para `POST /api/curriculos/enviar` após a confirmação do usuário.
- Exibir o resultado retornado pelo servidor e manter a opção de download.

### Servidor

- Criar o endpoint `POST /api/curriculos/enviar`.
- Integrar o endpoint ao provedor de mensagens escolhido.
- Guardar credenciais fora do código-fonte e validar os dados recebidos.
- Evitar registrar o conteúdo do currículo ou o telefone completo em logs desnecessários.

## 5. Privacidade e segurança

Currículos contêm dados pessoais. O projeto deve solicitar somente os dados necessários, informar a finalidade do telefone, obter confirmação antes do envio e limitar o tempo de armazenamento do arquivo. O documento não deve ficar disponível em um endereço público previsível. A comunicação com o servidor e com o provedor deve usar HTTPS, e as credenciais da integração devem permanecer no servidor.

Antes de disponibilizar o envio, também será necessário verificar as regras atuais do provedor escolhido, incluindo consentimento, formatos aceitos e eventuais modelos de mensagem exigidos.

## 6. Verificações da nova etapa

- Acessar diretamente `/`, `/sessao` e `/curriculo` e atualizar o navegador em cada rota.
- Confirmar que caminhos inexistentes mostram uma tela apropriada.
- Verificar o redirecionamento quando uma sessão for necessária.
- Impedir o envio quando o telefone ou o arquivo estiver inválido.
- Confirmar que a API só é chamada após a confirmação do usuário.
- Testar respostas de sucesso, erro do provedor, falha de rede e nova tentativa.
- Confirmar que o download continua disponível e que nenhuma credencial aparece no navegador ou nos arquivos públicos.
