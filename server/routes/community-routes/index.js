// server/routes/community-routes/index.js
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/auth-middleware');

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require('../../controllers/community-controller');

const {
    getMyPosts,       
    getMyPostsStats    
} = require('../../controllers/mypage-controller/index');

const {
    createComment,
    deleteComment,
    getCommentsByPost
} = require('../../controllers/community-controller/comment-controller')

//Post Routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', authenticate, createPost);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);

// Mypage Routes
router.get('/my/posts', authenticate, getMyPosts);
router.get('/my/stats', authenticate, getMyPostsStats);

//Comments Routes
router.post('/comments', authenticate, createComment);
router.delete('/comments/:commentId', authenticate, deleteComment);
router.get('/posts/:postId/comments', getCommentsByPost);

module.exports = router;