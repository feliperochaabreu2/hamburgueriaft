// Navegar para a página de Cadastro
document.getElementById("createAccountBtn").addEventListener("click", () => {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";
});

// Cadastro de novo usuário
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const email = document.getElementById("emailSignup").value.trim();
    const senha = document.getElementById("senhaSignup").value.trim();

    const usuario = { nome, cpf, telefone, endereco, email, senha };

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
            window.location.href = "cadastro_login.html";
        })
        .catch((error) => {
            alert("Erro no cadastro: " + error.message);
        });
});

// Login de usuário existente
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let identificacao = document.getElementById("identificacao").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    const numericPattern = /^\d{11}$/;
    if (numericPattern.test(identificacao)) {
        identificacao = identificacao
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const isEmail = identificacao.includes("@");

    if (!isEmail && !cpfPattern.test(identificacao)) {
        alert("Por favor, insira um e-mail ou CPF válido.");
        return;
    }

    fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identificacao, senha }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Identificação ou senha inválidos!");
            }
            return response.json();
        })
        .then((usuario) => {
            sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario)); // Salvar usuário logado
            alert(`Bem-vindo(a), ${usuario.nome}!`);
            window.location.href = "menu.html";
        })
        .catch(() => {
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

    const email = document.getElementById("emailForgot").value.trim();

    fetch("http://localhost:8080/usuario/email", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: email,
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

    const email = document.getElementById("emailForgot").value.trim();
    const senha = document.getElementById("newPassword").value.trim();

    fetch("http://localhost:8080/usuario/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao redefinir a senha.");
            }
            return response.json();
        })
        .then(() => {
            alert("Senha redefinida com sucesso! Você pode fazer login agora.");
            window.location.href = "cadastro_login.html";
        })
        .catch((error) => {
            alert("Erro: " + error.message);
        });
});

// Logout
function logout() {
    sessionStorage.clear();
    alert("Você foi desconectado.");
    window.location.href = "cadastro_login.html";
}
