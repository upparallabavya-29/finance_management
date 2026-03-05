import { supabase } from '../config/supabase.js'

export const getBudgets = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('user_id', req.user.id);

        if (error) throw error

        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createBudget = async (req, res) => {
    try {
        const { category, limit_amount, period } = req.body
        const user_id = req.user.id

        if (!category || !limit_amount || !period) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        // 1. Get or create category
        let categoryId;
        const { data: existingCat, error: catSearchErr } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', user_id)
            .eq('name', category)
            .single();

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const { data: newCat, error: catInsertErr } = await supabase
                .from('categories')
                .insert([{ user_id, name: category, type: 'expense' }])
                .select()
                .single();
            if (catInsertErr) throw catInsertErr;
            categoryId = newCat.id;
        }

        // 2. Calculate dates from period
        const startDate = new Date();
        const endDate = new Date();
        if (period === 'weekly') endDate.setDate(startDate.getDate() + 7);
        else if (period === 'monthly') endDate.setMonth(startDate.getMonth() + 1);
        else if (period === 'yearly') endDate.setFullYear(startDate.getFullYear() + 1);

        // 3. Create the budget record using correct schema fields
        const { data, error } = await supabase
            .from('budgets')
            .insert([{
                user_id,
                category_id: categoryId,
                amount: limit_amount,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }])
            .select('*, categories(*)');

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
        console.error('Create Budget Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create budget' })
    }
}

export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabase
            .from('budgets')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error

        res.status(200).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id)

        if (error) throw error

        res.status(200).json({ success: true, message: 'Budget deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
