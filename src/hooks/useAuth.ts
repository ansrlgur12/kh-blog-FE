import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';

/**
 * 앱 시작 시 인증 상태 복원
 * - refreshToken으로 accessToken 재발급
 * - getMe()로 user 정보 가져오기
 */
export function useAuth() {
  const { accessToken, setAuth } = useAuthStore();

  useEffect(() => {
    // 이미 accessToken이 있으면 스킵 (이미 로그인된 상태)
    if (accessToken) {
      return;
    }

    // refreshToken으로 accessToken 재발급 시도
    const restoreAuth = async () => {
      try {
        // 1. refreshToken으로 accessToken 재발급
        const refreshResponse = await authApi.refreshToken();
        
        // 2. getMe()로 user 정보 가져오기
        const userResponse = await authApi.getMe();
        
        // 3. accessToken + user 정보 함께 저장
        setAuth(refreshResponse.accessToken, userResponse.user || userResponse);
      } catch (error) {
        // refreshToken이 없거나 만료된 경우 (로그인하지 않은 상태)
        // 아무것도 하지 않음 (로그인 페이지로 리다이렉트하지 않음)
        console.log('인증 정보 복원 실패 (로그인 필요)');
      }
    };

    restoreAuth();
  }, [accessToken, setAuth]);
}

