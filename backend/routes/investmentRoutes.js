import express from 'express';
import { getInvestments } from '../controllers/investmentController.js';

const router = express.Router();

router.get('/', getInvestments);

export default router;
