// services/lecture.js
import axiosInstance from "@/api/axiosInstance";

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

// 강의 등록
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

// 수강 신청
export const enrollLectureService = async (lectureId) => {
  try {
    const { data } = await axiosInstance.post(`/api/lectures/${lectureId}/enroll`);
    return data;
  } catch (error) {
    console.error('Enroll lecture error:', error);
    throw new Error(
      error.response?.data?.message || 
      '수강신청에 실패했습니다.'
    );
  }
};

// 내 강의 목록 조회
export const getMyLecturesService = async () => {
  try {
    const { data } = await axiosInstance.get('/api/lectures/my');
    return data;
  } catch (error) {
    console.error('Get my lectures error:', error);
    throw new Error(
      error.response?.data?.message || 
      '내 강의 목록을 불러오는데 실패했습니다.'
    );
  }
};

//진도율 업데이트 

export const updateProgressService = async (lectureId, videoId, progress) => {
  try {
    const { data } = await axiosInstance.post(`/api/lectures/${lectureId}/progress`, {
      videoId,
      progress,
      timestamp: progress.playedSeconds,
      completed: progress.played >= 0.9 // 90% 이상 시청시 완료로 간주
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '진도율 업데이트에 실패했습니다.');
  }
};