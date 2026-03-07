import investmentRepository from '../repositories/investmentRepository.js';

class InvestmentService {
    async getInvestments(userId) {
        return await investmentRepository.findAll(userId);
    }

    async createInvestment(userId, investmentData) {
        const { asset_name, asset_type, quantity, purchase_price, current_price, purchase_date } = investmentData;

        if (!asset_name || !asset_type || !quantity || !purchase_price) {
            throw Object.assign(new Error('Asset name, type, quantity and purchase price are required'), { statusCode: 400 });
        }

        const data = {
            user_id: userId,
            asset_name,
            asset_type,
            quantity: parseFloat(quantity),
            purchase_price: parseFloat(purchase_price),
            current_price: parseFloat(current_price || purchase_price),
            purchase_date: purchase_date || new Date().toISOString()
        };

        return await investmentRepository.create(data);
    }

    async updateInvestment(id, userId, updates) {
        const sanitized = {};
        if (updates.asset_name !== undefined) sanitized.asset_name = updates.asset_name;
        if (updates.asset_type !== undefined) sanitized.asset_type = updates.asset_type;
        if (updates.quantity !== undefined) sanitized.quantity = parseFloat(updates.quantity);
        if (updates.purchase_price !== undefined) sanitized.purchase_price = parseFloat(updates.purchase_price);
        if (updates.current_price !== undefined) sanitized.current_price = parseFloat(updates.current_price);
        if (updates.purchase_date !== undefined) sanitized.purchase_date = updates.purchase_date;

        const investment = await investmentRepository.update(id, userId, sanitized);
        if (!investment) throw Object.assign(new Error('Investment not found or not authorized'), { statusCode: 404 });
        return investment;
    }

    async deleteInvestment(id, userId) {
        return await investmentRepository.delete(id, userId);
    }
}

export default new InvestmentService();
