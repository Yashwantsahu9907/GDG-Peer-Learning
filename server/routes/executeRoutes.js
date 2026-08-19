import express from 'express';
import { execCode } from '../controllers/executeController.js';

const router = express.Router();

router.post('/execute', execCode);

export default router;
