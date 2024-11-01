const Post = require('../../models/community/index');

exports.getMyPosts = async (req, res) => {
    try {
        // 현재 로그인한 사용자의 게시글만 조회
        const posts = await Post.find({ 
            'author._id': req.user._id 
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || '게시글을 불러오는데 실패했습니다.'
        });
    }
};

// 사용자 게시글 통계
exports.getMyPostsStats = async (req, res) => {
    try {
        const postsCount = await Post.countDocuments({ 
            'author._id': req.user._id 
        });
        
        res.json({
            success: true,
            data: {
                postsCount,
                // 필요한 경우 다른 통계 추가
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || '통계를 불러오는데 실패했습니다.'
        });
    }
};