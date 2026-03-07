import insightService from '../services/insightService.js';

export const getInsights = async (req, res, next) => {
    try {
        const insights = await insightService.getSpendingInsights(req.user.id);
        res.status(200).json({ success: true, data: insights });
    } catch (error) {
        next(error);
    }
};
