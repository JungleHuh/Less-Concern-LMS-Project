const Comment = require('../../models/community/comment');
const Post = require('../../models/community/index');

// 댓글 생성
exports.createComment = async (req, res) => {
    try {
        const { content, postId, parentCommentId } = req.body;

        const commentData = {
            content,
            author: {
                _id: req.user._id,
                userName: req.user.userName,
                userEmail: req.user.userEmail
            },
            post: postId,
            depth: parentCommentId ? 1 : 0
        };

        if (parentCommentId) {
            commentData.parentComment = parentCommentId;
        }

        const newComment = new Comment(commentData);
        const savedComment = await newComment.save();

        if (parentCommentId) {
            // 부모 댓글에 대댓글 추가
            await Comment.findByIdAndUpdate(parentCommentId, {
                $push: { replies: savedComment._id }
            });
        } else {
            // 최상위 댓글인 경우 게시글에 추가
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: savedComment._id }
            });
        }

        res.status(201).json({
            success: true,
            data: savedComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            success: false,
            message: error.message || '댓글 작성에 실패했습니다.'
        });
    }
};

// 게시글의 댓글 목록 조회 (대댓글 포함)
exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ 
            post: postId,
            parentComment: null  // 최상위 댓글만 먼저 가져옴
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'replies',
            options: { sort: { createdAt: 1 } },
            populate: {
                path: 'author',
                select: 'userName'
            }
        });

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || '댓글을 불러오는데 실패했습니다.'
        });
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '댓글을 찾을 수 없습니다.'
            });
        }

        // 작성자 확인
        if (comment.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: '삭제 권한이 없습니다.'
            });
        }

        // 게시글에서 댓글 ID 제거
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: commentId }
        });

        await Comment.findByIdAndDelete(commentId);

        res.json({
            success: true,
            message: '댓글이 삭제되었습니다.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || '댓글 삭제에 실패했습니다.'
        });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || '댓글을 불러오는데 실패했습니다.'
        });
    }
};