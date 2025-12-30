import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token validity by fetching user profile or just assume valid for now
                    // Ideally backend has /me endpoint, but for now we'll just set a flag or keep logic simple
                    // If 401 happens, interceptor handles it (future TODO)

                    // For now, let's assume if token exists, we are logged in.
                    // In a real app, we'd validate against /users/me
                    setUser({ username: 'Admin' }); // Placeholder user
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        // Note: Backend endpoint is /login/access-token and expects form-data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await api.post('/login/access-token', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setUser({ username });
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
