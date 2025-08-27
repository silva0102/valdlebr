// =========================
// ARRAY DE AGENTES COM INFORMAÇÕES
// =========================
const agentesValorant = [
    { nome: "Brimstone", funcao: "Controlador", genero: "Masculino", estreia: "2020" },
    { nome: "Viper", funcao: "Controlador", genero: "Feminino", estreia: "2020" },
    { nome: "Omen", funcao: "Controlador", genero: "Masculino", estreia: "2020" },
    { nome: "Cypher", funcao: "Sentinela", genero: "Masculino", estreia: "2020" },
    { nome: "Sage", funcao: "Sentinela", genero: "Feminino", estreia: "2020" },
    { nome: "Sova", funcao: "Iniciador", genero: "Masculino", estreia: "2020" },
    { nome: "Jett", funcao: "Duelista", genero: "Feminino", estreia: "2020" },
    { nome: "Phoenix", funcao: "Duelista", genero: "Masculino", estreia: "2020" },
    { nome: "Reyna", funcao: "Duelista", genero: "Feminino", estreia: "2020" },
    { nome: "Raze", funcao: "Duelista", genero: "Feminino", estreia: "2020" },
    { nome: "Breach", funcao: "Iniciador", genero: "Masculino", estreia: "2020" },
    { nome: "Skye", funcao: "Iniciador", genero: "Feminino", estreia: "2020" },
    { nome: "Yoru", funcao: "Duelista", genero: "Masculino", estreia: "2021" },
    { nome: "Astra", funcao: "Controlador", genero: "Feminino", estreia: "2021" },
    { nome: "KAY/O", funcao: "Iniciador", genero: "Masculino", estreia: "2021" },
    { nome: "Chamber", funcao: "Sentinela", genero: "Masculino", estreia: "2021" },
    { nome: "Neon", funcao: "Duelista", genero: "Feminino", estreia: "2022" },
    { nome: "Fade", funcao: "Iniciador", genero: "Feminino", estreia: "2022" },
    { nome: "Harbor", funcao: "Controlador", genero: "Masculino", estreia: "2022" },
    { nome: "Gekko", funcao: "Duelista", genero: "Masculino", estreia: "2023" },
    { nome: "Deadlock", funcao: "Sentinela", genero: "Feminino", estreia: "2023" },
    { nome: "Iso", funcao: "Duelista", genero: "Masculino", estreia: "2024" },
    { nome: "Clove", funcao: "Controlador", genero: "Feminino", estreia: "2025" },
    { nome: "Vyse", funcao: "Sentinela", genero: "Masculino", estreia: "2025" },
    { nome: "Tejo", funcao: "Iniciador", genero: "Masculino", estreia: "2025" },
    { nome: "Waylay", funcao: "Duelista", genero: "Feminino", estreia: "2025" }
];


// =========================
// MAPEAMENTO FUNÇÕES API → PORTUGUÊS
// =========================
const funcoesPT = {
    "Duelist": "Duelista",
    "Sentinel": "Sentinela",
    "Controller": "Controlador",
    "Initiator": "Iniciador"
};

// =========================
// SORTEIO AGENTE DO DIA COM LOCALSTORAGE
// =========================
function sortearAgente() {
    const index = Math.floor(Math.random() * agentesValorant.length);
    return agentesValorant[index];
}

function selecionarAgenteDoDia() {
    const hoje = new Date().toISOString().slice(0, 10);

    let agenteDoDia = localStorage.getItem("agenteDoDia");
    const dataSalva = localStorage.getItem("dataAgente");

    if (!agenteDoDia || dataSalva !== hoje) {
        const novoAgente = sortearAgente();
        localStorage.setItem("agenteDoDia", JSON.stringify(novoAgente));
        localStorage.setItem("dataAgente", hoje);
        console.log("Novo agente do dia:", novoAgente.nome);
        return novoAgente;
    }

    try {
        agenteDoDia = JSON.parse(agenteDoDia);
        return agenteDoDia;
    } catch (e) {
        console.warn("Erro no JSON do localStorage, sorteando outro agente...");
        const novoAgente = sortearAgente();
        localStorage.setItem("agenteDoDia", JSON.stringify(novoAgente));
        localStorage.setItem("dataAgente", hoje);
        return novoAgente;
    }
}

