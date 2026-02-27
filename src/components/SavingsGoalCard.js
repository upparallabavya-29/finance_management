import { Calendar, Target } from 'lucide-react';
import './SavingsGoalCard.css';

export default function SavingsGoalCard({ goal }) {
    const { name, target, current, deadline, color } = goal;
    const progress = Math.min((current / target) * 100, 100);
    const remaining = target - current;

    return (
        <div className="savings-card glass glass-hover">
            <div className="card-header-row">
                <div className="goal-icon" style={{ backgroundColor: `${color}20`, color: color }}>
                    <Target size={24} />
                </div>
                <div className="goal-info">
                    <h3>{name}</h3>
                    <span className="deadline">
                        <Calendar size={12} /> {deadline}
                    </span>
                </div>
            </div>

            <div className="amount-row">
                <span className="current">${current.toLocaleString()}</span>
                <span className="target"> / ${target.toLocaleString()}</span>
            </div>

            <div className="progress-container">
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%`, backgroundColor: color }}
                    ></div>
                </div>
                <div className="progress-label">
                    <span>{progress.toFixed(0)}%</span>
                    <span>${remaining.toLocaleString()} left</span>
                </div>
            </div>
        </div>
    );
}
