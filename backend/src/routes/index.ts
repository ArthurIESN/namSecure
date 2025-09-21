import express from 'express';
import healthRoutes from './health';

const router = express.Router();

// Montage des différentes routes
router.use('/health', healthRoutes);

export default router;