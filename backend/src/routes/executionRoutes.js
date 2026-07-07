import express from 'express';
import { executeCode } from '../controller/executeCode.js';

const router = express.Router();

router.post('/execute',executeCode);

export default router;