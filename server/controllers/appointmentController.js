const appointmentService = require("../services/appointmentService");
const logActivity = require("../utils/logger");

/**
 * @desc    Get all appointments (filtered, paginated, sorted)
 * @route   GET /api/appointments
 * @access  Private (Admin Only)
 */
const getAppointments = async (req, res, next) => {
  try {
    const { search, status, date, page, limit } = req.query;

    const result = await appointmentService.getAllAppointments({
      search,
      status,
      date,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single appointment details
 * @route   GET /api/appointments/:id
 * @access  Private (Admin Only)
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new appointment (Public or Admin)
 * @route   POST /api/appointments
 * @access  Public
 */
const createAppointment = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      service,
      preferredDate,
      preferredTime,
      reasonForVisit,
    } = req.body;

    const appt = await appointmentService.bookAppointment({
      name,
      phone,
      email,
      service,
      preferredDate,
      preferredTime,
      reasonForVisit,
    });

    // Log admin action if initiated by authenticated admin, otherwise log as system action
    const actorId = req.admin ? req.admin._id : null;
    const actionDetails = req.admin
      ? `Admin booked appointment: ${appt.appointmentId} for patient: ${name}`
      : `Public web visitor booked appointment: ${appt.appointmentId} for phone: ${phone}`;
      
    await logActivity(actorId, "APPOINTMENT_CREATED", actionDetails, req);

    res.status(201).json({
      success: true,
      message: "Appointment request received successfully and is awaiting confirmation.",
      appointment: appt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment details (rescheduling, updating notes)
 * @route   PUT /api/appointments/:id
 * @access  Private (Admin Only)
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { preferredDate, preferredTime, reasonForVisit, adminNotes } = req.body;

    const updatedAppt = await appointmentService.updateAppointment(id, {
      preferredDate,
      preferredTime,
      reasonForVisit,
      adminNotes,
    });

    await logActivity(
      req.admin._id,
      "APPOINTMENT_RESCHEDULED",
      `Admin rescheduled/updated appointment: ${updatedAppt.appointmentId}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Appointment details updated successfully.",
      appointment: updatedAppt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change appointment status
 * @route   PATCH /api/appointments/:id/status
 * @access  Private (Admin Only)
 */
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      res.status(400);
      return next(new Error("Invalid appointment status."));
    }

    const updatedAppt = await appointmentService.changeAppointmentStatus(id, status);

    await logActivity(
      req.admin._id,
      "APPOINTMENT_STATUS_CHANGED",
      `Admin updated status of appointment: ${updatedAppt.appointmentId} to ${status}`,
      req
    );

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: updatedAppt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private (Admin Only)
 */
const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await appointmentService.deleteAppointmentSoft(id);

    await logActivity(
      req.admin._id,
      "APPOINTMENT_DELETED",
      `Admin soft deleted appointment: ${deleted.appointmentId}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Appointment record soft deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
