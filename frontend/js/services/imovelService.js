import { api } from '../api.js';

function preparar({ proprietarioId, titulo, localizacao, valorDiaria, capacidade, disponivel }) {
  if (!proprietarioId) throw new Error('Selecione o proprietário.');
  const dados = {
    proprietarioId: Number(proprietarioId),
    titulo: (titulo ?? '').trim(),
    localizacao: (localizacao ?? '').trim(),
    valorDiaria: Number(valorDiaria),
    capacidade: Number(capacidade),
    // checkbox desmarcado nem aparece no FormData; marcado chega como 'on'
    disponivel: disponivel === 'on',
  };
  if (!dados.titulo) throw new Error('Informe o título do imóvel.');
  if (!dados.localizacao) throw new Error('Informe a localização.');
  if (valorDiaria === '' || Number.isNaN(dados.valorDiaria) || dados.valorDiaria <= 0) {
    throw new Error('A diária deve ser maior que zero.');
  }
  if (!Number.isInteger(dados.capacidade) || dados.capacidade < 1) {
    throw new Error('A capacidade deve ser um número inteiro de pelo menos 1.');
  }
  return dados;
}

export const imovelService = {
  listar() {
    return api.get('/imoveis');
  },
  async criar(dados) {
    return api.post('/imoveis', preparar(dados));
  },
  async atualizar(id, dados) {
    return api.put(`/imoveis/${id}`, preparar(dados));
  },
  remover(id) {
    return api.delete(`/imoveis/${id}`);
  },
};
