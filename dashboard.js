// Fichas padrão para exemplificar a funcionalidade e dar um ponto de partida para os usuários. 
// O código é a fonte verdadeira dos dados base, e o localStorage guarda apenas edições feitas pelo usuário em cima deles.
const FICHAS_DEFAULT = [
  {
    id: 1,
    nome: 'Sabedoria',
    classe: 'Guerreiro',
    raca: 'Humano',
    antecedente: 'Soldado',
    alinhamento: 'Leal Neutro',
    nivel: 5,
    xp: 6500,
    img: 'imgs/Sabedoria.webp',
    inspiracao: false,
    atributos: { forca: 15, destreza: 12, constituicao: 14, inteligencia: 10, sabedoria: 13, carisma: 8 },
    profSaving: { forca: true, destreza: false, constituicao: true, inteligencia: false, sabedoria: false, carisma: false },
    profPericias: { atletismo: true, percepcao: true, intimidacao: true, adestramento: true,
      acrobacia: false, arcanismo: false, atuacao: false, enganacao: false, furtividade: false,
      historia: false, intuicao: false, investigacao: false, medicina: false, natureza: false,
      persuasao: false, prestidigitacao: false, religiao: false, sobrevivencia: false },
    combate: { ca: 18, deslocamento: 9, hpMax: 44, hpAtual: 44, hpTemp: 0 },
    dadosVida: { tipo: 'd10', atual: 5 },
    testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] },
    ataques: [
      { nome: 'Espada Longa', bonus: '+5', dano: '1d8+3 cortante' },
      { nome: 'Arco Longo', bonus: '+4', dano: '1d8+1 perfurante' }
    ],
    personalidade: {
      tracos: 'Encaro problemas diretamente e tenho uma solução prática para cada situação.',
      ideais: 'Responsabilidade. Faço o que deve ser feito e obedeço às autoridades legítimas.',
      vinculos: 'Protejo quem serve sob minhas ordens como protegeria meus próprios filhos.',
      defeitos: 'Sou respeitoso com os superiores mesmo quando estão errados.'
    },
    moedas: { pc: 0, pe: 0, po: 15, pp: 0, pr: 0 },
    equipamento: 'Armadura de placas, escudo de aço, espada longa, arco longo, 20 flechas, equipamento de soldado, distintivo de patente',
    proficiencias: 'Armaduras leves, médias, pesadas e escudos; armas simples e marciais',
    idiomas: 'Comum',
    magia: { habilidade: '', truques: [], slots: Array.from({ length: 9 }, () => ({ max: 0, atual: 0, magias: [] })) }
  },
  {
    id: 2,
    nome: 'Thorin',
    classe: 'Clérigo',
    raca: 'Anão',
    antecedente: 'Acólito',
    alinhamento: 'Leal Bom',
    nivel: 3,
    xp: 900,
    img: 'imgs/Thorin.webp',
    inspiracao: false,
    atributos: { forca: 13, destreza: 9, constituicao: 14, inteligencia: 12, sabedoria: 16, carisma: 11 },
    profSaving: { forca: false, destreza: false, constituicao: false, inteligencia: false, sabedoria: true, carisma: true },
    profPericias: { intuicao: true, medicina: true, historia: true, religiao: true,
      acrobacia: false, adestramento: false, arcanismo: false, atletismo: false, atuacao: false,
      enganacao: false, furtividade: false, intimidacao: false, investigacao: false, natureza: false,
      percepcao: false, persuasao: false, prestidigitacao: false, sobrevivencia: false },
    combate: { ca: 16, deslocamento: 8, hpMax: 24, hpAtual: 24, hpTemp: 0 },
    dadosVida: { tipo: 'd8', atual: 3 },
    testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] },
    ataques: [
      { nome: 'Maça', bonus: '+3', dano: '1d6+1 concussão' },
      { nome: 'Arma Espiritual (magia)', bonus: '+5', dano: '1d8+3 radiante' }
    ],
    personalidade: {
      tracos: 'Posso encontrar terreno em comum entre os mais ferozes inimigos, estimulando empatia e entendimento.',
      ideais: 'Tradição. Os costumes e tradições dos antepassados devem ser preservados e honrados.',
      vinculos: 'Servirei ao meu templo e protegerei os fracos e necessitados até meu último fôlego.',
      defeitos: 'Odeio ceder, mesmo quando estou errado. A teimosia anã corre no meu sangue.'
    },
    moedas: { pc: 0, pe: 0, po: 8, pp: 0, pr: 0 },
    equipamento: 'Maça, armadura de escamas, escudo, símbolo sagrado (amuleto), vestes de sacerdote, equipamento de acólito',
    proficiencias: 'Armaduras leves e médias, escudos, armas simples',
    idiomas: 'Comum, Anão',
    magia: {
      habilidade: 'sabedoria',
      truques: ['Luz', 'Orientação', 'Resistência'],
      slots: [
        { max: 4, atual: 4, magias: ['Curar Ferimentos', 'Bênção', 'Proteção contra o Mal', 'Palavra de Cura'] },
        { max: 2, atual: 2, magias: ['Arma Espiritual', 'Restaurar'] },
        ...Array.from({ length: 7 }, () => ({ max: 0, atual: 0, magias: [] }))
      ]
    }
  },
  {
    id: 3,
    nome: 'Luniel',
    classe: 'Mago',
    raca: 'Elfo',
    antecedente: 'Sábio',
    alinhamento: 'Neutro',
    nivel: 4,
    xp: 2700,
    img: 'imgs/Luniel.webp',
    inspiracao: false,
    atributos: { forca: 8, destreza: 14, constituicao: 12, inteligencia: 18, sabedoria: 13, carisma: 10 },
    profSaving: { forca: false, destreza: false, constituicao: false, inteligencia: true, sabedoria: true, carisma: false },
    profPericias: { arcanismo: true, historia: true, investigacao: true, percepcao: true,
      acrobacia: false, adestramento: false, atletismo: false, atuacao: false, enganacao: false,
      furtividade: false, intuicao: false, intimidacao: false, medicina: false, natureza: false,
      persuasao: false, prestidigitacao: false, religiao: false, sobrevivencia: false },
    combate: { ca: 12, deslocamento: 9, hpMax: 22, hpAtual: 22, hpTemp: 0 },
    dadosVida: { tipo: 'd6', atual: 4 },
    testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] },
    ataques: [
      { nome: 'Dardos', bonus: '+4', dano: '1d4+2 perfurante' },
      { nome: 'Cajado', bonus: '+1', dano: '1d6−1 concussão' }
    ],
    personalidade: {
      tracos: 'Existem poucas dificuldades que não podem ser resolvidas por um bom estudo e uma mente afiada.',
      ideais: 'Conhecimento. O caminho para o poder e a auto-aperfeiçoamento passa pelo conhecimento.',
      vinculos: 'Meu grimório contém segredos que não posso deixar cair em mãos erradas.',
      defeitos: 'Subestimo quem não é dotado com poder arcano. Às vezes, isso me custa caro.'
    },
    moedas: { pc: 0, pe: 0, po: 20, pp: 2, pr: 0 },
    equipamento: 'Cajado arcano, grimório (encadernado em couro élfico), dardos (10), bolsa de componentes, mochila de estudante, tinta e penas',
    proficiencias: 'Adagas, dardos, fundas, cajados, blestera leve e pesada',
    idiomas: 'Comum, Élfico, Dracônico, Gnômico',
    magia: {
      habilidade: 'inteligencia',
      truques: ['Mão Mágica', 'Luz', 'Raio de Frio'],
      slots: [
        { max: 4, atual: 4, magias: ['Míssil Mágico', 'Escudo', 'Sono', 'Detectar Magia'] },
        { max: 3, atual: 3, magias: ['Invisibilidade', 'Sugestão'] },
        ...Array.from({ length: 7 }, () => ({ max: 0, atual: 0, magias: [] }))
      ]
    }
  },
  {
    id: 4,
    nome: 'Kragh',
    classe: 'Bárbaro',
    raca: 'Meio-Orc',
    antecedente: 'Forasteiro',
    alinhamento: 'Caótico Neutro',
    nivel: 2,
    xp: 300,
    img: 'imgs/Kragh.webp',
    inspiracao: false,
    atributos: { forca: 18, destreza: 13, constituicao: 16, inteligencia: 8, sabedoria: 11, carisma: 9 },
    profSaving: { forca: true, destreza: false, constituicao: true, inteligencia: false, sabedoria: false, carisma: false },
    profPericias: { atletismo: true, intimidacao: true, sobrevivencia: true, natureza: true,
      acrobacia: false, adestramento: false, arcanismo: false, atuacao: false, enganacao: false,
      furtividade: false, historia: false, intuicao: false, investigacao: false, medicina: false,
      percepcao: false, persuasao: false, prestidigitacao: false, religiao: false },
    combate: { ca: 14, deslocamento: 9, hpMax: 26, hpAtual: 26, hpTemp: 0 },
    dadosVida: { tipo: 'd12', atual: 2 },
    testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] },
    ataques: [
      { nome: 'Machado de Guerra', bonus: '+6', dano: '1d12+4 cortante' },
      { nome: 'Machado de Mão', bonus: '+6', dano: '1d6+4 cortante' },
      { nome: 'Frenesi (em Fúria)', bonus: '+6', dano: '1d6+4 cortante (bônus)' }
    ],
    personalidade: {
      tracos: 'Sou direto ao ponto e odeio rodeios. Digo o que penso e faço o que falo.',
      ideais: 'Força. Os fortes se impõem. Os fracos devem aprender a se tornar fortes.',
      vinculos: 'Minha tribo me exilou, mas ainda carrego seu emblema tatuado no peito.',
      defeitos: 'Deixo minha cólera se sobrepor ao bom senso com muita frequência.'
    },
    moedas: { pc: 15, pe: 0, po: 3, pp: 0, pr: 0 },
    equipamento: 'Machado de guerra, dois machados de mão, pacote de explorador, troféu de um inimigo derrotado (garra de urso), pele de animal',
    proficiencias: 'Armaduras leves e médias, escudos, armas simples e marciais',
    idiomas: 'Comum, Orc',
    magia: { habilidade: '', truques: [], slots: Array.from({ length: 9 }, () => ({ max: 0, atual: 0, magias: [] })) }
  }
];

