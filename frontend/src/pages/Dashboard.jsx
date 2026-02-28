import React, { useState } from 'react';
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

// Summary Card Component
const SummaryCard = ({ title, amount, change, icon: Icon, color, glowColor, onHide }) => {
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
                            <button className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                View Details
                            </button>
                            <button className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                Edit Widget
                            </button>
                            <div className="h-px bg-white/5 my-1"></div>
                            <button
                                onClick={() => onHide && onHide(title)}
                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                                Hide
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">${amount}</h3>
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
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {onFilterChange && (
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                    {['W', 'M', 'Y'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${activeFilter === filter
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                : 'text-gray-400 hover:text-white border border-transparent'
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

    // Summary Data
    const summaries = [
        { title: 'Total Income', amount: '12,450.00', change: '+12.5%', icon: ArrowUpRight, color: 'text-emerald-400', glowColor: '#10b981' },
        { title: 'Total Expenses', amount: '5,230.12', change: '-4.2%', icon: ArrowDownRight, color: 'text-rose-400', glowColor: '#ef4444' },
        { title: 'Net Savings', amount: '7,219.88', change: '+28.4%', icon: Wallet, color: 'text-blue-400', glowColor: '#3b82f6' },
        { title: 'Portfolio Value', amount: '48,295.50', change: '+5.2%', icon: TrendingUp, color: 'text-purple-400', glowColor: '#8b5cf6' },
    ];

    // Income vs Expense Chart Data
    const trendData = [
        { name: 'Jan', income: 4500, expense: 3200 },
        { name: 'Feb', income: 5200, expense: 3500 },
        { name: 'Mar', income: 4800, expense: 3100 },
        { name: 'Apr', income: 6100, expense: 3800 },
        { name: 'May', income: 5900, expense: 3400 },
        { name: 'Jun', income: 7200, expense: 4100 },
    ];

    // Expense Categories Chart Data
    const categoryData = [
        { name: 'Housing', value: 40, color: '#3b82f6' },
        { name: 'Food', value: 25, color: '#10b981' },
        { name: 'Transport', value: 15, color: '#f59e0b' },
        { name: 'Others', value: 20, color: '#8b5cf6' },
    ];

    // Budget Usage Data
    const budgetData = [
        { name: 'Dining', current: 450, total: 500 },
        { name: 'Shopping', current: 1200, total: 1000 },
        { name: 'Leisure', current: 300, total: 750 },
    ];

    // Recent Transactions
    const transactions = [
        { id: 1, desc: 'Apple Subscription', cat: 'Digital', date: '28 Feb 2026', amount: -14.99, status: 'Completed' },
        { id: 2, desc: 'Salary Deposit', cat: 'Income', date: '27 Feb 2026', amount: 4500.00, status: 'Completed' },
        { id: 3, desc: 'Whole Foods', cat: 'Groceries', date: '26 Feb 2026', amount: -245.20, status: 'Pending' },
        { id: 4, desc: 'Uber Ride', cat: 'Transport', date: '26 Feb 2026', amount: -32.50, status: 'Completed' },
    ];

    const handleHideCard = (title) => {
        alert(`Hidden ${title} (Implement state management for hiding)`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your wealth and track your financial growth.</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-all">
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
                    <SummaryCard key={idx} {...s} onHide={handleHideCard} />
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
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {categoryData.map((c, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                                        <span className="text-[11px] text-gray-400 font-medium">{c.name} ({c.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ChartWrapper>
                </div>
            </div>

            {/* Bottom Section: Budget, Savings & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
                {/* Budget Usage & Savings */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Bar Chart Budget Usage */}
                    <div className="glass-card rounded-[24px] p-6 h-full flex flex-col cursor-pointer hover:bg-white/[0.04] transition-colors" onClick={() => navigate('/budgets')}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Budget Usage</h3>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
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
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                    />
                                    <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="total" fill="#ffffff05" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Savings Goals */}
                    <div className="glass-card rounded-[24px] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Savings Goals</h3>
                            <button
                                onClick={() => navigate('/goals')}
                                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider bg-blue-500/10 px-3 py-1.5 rounded-lg"
                            >
                                Add Goal
                            </button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Emergency Fund', current: 15000, target: 20000, p: 75, color: 'bg-blue-500' },
                                { name: 'Vacation', current: 2250, target: 5000, p: 45, color: 'bg-emerald-500' },
                                { name: 'New Car', current: 12000, target: 40000, p: 30, color: 'bg-purple-500' },
                            ].map((goal, idx) => (
                                <div key={idx} className="space-y-2 cursor-pointer group" onClick={() => navigate('/goals')}>
                                    <div className="flex justify-between text-[13px] font-medium">
                                        <span className="text-gray-200 group-hover:text-blue-400 transition-colors">{goal.name}</span>
                                        <span className="text-gray-400">${goal.current.toLocaleString()} / <span className="text-gray-600">${goal.target.toLocaleString()}</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${goal.color} rounded-full transition-all duration-1000 group-hover:brightness-125`} style={{ width: `${goal.p}%` }}></div>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className={`text-[11px] font-bold ${goal.color.replace('bg-', 'text-')}`}>{goal.p}% Reach</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="lg:col-span-8">
                    <div className="glass-card rounded-[24px] h-full overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center text-left">
                            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                            <button
                                onClick={() => navigate('/transactions')}
                                className="text-[12px] font-bold text-gray-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5"
                            >
                                View All
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Transaction</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {transactions.map((t) => (
                                        <tr key={t.id} onClick={() => navigate('/transactions')} className="group hover:bg-white/[0.04] transition-colors cursor-pointer text-left">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-white/20 group-hover:text-blue-400 transition-colors">
                                                        <Wallet className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[14px] font-bold text-gray-200 group-hover:text-white transition-colors">{t.desc}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[11px] font-bold text-gray-400">{t.cat}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[13px] font-medium text-gray-500">{t.date}</span>
                                            </td>
                                            <td className={`px-6 py-4 text-right text-[14px] font-bold ${t.amount > 0 ? 'text-emerald-400 font-bold' : 'text-gray-200'}`}>
                                                {t.amount > 0 ? `+ $${t.amount.toFixed(2)}` : `- $${Math.abs(t.amount).toFixed(2)}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
