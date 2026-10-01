// Aguarda todo o HTML da página ser carregado antes de executar o código JavaScript
document.addEventListener("DOMContentLoaded", function() {
    
    // Captura o campo de texto onde o usuário digita o código do objeto
    const inputObjetoUnico = document.getElementById("input-objeto-unico");
    
    // Captura o botão (+) que adiciona o objeto à lista
    const btnAddObjeto = document.getElementById("btn-add-objeto");
    
    // Captura a div cinza usada para listar os objetos adicionados antes de gerar
    const previewListaObjetos = document.getElementById("preview-lista-objetos");
    
    // Captura o campo de texto onde o usuário digita o CPF do recebedor
    const inputCpf = document.getElementById("input-cpf");
    
    // Captura o campo de texto onde o usuário digita o nome do recebedor
    const inputNome = document.getElementById("input-nome");
    
    // Captura o botão principal 'Gerar Comprovante'
    const btnGerar = document.getElementById("btn-gerar");
    
    // Captura o botão 'Limpar Dados'
    const btnLimpar = document.getElementById("btn-limpar");
    
    // Captura o botão 'Imprimir (A4)'
    const btnImprimir = document.getElementById("btn-imprimir");
    
    // Captura a mensagem de texto vermelha que avisa se o CPF for inválido
    const cpfErro = document.getElementById("cpf-erro");

    // Cria uma lista (Array) vazia na memória para armazenar os códigos dos objetos adicionados
    let listaDeObjetos = [];

    // Função responsável por atualizar e desenhar a listagem cinza de objetos na tela
    function atualizarPreviewObjetos() {
        // Se não houver nenhum objeto na lista
        if (listaDeObjetos.length === 0) {
            // Esconde a caixinha cinza de prévia
            previewListaObjetos.style.display = "none";
            // Limpa o conteúdo interno dela
            previewListaObjetos.innerHTML = "";
            // Interrompe a função aqui
            return;
        }
        
        // Se houver objetos, exibe a caixinha cinza mudando o display para 'block'
        previewListaObjetos.style.display = "block";
        // Limpa o HTML interno antigo da caixinha antes de reconstruir a lista atualizada
        previewListaObjetos.innerHTML = "";

        // Percorre cada código de objeto armazenado na lista para criar seu elemento visual
        listaDeObjetos.forEach((objeto, index) => {
            // Cria um novo elemento 'div' na memória
            const itemDiv = document.createElement("div");
            // Define a classe CSS dele para estilização
            itemDiv.className = "item-objeto-lista";
            // Insere o texto do código e o botão '✕' com o índice da posição dele na lista
            itemDiv.innerHTML = `
                <span>${objeto}</span>
                <span class="btn-remover-item" data-index="${index}">✕</span>
            `;
            // Adiciona essa nova div dentro do container cinza de prévia
            previewListaObjetos.appendChild(itemDiv);
        });

        // Captura todos os botões '✕' que acabaram de ser gerados na tela e adiciona um evento de clique em cada um
        document.querySelectorAll(".btn-remover-item").forEach(btn => {
            btn.addEventListener("click", function() {
                // Descobre a posição (índice) do objeto associado ao botão clicado
                const idx = parseInt(this.getAttribute("data-index"));
                // Remove exatamente 1 item da lista na posição encontrada
                listaDeObjetos.splice(idx, 1);
                // Atualiza a caixinha cinza na tela com a lista nova
                atualizarPreviewObjetos();
            });
        });
    }

    // Função que processa a entrada de um novo código de rastreio
    function dispararAdicaoObjeto() {
        // Pega o texto digitado, remove espaços inúteis e transforma tudo em maiúsculo
        const codigo = inputObjetoUnico.value.trim().toUpperCase();
        // Se o campo estiver vazio, cancela a ação e não faz nada
        if (codigo === "") return;

        // Verifica se o código digitado já existe dentro da lista na memória
        if (listaDeObjetos.includes(codigo)) {
            // Alerta o usuário sobre a duplicidade
            alert("Este objeto já foi adicionado.");
            // Interrompe a execução
            return;
        }

        // Insere o novo código válido no final da lista
        listaDeObjetos.push(codigo);
        // Limpa o campo de digitação do objeto para o próximo dado
        inputObjetoUnico.value = "";
        // Coloca o cursor piscando de volta no campo de digitação
        inputObjetoUnico.focus();
        // Atualiza a listagem cinza visual na tela
        atualizarPreviewObjetos();
    }

    // Configura o botão (+) para chamar a função de adicionar ao ser clicado
    btnAddObjeto.addEventListener("click", dispararAdicaoObjeto);

    // Monitora as teclas pressionadas no campo de código do objeto
    inputObjetoUnico.addEventListener("keydown", function(e) {
        // Se o usuário pressionar a tecla 'Enter'
        if (e.key === "Enter") {
            // Impede o comportamento padrão do navegador (como recarregar a página)
            e.preventDefault();
            // Executa a adição do objeto
            dispararAdicaoObjeto();
        }
    });

    // Aplica formatação automática (máscara) enquanto o usuário digita o CPF
    inputCpf.addEventListener("input", function(e) {
        // Remove tudo o que não for número do campo
        let value = e.target.value.replace(/\D/g, "");
        // Limita o tamanho do texto interno em no máximo 11 caracteres numéricos
        if (value.length > 11) value = value.slice(0, 11);
        
        // Se tiver mais de 9 dígitos, coloca os pontos e o traço (000.000.000-00)
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
        // Se tiver mais de 6 dígitos, coloca os dois pontos (000.000.000)
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        // Se tiver mais de 3 dígitos, coloca o primeiro ponto (000.000)
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
        }
        // Devolve o valor formatado com símbolos de volta para a tela do usuário
        e.target.value = value;
    });

    // Algoritmo matemático oficial para validação de CPF brasileiro
    function validarCPF(cpf) {
        // Remove pontos e traços para validar apenas os 11 números puros
        cpf = cpf.replace(/\D/g, '');
        // Se não tiver 11 dígitos ou for uma sequência repetida conhecida (ex: 111.111.111-11), invalida
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação matemática do primeiro dígito verificador
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        // Validação matemática do segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        // Se passou em todos os testes, o CPF é verdadeiro
        return true;
    }

    // Processa os dados e constrói o Comprovante Final ao clicar em 'Gerar Comprovante'
    btnGerar.addEventListener("click", function() {
        // Pega o CPF digitado
        const cpfFormatado = inputCpf.value;
        // Pega o nome digitado removendo espaços nas pontas
        const nome = inputNome.value.trim();

        // Bloqueia a geração se nenhuma encomenda/objeto foi cadastrado na lista
        if (listaDeObjetos.length === 0) {
            alert("Por favor, adicione pelo menos um objeto antes de gerar.");
            inputObjetoUnico.focus();
            return;
        }

        // Bloqueia se o nome ou o CPF estiverem em branco
        if (!nome || !cpfFormatado) {
            alert("Por favor, preencha o Nome e o CPF.");
            return;
        }

        // Valida o CPF. Se falhar, exibe a mensagem de erro vermelha na tela
        if (!validarCPF(cpfFormatado)) {
            cpfErro.style.display = "block";
            inputCpf.focus();
            return;
        } else {
            // Se o CPF for válido, garante que a mensagem de erro fique escondida
            cpfErro.style.display = "none";
        }

        // Escreve o CPF validado no campo correspondente dentro do comprovante impresso
        document.getElementById("txt-cpf").innerText = cpfFormatado;
        // Escreve o nome digitado no campo correspondente dentro do comprovante impresso
        document.getElementById("txt-nome").innerText = nome;

        // Pega a data e hora do relógio do computador no momento exato do clique
        const agora = new Date();
        // Formata para o padrão brasileiro (DD/MM/AAAA HH:MM)
        const dataHoraFormatada = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        // Alimenta a linha de Data/Hora no comprovante
        document.getElementById("txt-data-hora").innerText = dataHoraFormatada;

        // Captura o contêiner interno da coluna esquerda do comprovante
        const colunaObjetos = document.getElementById("coluna-objetos-qrcodes");
        // Limpa qualquer QR code antigo que tenha ficado lá de uma geração anterior
        colunaObjetos.innerHTML = ""; 

        // Loop para gerar a estrutura HTML e criar a imagem de QR code para cada item da lista
        listaDeObjetos.forEach((codigoObjeto, index) => {
            // Cria um identificador único de id em texto para cada caixa de imagem (ex: qrcode-sub-item-0)
            const idQrBox = `qrcode-sub-item-${index}`;
            
            // Cria a div que guardará o texto e o gráfico do código
            const divObjeto = document.createElement("div");
            // Adiciona a classe CSS do bloco individual
            divObjeto.className = "bloco-objeto-individual";
            // Preenche a div com o cabeçalho do código e a caixinha vazia onde entrará o QR Code gráfico
            divObjeto.innerHTML = `
                <div class="texto-codigo-objeto">${codigoObjeto}</div>
                <div id="${idQrBox}" class="qrcode-box"></div>
            `;
            
            // Coloca a div preenchida na estrutura visual da coluna esquerda
            colunaObjetos.appendChild(divObjeto);

            // Executa a biblioteca externa (qrcode.min.js) para desenhar o QR code dentro da div que criamos
            new QRCode(document.getElementById(idQrBox), {
                text: codigoObjeto,           // Conteúdo embutido dentro da imagem do QR code
                width: 90,                    // Largura física em pixels da imagem gerada
                height: 90,                   // Altura física em pixels da imagem gerada
                colorDark : "#000000",         // Define a cor dos módulos (quadradinhos) como preto
                colorLight : "#ffffff",        // Define a cor de fundo como branco
                correctLevel : QRCode.CorrectLevel.M // Nível médio de correção de erros para leitura rápida
            });
        });

        // Torna a área do comprovante montada totalmente visível na tela
        document.getElementById("comprovante-a5").style.display = "block";
        // Destrava o botão de impressão mudando o estado do disabled para falso
        btnImprimir.disabled = false;
    });

    // Função associada ao botão 'Limpar Dados'
    btnLimpar.addEventListener("click", function() {
        // Limpa o texto da caixa de entrada do objeto
        inputObjetoUnico.value = "";
        // Limpa o texto da caixa do CPF
        inputCpf.value = "";
        // Limpa o texto da caixa do Nome
        inputNome.value = "";
        
        // Esvazia completamente o array de objetos na memória
        listaDeObjetos = [];
        // Executa a atualização para apagar e sumir com os previews cinzas da tela
        atualizarPreviewObjetos();

        // Oculta a mensagem de erro de CPF, caso estivesse ativa
        cpfErro.style.display = "none";
        // Oculta o comprovante estruturado da tela mudando o display para 'none'
        document.getElementById("comprovante-a5").style.display = "none";
        
        // Trava novamente o botão de impressão para evitar impressões em branco
        btnImprimir.disabled = true;

        // Recoloca o foco do teclado no primeiro campo do formulário
        inputObjetoUnico.focus();
    });

    // Função que ativa a impressão nativa do sistema
    btnImprimir.addEventListener("click", function() {
        // Abre a janela de diálogo de impressão do navegador
        window.print();
    });
});