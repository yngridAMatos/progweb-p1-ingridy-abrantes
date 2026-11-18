// Camada de UI dos proprietários: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-proprietario'),
  salvar: document.querySelector('#prop-salvar'),
  cancelar: document.querySelector('#prop-cancelar'),
  carregando: document.querySelector('#proprietarios-carregando'),
  erro: document.querySelector('#proprietarios-erro'),
  erroMsg: document.querySelector('#proprietarios-erro-msg'),
  recarregar: document.querySelector('#proprietarios-recarregar'),
  vazio: document.querySelector('#proprietarios-vazio'),
  sucesso: document.querySelector('#proprietarios-sucesso'),
  linhas: document.querySelector('#proprietarios-linhas'),
};

function formatarCpf(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

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

function linha(p, editandoId) {
  const tr = document.createElement('tr');
  if (p.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', p.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', p.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(p.id),
    celula(p.nome),
    celula(formatarCpf(p.cpf), 'numero text-nowrap'),
    celula(p.email ?? '—'),
    celula(p.telefone ?? '—', 'text-nowrap'),
    acoes,
  );
  return tr;
}

export const proprietarioView = {
  render({ status, proprietarios, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...proprietarios.map((p) => linha(p, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar proprietário';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(p) {
    el.form.nome.value = p.nome;
    el.form.cpf.value = formatarCpf(p.cpf);
    el.form.email.value = p.email ?? '';
    el.form.telefone.value = p.telefone ?? '';
    el.form.nome.focus();
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
