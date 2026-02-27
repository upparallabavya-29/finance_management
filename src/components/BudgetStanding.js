'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import './BudgetStanding.css';

export default function BudgetStanding({ budgets }) {
    const overBudget = budgets.filter(b => b.spent > b.limit);

    return (
        <div className="budget-standing glass">
            <div className="widget-header">
                <h3>Budget Standing</h3>
                <span className="badge">{overBudget.length === 0 ? 'Healthy' : 'Attention'}</span>
            </div>

            <div className="standing-list">
                {overBudget.length > 0 ? (
                    overBudget.map((b, i) => (
                        <div key={i} className="standing-item warning">
                            <AlertCircle size={18} />
                            <div className="standing-info">
                                <span>{b.category}</span>
                                <p>${b.spent - b.limit} over limit</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="standing-item success">
                        <CheckCircle size={18} />
                        <div className="standing-info">
                            <span>All Budgets</span>
                            <p>You're on track this month!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
