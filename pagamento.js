document.addEventListener("DOMContentLoaded", () => {
    const pedidoResumo = document.getElementById("pedidoResumo");
    const totalDiv = document.getElementById("total");
    const pagamentoForm = document.getElementById("pagamentoForm");
    const metodoPagamentoRadios = document.getElementsByName("metodoPagamento");
    const cartaoPagamentoDiv = document.getElementById("cartaoPagamento");

    // Preenche o resumo do pedido
    const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    let total = 0;

    pedidoResumo.innerHTML = carrinho.map((item) => {
        total += item.preco * item.quantidade;
        return `<p>${item.nome} - R$ ${(item.preco).toFixed(2)} (Quantidade: ${item.quantidade})</p>`;
    }).join("");
    totalDiv.innerText = `Total: R$ ${total.toFixed(2)}`;

    // Alterna exibição do formulário de cartão
    metodoPagamentoRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            cartaoPagamentoDiv.style.display = radio.value === "cartao" ? "block" : "none";
        });
    });

    // Submissão do pagamento
    pagamentoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const metodo = [...metodoPagamentoRadios].find(radio => radio.checked).value;

        if (metodo === "cartao") {
            const dadosCartao = {
                nome: document.getElementById("nomeCartao").value,
                numero: document.getElementById("numeroCartao").value,
                validade: document.getElementById("validadeCartao").value,
                cvv: document.getElementById("cvvCartao").value,
            };
            console.log("Pagamento com cartão:", dadosCartao);
        }

        // Exibe alerta com o endereço
        const enderecoEntrega = usuarioLogado?.endereco || "não informado";
        alert(`Pagamento realizado com sucesso. O pedido será entregue no endereço: ${enderecoEntrega}`);

        sessionStorage.removeItem("carrinho");
        window.location.href = "menu.html";
    });
});
