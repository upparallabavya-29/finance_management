import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'System');
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Apply theme immediately on change to index.html
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'System') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else if (theme === 'Dark Mode') {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }
    }, [theme]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate an API call
        setTimeout(() => {
            localStorage.setItem('theme', theme);
            localStorage.setItem('currency', currency);
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
        }, 800);
    };

    return (
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-top-4 z-50">
                    Settings saved successfully!
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Settings</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-gray-300 border-b dark:border-white/10 pb-2 mb-4">Profile Preferences</h3>
                    <p className="text-slate-500 dark:text-gray-400 mb-4 text-sm">Update your personal details and app preferences here.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Theme</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full border dark:border-white/10 rounded-lg p-2.5 text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            >
                                <option value="System">System (Default)</option>
                                <option value="Light Mode">Light Mode</option>
                                <option value="Dark Mode">Dark Mode</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full border dark:border-white/10 rounded-lg p-2.5 text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="mt-6 bg-blue-600 text-white px-6 py-2.5 text-sm font-bold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center min-w-[140px]"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
