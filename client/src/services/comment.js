// src/services/comments.js
import axiosInstance from '@/api/axiosInstance'

export const createComment = async (data) => {
    try {
        const response = await axiosInstance.post('/api/comments', data);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || '댓글 작성에 실패했습니다.'
        };
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await axiosInstance.delete(`/api/comments/${commentId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || '댓글 삭제에 실패했습니다.'
        };
    }
};

export const getComments = async (postId) => {
    try {
        const response = await axiosInstance.get(`/api/posts/${postId}/comments`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || '댓글을 불러오는데 실패했습니다.'
        };
    }
};