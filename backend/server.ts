import './utils/logs/enhancedLogs.js';

// JUST FOR TEST
// SEND AN EMAIL
import { sendEmail } from './utils/email/email.js';


import express from 'express';
import router from './routes/router.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {


    console.log(`Server running on port ${PORT}`);
    try
    {
        sendEmail("ryckbosch.arthur@gmail.com", "test from backend", "text content", "<h1>html content</h1>");
    }
    catch (error)
    {
        console.error("Failed to send test email:", error);
    }

});
