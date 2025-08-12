import React, { useState, useEffect } from 'react';
import { authService } from '../firebase/authService';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Escuchar cambios en el estado de autenticación
        const unsubscribe = authService.onAuthStateChange(async (user) => {
            if (user) {
                // Verificar si es un administrador válido
                const isAdmin = await authService.isValidAdmin();
                if (isAdmin) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                } else {
                    // No es admin, cerrar sesión
                    await authService.signOutAdmin();
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        // Cleanup
        return () => unsubscribe();
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Verificando autenticación...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {!isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} />
            ) : (
                <AdminDashboard user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    );
};

export default AdminPage;
