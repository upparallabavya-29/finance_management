'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, PiggyBank, PieChart, CreditCard, Settings, LogOut, Receipt, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import './Sidebar.css';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budget', href: '/budget', icon: Wallet },
    { name: 'Goals', href: '/goals', icon: PiggyBank },
    { name: 'Bills', href: '/bills', icon: Receipt },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: PieChart },
];

export default function Sidebar({ isOpen }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <motion.aside
            initial={false}
            animate={{ x: 0 }}
            className={`sidebar ${isOpen ? 'mobile-open' : ''}`}
        >
            <div className="sidebar-header">
                <div className="logo-icon">
                    <Wallet size={28} color="var(--primary)" />
                </div>
                <h1 className="logo-text">Finance<span style={{ color: 'var(--primary)' }}>Flow</span></h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
                <div className="nav-item logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </motion.aside>
    );
}
