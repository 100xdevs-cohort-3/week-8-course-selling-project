import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null


      const response = await  cloudinary.uploader.upload(localFilePath, {
            resource_type:'auto',
          
        });

        // if file uploaded successfully
        fs.unlinkSync(localFilePath)

        return response;

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        fs.unlinkSync(localFilePath) 
              return null
    }
}


  



export { uploadOnCloudinary};