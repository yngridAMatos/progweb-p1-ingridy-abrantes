import express from 'express';
import clientesRouter from './routes/clientes.js';
import proprietarioRouter from './routes/proprietarios.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'Gestão de locação de sítios e imóveis de lazer', versao: '1.0.0', rotas: ['/clientes', '/proprietarios'] });
});

// --- Rotas ---
app.use('/clientes', clientesRouter);
app.use('/proprietarios', proprietarioRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;