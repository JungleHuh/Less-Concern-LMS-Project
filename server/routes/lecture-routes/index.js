// server/routes/lecture-routes/index.js
const express = require('express');
const router = express.Router();
const lectureController = require('../../controllers/lecture-controller/index');
const authenticate = require('../../middleware/auth-middleware');
const { lectureUpload } = require('../../middleware/upload-middleware');

// 강의 목록 조회
router.get('/', lectureController.getLectures);

// 특정 강의 조회
router.get('/:id', lectureController.getLectureById);

// 강의 생성
router.post('/', 
  authenticate, 
  lectureUpload,
  lectureController.createLecture
);

// 강의 수정
router.put('/:id', 
  authenticate, 
  lectureUpload,
  lectureController.updateLecture
);

// 강의 삭제
router.delete('/:id', 
  authenticate, 
  lectureController.deleteLecture
);

module.exports = router;