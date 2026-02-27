export const transactions = [
    { id: 1, date: '2023-11-25', description: 'Grocery Store', amount: 120.50, category: 'Groceries', type: 'expense' },
    { id: 2, date: '2023-11-24', description: 'Freelance Payment', amount: 1500.00, category: 'Income', type: 'income' },
    { id: 3, date: '2023-11-24', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense' },
    { id: 4, date: '2023-11-23', description: 'Gas Station', amount: 45.00, category: 'Transportation', type: 'expense' },
    { id: 5, date: '2023-11-22', description: 'Monthly Rent', amount: 1200.00, category: 'Housing', type: 'expense' },
    { id: 6, date: '2023-11-21', description: 'Dining Out', amount: 85.00, category: 'Food', type: 'expense' },
    { id: 7, date: '2023-11-20', description: 'Salary', amount: 3000.00, category: 'Income', type: 'income' },
    { id: 8, date: '2023-11-19', description: 'Apple Music', amount: 9.99, category: 'Entertainment', type: 'expense' },
    { id: 9, date: '2023-11-18', description: 'Starbucks', amount: 5.50, category: 'Food', type: 'expense' },
    { id: 10, date: '2023-11-17', description: 'Gym Membership', amount: 50.00, category: 'Health', type: 'expense' },
];

export const budgets = [
    { category: 'Groceries', limit: 500, spent: 320, color: 'var(--primary)' },
    { category: 'Entertainment', limit: 200, spent: 150, color: 'var(--secondary)' },
    { category: 'Transportation', limit: 300, spent: 180, color: 'var(--accent)' },
    { category: 'Housing', limit: 1200, spent: 1200, color: 'var(--warning)' },
    { category: 'Food', limit: 400, spent: 210, color: 'var(--success)' },
    { category: 'Health', limit: 100, spent: 50, color: '#f43f5e' },
];

export const goals = [
    { id: 1, name: 'Vacation Fund', target: 5000, current: 1500, deadline: '2024-06-01', color: '#ffb703' },
    { id: 2, name: 'New Laptop', target: 2000, current: 800, deadline: '2024-12-25', color: '#219ebc' },
    { id: 3, name: 'Emergency Fund', target: 10000, current: 4000, deadline: '2024-12-31', color: '#fb8500' },
    { id: 4, name: 'Engagement Ring', target: 3000, current: 500, deadline: '2025-02-14', color: '#ec4899' },
];

export const monthlyData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
];

export const bills = [
    { id: 1, name: 'Electric Bill', amount: 150, dueDate: '2023-11-05', status: 'Pending', icon: 'Zap' },
    { id: 2, name: 'Internet Provider', amount: 89.99, dueDate: '2023-11-12', status: 'Auto-Pay', icon: 'Wifi' },
    { id: 3, name: 'Rent', amount: 1200, dueDate: '2023-11-01', status: 'Paid', icon: 'Home' },
    { id: 4, name: 'Credit Card', amount: 450, dueDate: '2023-11-15', status: 'Pending', icon: 'CreditCard' },
];

export const investments = [
    { id: 1, name: 'S&P 500 ETF', type: 'Stock', value: 12500, change: 8.5 },
    { id: 2, name: 'Government Bonds', type: 'Bond', value: 5000, change: 2.1 },
    { id: 3, name: 'Tech Growth Fund', type: 'Mutual Fund', value: 8200, change: -1.4 },
    { id: 4, name: 'Crypto Holdings', type: 'Crypto', value: 3400, change: 12.8 },
];