// =========================
// INICIAR AGENTE DIÁRIO AUTOMÁTICO
// =========================
function iniciarAgenteDiario() {
    const agora = new Date();
    const proximaMeiaNoite = new Date();
    proximaMeiaNoite.setHours(24, 0, 0, 0);
    const tempoParaMeiaNoite = proximaMeiaNoite - agora;

    // Executa imediatamente
    selecionarAgenteDoDia();

    // Depois, espera até a meia-noite e repete todo dia
    setTimeout(() => {
        selecionarAgenteDoDia();
        setInterval(selecionarAgenteDoDia, 24 * 60 * 60 * 1000);
    }, tempoParaMeiaNoite);
}

iniciarAgenteDiario();

// =========================
// FUNÇÃO BUSCAR AGENTE
// =========================
async function buscar_Agente() {
    const nomeAgenteInput = document.getElementById('agente').value.toLowerCase();

    const response = await fetch("https://valorant-api.com/v1/agents");
    const dados = await response.json();

    const agenteAPI = dados.data.find(a => a.displayName.toLowerCase() === nomeAgenteInput);
    if (!agenteAPI) {
        console.log("Agente não encontrado.");
        return;
    }

    const nome = agenteAPI.displayName;
    const funcaoAPI = agenteAPI.role ? agenteAPI.role.displayName : "Sem função";

    const funcao = funcoesPT[funcaoAPI] || funcaoAPI;

    // Busca as informações da array local
    const infoAgente = agentesValorant.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    const genero = infoAgente ? infoAgente.genero : "Desconhecido";
    const estreia = infoAgente ? infoAgente.estreia : "Desconhecido";

    // Recupera agente do dia
    const agenteDoDia = JSON.parse(localStorage.getItem("agenteDoDia"));
    const nomeDoDia = agenteDoDia.nome.toLowerCase();
    const funcaoDoDia = agenteDoDia.funcao.toLowerCase();
    const generoDoDia = agenteDoDia.genero.toLowerCase();
    const estreiaDoDia = agenteDoDia.estreia;

    const results = document.querySelectorAll(".result"); // [nome, genero, funcao, estreia]

    // Função para criar <p> com CSS direto
    function criarP(texto, destaque) {
        const p = document.createElement("p");
        p.textContent = texto;
        p.style.color = "white";
        p.style.fontSize = "14px";
        p.style.textAlign = "center";
        p.style.margin = "10px 0";
        p.style.padding = "4px 6px";
        p.style.borderRadius = "4px";
        p.style.width = "100%";
        p.style.backgroundColor = destaque ? "#22c55e" : "#333"; // verde se destaque, cinza normal
        return p;
    }

    // === Inserir no topo de cada coluna ===
    const colunas = [
        { valor: nome, destaque: nome.toLowerCase() === nomeDoDia },
        { valor: genero, destaque: genero.toLowerCase() === generoDoDia },
        { valor: funcao, destaque: funcao.toLowerCase() === funcaoDoDia },
        { valor: estreia, destaque: estreia === estreiaDoDia }
    ];

    colunas.forEach((col, i) => {
        const p = criarP(col.valor, col.destaque);
        results[i].insertBefore(p, results[i].firstChild);
        results[i].classList.remove("hidden");
    });

    console.log(`Agente buscado: ${nome} | Função: ${funcao} | Gênero: ${genero} | Estreia: ${estreia}`);
    console.log(`Agente do dia: ${agenteDoDia.nome} | Função: ${agenteDoDia.funcao} | Gênero: ${agenteDoDia.genero} | Estreia: ${agenteDoDia.estreia}`);
}
