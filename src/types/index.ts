// 사용자 타입
export interface User {
    user_id: number;
    user_email: string;
    user_nickname: string;
}


// 로그인 요청 타입
export interface LoginRequest {
    user_email: string;
    user_password: string;
}

// 회원가입 요청 타입
export interface SignupRequest {
    user_email: string;
    user_password: string;
    user_nickname: string;
}

// 인증 응답 타입 (백엔드에서 받는 응답 구조)
export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

