document.addEventListener("DOMContentLoaded", () => {
    const pedidoResumo = document.getElementById("pedidoResumo");
    const totalDiv = document.getElementById("total");
    const pagamentoForm = document.getElementById("pagamentoForm");
    const metodoPagamentoRadios = document.getElementsByName("metodoPagamento");
    const cartaoPagamentoDiv = document.getElementById("cartaoPagamento");
    const numeroCartaoInput = document.getElementById("numeroCartao");
    const validadeCartaoInput = document.getElementById("validadeCartao");
    const nomeCartaoInput = document.getElementById("nomeCartao");
    const cvvCartaoInput = document.getElementById("cvvCartao");
    const bandeiraSpan = document.createElement("span");

    // Preenche o resumo do pedido
    const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    let total = 0;

    pedidoResumo.innerHTML = carrinho.map((item) => {
        total += item.preco * item.quantidade;
        return `<p>${item.nome} - R$ ${(item.preco).toFixed(2)} (Quantidade: ${item.quantidade})</p>`;
    }).join("");
    totalDiv.innerText = `Total: R$ ${total.toFixed(2)}`;

    // Alterna exibição do formulário de cartão e manipula obrigatoriedade
    metodoPagamentoRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            const isCartao = radio.value === "cartao";
            cartaoPagamentoDiv.style.display = isCartao ? "block" : "none";

            // Define obrigatoriedade dos campos de cartão de crédito
            nomeCartaoInput.required = isCartao;
            numeroCartaoInput.required = isCartao;
            validadeCartaoInput.required = isCartao;
            cvvCartaoInput.required = isCartao;

            // Limpa valores e mensagens de erro dos campos se o método não for cartão
            if (!isCartao) {
                nomeCartaoInput.value = "";
                numeroCartaoInput.value = "";
                validadeCartaoInput.value = "";
                cvvCartaoInput.value = "";
                bandeiraSpan.textContent = "";
            }
        });
    });

    // Máscara e validação do número do cartão
    const bandeiras = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        diners: /^3(?:0[0-5]|[68])/,
        discover: /^6(?:011|5)/,
        jcb: /^(?:2131|1800|35\d{3})/,
    };

    bandeiraSpan.style.fontSize = "0.8rem";
    bandeiraSpan.style.position = "absolute";
    bandeiraSpan.style.right = "10px";
    bandeiraSpan.style.top = "50%";
    bandeiraSpan.style.transform = "translateY(-50%)";
    bandeiraSpan.style.color = "#888";
    bandeiraSpan.style.fontStyle = "italic";
    bandeiraSpan.style.pointerEvents = "none";
    numeroCartaoInput.parentNode.style.position = "relative";
    numeroCartaoInput.parentNode.appendChild(bandeiraSpan);

    numeroCartaoInput.addEventListener("input", () => {
        let valor = numeroCartaoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        valor = valor.replace(/(\d{4})/g, "$1 ").trim(); // Adiciona espaço a cada 4 dígitos
        numeroCartaoInput.value = valor;

        let bandeira = "";
        for (const [nome, regex] of Object.entries(bandeiras)) {
            if (regex.test(valor)) {
                bandeira = nome.charAt(0).toUpperCase() + nome.slice(1); // Exibe bandeira
                break;
            }
        }
        bandeiraSpan.textContent = bandeira;
    });

    numeroCartaoInput.addEventListener("blur", () => {
        if (!numeroCartaoInput.value) {
            bandeiraSpan.textContent = ""; // Limpa bandeira se o campo estiver vazio
        }
    });

    // Máscara para validade do cartão
    validadeCartaoInput.addEventListener("input", () => {
        let valor = validadeCartaoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{2})/, "$1/$2"); // Adiciona barra após dois primeiros dígitos
        }
        validadeCartaoInput.value = valor;
    });

    // Submissão do pagamento
    pagamentoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const metodo = [...metodoPagamentoRadios].find(radio => radio.checked).value;

        let modoPagamento;
        if (metodo === "cartao") {
            modoPagamento = "credito";
            const dadosCartao = {
                nome: nomeCartaoInput.value,
                numero: numeroCartaoInput.value,
                validade: validadeCartaoInput.value,
                cvv: cvvCartaoInput.value,
            };
            console.log("Pagamento com cartão:", dadosCartao);
        } else if (metodo === "pix") {
            modoPagamento = "pix";
            console.log("Pagamento com Pix.");
        }

        const pedido = {
            cliente: usuarioLogado.email, // Adiciona a propriedade cliente com o email do usuário
            itens: carrinho.map(item => ({
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade,
            })),
            enderecoEntrega: usuarioLogado.endereco,
            total: total,
            metodoPagamento: metodo,
            modoPagamento: modoPagamento, // Envia "pix" ou "credito"
            status: false, // Adiciona um status booleano
        };

        try {
            const response = await fetch("http://localhost:8080/pedido/finalizar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido),
            });

            if (!response.ok) {
                throw new Error("Erro ao processar o pedido.");
            }

            alert("Pagamento realizado com sucesso. O pedido será entregue no endereço informado.");
            sessionStorage.removeItem("carrinho");
            window.location.href = "menu.html";
        } catch (error) {
            alert("Erro ao processar o pagamento: " + error.message);
        }
    });
});
