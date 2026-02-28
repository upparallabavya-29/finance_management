import express from 'express';
import { getDebts } from '../controllers/debtController.js';
// Import auth middleware once created: import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDebts); // TODO: Add protect middleware router.get('/', protect, getDebts)

export default router;
