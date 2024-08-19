import express from 'express';
import { createNewCandidateBoxFolder, updateCandidateBoxParentFolder } from './candidateController.js';
import { checkEventType } from './middlewares/checkEventType.js';

const router = express.Router();

router.post('/candidates/new', checkEventType('create_pulse'), createNewCandidateBoxFolder);
router.post('/candidates/update_box_parent', checkEventType('move_pulse_into_board'), updateCandidateBoxParentFolder);

router.post('/employees/new', checkEventType('create_pulse'), createNewCandidateBoxFolder);
router.post('/employees/move', checkEventType('move_pulse_into_board'), updateCandidateBoxParentFolder);

export default router;