const PERICIAS = [
  { id: 'acrobacia',       nome: 'Acrobacia',       attr: 'destreza' },
  { id: 'adestramento',    nome: 'Adestramento',    attr: 'sabedoria' },
  { id: 'arcanismo',       nome: 'Arcanismo',       attr: 'inteligencia' },
  { id: 'atletismo',       nome: 'Atletismo',       attr: 'forca' },
  { id: 'atuacao',         nome: 'Atuação',         attr: 'carisma' },
  { id: 'enganacao',       nome: 'Enganação',       attr: 'carisma' },
  { id: 'furtividade',     nome: 'Furtividade',     attr: 'destreza' },
  { id: 'historia',        nome: 'História',        attr: 'inteligencia' },
  { id: 'intuicao',        nome: 'Intuição',        attr: 'sabedoria' },
  { id: 'intimidacao',     nome: 'Intimidação',     attr: 'carisma' },
  { id: 'investigacao',    nome: 'Investigação',    attr: 'inteligencia' },
  { id: 'medicina',        nome: 'Medicina',        attr: 'sabedoria' },
  { id: 'natureza',        nome: 'Natureza',        attr: 'inteligencia' },
  { id: 'percepcao',       nome: 'Percepção',       attr: 'sabedoria' },
  { id: 'persuasao',       nome: 'Persuasão',       attr: 'carisma' },
  { id: 'prestidigitacao', nome: 'Prestidigitação', attr: 'destreza' },
  { id: 'religiao',        nome: 'Religião',        attr: 'inteligencia' },
  { id: 'sobrevivencia',   nome: 'Sobrevivência',   attr: 'sabedoria' },
];

const ATRIBUTOS = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];
const ATRIBUTOS_SIGLA = {
  forca: 'FOR', destreza: 'DES', constituicao: 'CON',
  inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR'
};
const ATRIBUTOS_NOME = {
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma'
};

let fichaId = null;
let fichaOriginal = null;
let modoEdicao = false;
let ataques = [];
let truques = [];
let niveisSlots = Array.from({ length: 9 }, () => ({ max: 0, atual: 0, magias: [] }));

function getMod(val) {
  return Math.floor((val - 10) / 2);
}

function formatMod(m) {
  return m >= 0 ? '+' + m : String(m);
}

function getProfBonus(nivel) {
  return Math.ceil(nivel / 4) + 1;
}

function carregarFichas() {
  const raw = localStorage.getItem('rpghub_fichas');
  return raw ? JSON.parse(raw) : [];
}

function salvarFichas(fichas) {
  localStorage.setItem('rpghub_fichas', JSON.stringify(fichas));
}

// ===== IMAGEM =====

function clicarUpload() {
  if (!modoEdicao) return;
  document.getElementById('img-upload').click();
}

function carregarImagem(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Imagem muito grande. Escolha uma imagem de até 2MB.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result;
    atualizarImagem(base64);

    if (fichaId !== null) {
      const fichas = carregarFichas();
      const idx = fichas.findIndex(f => f.id === fichaId);
      if (idx !== -1) {
        fichas[idx].img = base64;
        salvarFichas(fichas);
        if (fichaOriginal) fichaOriginal.img = base64;
      }
    }
  };
  reader.readAsDataURL(file);
}