// ===== DADOS =====

const IDS_DEFAULT = new Set(FICHAS_DEFAULT.map(f => f.id));

function carregarFichas() {
  const raw = localStorage.getItem('rpghub_fichas');
  const armazenadas = raw ? JSON.parse(raw) : [];

  // Personagens padrão: o código é sempre a fonte verdadeira dos dados base.
  // O localStorage guarda apenas edições feitas pelo usuário em cima deles.
  const fichasDefault = FICHAS_DEFAULT.map(def => {
    const editada = armazenadas.find(f => f.id === def.id);
    if (!editada) return JSON.parse(JSON.stringify(def));
    return {
      ...editada,
      // Imagem: usa base64 do usuário se ele fez upload, senão usa o caminho do código
      img: editada.img && editada.img.startsWith('data:') ? editada.img : def.img
    };
  });

  // Personagens criados pelo usuário: vêm apenas do localStorage
  const fichasCriadas = armazenadas.filter(f => !IDS_DEFAULT.has(f.id));

  const resultado = [...fichasDefault, ...fichasCriadas];

  // Persiste o resultado para que fichas.html sempre leia dados atualizados
  localStorage.setItem('rpghub_fichas', JSON.stringify(resultado));

  return resultado;
}

function salvarFichas(fichas) {
  localStorage.setItem('rpghub_fichas', JSON.stringify(fichas));
}

