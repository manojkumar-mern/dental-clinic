const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const patientService = require("./patientService");
const {
  sendAppointmentReceiptEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentCancellationEmail,
} = require("./emailService");
const { createNotification } = require("./notificationService");

/**
 * Public/Admin Consultation Booking
 */
const bookAppointment = async (data) => {
  const { name, phone, email, service, preferredDate, preferredTime, reasonForVisit } = data;

  // 1. Resolve Patient (checks if phone exists; creates patient if not)
  const patient = await patientService.findOrCreatePatientByPhone(name, phone);

  // If email was provided and patient doesn't have email, update it
  if (email && !patient.email) {
    patient.email = email;
    await patient.save();
  }

  // 2. Create Appointment linked to Patient
  const appointment = await Appointment.create({
    patient: patient._id,
    service,
    preferredDate,
    preferredTime,
    reasonForVisit,
    status: "Pending",
  });

  // Populate details and trigger receipt email dispatch
  const populated = await appointment.populate("patient service");
  sendAppointmentReceiptEmail(populated).catch((err) =>
    console.error("Receipt email dispatch failed:", err)
  );

  createNotification({
    title: "New Appointment Request",
    message: `A new appointment request (${populated.appointmentId}) was submitted by ${populated.patient.name}.`,
    type: "appointment",
  }).catch((err) => console.error("Notification creation failed:", err));

  return appointment;
};

/**
 * Get all appointments with search, filters, pagination, and sorting
 */
const getAllAppointments = async (options = {}) => {
  const { search, status, date, page = 1, limit = 10 } = options;

  const query = { isDeleted: { $ne: true } };

  // Status Filter
  if (status) {
    query.status = status;
  }

  // Date Filter
  if (date) {
    // exact day match
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.preferredDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  // Search Filter (look up matching patients first)
  if (search) {
    const matchingPatients = await Patient.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const patientIds = matchingPatients.map((p) => p._id);

    query.$or = [
      { appointmentId: { $regex: search, $options: "i" } },
      { patient: { $in: patientIds } },
    ];
  }

  const skipIndex = (page - 1) * limit;

  // Sort by preferredDate ascending, preferredTime ascending
  const appointments = await Appointment.find(query)
    .populate("patient")
    .populate("service")
    .sort({ preferredDate: 1, preferredTime: 1 })
    .skip(skipIndex)
    .limit(Number(limit));

  const total = await Appointment.countDocuments(query);

  return {
    appointments,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get single appointment by ID
 */
const getAppointmentById = async (id) => {
  const appt = await Appointment.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("patient")
    .populate("service");

  if (!appt) {
    throw new Error("Appointment not found.");
  }
  return appt;
};

/**
 * Update appointment details (rescheduling, notes)
 */
const updateAppointment = async (id, data) => {
  const appt = await Appointment.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!appt) {
    throw new Error("Appointment not found.");
  }

  return await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("patient")
    .populate("service");
};

/**
 * Change appointment status
 */
const changeAppointmentStatus = async (id, status) => {
  const appt = await Appointment.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!appt) {
    throw new Error("Appointment not found.");
  }

  const oldStatus = appt.status;
  appt.status = status;
  await appt.save();

  const populated = await appt.populate("patient service");

  // Send status change notifications
  if (status === "Confirmed" && oldStatus !== "Confirmed") {
    sendAppointmentConfirmationEmail(populated).catch((err) =>
      console.error("Confirmation email dispatch failed:", err)
    );
    createNotification({
      title: "Appointment Confirmed",
      message: `Appointment ${populated.appointmentId} for ${populated.patient.name} has been confirmed.`,
      type: "appointment",
    }).catch((err) => console.error("Notification creation failed:", err));
  } else if (status === "Cancelled" && oldStatus !== "Cancelled") {
    sendAppointmentCancellationEmail(populated).catch((err) =>
      console.error("Cancellation email dispatch failed:", err)
    );
    createNotification({
      title: "Appointment Cancelled",
      message: `Appointment ${populated.appointmentId} for ${populated.patient.name} has been cancelled.`,
      type: "appointment",
    }).catch((err) => console.error("Notification creation failed:", err));
  }

  return populated;
};

/**
 * Soft delete appointment
 */
const deleteAppointmentSoft = async (id) => {
  const appt = await Appointment.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!appt) {
    throw new Error("Appointment not found.");
  }

  appt.isDeleted = true;
  appt.deletedAt = Date.now();
  await appt.save();

  return appt;
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  changeAppointmentStatus,
  deleteAppointmentSoft,
};
