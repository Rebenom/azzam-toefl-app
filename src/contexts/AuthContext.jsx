import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const savedUser = localStorage.getItem('toefl_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error('Auth check failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setError(null);
        setLoading(true);

        try {
            // Use API client with Netlify proxy
            const response = await api.login(email, password);

            if (!response.success) {
                throw new Error(response.error || 'Login gagal');
            }

            const userData = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
            };

            setUser(userData);
            localStorage.setItem('toefl_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError(err.message || 'Email atau password salah');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        setLoading(true);

        try {
            const response = await api.register(name, email, password);

            const userData = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
            };

            setUser(userData);
            localStorage.setItem('toefl_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError(err.message || 'Registrasi gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('toefl_user');
        localStorage.removeItem('toefl_test_state');
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
