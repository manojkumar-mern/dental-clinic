const Patient = require("../models/Patient");

/**
 * Find a patient by phone or create one if they do not exist.
 */
const findOrCreatePatientByPhone = async (name, phone) => {
  let patient = await Patient.findOne({ phone, isDeleted: { $ne: true } });
  if (!patient) {
    patient = await Patient.create({
      name,
      phone,
      status: "Active",
    });
  }
  return patient;
};

/**
 * Create a new patient
 */
const createPatient = async (data) => {
  // Check if active patient with same phone already exists
  const existingPatient = await Patient.findOne({
    phone: data.phone,
    isDeleted: { $ne: true },
  });

  if (existingPatient) {
    throw new Error("A patient with this mobile number already exists.");
  }

  return await Patient.create(data);
};

/**
 * Get all patients with search, status filtering, pagination, and sorting
 */
const getAllPatients = async (options = {}) => {
  const { search, status, page = 1, limit = 10 } = options;

  const query = { isDeleted: { $ne: true } };

  // Status Filter
  if (status) {
    query.status = status;
  }

  // Search Filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { patientId: { $regex: search, $options: "i" } },
    ];
  }

  const skipIndex = (page - 1) * limit;

  // Sorting: newest registration first
  const patients = await Patient.find(query)
    .sort({ createdAt: -1 })
    .skip(skipIndex)
    .limit(Number(limit));

  const total = await Patient.countDocuments(query);

  return {
    patients,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single patient record by ID
 */
const getPatientById = async (id) => {
  const patient = await Patient.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!patient) {
    throw new Error("Patient record not found.");
  }
  return patient;
};

/**
 * Update a patient record
 */
const updatePatient = async (id, data) => {
  const patient = await Patient.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!patient) {
    throw new Error("Patient record not found.");
  }

  // Check phone uniqueness if changing
  if (data.phone && data.phone !== patient.phone) {
    const phoneExists = await Patient.findOne({
      phone: data.phone,
      isDeleted: { $ne: true },
    });
    if (phoneExists) {
      throw new Error("Another patient is already registered with this mobile number.");
    }
  }

  return await Patient.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Soft delete a patient record
 */
const deletePatientSoft = async (id) => {
  const patient = await Patient.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!patient) {
    throw new Error("Patient record not found.");
  }

  patient.isDeleted = true;
  patient.deletedAt = Date.now();
  await patient.save();

  return patient;
};

module.exports = {
  findOrCreatePatientByPhone,
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatientSoft,
};
