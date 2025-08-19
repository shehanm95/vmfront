// src/services/authService.ts
import { AxiosError } from 'axios';
import { AuthResponse, LoginCredentials } from '../types/auth';
import api from '../api/axios';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/api/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log("loged in");

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Login failed:', axiosError.response?.data || axiosError.message);
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
};