import billService from '../services/billService.js';

export const getBills = async (req, res, next) => {
    try {
        const bills = await billService.getBills(req.user.id);
        res.status(200).json({ success: true, data: bills });
    } catch (error) {
        next(error);
    }
};

export const createBill = async (req, res, next) => {
    try {
        const bill = await billService.createBill(req.user.id, req.body);
        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        next(error);
    }
};

export const updateBill = async (req, res, next) => {
    try {
        const bill = await billService.updateBill(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: bill });
    } catch (error) {
        next(error);
    }
};

export const deleteBill = async (req, res, next) => {
    try {
        await billService.deleteBill(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        next(error);
    }
};
