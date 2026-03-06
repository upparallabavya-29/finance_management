import { supabase } from '../config/supabase.js'

export const getBudgets = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log('[DEBUG getBudgets] req.user.id:', userId);

        // Step 1: Fetch raw budgets
        const { data: budgets, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!budgets || budgets.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Step 2: Batch fetch categories for budgets that have category_id
        const categoryIds = [...new Set(budgets.map(b => b.category_id).filter(Boolean))];
        let categoryMap = {};
        if (categoryIds.length > 0) {
            const { data: cats } = await supabase
                .from('categories')
                .select('id, name')
                .in('id', categoryIds);
            (cats || []).forEach(c => { categoryMap[c.id] = c.name; });
        }

        // Step 3: Compute spent_amount from transactions (if category_id is linked),
        // otherwise fall back to DB-stored spent_amount (legacy budgets)
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            let spent_amount = parseFloat(budget.spent_amount) || 0;

            if (budget.category_id) {
                const { data: txData } = await supabase
                    .from('transactions')
                    .select('amount')
                    .eq('user_id', userId)
                    .eq('category_id', budget.category_id)
                    .eq('type', 'expense')
                    .gte('date', budget.start_date)
                    .lte('date', budget.end_date);
                if (txData && txData.length > 0) {
                    spent_amount = txData.reduce((sum, t) => sum + parseFloat(t.amount), 0);
                }
            }

            // Build a friendly category name from the category lookup or period
            const categoryName = budget.category_id
                ? (categoryMap[budget.category_id] || 'Uncategorized')
                : (budget.period ? `${budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget` : 'Budget');

            return {
                ...budget,
                spent_amount,
                categories: { id: budget.category_id, name: categoryName }
            };
        }));

        console.log('[DEBUG getBudgets] count:', budgetsWithSpent?.length);
        res.status(200).json({ success: true, data: budgetsWithSpent });
    } catch (error) {
        console.error('[getBudgets ERROR]', error.message);
        res.status(500).json({ success: false, message: error.message });
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
            .maybeSingle();

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
            .select();

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
