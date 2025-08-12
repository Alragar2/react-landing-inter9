import React, { useState } from 'react';
import { authService } from '../firebase/authService';
import '../css/admin-login.css';

const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error al escribir
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await authService.signInAdmin(credentials.email, credentials.password);

            if (result.success) {
                // Verificar si es un administrador válido
                const isAdmin = await authService.isValidAdmin();
                if (isAdmin) {
                    onLogin(result.user);
                } else {
                    setError('No tienes permisos de administrador');
                    await authService.signOutAdmin();
                }
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error inesperado al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!credentials.email) {
            setError('Ingresa tu email para recuperar la contraseña');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.resetPassword(credentials.email);
            if (result.success) {
                alert('Se ha enviado un email de recuperación a tu dirección de correo');
                setShowResetPassword(false);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error al enviar email de recuperación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2>Acceso Administrativo</h2>
                    <p>Campus de Verano Inter9 - Gestión de Inscripciones</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            placeholder="Ingrese su email de administrador"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="Ingrese su contraseña"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Verificando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                Iniciar Sesión
                            </>
                        )}
                    </button>

                    <button 
                        type="button" 
                        className="reset-password-btn"
                        onClick={handleResetPassword}
                        disabled={isLoading}
                    >
                        <i className="fas fa-key"></i>
                        ¿Olvidaste tu contraseña?
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>
                        <i className="fas fa-shield-alt"></i>
                        Acceso solo para usuarios autorizados en Firebase
                    </p>
                    <small>
                        Solo las cuentas creadas por el administrador pueden acceder
                    </small>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