// ===== RENDERIZAÇÃO =====

function renderizarCards() {
  const fichas = carregarFichas();
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (fichas.length === 0) {
    container.innerHTML = '<p class="cards-vazio">Nenhuma ficha criada ainda. Clique em "Criar Personagem" para começar!</p>';
    document.getElementById('total').textContent = '0';
    document.getElementById('media').textContent = '—';
    return;
  }

  fichas.forEach(f => {
    const card = document.createElement('div');
    card.className = 'card';

    const imgHtml = f.img
      ? `<img src="${f.img}" alt="${f.nome}">`
      : `<div class="card-img-placeholder">⚔</div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="card-content">
        <h3>${f.nome}</h3>
        <p>${f.classe} — ${f.raca}</p>
        <p class="card-nivel">Nível ${f.nivel} · ${f.alinhamento || '—'}</p>
        <div class="actions">
          <button class="btn-ver" onclick="verFicha(${f.id})">Ver</button>
          <button class="btn-editar" onclick="editarFicha(${f.id})">Editar</button>
          <button class="btn-deletar" title="Deletar" onclick="deletarFicha(${f.id})">✕</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('total').textContent = fichas.length;
  const media = fichas.reduce((acc, f) => acc + (f.nivel || 1), 0) / fichas.length;
  document.getElementById('media').textContent = media.toFixed(1);
}

// ===== AÇÕES DOS CARDS =====

function verFicha(id) {
  window.location.href = `fichas.html?id=${id}`;
}

function editarFicha(id) {
  window.location.href = `fichas.html?id=${id}&modo=editar`;
}

function deletarFicha(id) {
  const fichas = carregarFichas();
  const ficha = fichas.find(f => f.id === id);
  if (!ficha) return;

  if (!confirm(`Deletar a ficha de "${ficha.nome}"? Esta ação não pode ser desfeita.`)) return;

  salvarFichas(fichas.filter(f => f.id !== id));
  renderizarCards();
}

// ===== MODAL =====

function abrirModal() {
  document.getElementById('modal-criar').style.display = 'flex';
  document.getElementById('new-nome').focus();
}

function fecharModal() {
  document.getElementById('modal-criar').style.display = 'none';
  document.getElementById('form-nova-ficha').reset();
}

function criarFicha(e) {
  e.preventDefault();

  const fichas = carregarFichas();

  const novaFicha = {
    id: Date.now(),
    nome: document.getElementById('new-nome').value.trim(),
    classe: document.getElementById('new-classe').value,
    raca: document.getElementById('new-raca').value,
    antecedente: document.getElementById('new-antecedente').value,
    alinhamento: document.getElementById('new-alinhamento').value,
    nivel: parseInt(document.getElementById('new-nivel').value) || 1,
    xp: 0,
    img: '',
    inspiracao: false,
    atributos: { forca: 10, destreza: 10, constituicao: 10, inteligencia: 10, sabedoria: 10, carisma: 10 },
    profSaving: {},
    profPericias: {},
    combate: { ca: 10, deslocamento: 9, hpMax: 0, hpAtual: 0, hpTemp: 0 },
    ataques: [],
    personalidade: { tracos: '', ideais: '', vinculos: '', defeitos: '' },
    moedas: { pc: 0, pe: 0, po: 0, pp: 0, pr: 0 },
    equipamento: '',
    proficiencias: '',
    idiomas: ''
  };

  fichas.push(novaFicha);
  salvarFichas(fichas);
  fecharModal();

  window.location.href = `fichas.html?id=${novaFicha.id}&modo=editar`;
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', () => {
  renderizarCards();

  document.getElementById('form-nova-ficha').addEventListener('submit', criarFicha);

  document.getElementById('modal-criar').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharModal();
  });
});
