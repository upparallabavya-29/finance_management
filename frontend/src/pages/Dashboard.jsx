import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Target,
    MoreVertical,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { transactionService, budgetService } from '../services/api';

// Summary Card Component
const SummaryCard = ({ title, amount, change, icon: Icon, color, glowColor, onHide, onViewDetails, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass-card rounded-[24px] p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40`} style={{ backgroundColor: glowColor }}></div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                        className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => onViewDetails && onViewDetails(title)}
                                onMouseDown={(e) => e.preventDefault()}
                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => onEdit && onEdit(title)}
                                onMouseDown={(e) => e.preventDefault()}
                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                Edit Widget
                            </button>
                            <div className="h-px bg-white/5 my-1"></div>
                            <button
                                onClick={() => onHide && onHide(title)}
                                onMouseDown={(e) => e.preventDefault()}
                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                                Hide
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-1 z-10 relative">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 tracking-wider uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">${amount}</h3>
                <div className="flex items-center gap-1.5 pt-1">
                    <span className={`text-[13px] font-bold ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {change}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">from last month</span>
                </div>
            </div>
        </div>
    );
};

// Chart Container Component
const ChartWrapper = ({ title, children, subtitle, activeFilter = 'M', onFilterChange }) => (
    <div className="glass-card rounded-[24px] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {onFilterChange && (
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                    {['W', 'M', 'Y'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${activeFilter === filter
                                ? 'bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/20'
                                : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white border border-transparent'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <div className="flex-1 min-h-[220px]">
            {children}
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Chart Filter States
    const [trendFilter, setTrendFilter] = useState('M');
    const [categoryFilter, setCategoryFilter] = useState('M');

    const [txs, setTxs] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txRes, budgetRes] = await Promise.all([
                    transactionService.getTransactions().catch(() => ({ data: { data: [] } })),
                    budgetService.getBudgets().catch(() => ({ data: { data: [] } }))
                ]);
                setTxs(txRes.data?.data || []);
                setBudgets(budgetRes.data?.data || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const totalExpenses = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const netSavings = totalIncome - totalExpenses;

    const summaries = [
        { title: 'Total Income', amount: totalIncome.toFixed(2), change: '+0.0%', icon: ArrowUpRight, color: 'text-emerald-400', glowColor: '#10b981' },
        { title: 'Total Expenses', amount: totalExpenses.toFixed(2), change: '-0.0%', icon: ArrowDownRight, color: 'text-rose-400', glowColor: '#ef4444' },
        { title: 'Net Savings', amount: netSavings.toFixed(2), change: '+0.0%', icon: Wallet, color: 'text-blue-400', glowColor: '#3b82f6' },
        { title: 'Portfolio Value', amount: '0.00', change: '+0.0%', icon: TrendingUp, color: 'text-purple-400', glowColor: '#8b5cf6' },
    ];

    // Compute basic trend purely based on existing txs
    // Real implementation would group by month, simplified here to just current txs grouped roughly by name
    const monthlyData = txs.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
        if (t.type === 'income') acc[month].income += parseFloat(t.amount);
        if (t.type === 'expense') acc[month].expense += parseFloat(t.amount);
        return acc;
    }, {});
    const trendData = Object.values(monthlyData).length > 0 ? Object.values(monthlyData) : [
        { name: 'Jan', income: 0, expense: 0 }, { name: 'Feb', income: 0, expense: 0 }
    ];

    const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
    const catDataMap = txs.filter(t => t.type === 'expense').reduce((acc, t) => {
        const catName = t.categories?.name || 'Unknown';
        acc[catName] = (acc[catName] || 0) + parseFloat(t.amount);
        return acc;
    }, {});

    const categoryData = Object.entries(catDataMap).map(([name, value], idx) => ({
        name, value, color: categoryColors[idx % categoryColors.length]
    }));

    if (categoryData.length === 0) {
        categoryData.push({ name: 'No Expenses', value: 100, color: '#94a3b8' });
    }

    const budgetData = budgets.map(b => ({
        name: b.categories?.name || 'Budget',
        current: parseFloat(b.spent_amount || 0),
        total: parseFloat(b.amount || 0)
    }));

    if (budgetData.length === 0) {
        budgetData.push({ name: 'No Budgets', current: 0, total: 100 });
    }

    const handleHideCard = (title) => {
        alert(`Hidden ${title}`);
    };

    const handleViewDetails = (title) => {
        if (title.includes('Income') || title.includes('Expenses')) navigate('/transactions');
        else if (title.includes('Savings')) navigate('/goals');
        else navigate('/investments');
    };

    const handleEditWidget = (title) => {
        alert(`Opening edit settings for ${title}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Welcome, {user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User')}
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Manage your wealth and track your financial growth.</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2 transition-all">
                        <Calendar className="w-4 h-4" />
                        Custom Date
                    </button>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        + New Entry
                    </button>
                </div>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaries.map((s, idx) => (
                    <SummaryCard
                        key={idx}
                        {...s}
                        onHide={handleHideCard}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEditWidget}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-8">
                    <ChartWrapper
                        title="Income vs Expenses"
                        subtitle="Cash flow analysis"
                        activeFilter={trendFilter}
                        onFilterChange={setTrendFilter}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                <CartesianGrid vertical={false} stroke="#ffffff05" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ padding: '0px' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#incomeGradient)" />
                                <Area type="monotone" dataKey="expense" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#expenseGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Pie Chart Card */}
                <div className="lg:col-span-4">
                    <ChartWrapper
                        title="Expenses by Category"
                        activeFilter={categoryFilter}
                        onFilterChange={setCategoryFilter}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex-1 flex justify-center items-center">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value" stroke="none">
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {categoryData.map((c, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                                        <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ChartWrapper>
                </div>
            </div>

            {/* Bottom Section: Budget, Savings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
                {/* Budget Usage */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-card rounded-[24px] p-6 h-full flex flex-col cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition-colors" onClick={() => navigate('/budgets')}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Budget Usage</h3>
                            <button className="p-1 text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 min-h-[160px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetData}>
                                    <CartesianGrid vertical={false} stroke="#ffffff03" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                                    />
                                    <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="total" fill="rgba(148, 163, 184, 0.2)" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
