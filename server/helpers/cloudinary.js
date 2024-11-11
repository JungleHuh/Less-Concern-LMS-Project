// server/utils/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMediaToCloudinary = async (file, folder = 'lectures') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      folder: folder,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error("파일 업로드에 실패했습니다.");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error("파일 삭제에 실패했습니다.");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };