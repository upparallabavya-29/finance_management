import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    // Extract display name
    const displayName = user?.email ? user.email.split('@')[0] : 'User';
    const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    return (
        <div className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 backdrop-blur-sm z-30">
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
                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all group">
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
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
