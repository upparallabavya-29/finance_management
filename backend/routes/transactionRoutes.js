import express from 'express';
import { getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions
// @access  Public (for now, will be protected with auth middleware later)
router.get('/', getTransactions);

export default router;
