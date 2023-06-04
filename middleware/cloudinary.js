const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuration
cloudinary.config({
  cloud_name: "dvcsktxvh",
  api_key: "717455286888243",
  api_secret: "kHcRvqkr0HqrUV2uBRkGICTndys"
});



module.exports = cloudinary;
