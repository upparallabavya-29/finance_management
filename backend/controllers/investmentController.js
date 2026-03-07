import investmentService from '../services/investmentService.js';

export const getInvestments = async (req, res, next) => {
    try {
        const investments = await investmentService.getInvestments(req.user.id);
        res.status(200).json({ success: true, data: investments });
    } catch (error) {
        next(error);
    }
};

export const createInvestment = async (req, res, next) => {
    try {
        const investment = await investmentService.createInvestment(req.user.id, req.body);
        res.status(201).json({ success: true, data: investment });
    } catch (error) {
        next(error);
    }
};

export const updateInvestment = async (req, res, next) => {
    try {
        const investment = await investmentService.updateInvestment(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: investment });
    } catch (error) {
        next(error);
    }
};

export const deleteInvestment = async (req, res, next) => {
    try {
        await investmentService.deleteInvestment(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Investment deleted successfully' });
    } catch (error) {
        next(error);
    }
};
