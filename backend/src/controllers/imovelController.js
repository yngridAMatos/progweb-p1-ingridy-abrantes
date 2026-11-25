import { imovelService } from '../services/imovelService.js';

export const imovelController = {
  listar(req, res) {
    res.json(imovelService.listar(req.query.proprietarioId));
  },

  buscarPorId(req, res) {
    res.json(imovelService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = imovelService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(imovelService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    imovelService.remover(Number(req.params.id));
    res.status(204).end();
  },
};