function atualizarImagem(src) {
  const img = document.getElementById('char-img');
  const placeholder = document.getElementById('img-placeholder');
  if (src) {
    img.src = src;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.src = '';
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
}

// ===== INICIALIZAÇÃO =====

function init() {
  const params = new URLSearchParams(window.location.search);
  fichaId = params.get('id') ? parseInt(params.get('id')) : null;
  const modo = params.get('modo');

  renderizarSavingThrows();
  renderizarPericias();
  renderizarNiveisMagia();

  if (fichaId !== null) {
    const fichas = carregarFichas();
    fichaOriginal = fichas.find(f => f.id === fichaId) || null;
    if (fichaOriginal) preencherFicha(fichaOriginal);
  }

  if (modo === 'editar' || fichaId === null) {
    ativarEdicao();
  } else {
    ativarVisualizacao();
  }

  atualizarDerivados();
}

// ===== MODO =====

function ativarEdicao() {
  modoEdicao = true;
  document.body.classList.remove('modo-visualizacao');
  document.getElementById('modo-badge').textContent = 'Editando';
  document.getElementById('modo-badge').style.color = '#a8d8b8';
  document.getElementById('modo-badge').style.borderColor = '#2a6b42';
  document.getElementById('btn-modo').textContent = 'Cancelar';
  document.getElementById('btn-salvar').style.display = 'inline-block';
}

function ativarVisualizacao() {
  modoEdicao = false;
  document.body.classList.add('modo-visualizacao');
  document.getElementById('modo-badge').textContent = 'Visualização';
  document.getElementById('modo-badge').style.color = '#8b5a2b';
  document.getElementById('modo-badge').style.borderColor = '#5a3a20';
  document.getElementById('btn-modo').textContent = 'Editar';
  document.getElementById('btn-salvar').style.display = 'none';
}

function alternarModo() {
  if (modoEdicao) {
    if (fichaOriginal) preencherFicha(fichaOriginal);
    ativarVisualizacao();
  } else {
    ativarEdicao();
  }
}

// ===== PREENCHER CAMPOS =====

function preencherFicha(f) {
  atualizarImagem(f.img || '');
  document.getElementById('nome').value = f.nome || '';
  document.getElementById('classe').value = f.classe || '';
  document.getElementById('nivel').value = f.nivel || 1;
  document.getElementById('raca').value = f.raca || '';
  document.getElementById('antecedente').value = f.antecedente || '';
  document.getElementById('alinhamento').value = f.alinhamento || '';
  document.getElementById('xp').value = f.xp || 0;
  document.getElementById('inspiracao').checked = f.inspiracao || false;

  ATRIBUTOS.forEach(a => {
    document.getElementById(a).value = f.atributos?.[a] ?? 10;
  });

  ATRIBUTOS.forEach(a => {
    const el = document.getElementById('save-prof-' + a);
    if (el) el.checked = f.profSaving?.[a] || false;
  });

  PERICIAS.forEach(p => {
    const el = document.getElementById('prof-' + p.id);
    if (el) el.checked = f.profPericias?.[p.id] || false;
  });

  document.getElementById('ca').value = f.combate?.ca ?? 10;
  document.getElementById('deslocamento').value = f.combate?.deslocamento ?? 9;
  document.getElementById('hp-max').value = f.combate?.hpMax ?? 0;
  document.getElementById('hp-atual').value = f.combate?.hpAtual ?? 0;
  document.getElementById('hp-temp').value = f.combate?.hpTemp ?? 0;

  document.getElementById('dado-vida-tipo').value = f.dadosVida?.tipo ?? 'd8';
  document.getElementById('dado-vida-atual').value = f.dadosVida?.atual ?? (f.nivel || 1);

  const tm = f.testesMorte || {};
  ['ms1','ms2','ms3'].forEach((id, i) => {
    document.getElementById(id).checked = tm.sucessos?.[i] || false;
  });
  ['mf1','mf2','mf3'].forEach((id, i) => {
    document.getElementById(id).checked = tm.falhas?.[i] || false;
  });

  document.getElementById('magia-habilidade').value = f.magia?.habilidade ?? '';
  truques = f.magia?.truques ? [...f.magia.truques] : [];
  niveisSlots = f.magia?.slots
    ? f.magia.slots.map(s => ({ max: s.max, atual: s.atual, magias: [...(s.magias || [])] }))
    : Array.from({ length: 9 }, () => ({ max: 0, atual: 0, magias: [] }));
  renderizarTruques();
  renderizarNiveisMagia();

  document.getElementById('tracos').value = f.personalidade?.tracos || '';
  document.getElementById('ideais').value = f.personalidade?.ideais || '';
  document.getElementById('vinculos').value = f.personalidade?.vinculos || '';
  document.getElementById('defeitos').value = f.personalidade?.defeitos || '';

  document.getElementById('pc').value = f.moedas?.pc ?? 0;
  document.getElementById('pe').value = f.moedas?.pe ?? 0;
  document.getElementById('po').value = f.moedas?.po ?? 0;
  document.getElementById('pp').value = f.moedas?.pp ?? 0;
  document.getElementById('pr').value = f.moedas?.pr ?? 0;

  document.getElementById('equipamento-lista').value = f.equipamento || '';
  document.getElementById('proficiencias-texto').value = f.proficiencias || '';
  document.getElementById('idiomas').value = f.idiomas || '';

  ataques = f.ataques ? f.ataques.map(a => ({ ...a })) : [];
  renderizarAtaques();

  atualizarDerivados();
}

// ===== RENDERIZAR LISTAS DINÂMICAS =====

function renderizarSavingThrows() {
  const container = document.getElementById('saving-throws');
  container.innerHTML = '';
  ATRIBUTOS.forEach(a => {
    const div = document.createElement('div');
    div.className = 'check-row';
    div.innerHTML = `
      <input type="checkbox" id="save-prof-${a}" onchange="atualizarDerivados()">
      <span class="check-valor" id="save-val-${a}">+0</span>
      <span class="check-nome">${ATRIBUTOS_NOME[a]} <span class="check-attr">(${ATRIBUTOS_SIGLA[a]})</span></span>
    `;
    container.appendChild(div);
  });
}

function renderizarPericias() {
  const container = document.getElementById('pericias-lista');
  container.innerHTML = '';
  PERICIAS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'check-row';
    div.innerHTML = `
      <input type="checkbox" id="prof-${p.id}" onchange="atualizarDerivados()">
      <span class="check-valor" id="val-${p.id}">+0</span>
      <span class="check-nome">${p.nome} <span class="check-attr">(${ATRIBUTOS_SIGLA[p.attr]})</span></span>
    `;
    container.appendChild(div);
  });
}

