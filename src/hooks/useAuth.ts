import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';

const RESTORE_AUTH_KEY = 'auth_restore_attempted';

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
      // 로그인 성공 시 플래그 제거 (다음 세션에서 다시 시도 가능하도록)
      sessionStorage.removeItem(RESTORE_AUTH_KEY);
      return;
    }

    // 세션 동안 이미 시도했다면 스킵 (반복 실행 방지)
    if (sessionStorage.getItem(RESTORE_AUTH_KEY) === 'true') {
      return;
    }

    // refreshToken으로 accessToken 재발급 시도
    const restoreAuth = async () => {
      // 시도 플래그 설정 (세션 동안 유지)
      sessionStorage.setItem(RESTORE_AUTH_KEY, 'true');
      
      try {
        // 1. refreshToken으로 accessToken 재발급
        const refreshResponse = await authApi.refreshToken();
        
        // 2. getMe()로 user 정보 가져오기
        const userResponse = await authApi.getMe();
        
        // 3. accessToken + user 정보 함께 저장
        setAuth(refreshResponse.accessToken, userResponse);
        
        // 성공 시 플래그 제거
        sessionStorage.removeItem(RESTORE_AUTH_KEY);
      } catch (error) {
        // refreshToken이 없거나 만료된 경우 (로그인하지 않은 상태)
        // 에러를 조용히 처리 (콘솔에 출력하지 않음)
        // 플래그는 유지하여 세션 동안 다시 시도하지 않음
      }
    };

    restoreAuth();
  }, [accessToken, setAuth]);
}

