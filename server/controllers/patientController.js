const patientService = require("../services/patientService");
const logActivity = require("../utils/logger");

/**
 * @desc    Get all patients with filters
 * @route   GET /api/patients
 * @access  Private (Admin Only)
 */
const getPatients = async (req, res, next) => {
  try {
    const { search, status, page, limit } = req.query;

    const result = await patientService.getAllPatients({
      search,
      status,
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
 * @desc    Get single patient by ID (with placeholder appointment history)
 * @route   GET /api/patients/:id
 * @access  Private (Admin Only)
 */
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);

    // Placeholder appointment history (Phase 4 integration target)
    const appointmentsPlaceholder = [
      {
        _id: "appointment-placeholder-1",
        date: "2026-08-10",
        timeSlot: "10:30 AM",
        doctor: { name: "Dr. Richard Vance" },
        treatment: { name: "Routine Checkup" },
        status: "Scheduled",
      },
      {
        _id: "appointment-placeholder-2",
        date: "2026-06-15",
        timeSlot: "02:00 PM",
        doctor: { name: "Dr. Richard Vance" },
        treatment: { name: "Dental Filling" },
        status: "Completed",
      },
    ];

    res.status(200).json({
      success: true,
      patient,
      appointments: appointmentsPlaceholder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new patient record
 * @route   POST /api/patients
 * @access  Private (Admin Only)
 */
const createPatient = async (req, res, next) => {
  try {
    const { name, phone, email, dateOfBirth, gender, address, notes, status } = req.body;

    const patient = await patientService.createPatient({
      name,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      notes,
      status,
    });

    // Log admin action
    await logActivity(
      req.admin._id,
      "PATIENT_CREATED",
      `Created patient record for: ${name} (ID: ${patient.patientId})`,
      req
    );

    res.status(201).json({
      success: true,
      message: "Patient record created successfully.",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a patient record
 * @route   PUT /api/patients/:id
 * @access  Private (Admin Only)
 */
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, dateOfBirth, gender, address, notes, status } = req.body;

    const updatedPatient = await patientService.updatePatient(id, {
      name,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      notes,
      status,
    });

    // Log admin action
    await logActivity(
      req.admin._id,
      "PATIENT_UPDATED",
      `Updated patient record: ${updatedPatient.name} (ID: ${updatedPatient.patientId})`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Patient record updated successfully.",
      patient: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete a patient record
 * @route   DELETE /api/patients/:id
 * @access  Private (Admin Only)
 */
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await patientService.deletePatientSoft(id);

    // Log admin action
    await logActivity(
      req.admin._id,
      "PATIENT_DELETED",
      `Soft deleted patient record: ${deleted.name} (ID: ${deleted.patientId})`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Patient record soft deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
