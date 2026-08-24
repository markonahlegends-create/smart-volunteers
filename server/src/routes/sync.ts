import { Router } from 'express';
import {
  syncAnggotaToSheets,
  syncUnitToSheets,
  syncBencanaToSheets,
  syncKegiatanToSheets,
  syncRelawanToSheets,
  syncAllToSheets,
} from '../controllers/syncController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/members', syncAnggotaToSheets);
router.post('/members', syncAnggotaToSheets);
router.get('/units', syncUnitToSheets);
router.post('/units', syncUnitToSheets);
router.get('/relawan', syncRelawanToSheets);
router.post('/relawan', syncRelawanToSheets);
router.get('/bencana', syncBencanaToSheets);
router.post('/bencana', syncBencanaToSheets);
router.get('/kegiatan', syncKegiatanToSheets);
router.post('/kegiatan', syncKegiatanToSheets);
router.get('/all', syncAllToSheets);
router.post('/all', syncAllToSheets);

export default router;
