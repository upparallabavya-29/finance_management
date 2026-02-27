'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import './TransactionTable.css';

export default function TransactionTable() {
    const { transactions, deleteTransaction } = useTransactions();
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filter logic
    const filteredTransactions = transactions.filter(tx =>
        tx.description.toLowerCase().includes(filter.toLowerCase()) ||
        tx.category.toLowerCase().includes(filter.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="transaction-table-container glass">
            <div className="table-header">
                <h3>Transactions History</h3>
                <div className="filter-wrapper">
                    <Filter size={18} className="filter-icon" />
                    <input
                        type="text"
                        placeholder="Filter by description or category..."
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                    <td>
                                        <span className="category-tag">{tx.category}</span>
                                    </td>
                                    <td>
                                        <span className={`type-tag ${tx.type}`}>
                                            {tx.type === 'income' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={tx.type === 'income' ? 'text-success' : 'text-danger'}>
                                        {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteTransaction(tx.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="page-btn"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="page-btn"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
