import transactionRepository from '../repositories/transactionRepository.js';

class TransactionService {
    async getTransactions(userId, limit = null, offset = null) {
        // Fetch transactions
        const { data: transactions, count } = await transactionRepository.findAll(userId, limit, offset);

        // Fetch categories to map names (abstracting away DB representation details)
        const categories = await transactionRepository.findCategoriesByUser(userId);
        const categoryMap = {};
        categories.forEach(c => categoryMap[c.id] = c.name);

        const enrichedData = transactions.map(t => ({
            ...t,
            categories: { name: categoryMap[t.category_id] || 'Uncategorized' }
        }));

        return { data: enrichedData, count };
    }

    async createTransaction(userId, data) {
        const { description, amount, date, category, type } = data;
        if (!description || !amount || !date || !category || !type) {
            throw new Error('Missing required fields');
        }

        let existingCat = await transactionRepository.findCategory(userId, category, type);
        let categoryId;

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const newCat = await transactionRepository.createCategory(userId, category, type);
            categoryId = newCat.id;
        }

        const transactionData = {
            user_id: userId,
            category_id: categoryId,
            amount: parseFloat(amount),
            date,
            description,
            type
        };

        return await transactionRepository.create(transactionData);
    }

    async updateTransaction(id, userId, updates) {
        const transaction = await transactionRepository.update(id, userId, updates);
        if (!transaction) throw new Error('Transaction not found or not authorized');
        return transaction;
    }

    async deleteTransaction(id, userId) {
        return await transactionRepository.delete(id, userId);
    }
}

export default new TransactionService();
