import apiClient from "../lib/api";
import type { getPostsRequest, getPostsResponse, Post, PostResponse, getPostResponse } from "../types";

export const postApi = {
    // 게시글 작성
    createPost: async (data: Post): Promise<PostResponse> => {
        const response = await apiClient.post<PostResponse>('/posts', data);
        return response.data;
    },

    // 게시글 업데이트
    updatePost: async (postId: string, data: Post): Promise<PostResponse> => {
        const response = await apiClient.post<PostResponse>(`/posts/update/${postId}`, data);
        return response.data;
    },

    // 게시글 삭제
    deletePost: async (postId: string): Promise<PostResponse> => {
        const response = await apiClient.post<PostResponse>(`/posts/delete/${postId}`);
        return response.data;
    },

    getPosts: async (data: getPostsRequest): Promise<getPostsResponse> => {
        const response = await apiClient.get<getPostsResponse>('/posts', { params: data });
        return response.data;
    },

    getPost: async (postId: string): Promise<getPostResponse> => {
        const response = await apiClient.get<getPostResponse>(`/posts/${postId}`);
        return response.data;
    },

    tempPost: async (data: Post): Promise<PostResponse> => {
        const response = await apiClient.post<PostResponse>('/posts/temp', data);
        return response.data;
    },

    getTempPosts: async (data: getPostsRequest): Promise<getPostsResponse> => {
        const response = await apiClient.get<getPostsResponse>('/posts/mypage/temp', { params: data });
        return response.data;
    },

};