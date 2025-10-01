document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA PILHA (SEM ALTERAÇÕES) ---
    const stackInput = document.getElementById('stack-input');
    const stackPushBtn = document.getElementById('stack-push');
    const stackPopBtn = document.getElementById('stack-pop');
    const stackVisualizacao = document.getElementById('stack-visualizacao');
    let stack = [];

    const renderStack = () => {
        stackVisualizacao.innerHTML = '';
        stack.forEach(item => {
            const bloco = document.createElement('div');
            bloco.classList.add('bloco');
            bloco.textContent = item;
            stackVisualizacao.appendChild(bloco);
        });
    };
    stackPushBtn.addEventListener('click', () => {
        const valor = stackInput.value.trim();
        if (valor) {
            stack.push(valor);
            stackInput.value = '';
            renderStack();
        }
    });
    stackPopBtn.addEventListener('click', () => {
        if (stack.length > 0) {
            stack.pop();
            renderStack();
        }
    });

    // --- NOVA LÓGICA DA FILA CIRCULAR ---

    // Elementos da DOM
    const queueInput = document.getElementById('queue-input');
    const queueEnqueueBtn = document.getElementById('queue-enqueue');
    const queueDequeueBtn = document.getElementById('queue-dequeue');
    const slots = document.querySelectorAll('.slot-fila');

    // Elementos do mostrador de estado
    const estadoI = document.getElementById('estado-i');
    const estadoF = document.getElementById('estado-f');
    const estadoQt = document.getElementById('estado-qt');

    // Variáveis de estado da Fila, como no quadro
    const MAX = 5;
    let dados = new Array(MAX).fill(null); // O vetor 'dados'
    let inicio = 0; // Ponteiro 'I'
    let fim = 0;    // Ponteiro 'F'
    let qt = 0;     // Contador 'qt'

    // Função para renderizar (desenhar) o estado da fila na tela
    const renderQueue = () => {
        // 1. Atualiza os blocos visuais
        slots.forEach((slot, index) => {
            slot.innerHTML = ''; // Limpa o slot primeiro
            
            if (dados[index] !== null) {
                const bloco = document.createElement('div');
                bloco.classList.add('bloco-brinquedo');
                // Adiciona uma cor baseada no valor para ficar mais bonito
                bloco.classList.add(`cor-${(parseInt(dados[index]) % 5) + 1}`);
                bloco.textContent = dados[index];
                slot.appendChild(bloco);
            }
        });

        // 2. Atualiza os ponteiros I e F
        // Remove ponteiros antigos antes de adicionar novos
        document.querySelectorAll('.ponteiro').forEach(p => p.remove());

        if (qt > 0) { // Mostra o ponteiro de início se a fila não estiver vazia
            const ponteiroInicio = document.createElement('div');
            ponteiroInicio.classList.add('ponteiro', 'inicio');
            ponteiroInicio.textContent = 'I';
            slots[inicio].appendChild(ponteiroInicio);
        }

        if (qt < MAX) { // Mostra o ponteiro de fim se a fila não estiver cheia
            const ponteiroFim = document.createElement('div');
            ponteiroFim.classList.add('ponteiro', 'fim');
            ponteiroFim.textContent = 'F';
            slots[fim].appendChild(ponteiroFim);
        }

        // 3. Atualiza os valores no painel de estado
        estadoI.textContent = inicio;
        estadoF.textContent = fim;
        estadoQt.textContent = qt;
    };

    // Função de INSERÇÃO (Enqueue), como no quadro
    const enqueue = () => {
        // "Verifica se a fila está cheia (qt == MAX)"
        if (qt === MAX) {
            alert("Fila cheia! Não é possível inserir.");
            return;
        }

        const valor = queueInput.value.trim();
        if (!valor) {
            alert("Por favor, digite um valor.");
            return;
        }

        // "insere em dados[FIM] o valor"
        dados[fim] = valor;
        
        // "atualiza fim (Fim++)" e a lógica circular
        // "Se Fim == MAX => Fim = 0"
        fim = (fim + 1) % MAX; // O operador '%' faz a lógica circular de forma simples

        // "atualiza qt (qt++)"
        qt++;

        queueInput.value = '';
        renderQueue(); // Redesenha a fila com os novos dados
    };

    // Função de REMOÇÃO (Dequeue), como no quadro
    const dequeue = () => {
        // "verifica se a fila está vazia (qt == 0)"
        if (qt === 0) {
            alert("Fila vazia! Não é possível remover.");
            return;
        }

        // Remove o dado da posição 'inicio'
        dados[inicio] = null;

        // "atualiza I (I++)" e a lógica circular
        // "Se I == MAX => I = 0"
        inicio = (inicio + 1) % MAX;

        // "atualiza qt (qt--)"
        qt--;
        
        renderQueue(); // Redesenha a fila
    };

    // Conecta as funções aos botões
    queueEnqueueBtn.addEventListener('click', enqueue);
    queueDequeueBtn.addEventListener('click', dequeue);
    queueInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            enqueue();
        }
    });

    // Renderiza o estado inicial da aplicação
    renderStack();
    renderQueue();
});
