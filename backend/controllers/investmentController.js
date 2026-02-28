import supabase from '../config/supabaseClient.js';

// @desc    Get all investments
// @route   GET /api/investments
export const getInvestments = async (req, res) => {
    try {
        const { data: investments, error } = await supabase
            .from('investments')
            .select('*')
            .order('current_value', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ success: true, count: investments.length, data: investments });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error fetching investments', error: error.message });
    }
};
