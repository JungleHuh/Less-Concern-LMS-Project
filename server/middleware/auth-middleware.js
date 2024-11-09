const jwt = require('jsonwebtoken');

const verifyToken = (token, secretKey) => {
   try {
       return jwt.verify(token, secretKey);
   } catch (error) {
       throw new Error('Invalid token');
   }
}

const authenticate = (req, res, next) => {
   try {
       // req.header -> req.headers로 수정 
       const authHeader = req.headers.authorization;

       if(!authHeader){
           return res.status(401).json({
               success: false,
               message: 'Authorization header is missing'
           });
       }

       // Bearer token 형식 확인
       if (!authHeader.startsWith('Bearer ')) {
           return res.status(401).json({
               success: false, 
               message: 'Invalid token format'
           });
       }

       const token = authHeader.split(" ")[1];

       if (!token) {
           return res.status(401).json({
               success: false,
               message: 'Token is missing'
           });
       }

       // 토큰 검증
       const payload = verifyToken(token, "JWT_SECRET");

       // req.user 설정 - loginUser 컨트롤러와 동일한 구조
       req.user = {
           _id: payload._id,
           userName: payload.userName,
           userEmail: payload.userEmail,
           role: payload.role
       };

       next();
   } catch (error) {
       console.error('Authentication error:', error);
       return res.status(401).json({
           success: false,
           message: 'Invalid or expired token'
       });
   }
};

module.exports = authenticate;