import apiClient from '../lib/api';
import type { LoginRequest, SignupRequest, AuthResponse, RefreshTokenResponse } from '../types';

export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Refresh Token으로 Access Token 재발급
  // httpOnly 쿠키에 refreshToken이 있으면 자동으로 전송됨
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
  },

  // 현재 사용자 정보 조회
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

