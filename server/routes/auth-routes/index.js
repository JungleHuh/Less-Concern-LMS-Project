const express = require('express');
const {registerUser, loginUser} = require('../../controllers/auth-controller/index')
const router = express.Router();
const authenticateMiddleware = require('../../middleware/auth-middleware')


//server.js에서 모두 다 처리하면, 코드 가독성 떨어지고, 복잡해지니 Router 만들어서 처리.
router.post( "/register", registerUser );
router.post("/login", loginUser)
router.get('/check-auth', authenticateMiddleware, (req, res) => {
    const user = req.user

    res.status(200).json({
        success: true,
        message: "Authenticated user",
        data: {
            user,
        }
    })
})
module.exports = router;
