// server/routes/question-routes/index.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/question-controller');
const authenticate = require('../../middleware/auth-middleware');
const { questionImageUpload } = require('../../middleware/upload-middleware');  // 수정된 부분
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

// 라우트 정의
router.get('/', questionController.getQuestions);
router.get('/my', authenticate, questionController.getMyQuestions);
router.get('/search', questionController.searchQuestions);
router.get('/:id', questionController.getQuestionById);

// 이미지 업로드가 포함된 라우트
router.post('/', 
  authenticate, 
  questionImageUpload,  // 수정된 부분
  uploadToCloudinary,
  questionController.createQuestion
);

router.put('/:id', 
  authenticate, 
  questionImageUpload,  // 수정된 부분
  uploadToCloudinary,
  questionController.updateQuestion
);

// 나머지 라우트
router.delete('/:id', authenticate, questionController.deleteQuestion);
router.post('/:id/answers', authenticate, questionController.addAnswer);
router.delete('/:id/answers/:answerId', authenticate, questionController.deleteAnswer);
router.patch('/:id/answers/:answerId/accept', authenticate, questionController.acceptAnswer);
router.post('/:id/view', questionController.incrementView);

module.exports = router;