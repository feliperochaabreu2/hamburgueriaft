document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (header) {
        header.innerHTML = `
            <h1>Hamburgueria Nova Delícia</h1>
            <nav>
                <a href="cadastro_login.html">Cadastro/Login</a>
                <a href="menu.html">Cardápio</a>
                <a href="carrinho.html">Carrinho</a>
                <a href="finalizar.html">Finalizar Compra</a>
                <a href="#" onclick="logout()">Logout</a>
            </nav>
        `;
    }
});

function logout() {
    sessionStorage.clear();
    alert("Você foi desconectado.");
    window.location.href = "cadastro_login.html";
}

function isUserLoggedIn() {
    return sessionStorage.getItem("usuarioLogado") !== null;
}
//função para adicionar item ao carrinho 
function adicionarAoCarrinho(item) {
    if (!isUserLoggedIn()) {
        alert("Você precisa estar logado para adicionar itens ao carrinho!");
        window.location.href = "cadastro_login.html";
        return;
    }

    let carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const itemExistente = carrinho.find((produto) => produto.nome === item.nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...item, quantidade: 1 });
    }

    sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert(`${item.nome} foi adicionado ao carrinho!`);
}