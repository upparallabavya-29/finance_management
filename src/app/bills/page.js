'use client';

import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { bills } from '@/lib/data';
import './bills.css';

export default function BillsPage() {
    return (
        <div className="bills-page">
            <div className="page-header">
                <div>
                    <h2>Bill Reminders</h2>
                    <p className="subtitle">Track upcoming payments and due dates</p>
                </div>
            </div>

            <div className="bills-list glass">
                {bills.map(bill => (
                    <div key={bill.id} className="bill-item">
                        <div className="bill-info">
                            <div className="bill-icon">
                                <Calendar size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <h4>{bill.name}</h4>
                                <span className="due-date">Due: {bill.dueDate}</span>
                            </div>
                        </div>

                        <div className="bill-status-row">
                            <span className="bill-amount">${bill.amount.toFixed(2)}</span>
                            <span className={`status-badge ${bill.status.toLowerCase()}`}>
                                {bill.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                {bill.status}
                            </span>
                        </div>

                        {bill.status !== 'Paid' && (
                            <button className="pay-btn">Pay Now</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
