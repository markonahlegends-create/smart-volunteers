import { Router } from 'express';
import {
  getBencana,
  createBencana,
  updateBencana,
  deleteBencana,
} from '../controllers/bencanaController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBencana);
router.post('/', authenticate, createBencana);
router.put('/:id', authenticate, updateBencana);
router.delete('/:id', authenticate, deleteBencana);

export default router;
