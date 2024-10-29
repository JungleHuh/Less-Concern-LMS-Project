import axiosInstance from "@/api/axiosInstance";

export const createPost = async (postData) => {
    try {
        const response = await axiosInstance.post('api/posts', postData);
        console.log('API Response:', response); // 응답 로깅 추가
        return response.data;
    } catch (error) {
        console.error('Create post error:', error);
        throw error.response?.data || error;
    }
};

export const getPosts = async (examType) => {
  try {
      const { data } = await axiosInstance.get('/api/posts', {
          params: { examType }
      });
      return data;
  } catch (error) {
      throw error?.response?.data || error;
  }
};

export const getHotPosts = async () => {
  const { data } = await axiosInstance.get('/api/posts/hot');
  return data;
};

export const getCategoryPosts = async (category, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/api/posts/category/${category}?page=${page}&limit=${limit}`);
  return data;
};

// src/services/posts.js
export const getPost = async (postId) => {
  try {
      const { data } = await axiosInstance.get(`/api/posts/${postId}`);
      return data;
  } catch (error) {
      throw error?.response?.data || error;
  }
};


export const updatePost = async (id, postData) => {
  const { data } = await axiosInstance.put(`/api/posts/${id}`, postData);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await axiosInstance.delete(`/api/posts/${id}`);
  return data;
};