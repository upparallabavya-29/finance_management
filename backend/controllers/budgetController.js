import { supabase } from '../config/supabase.js'

export const getBudgets = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')

        if (error) throw error

        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createBudget = async (req, res) => {
    try {
        const { category, limit_amount, period, user_id } = req.body

        if (!category || !limit_amount || !period) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const { data, error } = await supabase
            .from('budgets')
            .insert([{ category, limit_amount, period, user_id, spent_amount: 0 }])
            .select()

        if (error) throw error

        res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
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
