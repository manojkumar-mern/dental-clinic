const express = require("express");
const router = express.Router();
const {
  submitTestimonial,
  getTestimonials,
  reviewTestimonial,
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  getSettings,
  updateSettings,
  getFaqs,
  createFaq,
} = require("../controllers/contentController");
const { protect, authorizeRoles, optionalProtect } = require("../middleware/authMiddleware");
const { protectAdmin } = require("../middleware/adminMiddleware");

// 2. Testimonials Routes
router.route("/testimonials")
  .post(submitTestimonial) // Public review submission
  .get(optionalProtect, getTestimonials);

router.put("/testimonials/:id/review", protect, authorizeRoles("admin"), reviewTestimonial);

// 3. Gallery Routes
router.route("/gallery")
  .get(getGalleryImages) // Public view
  .post(protect, authorizeRoles("admin"), uploadGalleryImage);

router.delete("/gallery/:id", protect, authorizeRoles("admin"), deleteGalleryImage);

// 4. Clinic Settings Routes
router.route("/settings")
  .get(getSettings) // Public info
  .put(protectAdmin, updateSettings);

// 5. FAQ Routes
router.route("/faqs")
  .get(getFaqs)
  .post(protectAdmin, createFaq);

module.exports = router;
