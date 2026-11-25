import { api } from '../api.js';

function preparar({ nome, cpf, email, telefone }) {
  const dados = {
    nome: (nome ?? '').trim(),
    cpf: (cpf ?? '').replace(/\D/g, ''),
    email: (email ?? '').trim() || null,
    telefone: (telefone ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (dados.cpf.length !== 11) throw new Error('O CPF precisa ter 11 dígitos.');
  return dados;
}

export const proprietarioService = {
  listar() {
    return api.get('/proprietarios');
  },
  async criar(dados) {
    return api.post('/proprietarios', preparar(dados));
  },
  async atualizar(id, dados) {
    return api.put(`/proprietarios/${id}`, preparar(dados));
  },
  remover(id) {
    return api.delete(`/proprietarios/${id}`);
  },
};
