import { supabase } from '../config/supabase.js';

class TransactionRepository {
    async findAll(userId, limit = null, offset = null) {
        let query = supabase
            .from('transactions')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (limit) query = query.limit(limit);
        if (offset) query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;
        if (error) throw error;
        return { data, count };
    }

    async findCategoriesByUser(userId) {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name')
            .eq('user_id', userId);
        if (error) throw error;
        return data || [];
    }

    async findCategory(userId, name, type) {
        const { data, error } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', userId)
            .eq('name', name)
            .eq('type', type)
            .single();

        // Ignore single row not found errors
        if (error && error.code !== 'PGRST116') throw error;
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

    async create(transactionData) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();
        if (error) throw error;
        return data[0];
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async delete(id, userId) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new TransactionRepository();
