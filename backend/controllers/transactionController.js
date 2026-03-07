import transactionService from '../services/transactionService.js';

export const getTransactions = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const { data, count } = await transactionService.getTransactions(req.user.id, parseInt(limit), parseInt(offset));
        return res.status(200).json({ success: true, count, data });
    } catch (error) {
        next(error);
    }
};

export const createTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.createTransaction(req.user.id, req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        if (error.message === 'Missing required fields') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

export const updateTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.updateTransaction(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

export const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        next(error);
    }
};
