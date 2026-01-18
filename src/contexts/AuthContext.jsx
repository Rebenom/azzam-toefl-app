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
            // First check localStorage for quick restore
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
            // Call the register endpoint to validate credentials
            // Since we don't have a direct login endpoint in the simple setup,
            // we'll check if user exists and validate password server-side

            // For now, we'll simulate by checking against known users
            // In production, this would call a proper login API
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Fallback: use local validation for demo
                const validUsers = [
                    { email: 'admin@toefl.com', password: 'admin123', name: 'Admin', role: 'ADMIN' },
                    { email: 'user@toefl.com', password: 'user123', name: 'Test User', role: 'USER' },
                ];

                const foundUser = validUsers.find(u => u.email === email && u.password === password);

                if (!foundUser) {
                    throw new Error('Email atau password salah');
                }

                const userData = {
                    id: Date.now().toString(),
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                };

                setUser(userData);
                localStorage.setItem('toefl_user', JSON.stringify(userData));
                return userData;
            }

            const data = await response.json();
            setUser(data.data);
            localStorage.setItem('toefl_user', JSON.stringify(data.data));
            return data.data;
        } catch (err) {
            // Fallback for demo purposes
            const validUsers = [
                { email: 'admin@toefl.com', password: 'admin123', name: 'Admin', role: 'ADMIN' },
                { email: 'user@toefl.com', password: 'user123', name: 'Test User', role: 'USER' },
            ];

            const foundUser = validUsers.find(u => u.email === email && u.password === password);

            if (!foundUser) {
                setError('Email atau password salah');
                throw new Error('Email atau password salah');
            }

            const userData = {
                id: Date.now().toString(),
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
            };

            setUser(userData);
            localStorage.setItem('toefl_user', JSON.stringify(userData));
            return userData;
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
