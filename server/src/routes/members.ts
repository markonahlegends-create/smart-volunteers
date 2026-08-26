import { Router } from 'express';
import {
  getPMR,
  getPMRMemberById,
  getKSRMembers,
  getKSRMemberById,
  getTSRMembers,
  getTSRMemberById,
  getDDSMembers,
  getDDSMemberById,
  createAnggotaPMR,
  updateAnggotaPMR,
  deleteAnggotaPMR,
  createAnggotaKSR,
  updateAnggotaKSR,
  deleteAnggotaKSR,
  createAnggotaTSR,
  updateAnggotaTSR,
  deleteAnggotaTSR,
  createAnggotaDDS,
  updateAnggotaDDS,
  deleteAnggotaDDS,
} from '../controllers/membersController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/pmr', authenticate, getPMR);
router.get('/pmr/:id', authenticate, getPMRMemberById);
router.get('/ksr/markas', authenticate, (req, res) => {
  req.query.kategori = 'MARKAS';
  getMembers(req, res, 'ksr');
});
router.get('/ksr/perguruan-tinggi', authenticate, (req, res) => {
  req.query.kategori = 'PERGURUAN TINGGI';
  getMembers(req, res, 'ksr');
});
router.get('/ksr', authenticate, getKSRMembers);
router.get('/ksr/:id', authenticate, getKSRMemberById);
router.get('/tsr', authenticate, getTSRMembers);
router.get('/tsr/:id', authenticate, getTSRMemberById);
router.get('/dds', authenticate, getDDSMembers);
router.get('/dds/:id', authenticate, getDDSMemberById);

router.post('/pmr', authenticate, createAnggotaPMR);
router.put('/pmr/:id', authenticate, updateAnggotaPMR);
router.delete('/pmr/:id', authenticate, deleteAnggotaPMR);

router.post('/ksr', authenticate, createAnggotaKSR);
router.put('/ksr/:id', authenticate, updateAnggotaKSR);
router.delete('/ksr/:id', authenticate, deleteAnggotaKSR);

router.post('/tsr', authenticate, createAnggotaTSR);
router.put('/tsr/:id', authenticate, updateAnggotaTSR);
router.delete('/tsr/:id', authenticate, deleteAnggotaTSR);

router.post('/dds', authenticate, createAnggotaDDS);
router.put('/dds/:id', authenticate, updateAnggotaDDS);
router.delete('/dds/:id', authenticate, deleteAnggotaDDS);

export default router;
