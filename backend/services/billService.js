import billRepository from '../repositories/billRepository.js';

class BillService {
    async getBills(userId) {
        return await billRepository.findAll(userId);
    }

    async createBill(userId, billData) {
        const { title, amount, due_date, is_recurring } = billData;

        if (!title || !amount || !due_date) {
            throw Object.assign(new Error('Title, amount, and due date are required'), { statusCode: 400 });
        }

        const data = {
            user_id: userId,
            title,
            amount: parseFloat(amount),
            due_date,
            is_recurring: !!is_recurring,
            status: 'pending'
        };

        return await billRepository.create(data);
    }

    async updateBill(id, userId, updates) {
        const sanitized = {};
        if (updates.title !== undefined) sanitized.title = updates.title;
        if (updates.amount !== undefined) sanitized.amount = parseFloat(updates.amount);
        if (updates.due_date !== undefined) sanitized.due_date = updates.due_date;
        if (updates.is_recurring !== undefined) sanitized.is_recurring = !!updates.is_recurring;
        if (updates.status !== undefined) sanitized.status = updates.status;

        const bill = await billRepository.update(id, userId, sanitized);
        if (!bill) throw Object.assign(new Error('Bill not found or not authorized'), { statusCode: 404 });
        return bill;
    }

    async deleteBill(id, userId) {
        return await billRepository.delete(id, userId);
    }
}

export default new BillService();
