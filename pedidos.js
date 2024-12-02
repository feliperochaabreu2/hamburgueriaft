document.addEventListener("DOMContentLoaded", () => {
    carregarPedidos();
});

function carregarPedidos() {
    fetch("http://localhost:8080/pedido", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar os pedidos.");
            }
            return response.json();
        })
        .then((pedidos) => {
            exibirPedidos(pedidos);
        })
        .catch((error) => {
            document.getElementById("pedidosContainer").innerHTML = `
                <p style="color: red;">Erro ao carregar os pedidos: ${error.message}</p>
            `;
        });
}

function exibirPedidos(pedidos) {
    const container = document.getElementById("pedidosContainer");
    if (pedidos.length === 0) {
        container.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        return;
    }

    container.innerHTML = pedidos
        .map((pedido) => {
            return `
                <div class="pedido">
                    <h3>Pedido #${pedido.idInt}</h3>
                    <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                    <p><strong>Endereço:</strong> ${pedido.enderecoEntrega}</p>
                    <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${pedido.entregue ? "Entregue" : "Pendente"}</p>
                    <h4>Itens:</h4>
                    <ul>
                        ${pedido.itens
                            .map(
                                (item) =>
                                    `<li>${item.quantidade}x ${item.nome} - R$ ${item.preco.toFixed(2)}</li>`
                            )
                            .join("")}
                    </ul>
                </div>
            `;
        })
        .join("");
}
