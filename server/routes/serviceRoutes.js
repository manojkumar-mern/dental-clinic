const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} = require("../controllers/serviceController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// Common validator error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map((err) => err.msg).join(", ")));
  }
  next();
};

const serviceValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Service title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ max: 500 })
    .withMessage("Short description cannot exceed 500 characters"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either 'Active' or 'Inactive'"),
  validate,
];

// Public routes
router.get("/", getServices);
router.get("/:idOrSlug", getService);

// Protected Admin routes
router.post("/", protectAdmin, serviceValidationRules, createService);
router.put("/:id", protectAdmin, serviceValidationRules, updateService);
router.delete("/:id", protectAdmin, deleteService);
router.patch("/:id/toggle", protectAdmin, toggleServiceStatus);

module.exports = router;
