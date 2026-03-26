import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            setUser(data);
            return data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error or server unreachable' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', userData);
            setUser(data);
            return data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error or server unreachable' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
