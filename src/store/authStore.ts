import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  // Access Token은 메모리에만 저장 (XSS 방지)
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean; // 인증 상태 복원 중인지 추적
  
  // 액션들
  setAuth: (accessToken: string, user: User) => void; // 로그인/회원가입 시 사용
  setAccessToken: (accessToken: string) => void; // 토큰만 임시로 설정 (인증 복원 중 사용)
  clearAuth: () => void;
  setRestoring: (isRestoring: boolean) => void; // 인증 복원 상태 설정
  updateUser: (user: User) => void; // 사용자 정보 업데이트
}

export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isRestoring: false,
  
  // 로그인/회원가입 성공 시 호출 (accessToken + user 함께 저장)
  setAuth: (accessToken: string, user: User) => {
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isRestoring: false, // 복원 완료
    });
  },
  
  // 토큰만 임시로 설정 (인증 복원 중 getMe() 호출 전에 사용)
  setAccessToken: (accessToken: string) => {
    set({ accessToken });
  },
  
  // 로그아웃 시 호출
  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isRestoring: false,
    });
  },
  
  // 인증 복원 상태 설정
  setRestoring: (isRestoring: boolean) => {
    set({ isRestoring });
  },
  
  // 사용자 정보 업데이트
  updateUser: (user: User) => {
    set({ user });
  },
}));

