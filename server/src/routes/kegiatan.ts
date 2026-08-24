import { Router } from 'express';
import {
  getKegiatan,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
  downloadSemesterReport,
  downloadKegiatanReport,
} from '../controllers/kegiatanController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getKegiatan);
router.post('/', authenticate, createKegiatan);
router.put('/:id', authenticate, updateKegiatan);
router.delete('/:id', authenticate, deleteKegiatan);
router.get('/download/semester', authenticate, downloadSemesterReport);
router.get('/download/kegiatan', authenticate, downloadKegiatanReport);

export default router;
