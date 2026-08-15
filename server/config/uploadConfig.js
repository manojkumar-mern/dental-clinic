const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Memory storage keeps operations stateless and fast
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed!"));
  },
});

/**
 * Uploads a file buffer to Cloudinary or falls back to local disk
 */
const uploadToCloudinary = (fileBuffer, folder = "dental-clinic") => {
  return new Promise((resolve, reject) => {
    if (hasCloudinary) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Local fallback uploader
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFile(filepath, fileBuffer, (err) => {
        if (err) return reject(err);
        const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
        resolve({
          url: `${baseUrl}/uploads/${filename}`,
          publicId: `local-${filename}`,
        });
      });
    }
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
  isCloudinaryConfigured: !!hasCloudinary,
};
