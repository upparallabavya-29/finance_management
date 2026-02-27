'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function MainLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const publicPaths = ['/login', '/register'];

    useEffect(() => {
        if (!loading && !user && !publicPaths.includes(pathname)) {
            router.push('/login');
        }
        if (!loading && user && publicPaths.includes(pathname)) {
            router.push('/');
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', background: 'var(--background)' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (publicPaths.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="app-container">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="main-content">
                <Header onMenuClick={toggleSidebar} />
                <main className="content-pad">
                    {children}
                </main>
            </div>
        </div>
    );
}
