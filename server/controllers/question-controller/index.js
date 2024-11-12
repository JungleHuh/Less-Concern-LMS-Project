// server/controllers/question-controller/index.js
const Question = require('../../models/question');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { spawn } = require('child_process');
const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';

// 질문 목록 조회
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: '질문 목록을 불러오는데 실패했습니다.'
    });
  }
};

// 질문 상세 조회
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('user', 'name')
      .populate('answers.user', 'name');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: '질문을 불러오는데 실패했습니다.'
    });
  }
};

// 질문 생성
  exports.createQuestion = async (req, res) => {
      let imageUrl = null;
      let publicId = null;
      let extractedText = '';

    try {
      const { title, content, examType, subject } = req.body;
  
      if (req.cloudinaryResult) {
        imageUrl = req.cloudinaryResult.secure_url;
        publicId = req.cloudinaryResult.public_id;
  
        const pythonScript = path.join(process.cwd(), '..', 'python', 'main.py');
        console.log('Python path:', PYTHON_PATH);
        console.log('Python script path:', pythonScript);
        console.log('Image URL:', imageUrl);
  
        try {
          const pythonProcess = spawn(PYTHON_PATH, [
            pythonScript,
            imageUrl   // 질문 텍스트 제거
          ]);
  
          let result = '';
          let error = '';
  
          // stdout 처리
          pythonProcess.stdout.on('data', (data) => {
            console.log('Python stdout:', data.toString());
            result += data.toString();
          });
  
          // stderr 처리
          pythonProcess.stderr.on('data', (data) => {
            console.error('Python stderr:', data.toString());
            error += data.toString();
          });
  
          // 프로세스 완료 대기
          await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
              console.log(`Python process exited with code ${code}`);
              if (code === 0) {
                try {
                  const parsed = JSON.parse(result);
                  extractedText = parsed.result;
                  resolve();
                } catch (e) {
                  console.error('JSON parse error:', e);
                  console.error('Raw result:', result);
                  reject(new Error('Failed to parse Python output'));
                }
              } else {
                console.error('Python error output:', error);
                reject(new Error('Text extraction failed'));
              }
            });
  
            pythonProcess.on('error', (err) => {
              console.error('Python process error:', err);
              reject(err);
            });
          });
        } catch (pythonError) {
          console.error('Python execution error:', pythonError);
          throw new Error('Failed to execute Python script');
        }
      }
  
      // 질문 생성
      const question = await Question.create({
        title,
        content,
        examType,
        subject,
        imageUrl,
        publicId,
        extractedText,
        user: req.user._id
      });
  
      res.status(201).json({
        success: true,
        data: question
      });
  
    } catch (error) {
      console.error('Create question error:', error);
      // Cloudinary 이미지 정리 (에러 발생 시)
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cleanupError) {
          console.error('Cloudinary cleanup error:', cleanupError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: error.message || '질문 등록에 실패했습니다.'
      });
    }
  };
  
  // 질문 삭제 컨트롤러에도 Cloudinary 이미지 삭제 추가
  exports.deleteQuestion = async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
  
      if (!question) {
        return res.status(404).json({
          success: false,
          message: '질문을 찾을 수 없습니다.'
        });
      }
  
      // Cloudinary 이미지 삭제
      if (question.publicId) {
        await cloudinary.uploader.destroy(question.publicId);
      }
  
      await question.remove();
  
      res.json({
        success: true,
        message: '질문이 삭제되었습니다.'
      });
    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({
        success: false,
        message: '질문 삭제에 실패했습니다.'
      });
    }
  };
  

// 답변 추가
exports.addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    question.answers.push({
      content,
      user: req.user._id
    });

    await question.save();

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Add answer error:', error);
    res.status(500).json({
      success: false,
      message: '답변 등록에 실패했습니다.'
    });
  }
};

// 답변 채택
exports.acceptAnswer = async (req, res) => {
  try {
    const { id: questionId, answerId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    // 질문 작성자만 답변을 채택할 수 있음
    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '답변을 채택할 권한이 없습니다.'
      });
    }

    // 답변 찾기 및 채택 처리
    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: '답변을 찾을 수 없습니다.'
      });
    }

    answer.isAccepted = true;
    question.status = 'resolved';
    await question.save();

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: '답변 채택에 실패했습니다.'
    });
  }
};

