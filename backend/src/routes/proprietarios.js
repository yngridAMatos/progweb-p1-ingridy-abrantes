import { Router } from 'express';
import { proprietarioController } from '../controllers/proprietarioController.js';

const router = Router();

router.get('/', proprietarioController.listar);
router.get('/:id', proprietarioController.buscarPorId);
router.post('/', proprietarioController.criar);
router.put('/:id', proprietarioController.atualizar);
router.delete('/:id', proprietarioController.remover);

export default router;