import { imovelModel } from '../models/imovelModel.js';
import { proprietarioModel } from '../models/proprietarioModel.js';
import { erro } from '../utils/erro.js';

// Regras compartilhadas por criar e atualizar
function validar({ proprietarioId, titulo, localizacao, valorDiaria, capacidade, disponivel }) {
  if (!proprietarioId || !titulo || !localizacao || valorDiaria === undefined || capacidade === undefined) {
    throw erro(400, 'Campos "proprietarioId", "titulo", "localizacao", "valorDiaria" e "capacidade" são obrigatórios');
  }
  // Regra 1: diária maior que zero
  if (Number.isNaN(Number(valorDiaria)) || Number(valorDiaria) <= 0) {
    throw erro(400, 'A diária deve ser maior que zero');
  }
  // Regra 2: capacidade é um inteiro >= 1
  if (!Number.isInteger(Number(capacidade)) || Number(capacidade) < 1) {
    throw erro(400, 'A capacidade deve ser um número inteiro de pelo menos 1');
  }
  if (disponivel !== undefined && typeof disponivel !== 'boolean') {
    throw erro(400, 'O campo "disponivel" deve ser true ou false');
  }
  // Regra 3: o proprietário precisa existir
  if (!proprietarioModel.buscarPorId(Number(proprietarioId))) {
    throw erro(422, 'Proprietário informado não existe');
  }
}

export const imovelService = {
  listar(proprietarioId) {
    if (proprietarioId) return imovelModel.listarPorProprietario(Number(proprietarioId));
    return imovelModel.listar();
  },

  buscarPorId(id) {
    const imovel = imovelModel.buscarPorId(id);
    if (!imovel) throw erro(404, 'Imóvel não encontrado');
    return imovel;
  },

  criar(dados = {}) {
    validar(dados);
    return imovelModel.inserir(dados);
  },

  atualizar(id, dados = {}) {
    const atual = imovelModel.buscarPorId(id);
    if (!atual) throw erro(404, 'Imóvel não encontrado');
    validar({ ...atual, ...dados }); // revalida o resultado final
    return imovelModel.atualizar(id, dados);
  },

  remover(id) {
    const removido = imovelModel.remover(id);
    if (!removido) throw erro(404, 'Imóvel não encontrado');
  },
};