import supabase from '../config/supabaseClient.js';

export const getDebts = async (req, res) => {
    try {
        const { data: debts, error } = await supabase
            .from('debts')
            .select('*')
            .order('due_date', { ascending: true });

        if (error) throw error;

        return res.status(200).json({ success: true, count: debts.length, data: debts });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error fetching debts', error: error.message });
    }
};
