import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import candidateRouter from './router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(candidateRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});