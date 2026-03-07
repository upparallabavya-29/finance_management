import debtRepository from '../repositories/debtRepository.js';

class DebtService {
    async getDebts(userId) {
        return await debtRepository.findAll(userId);
    }

    async createDebt(userId, debtData) {
        const { title, total_amount, balance, interest_rate, due_date } = debtData;

        if (!title || !total_amount) {
            throw Object.assign(new Error('Title and total amount are required'), { statusCode: 400 });
        }

        const data = {
            user_id: userId,
            name: title,
            total_amount: parseFloat(total_amount),
            balance: parseFloat(balance || total_amount),
            interest_rate: parseFloat(interest_rate || 0),
            due_date: due_date || null
        };

        return await debtRepository.create(data);
    }

    async updateDebt(id, userId, updates) {
        const sanitized = {};
        if (updates.title !== undefined) sanitized.name = updates.title;
        if (updates.total_amount !== undefined) sanitized.total_amount = parseFloat(updates.total_amount);
        if (updates.balance !== undefined) sanitized.balance = parseFloat(updates.balance);
        if (updates.interest_rate !== undefined) sanitized.interest_rate = parseFloat(updates.interest_rate);
        if (updates.due_date !== undefined) sanitized.due_date = updates.due_date;

        const debt = await debtRepository.update(id, userId, sanitized);
        if (!debt) throw Object.assign(new Error('Debt not found or not authorized'), { statusCode: 404 });
        return debt;
    }

    async deleteDebt(id, userId) {
        return await debtRepository.delete(id, userId);
    }
}

export default new DebtService();