function renderizarAtaques() {
  const tbody = document.getElementById('ataques-tbody');
  tbody.innerHTML = '';
  ataques.forEach((atq, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${atq.nome || ''}" oninput="ataques[${i}].nome = this.value" placeholder="Espada Longa"></td>
      <td><input type="text" value="${atq.bonus || ''}" oninput="ataques[${i}].bonus = this.value" placeholder="+5" style="width:70px"></td>
      <td><input type="text" value="${atq.dano || ''}" oninput="ataques[${i}].dano = this.value" placeholder="1d8+3 cortante"></td>
      <td><button class="btn-remove" onclick="removerAtaque(${i})">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarAtaque() {
  ataques.push({ nome: '', bonus: '', dano: '' });
  renderizarAtaques();
}

function removerAtaque(i) {
  ataques.splice(i, 1);
  renderizarAtaques();
}

// ===== CÁLCULOS DERIVADOS =====

function atualizarDerivados() {
  const nivel = parseInt(document.getElementById('nivel').value) || 1;
  const profBonus = getProfBonus(nivel);
  document.getElementById('prof-bonus-display').textContent = '+' + profBonus;

  ATRIBUTOS.forEach(a => {
    const val = parseInt(document.getElementById(a).value) || 10;
    const mod = getMod(val);
    document.getElementById('mod-' + a).textContent = formatMod(mod);

    const profEl = document.getElementById('save-prof-' + a);
    const saveTotal = mod + (profEl?.checked ? profBonus : 0);
    document.getElementById('save-val-' + a).textContent = formatMod(saveTotal);
  });

  PERICIAS.forEach(p => {
    const attrVal = parseInt(document.getElementById(p.attr).value) || 10;
    const mod = getMod(attrVal);
    const profEl = document.getElementById('prof-' + p.id);
    const total = mod + (profEl?.checked ? profBonus : 0);
    document.getElementById('val-' + p.id).textContent = formatMod(total);
  });

  const desVal = parseInt(document.getElementById('destreza').value) || 10;
  document.getElementById('iniciativa-display').textContent = formatMod(getMod(desVal));

  const sabVal = parseInt(document.getElementById('sabedoria').value) || 10;
  const percProf = document.getElementById('prof-percepcao')?.checked ? profBonus : 0;
  document.getElementById('percepcao-passiva').textContent = 10 + getMod(sabVal) + percProf;

  const habMagia = document.getElementById('magia-habilidade')?.value;
  if (habMagia) {
    const habVal = parseInt(document.getElementById(habMagia).value) || 10;
    const habMod = getMod(habVal);
    document.getElementById('magia-cd').textContent = 8 + profBonus + habMod;
    document.getElementById('magia-bonus').textContent = formatMod(profBonus + habMod);
  } else {
    document.getElementById('magia-cd').textContent = '—';
    document.getElementById('magia-bonus').textContent = '—';
  }

  document.getElementById('dado-vida-total').textContent = nivel;
}

// ===== MAGIAS =====

function renderizarTruques() {
  const lista = document.getElementById('truques-lista');
  lista.innerHTML = '';
  truques.forEach((nome, i) => {
    const div = document.createElement('div');
    div.className = 'magia-item';
    div.innerHTML = `
      <input type="text" value="${nome}" oninput="truques[${i}] = this.value" placeholder="Nome do truque">
      <button class="btn-remove" onclick="removerTruque(${i})">✕</button>
    `;
    lista.appendChild(div);
  });
}

function adicionarTruque() {
  truques.push('');
  renderizarTruques();
}

function removerTruque(i) {
  truques.splice(i, 1);
  renderizarTruques();
}

function renderizarNiveisMagia() {
  const container = document.getElementById('niveis-magia');
  if (!container) return;
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'niveis-grid';

  niveisSlots.forEach((slot, idx) => {
    const nivel = idx + 1;
    const bloco = document.createElement('div');
    bloco.className = 'magia-nivel-bloco';
    bloco.innerHTML = `
      <div class="magia-nivel-header">
        <span class="magia-nivel-titulo">Nível ${nivel}</span>
        <div class="magia-slots">
          Espaços:
          <input type="number" id="slot-atual-${idx}" value="${slot.atual}" min="0"
            oninput="niveisSlots[${idx}].atual = parseInt(this.value)||0">
          /
          <input type="number" id="slot-max-${idx}" value="${slot.max}" min="0"
            oninput="niveisSlots[${idx}].max = parseInt(this.value)||0">
        </div>
      </div>
      <div id="magias-nivel-${idx}" class="magia-lista"></div>
      <button class="btn-add" onclick="adicionarMagia(${idx})">+ Adicionar Magia</button>
    `;
    grid.appendChild(bloco);
  });

  container.appendChild(grid);

  niveisSlots.forEach((slot, idx) => {
    renderizarMagiasNivel(idx);
  });
}

function renderizarMagiasNivel(idx) {
  const lista = document.getElementById('magias-nivel-' + idx);
  if (!lista) return;
  lista.innerHTML = '';
  niveisSlots[idx].magias.forEach((nome, i) => {
    const div = document.createElement('div');
    div.className = 'magia-item';
    div.innerHTML = `
      <input type="text" value="${nome}" oninput="niveisSlots[${idx}].magias[${i}] = this.value" placeholder="Nome da magia">
      <button class="btn-remove" onclick="removerMagia(${idx}, ${i})">✕</button>
    `;
    lista.appendChild(div);
  });
}

function adicionarMagia(idx) {
  niveisSlots[idx].magias.push('');
  renderizarMagiasNivel(idx);
}

function removerMagia(idx, i) {
  niveisSlots[idx].magias.splice(i, 1);
  renderizarMagiasNivel(idx);
}

// ===== SALVAR =====

function salvar() {
  const fichas = carregarFichas();

  const dados = {
    id: fichaId ?? Date.now(),
    nome: document.getElementById('nome').value,
    classe: document.getElementById('classe').value,
    nivel: parseInt(document.getElementById('nivel').value) || 1,
    raca: document.getElementById('raca').value,
    antecedente: document.getElementById('antecedente').value,
    alinhamento: document.getElementById('alinhamento').value,
    xp: parseInt(document.getElementById('xp').value) || 0,
    inspiracao: document.getElementById('inspiracao').checked,
    img: fichaOriginal?.img || '',
    atributos: {},
    profSaving: {},
    profPericias: {},
    combate: {
      ca: parseInt(document.getElementById('ca').value) || 10,
      deslocamento: parseInt(document.getElementById('deslocamento').value) || 9,
      hpMax: parseInt(document.getElementById('hp-max').value) || 0,
      hpAtual: parseInt(document.getElementById('hp-atual').value) || 0,
      hpTemp: parseInt(document.getElementById('hp-temp').value) || 0,
    },
    dadosVida: {
      tipo: document.getElementById('dado-vida-tipo').value,
      atual: parseInt(document.getElementById('dado-vida-atual').value) || 0,
    },
    testesMorte: {
      sucessos: ['ms1','ms2','ms3'].map(id => document.getElementById(id).checked),
      falhas:   ['mf1','mf2','mf3'].map(id => document.getElementById(id).checked),
    },
    magia: {
      habilidade: document.getElementById('magia-habilidade').value,
      truques: [...truques],
      slots: niveisSlots.map(s => ({
        max: s.max,
        atual: s.atual,
        magias: [...s.magias],
      })),
    },
    ataques: ataques.map(a => ({ ...a })),
    personalidade: {
      tracos: document.getElementById('tracos').value,
      ideais: document.getElementById('ideais').value,
      vinculos: document.getElementById('vinculos').value,
      defeitos: document.getElementById('defeitos').value,
    },
    moedas: {
      pc: parseInt(document.getElementById('pc').value) || 0,
      pe: parseInt(document.getElementById('pe').value) || 0,
      po: parseInt(document.getElementById('po').value) || 0,
      pp: parseInt(document.getElementById('pp').value) || 0,
      pr: parseInt(document.getElementById('pr').value) || 0,
    },
    equipamento: document.getElementById('equipamento-lista').value,
    proficiencias: document.getElementById('proficiencias-texto').value,
    idiomas: document.getElementById('idiomas').value,
  };

  ATRIBUTOS.forEach(a => {
    dados.atributos[a] = parseInt(document.getElementById(a).value) || 10;
    dados.profSaving[a] = document.getElementById('save-prof-' + a)?.checked || false;
  });

  PERICIAS.forEach(p => {
    dados.profPericias[p.id] = document.getElementById('prof-' + p.id)?.checked || false;
  });

  if (fichaId !== null) {
    const idx = fichas.findIndex(f => f.id === fichaId);
    if (idx !== -1) fichas[idx] = dados;
    else fichas.push(dados);
  } else {
    fichaId = dados.id;
    fichas.push(dados);
    const url = new URL(window.location.href);
    url.searchParams.set('id', fichaId);
    window.history.replaceState({}, '', url.toString());
  }

  salvarFichas(fichas);
  fichaOriginal = dados;
  ativarVisualizacao();
  mostrarNotificacao('Ficha salva com sucesso!');
}

// ===== NOTIFICAÇÃO =====

function mostrarNotificacao(msg) {
  const el = document.getElementById('notificacao');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, 400);
  }, 2500);
}

function voltar() {
  window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', init);
