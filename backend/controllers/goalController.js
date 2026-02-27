import { supabase } from '../config/supabase.js'

export const getGoals = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('goals')
            .select('*')

        if (error) throw error

        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createGoal = async (req, res) => {
    try {
        const { name, target_amount, deadline, user_id } = req.body

        if (!name || !target_amount || !deadline) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const { data, error } = await supabase
            .from('goals')
            .insert([{ name, target_amount, deadline, user_id, current_amount: 0 }])
            .select()

        if (error) throw error

        res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateGoal = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error

        res.status(200).json({ success: true, data: data[0] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) throw error

        res.status(200).json({ success: true, message: 'Goal deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
