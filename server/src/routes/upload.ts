import { Router } from 'express';
import { uploadFotoRelawan, uploadDokumenRelawan } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/foto/relawan', uploadFotoRelawan);
router.post('/dokumen/relawan', uploadDokumenRelawan);

export default router;
