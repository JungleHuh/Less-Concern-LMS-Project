// server/routes/mentor-routes/index.js
const express = require('express');
const router = express.Router();
const mentorController = require('../../controllers/mentor-controller');
const authenticate = require('../../middleware/auth-middleware');
const { profileUpload } = require('../../middleware/upload-middleware');

// 멘토 목록 조회 (공개)
router.get('/', mentorController.getMentors);

// 멘토 상세 조회 (공개)
router.get('/:id', mentorController.getMentorById);

// 멘토 등록 (로그인 필요) - 이미지 업로드 포함
router.post('/mentors', authenticate, profileUpload, mentorController.registerMentor);

// 멘토 정보 수정 (본인만)
router.put('/:id', authenticate, mentorController.updateMentor);

// 멘토 상태 변경 (관리자만)
router.patch('/:id/status', authenticate, mentorController.updateMentorStatus);

module.exports = router;