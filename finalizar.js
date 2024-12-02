// Função para confirmar o pedido
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

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    // Formata o pedido conforme o backend espera
    const pedido = {
        itens: carrinho.map(item => ({
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
        })),
        enderecoEntrega: usuarioLogado.endereco, // Assume que o endereço está no usuário logado
        total: total,
    };

    // Envia o pedido ao backend
    fetch("http://localhost:8080/pedido/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao finalizar pedido.");
            }
            return response.json();
        })
        .then(() => {
            // Redireciona para a página de pagamento
            window.location.href = "pagamento.html";
        })
        .catch((error) => {
            alert("Erro ao processar o pedido: " + error.message);
        });
}

// Inicializa a página e preenche o resumo do pedido
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
