import { supabase } from '../config/supabase.js';

class InvestmentRepository {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
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
        // Map to actual DB columns found in discovery
        const mappedData = {
            user_id: investmentData.user_id,
            title: investmentData.name || investmentData.title,
            target_amount: investmentData.purchase_price || investmentData.target_amount,
            current_amount: investmentData.current_value || investmentData.current_amount || investmentData.purchase_price
        };

        const { data, error } = await supabase
            .from('investments')
            .insert([mappedData])
            .select();
        if (error) throw error;
        return data ? data[0] : null;
    }

    async update(id, userId, updates) {
        const mappedUpdates = {};
        if (updates.name || updates.title) mappedUpdates.title = updates.name || updates.title;
        if (updates.purchase_price || updates.target_amount) mappedUpdates.target_amount = updates.purchase_price || updates.target_amount;
        if (updates.current_value || updates.current_amount) mappedUpdates.current_amount = updates.current_value || updates.current_amount;

        const { data, error } = await supabase
            .from('investments')
            .update(mappedUpdates)
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
