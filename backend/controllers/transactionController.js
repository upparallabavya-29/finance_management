import supabase from '../config/supabaseClient.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public (for demonstration)
export const getTransactions = async (req, res) => {
    try {
        // Basic Supabase query to fetch all transactions
        // In a real scenario, you would filter by the authenticated user's ID
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error fetching transactions',
            error: error.message
        });
    }
};
