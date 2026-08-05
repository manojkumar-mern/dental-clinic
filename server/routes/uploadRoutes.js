const express = require("express");
const router = express.Router();
const { upload, uploadToCloudinary } = require("../config/uploadConfig");
const { protectAdmin } = require("../middleware/adminMiddleware");

/**
 * @desc    Upload an image (Logo, Services, Doctors, Gallery)
 * @route   POST /api/uploads
 * @access  Private (Admin Only)
 */
router.post(
  "/",
  protectAdmin,
  (req, res, next) => {
    // Intercept Multer size/type errors
    upload.single("image")(req, res, (err) => {
      if (err) {
        res.status(400);
        return next(err);
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400);
        return next(new Error("Please upload an image file."));
      }

      // Read folder prefix from body request (e.g. 'logos', 'services', 'doctors', 'gallery')
      const folder = req.body.folder || "dental-clinic";

      // Upload to Cloudinary / Local Disk
      const result = await uploadToCloudinary(req.file.buffer, folder);

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully.",
        url: result.url,
        publicId: result.publicId,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
