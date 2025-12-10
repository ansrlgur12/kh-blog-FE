import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';

// API 기본 URL (환경 변수로 관리)
// .env 파일에 VITE_API_BASE_URL을 설정하거나, 기본값 사용
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = 'http://localhost:3000';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // httpOnly 쿠키 전송을 위해 필요
});

// 요청 인터셉터: JWT 토큰 자동 추가
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore.getState();
        
        // 인증 복원 중인 경우, /auth/refresh와 /auth/me 요청만 허용
        const isAuthRestoreEndpoint = config.url?.includes('/auth/refresh') || 
                                      config.url?.includes('/auth/me');
        const isPublicEndpoint = config.url?.includes('/auth/login') || 
                                config.url?.includes('/auth/register');
        
        // 복원 중이고, 복원 관련 엔드포인트가 아니고, 공개 엔드포인트도 아닌 경우 대기
        if (authStore.isRestoring && !isAuthRestoreEndpoint && !isPublicEndpoint) {
            // 복원이 완료될 때까지 대기 (최대 5초)
            const maxWait = 5000;
            const startTime = Date.now();
            
            while (authStore.isRestoring && (Date.now() - startTime) < maxWait) {
                await new Promise(resolve => setTimeout(resolve, 100));
                // 상태 재확인
                if (!useAuthStore.getState().isRestoring) {
                    break;
                }
            }
        }
        
        // Zustand 스토어에서 토큰 가져오기 (메모리에서)
        // getState()를 사용하여 최신 상태 가져오기
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            // Authorization 헤더에 Bearer 토큰 추가
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리 및 토큰 갱신
let isRefreshing = false; // 토큰 갱신 중인지 확인 (중복 요청 방지)
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = []; // 토큰 갱신 중 실패한 요청들을 저장

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 로그인/회원가입/refresh API는 토큰 갱신 로직에서 제외
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                              originalRequest.url?.includes('/auth/register') ||
                              originalRequest.url?.includes('/auth/refresh');
        
        // 401 에러이고, 아직 재시도하지 않은 요청인 경우 (인증 엔드포인트 제외)
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            // 이미 토큰 갱신 중이면 대기열에 추가
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh Token으로 Access Token 재발급 시도
                // httpOnly 쿠키에 refreshToken이 있으면 자동으로 전송됨
                const response = await authApi.refreshToken();
                const userResponse = await authApi.getMe();

                // 새로운 Access Token을 스토어에 저장
                useAuthStore.getState().setAuth(response.accessToken, userResponse);
                // 대기 중인 요청들 처리
                processQueue(null, response.accessToken);

                // 원래 요청 재시도
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                }
                isRefreshing = false;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh Token도 만료되었거나 유효하지 않은 경우
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

