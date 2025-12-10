import apiClient from '../lib/api';
import type { LoginRequest, SignupRequest, AuthResponse, RefreshTokenResponse, User, SignupResponse } from '../types';

export const authApi = {
    // 로그인
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // 회원가입
    signup: async (data: SignupRequest): Promise<SignupResponse> => {
        const response = await apiClient.post<SignupResponse>('/auth/register', data);
        return response.data;
    },

    // Refresh Token으로 Access Token 재발급
    // httpOnly 쿠키에 refreshToken이 있으면 자동으로 전송됨
    refreshToken: async (): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
        return response.data;
    },

    // 현재 사용자 정보 조회
    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    // 로그아웃
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

};

