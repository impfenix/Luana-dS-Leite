document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da DOM ---
    const slots = document.querySelectorAll('.slot-fila');
    const estadoI = document.getElementById('estado-i'), estadoF = document.getElementById('estado-f'), estadoQt = document.getElementById('estado-qt');
    const queueInput = document.getElementById('queue-input');
    const cppCodeBlock = document.querySelector('#cpp-code-container pre');

    // Botões de controle
    const btnVerificarCheia = document.getElementById('btn-verificar-cheia');
    const btnInserirValor = document.getElementById('btn-inserir-valor');
    const btnAtualizarFim = document.getElementById('btn-atualizar-fim');
    const btnVerificarVazia = document.getElementById('btn-verificar-vazia');
    const btnRemoverValor = document.getElementById('btn-remover-valor');
    const btnAtualizarInicio = document.getElementById('btn-atualizar-inicio');

    // --- Variáveis de estado da Fila ---
    const MAX = 5;
    let dados = new Array(MAX).fill(null);
    let inicio = 0, fim = 0, qt = 0;
    let highlightTimeout;
    
    // --- Funções Auxiliares ---

    // Função para destacar linhas específicas no código C++
    const highlightCode = (lines) => {
        clearTimeout(highlightTimeout);
        // Remove o atributo para limpar destaques antigos
        cppCodeBlock.removeAttribute('data-line');
        
        // Pequeno delay para o Prism.js atualizar a remoção
        setTimeout(() => {
            cppCodeBlock.setAttribute('data-line', lines);
            // Força o Prism a redesenhar os destaques
            Prism.highlightAll(); 

            // Define um tempo para remover o destaque
            highlightTimeout = setTimeout(() => {
                 cppCodeBlock.removeAttribute('data-line');
                 Prism.highlightAll();
            }, 3000); // Destaque dura 3 segundos
        }, 50);
    };

    // Função de renderização (desenha a fila na tela)
    const renderQueue = () => {
        slots.forEach((slot, index) => {
            slot.innerHTML = '';
            if (dados[index] !== null) {
                const bloco = document.createElement('div');
                bloco.classList.add('bloco-brinquedo', `cor-${(parseInt(dados[index]) % 5) + 1}`);
                bloco.textContent = dados[index];
                slot.appendChild(bloco);
            }
        });
        document.querySelectorAll('.ponteiro').forEach(p => p.remove());
        if (qt > 0) {
            const pI = document.createElement('div'); pI.classList.add('ponteiro', 'inicio'); pI.textContent = 'I'; slots[inicio].appendChild(pI);
        }
        const pF = document.createElement('div'); pF.classList.add('ponteiro', 'fim'); pF.textContent = 'F'; slots[fim].appendChild(pF);
        
        estadoI.textContent = inicio; estadoF.textContent = fim; estadoQt.textContent = qt;
    };

    // --- Lógica dos Botões de INSERÇÃO ---

    btnVerificarCheia.addEventListener('click', () => {
        // As linhas de código foram ajustadas para o novo HTML
        highlightCode('19-21'); // Linhas da função estaCheia
        if (qt === MAX) {
            alert("VERIFICADO: A fila está cheia!");
        } else {
            alert("VERIFICADO: A fila NÃO está cheia. Você pode inserir.");
        }
    });

    btnInserirValor.addEventListener('click', () => {
        if (qt === MAX) {
            alert("ERRO: A fila está cheia! Verifique primeiro.");
            return;
        }
        const valor = queueInput.value.trim();
        if (!valor) {
            alert("Por favor, digite um valor para inserir.");
            return;
        }
        highlightCode('28'); // Linha "dados[fim] = valor;"
        dados[fim] = valor;
        renderQueue(); // Renderiza para mostrar o valor inserido antes de atualizar o ponteiro
    });

    btnAtualizarFim.addEventListener('click', () => {
        // Verifica se um valor foi inserido mas o ponteiro ainda não foi atualizado
        if (qt < MAX && dados[fim] !== null) {
            highlightCode('31-32'); // Linhas "fim = ..." e "qt++;"
            fim = (fim + 1) % MAX;
            qt++;
            queueInput.value = '';
            renderQueue();
        } else if (qt === MAX) {
            alert("ERRO: A fila já está cheia.");
        } else {
            alert("ERRO: Insira um valor antes de atualizar o ponteiro.");
        }
    });


    // --- Lógica dos Botões de REMOÇÃO ---

    btnVerificarVazia.addEventListener('click', () => {
        highlightCode('15-17'); // Linhas da função estaVazia
        if (qt === 0) {
            alert("VERIFICADO: A fila está vazia!");
        } else {
            alert("VERIFICADO: A fila NÃO está vazia. Você pode remover.");
        }
    });

    btnRemoverValor.addEventListener('click', () => {
        if (qt === 0) {
            alert("ERRO: A fila está vazia! Verifique primeiro.");
            return;
        }
        highlightCode('42-44'); // Comentários sobre a remoção
        dados[inicio] = null; // Simula a remoção para fins visuais
        renderQueue();
    });
    
    btnAtualizarInicio.addEventListener('click', () => {
        // Verifica se um valor foi removido (agora é null) mas o ponteiro ainda não foi atualizado
        if (qt > 0 && dados[inicio] === null) {
            highlightCode('47-48'); // Linhas "inicio = ..." e "qt--;"
            inicio = (inicio + 1) % MAX;
            qt--;
            renderQueue();
        } else if (qt === 0) {
             alert("ERRO: A fila já está vazia.");
        } else {
            alert("ERRO: Remova um valor antes de atualizar o ponteiro.");
        }
    });


    // Renderiza o estado inicial
    renderQueue();
});
