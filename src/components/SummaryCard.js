import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './SummaryCard.css';

export default function SummaryCard({ title, amount, trend, trendType, icon: Icon, color }) {
    const isPositive = trendType === 'up';

    return (
        <div className="summary-card glass glass-hover">
            <div className="card-header">
                <div className="icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
                    <Icon size={24} />
                </div>
                <span className="card-title">{title}</span>
            </div>

            <div className="card-content">
                <div className="amount">${amount.toLocaleString()}</div>
                <div className={`trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{trend}% from last month</span>
                </div>
            </div>
        </div>
    );
}
