import { supabase } from '../config/supabase.js'

export const getTransactions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('user_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ success: false, message: 'Server Error fetching transactions' });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const { description, amount, date, category, type } = req.body;
        const user_id = req.user.id;

        if (!description || !amount || !date || !category || !type) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // DEBUG: Check if user exists in public.users
        const { data: userRecord, error: userError } = await supabase.from('users').select('*').eq('id', user_id).single();
        console.log('DEBUG: User in public.users:', userRecord, 'Error:', userError);

        // 1. Get or create category
        let categoryId;
        const { data: existingCat, error: catSearchErr } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', user_id)
            .eq('name', category)
            .eq('type', type)
            .single();

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const { data: newCat, error: catInsertErr } = await supabase
                .from('categories')
                .insert([{ user_id, name: category, type }])
                .select()
                .single();
            if (catInsertErr) throw catInsertErr;
            categoryId = newCat.id;
        }

        // 2. Create the transaction record
        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id,
                category_id: categoryId,
                amount: parseFloat(amount),
                date,
                description,
                type
            }])
            .select(`*, categories(*)`);

        if (error) throw error;

        res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        console.error('Create Transaction Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create transaction' });
    }
};

export const updateTransaction = async (req, res) => {
    // Placeholder for future updates
    res.status(200).json({ success: true });
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', req.user.id);
        if (error) throw error;
        res.status(200).json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
