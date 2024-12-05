document.getElementById("createAccountBtn").addEventListener("click", () => {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";
});

// Cadastro de novo usuário
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const email = document.getElementById("emailSignup").value;
    const senha = document.getElementById("senhaSignup").value;

    const usuario = { nome, telefone, endereco, email, senha };

    // Envia os dados ao backend para criar o usuário
    fetch("http://localhost:8080/usuario/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Este e-mail já existe");
        }
        return response.json();
    })
    .then(() => {
        alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
        window.location.href = "cadastro_login.html"; // Redireciona para login
    })
    .catch((error) => {
        alert("Erro no cadastro: " + error.message);
    });
});

// Login de usuário existente
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    // Cria os parâmetros no formato x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("senha", senha);

    // Envia as credenciais ao backend para autenticação
    fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    })
    .then((response) => {
        if (!response.ok) {
            // Lança sempre a mensagem padrão para erros de autenticação
            throw new Error("Email ou senha inválidos!");
        }
        return response.json();
    })
    .then((usuario) => {
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario)); // Marca o usuário como logado
        alert(`Bem-vindo(a), ${usuario.nome}!`);
        window.location.href = "menu.html"; // Redireciona para o menu
    })
    .catch((error) => {
        // Exibe sempre a mensagem genérica de erro
        alert("Email ou senha inválidos!");
    });
});

// Logout
function logout() {
    alert("Você foi desconectado.");
    window.location.href = "cadastro_login.html";
}
