const express = require('express');
const {registerUser} = require('../../controllers/auth-controller/index')
const router = express.Router();
//server.js에서 모두 다 처리하면, 코드 가독성 떨어지고, 복잡해지니 Router 만들어서 처리.
router.post( "/register", registerUser );

module.exports = router;
