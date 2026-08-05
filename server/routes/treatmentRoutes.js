const express = require("express");
const router = express.Router();
const {
  getTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} = require("../controllers/treatmentController");
const { protect, authorizeRoles, optionalProtect } = require("../middleware/authMiddleware");

router.route("/")
  .get(optionalProtect, getTreatments)
  .post(protect, authorizeRoles("admin"), createTreatment);

router.route("/:id")
  .get(optionalProtect, getTreatmentById)
  .put(protect, authorizeRoles("admin"), updateTreatment)
  .delete(protect, authorizeRoles("admin"), deleteTreatment);

module.exports = router;
