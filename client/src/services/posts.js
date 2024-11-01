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
// 게시판 조회
export const getPosts = async (examType) => {
  try {
    console.log('Fetching posts for exam type:', examType);
    const response = await axiosInstance.get(`/api/posts`, {
      params: { examType } // 쿼리 파라미터로 전달
    });
    console.log('API Response:', response);  // 디버깅용
    return {
      success: true,
      data: response.data.data // response.data.data로 접근
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      success: false,
      error: error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
    };
  }
};

// 게시글 조회

export const getPost = async (postId) => {
  try {
      const { data } = await axiosInstance.get(`/api/posts/${postId}`);
      return data;
  } catch (error) {
      throw error?.response?.data || error;
  }
};

// 게시글 업데이트
export const updatePost = async (postId, data) => {
  try {
    const response = await axiosInstance.put(`/api/posts/${postId}`, data);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error updating post:', error);
    return {
      success: false,
      error: error.response?.data?.message || '게시글 수정에 실패했습니다.'
    };
  }
};

export const deletePost = async (id) => {
  const { data } = await axiosInstance.delete(`/api/posts/${id}`);
  return data;
};



export const getHotPosts = async () => {
  const { data } = await axiosInstance.get('/api/posts/hot');
  return data;
};

export const getCategoryPosts = async (category, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/api/posts/category/${category}?page=${page}&limit=${limit}`);
  return data;
};

