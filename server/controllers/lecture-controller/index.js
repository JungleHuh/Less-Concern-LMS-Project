// server/controllers/lecture-controller.js
const { uploadMediaToCloudinary } = require('../../helpers/cloudinary');
const Lecture = require('../../models/lecture/index'); 

// 강의 목록 조회
exports.getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '강의 목록을 불러오는데 실패했습니다.'
    });
  }
};

// 특정 강의 조회
exports.getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '강의 정보를 불러오는데 실패했습니다.'
    });
  }
};

// 강의 생성
exports.createLecture = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { title, examType, description, price } = req.body;
    const uploadedVideos = [];

    // 비디오 파일 업로드
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadMediaToCloudinary(file.path);
        uploadedVideos.push({
          title: `강의 ${uploadedVideos.length + 1}`,
          videoUrl: result.secure_url,
          publicId: result.public_id,
          duration: result.duration || 0
        });
      }
    }

    const lecture = await Lecture.create({
      title,
      examType,
      description,
      price: Number(price),
      videos: uploadedVideos,
      instructor: req.user._id
    });

    res.status(201).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    console.error('Lecture creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '강의 등록에 실패했습니다.'
    });
  }
};

// 강의 수정
exports.updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '강의 수정에 실패했습니다.'
    });
  }
};

// 강의 삭제
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '강의가 삭제되었습니다.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '강의 삭제에 실패했습니다.'
    });
  }
};