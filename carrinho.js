//função para somar e atualizar itens do carrinho
function atualizarCarrinho() {
    let carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const carrinhoDiv = document.getElementById("carrinho");
    let total = 0;

    carrinhoDiv.innerHTML = carrinho.map((item, index) => {
        total += item.preco * item.quantidade;
        return `<p>${item.nome} - R$ ${(item.preco).toFixed(2)} (Quantidade: ${item.quantidade}) 
                <button onclick="removerDoCarrinho(${index})">Remover</button></p>`;
    }).join("");

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
}

//função para remover o item do carrinho
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}

function finalizarCompra() {
    window.location.href = "finalizar.html";
}

window.onload = atualizarCarrinho;
