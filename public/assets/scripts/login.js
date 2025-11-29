// ===============================================
// assets/scripts/login.js - MÓDULO DE AUTENTICAÇÃO
// ===============================================

const API_USUARIOS = 'http://localhost:3000/usuarios'; 

// Função que será chamada no final do app.js para inicializar o controle
function initLoginModule() {
    // Redireciona usuários logados se tentarem acessar a página de login
    if (window.location.pathname.includes('login.html') && getUsuarioLogado()) {
        window.location.href = 'index.html';
        return;
    }

    // ------------------------------------
    // LÓGICA DE LOGIN
    // ------------------------------------
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const login = document.getElementById('login-username').value;
            const senha = document.getElementById('login-password').value;
            const feedback = document.getElementById('login-feedback');
            feedback.classList.add('d-none');

            try {
                // 1. Buscar usuário pelo login e senha
                const response = await fetch(`${API_USUARIOS}?login=${login}&senha=${senha}`);
                const users = await response.json();

                if (users.length === 1) {
                    const user = users[0];
                    // 2. Armazenar sessão no sessionStorage
                    sessionStorage.setItem('usuarioLogado', JSON.stringify(user));
                    window.location.href = 'index.html'; // Redireciona para a home
                } else {
                    feedback.textContent = "Login ou senha incorretos.";
                    feedback.classList.remove('d-none');
                }
            } catch (error) {
                console.error("Erro ao tentar login:", error);
                feedback.textContent = "Erro de conexão com o servidor.";
                feedback.classList.remove('d-none');
            }
        });
    }

    // ------------------------------------
    // LÓGICA DE CADASTRO
    // ------------------------------------
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const novoUsuario = {
                login: document.getElementById('cadastro-email').value,
                senha: document.getElementById('cadastro-senha').value,
                nome: document.getElementById('cadastro-nome').value,
                admin: false, 
                favoritos: []
            };
            const feedback = document.getElementById('cadastro-feedback');
            
            try {
                // Verificar se o login/email já existe
                const checkUser = await fetch(`${API_USUARIOS}?login=${novoUsuario.login}`);
                if ((await checkUser.json()).length > 0) {
                    feedback.textContent = "Este email já está cadastrado.";
                    feedback.classList.remove('d-none');
                    return;
                }

                const response = await fetch(API_USUARIOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                });
                
                if (response.ok) {
                    alert("Cadastro realizado com sucesso! Faça login.");
                    // Fechar modal e direcionar para login
                    const modalElement = document.getElementById('cadastroModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide(); 
                    window.location.href = 'login.html'; 
                } else {
                    feedback.textContent = "Erro ao cadastrar usuário.";
                    feedback.classList.remove('d-none');
                }
            } catch (error) {
                 console.error("Erro ao tentar cadastrar:", error);
            }
        });
    }
}