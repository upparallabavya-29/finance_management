import { supabase } from '../config/supabase.js';

class InsightService {
    async getSpendingInsights(userId) {
        // Fetch current month and previous month transactions
        const now = new Date();
        const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDayCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

        const { data: currentMonth, error: err1 } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('date', firstDayCurrent)
            .lte('date', lastDayCurrent);

        const { data: prevMonth, error: err2 } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('date', firstDayPrev)
            .lte('date', lastDayPrev);

        if (err1 || err2) throw err1 || err2;

        const currentTotal = currentMonth.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const prevTotal = prevMonth.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        // Calculate category Breakdown for current month
        const categoryBreakdown = currentMonth.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount || 0);
            return acc;
        }, {});

        const topCategory = Object.entries(categoryBreakdown)
            .sort(([, a], [, b]) => b - a)[0] || ['None', 0];

        // Generate Insights
        const insights = [];

        // Insight 1: Spending Trend
        if (prevTotal > 0) {
            const diff = ((currentTotal - prevTotal) / prevTotal) * 100;
            if (diff > 10) {
                insights.push({
                    type: 'warning',
                    title: 'Spending Spike',
                    description: `Your spending this month is ${Math.abs(diff).toFixed(1)}% higher than last month. Consider reviewing your non-essential expenses.`
                });
            } else if (diff < -10) {
                insights.push({
                    type: 'success',
                    title: 'Great Progress',
                    description: `You've spent ${Math.abs(diff).toFixed(1)}% less than last month. You're on track to save more!`
                });
            }
        }

        // Insight 2: Category Focus
        if (topCategory[1] > 0 && currentTotal > 0) {
            const pct = (topCategory[1] / currentTotal) * 100;
            if (pct > 40) {
                insights.push({
                    type: 'info',
                    title: 'Dominant Category',
                    description: `${topCategory[0]} accounts for ${pct.toFixed(1)}% of your spending this month. Check if you can optimize this area.`
                });
            }
        }

        // Insight 3: Dynamic Advice based on common categories
        if (categoryBreakdown['Dining'] > (currentTotal * 0.2)) {
            insights.push({
                type: 'warning',
                title: 'High Dining Expenses',
                description: 'You are spending a significant portion of your income on dining out. Cooking at home could save you ₹' + (categoryBreakdown['Dining'] * 0.3).toFixed(0) + ' this month.'
            });
        }

        return {
            summary: {
                currentTotal,
                prevTotal,
                changePct: prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0
            },
            topCategory: {
                name: topCategory[0],
                amount: topCategory[1]
            },
            insights
        };
    }
}

export default new InsightService();
