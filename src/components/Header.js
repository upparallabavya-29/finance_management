'use client';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './Header.css';

export default function Header({ onMenuClick }) {
    const { user } = useAuth();

    return (
        <header className="header glass">
            <div className="header-left">
                <button className="menu-btn" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search transactions..." />
                </div>
            </div>

            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="user-profile">
                    <div className="avatar">{user?.avatar || 'U'}</div>
                    <div className="user-info">
                        <span className="username">{user?.name || 'User'}</span>
                        <span className="user-role">Premium</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