// 답변 삭제
exports.deleteAnswer = async (req, res) => {
  try {
    const { id: questionId, answerId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: '답변을 찾을 수 없습니다.'
      });
    }

    // 답변 작성자만 삭제 가능
    if (answer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '답변을 삭제할 권한이 없습니다.'
      });
    }

    answer.remove();
    await question.save();

    res.json({
      success: true,
      message: '답변이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: '답변 삭제에 실패했습니다.'
    });
  }
};

// server/controllers/question-controller/index.js에 추가

// 질문 수정
exports.updateQuestion = async (req, res) => {
  let imageUrl = null;
  let publicId = null;
  let extractedText = '';

  try {
    const { id } = req.params;
    const { title, content, examType, subject } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    // 권한 확인
    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '질문을 수정할 권한이 없습니다.'
      });
    }

    // 새로운 이미지가 업로드된 경우
    if (req.cloudinaryResult) {
      // 기존 이미지가 있다면 삭제
      if (question.publicId) {
        try {
          await cloudinary.uploader.destroy(question.publicId);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }

      imageUrl = req.cloudinaryResult.secure_url;
      publicId = req.cloudinaryResult.public_id;

      // Python 텍스트 추출
      const pythonScript = path.join(process.cwd(), '..', 'python', 'main.py');
      console.log('Python path:', PYTHON_PATH);
      console.log('Python script path:', pythonScript);
      console.log('Image URL:', imageUrl);

      try {
        const pythonProcess = spawn(PYTHON_PATH, [
          pythonScript,
          imageUrl
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          console.log('Python stdout:', data.toString());
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error('Python stderr:', data.toString());
          error += data.toString();
        });

        await new Promise((resolve, reject) => {
          pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code === 0) {
              try {
                const parsed = JSON.parse(result);
                extractedText = parsed.result;
                resolve();
              } catch (e) {
                console.error('JSON parse error:', e);
                console.error('Raw result:', result);
                reject(new Error('Failed to parse Python output'));
              }
            } else {
              console.error('Python error output:', error);
              reject(new Error('Text extraction failed'));
            }
          });

          pythonProcess.on('error', (err) => {
            console.error('Python process error:', err);
            reject(err);
          });
        });
      } catch (pythonError) {
        console.error('Python execution error:', pythonError);
        throw new Error('Failed to execute Python script');
      }
    } else {
      // 이미지가 변경되지 않은 경우 기존 값 유지
      imageUrl = question.imageUrl;
      publicId = question.publicId;
      extractedText = question.extractedText;
    }

    // 질문 업데이트
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        title,
        content,
        examType,
        subject,
        imageUrl,
        publicId,
        extractedText
      },
      { new: true }
    ).populate('user', 'name');

    res.json({
      success: true,
      data: updatedQuestion
    });

  } catch (error) {
    console.error('Update question error:', error);
    // 새로 업로드된 이미지가 있었다면 삭제
    if (req.cloudinaryResult && req.cloudinaryResult.public_id) {
      try {
        await cloudinary.uploader.destroy(req.cloudinaryResult.public_id);
      } catch (cleanupError) {
        console.error('Cloudinary cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || '질문 수정에 실패했습니다.'
    });
  }
};

// 내가 작성한 질문 목록 조회
exports.getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Get my questions error:', error);
    res.status(500).json({
      success: false,
      message: '내 질문 목록을 불러오는데 실패했습니다.'
    });
  }
};

// 질문 검색/필터링
exports.searchQuestions = async (req, res) => {
  try {
    const { keyword, examType, subject, status } = req.query;
    const query = {};

    // 검색어가 있는 경우 제목과 내용에서 검색
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { extractedText: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 시험 유형 필터
    if (examType) {
      query.examType = examType;
    }

    // 과목 필터
    if (subject) {
      query.subject = subject;
    }

    // 상태 필터
    if (status) {
      query.status = status;
    }

    const questions = await Question.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Search questions error:', error);
    res.status(500).json({
      success: false,
      message: '질문 검색에 실패했습니다.'
    });
  }
};

// 조회수 증가
exports.incrementView = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: '질문을 찾을 수 없습니다.'
      });
    }

    // 조회수 필드가 없으면 초기화
    if (!question.views) {
      question.views = 0;
    }

    question.views += 1;
    await question.save();

    res.json({
      success: true,
      data: { views: question.views }
    });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({
      success: false,
      message: '조회수 업데이트에 실패했습니다.'
    });
  }
};