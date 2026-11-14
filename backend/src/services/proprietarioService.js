import { proprietarioModel } from '../models/proprietarioModel.js';
import { erro } from '../utils/erro.js';

export const proprietarioService = {
  listar() {
    return proprietarioModel.listar();
  },

  buscarPorId(id) {
    const proprietario = proprietarioModel.buscarPorId(id);
    if (!proprietario) throw erro(404, "Proprietário não encontrado");
    return proprietario;
;
  },

  criar({ nome, cpf, email, telefone } = {}) {
    // Regra 1: nome e cpf são obrigatórios
    if (!nome || !cpf) throw erro(400, 'Campos "nome" e "cpf" são obrigatórios');
    // Regra 2: cpf é único
    if (proprietarioModel.existeCpf(cpf)) throw erro(409, 'Já existe um proprietário com este CPF');
    return proprietarioModel.inserir({ nome, cpf, email, telefone });
  },

  atualizar(id, dados = {}) {
    const atualizado = proprietarioModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, '´Proprietário não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = proprietarioModel.remover(id);
    if (!removido) throw erro(404, 'Proprietário não encontrado');
  },
};