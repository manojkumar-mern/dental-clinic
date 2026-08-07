const express = require("express");
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  getDoctorAvailableSlots,
} = require("../controllers/appointmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Doctor availability endpoint is public so patients can schedule appointments on the public site
router.get("/doctor/:doctorId/available", getDoctorAvailableSlots);

// Public endpoint to book an appointment
router.post("/", createAppointment);

// Protected routes (staff dashboard functions)
router.use(protect);

router.route("/")
  .get(authorizeRoles("admin", "doctor", "receptionist"), getAppointments);

router.route("/:id")
  .get(authorizeRoles("admin", "doctor", "receptionist"), getAppointmentById)
  .put(authorizeRoles("admin", "doctor", "receptionist"), updateAppointment);

router.put("/:id/status", authorizeRoles("admin", "doctor", "receptionist"), updateAppointmentStatus);

module.exports = router;

