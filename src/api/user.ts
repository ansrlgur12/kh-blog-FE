import apiClient from '../lib/api';
import type { UpdateProfileRequest } from '../types';

// 프로필 업데이트 (닉네임, 프로필 이미지)
export const userApi = {
    updateProfile: async (data: { user_image?: string | null }): Promise<UpdateProfileRequest> => {
        const response = await apiClient.post<UpdateProfileRequest>('/users/profile', data);
        return response.data;
    },

    updateNickname: async (data: { user_nickname?: string }): Promise<UpdateProfileRequest> => {
        const response = await apiClient.post<UpdateProfileRequest>('/users/nickname', data);
        return response.data;
    },
};