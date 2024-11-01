// server/controllers/community-controller/index.js
const Post = require('../../models/community/index');

exports.createPost = async (req, res) => {
    try {
        const { title, content, category, examType } = req.body;
        console.log('Received data:', { title, content, category, examType }); // 데이터 확인용 로그

        // 새 게시물 생성
        const newPost = new Post({
            title,
            content,
            category,
            examType,
            author: {
                _id: req.user._id,
                userName: req.user.userName,
                userEmail: req.user.userEmail
            }
        });

        // 저장
        const savedPost = await newPost.save();
        console.log('Saved post:', savedPost); // 저장된 데이터 확인용 로그

        res.status(201).json({
            success: true,
            message: '게시글이 성공적으로 생성되었습니다.',
            data: savedPost
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '게시글 작성 중 오류가 발생했습니다.'
        });
    }
};

// 게시글 목록 조회: 안된 코드
/*
exports.getPosts = async (req, res) => {
    try {
        const { examType } = req.params;  // URL 파라미터에서 examType 가져오기
        console.log('Fetching posts for examType:', examType);  // 디버깅용

        // examType에 해당하는 게시글만 조회
        const posts = await Post.find({ examType }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '게시글을 불러오는데 실패했습니다.'
        });
    }
};
*/
exports.getPosts = async (req, res) => {
    try {
        const { examType } = req.query;  // URL 쿼리에서 examType 가져오기
        console.log('Fetching posts with examType:', examType); // 디버깅용

        let query = {};
        if (examType) {
            query.examType = examType;
        }

        console.log('Query:', query); // 디버깅용

        const posts = await Post.find(query).sort({ createdAt: -1 });
        console.log('Found posts:', posts); // 디버깅용
        
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error('Error in getPosts:', error);
        res.status(500).json({
            success: false,
            message: error.message || '게시글을 불러오는데 실패했습니다.'
        });
    }
};

// 단일 게시글 조회
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'userName');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을 수 없습니다.'
            });
        }

        // 조회수 증가
        post.views += 1;
        await post.save();

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: '게시글을 불러오는데 실패했습니다.'
        });
    }
};

// 게시글 수정 컨트롤러
exports.updatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을 수 없습니다.'
            });
        }

        // 작성자 확인
        if (post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: '수정 권한이 없습니다.'
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                title,
                content,
                category,
            },
            { new: true }
        );

        res.json({
            success: true,
            message: '게시글이 수정되었습니다.',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 게시글 삭제 컨트롤러
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을 수 없습니다.'
            });
        }

        // 작성자 확인
        if (post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: '삭제 권한이 없습니다.'
            });
        }

        await Post.findByIdAndDelete(postId);

        res.json({
            success: true,
            message: '게시글이 삭제되었습니다.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
