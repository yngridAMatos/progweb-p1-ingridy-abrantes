// Camada de UI dos imóveis. Mesmo molde, com um <select> de proprietários.
const el = {
  form: document.querySelector('#form-imovel'),
  proprietario: document.querySelector('#imovel-proprietario'),
  salvar: document.querySelector('#imovel-salvar'),
  cancelar: document.querySelector('#imovel-cancelar'),
  carregando: document.querySelector('#imoveis-carregando'),
  erro: document.querySelector('#imoveis-erro'),
  erroMsg: document.querySelector('#imoveis-erro-msg'),
  recarregar: document.querySelector('#imoveis-recarregar'),
  vazio: document.querySelector('#imoveis-vazio'),
  sucesso: document.querySelector('#imoveis-sucesso'),
  linhas: document.querySelector('#imoveis-linhas'),
};

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// id → nome, para mostrar o dono do imóvel sem outra requisição
let nomeDoProprietario = new Map();

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function selo(disponivel) {
  const td = document.createElement('td');
  const span = document.createElement('span');
  span.className = `badge ${disponivel ? 'text-bg-success' : 'text-bg-secondary'}`;
  span.textContent = disponivel ? 'Disponível' : 'Bloqueado';
  td.append(span);
  return td;
}

function linha(imovel, editandoId) {
  const tr = document.createElement('tr');
  if (imovel.id === editandoId) tr.className = 'editando';

  const dono = nomeDoProprietario.get(imovel.proprietarioId)
    ?? `proprietário #${imovel.proprietarioId} (removido)`;

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', imovel.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', imovel.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(imovel.id),
    celula(imovel.titulo),
    celula(dono),
    celula(imovel.localizacao),
    celula(reais.format(imovel.valorDiaria), 'numero text-end text-nowrap'),
    celula(imovel.capacidade, 'text-end'),
    selo(imovel.disponivel),
    acoes,
  );
  return tr;
}

export const imovelView = {
  // Preenche o <select> com os proprietários que existem agora
  preencherProprietarios(proprietarios) {
    nomeDoProprietario = new Map(proprietarios.map((p) => [p.id, p.nome]));
    const escolhido = el.proprietario.value;

    const opcoes = proprietarios.map((p) => new Option(`${p.nome} (#${p.id})`, p.id));
    el.proprietario.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    if (nomeDoProprietario.has(Number(escolhido))) el.proprietario.value = escolhido;
  },

  render({ status, imoveis, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...imoveis.map((i) => linha(i, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar imóvel';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(imovel) {
    el.form.proprietarioId.value = imovel.proprietarioId;
    el.form.titulo.value = imovel.titulo;
    el.form.localizacao.value = imovel.localizacao;
    el.form.valorDiaria.value = imovel.valorDiaria;
    el.form.capacidade.value = imovel.capacidade;
    el.form.disponivel.checked = Boolean(imovel.disponivel);
    el.form.titulo.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },
  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },
  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
