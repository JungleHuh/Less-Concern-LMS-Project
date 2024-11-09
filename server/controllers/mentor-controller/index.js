// server/controllers/mentor-controller/index.js
const Mentor = require('../../models/mentor');
const { EXAM_TYPES, EXAM_TYPE_LIST } = require('../../config/exam');

// 멘토 목록 조회
exports.getMentors = async (req, res) => {
  try {
    const { examType } = req.query;
    console.log('Query examType:', examType);
    
    let query = { status: 'active' };
    if (examType) {
      query.examType = examType;
    }
    
    console.log('MongoDB query:', query);
    const mentors = await Mentor.find(query);
    console.log('Found mentors from DB:', mentors);

    res.json({
      success: true,
      data: mentors
    });
  } catch (error) {
    console.error('Error in getMentors:', error);
    res.status(500).json({
      success: false,
      message: '멘토 목록을 불러오는데 실패했습니다.'
    });
  }
};

// 멘토 상세 조회
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: '멘토를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '멘토 정보를 불러오는데 실패했습니다.'
    });
  }
};

// 멘토 등록 컨트롤러
// controllers/mentor-controller/index.js
exports.registerMentor = async (req, res) => {
  try {
    console.log('File:', req.file);  // 파일 정보 확인

    const mentorData = {
      ...req.body,
      userId: req.user._id,
      mentoringInfo: JSON.parse(req.body.mentoringInfo),
      profileImage: req.file ? req.file.filename : null, // filename만 저장
      status: 'active' 
    };

    console.log('Saving mentor data:', mentorData);  // 저장되는 데이터 확인

    const mentor = new Mentor(mentorData);
    await mentor.save();

    res.status(201).json({
      success: true,
      message: '멘토 등록이 완료되었습니다.',
      data: mentor
    });
  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '멘토 등록에 실패했습니다.'
    });
  }
};

// 멘토 정보 수정
exports.updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: '멘토를 찾을 수 없습니다.'
      });
    }

    // 권한 확인
    if (mentor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '수정 권한이 없습니다.'
      });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      message: '멘토 정보가 수정되었습니다.',
      data: updatedMentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '멘토 정보 수정에 실패했습니다.'
    });
  }
};

// 멘토 상태 변경 (관리자용)
exports.updateMentorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '잘못된 상태값입니다.'
      });
    }

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: '멘토를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '멘토 상태가 변경되었습니다.',
      data: mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '멘토 상태 변경에 실패했습니다.'
    });
  }
};