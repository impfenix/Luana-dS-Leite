document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA PILHA (STACK) ---

    const stackInput = document.getElementById('stack-input');
    const stackPushBtn = document.getElementById('stack-push');
    const stackPopBtn = document.getElementById('stack-pop');
    const stackVisualizacao = document.getElementById('stack-visualizacao');

    let stack = []; // Array que representa a pilha

    // Função para renderizar/desenhar a pilha na tela
    const renderStack = () => {
        stackVisualizacao.innerHTML = ''; // Limpa a visualização atual
        stack.forEach(item => {
            const bloco = document.createElement('div');
            bloco.classList.add('bloco');
            bloco.textContent = item;
            stackVisualizacao.appendChild(bloco);
        });
    };

    // Evento para adicionar (push)
    stackPushBtn.addEventListener('click', () => {
        const valor = stackInput.value.trim();
        if (valor) {
            stack.push(valor); // Adiciona no final do array (topo da pilha)
            stackInput.value = '';
            renderStack();
        }
    });

    // Evento para remover (pop)
    stackPopBtn.addEventListener('click', () => {
        if (stack.length > 0) {
            stack.pop(); // Remove do final do array (topo da pilha)
            renderStack();
        }
    });
    
    // Permite adicionar com a tecla "Enter"
    stackInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            stackPushBtn.click();
        }
    });

    // --- LÓGICA DA FILA (QUEUE) ---

    const queueInput = document.getElementById('queue-input');
    const queueEnqueueBtn = document.getElementById('queue-enqueue');
    const queueDequeueBtn = document.getElementById('queue-dequeue');
    const queueVisualizacao = document.getElementById('queue-visualizacao');

    let queue = []; // Array que representa a fila

    // Função para renderizar/desenhar a fila na tela
    const renderQueue = () => {
        queueVisualizacao.innerHTML = ''; // Limpa a visualização atual
        queue.forEach(item => {
            const bloco = document.createElement('div');
            bloco.classList.add('bloco');
            bloco.textContent = item;
            queueVisualizacao.appendChild(bloco);
        });
    };

    // Evento para adicionar (enqueue)
    queueEnqueueBtn.addEventListener('click', () => {
        const valor = queueInput.value.trim();
        if (valor) {
            queue.push(valor); // Adiciona no final do array (final da fila)
            queueInput.value = '';
            renderQueue();
        }
    });

    // Evento para remover (dequeue)
    queueDequeueBtn.addEventListener('click', () => {
        if (queue.length > 0) {
            queue.shift(); // Remove do início do array (início da fila)
            renderQueue();
        }
    });
    
    // Permite adicionar com a tecla "Enter"
    queueInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            queueEnqueueBtn.click();
        }
    });
});
