import './utils/logs/enhancedLogs.js';

import express from 'express';
import router from './routes/router.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
