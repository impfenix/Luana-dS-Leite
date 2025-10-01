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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    void inserir(int v) { /*...*/ }
    void remover() { /*...*/ }
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
    // ... (restante dos botões de controle)

    // --- ESTADO GLOBAL ---
    let currentQueueType = 'circular';
    let currentCodeType = 'struct';
    const MAX = 5;
    let dados, inicio, fim, qt;
    let highlightTimeout;
    
    // --- FUNÇÃO PRINCIPAL DE SETUP ---
    function setup() {
        // Atualiza UI dos seletores
        queueSelectorBtns.forEach(btn => btn.classList.toggle('active', btn.id === `select-${currentQueueType}`));
        codeSelectorBtns.forEach(btn => btn.classList.toggle('active', btn.id === `select-${currentCodeType}`));
        
        // Atualiza visualização (fixa vs. dinâmica)
        visFixa.classList.toggle('hidden', currentQueueType === 'dinamica');
        visDinamica.classList.toggle('hidden', currentQueueType !== 'dinamica');
        
        // Injeta o código C++ correto
        cppCodeElement.textContent = cppCodes[currentCodeType][currentQueueType];
        Prism.highlightAll();

        // Atualiza títulos e descrições
        const titulos = { circular: 'Fila Circular', estatica: 'Fila Estática', dinamica: 'Fila Dinâmica' };
        const descricoes = {
            circular: 'Ocupa um vetor de tamanho fixo, mas reutiliza o espaço ao tratar o fim do vetor como conectado ao início.',
            estatica: 'Implementação mais simples em vetor. Ocupa espaço fixo e pode haver desperdício se a fila esvaziar.',
            dinamica: 'Usa alocação dinâmica de memória (ponteiros). Cresce conforme a necessidade e não tem limite de tamanho.'
        };
        filaTitulo.textContent = titulos[currentQueueType];
        filaDescricao.textContent = descricoes[currentQueueType];
        
        // Reseta o estado da fila
        if (currentQueueType === 'dinamica') {
            dados = []; // Usaremos um array para simular a lista encadeada
            inicio = null; fim = null;
        } else {
            dados = new Array(MAX).fill(null);
            inicio = 0; fim = 0;
        }
        qt = 0;
        render();
    }

    // --- DEMAIS FUNÇÕES (render, highlight, lógica de botões) ---
    // (O restante do seu código JavaScript da resposta anterior pode ser colado aqui,
    // pois a lógica interna dos botões e da renderização não muda, apenas a forma
    // como o estado inicial e o código são selecionados pela função setup)

    // A lógica de renderização e dos botões permanece a mesma, pois ela opera
    // nas variáveis globais (dados, inicio, fim, qt), que são corretamente
    // inicializadas pela função setup().
    
    // Cole aqui o restante do seu script.js da resposta anterior, começando da função
    // highlightCode() até o final do arquivo.
    
    // --- INICIALIZAÇÃO ---
    queueSelectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentQueueType = btn.id.replace('select-', '');
            setup();
        });
    });

    codeSelectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCodeType = btn.id.replace('select-', '');
            setup();
        });
    });

    setup(); // Inicia a aplicação
});
