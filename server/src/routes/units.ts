import { Router } from 'express';
import {
  getPMRMula,
  getPMRMadya,
  getPMRWira,
  getKSR,
  getUnitKSRById,
  getUnitPMRById,
  getUnitTSRById,
  getMembersByUnitKSR,
  getMembersByUnitPMR,
  getMembersByUnitTSR,
  getTSR,
  createUnitPMR,
  updateUnitPMR,
  deleteUnitPMR,
  createUnitKSR,
  updateUnitKSR,
  deleteUnitKSR,
  createUnitTSR,
  updateUnitTSR,
  deleteUnitTSR,
  uploadUnitSK,
  uploadUnitSKPMR,
  uploadUnitSKTSR,
  upload,
} from '../controllers/unitsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/pmr/mula', authenticate, getPMRMula);
router.get('/pmr/madya', authenticate, getPMRMadya);
router.get('/pmr/wira', authenticate, getPMRWira);
router.get('/ksr', authenticate, getKSR);
router.get('/ksr/:id', authenticate, getUnitKSRById);
router.get('/ksr/:id/anggota', authenticate, getMembersByUnitKSR);
router.get('/ksr/:id/anggota/:kategori', authenticate, getMembersByUnitKSR);
router.get('/tsr', authenticate, getTSR);
router.get('/tsr/:id', authenticate, getUnitTSRById);
router.get('/tsr/:id/anggota', authenticate, getMembersByUnitTSR);
router.get('/tsr/:id/anggota/:kategori', authenticate, getMembersByUnitTSR);
router.get('/pmr/:id', authenticate, getUnitPMRById);
router.get('/pmr/:id/anggota', authenticate, getMembersByUnitPMR);
router.get('/pmr/:id/anggota/:kategori', authenticate, getMembersByUnitPMR);

router.post('/pmr', authenticate, createUnitPMR);
router.put('/pmr/:id', authenticate, updateUnitPMR);
router.delete('/pmr/:id', authenticate, deleteUnitPMR);

router.post('/ksr', authenticate, createUnitKSR);
router.put('/ksr/:id', authenticate, updateUnitKSR);
router.delete('/ksr/:id', authenticate, deleteUnitKSR);

router.post('/ksr/:id/upload-sk', authenticate, upload.single('file'), uploadUnitSK);

router.post('/pmr/:id/upload-sk', authenticate, upload.single('file'), uploadUnitSKPMR);

router.post('/tsr/:id/upload-sk', authenticate, upload.single('file'), uploadUnitSKTSR);

router.post('/tsr', authenticate, createUnitTSR);
router.put('/tsr/:id', authenticate, updateUnitTSR);
router.delete('/tsr/:id', authenticate, deleteUnitTSR);

export default router;
