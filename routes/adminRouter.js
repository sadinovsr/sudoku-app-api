import express from 'express'
import { getAdminDashboardData } from '../controllers/adminController'

const router = express.Router();

router.get('/', getAdminDashboardData);

export default router;