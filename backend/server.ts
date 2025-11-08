import dotenv from 'dotenv';
dotenv.config();
import './utils/logs/enhancedLogs.js';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/router.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // @todo move to env to be able to work in production
    credentials: true,
}));
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
