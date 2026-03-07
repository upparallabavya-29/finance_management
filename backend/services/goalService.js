import goalRepository from '../repositories/goalRepository.js';

class GoalService {
    async getGoals(userId) {
        return await goalRepository.findAll(userId);
    }

    async createGoal(userId, goalData) {
        const { title, target_amount, current_amount, deadline } = goalData;

        if (!title || !target_amount) {
            throw Object.assign(new Error('Title and target amount are required'), { statusCode: 400 });
        }

        const data = {
            user_id: userId,
            name: title,
            target_amount: parseFloat(target_amount),
            current_amount: parseFloat(current_amount || 0),
            deadline: deadline || null
        };

        return await goalRepository.create(data);
    }

    async updateGoal(id, userId, updates) {
        // Sanitize updates
        const sanitized = {};
        if (updates.title !== undefined) sanitized.name = updates.title;
        if (updates.target_amount !== undefined) sanitized.target_amount = parseFloat(updates.target_amount);
        if (updates.current_amount !== undefined) sanitized.current_amount = parseFloat(updates.current_amount);
        if (updates.deadline !== undefined) sanitized.deadline = updates.deadline;

        const goal = await goalRepository.update(id, userId, sanitized);
        if (!goal) throw Object.assign(new Error('Goal not found or not authorized'), { statusCode: 404 });
        return goal;
    }

    async deleteGoal(id, userId) {
        return await goalRepository.delete(id, userId);
    }
}

export default new GoalService();
