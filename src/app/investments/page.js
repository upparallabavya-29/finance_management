'use client';

import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { investments } from '@/lib/data';
import './investments.css';

export default function InvestmentsPage() {
    const totalValue = investments.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="investments-page">
            <div className="page-header">
                <div>
                    <h2>Investment Portfolio</h2>
                    <p className="subtitle">Monitor your asset performance</p>
                </div>
                <div className="portfolio-summary glass">
                    <span>Total Value</span>
                    <h3>${totalValue.toLocaleString()}</h3>
                </div>
            </div>

            <div className="investments-grid">
                {investments.map(inv => {
                    const isPositive = inv.change >= 0;
                    return (
                        <div key={inv.id} className="investment-card glass glass-hover">
                            <div className="inv-header">
                                <div>
                                    <h4>{inv.name}</h4>
                                    <span className="inv-type">{inv.type}</span>
                                </div>
                                <div className={`change-badge ${isPositive ? 'up' : 'down'}`}>
                                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {Math.abs(inv.change)}%
                                </div>
                            </div>

                            <div className="inv-value">
                                <span>Current Value</span>
                                <span className="amount">${inv.value.toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="glass chart-placeholder">
                <div className="placeholder-content">
                    <PieChart size={48} color="var(--text-muted)" />
                    <p>Portfolio Distribution Chart Placeholder</p>
                </div>
            </div>
        </div>
    );
}
