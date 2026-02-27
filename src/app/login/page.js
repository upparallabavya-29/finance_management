'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <div className="logo-icon">
                        <Wallet size={32} color="var(--primary)" />
                    </div>
                    <h1>FinanceFlow</h1>
                    <p>Sign in to manage your wealth</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <Mail size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        <span>Sign In</span>
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link href="/register" className="link">Create one</Link></p>
                </div>
            </div>
        </div>
    );
}
