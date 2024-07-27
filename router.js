import express from 'express';
import { handleCandidateRequest } from './candidateController.js';

const router = express.Router();

router.post('/candidates', handleCandidateRequest);

export default router;
