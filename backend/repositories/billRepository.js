import { supabase } from '../config/supabase.js';

class BillRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('user_id', userId)
            .order('due_date', { ascending: true });
        if (error) throw error;
        return data || [];
    }

    async findById(id, userId) {
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    }

    async create(billData) {
        const { data, error } = await supabase
            .from('bills')
            .insert([billData])
            .select();
        if (error) throw error;
        return data[0];
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('bills')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }

    async delete(id, userId) {
        const { error } = await supabase
            .from('bills')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new BillRepository();
