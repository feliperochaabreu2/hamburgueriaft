function confirmarPedido() {
    const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Por favor, faça login antes de finalizar o pedido.");
        window.location.href = "cadastro_login.html";
        return;
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Redireciona para a página de pagamento
    window.location.href = "pagamento.html";
}

window.onload = function () {
    const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const resumoDiv = document.getElementById("pedidoResumo");
    let total = 0;

    resumoDiv.innerHTML = carrinho.map((item) => {
        total += item.preco * item.quantidade;
        return `<p>${item.nome} - R$ ${(item.preco).toFixed(2)} (Quantidade: ${item.quantidade})</p>`;
    }).join("");

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
};
