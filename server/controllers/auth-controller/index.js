const User = require("../../models/User")
const bcrypt = require('bcryptjs')

const registerUser = async(req,res) =>{
    const { userName, userEmail, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [ {userName}, { userEmail}],
    });

    if(existingUser){
        return res.status(400).json({
            success: false,
            message: 'User name or user email already exist'
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        userEmail,
        role,
        password: hashPassword})

    await newUser.save()
    //status(201) -> POST 나 PUT 으로 게시물 작성이나 회원 가입 등의 새로운 데이터를
    // 서버에 생성하는(쓰는, 넣는) 작업이 성공했을 때 반환
    return res.status(201).json({
        success: true,
        message: " User registerd Successfully "
    })
    };
    module.exports = { registerUser };