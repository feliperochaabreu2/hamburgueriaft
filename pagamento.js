document.addEventListener("DOMContentLoaded", () => {
    const pedidoResumo = document.getElementById("pedidoResumo");
    const totalDiv = document.getElementById("total");
    const pagamentoForm = document.getElementById("pagamentoForm");
    const metodoPagamentoRadios = document.getElementsByName("metodoPagamento");
    const cartaoPagamentoDiv = document.getElementById("cartaoPagamento");
    const numeroCartaoInput = document.getElementById("numeroCartao");
    const validadeCartaoInput = document.getElementById("validadeCartao");

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

    // Formatação automática para número do cartão
    numeroCartaoInput.addEventListener("input", () => {
        let valor = numeroCartaoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        valor = valor.replace(/(\d{4})/g, "$1 ").trim(); // Adiciona espaço a cada 4 dígitos
        numeroCartaoInput.value = valor;
    });

    // Formatação automática para validade do cartão
    validadeCartaoInput.addEventListener("input", () => {
        let valor = validadeCartaoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{2})/, "$1/$2"); // Adiciona a barra após os dois primeiros dígitos
        }
        validadeCartaoInput.value = valor;
    });
});
//exibe a bandeira do cartão
document.addEventListener("DOMContentLoaded", () => {
    const numeroCartaoInput = document.getElementById("numeroCartao");

    const bandeiras = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        diners: /^3(?:0[0-5]|[68])/,
        discover: /^6(?:011|5)/,
        jcb: /^(?:2131|1800|35\d{3})/,
    };

    // Criação de um elemento span para exibir a bandeira
    const bandeiraSpan = document.createElement("span");
    bandeiraSpan.style.fontSize = "0.8rem";
    bandeiraSpan.style.position = "absolute";
    bandeiraSpan.style.right = "10px";
    bandeiraSpan.style.top = "50%";
    bandeiraSpan.style.transform = "translateY(-50%)";
    bandeiraSpan.style.color = "#888";
    bandeiraSpan.style.fontStyle = "italic";
    bandeiraSpan.style.pointerEvents = "none"; // Impede interação do usuário
    numeroCartaoInput.parentNode.style.position = "relative";
    numeroCartaoInput.parentNode.appendChild(bandeiraSpan);

    numeroCartaoInput.addEventListener("input", () => {
        const valor = numeroCartaoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        let bandeira = "";

        for (const [nome, regex] of Object.entries(bandeiras)) {
            if (regex.test(valor)) {
                bandeira = nome.charAt(0).toUpperCase() + nome.slice(1); // Nome com inicial maiúscula
                break;
            }
        }

        bandeiraSpan.textContent = bandeira; // Atualiza o texto do span
    });

    numeroCartaoInput.addEventListener("blur", () => {
        if (!numeroCartaoInput.value) {
            bandeiraSpan.textContent = ""; // Limpa o texto do span se campo vazio
        }
    });
});
