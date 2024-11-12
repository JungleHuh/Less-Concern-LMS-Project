// services/question.js
import axiosInstance from "@/api/axiosInstance";

// 질문 목록 조회
export const getQuestionsService = async (params = {}) => {
 try {
   const { data } = await axiosInstance.get('/api/questions', { params });
   return data;
 } catch (error) {
   console.error('Get questions error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문 목록을 불러오는데 실패했습니다.'
   );
 }
};

// 특정 질문 조회
export const getQuestionByIdService = async (questionId) => {
 try {
   const { data } = await axiosInstance.get(`/api/questions/${questionId}`);
   return data;
 } catch (error) {
   console.error('Get question error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문을 불러오는데 실패했습니다.'
   );
 }
};

// 질문 생성
export const createQuestionService = async (formData) => {
 try {
   const { data } = await axiosInstance.post('/api/questions', formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   return data;
 } catch (error) {
   console.error('Create question error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문 등록에 실패했습니다.'
   );
 }
};

// 답변 작성
export const addAnswerService = async (questionId, answerData) => {
 try {
   const { data } = await axiosInstance.post(
     `/api/questions/${questionId}/answers`,
     answerData
   );
   return data;
 } catch (error) {
   console.error('Add answer error:', error);
   throw new Error(
     error.response?.data?.message || 
     '답변 등록에 실패했습니다.'
   );
 }
};

// 답변 채택
export const acceptAnswerService = async (questionId, answerId) => {
 try {
   const { data } = await axiosInstance.patch(
     `/api/questions/${questionId}/answers/${answerId}/accept`
   );
   return data;
 } catch (error) {
   console.error('Accept answer error:', error);
   throw new Error(
     error.response?.data?.message || 
     '답변 채택에 실패했습니다.'
   );
 }
};

// 질문 검색/필터링
export const searchQuestionsService = async (params) => {
 try {
   const { data } = await axiosInstance.get('/api/questions/search', {
     params: {
       ...params,
       // 검색어, 시험 유형, 과목 등의 필터링 조건
     }
   });
   return data;
 } catch (error) {
   console.error('Search questions error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문 검색에 실패했습니다.'
   );
 }
};

// 내가 작성한 질문 목록
export const getMyQuestionsService = async () => {
 try {
   const { data } = await axiosInstance.get('/api/questions/my');
   return data;
 } catch (error) {
   console.error('Get my questions error:', error);
   throw new Error(
     error.response?.data?.message || 
     '내 질문 목록을 불러오는데 실패했습니다.'
   );
 }
};

// 답변 삭제
export const deleteAnswerService = async (questionId, answerId) => {
 try {
   const { data } = await axiosInstance.delete(
     `/api/questions/${questionId}/answers/${answerId}`
   );
   return data;
 } catch (error) {
   console.error('Delete answer error:', error);
   throw new Error(
     error.response?.data?.message || 
     '답변 삭제에 실패했습니다.'
   );
 }
};

// 질문 삭제
export const deleteQuestionService = async (questionId) => {
 try {
   const { data } = await axiosInstance.delete(`/api/questions/${questionId}`);
   return data;
 } catch (error) {
   console.error('Delete question error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문 삭제에 실패했습니다.'
   );
 }
};

// 질문 수정
export const updateQuestionService = async (questionId, formData) => {
 try {
   const { data } = await axiosInstance.put(
     `/api/questions/${questionId}`,
     formData,
     {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     }
   );
   return data;
 } catch (error) {
   console.error('Update question error:', error);
   throw new Error(
     error.response?.data?.message || 
     '질문 수정에 실패했습니다.'
   );
 }
};

// 질문 조회수 증가
export const incrementViewService = async (questionId) => {
 try {
   const { data } = await axiosInstance.post(
     `/api/questions/${questionId}/view`
   );
   return data;
 } catch (error) {
   console.error('Increment view error:', error);
   // 조회수 증가 실패는 사용자에게 알리지 않음
 }
};