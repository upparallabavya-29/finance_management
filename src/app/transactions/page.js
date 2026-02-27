'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import './transactions.css';

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="transactions-page">
            <div className="page-header">
                <div>
                    <h2>Transactions</h2>
                    <p className="subtitle">Manage and track your financial activity</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            <TransactionTable />

            {isModalOpen && (
                <AddTransactionModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}
