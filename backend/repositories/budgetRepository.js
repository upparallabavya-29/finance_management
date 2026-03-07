import { supabase } from '../config/supabase.js';

class BudgetRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId);
        if (error) throw error;
        return data || [];
    }

    async findCategories(categoryIds) {
        if (!categoryIds || categoryIds.length === 0) return [];
        const { data, error } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', categoryIds);
        if (error) throw error;
        return data || [];
    }

    async getSpentAmountByDates(userId, categoryId, startDate, endDate) {
        const { data, error } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('category_id', categoryId)
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate);
        if (error) throw error;
        if (!data || data.length === 0) return 0;
        return data.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    async findCategory(userId, name) {
        const { data, error } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', userId)
            .eq('name', name)
            .maybeSingle();
        if (error) throw error;
        return data;
    }

    async createCategory(userId, name, type) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ user_id: userId, name, type }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async create(budgetData) {
        const { data, error } = await supabase
            .from('budgets')
            .insert([budgetData])
            .select();
        if (error) throw error;
        return data[0];
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('budgets')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }

    async delete(id, userId) {
        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new BudgetRepository();
