import express from 'express';

const router = express.Router();


router.get('/', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'L\'API fonctionne correctement',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


router.get('/detailed', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Vérification détaillée de l\'API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
    }
  });
});

export default router;
