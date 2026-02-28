import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Extract display name
    const displayName = user?.email ? user.email.split('@')[0] : 'User';
    const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="relative z-50 h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 backdrop-blur-sm">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transactions, budgets..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-6">
                {/* Notification */}
                <button className="relative p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050510]"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-white/10"></div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                        className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                            <img
                                src={`https://ui-avatars.com/api/?name=${capitalizedName}&background=3b82f6&color=fff`}
                                alt="Avatar"
                                className="w-full h-full object-cover opacity-80"
                            />
                        </div>
                        <div className="hidden sm:block text-left mr-1">
                            <p className="text-[14px] font-bold text-white leading-tight">{capitalizedName}</p>
                            <p className="text-[11px] text-gray-500">Premium Plan</p>
                        </div>
                        <ChevronDown className={clsx("w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-transform duration-200", isProfileOpen && "rotate-180")} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-white truncate">{user?.email || 'user@example.com'}</p>
                            </div>

                            <div className="py-1">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <User className="w-4 h-4 text-gray-500" />
                                    Your Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <SettingsIcon className="w-4 h-4 text-gray-500" />
                                    Settings
                                </button>
                            </div>

                            <div className="h-px bg-white/5 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
