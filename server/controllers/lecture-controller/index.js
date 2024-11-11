// server/controllers/lecture-controller/index.js
const Lecture = require('../../models/lecture');
const Enrollment = require('../../models/enrollment'); // 새로운 모델 필요
const { uploadMediaToCloudinary } = require('../../helpers/cloudinary');

// 강의 목록 조회
exports.getLectures = async (req, res) => {
 try {
   const { examType } = req.query;
   console.log('Query examType:', examType);
   
   let query = { status: 'active' };
   if (examType) {
     query.examType = examType;
   }
   
   console.log('MongoDB query:', query);
   const lectures = await Lecture.find(query).populate('instructor', 'name');
   console.log('Found lectures from DB:', lectures);

   res.json({
     success: true,
     data: lectures
   });
 } catch (error) {
   console.error('Error in getLectures:', error);
   res.status(500).json({
     success: false,
     message: '강의 목록을 불러오는데 실패했습니다.'
   });
 }
};

// 특정 강의 조회
exports.getLectureById = async (req, res) => {
 try {
   const lecture = await Lecture.findById(req.params.id)
     .populate('instructor', 'name');
   
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
   console.error('Error in getLectureById:', error);
   res.status(500).json({
     success: false,
     message: '강의 정보를 불러오는데 실패했습니다.'
   });
 }
};

// 강의 등록
exports.createLecture = async (req, res) => {
 try {
   console.log('File:', req.file); 
   console.log('Request body:', req.body);
   console.log('Request files:', req.files);

   const { title, examType, description, price } = req.body;
   const uploadedVideos = [];

   // 비디오 파일들 Cloudinary에 업로드
   for (const key in req.files) {
     if (key.startsWith('video_')) {
       const file = req.files[key][0];
       const index = key.split('_')[1];
       const metaKey = `video_${index}_meta`;
       const metadata = JSON.parse(req.body[metaKey]);

       try {
         console.log('Uploading to Cloudinary:', file.path);
         const result = await uploadMediaToCloudinary(file.path);
         console.log('Cloudinary result:', result);

         uploadedVideos.push({
           title: metadata.title,
           description: metadata.description,
           order: metadata.order,
           videoUrl: result.secure_url,
           publicId: result.public_id,
           duration: result.duration || 0
         });
       } catch (uploadError) {
         console.error('Cloudinary upload error:', uploadError);
         throw new Error('비디오 업로드에 실패했습니다.');
       }
     }
   }

   // 업로드된 비디오가 없으면 에러
   if (uploadedVideos.length === 0) {
     return res.status(400).json({
       success: false,
       message: '최소 하나의 비디오가 필요합니다.'
     });
   }

   // 강의 데이터 생성
   const lecture = await Lecture.create({
     title,
     examType,
     description,
     price: Number(price),
     instructor: req.user._id,
     videos: uploadedVideos.sort((a, b) => a.order - b.order)
   });

   res.status(201).json({
     success: true,
     message: '강의가 성공적으로 등록되었습니다.',
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

// 수강 신청
exports.enrollLecture = async (req, res) => {
 try {
   const lectureId = req.params.id;
   const userId = req.user._id;

   // 이미 수강 중인지 확인
   const existingEnrollment = await Enrollment.findOne({
     user: userId,
     lecture: lectureId
   });

   if (existingEnrollment) {
     return res.status(400).json({
       success: false,
       message: '이미 수강 중인 강의입니다.'
     });
   }

   // 강의 존재 여부 확인
   const lecture = await Lecture.findById(lectureId);
   if (!lecture) {
     return res.status(404).json({
       success: false,
       message: '강의를 찾을 수 없습니다.'
     });
   }

   // 수강 신청 생성
   const enrollment = await Enrollment.create({
     user: userId,
     lecture: lectureId,
     enrolledAt: new Date(),
     status: 'active',
     progress: {
       completedVideos: [],
       lastWatched: null
     }
   });

   res.status(201).json({
     success: true,
     message: '수강신청이 완료되었습니다.',
     data: enrollment
   });

 } catch (error) {
   console.error('Enrollment error:', error);
   res.status(500).json({
     success: false,
     message: '수강신청에 실패했습니다.'
   });
 }
};

// 내 강의 목록 조회
exports.getMyLectures = async (req, res) => {
 try {
   const enrollments = await Enrollment.find({
     user: req.user._id,
     status: 'active'
   }).populate('lecture');

   const lectures = enrollments.map(enrollment => {
     const lectureData = enrollment.lecture.toObject();
     return {
       ...lectureData,
       progress: enrollment.progress,
       enrolledAt: enrollment.enrolledAt
     };
   });

   res.json({
     success: true,
     data: lectures
   });
 } catch (error) {
   console.error('Get my lectures error:', error);
   res.status(500).json({
     success: false,
     message: '내 강의 목록을 불러오는데 실패했습니다.'
   });
 }
};

// 강의 수정
exports.updateLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const { title, description, price } = req.body;
    
    // 강의 존재 확인
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: '강의를 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (강의 작성자만 수정 가능)
    if (lecture.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '강의를 수정할 권한이 없습니다.'
      });
    }

    // 새로운 비디오 파일이 있는 경우 Cloudinary에 업로드
    const updatedVideos = [...lecture.videos];
    
    if (req.files && Object.keys(req.files).length > 0) {
      for (const key in req.files) {
        if (key.startsWith('video_')) {
          const file = req.files[key][0];
          const index = key.split('_')[1];
          const metaKey = `video_${index}_meta`;
          const metadata = JSON.parse(req.body[metaKey]);

          try {
            const result = await uploadMediaToCloudinary(file.path);
            
            // 기존 비디오가 있다면 Cloudinary에서 삭제
            if (updatedVideos[index] && updatedVideos[index].publicId) {
              await deleteMediaFromCloudinary(updatedVideos[index].publicId);
            }

            updatedVideos[index] = {
              title: metadata.title,
              description: metadata.description,
              order: metadata.order,
              videoUrl: result.secure_url,
              publicId: result.public_id,
              duration: result.duration || 0
            };
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            throw new Error('비디오 업로드에 실패했습니다.');
          }
        }
      }
    }

    // 강의 정보 업데이트
    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        title: title || lecture.title,
        description: description || lecture.description,
        price: price || lecture.price,
        videos: updatedVideos
      },
      { new: true }
    );

    res.json({
      success: true,
      message: '강의가 성공적으로 수정되었습니다.',
      data: updatedLecture
    });

  } catch (error) {
    console.error('Lecture update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '강의 수정에 실패했습니다.'
    });
  }
};

// 강의 삭제
exports.deleteLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;

    // 강의 존재 확인
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: '강의를 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (강의 작성자만 삭제 가능)
    if (lecture.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '강의를 삭제할 권한이 없습니다.'
      });
    }

    // Cloudinary에서 모든 비디오 삭제
    for (const video of lecture.videos) {
      if (video.publicId) {
        try {
          await deleteMediaFromCloudinary(video.publicId);
        } catch (deleteError) {
          console.error('Cloudinary delete error:', deleteError);
        }
      }
    }

    // 관련된 수강신청 정보 삭제
    await Enrollment.deleteMany({ lecture: lectureId });

    // 강의 삭제
    await Lecture.findByIdAndDelete(lectureId);

    res.json({
      success: true,
      message: '강의가 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Lecture delete error:', error);
    res.status(500).json({
      success: false,
      message: '강의 삭제에 실패했습니다.'
    });
  }
};