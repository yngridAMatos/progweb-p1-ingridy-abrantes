// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { clienteService } from './services/clienteService.js';
import { clienteView } from './ui/clienteView.js';
import { proprietarioService } from './services/proprietarioService.js';
import { imovelService } from './services/imovelService.js';
import { proprietarioView } from './ui/proprietarioView.js';
import { imovelView } from './ui/imovelView.js';
import { aviso } from './ui/aviso.js';

// ===================== CLIENTES =====================
const clientes = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  clientes: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
clientes.assinar(clienteView.render);

async function carregarClientes() {
  clientes.set({ status: 'carregando', erro: null });
  try {
    const lista = await clienteService.listar();
    clientes.set({ status: lista.length ? 'sucesso' : 'vazio', clientes: lista });
  } catch (e) {
    clientes.set({ status: 'erro', erro: e.message });
  }
}

async function salvarCliente(dados) {
  const { editandoId } = clientes.get();
  aviso.limpar();
  clientes.set({ salvando: true });
  try {
    if (editandoId) await clienteService.atualizar(editandoId, dados);
    else await clienteService.criar(dados);

    aviso.sucesso(editandoId ? 'Cliente atualizado.' : 'Cliente cadastrado.');
    clienteView.limparForm();
    clientes.set({ editandoId: null });
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    clientes.set({ salvando: false });
  }
}

function editarCliente(id) {
  const cliente = clientes.get().clientes.find((c) => c.id === id);
  clienteView.preencherForm(cliente);
  clientes.set({ editandoId: id });
}

function cancelarEdicaoCliente() {
  clienteView.limparForm();
  clientes.set({ editandoId: null });
}

async function removerCliente(id) {
  if (!confirm(`Remover o cliente #${id}?`)) return;
  aviso.limpar();
  try {
    await clienteService.remover(id);
    aviso.sucesso('Cliente removido.');
    if (clientes.get().editandoId === id) cancelarEdicaoCliente();
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message);
  }
}

clienteView.aoEnviar(salvarCliente);
clienteView.aoCancelar(cancelarEdicaoCliente);
clienteView.aoRecarregar(carregarClientes);
clienteView.aoClicarNaLista({ editar: editarCliente, remover: removerCliente });


// ===================== PROPRIETÁRIOS =====================
const proprietarios = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  proprietarios: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

proprietarios.assinar(proprietarioView.render);

async function carregarProprietarios() {
  proprietarios.set({ status: 'carregando', erro: null });
  try {
    const lista = await proprietarioService.listar();
    proprietarios.set({ status: lista.length ? 'sucesso' : 'vazio', proprietarios: lista });
  } catch (e) {
    proprietarios.set({ status: 'erro', erro: e.message });
  }
}

async function salvarProprietario(dados) {
  const { editandoId } = proprietarios.get();
  aviso.limpar();
  proprietarios.set({ salvando: true });
  try {
    if (editandoId) await proprietarioService.atualizar(editandoId, dados);
    else await proprietarioService.criar(dados);

    aviso.sucesso(editandoId ? 'Proprietário atualizado.' : 'Proprietário cadastrado.');
    proprietarioView.limparForm();
    proprietarios.set({ editandoId: null });
    await carregarProprietarios();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    proprietarios.set({ salvando: false });
  }
}

function editarProprietario(id) {
  const p = proprietarios.get().proprietarios.find((x) => x.id === id);
  proprietarioView.preencherForm(p);
  proprietarios.set({ editandoId: id });
}

function cancelarEdicaoProprietario() {
  proprietarioView.limparForm();
  proprietarios.set({ editandoId: null });
}

async function removerProprietario(id) {
  if (!confirm(`Remover o proprietário #${id}?`)) return;
  aviso.limpar();
  try {
    await proprietarioService.remover(id);
    aviso.sucesso('Proprietário removido.');
    if (proprietarios.get().editandoId === id) cancelarEdicaoProprietario();
    await carregarProprietarios();
  } catch (e) {
    aviso.erro(e.message);
  }
}

proprietarioView.aoEnviar(salvarProprietario);
proprietarioView.aoCancelar(cancelarEdicaoProprietario);
proprietarioView.aoRecarregar(carregarProprietarios);
proprietarioView.aoClicarNaLista({ editar: editarProprietario, remover: removerProprietario });


// ===================== IMÓVEIS =====================
const imoveis = criarStore({
  status: 'carregando',
  imoveis: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

imoveis.assinar(imovelView.render);

// Os imóveis dependem dos proprietários: mudou a lista de proprietários,
// refaz o <select> e redesenha os nomes na tabela de imóveis.
proprietarios.assinar((estado) => {
  imovelView.preencherProprietarios(estado.proprietarios);
  imovelView.render(imoveis.get());
});

async function carregarImoveis() {
  imoveis.set({ status: 'carregando', erro: null });
  try {
    const lista = await imovelService.listar();
    imoveis.set({ status: lista.length ? 'sucesso' : 'vazio', imoveis: lista });
  } catch (e) {
    imoveis.set({ status: 'erro', erro: e.message });
  }
}

async function salvarImovel(dados) {
  const { editandoId } = imoveis.get();
  aviso.limpar();
  imoveis.set({ salvando: true });
  try {
    if (editandoId) await imovelService.atualizar(editandoId, dados);
    else await imovelService.criar(dados);

    aviso.sucesso(editandoId ? 'Imóvel atualizado.' : 'Imóvel cadastrado.');
    imovelView.limparForm();
    imoveis.set({ editandoId: null });
    await carregarImoveis();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    imoveis.set({ salvando: false });
  }
}

function editarImovel(id) {
  const imovel = imoveis.get().imoveis.find((x) => x.id === id);
  imovelView.preencherForm(imovel);
  imoveis.set({ editandoId: id });
}

function cancelarEdicaoImovel() {
  imovelView.limparForm();
  imoveis.set({ editandoId: null });
}

async function removerImovel(id) {
  if (!confirm(`Remover o imóvel #${id}?`)) return;
  aviso.limpar();
  try {
    await imovelService.remover(id);
    aviso.sucesso('Imóvel removido.');
    if (imoveis.get().editandoId === id) cancelarEdicaoImovel();
    await carregarImoveis();
  } catch (e) {
    aviso.erro(e.message);
  }
}

imovelView.aoEnviar(salvarImovel);
imovelView.aoCancelar(cancelarEdicaoImovel);
imovelView.aoRecarregar(carregarImoveis);
imovelView.aoClicarNaLista({ editar: editarImovel, remover: removerImovel });

// ===================== INÍCIO =====================
carregarClientes();
carregarProprietarios();
carregarImoveis();