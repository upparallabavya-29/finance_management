'use client';

import { Plus } from 'lucide-react';
import SavingsGoalCard from '@/components/SavingsGoalCard';
import { goals } from '@/lib/data';
import './goals.css';

export default function GoalsPage() {
    return (
        <div className="goals-page">
            <div className="page-header">
                <div>
                    <h2>Savings Goals</h2>
                    <p className="subtitle">Track your progress towards financial targets</p>
                </div>
                <button className="btn-primary">
                    <Plus size={20} />
                    <span>Add Goal</span>
                </button>
            </div>

            <div className="goals-grid">
                {goals.map(goal => (
                    <SavingsGoalCard key={goal.id} goal={goal} />
                ))}

                {/* Empty State / Add New Placeholder */}
                <div className="add-goal-card glass glass-hover">
                    <div className="add-icon">
                        <Plus size={32} />
                    </div>
                    <span>Create New Goal</span>
                </div>
            </div>
        </div>
    );
}
