document.getElementById("createAccountBtn").addEventListener("click", () => {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";
});

// Cadastro de novo usuário
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const email = document.getElementById("emailSignup").value;
    const senha = document.getElementById("senhaSignup").value;

    const usuario = { nome, cpf, telefone, endereco, email, senha };

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

/*
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

*/

// Login de usuário existente
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const identificacao = document.getElementById("identificacao").value.trim();
    const senha = document.getElementById("senhaLogin").value;

    // Validação básica para CPF ou e-mail
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const isEmail = identificacao.includes('@');

    if (!isEmail && !cpfPattern.test(identificacao)) {
        alert("Por favor, insira um e-mail ou CPF válido.");
        return;
    }

    // Cria os parâmetros no formato x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("identificacao", identificacao);
    params.append("senha", senha);

    // Envia as credenciais ao backend para autenticação
    fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Identificação ou senha inválidos!");
        }
        return response.json();
    })
    .then((usuario) => {
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario)); // Marca o usuário como logado
        alert(`Bem-vindo(a), ${usuario.nome}!`);
        window.location.href = "menu.html"; // Redireciona para o menu
    })
    .catch((error) => {
        alert("Identificação ou senha inválidos!");
    });
});


// Navegar para a página de "Esqueci minha senha"
document.getElementById("forgotPasswordBtn").addEventListener("click", () => {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("forgotPasswordSection").style.display = "block";
});

// Voltar ao login
document.getElementById("backToLoginBtn").addEventListener("click", () => {
    document.getElementById("forgotPasswordSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
});

// Validar email e habilitar redefinição de senha
document.getElementById("forgotPasswordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("emailForgot").value;

    fetch("http://localhost:8080/usuario/email", {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // Define o tipo como texto puro
        body: email, // Envia a string diretamente
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Email não encontrado!");
        }
        return response.text();
    })
    .then(() => {
        alert("Email validado com sucesso! Por favor, defina uma nova senha.");
        document.getElementById("forgotPasswordForm").style.display = "none";
        document.getElementById("resetPasswordForm").style.display = "block";
    })
    .catch((error) => {
        alert("Erro: " + error.message);
    });
});

// Redefinir a senha
document.getElementById("resetPasswordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("emailForgot").value;
    const senha = document.getElementById("newPassword").value;

    fetch("http://localhost:8080/usuario/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
    })
    .then((response) => {
        if (!response.status === 200) {
            throw new Error("Erro ao redefinir a senha.");
            return response.json();
        } else {
            alert("Senha redefinida com sucesso! Você pode fazer login agora.");
            window.location.href = "cadastro_login.html";

        }
    })
    .then(() => {
    })
    .catch((error) => {
        alert("Erro: " + error.message);
    });
});

// Logout
function logout() {
    alert("Você foi desconectado.");
    window.location.href = "cadastro_login.html";
}
