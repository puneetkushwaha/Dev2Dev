import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AITeacherWidget from './AITeacherWidget';

const AuthLayout = () => {
    // Simple auth check. If token exists, user is logged in.
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render the original app layout (with Navbar and AI Widget) for protected routes
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <AITeacherWidget />
        </div>
    );
};

export default AuthLayout;
