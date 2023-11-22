const cloudinary = require("../configs/cloudinary");

upload = async (path) => {
  const result = await cloudinary.uploader.upload(path);
  return result.secure_url;
};

module.exports = upload;
