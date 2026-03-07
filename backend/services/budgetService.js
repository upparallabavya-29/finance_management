import budgetRepository from '../repositories/budgetRepository.js';

class BudgetService {
    async getBudgets(userId) {
        const budgets = await budgetRepository.findAll(userId);
        if (!budgets || budgets.length === 0) return [];

        const categoryIds = [...new Set(budgets.map(b => b.category_id).filter(Boolean))];
        const cats = await budgetRepository.findCategories(categoryIds);
        const categoryMap = {};
        cats.forEach(c => { categoryMap[c.id] = c.name; });

        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            let spent_amount = parseFloat(budget.spent_amount) || 0;

            if (budget.category_id && budget.start_date && budget.end_date) {
                spent_amount = await budgetRepository.getSpentAmountByDates(
                    userId,
                    budget.category_id,
                    budget.start_date,
                    budget.end_date
                );
            }

            const categoryName = budget.category_id
                ? (categoryMap[budget.category_id] || 'Uncategorized')
                : (budget.period ? `${budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget` : 'Budget');

            return {
                ...budget,
                spent_amount,
                categories: { id: budget.category_id, name: categoryName }
            };
        }));

        return budgetsWithSpent;
    }

    async createBudget(userId, data) {
        const { category, limit_amount, period } = data;
        if (!category || !limit_amount) {
            throw new Error('Missing required fields');
        }

        let existingCat = await budgetRepository.findCategory(userId, category);
        let categoryId;
        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const newCat = await budgetRepository.createCategory(userId, category, 'expense');
            categoryId = newCat.id;
        }

        const startDate = new Date();
        const endDate = new Date();
        // Fallback for period missing
        const periodType = period || 'monthly';
        if (periodType === 'weekly') endDate.setDate(startDate.getDate() + 7);
        else if (periodType === 'monthly') endDate.setMonth(startDate.getMonth() + 1);
        else if (periodType === 'yearly') endDate.setFullYear(startDate.getFullYear() + 1);

        const budgetData = {
            user_id: userId,
            category_id: categoryId,
            amount: limit_amount,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            period: periodType
        };

        return await budgetRepository.create(budgetData);
    }

    async updateBudget(id, userId, updates) {
        const budget = await budgetRepository.update(id, userId, updates);
        if (!budget) throw new Error('Budget not found or not authorized');
        return budget;
    }

    async deleteBudget(id, userId) {
        return await budgetRepository.delete(id, userId);
    }
}

export default new BudgetService();
