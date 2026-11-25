# Gestão de Locação de Sítios e Imóveis de Lazer

Sistema para gerenciar a locação de sítios e espaços de lazer por temporada: proprietários cadastram seus imóveis e os clientes ficam registrados para futuras reservas.
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).

- **Aplicação:** https://SEU-FRONT.vercel.app
- **API:** https://SEU-SERVICO.onrender.com
- **Vídeo de apresentação:** (link)

> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.

## Tecnologias

- Backend: Node.js 22, Express 5, SQLite (`node:sqlite`, SQL puro)
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

Na primeira execução o banco (`backend/banco.db`) é criado com dados de exemplo fictícios.
Para recomeçar do zero, pare o servidor, apague o `banco.db` e suba de novo.

## Rotas da API

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | /proprietarios | Lista os proprietários | 200 |
| POST | /proprietarios | Cria um proprietário | 201, 400, 409 |
| GET | /proprietarios/:id | Busca um proprietário | 200, 404 |
| PUT | /proprietarios/:id | Atualiza um proprietário | 200, 404 |
| DELETE | /proprietarios/:id | Remove um proprietário | 204, 404, 409 |
| GET | /imoveis | Lista os imóveis (filtro opcional `?proprietarioId=1`) | 200 |
| POST | /imoveis | Cria um imóvel | 201, 400, 422 |
| GET | /imoveis/:id | Busca um imóvel | 200, 404 |
| PUT | /imoveis/:id | Atualiza um imóvel | 200, 400, 404, 422 |
| DELETE | /imoveis/:id | Remove um imóvel | 204, 404 |
| GET | /clientes | Lista os clientes | 200 |
| POST | /clientes | Cria um cliente | 201, 400, 409 |
| GET | /clientes/:id | Busca um cliente | 200, 404 |
| PUT | /clientes/:id | Atualiza um cliente | 200, 404 |
| DELETE | /clientes/:id | Remove um cliente | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`.

## Regras de negócio

- **Proprietário e cliente:** `nome` e `cpf` são obrigatórios (400) e o CPF é único (409).
- **Proprietário:** não pode ser removido se tiver imóveis cadastrados (409).
- **Imóvel:** `proprietarioId`, `titulo`, `localizacao`, `valorDiaria` e `capacidade` são obrigatórios (400).
- **Imóvel:** a diária deve ser maior que zero e a capacidade um inteiro de pelo menos 1 (400).
- **Imóvel:** `disponivel` deve ser `true` ou `false` (400); o proprietário informado precisa existir (422).

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL)
    middleware/    logger e tratamento de erros
    utils/         fábrica de erros com status
    db.js          conexão, schema e dados de exemplo do SQLite
  TESTES.md        requisições testadas na API
frontend/
  index.html
  js/
    config.js      URL da API
    api.js         camada HTTP (fetch)
    services/      regras da tela (limpar e validar)
    state/         estado da aplicação
    ui/            desenho da tela
  TELAS.md         como provocar os estados de cada tela
MODELAGEM.md       modelagem de classes (S2)
s1/ … s5/          exercícios das semanas
```

## Fora do escopo

A entidade Reserva está modelada em `MODELAGEM.md`, mas não foi implementada nesta etapa.
Autenticação, avaliações, conflito de datas, taxa de limpeza e pagamento online também não entram no Projeto 1.

## Autor

Ingridy Abrantes de Matos · Ciências da Computação · UEPB