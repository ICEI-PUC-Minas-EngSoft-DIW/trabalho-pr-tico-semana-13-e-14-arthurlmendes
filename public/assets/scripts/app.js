// ===========================================
// assets/js/app.js - CÓDIGO FINAL TP3 (CORRIGIDO PARA IMAGENS)
// ===========================================

// URL BASE da API do JSON Server (SINCRONIZADO PARA A PORTA 3003)
// Linha 6 do app.js:
const API_URL = 'http://localhost:3008/aventuras';


// ----------------------------------------------------
// 1. FUNÇÕES DE VISUALIZAÇÃO (Chart.js)
// ----------------------------------------------------

async function carregarDadosEMontarGrafico() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro ao buscar dados para o gráfico.`);
        
        const dados = await response.json();
        
        // Processar e Agrupar Dados
        const contagem = { 'Fácil': 0, 'Moderada': 0, 'Difícil': 0, 'Extrema (Trekking)': 0 };
        
        dados.forEach(item => {
            const dif = item.dificuldade;
            if (contagem.hasOwnProperty(dif)) {
                contagem[dif]++;
            }
        });

        const labels = Object.keys(contagem);
        const data = Object.values(contagem);

        // Montar o Gráfico (Chart.js)
        const ctx = document.getElementById('graficoDificuldade');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Aventuras',
                    data: data,
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', 'rgba(255, 193, 7, 0.8)', 'rgba(220, 53, 69, 0.8)', 'rgba(52, 58, 64, 0.8)'
                    ],
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'Quantidade de Trilhas' } }
                },
                plugins: {
                    title: { display: true, text: 'Distribuição de Dificuldade das Trilhas' }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao montar gráfico:", error);
    }
}


// ----------------------------------------------------
// 2. FUNÇÕES DE CONSUMO DA API (CRUD)
// ----------------------------------------------------

async function carregarItensHome() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
             throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const dados = await response.json();
        const destaques = dados.filter(item => item.destaque === true); 

        montarCarrossel(destaques);
        montarCards(dados);

    } catch (error) {
        console.error("ERRO FATAL: Falha na conexão com a API.", error);
        const container = document.getElementById('trilhas-container');
        if (container) {
            container.innerHTML = `<p class="text-center text-danger fw-bold">Não foi possível carregar as aventuras. Verifique se o JSON Server está rodando na porta 3003.</p>`;
        }
    }
}

async function cadastrarAventura(event) {
    event.preventDefault(); 

    const form = event.target;
    const novaAventura = {
        nome: form.querySelector('#nome').value,
        localizacao: form.querySelector('#localizacao').value,
        dificuldade: form.querySelector('#dificuldade').value,
        descricao_breve: form.querySelector('#descricao_breve').value,
        conteudo_completo: 'Conteúdo detalhado padrão.',
        imagem_principal: form.querySelector('#imagem_card').value,
        imagem_card: form.querySelector('#imagem_card').value,
        atracoes: [],
        destaque: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaAventura)
        });

        if (response.ok) {
            alert("Aventura cadastrada com sucesso! Recarregue a Home Page.");
            form.reset();
        } else {
            alert("Erro ao cadastrar aventura.");
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Erro de conexão com o servidor.");
    }
}

async function deletarAventura(id) {
    if (confirm(`Tem certeza que deseja excluir a aventura de ID ${id}?`)) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert(`Aventura ${id} excluída com sucesso!`);
                if (document.getElementById('trilhas-container')) {
                    carregarItensHome(); 
                }
            } else {
                alert("Erro ao excluir aventura.");
            }
        } catch (error) {
            console.error("Erro na requisição DELETE:", error);
        }
    }
}


// ----------------------------------------------------
// 3. FUNÇÃO PARA DETALHES.HTML (READ ONE)
// ----------------------------------------------------

async function carregarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) { window.location.href = 'index.html'; return; }

    try {
        const response = await fetch(`${API_URL}/${itemId}`);
        const item = await response.json();
        
        const tituloItem = document.getElementById('titulo-item');
        const detalhesGerais = document.getElementById('detalhes-gerais');
        const fotosContainer = document.getElementById('fotos-vinculadas');

        if (!response.ok || !item.id) {
            tituloItem.textContent = 'Aventura não encontrada!';
            detalhesGerais.innerHTML = `<p class="text-center text-danger lead mt-5">O ID da aventura que você tentou acessar não existe.</p>`;
            return;
        }

        document.title = `${item.nome} - Detalhes da Aventura`;
        tituloItem.textContent = item.nome;

        // INJEÇÃO DA SEÇÃO 1: DETALHES GERAIS (Layout Personalizado)
        detalhesGerais.innerHTML = `
            <div class="row">
                <div class="col-md-5 mb-4 mb-md-0">
                    <img src="${item.imagem_principal}" class="img-fluid rounded shadow" alt="Principal de ${item.nome}">
                </div>
                
                <div class="col-md-7">
                    <h3 class="text-primary mb-3">${item.nome}</h3>
                    <p class="lead text-muted">${item.descricao_breve}</p>
                    <hr>
                    
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <p class="mb-1"><strong>Localização:</strong> ${item.localizacao}</p>
                            <p class="mb-1"><strong>Dificuldade:</strong> <span class="badge bg-danger fs-6">${item.dificuldade}</span></p>
                        </div>
                        <div class="col-sm-6">
                            <p class="mb-1"><strong>Distância:</strong> ${item.distancia}</p>
                            <p class="mb-1"><strong>Tempo Estimado:</strong> ${item.tempo_estimado}</p>
                        </div>
                    </div>
                    
                    <h4 class="mt-4 text-success">Descrição Detalhada:</h4>
                    <p>${item.conteudo_completo}</p>
                </div>
            </div>
        `;

        // INJEÇÃO DA SEÇÃO 2: FOTOS VINCULADAS
        let fotosContent = '';
        if (item.atracoes && item.atracoes.length > 0) {
            item.atracoes.forEach(atracao => {
                fotosContent += `
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm border-0">
                            <img src="${atracao.imagem}" class="card-img-top img-fluid fotos-vinculadas-img" alt="${atracao.titulo}">
                            <div class="card-body p-2 bg-light">
                                <p class="card-text fw-bold text-center m-0 text-secondary">${atracao.titulo}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
             fotosContent = `<div class="col-12"><p class="text-muted text-center">Nenhuma foto vinculada disponível.</p></div>`;
        }
        document.getElementById('fotos-vinculadas').innerHTML = fotosContent;

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
    }
}


