import budgetService from '../services/budgetService.js';

export const getBudgets = async (req, res, next) => {
    try {
        const budgets = await budgetService.getBudgets(req.user.id);
        res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        next(error);
    }
};

export const createBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.createBudget(req.user.id, req.body);
        res.status(201).json({ success: true, data: budget });
    } catch (error) {
        if (error.message === 'Missing required fields') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

export const updateBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.updateBudget(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

export const deleteBudget = async (req, res, next) => {
    try {
        await budgetService.deleteBudget(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Budget deleted successfully' });
    } catch (error) {
        next(error);
    }
};
