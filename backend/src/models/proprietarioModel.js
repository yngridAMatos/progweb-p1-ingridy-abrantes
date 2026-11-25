import { db } from '../db.js';

const COLUNAS = 'id, cpf, nome, email, telefone';

function listar() {
  return db.prepare(`SELECT ${COLUNAS} FROM proprietarios ORDER BY id`).all();
}

function buscarPorId(id) {
  return db.prepare(`SELECT ${COLUNAS} FROM proprietarios WHERE id = ?`).get(id) ?? null;
}

function existeCpf(cpf) {
  return db.prepare('SELECT 1 FROM proprietarios WHERE cpf = ?').get(cpf) !== undefined;
}

function inserir({ nome, cpf, email, telefone }) {
  const r = db
    .prepare('INSERT INTO proprietarios (cpf, nome, email, telefone) VALUES (?, ?, ?, ?)')
    .run(cpf, nome, email ?? null, telefone ?? null);
  return buscarPorId(Number(r.lastInsertRowid));
}

function atualizar(id, dados) {
  const atual = buscarPorId(id);
  if (!atual) return null;
  const novo = { ...atual, ...dados, id }; // o id nunca muda
  db.prepare('UPDATE proprietarios SET cpf = ?, nome = ?, email = ?, telefone = ? WHERE id = ?')
    .run(novo.cpf, novo.nome, novo.email ?? null, novo.telefone ?? null, id);
  return buscarPorId(id);
}

function remover(id) {
  const r = db.prepare('DELETE FROM proprietarios WHERE id = ?').run(id);
  return r.changes > 0; // true = removeu
}

export const proprietarioModel = { listar, buscarPorId, existeCpf, inserir, atualizar, remover };
