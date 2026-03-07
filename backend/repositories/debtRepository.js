import { supabase } from '../config/supabase.js';

class DebtRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('debts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(d => ({ ...d, title: d.name }));
    }

    async findById(id, userId) {
        const { data, error } = await supabase
            .from('debts')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data ? { ...data, title: data.name } : null;
    }

    async create(debtData) {
        const { data, error } = await supabase
            .from('debts')
            .insert([debtData])
            .select();
        if (error) throw error;
        if (error) throw error;
        return data[0] ? { ...data[0], title: data[0].name } : null;
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('debts')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        if (error) throw error;
        return data && data.length > 0 ? { ...data[0], title: data[0].name } : null;
    }

    async delete(id, userId) {
        const { error } = await supabase
            .from('debts')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new DebtRepository();
