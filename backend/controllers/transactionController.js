import { supabase } from '../config/supabase.js'

export const getTransactions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false })

        if (error) throw error

        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createTransaction = async (req, res) => {
    try {
        const { amount, category, date, description, type, user_id } = req.body

        // Basic validation
        if (!amount || !category || !date || !type) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const { data, error } = await supabase
            .from('transactions')
            .insert([{ amount, category, date, description, type, user_id }])
            .select()

        if (error) throw error

        res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error

        res.status(200).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) throw error

        res.status(200).json({ success: true, message: 'Transaction deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
