import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import candidateRouter from './router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;
const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} mode`);

app.use(bodyParser.json());
app.use(candidateRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});