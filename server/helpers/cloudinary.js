const cloudinary = require("cloudinary").v2

//
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET

});

 const uploadMediaToCloudinary = async(filePath) =>{
    try{

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type : 'auto'
        });

    return result;

    }catch(error){
        console.log(error)
        throw new Error("Error")
    }
 }

 const deleteMediaFromCloudinary = async(publicId) => {
    try{

    }catch(error){
    console.log(error)
    throw new Error("Error");
    }
 }


 module.exports = {uploadMediaToCloudinary, deleteMediaFromCloudinary};