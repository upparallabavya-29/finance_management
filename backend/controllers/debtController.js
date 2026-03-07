import debtService from '../services/debtService.js';

export const getDebts = async (req, res, next) => {
    try {
        const debts = await debtService.getDebts(req.user.id);
        res.status(200).json({ success: true, data: debts });
    } catch (error) {
        next(error);
    }
};

export const createDebt = async (req, res, next) => {
    try {
        const debt = await debtService.createDebt(req.user.id, req.body);
        res.status(201).json({ success: true, data: debt });
    } catch (error) {
        next(error);
    }
};

export const updateDebt = async (req, res, next) => {
    try {
        const debt = await debtService.updateDebt(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: debt });
    } catch (error) {
        next(error);
    }
};

export const deleteDebt = async (req, res, next) => {
    try {
        await debtService.deleteDebt(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Debt deleted successfully' });
    } catch (error) {
        next(error);
    }
};
