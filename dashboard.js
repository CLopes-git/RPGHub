const fichas = [
  {
    nome: "Sabedoria",
    classe: "Guerreiro Humano",
    nivel: 5,
    img: ""
  },
  {
    nome: "Thorin",
    classe: "Clérigo Anão",
    nivel: 3,
    img: ""
  },
  {
    nome: "Luniel",
    classe: "Mago Elfo",
    nivel: 4,
    img: ""
  },
  {
    nome: "Kragh",
    classe: "Bárbaro",
    nivel: 2,
    img: ""
  }
];

const container = document.getElementById("cards-container");

fichas.forEach(ficha => {
  container.innerHTML += `
    <div class="card">
      <img src="${ficha.img}">
      <div class="card-content">
        <h3>${ficha.nome}</h3>
        <p>${ficha.classe}</p>
        <p>Nível ${ficha.nivel}</p>
        <div class="actions">
          <button onclick="selecionar('${ficha.nome}')">Selecionar</button>
          <button onclick="editar('${ficha.nome}')">Editar</button>
        </div>
      </div>
    </div>
  `;
});

document.getElementById("total").textContent = fichas.length;

const media = fichas.reduce((acc, f) => acc + f.nivel, 0) / fichas.length;
document.getElementById("media").textContent = media.toFixed(1);

function selecionar(nome) {
  window.location.href = "fichas.html";
}

function editar(nome) {
  window.location.href = "fichas.html";
}

function criarFicha() {
  alert("Criar nova ficha");
}