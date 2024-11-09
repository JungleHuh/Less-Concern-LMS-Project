// services/mentor.js
import axiosInstance from "@/api/axiosInstance";

// 멘토 목록 조회
export async function getMentorsService(examType) {
  try {
    const { data } = await axiosInstance.get("/api/mentoring", {  // 기본 경로로 수정
      params: { examType }
    });
    return data;
  } catch (error) {
    console.error('getMentorsService error:', error);
    throw error;
  }
}

// 멘토 등록
export async function registerMentorService(formData) {
  try {
    const { data } = await axiosInstance.post("/api/mentoring/mentors", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('registerMentorService error:', error);
    throw error;
  }
}

// 특정 멘토 조회
export async function getMentorByIdService(id) {
  try {
    const { data } = await axiosInstance.get(`/api/mentoring/${id}`);
    return data;
  } catch (error) {
    console.error('getMentorByIdService error:', error);
    throw error;
  }
}

// 멘토 정보 수정
export async function updateMentorService(id, mentorData) {
  try {
    const { data } = await axiosInstance.put(`/api/mentoring/${id}`, mentorData);
    return data;
  } catch (error) {
    console.error('updateMentorService error:', error);
    throw error;
  }
}