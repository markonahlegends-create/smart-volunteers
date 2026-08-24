import { Router } from 'express';
import { registerRoster, getRoster, deleteRoster } from '../controllers/rosterController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authenticate, registerRoster);
router.get('/', authenticate, getRoster);
router.delete('/:id', authenticate, deleteRoster);

export default router;
