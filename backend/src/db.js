import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// A tabela "pai" (proprietarios) vem antes de quem a referencia (imoveis).
db.exec(`
  CREATE TABLE IF NOT EXISTS proprietarios (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL,
    cpf      TEXT NOT NULL UNIQUE,
    email    TEXT,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL,
    cpf      TEXT NOT NULL UNIQUE,
    email    TEXT,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS imoveis (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    proprietario_id INTEGER NOT NULL REFERENCES proprietarios(id),
    titulo          TEXT NOT NULL,
    localizacao     TEXT NOT NULL,
    valor_diaria    REAL NOT NULL,
    capacidade      INTEGER NOT NULL,
    disponivel      INTEGER NOT NULL DEFAULT 1
  );
`);
