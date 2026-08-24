import { Router } from 'express';
import {
  getMarkas,
  createMarkas,
  updateMarkas,
  deleteMarkas,
} from '../controllers/markasController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMarkas);
router.post('/', authenticate, createMarkas);
router.put('/:id', authenticate, updateMarkas);
router.delete('/:id', authenticate, deleteMarkas);

export default router;
