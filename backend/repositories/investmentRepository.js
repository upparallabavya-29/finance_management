import { supabase } from '../config/supabase.js';

class InvestmentRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .eq('user_id', userId)
            .order('purchase_date', { ascending: false });
        if (error) throw error;
        return data || [];
    }

    async findById(id, userId) {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    }

    async create(investmentData) {
        const { data, error } = await supabase
            .from('investments')
            .insert([investmentData])
            .select();
        if (error) throw error;
        return data[0];
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('investments')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }

    async delete(id, userId) {
        const { error } = await supabase
            .from('investments')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new InvestmentRepository();
