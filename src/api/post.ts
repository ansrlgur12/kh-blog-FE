import apiClient from "../lib/api";
import type { getPostsRequest, getPostsResponse, Post, PostResponse, getPostResponse } from "../types";

export const postApi = {
    // 게시글 작성
    createPost: async (data: Post): Promise<PostResponse> => {
        const response = await apiClient.post<PostResponse>('/posts', data);
        return response.data;
    },

    getPosts: async (data: getPostsRequest): Promise<getPostsResponse> => {
        const response = await apiClient.get<getPostsResponse>('/posts', { params: data });
        return response.data;
    },

    getPost: async (postId: string): Promise<getPostResponse> => {
        const response = await apiClient.get<getPostResponse>(`/posts/${postId}`);
        return response.data;
    }

};