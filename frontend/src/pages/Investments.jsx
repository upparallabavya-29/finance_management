import { useState, useEffect } from 'react';
import {
    Briefcase, Plus, Trash2, Edit2, TrendingUp, TrendingDown,
    PieChart as PieIcon, Database, Coins, Landmark
} from 'lucide-react';
import { investmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const Investments = () => {
    const { user } = useAuth();
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        asset_name: '',
        asset_type: 'Stocks',
        quantity: '',
        purchase_price: '',
        current_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            const { data } = await investmentService.getInvestments();
            setInvestments(data.data);
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await investmentService.createInvestment(formData);
            setIsModalOpen(false);
            setFormData({
                asset_name: '',
                asset_type: 'Stocks',
                quantity: '',
                purchase_price: '',
                current_price: '',
                purchase_date: new Date().toISOString().split('T')[0]
            });
            fetchInvestments();
        } catch (error) {
            console.error('Error creating investment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await investmentService.deleteInvestment(id);
                fetchInvestments();
            } catch (error) {
                console.error('Error deleting investment:', error);
            }
        }
    };

    const calculateTotals = () => {
        return investments.reduce((acc, inv) => {
            const invested = inv.quantity * inv.purchase_price;
            const current = inv.quantity * (inv.current_price || inv.purchase_price);
            acc.totalInvested += invested;
            acc.totalCurrent += current;
            return acc;
        }, { totalInvested: 0, totalCurrent: 0 });
    };

    const { totalInvested, totalCurrent } = calculateTotals();
    const totalProfitLoss = totalCurrent - totalInvested;
    const isProfit = totalProfitLoss >= 0;

    // Chart data
    const assetTypes = investments.reduce((acc, inv) => {
        acc[inv.asset_type] = (acc[inv.asset_type] || 0) + (inv.quantity * inv.current_price);
        return acc;
    }, {});

    const chartData = Object.entries(assetTypes).map(([name, value]) => ({ name, value }));
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Investment Portfolio
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your assets and performance in real-time</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 font-medium whitespace-nowrap"
                >
                    <Plus size={20} />
                    <span>Add Asset</span>
                </button>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invested</p>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{totalInvested.toLocaleString()}</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Value</p>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{totalCurrent.toLocaleString()}</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total P/L</p>
                    <div className="flex items-center gap-2 mt-1">
                        <h2 className={`text-3xl font-black ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isProfit ? '+' : ''}₹{totalProfitLoss.toLocaleString()}
                        </h2>
                        {isProfit ? <TrendingUp className="text-emerald-500" /> : <TrendingDown className="text-rose-500" />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Asset List */}
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : investments.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Briefcase className="text-slate-400 mx-auto mb-4" size={40} />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Empty Portfolio</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Start adding stocks, crypto, or other assets.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Asset</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Balance</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">P/L</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {investments.map((inv) => {
                                        const pl = (inv.current_price - inv.purchase_price) * inv.quantity;
                                        const plPct = ((inv.current_price - inv.purchase_price) / inv.purchase_price * 100).toFixed(2);
                                        return (
                                            <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-slate-900 dark:text-white">{inv.asset_name}</div>
                                                    <div className="text-xs text-slate-500">{inv.quantity} units</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                                                        {inv.asset_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="font-bold text-slate-900 dark:text-white">₹{(inv.quantity * inv.current_price).toLocaleString()}</div>
                                                    <div className="text-xs text-slate-500">₹{inv.current_price} per unit</div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className={`font-bold ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {pl >= 0 ? '+' : ''}₹{Math.abs(pl).toLocaleString()}
                                                    </div>
                                                    <div className={`text-[10px] font-bold ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {pl >= 0 ? '▲' : '▼'} {plPct}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDelete(inv.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Allocation Chart */}
                <div className="lg:col-span-4 h-fit">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm text-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Asset Allocation</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                            {chartData.map((entry, index) => (
                                <div key={entry.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {totalCurrent > 0 ? ((entry.value / totalCurrent) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full max-w-lg shadow-2xl border border-white/10 glass">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Asset</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Asset Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Reliance, BTC"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.asset_name}
                                        onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Type</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.asset_type}
                                        onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                                    >
                                        <option value="Stocks">Stocks</option>
                                        <option value="Crypto">Crypto</option>
                                        <option value="Mutual Funds">Mutual Funds</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Real Estate">Real Estate</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.0001"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Purchase Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.purchase_price}
                                        onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Current Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.current_price}
                                        onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-1">Purchase Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.purchase_date}
                                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
                                >
                                    Add Asset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Investments;
