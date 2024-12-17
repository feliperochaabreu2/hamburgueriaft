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
                    <p><strong>Cliente:</strong> ${
                        pedido.cliente ? pedido.cliente : "Cliente não cadastrado"
                    }</p>
                    <p><strong>Endereço:</strong> ${pedido.enderecoEntrega}</p>
                    <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${
                        pedido.status ? "Entregue" : "Pendente"
                    }</p>

                    ${
                        !pedido.status
                            ? `<label>
                                <input type="checkbox" onchange="alterarStatus(${pedido.idInt}, this)">
                                Marcar como Entregue
                            </label>`
                            : ""
                    }

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

function alterarStatus(id, checkbox) {
    if (checkbox.checked) {
        fetch(`http://localhost:8080/pedido/status`, {
            method: "PUT", // Ou PUT, dependendo da sua implementação
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }), // Envia o ID do pedido
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar o status.");
                }
                alert("Status do pedido atualizado para Entregue.");
                carregarPedidos(); // Recarrega os pedidos para atualizar a lista
            })
            .catch((error) => {
                alert("Erro: " + error.message);
                checkbox.checked = false; // Desmarca o checkbox em caso de erro
            });
    }
}
