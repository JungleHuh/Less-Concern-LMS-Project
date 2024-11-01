import axiosInstance from "@/api/axiosInstance";

export const getUserPosts = async () => {
    try {
      console.log('Requesting user posts...'); // 디버깅용
      const response = await axiosInstance.get('/api/my/posts'); 
      console.log('User posts response:', response.data);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return {
        success: false,
        error: error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      };
    }
  };
  
  export const getUserStats = async () => {
    try {
      const response = await axiosInstance.get('/api/my/stats');  
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || '통계를 불러오는데 실패했습니다.'
      };
    }
  };
  