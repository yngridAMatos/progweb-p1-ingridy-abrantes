let imoveis = [];
let proximoId = 1;

export const imovelModel = {
  listar() {
    return imoveis;
  },

  listarPorProprietario(proprietarioId) {
    return imoveis.filter((i) => i.proprietarioId === proprietarioId);
  },

  buscarPorId(id) {
    return imoveis.find((i) => i.id === id) ?? null;
  },

  inserir({ proprietarioId, titulo, localizacao, valorDiaria, capacidade, disponivel }) {
    const novo = {
      id: proximoId++,
      proprietarioId: Number(proprietarioId),
      titulo,
      localizacao,
      valorDiaria: Number(valorDiaria),
      capacidade: Number(capacidade),
      disponivel: disponivel ?? true,
    };
    imoveis.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = imoveis.findIndex((x) => x.id === id);
    if (i === -1) return null;
    imoveis[i] = { ...imoveis[i], ...dados, id }; // o id nunca muda
    return imoveis[i];
  },

  remover(id) {
    const antes = imoveis.length;
    imoveis = imoveis.filter((i) => i.id !== id);
    return imoveis.length < antes;
  },
};