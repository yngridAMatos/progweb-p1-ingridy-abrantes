// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let proprietarios = [];
let proximoId = 1;

export const proprietarioModel = {
  listar() {
    return proprietarios;
  },

  buscarPorId(id) {
    return proprietarios.find((c) => c.id === id) ?? null;
  },

  existeCpf(cpf) {
    return proprietarios.some((c) => c.cpf === cpf);
  },

  inserir({ nome, cpf, email, telefone }) {
    const novo = { id: proximoId++, nome, cpf, email: email ?? null, telefone: telefone ?? null };
    proprietarios.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = proprietarios.findIndex((c) => c.id === id);
    if (i === -1) return null;
    clientes[i] = { ...proprietarios[i], ...dados, id }; // o id nunca muda
    return proprietarios[i];
  },

  remover(id) {
    const antes = proprietarios.length;
    proprietarios = proprietarios.filter((c) => c.id !== id);
    return proprietarios.length < antes; // true = removeu
  },
};
