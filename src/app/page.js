'use client';

import SummaryCard from '@/components/SummaryCard';
import OverviewChart from '@/components/OverviewChart';
import RecentTransactions from '@/components/RecentTransactions';
import BudgetStanding from '@/components/BudgetStanding';
import SavingsMilestones from '@/components/SavingsMilestones';
import UpcomingPayments from '@/components/UpcomingPayments';
import { Wallet, PieChart, TrendingUp, PiggyBank } from 'lucide-react';
import { monthlyData, bills } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import './dashboard.css';

export default function Dashboard() {
  const { transactions, loading: transLoading } = useTransactions();
  const [data, setData] = useState({
    budgets: [],
    goals: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        const [budgetRes, goalRes] = await Promise.all([
          fetch('http://localhost:5000/api/budgets'),
          fetch('http://localhost:5000/api/goals')
        ]);

        const budgetData = await budgetRes.json();
        const goalData = await goalRes.json();

        setData({
          budgets: budgetData.success ? budgetData.data : [],
          goals: goalData.success ? goalData.data : [],
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setData(prev => ({ ...prev, loading: false, error: 'Failed to load data' }));
      }
    };

    fetchOtherData();
  }, []);

  const totalBalance = transactions.reduce((acc, curr) =>
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSavings = data.goals.reduce((acc, curr) => acc + (curr.current_amount || 0), 0);

  if (data.loading || transLoading) return <div className="loading-container">Loading Dashboard...</div>;

  return (
    <div className="dashboard-grid">
      <div className="summary-section">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          trend={2.5}
          trendType="up"
          icon={Wallet}
          color="#8b5cf6"
        />
        <SummaryCard
          title="Monthly Income"
          amount={monthlyIncome}
          trend={5.0}
          trendType="up"
          icon={TrendingUp}
          color="#10b981"
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={monthlyExpenses}
          trend={-1.2}
          trendType="down"
          icon={PieChart}
          color="#ec4899"
        />
        <SummaryCard
          title="Total Savings"
          amount={totalSavings}
          trend={3.8}
          trendType="up"
          icon={PiggyBank}
          color="#f59e0b"
        />
      </div>

      <div className="dashboard-main-content">
        <div className="content-left">
          <div className="chart-wrapper">
            <OverviewChart data={monthlyData} />
          </div>
          <div className="transactions-wrapper">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        <div className="content-right">
          <BudgetStanding budgets={data.budgets} />
          <SavingsMilestones goals={data.goals} />
          <UpcomingPayments bills={bills} />
        </div>
      </div>
    </div>
  );
}
