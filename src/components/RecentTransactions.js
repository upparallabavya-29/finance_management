import { ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Home, Zap, MonitorPlay } from 'lucide-react';
import './RecentTransactions.css';

const categoryIcons = {
    'Groceries': ShoppingBag,
    'Housing': Home,
    'Transportation': Zap, // Using Zap as generic, could be Car
    'Entertainment': MonitorPlay,
    'Food': Coffee,
    'Income': ArrowDownRight, // Inbound
};

export default function RecentTransactions({ transactions }) {
    return (
        <div className="recent-transactions glass">
            <div className="section-header">
                <h3>Recent Transactions</h3>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="transaction-list">
                {transactions.slice(0, 5).map(tx => {
                    const Icon = categoryIcons[tx.category] || ShoppingBag;
                    const isExpense = tx.type === 'expense';

                    return (
                        <div key={tx.id} className="transaction-item">
                            <div className="tx-icon-wrapper" style={{
                                backgroundColor: isExpense ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: isExpense ? 'var(--danger)' : 'var(--success)'
                            }}>
                                <Icon size={20} />
                            </div>

                            <div className="tx-details">
                                <span className="tx-desc">{tx.description}</span>
                                <span className="tx-date">{tx.date}</span>
                            </div>

                            <div className={`tx-amount ${isExpense ? 'expense' : 'income'}`}>
                                {isExpense ? '-' : '+'}${tx.amount.toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
