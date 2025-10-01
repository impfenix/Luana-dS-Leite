document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA FILA CIRCULAR COM DESTAQUE DE CÓDIGO ---

    // Elementos da DOM
    const queueVisualizacao = document.getElementById('queue-visualizacao');
    const slots = document.querySelectorAll('.slot-fila');
    const estadoI = document.getElementById('estado-i');
    const estadoF = document.getElementById('estado-f');
    const estadoQt = document.getElementById('estado-qt');
    const queueInput = document.getElementById('queue-input');
    const queueEnqueueBtn = document.getElementById('queue-enqueue-btn');
    const cppCode = document.getElementById('cpp-code');

    // Variáveis de estado da Fila
    const MAX = 5;
    let dados = new Array(MAX).fill(null);
    let inicio = 0, fim = 0, qt = 0;
    
    // --- NOVA FUNÇÃO PARA DESTACAR CÓDIGO ---
    let highlightTimeout;
    const highlightCode = (functionName) => {
        // Limpa destaques anteriores e timeouts
        clearTimeout(highlightTimeout);
        const highlightedElements = cppCode.querySelectorAll('.line-highlight');
        highlightedElements.forEach(el => el.classList.remove('line-highlight'));

        if (!functionName) return;

        // Mapeia o nome da função para o texto no código
        const functionMap = {
            'inserir': 'void inserir(int valor)',
            'remover': 'void remover()'
        };
        const searchText = functionMap[functionName];
        if (!searchText) return;

        // Encontra as linhas da função e adiciona a classe de destaque
        const codeLines = cppCode.innerHTML.split('\n');
        let inFunction = false;
        let braceCount = 0;
        const newHtml = codeLines.map(line => {
            if (line.includes(searchText)) {
                inFunction = true;
                braceCount = (line.match(/{/g) || []).length;
                return `<span class="line-highlight">${line}</span>`;
            }
            if (inFunction) {
                braceCount += (line.match(/{/g) || []).length;
                braceCount -= (line.match(/}/g) || []).length;
                if (braceCount <= 0) {
                    inFunction = false;
                }
                return `<span class="line-highlight">${line}</span>`;
            }
            return line;
        }).join('\n');
        
        cppCode.innerHTML = newHtml;

        // Remove o destaque após um tempo
        highlightTimeout = setTimeout(() => {
            const highlighted = cppCode.querySelectorAll('.line-highlight');
            highlighted.forEach(el => el.classList.remove('line-highlight'));
        }, 2500); // Destaque dura 2.5 segundos
    };

    // Função de renderização (sem grandes mudanças)
    const renderQueue = () => {
        slots.forEach((slot, index) => {
            slot.innerHTML = '';
            if (dados[index] !== null) {
                const bloco = document.createElement('div');
                bloco.classList.add('bloco-brinquedo', `cor-${(parseInt(dados[index]) % 5) + 1}`);
                bloco.textContent = dados[index];
                if (index === inicio && qt > 0) bloco.draggable = true;
                slot.appendChild(bloco);
            }
        });
        document.querySelectorAll('.ponteiro').forEach(p => p.remove());
        if (qt > 0) {
            const pI = document.createElement('div');
            pI.classList.add('ponteiro', 'inicio');
            pI.textContent = 'I';
            slots[inicio].appendChild(pI);
        }
        if (qt < MAX) {
            const pF = document.createElement('div');
            pF.classList.add('ponteiro', 'fim');
            pF.textContent = 'F';
            slots[fim].appendChild(pF);
        }
        estadoI.textContent = inicio;
        estadoF.textContent = fim;
        estadoQt.textContent = qt;
    };

    // Função de INSERÇÃO (Enqueue) com chamada para destacar
    const enqueue = () => {
        const valor = queueInput.value.trim();
        if (!valor) {
            alert("Por favor, digite um valor.");
            return;
        }
        if (qt === MAX) {
            alert("Fila cheia!");
            highlightCode('inserir'); // Destaca mesmo se der erro, para mostrar a verificação
            return;
        }
        dados[fim] = valor;
        fim = (fim + 1) % MAX;
        qt++;
        queueInput.value = '';
        renderQueue();
        highlightCode('inserir'); // << DESTAQUE ACONTECE AQUI
    };

    // Função de REMOÇÃO (Dequeue) com chamada para destacar
    const dequeue = () => {
        if (qt === 0) {
            alert("Fila vazia!");
            highlightCode('remover'); // Destaca mesmo se der erro
            return;
        }
        dados[inicio] = null;
        inicio = (inicio + 1) % MAX;
        qt--;
        renderQueue();
        highlightCode('remover'); // << DESTAQUE ACONTECE AQUI
    };

    // Eventos dos botões
    queueEnqueueBtn.addEventListener('click', enqueue);
    queueInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enqueue();
    });

    // Simulação de remoção por um botão (já que o drag-and-drop foi removido)
    // Para simplificar, vamos adicionar um botão de remoção
    const dequeueBtn = document.createElement('button');
    dequeueBtn.textContent = 'Remover com Botão';
    dequeueBtn.addEventListener('click', dequeue);
    queueEnqueueBtn.parentElement.appendChild(dequeueBtn);

    // Renderiza o estado inicial
    renderQueue();
});
