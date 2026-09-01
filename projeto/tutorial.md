# Worclick - Um Clique que impulsiona sua carreira

- Antônio Gustavo de Brito Veloso - 10771499
- Igor de Jesus Barrabazza Vieira - 10771406
- Lucas Bergamo Ciciliano - 10771512
- Matheus de Andrade Lourenço - 10419691

## 1. Contexto do projeto

### Problema ou necessidade

Um processo que dificulta a vida de alguns profissionais em início de carreira diz respeito a montagem de currículos. Isso ocorre por conta da falta de habilidade em algumas ferramentas úteis para montagem como Word ou Canva ou até dificuldade de manipulação em celulares. Nesse contexto, enxerga-se uma oportunidade de automação desse processo.

### Público-alvo

- Profissionais em início de carreira
- Pessoas com baixo conhecimento em ferramentas como Word, Canva ou correlatos.

### Objetivo

Montar site que automatize a montagem de currículos profissionais.

## 2. Processo de ideação

O processo inicou-se com duas possíveis ideias: a geração de currículos e um app que chama alguma autoridade com um botão só. No final escolhemos a primeira ideia, por ser mais útil para a sociedade e ter um melhor processo de aprendizado.

O site funcionará da seguinte forma: Após preencher um formulário, o usuário poderá selecionar algumas opções de currículo e assim, ao clicar em um botão, o site baixará um currículo formatado com suas informações salvas e conforme os principais padrões de design de currículos atrativos a empresas.

## 3. Protótipo

<img width="1165" height="1600" alt="image" src="https://github.com/user-attachments/assets/2e81b8fb-b72b-43a7-88f3-32df78be8d2b" />

## 4. Repositório do projeto

O código-fonte e os arquivos do projeto estão disponíveis no GitHub:

**[Acessar repositório no GitHub](https://github.com/mathlori/webmobile-curriculo)**

## 5. HTML do projeto

A estrutura do código HTML foi pensada para refletir o protótipo do Worclick. A intenção é unir as 3 páginas principais sem a implementação da navegação.

### Estrutura geral

Além das estruturas padrões do HTML, o código é dividido em algumas partes principais:

- `<header>`: possui um texto de boas-vindas ao site.
- `<main>`: contém a descrição do produto e o formulário para criação do currículo.
- `<section>`: apresenta opções de currículos para visualização e seleção.
- `<footer>`: reúne o botão de geração do currículo e os textos de copyright.

A seguir, um exemplo da estrutura inicial do documento:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Worclick</title>
</head>

<body>
    <!-- Conteúdo principal visível da página -->

    <header>
        <!-- Texto de boas-vindas -->
    </header>

    <main>
        <!-- Texto de explicação e formulário -->
    </main>

    <section>
        <!-- Opções de currículo -->
    </section>

    <footer>
        <!-- Botão para gerar currículo e texto disclaimer -->
    </footer>
</body>
</html>
```

### Cabeçalho e apresentação da marca

O `<header>` funciona como área de identidade da marca. No protótipo, essa parte transmite a sensação inicial de apresentação do produto. O `h1` cria o título principal e chama atenção para a proposta do site.

```html
<header>
    <h1>Bem Vindo ao Worclick</h1>
</header>
```

Esse bloco é importante porque comunica ao usuário, logo no início, qual é a proposta do serviço: gerar currículos de forma simples e rápida.

### Área principal do conteúdo

O `<main>` concentra a parte central da página, que no protótipo representa a explicação do produto e o espaço para o usuário inserir suas informações. Aqui aparecem textos, imagens e um campo de entrada para os dados pessoais ou profissionais.

```html
<main>
    <!-- Descrição do produto -->
    <img src="https://outliers.com.br/modelo-de-curriculo/">
    <p>O Worclick é uma plataforma com o objetivo de impulsionar a carreira das pessoas.</p>

    <!-- Área de escrita do usuário -->
    <textarea placeholder="Escreva suas informaçõens aqui"></textarea>
</main>
```

Essa estrutura faz sentido com o protótipo porque a página principal precisa informar o usuário sobre a ferramenta e, em seguida, permitir que ele insira os dados essenciais para a criação do currículo.

### Seção de exemplos e visualização

A seção abaixo do conteúdo principal foi pensada para mostrar exemplos de modelos ou miniaturas de currículos. No protótipo, essa área pode funcionar como uma vitrine visual com diferentes layouts. Por isso, o código usa uma sequência de imagens dentro de `<section>`.

```html
<section>
    <img src="" alt="Modelo de currículo 1">
    <img src="" alt="Modelo de currículo 2">
    <img src="" alt="Modelo de currículo 3">
    <img src="" alt="Modelo de currículo 4">
</section>
```

A ideia é que o usuário veja exemplos dos formatos disponíveis antes de gerar seu currículo, reforçando a proposta de personalização e qualidade visual.

### Rodapé e ação principal

No final da página, o `<footer>` concentra a ação principal do site: o botão de geração do currículo. Além disso, o rodapé também pode conter informações de copyright, deixando a interface mais completa e profissional.

```html
<footer>
    <!-- Botão de geração do currículo -->
    <button type="button">GERAR</button>
    <p>O Worclick é
        <br>
        &copy; 2026 Worclick
    </p>
</footer>
```

Esse botão representa o ponto de conclusão da jornada do usuário: depois de inserir os dados e escolher um modelo, ele clica no botão para gerar o currículo final.

### Relação com o protótipo

Ao comparar o código com o protótipo, percebe-se que o HTML foi organizado de forma simples e funcional:

1. O topo da página comunica a marca.
2. O centro explica a proposta e recebe as informações do usuário.
3. A parte intermediária exibe opções visuais de modelos.
4. O rodapé fecha a página com a ação principal.

Em outras palavras, a estrutura do HTML funciona como o esqueleto da interface, enquanto o CSS será responsável por estilizar cores, tamanhos, alinhamentos e aparência visual final. O HTML, nesse caso, organiza o conteúdo e ajuda a manter a lógica do protótipo clara e fácil de desenvolver.

Como próximo passo, o projeto pode evoluir com a criação de estilos em CSS para deixar a página mais próxima do protótipo real, com botões mais atraentes, cards de modelo, área de formulário organizada e design responsivo para celular.
