import { Router } from 'express';
import {
  getRelawan,
  getRelawanById,
  createRelawan,
  updateRelawan,
  deleteRelawan,
} from '../controllers/relawanController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getRelawan);
router.get('/:id', getRelawanById);
router.post('/', createRelawan);
router.put('/:id', updateRelawan);
router.delete('/:id', deleteRelawan);

export default router;
