import { useState, useEffect } from 'react';
import api from '../api/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // novi state za učitavanje

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error('Token invalid or expired', err);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message);
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
        } catch (err) {
            console.error('Register failed:', err.response?.data || err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return { user, token, loading, login, register, logout };
};
