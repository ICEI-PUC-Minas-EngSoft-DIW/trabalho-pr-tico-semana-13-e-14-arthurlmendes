// ===============================================
// assets/scripts/favoritos.js - MÓDULO DA PÁGINA FAVORITOS
// ===============================================

// Assume que API_URL e API_URL_USUARIOS estão definidos no app.js
// Assume que getUsuarioLogado() é uma função global

async function carregarPaginaFavoritos() {
    const usuario = getUsuarioLogado();
    const container = document.getElementById('favoritos-container');
    const loadingMessage = '<p class="text-center text-muted">Carregando...</p>';

    if (!usuario) {
        container.innerHTML = '<p class="text-center text-danger lead">Você precisa estar logado para ver seus favoritos.</p>';
        return;
    }
    
    // Lista de IDs favoritados pelo usuário
    const favoritosIds = usuario.favoritos || []; 
    
    if (favoritosIds.length === 0) {
        container.innerHTML = '<p class="text-center lead">Você ainda não marcou nenhuma aventura como favorita!</p>';
        return;
    }
    
    container.innerHTML = loadingMessage;

    try {
        // Busca TODAS as aventuras e filtra apenas as que o usuário favoritou
        const response = await fetch(API_URL);
        const todasAventuras = await response.json();
        
        const aventurasFavoritas = todasAventuras.filter(aventura => 
            favoritosIds.includes(aventura.id)
        );

        if (aventurasFavoritas.length === 0) {
            container.innerHTML = '<p class="text-center lead">Nenhuma aventura favorita encontrada na base de dados.</p>';
            return;
        }

        // Monta os cards (usando a função de montagem da Home, se for transferida para este módulo)
        let htmlContent = '';
        aventurasFavoritas.forEach(item => {
             // O card injetado deve ser simples, similar ao montarCards da Home
             htmlContent += `
                <article class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${item.imagem_card}" class="card-img-top card-img" alt="${item.nome}">
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title text-success fw-bold">${item.nome}</h5>
                            <p class="card-text flex-grow-1">${item.descricao_breve}</p>
                            <a href="detalhes.html?id=${item.id}" class="btn btn-primary mt-auto">Ver Detalhes</a>
                        </div>
                    </div>
                </article>
            `;
        });

        container.innerHTML = htmlContent;

    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        container.innerHTML = '<p class="text-center text-danger">Erro ao carregar dados do servidor.</p>';
    }
}

// Chamada de inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('favoritos-container')) {
        carregarPaginaFavoritos();
    }
});