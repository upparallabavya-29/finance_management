import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-transparent font-sans antialiased overflow-hidden">
            {/* Sidebar is fixed on the left */}
            <Sidebar />

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Fixed Top Navbar */}
                <Navbar />

                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                    <div className="max-w-[1400px] mx-auto p-4 sm:p-8 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
