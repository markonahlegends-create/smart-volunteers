import { Router } from 'express';
import { getStats, getCharts, getPmrBreakdown, getGrowthData, getPublicStats } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, getStats);
router.get('/charts', authenticate, getCharts);
router.get('/pmr-breakdown', authenticate, getPmrBreakdown);
router.get('/growth', authenticate, getGrowthData);
router.get('/public-stats', getPublicStats);

export default router;
