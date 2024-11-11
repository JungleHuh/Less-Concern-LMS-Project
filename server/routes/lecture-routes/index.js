// server/routes/lecture-routes/index.js
const express = require('express');
const router = express.Router();
const lectureController = require('../../controllers/lecture-controller/index');
const authenticate = require('../../middleware/auth-middleware');
const { lectureUpload } = require('../../middleware/upload-middleware');

// 강의 목록 조회
router.get('/', lectureController.getLectures);

// 내 강의 목록 조회 - 이 라우트를 /:id 보다 앞에 배치
router.get('/my', authenticate, lectureController.getMyLectures);

// 특정 강의 조회 - 일반적인 ID 기반 라우트는 뒤에 배치
router.get('/:id', lectureController.getLectureById);

// 강의 생성
router.post('/', 
  authenticate, 
  lectureUpload,
  lectureController.createLecture
);

// 수강신청
router.post('/:id/enroll', 
  authenticate, 
  lectureController.enrollLecture
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