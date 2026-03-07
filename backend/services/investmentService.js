import investmentRepository from '../repositories/investmentRepository.js';

class InvestmentService {
    async getInvestments(userId) {
        return await investmentRepository.findAll(userId);
    }

    async createInvestment(userId, investmentData) {
        const name = investmentData.name || investmentData.title;
        const type = investmentData.type || 'Other';
        const quantity = investmentData.quantity || 1;
        const purchase_price = investmentData.purchase_price || investmentData.target_amount;
        const current_value = investmentData.current_value || investmentData.current_amount || purchase_price;

        if (!name || !purchase_price) {
            throw Object.assign(new Error('Asset name (name) and purchase price are required'), { statusCode: 400 });
        }

        const data = {
            user_id: userId,
            name,
            title: name, // Resilient mapping
            type,
            quantity: parseFloat(quantity),
            purchase_price: parseFloat(purchase_price),
            target_amount: parseFloat(purchase_price), // Resilient mapping
            current_value: parseFloat(current_value),
            current_amount: parseFloat(current_value) // Resilient mapping
        };

        return await investmentRepository.create(data);
    }

    async updateInvestment(id, userId, updates) {
        const sanitized = {};
        if (updates.name !== undefined) sanitized.name = updates.name;
        if (updates.type !== undefined) sanitized.type = updates.type;
        if (updates.quantity !== undefined) sanitized.quantity = parseFloat(updates.quantity);
        if (updates.purchase_price !== undefined) sanitized.purchase_price = parseFloat(updates.purchase_price);
        if (updates.current_value !== undefined) sanitized.current_value = parseFloat(updates.current_value);

        const investment = await investmentRepository.update(id, userId, sanitized);
        if (!investment) throw Object.assign(new Error('Investment not found or not authorized'), { statusCode: 404 });
        return investment;
    }

    async deleteInvestment(id, userId) {
        return await investmentRepository.delete(id, userId);
    }
}

export default new InvestmentService();
