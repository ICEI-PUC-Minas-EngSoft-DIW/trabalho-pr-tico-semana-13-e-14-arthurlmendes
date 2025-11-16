
# Trabalho Prático 07 - Semanas 13 e 14

A partir dos dados cadastrados na etapa anterior, vamos trabalhar formas de apresentação que representem de forma clara e interativa as informações do seu projeto. Você poderá usar gráficos (barra, linha, pizza), mapas, calendários ou outras formas de visualização. Seu desafio é entregar uma página Web que organize, processe e exiba os dados de forma compreensível e esteticamente agradável.

Com base nos tipos de projetos escohidos, você deve propor **visualizações que estimulem a interpretação, agrupamento e exibição criativa dos dados**, trabalhando tanto a lógica quanto o design da aplicação.

Sugerimos o uso das seguintes ferramentas acessíveis: [FullCalendar](https://fullcalendar.io/), [Chart.js](https://www.chartjs.org/), [Mapbox](https://docs.mapbox.com/api/), para citar algumas.

## Informações do trabalho

- Nome: Arthur Lima Mendes
- Matricula: 901170
- Proposta de projeto escolhida: Lugares Turísticos (Trilhas e Acampamentos)
- Breve descrição sobre seu projeto: O projeto evoluiu para uma aplicação completa de CRUD e Visualização de Dados. Esta etapa implementa uma página dedicada com um Gráfico de Barras (Chart.js) para analisar a distribuição das aventuras cadastradas, transformando dados brutos em informação visualmente clara.

**Print da tela com a implementação**

<< Coloque aqui uma breve explicação da implementação feita nessa etapa>>
Nesta etapa, foi implementada uma nova página (visualizacao.html) que exibe um Gráfico de Barras utilizando a biblioteca Chart.js. A funcionalidade é totalmente dinâmica:
A função carregarDadosE MontarGrafico() faz uma requisição fetch (GET) à API (/aventuras). Os dados são processados e agrupados por nível de dificuldade (Fácil, Moderada, Difícil, Extrema).


<<  COLOQUE A IMAGEM TELA 1 AQUI >>
![Tela 1:](public/printatual/printhome.jpeg)

<<  COLOQUE A IMAGEM TELA 2 AQUI >>
![Tela 2: ](public/printatual/grafico.png)