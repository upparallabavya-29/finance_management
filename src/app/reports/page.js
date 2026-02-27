'use client';

import { Download, FileText } from 'lucide-react';
import './reports.css';
import { monthlyData } from '@/lib/data';

export default function ReportsPage() {
    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h2>Financial Reports</h2>
                    <p className="subtitle">View and export your financial summaries</p>
                </div>
                <button className="btn-primary" onClick={() => alert('Exporting report...')}>
                    <Download size={20} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="reports-grid">
                <div className="report-card glass">
                    <div className="report-header">
                        <h3>Monthly Summary</h3>
                        <FileText size={20} color="var(--primary)" />
                    </div>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Income</th>
                                <th>Expenses</th>
                                <th>Net Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((data) => (
                                <tr key={data.name}>
                                    <td>{data.name}</td>
                                    <td className="text-success">+${data.income.toLocaleString()}</td>
                                    <td className="text-danger">-${data.expense.toLocaleString()}</td>
                                    <td style={{ fontWeight: 600 }}>
                                        ${(data.income - data.expense).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
