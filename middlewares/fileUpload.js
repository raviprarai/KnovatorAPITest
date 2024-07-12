const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dolp0eqfo',
    api_key: '155969717513891',
    api_secret: 'Jl1ryInRQDHnZaxldqSxvqPNGwY'
  });

module.exports = {
    uploadImage: async (image) => {
        try {
            let upload = await cloudinary.uploader.upload(image);
            return upload.secure_url;
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong !", responseResult: error });
        }
    },
 
}