import {
    LayoutDashboard,
    Wallet,
    PiggyBank,
    PieChart,
    CreditCard,
    Settings,
    LogOut,
    Receipt,
    TrendingUp,
    Zap,
    Wifi,
    Home,
    ShoppingBag,
    Music,
    Utensils,
    HeartPulse,
    Bus
} from 'lucide-react';

export const CategoryIcons = {
    Groceries: ShoppingBag,
    Entertainment: Music,
    Transportation: Bus,
    Housing: Home,
    Food: Utensils,
    Utilities: Zap,
    Health: HeartPulse,
    Income: TrendingUp,
    Other: CreditCard
};

export const BillIcons = {
    Zap,
    Wifi,
    Home,
    CreditCard
};

export const NavIcons = {
    Dashboard: LayoutDashboard,
    Transactions: CreditCard,
    Budget: Wallet,
    Goals: PiggyBank,
    Bills: Receipt,
    Investments: TrendingUp,
    Reports: PieChart,
    Settings,
    Logout: LogOut
};
