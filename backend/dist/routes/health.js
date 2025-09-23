"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=health.js.map