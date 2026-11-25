import express from 'express';
import cors from 'cors';
import clientesRouter from './routes/clientes.js';
import proprietarioRouter from './routes/proprietarios.js';
import imoveisRouter from './routes/imoveis.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
// Em produção, a origem do front vem da variável CORS_ORIGIN.
const origens = (process.env.CORS_ORIGIN
  ?? 'http://localhost:5500,http://127.0.0.1:5500').split(',');
app.use(cors({ origin: origens }));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'Gestão de locação de sítios e imóveis de lazer', versao: '1.0.0', rotas: ['/clientes', '/proprietarios'] });
});

// --- Rotas ---
app.use('/clientes', clientesRouter);
app.use('/proprietarios', proprietarioRouter);
app.use('/imoveis', imoveisRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;