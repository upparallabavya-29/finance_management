'use client';

import { Trophy, Target } from 'lucide-react';
import './SavingsMilestones.css';

export default function SavingsMilestones({ goals }) {
    return (
        <div className="savings-milestones glass">
            <div className="widget-header">
                <h3>Savings Milestones</h3>
                <Trophy size={18} color="var(--warning)" />
            </div>

            <div className="milestones-list">
                {goals.map((goal, i) => (
                    <div key={i} className="milestone-item">
                        <div className="milestone-top">
                            <span className="goal-name">{goal.name}</span>
                            <span className="goal-percent">{Math.round((goal.current / goal.target) * 100)}%</span>
                        </div>
                        <div className="milestone-bar">
                            <div
                                className="progress"
                                style={{
                                    width: `${(goal.current / goal.target) * 100}%`,
                                    backgroundColor: goal.color
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="view-all-btn">
                <span>View all goals</span>
                <Target size={16} />
            </button>
        </div>
    );
}
