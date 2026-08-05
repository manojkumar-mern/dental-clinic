const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorizeRoles, optionalProtect } = require("../middleware/authMiddleware");

router.route("/")
  .get(optionalProtect, getDoctors)
  .post(protect, authorizeRoles("admin"), createDoctor);

router.route("/:id")
  .get(optionalProtect, getDoctorById)
  .put(protect, authorizeRoles("admin", "doctor"), updateDoctor)
  .delete(protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;
