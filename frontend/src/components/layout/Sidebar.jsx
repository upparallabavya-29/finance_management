import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowUpRight,
    PieChart,
    Target,
    CircleDollarSign,
    TrendingUp,
    FileBarChart,
    Settings,
    LogOut,
    Wallet
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Income & Expenses', href: '/transactions', icon: ArrowUpRight },
        { name: 'Budgets', href: '/budgets', icon: PieChart },
        { name: 'Savings Goals', href: '/goals', icon: Target },
        { name: 'Debts', href: '/debts', icon: CircleDollarSign },
        { name: 'Investments', href: '/investments', icon: TrendingUp },
        { name: 'Reports', href: '/reports', icon: FileBarChart },
        { name: 'Settings', href: '#', icon: Settings },
    ];

    return (
        <div className="w-[280px] glass-sidebar flex flex-col shrink-0 h-full">
            {/* Logo */}
            <div className="h-20 flex items-center px-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Finance<span className="text-blue-500">X</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                'group flex items-center px-4 py-3 text-[14px] font-medium transition-all duration-200 rounded-xl'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400',
                                    'mr-3.5 h-[18px] w-[18px] shrink-0 transition-colors duration-200'
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* User Account / Logout */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-[14px] font-medium text-gray-400 hover:text-white rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                    <LogOut className="mr-3.5 h-[18px] w-[18px]" />
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
