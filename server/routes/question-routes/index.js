// server/routes/question-routes/index.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/question-controller');
const authenticate = require('../../middleware/auth-middleware');
const { questionImageUpload } = require('../../middleware/upload-middleware');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary 업로드 미들웨어
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    req.cloudinaryResult = result;

    // 로컬 파일 삭제
    fs.unlinkSync(req.file.path);
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    next(error);
  }
};

// 일반 조회 라우트 (파라미터 없는 라우트 먼저)
router.get('/', questionController.getQuestions);
router.get('/search', questionController.searchQuestions);
router.get('/my', authenticate, questionController.getMyQuestions);

// 질문 생성 라우트
router.post('/', 
  authenticate, 
  questionImageUpload,
  uploadToCloudinary,
  questionController.createQuestion
);

// ID 기반 질문 조회/수정/삭제 라우트
router.get('/:id', questionController.getQuestionById);
router.put('/:id', 
  authenticate, 
  questionImageUpload,
  uploadToCloudinary,
  questionController.updateQuestion
);
router.delete('/:id', authenticate, questionController.deleteQuestion);

// 답변 관련 라우트
router.post('/:id/answers', authenticate, questionController.addAnswer);
router.delete('/:id/answers/:answerId', authenticate, questionController.deleteAnswer);
router.patch('/:id/answers/:answerId/accept', authenticate, questionController.acceptAnswer);

// 조회수 관련 라우트
router.post('/:id/view', questionController.incrementView);

// AI 분석 관련 라우트
router.post('/:id/analyze', authenticate, questionController.analyzeQuestion);
router.get('/:id/analysis', authenticate, questionController.getAnalysis);
router.post('/:id/auto-analyze', authenticate, questionController.startAutoAnalysis);

module.exports = router;