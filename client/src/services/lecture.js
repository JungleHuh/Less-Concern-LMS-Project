// services/lecture.js
import axiosInstance from "@/api/axiosInstance";

export const createLectureService = async (formData, onProgress = () => {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    };

    const { data } = await axiosInstance.post('/api/lectures', formData, config);
    return data;
  } catch (error) {
    console.error('Upload error details:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      '강의 업로드에 실패했습니다.'
    );
  }
};

// 강의 목록 조회
export const getLecturesService = async (examType) => {
  try {
    const { data } = await axiosInstance.get('/api/lectures', {
      params: { examType }
    });
    return data;
  } catch (error) {
    console.error('Get lectures error:', error);
    throw new Error(
      error.response?.data?.message || 
      '강의 목록을 불러오는데 실패했습니다.'
    );
  }
};

// 특정 강의 조회
export const getLectureByIdService = async (lectureId) => {
  try {
    const { data } = await axiosInstance.get(`/api/lectures/${lectureId}`);
    return data;
  } catch (error) {
    console.error('Get lecture error:', error);
    throw new Error(
      error.response?.data?.message || 
      '강의 정보를 불러오는데 실패했습니다.'
    );
  }
};

// 강의 업데이트
export const updateLectureService = async (lectureId, formData) => {
  try {
    const { data } = await axiosInstance.put(
      `/api/lectures/${lectureId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (error) {
    console.error('Update lecture error:', error);
    throw new Error(
      error.response?.data?.message || 
      '강의 수정에 실패했습니다.'
    );
  }
};

// 강의 삭제
export const deleteLectureService = async (lectureId) => {
  try {
    const { data } = await axiosInstance.delete(`/api/lectures/${lectureId}`);
    return data;
  } catch (error) {
    console.error('Delete lecture error:', error);
    throw new Error(
      error.response?.data?.message || 
      '강의 삭제에 실패했습니다.'
    );
  }
};