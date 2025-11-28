import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  // Access Token은 메모리에만 저장 (XSS 방지)
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // 액션들
  setAuth: (accessToken: string, user: User) => void; // 로그인/회원가입 시 사용
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  accessToken: null,
  user: null,
  isAuthenticated: false,
  
  // 로그인/회원가입 성공 시 호출 (accessToken + user 함께 저장)
  setAuth: (accessToken: string, user: User) => {
    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },
  
  
  // 로그아웃 시 호출
  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

