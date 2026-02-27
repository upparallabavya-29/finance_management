'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { transactions as initialTransactions } from '@/lib/data'; // Ensure this path is correct

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/transactions');
                const result = await response.json();
                if (result.success) {
                    setTransactions(result.data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const addTransaction = async (transaction) => {
        try {
            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });
            const result = await response.json();
            if (result.success) {
                setTransactions(prev => [result.data, ...prev]);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                setTransactions(prev => prev.filter(tx => tx.id !== id));
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, loading }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    return useContext(TransactionContext);
}
