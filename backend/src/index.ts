import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import des routes
import apiRoutes from './routes';

// Configuration des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Middleware de logging
app.use(morgan('combined'));

// Middlewares pour parser les requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Route de base pour tester que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API namSecure',
    version: '1.0.0',
    status: 'running'
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`
  });
});

// Middleware de gestion des erreurs globales
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📖 Mode: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
