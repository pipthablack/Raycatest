const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();
          
cloudinary.config({ 
  cloud_name: 'dduqzdopm', 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY  
});

const uploadImage = async (fileUrl) => {
        // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
  
      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(fileUrl, options);
        console.log(result);
        return result.url;
      } catch (error) {
        console.error(error);
      }
}

module.exports = uploadImage;