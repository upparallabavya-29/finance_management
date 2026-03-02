import React, { useState, useEffect } from 'react';
import { goalService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Target, Calendar } from 'lucide-react';

const Goals = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchGoals = async () => {
        try {
            const res = await goalService.getGoals();
            setGoals(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // goalService expects: name, target_amount, deadline, user_id
            await goalService.createGoal({
                name,
                target_amount: parseFloat(targetAmount),
                deadline,
                user_id: user?.id
            });

            // Reset form and close modal
            setName('');
            setTargetAmount('');
            setDeadline('');
            setIsModalOpen(false);

            // Refresh goals list
            fetchGoals();
        } catch (err) {
            console.error('Failed to create goal:', err);
            setError(err.response?.data?.message || 'Failed to create goal');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Savings Goals</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Track your progress toward your financial dreams.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Goal
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-slate-900 shadow rounded-xl p-8 text-center border border-dashed border-slate-300 dark:border-white/10">
                            <Target className="w-12 h-12 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-1">No savings goals yet</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">Create your first goal to start tracking your progress.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                            >
                                + Create a Goal
                            </button>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const progress = goal.target_amount > 0 ? ((goal.current_amount || 0) / goal.target_amount) * 100 : 0;

                            return (
                                <div key={goal.id} className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{goal.name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 mt-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Target: {new Date(goal.deadline).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <div className="flex justify-between text-sm font-semibold">
                                            <span className="text-slate-700 dark:text-gray-300">${goal.current_amount || 0}</span>
                                            <span className="text-slate-500 dark:text-gray-500">/ ${goal.target_amount}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(100, progress)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-right text-slate-500 dark:text-gray-400 font-medium">
                                            {progress.toFixed(1)}% Completed
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* Create Goal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Savings Goal</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Goal Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. New Car, Vacation"
                                    className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Target Amount ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Target Deadline</label>
                                <input
                                    type="date"
                                    required
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-gray-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        'Create Goal'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
