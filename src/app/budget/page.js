'use client';

import { Plus, Settings } from 'lucide-react';
import BudgetCard from '@/components/BudgetCard';
import { useState, useEffect } from 'react';
import './budget.css';

export default function BudgetPage() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/budgets');
                const result = await response.json();
                if (result.success) {
                    setBudgets(result.data);
                }
            } catch (error) {
                console.error('Error fetching budgets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, []);

    if (loading) return <div className="loading-container">Loading Budgets...</div>;

    return (
        <div className="budget-page">
            <div className="page-header">
                <div>
                    <h2>Monthly Budget</h2>
                    <p className="subtitle">Manage spending limits per category</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <button className="btn-primary">
                        <Plus size={20} />
                        <span>New Budget</span>
                    </button>
                </div>
            </div>

            <div className="budget-grid">
                {budgets.map((budget, index) => (
                    <BudgetCard key={index} budget={budget} />
                ))}
            </div>
        </div>
    );
}
