
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for "remembered" session (mock)
        const storedUser = localStorage.getItem('finance_flow_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        const mockUser = { email, name: 'Michael Jordan', avatar: 'MJ' };
        setUser(mockUser);
        localStorage.setItem('finance_flow_user', JSON.stringify(mockUser));
        router.push('/');
    };

    const register = (name, email, password) => {
        // Mock register logic
        const mockUser = { email, name, avatar: name.charAt(0) };
        setUser(mockUser);
        localStorage.setItem('finance_flow_user', JSON.stringify(mockUser));
        router.push('/');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('finance_flow_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
