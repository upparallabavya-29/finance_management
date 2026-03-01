import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-management-0cu9.onrender.com/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Attach token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me')
}

export const transactionService = {
    getTransactions: () => api.get('/transactions'),
    createTransaction: (data) => api.post('/transactions', data),
    updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
    deleteTransaction: (id) => api.delete(`/transactions/${id}`)
}

export const budgetService = {
    getBudgets: () => api.get('/budgets'),
    createBudget: (data) => api.post('/budgets', data),
    updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
    deleteBudget: (id) => api.delete(`/budgets/${id}`)
}

export const goalService = {
    getGoals: () => api.get('/goals'),
    createGoal: (data) => api.post('/goals', data),
    updateGoal: (id, data) => api.put(`/goals/${id}`, data),
    deleteGoal: (id) => api.delete(`/goals/${id}`)
}

export default api
