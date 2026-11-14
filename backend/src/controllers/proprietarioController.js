import { proprietarioService } from '../services/proprietarioService.js';

export const proprietarioController = {
  listar(req, res) {
    res.json(proprietarioService.listar());
  },

  buscarPorId(req, res) {
    res.json(proprietarioService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = proprietarioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(proprietarioService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    proprietarioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};