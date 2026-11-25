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

// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
// Todos os dados são fictícios.
const { totalProprietarios } = db
  .prepare('SELECT COUNT(*) AS totalProprietarios FROM proprietarios')
  .get();

if (totalProprietarios === 0) {
  const inserirProprietario = db.prepare(
    'INSERT INTO proprietarios (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)',
  );
  const inserirImovel = db.prepare(`
    INSERT INTO imoveis
      (proprietario_id, titulo, localizacao, valor_diaria, capacidade, disponivel)
    VALUES (?, ?, ?, ?, ?, ?)`);

  const maria = inserirProprietario.run(
    'Maria Souza', '11122233344', 'maria@exemplo.com', '(83) 90000-0001',
  );
  const joao = inserirProprietario.run(
    'João Almeida', '22233344455', 'joao@exemplo.com', '(83) 90000-0002',
  );

  // lastInsertRowid pode vir como BigInt; Number() garante o tipo certo
  inserirImovel.run(Number(maria.lastInsertRowid), 'Sítio Recanto Verde', 'Piancó - PB', 450, 12, 1);
  inserirImovel.run(Number(maria.lastInsertRowid), 'Chácara Vale do Sol', 'Piancó - PB', 320, 8, 1);
  inserirImovel.run(Number(joao.lastInsertRowid), 'Casa de Lazer Pôr do Sol', 'Itaporanga - PB', 600, 20, 0);
}

const { totalClientes } = db
  .prepare('SELECT COUNT(*) AS totalClientes FROM clientes')
  .get();

if (totalClientes === 0) {
  const inserirCliente = db.prepare(
    'INSERT INTO clientes (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)',
  );
  inserirCliente.run('Ana Silva', '33344455566', 'ana@exemplo.com', '(83) 90000-0003');
  inserirCliente.run('Bruno Costa', '44455566677', 'bruno@exemplo.com', '(83) 90000-0004');
}
