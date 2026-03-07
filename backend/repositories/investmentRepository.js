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
        // Map to actual DB columns found in migrations
        const mappedData = {
            user_id: investmentData.user_id,
            name: investmentData.name,
            type: investmentData.type || 'Other',
            purchase_price: investmentData.purchase_price,
            quantity: investmentData.quantity || 1,
            current_value: investmentData.current_value
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
        if (updates.name) mappedUpdates.name = updates.name;
        if (updates.type) mappedUpdates.type = updates.type;
        if (updates.purchase_price) mappedUpdates.purchase_price = updates.purchase_price;
        if (updates.quantity) mappedUpdates.quantity = updates.quantity;
        if (updates.current_value) mappedUpdates.current_value = updates.current_value;

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
