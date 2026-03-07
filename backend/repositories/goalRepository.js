import { supabase } from '../config/supabase.js';

class GoalRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(g => ({ ...g, title: g.name }));
    }

    async findById(id, userId) {
        const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data ? { ...data, title: data.name } : null;
    }

    async create(goalData) {
        const { data, error } = await supabase
            .from('savings_goals')
            .insert([goalData])
            .select();
        if (error) throw error;
        if (error) throw error;
        return { ...data[0], title: data[0].name };
    }

    async update(id, userId, updates) {
        const { data, error } = await supabase
            .from('savings_goals')
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
            .from('savings_goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

export default new GoalRepository();
