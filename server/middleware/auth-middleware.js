//middleware: User Authentication, Get token
// https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Authorization
const jwt = require('jsonwebtoken');

const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey)
}

const authenticate = (req, res, next) => {
    const authHeader = req.header.authorization;

    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: 'User is not authenticated'
        });
    }
    //client/src/api/axiosInstance의 line 11의 Access토큰을 받기 위함
    const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, "JWT_SECRET");

    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};

module.exports = authenticate;