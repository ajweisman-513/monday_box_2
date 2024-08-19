import express from 'express';
import { createNewBoxFolder, updateBoxParentFolder } from './employeeController.js';
import { checkEventType } from './middlewares/checkEventType.js';

const router = express.Router();

router.post('/employees/new', checkEventType('create_pulse'), createNewBoxFolder);
router.post('/employees/move', checkEventType('move_pulse_into_board'), updateBoxParentFolder);

export default router;