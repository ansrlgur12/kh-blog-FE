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
      // 이미 시도했지만 복원 중 상태가 남아있을 수 있으므로 확인
      if (useAuthStore.getState().isRestoring) {
        useAuthStore.getState().setRestoring(false);
      }
      return;
    }

    // refreshToken으로 accessToken 재발급 시도
    const restoreAuth = async () => {
      // 시도 플래그 설정 (세션 동안 유지)
      sessionStorage.setItem(RESTORE_AUTH_KEY, 'true');
      // 복원 시작
      useAuthStore.getState().setRestoring(true);
      
      try {
        // 1. refreshToken으로 accessToken 재발급
        const refreshResponse = await authApi.refreshToken();
        
        // 2. accessToken을 먼저 스토어에 임시 저장 (getMe() 호출 전에 토큰이 있어야 함)
        // 요청 인터셉터가 토큰을 헤더에 추가할 수 있도록
        useAuthStore.getState().setAccessToken(refreshResponse.accessToken);
        
        // 3. getMe()로 user 정보 가져오기 (이제 토큰이 스토어에 있으므로 인터셉터가 자동으로 추가)
        const userResponse = await authApi.getMe();
        
        // 4. accessToken + user 정보 함께 최종 저장
        setAuth(refreshResponse.accessToken, userResponse);
        
        // 성공 시 플래그 제거
        sessionStorage.removeItem(RESTORE_AUTH_KEY);
      } catch (error: any) {
        // refreshToken이 없거나 만료된 경우 (로그인하지 않은 상태)
        // 400 에러는 쿠키에 refreshToken이 없는 경우이므로 정상적인 상황
        // 401 에러는 refreshToken이 만료된 경우
        // 에러를 조용히 처리 (콘솔에 출력하지 않음)
        // 플래그는 유지하여 세션 동안 다시 시도하지 않음
        
        // 인증 상태 초기화 (혹시 모를 상태 불일치 방지)
        if (error.response?.status === 400 || error.response?.status === 401) {
          useAuthStore.getState().clearAuth();
        } else {
          // 다른 에러의 경우에도 복원 상태 해제
          useAuthStore.getState().setRestoring(false);
        }
      }
    };

    restoreAuth();
  }, [accessToken, setAuth]);
}