// ----------------------------------------------------
// 4. FUNÇÕES DE MONTAGEM DE COMPONENTES
// ----------------------------------------------------

function montarCarrossel(destaques) {
    const inner = document.getElementById('carrossel-inner');
    if (!inner) return;

    let htmlContent = '';
    destaques.forEach((item, index) => {
        const active = index === 0 ? 'active' : '';
        
        htmlContent += `
            <div class="carousel-item ${active}">
                <img src="${item.imagem_principal}" class="d-block w-100 carousel-img" alt="${item.nome}">
                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                    <h3 class="fw-bold">${item.nome}</h3>
                    <p>${item.descricao_breve}</p>
                    <a href="detalhes.html?id=${item.id}" class="btn btn-warning fw-bold">Ver Detalhes</a>
                </div>
            </div>
        `;
    });
    inner.innerHTML = htmlContent;
}

function montarCards(dados) {
    const container = document.getElementById('trilhas-container');
    if (!container) return; 

    let htmlContent = '';
    dados.forEach(item => {
        htmlContent += `
            <article class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${item.imagem_card}" class="card-img-top card-img" alt="${item.nome}">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title text-success fw-bold">${item.nome}</h5>
                        <p class="card-text flex-grow-1">${item.descricao_breve}</p>
                        <a href="detalhes.html?id=${item.id}" class="btn btn-primary mt-auto">Ver Detalhes</a>
                        
                        <div class="d-flex justify-content-center mt-2">
                           <button class="btn btn-sm btn-info me-2" onclick="alert('PUT (Edição) precisa de um formulário e função dedicados.')">Editar</button>
                           <button class="btn btn-sm btn-danger" onclick="deletarAventura(${item.id})">Excluir</button>
                        </div>
                        
                    </div>
                </div>
            </article>
        `;
    });
    container.innerHTML = htmlContent;
}


// ----------------------------------------------------
// 5. LÓGICA DE INICIALIZAÇÃO E EVENT LISTENERS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Página de Visualização (NOVO!)
    if (document.getElementById('graficoDificuldade')) {
        carregarDadosEMontarGrafico();
    }
    // 2. Home Page
    if (document.getElementById('trilhas-container')) {
        carregarItensHome();
    }
    // 3. Página de Detalhes
    if (document.getElementById('detalhes-gerais')) {
        carregarDetalhes();
    }
    // 4. Formulário de Cadastro
    const formCadastro = document.getElementById('form-cadastro-aventura');
    if (formCadastro) {
        formCadastro.addEventListener('submit', cadastrarAventura);
    }
});