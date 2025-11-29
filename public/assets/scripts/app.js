// ===============================================
// assets/scripts/app.js - MÓDULO PRINCIPAL DE CONTROLE
// ===============================================

// Assumindo que o servidor roda na porta 3000 (padrão npm start)
const API_URL = 'http://localhost:3000/aventuras'; 
const API_URL_USUARIOS = 'http://localhost:3000/usuarios';

// ----------------------------------------------------
// FUNÇÕES GLOBAIS DE SESSÃO E CONTROLE
// ----------------------------------------------------

// Função global para obter usuário logado (NECESSÁRIO PELO login.js e app.js)
function getUsuarioLogado() {
    const usuarioString = sessionStorage.getItem('usuarioLogado');
    return usuarioString ? JSON.parse(usuarioString) : null;
}

// Função global para logar o usuário (chamada pelo link Logout)
function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html'; 
}

// ----------------------------------------------------
// ATUALIZAÇÃO DO HEADER (SESSÃO/ADMIN/FAVORITOS)
// ----------------------------------------------------

function atualizarHeader() {
    const usuario = getUsuarioLogado();
    
    // Links de Controle de Sessão
    const linkLogin = document.getElementById('link-login');
    const linkCadastroUsuario = document.getElementById('link-cadastro-usuario');
    const linkLogout = document.getElementById('link-logout');
    
    // Links Funcionais
    const linkFavoritos = document.getElementById('link-favoritos');
    const linkCadastroItem = document.getElementById('link-cadastro-item'); 
    const usernameSpan = document.getElementById('username-span');
    
    if (usuario) {
        // LOGADO: Esconde login/cadastro, mostra logout/nome
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkCadastroUsuario) linkCadastroUsuario.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        if (usernameSpan) usernameSpan.textContent = `Olá, ${usuario.nome.split(' ')[0]}!`;

        // FAVORITOS (Visível para todos logados)
        if (linkFavoritos) linkFavoritos.style.display = 'block';

        // ADMIN (Cadastro de Item - Visível apenas para admin)
        if (usuario.admin && linkCadastroItem) {
            linkCadastroItem.style.display = 'block';
        } else if (linkCadastroItem) {
            linkCadastroItem.style.display = 'none';
        }
    } else {
        // DESLOGADO: Mostra login/cadastro, esconde o resto
        if (linkLogin) linkLogin.style.display = 'block';
        if (linkCadastroUsuario) linkCadastroUsuario.style.display = 'block';
        if (linkLogout) linkLogout.style.display = 'none';
        if (linkFavoritos) linkFavoritos.style.display = 'none';
        if (linkCadastroItem) linkCadastroItem.style.display = 'none';
        if (usernameSpan) usernameSpan.textContent = '';
    }
}

// ----------------------------------------------------
// ATUALIZAÇÃO DE COMPONENTES (PESQUISA, FAVORITOS)
// ----------------------------------------------------

/**
 * Módulo de Pesquisa: Filtra os dados.
 */
function filtrarCards(dados, textoPesquisa) {
    if (!textoPesquisa) return dados;
    const termo = textoPesquisa.toLowerCase();
    
    return dados.filter(item => 
        item.nome.toLowerCase().includes(termo) || 
        item.descricao_breve.toLowerCase().includes(termo)
    );
}

/**
 * FAVORITOS: Lógica de marcação/desmarcação.
 * @param {number} aventuraId 
 */
async function toggleFavorito(aventuraId) {
    const user = getUsuarioLogado();
    if (!user) {
        alert("Você precisa estar logado para marcar favoritos!");
        return;
    }
    
    try {
        // 1. Busca o usuário mais recente e o item
        const responseUser = await fetch(`${API_URL_USUARIOS}/${user.id}`);
        const usuarioAtualizado = await responseUser.json();
        
        const favoritos = usuarioAtualizado.favoritos || [];
        const index = favoritos.indexOf(aventuraId);
        
        if (index === -1) {
            // Marca (Adiciona ID)
            favoritos.push(aventuraId);
        } else {
            // Desmarca (Remove ID)
            favoritos.splice(index, 1);
        }
        
        // 2. Envia a atualização (PUT)
        const responsePut = await fetch(`${API_URL_USUARIOS}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...usuarioAtualizado, favoritos: favoritos })
        });
        
        if (responsePut.ok) {
            // 3. Atualiza a sessão local e a visualização
            sessionStorage.setItem('usuarioLogado', JSON.stringify({ ...usuarioAtualizado, favoritos: favoritos }));
            carregarItensHome(); // Recarrega os cards para atualizar os ícones
        } else {
            alert("Erro ao salvar favorito.");
        }

    } catch (error) {
        console.error("Erro ao marcar favorito:", error);
    }
}

// ----------------------------------------------------
// INICIALIZAÇÃO DE PÁGINAS (Controle de Módulos)
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // Atualiza o estado do menu em todas as páginas (Login/Logout/Admin)
    atualizarHeader();

    // ------------------------------------
    // LÓGICA DA HOME PAGE
    // ------------------------------------
    const containerTrilhas = document.getElementById('trilhas-container');
    const campoPesquisa = document.getElementById('campo-pesquisa');

    if (containerTrilhas) {
        carregarItensHome(); // Carrega todos os itens

        // Event Listener para a pesquisa
        if (campoPesquisa) {
            campoPesquisa.addEventListener('input', async () => {
                const termo = campoPesquisa.value;
                const response = await fetch(API_URL);
                const dadosCompletos = await response.json();
                
                const dadosFiltrados = filtrarCards(dadosCompletos, termo);
                montarCards(dadosFiltrados);
            });
        }
    }
    
    // Lógica do Logout (Anexada ao botão)
    const btnLogout = document.getElementById('link-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
});

// Nota: As funções CRUD (cadastrarAventura, deletarAventura) e de Montagem (montarCards, montarCarrossel, carregarDetalhes)
// devem estar no app.js ou em outros módulos, mas serão chamadas pela lógica principal.