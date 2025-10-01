document.addEventListener('DOMContentLoaded', () => {
    // --- MAPA DE CÓDIGOS C++ ---
    const cppCodes = {
        circular: `
class FilaCircular {
private:
    int *dados;
    int inicio, fim, qt, MAX;
public:
    FilaCircular(int tamanho) { MAX = tamanho; /*...*/ }

    bool estaVazia() { return qt == 0; }
    bool estaCheia() { return qt == MAX; }

    void inserir(int valor) {
        if (estaCheia()) { return; } // Verifica
        dados[fim] = valor; // Insere
        fim = (fim + 1) % MAX; // Atualiza
        qt++;
    }
    void remover() {
        if (estaVazia()) { return; } // Verifica
        // Nenhuma ação no dado
        inicio = (inicio + 1) % MAX; // Atualiza
        qt--;
    }
};`,
        estatica: `
class FilaEstatica {
private:
    int *dados;
    int inicio, fim, MAX;
public:
    FilaEstatica(int tamanho) { MAX = tamanho; /*...*/ }

    bool estaVazia() { return inicio == fim; }
    bool estaCheia() { return fim == MAX; }

    void inserir(int valor) {
        if (estaCheia()) { return; } // Verifica
        dados[fim] = valor; // Insere
        fim++; // Atualiza
    }
    void remover() {
        if (estaVazia()) { return; } // Verifica
        // Nenhuma ação no dado
        inicio++; // Atualiza
    }
};`,
        dinamica: `
struct No {
    int dado;
    No* proximo;
};
class FilaDinamica {
private:
    No *inicio, *fim;
public:
    FilaDinamica() { /*...*/ }

    bool estaVazia() { return inicio == nullptr; }
    // Fila dinâmica não fica "cheia"
    // (apenas por falta de memória)

    void inserir(int valor) {
        No* novoNo = new No; // Aloca memória
        novoNo->dado = valor;
        novoNo->proximo = nullptr;
        if (estaVazia()) {
            inicio = novoNo;
        } else {
            fim->proximo = novoNo;
        }
        fim = novoNo; // Atualiza ponteiro
    }
    void remover() {
        if (estaVazia()) { return; } // Verifica
        No* temp = inicio;
        inicio = inicio->proximo; // Atualiza ponteiro
        if (inicio == nullptr) {
            fim = nullptr;
        }
        delete temp; // Libera memória
    }
};`
    };

    // --- ELEMENTOS DA DOM ---
    const filaTitulo = document.getElementById('fila-titulo');
    const filaDescricao = document.getElementById('fila-descricao');
    const visFixa = document.getElementById('fila-fixa-vis');
    const visDinamica = document.getElementById('fila-dinamica-vis');
    const slots = document.querySelectorAll('.slot-fila');
    const estadoI = document.getElementById('estado-i'), estadoF = document.getElementById('estado-f'), estadoQt = document.getElementById('estado-qt');
    const queueInput = document.getElementById('queue-input');
    const cppCodeBlock = document.querySelector('#cpp-code-container pre');
    const cppCodeElement = document.getElementById('cpp-code');
    const selectorBtns = document.querySelectorAll('.selector-btn');
    const btnVerificarCheia = document.getElementById('btn-verificar-cheia'), btnInserirValor = document.getElementById('btn-inserir-valor'), btnAtualizarFim = document.getElementById('btn-atualizar-fim');
    const btnVerificarVazia = document.getElementById('btn-verificar-vazia'), btnRemoverValor = document.getElementById('btn-remover-valor'), btnAtualizarInicio = document.getElementById('btn-atualizar-inicio');
    
    // --- ESTADO GLOBAL ---
    let currentQueueType = 'circular';
    const MAX = 5;
    let dados, inicio, fim, qt;
    let highlightTimeout;

    // --- FUNÇÕES DE CONTROLE ---
    function setup(type) {
        currentQueueType = type;
        // Atualiza UI
        selectorBtns.forEach(btn => {
            btn.classList.toggle('active', btn.id === `select-${type}`);
        });
        visFixa.classList.toggle('hidden', type === 'dinamica');
        visDinamica.classList.toggle('hidden', type !== 'dinamica');
        cppCodeElement.innerHTML = cppCodes[type];
        Prism.highlightAll();

        const titulos = { circular: 'Fila Circular', estatica: 'Fila Estática', dinamica: 'Fila Dinâmica' };
        const descricoes = {
            circular: 'Ocupa um vetor de tamanho fixo, mas reutiliza o espaço ao tratar o fim do vetor como conectado ao início.',
            estatica: 'Implementação mais simples em vetor. Ocupa espaço fixo e pode haver desperdício se a fila esvaziar.',
            dinamica: 'Usa alocação dinâmica de memória (ponteiros). Cresce conforme a necessidade e não tem limite de tamanho.'
        };
        filaTitulo.textContent = titulos[type];
        filaDescricao.textContent = descricoes[type];
        
        // Reseta o estado da fila
        if (type === 'dinamica') {
            dados = []; // Usaremos um array para simular a lista encadeada
            inicio = null;
            fim = null;
        } else { // Estática ou Circular
            dados = new Array(MAX).fill(null);
            inicio = 0;
            fim = 0;
        }
        qt = 0;
        render();
    }
    
    function highlightCode(lines) {
        clearTimeout(highlightTimeout);
        cppCodeBlock.removeAttribute('data-line');
        setTimeout(() => {
            cppCodeBlock.setAttribute('data-line', lines);
            Prism.highlightAll();
            highlightTimeout = setTimeout(() => {
                 cppCodeBlock.removeAttribute('data-line');
                 Prism.highlightAll();
            }, 3000);
        }, 50);
    }
    
    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function render() {
        if (currentQueueType === 'dinamica') {
            renderDinamica();
        } else {
            renderFixa();
        }
    }

    function renderFixa() {
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

        const isEstaticaVazia = currentQueueType === 'estatica' && inicio === fim;
        const isCircularVazia = currentQueueType === 'circular' && qt === 0;

        if (!isEstaticaVazia && !isCircularVazia) {
             const pI = document.createElement('div'); pI.classList.add('ponteiro', 'inicio'); pI.textContent = 'I'; slots[inicio].appendChild(pI);
        }
        const pF = document.createElement('div'); pF.classList.add('ponteiro', 'fim'); pF.textContent = 'F'; slots[fim].appendChild(pF);
        
        estadoI.textContent = inicio; estadoF.textContent = fim;
        estadoQt.textContent = (currentQueueType === 'circular') ? qt : fim - inicio;
    }

    function renderDinamica() {
        visDinamica.innerHTML = '';
        dados.forEach((nodeValue, index) => {
            const noDiv = document.createElement('div');
            noDiv.className = 'no-dinamico';

            const bloco = document.createElement('div');
            bloco.classList.add('bloco-brinquedo', `cor-${(parseInt(nodeValue) % 5) + 1}`);
            bloco.textContent = nodeValue;
            noDiv.appendChild(bloco);

            if (index < dados.length - 1) {
                const seta = document.createElement('div');
                seta.className = 'seta-dinamica';
                noDiv.appendChild(seta);
            }
            visDinamica.appendChild(noDiv);
        });

        if (dados.length === 0) {
            const nullText = document.createElement('span');
            nullText.className = 'null-pointer';
            nullText.textContent = 'nullptr';
            visDinamica.appendChild(nullText);
        }
        
        estadoI.textContent = (inicio !== null) ? `[${dados[0]}]` : 'null';
        estadoF.textContent = (fim !== null) ? `[${dados[dados.length-1]}]` : 'null';
        estadoQt.textContent = dados.length;
    }
    
    // --- LÓGICA DOS BOTÕES DE CONTROLE (AGORA COM CONDICIONAIS) ---

    btnVerificarCheia.addEventListener('click', () => {
        let isFull = false;
        if (currentQueueType === 'circular') { isFull = qt === MAX; highlightCode('10'); }
        if (currentQueueType === 'estatica') { isFull = fim === MAX; highlightCode('10'); }
        if (currentQueueType === 'dinamica') { isFull = false; highlightCode('12-13'); } // Dinâmica não enche
        alert(isFull ? "VERIFICADO: A fila está cheia!" : "VERIFICADO: A fila tem espaço.");
    });

    btnInserirValor.addEventListener('click', () => {
        const valor = queueInput.value.trim();
        if (!valor) { alert("Digite um valor."); return; }
        
        if (currentQueueType === 'circular') {
            if (qt === MAX) { alert("ERRO: Fila cheia."); return; }
            highlightCode('14'); dados[fim] = valor;
        }
        if (currentQueueType === 'estatica') {
            if (fim === MAX) { alert("ERRO: Fila cheia."); return; }
            highlightCode('14'); dados[fim] = valor;
        }
        if (currentQueueType === 'dinamica') {
            highlightCode('19-21'); dados.push(valor); // Simulação simples
        }
        render();
    });

    btnAtualizarFim.addEventListener('click', () => {
        if (currentQueueType === 'circular') {
            if (qt < MAX && dados[fim] !== null) {
                highlightCode('15-16'); fim = (fim + 1) % MAX; qt++;
            } else { alert("Insira um valor antes de atualizar."); }
        }
        if (currentQueueType === 'estatica') {
            if (fim < MAX && dados[fim] !== null) {
                highlightCode('15'); fim++;
            } else { alert("Insira um valor antes de atualizar."); }
        }
        if (currentQueueType === 'dinamica') {
            highlightCode('22-27');
            // Simulação: na renderização já está ok, só atualiza ponteiros
            inicio = (dados.length > 0) ? 0 : null;
            fim = (dados.length > 0) ? dados.length - 1 : null;
        }
        queueInput.value = '';
        render();
    });

    btnVerificarVazia.addEventListener('click', () => {
        let isEmpty = false;
        if (currentQueueType === 'circular') { isEmpty = qt === 0; highlightCode('9'); }
        if (currentQueueType === 'estatica') { isEmpty = inicio === fim; highlightCode('9'); }
        if (currentQueueType === 'dinamica') { isEmpty = dados.length === 0; highlightCode('9'); }
        alert(isEmpty ? "VERIFICADO: A fila está vazia." : "VERIFICADO: A fila contém elementos.");
    });
    
    btnRemoverValor.addEventListener('click', () => {
        if (currentQueueType === 'circular' || currentQueueType === 'estatica') {
            const isEmpty = (currentQueueType === 'circular') ? qt === 0 : inicio === fim;
            if (isEmpty) { alert("ERRO: Fila vazia."); return; }
            highlightCode('20, 26'); // Linhas de comentário
            dados[inicio] = null;
        }
        if (currentQueueType === 'dinamica') {
            if (dados.length === 0) { alert("ERRO: Fila vazia."); return; }
            highlightCode('32, 37'); // Linhas delete e temp
            // Na nossa simulação, remover o primeiro elemento é o ato
        }
        render();
    });

    btnAtualizarInicio.addEventListener('click', () => {
        if (currentQueueType === 'circular') {
            if (qt > 0 && dados[inicio] === null) {
                highlightCode('21-22'); inicio = (inicio + 1) % MAX; qt--;
            } else { alert("Remova um valor antes de atualizar."); }
        }
        if (currentQueueType === 'estatica') {
            if (inicio < fim && dados[inicio] === null) {
                highlightCode('27'); inicio++;
            } else { alert("Remova um valor antes de atualizar."); }
        }
        if (currentQueueType === 'dinamica') {
             if (dados.length > 0) {
                highlightCode('33-36');
                dados.shift(); // Remove o primeiro elemento do array de simulação
             } else { alert("A fila já está vazia."); }
        }
        render();
    });
    
    // --- INICIALIZAÇÃO ---
    selectorBtns.forEach(btn => {
        btn.addEventListener('click', () => setup(btn.id.replace('select-', '')));
    });
    setup('circular'); // Inicia com a Fila Circular
});
