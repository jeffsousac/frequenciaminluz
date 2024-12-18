
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const contadoresCategorias = document.querySelector("#contadores-categorias");


let numeroSequencial = localStorage.getItem("numeroSequencial") || 1;


function salvarRegistros() {
    const registros = Array.from(document.querySelectorAll(".card")).map(card => {
        return {
            id: card.dataset.id,
            numero: card.dataset.numero,
            nome: card.querySelector(".nome").textContent,
            categoria: card.dataset.categoria,
            responsavel: card.querySelector(".responsavel").textContent,
            contato: card.querySelector(".contato").textContent,
            observacoes: card.querySelector(".observacoes").textContent
        };
    });
    localStorage.setItem("registros", JSON.stringify(registros));
    localStorage.setItem("numeroSequencial", numeroSequencial);
    atualizarContadores();
}


function carregarRegistros() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.forEach(registro => {
        adicionarRegistro(registro);
    });
    atualizarContadores();
}


function adicionarRegistro(dados) {
    const card = document.createElement("div");
    card.className = `card ${dados.categoria}`;
    card.dataset.id = dados.id || gerarID();
    card.dataset.numero = dados.numero || numeroSequencial++;
    card.dataset.categoria = dados.categoria;

    card.innerHTML = `
        <span class="id">#${card.dataset.numero}</span>
        <h3 class="nome">${dados.nome}</h3>
        <p><strong>Categoria:</strong> <span class="categoria">${obterNomeCategoria(dados.categoria)}</span></p>
        <p><strong>Responsável:</strong> <span class="responsavel">${dados.responsavel}</span></p>
        <p><strong>Contato:</strong> <span class="contato">${dados.contato}</span></p>
        <p><strong>Observações:</strong> <span class="observacoes">${dados.observacoes || 'Sem observações'}</span></p>
    `;

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");
    btnExcluir.addEventListener("click", () => {
        resultado.removeChild(card);
        salvarRegistros();
    });

    card.appendChild(btnExcluir);
    resultado.appendChild(card);
}


function obterNomeCategoria(categoria) {
    const categorias = {
        'bercario1': 'Berçário 1',
        'bercario2': 'Berçário 2',
        '3anos': '3 anos',
        '4anos': '4 anos',
        '5e6anos': '5 e 6 anos',
        '7a11anos': '7 a 11 anos'
    };
    return categorias[categoria] || categoria;
}


function atualizarContadores() {
    const registros = document.querySelectorAll(".card");
    const contadores = {};

    registros.forEach(registro => {
        const categoria = registro.dataset.categoria;
        contadores[categoria] = (contadores[categoria] || 0) + 1;
    });

    contadoresCategorias.innerHTML = '';
    for (const [categoria, count] of Object.entries(contadores)) {
        const div = document.createElement("div");
        div.classList.add("contador-categoria", categoria);
        div.textContent = `${obterNomeCategoria(categoria)}: ${count}`;
        contadoresCategorias.appendChild(div);
    }
}


formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        responsavel: document.getElementById("responsavel").value,
        contato: document.getElementById("contato").value,
        observacoes: document.getElementById("observacoes").value
    };

    adicionarRegistro(dados);
    salvarRegistros();
    formulario.reset();
});


window.addEventListener("load", carregarRegistros);

function gerarID() {
    return Math.floor(100000 + Math.random() * 900000);
}
