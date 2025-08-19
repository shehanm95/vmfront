import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { mainUrl } from '../services/main';
import { UserDto } from '../types/UserDto';
import userService from '../services/userService';
import { Utils } from '../frontServices/Utils';

// Create Axios instance
const api: AxiosInstance = axios.create({
    baseURL: mainUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT payload interface
interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    role?: string;
}

// Extend Axios config to include custom flags
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
}

// Logout utility
export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
};

let current_user: UserDto | null | undefined = null;

export const getCurrentUser = async (): Promise<UserDto | undefined | null> => {
    if (!current_user) {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return undefined; // Return null if no token exists
        }

        try {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            const email: string = decoded.sub;
            current_user = await userService.getUserByEmail(email);
            Utils.setUser(current_user)
        } catch (error) {
            console.error('Error decoding token or fetching user:', error);
            current_user = undefined; // Reset on error
        }
    }
    console.log(current_user);
    return current_user;
};

// Get role from localStorage
export const getRole = (): string => {
    const role = localStorage.getItem('userRole') || 'GUEST';
    console.log('Retrieved role:', role);
    return role;
};

// Request interceptor: attach access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;


        if (error.config?.url?.includes('/auth/refresh')) {
            console.error('Refresh token invalid or expired. Logging out.');
            toast.error('Session expired. Please log in again.');
            logout();
            return Promise.reject(error);
        }

        // Handle 401 due to expired access token
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            localStorage.getItem('refreshToken')
        ) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            // Optional: prevent retry storms
            if (originalRequest._retryCount > 3) {
                console.warn('Max retry attempts reached.');
                toast.error('Session expired. Please log in again.');
                logout();
                return Promise.reject(error);
            }

            try {
                const refreshToken = localStorage.getItem('refreshToken')!;
                const { data } = await api.post<{
                    accessToken: string;
                    refreshToken: string;
                }>('/auth/refresh', { refreshToken });

                // Save new tokens
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);


                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.set(
                        'Authorization',
                        `Bearer ${data.accessToken}`
                    );
                }

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                toast.error('Session expired. Please log in again.');
                logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
