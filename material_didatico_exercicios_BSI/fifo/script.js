document.addEventListener('DOMContentLoaded', () => {
    // --- MAPA DE CÓDIGOS C++ (COM STRUCT E CLASS) ---
    const cppCodes = {
        struct: {
            circular: `
// Implementação com STRUCT
struct FilaCircular {
private:
    int *dados;
    int inicio, fim, qt, MAX;
public:
    FilaCircular(int t) { MAX = t; /*...*/ }
    bool estaVazia() { return qt == 0; }
    bool estaCheia() { return qt == MAX; }
    void inserir(int v) {
        if (estaCheia()) { return; }
        dados[fim] = v;
        fim = (fim + 1) % MAX;
        qt++;
    }
    void remover() {
        if (estaVazia()) { return; }
        inicio = (inicio + 1) % MAX;
        qt--;
    }
};`,
            estatica: `
// Implementação com STRUCT
struct FilaEstatica {
private:
    int *dados;
    int inicio, fim, MAX;
public:
    FilaEstatica(int t) { MAX = t; /*...*/ }
    bool estaVazia() { return inicio == fim; }
    bool estaCheia() { return fim == MAX; }
    void inserir(int v) {
        if (estaCheia()) { return; }
        dados[fim] = v;
        fim++;
    }
    void remover() {
        if (estaVazia()) { return; }
        inicio++;
    }
};`,
            dinamica: `
// Nó da lista, com struct
struct No { int dado; No* proximo; };

// Fila com STRUCT
struct FilaDinamica {
private:
    No *inicio, *fim;
public:
    FilaDinamica() { /*...*/ }
    bool estaVazia() { return inicio == nullptr; }
    void inserir(int v) {
        No* novoNo = new No;
        novoNo->dado = v;
        novoNo->proximo = nullptr;
        if (estaVazia()) {
            inicio = novoNo;
        } else {
            fim->proximo = novoNo;
        }
        fim = novoNo;
    }
    void remover() {
        if (estaVazia()) { return; }
        No* temp = inicio;
        inicio = inicio->proximo;
        if (inicio == nullptr) { fim = nullptr; }
        delete temp;
    }
};`
        },
        class: {
            circular: `
// Implementação com CLASS
class FilaCircular {
private:
    int *dados;
    int inicio, fim, qt, MAX;
public:
    FilaCircular(int t) { MAX = t; /*...*/ }
    bool estaVazia() { return qt == 0; }
    bool estaCheia() { return qt == MAX; }
    void inserir(int v) {
        if (estaCheia()) { return; }
        dados[fim] = v;
        fim = (fim + 1) % MAX;
        qt++;
    }
    void remover() {
        if (estaVazia()) { return; }
        inicio = (inicio + 1) % MAX;
        qt--;
    }
};`,
            estatica: `
// Implementação com CLASS
class FilaEstatica {
private:
    int *dados;
    int inicio, fim, MAX;
public:
    FilaEstatica(int t) { MAX = t; /*...*/ }
    bool estaVazia() { return inicio == fim; }
    bool estaCheia() { return fim == MAX; }
    void inserir(int v) {
        if (estaCheia()) { return; }
        dados[fim] = v;
        fim++;
    }
    void remover() {
        if (estaVazia()) { return; }
        inicio++;
    }
};`,
            dinamica: `
// Nó da lista, com struct
struct No { int dado; No* proximo; };

// Fila com CLASS
class FilaDinamica {
private:
    No *inicio, *fim;
public:
    FilaDinamica() { /*...*/ }
    bool estaVazia() { return inicio == nullptr; }
    void inserir(int v) {
        No* novoNo = new No;
        novoNo->dado = v;
        novoNo->proximo = nullptr;
        if (estaVazia()) {
            inicio = novoNo;
        } else {
            fim->proximo = novoNo;
        }
        fim = novoNo;
    }
    void remover() {
        if (estaVazia()) { return; }
        No* temp = inicio;
        inicio = inicio->proximo;
        if (inicio == nullptr) { fim = nullptr; }
        delete temp;
    }
};`
        }
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
    const queueSelectorBtns = document.querySelectorAll('.queue-selector button');
    const codeSelectorBtns = document.querySelectorAll('.code-selector button');
    const btnVerificarCheia = document.getElementById('btn-verificar-cheia'), btnInserirValor = document.getElementById('btn-inserir-valor'), btnAtualizarFim = document.getElementById('btn-atualizar-fim');
    const btnVerificarVazia = document.getElementById('btn-verificar-vazia'), btnRemoverValor = document.getElementById('btn-remover-valor'), btnAtualizarInicio = document.getElementById('btn-atualizar-inicio');
    
    // --- ESTADO GLOBAL ---
    let currentQueueType = 'circular';
    let currentCodeType = 'struct';
    const MAX = 5;
    let dados, inicio, fim, qt;
    let highlightTimeout;

    // --- FUNÇÕES DE CONTROLE ---
    function setup() {
        queueSelectorBtns.forEach(btn => btn.classList.toggle('active', btn.id === `select-${currentQueueType}`));
        codeSelectorBtns.forEach(btn => btn.classList.toggle('active', btn.id === `select-${currentCodeType}`));
        visFixa.classList.toggle('hidden', currentQueueType === 'dinamica');
        visDinamica.classList.toggle('hidden', currentQueueType !== 'dinamica');
        cppCodeElement.textContent = cppCodes[currentCodeType][currentQueueType];
        Prism.highlightAll();
        const titulos = { circular: 'Fila Circular', estatica: 'Fila Estática', dinamica: 'Fila Dinâmica' };
        const descricoes = {
            circular: 'Ocupa um vetor de tamanho fixo, mas reutiliza o espaço ao tratar o fim do vetor como conectado ao início.',
            estatica: 'Implementação mais simples em vetor. Ocupa espaço fixo e pode haver desperdício se a fila esvaziar.',
            dinamica: 'Usa alocação dinâmica de memória (ponteiros). Cresce conforme a necessidade e não tem limite de tamanho.'
        };
        filaTitulo.textContent = titulos[currentQueueType];
        filaDescricao.textContent = descricoes[currentQueueType];
        if (currentQueueType === 'dinamica') {
            dados = [];
            inicio = null; fim = null;
        } else {
            dados = new Array(MAX).fill(null);
            inicio = 0; fim = 0;
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
        if (currentQueueType === 'dinamica') renderDinamica();
        else renderFixa();
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
        if ((currentQueueType === 'estatica' && fim < MAX) || currentQueueType === 'circular') {
            const pF = document.createElement('div'); pF.classList.add('ponteiro', 'fim'); pF.textContent = 'F'; slots[fim].appendChild(pF);
        }
        estadoI.textContent = inicio; estadoF.textContent = fim;
        estadoQt.textContent = (currentQueueType === 'circular') ? qt : fim - inicio;
    }

    function renderDinamica() {
        visDinamica.innerHTML = '';
        dados.forEach((nodeValue, index) => {
            const noDiv = document.createElement('div'); noDiv.className = 'no-dinamico';
            const bloco = document.createElement('div');
            bloco.classList.add('bloco-brinquedo', `cor-${(parseInt(nodeValue) % 5) + 1}`);
            bloco.textContent = nodeValue;
            noDiv.appendChild(bloco);
            if (index < dados.length - 1) {
                const seta = document.createElement('div'); seta.className = 'seta-dinamica';
                noDiv.appendChild(seta);
            }
            visDinamica.appendChild(noDiv);
        });
        if (dados.length === 0) {
            const nullText = document.createElement('span'); nullText.className = 'null-pointer';
            nullText.textContent = 'nullptr'; visDinamica.appendChild(nullText);
        }
        estadoI.textContent = (dados.length > 0) ? `[${dados[0]}]` : 'null';
        estadoF.textContent = (dados.length > 0) ? `[${dados[dados.length-1]}]` : 'null';
        estadoQt.textContent = dados.length;
    }
    
    // --- LÓGICA DOS BOTÕES DE CONTROLE ---
    btnVerificarCheia.addEventListener('click', () => {
        let isFull = false;
        if (currentQueueType === 'circular') { isFull = qt === MAX; highlightCode('9'); }
        if (currentQueueType === 'estatica') { isFull = fim === MAX; highlightCode('10'); }
        if (currentQueueType === 'dinamica') { isFull = false; highlightCode('12'); alert("VERIFICADO: Fila dinâmica não tem limite de tamanho!"); return; }
        alert(isFull ? "VERIFICADO: A fila está cheia!" : "VERIFICADO: A fila tem espaço.");
    });

    btnInserirValor.addEventListener('click', () => {
        const valor = queueInput.value.trim();
        if (!valor) { alert("Digite um valor."); return; }
        if (currentQueueType === 'circular') {
            if (qt === MAX) { alert("ERRO: Fila cheia."); return; }
            highlightCode('12'); dados[fim] = valor;
        } else if (currentQueueType === 'estatica') {
            if (fim === MAX) { alert("ERRO: Fila cheia."); return; }
            highlightCode('13'); dados[fim] = valor;
        } else if (currentQueueType === 'dinamica') {
            highlightCode('15-17'); dados.push(valor);
        }
        render();
    });

    btnAtualizarFim.addEventListener('click', () => {
        if (currentQueueType === 'circular') {
            if (qt < MAX && dados[fim] !== null) {
                highlightCode('13-14'); fim = (fim + 1) % MAX; qt++;
            } else { alert("Insira um valor antes de atualizar."); return; }
        } else if (currentQueueType === 'estatica') {
            if (fim < MAX && dados[fim] !== null) {
                highlightCode('14'); fim++;
            } else { alert("Insira um valor antes de atualizar."); return; }
        } else if (currentQueueType === 'dinamica') {
            highlightCode('18-23');
        }
        queueInput.value = '';
        render();
    });

    btnVerificarVazia.addEventListener('click', () => {
        let isEmpty = false;
        if (currentQueueType === 'circular') { isEmpty
