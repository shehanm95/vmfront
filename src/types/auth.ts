// src/types/auth.ts
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}