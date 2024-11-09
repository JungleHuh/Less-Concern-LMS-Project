require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes/index');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const communityRoutes = require('./routes/community-routes/index');
const mentorRoutes = require('./routes/mentor-routes/index');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', "Authorization"],

})
);

app.use(express.json());
// database connection

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((e) => console.log(e));

//routes configuration
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/api', communityRoutes);
app.use('/api/mentoring', mentorRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next )=> {
    console.log(err.stack)
    res.status(500).json({
        success: false,
        message: 'Something Went Wrong'
    })
})



app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});