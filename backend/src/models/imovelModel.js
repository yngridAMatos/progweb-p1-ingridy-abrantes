import { db } from '../db.js';

// Traduz as colunas com underscore para os nomes que a API e o front usam.
const COLUNAS = `id, proprietario_id AS proprietarioId, titulo, localizacao,
  valor_diaria AS valorDiaria, capacidade, disponivel`;

// O banco devolve 1 ou 0; a API devolve true ou false.
const paraApi = (linha) => linha && { ...linha, disponivel: linha.disponivel === 1 };

function listar() {
  return db.prepare(`SELECT ${COLUNAS} FROM imoveis ORDER BY id`).all().map(paraApi);
}

function listarPorProprietario(proprietarioId) {
  return db
    .prepare(`SELECT ${COLUNAS} FROM imoveis WHERE proprietario_id = ? ORDER BY id`)
    .all(proprietarioId)
    .map(paraApi);
}

function buscarPorId(id) {
  return paraApi(db.prepare(`SELECT ${COLUNAS} FROM imoveis WHERE id = ?`).get(id)) ?? null;
}

function inserir({ proprietarioId, titulo, localizacao, valorDiaria, capacidade, disponivel }) {
  const r = db
    .prepare(`INSERT INTO imoveis
      (proprietario_id, titulo, localizacao, valor_diaria, capacidade, disponivel)
      VALUES (?, ?, ?, ?, ?, ?)`)
    .run(
      Number(proprietarioId),
      titulo,
      localizacao,
      Number(valorDiaria),
      Number(capacidade),
      (disponivel ?? true) ? 1 : 0,
    );
  return buscarPorId(Number(r.lastInsertRowid));
}

function atualizar(id, dados) {
  const atual = buscarPorId(id);
  if (!atual) return null;
  const novo = { ...atual, ...dados, id };
  db.prepare(`UPDATE imoveis SET proprietario_id = ?, titulo = ?, localizacao = ?,
      valor_diaria = ?, capacidade = ?, disponivel = ? WHERE id = ?`)
    .run(
      Number(novo.proprietarioId),
      novo.titulo,
      novo.localizacao,
      Number(novo.valorDiaria),
      Number(novo.capacidade),
      novo.disponivel ? 1 : 0,
      id,
    );
  return buscarPorId(id);
}

function remover(id) {
  const r = db.prepare('DELETE FROM imoveis WHERE id = ?').run(id);
  return r.changes > 0;
}

export const imovelModel = {
  listar, listarPorProprietario, buscarPorId, inserir, atualizar, remover,
};
