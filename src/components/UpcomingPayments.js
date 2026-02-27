'use client';

import { Clock, Calendar } from 'lucide-react';
import './UpcomingPayments.css';

export default function UpcomingPayments({ bills }) {
    const pendingBills = bills.filter(b => b.status !== 'Paid').slice(0, 3);

    return (
        <div className="upcoming-payments glass">
            <div className="widget-header">
                <h3>Upcoming Bills</h3>
                <Clock size={18} color="var(--primary)" />
            </div>

            <div className="payments-list">
                {pendingBills.length > 0 ? (
                    pendingBills.map((bill, i) => (
                        <div key={i} className="payment-item">
                            <div className="payment-icon">
                                <Calendar size={16} />
                            </div>
                            <div className="payment-details">
                                <span className="pay-name">{bill.name}</span>
                                <span className="pay-date">Due {bill.dueDate}</span>
                            </div>
                            <span className="pay-amount">${bill.amount}</span>
                        </div>
                    ))
                ) : (
                    <p className="no-payments">No upcoming bills!</p>
                )}
            </div>
        </div>
    );
}
