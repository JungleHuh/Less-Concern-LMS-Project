// server/middleware/upload-middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// uploads 폴더가 없으면 생성
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  // 이미지와 비디오 타입 모두 허용
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('지원하지 않는 파일 형식입니다. (이미지 또는 비디오 파일만 가능)'), false);
  }
};

// multer 인스턴스 생성
const uploadInstance = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// 비디오 업로드용 인스턴스
const videoUploadInstance = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('비디오 파일만 업로드 가능합니다.'), false);
    }
  }
});

module.exports = {
  imageUpload: uploadInstance.single('image'),  // 이미지 업로드용
  profileUpload: uploadInstance.single('profileImage'),  // 프로필 이미지용
  lectureUpload: videoUploadInstance.any(),  // 강의 비디오용
  questionImageUpload: uploadInstance.single('image')  // 질문 이미지용
};