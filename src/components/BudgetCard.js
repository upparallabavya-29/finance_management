import './BudgetCard.css';

export default function BudgetCard({ budget }) {
    const { category, limit, spent, color } = budget;
    const progress = Math.min((spent / limit) * 100, 100);
    const remaining = limit - spent;
    const isOverBudget = spent > limit;

    return (
        <div className="budget-card glass glass-hover">
            <div className="budget-header">
                <span className="category-name">{category}</span>
                <span className={`budget-status ${isOverBudget ? 'danger' : 'safe'}`}>
                    {isOverBudget ? 'Over Budget' : 'On Track'}
                </span>
            </div>

            <div className="budget-amount">
                <span className="spent">${spent.toLocaleString()}</span>
                <span className="limit"> / ${limit.toLocaleString()}</span>
            </div>

            <div className="budget-progress">
                <div className="progress-bg">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: isOverBudget ? 'var(--danger)' : color
                        }}
                    ></div>
                </div>
            </div>

            <div className="budget-footer">
                <span>{Math.round(progress)}% Used</span>
                <span>${isOverBudget ? Math.abs(remaining).toLocaleString() + ' over' : remaining.toLocaleString() + ' left'}</span>
            </div>
        </div>
    );
}
