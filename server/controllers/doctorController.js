const Doctor = require("../models/Doctor");
const User = require("../models/User");
const logActivity = require("../utils/logger");

/**
 * @desc    Get all doctors (with pagination, search, filter)
 * @route   GET /api/doctors
 * @access  Public / Private
 */
const getDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, specialization, status } = req.query;
    
    // Build query filters
    const query = {};

    // For public users, only show active doctors
    if (!req.user) {
      query.status = "active";
    } else if (status) {
      query.status = status;
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    // Pagination
    const skipIndex = (page - 1) * limit;

    // We need to query Doctor and populate User info
    // If search by name is requested, we first find matching Users, then filter Doctors
    let userIds = [];
    if (search) {
      const users = await User.find({
        role: "doctor",
        name: { $regex: search, $options: "i" },
      }).select("_id");
      userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }

    const doctors = await Doctor.find(query)
      .populate("user", "name email phone role status")
      .limit(Number(limit))
      .skip(skipIndex);

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: doctors.length,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single doctor profile
 * @route   GET /api/doctors/:id
 * @access  Public / Private
 */
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "name email phone role status");

    if (!doctor) {
      res.status(404);
      return next(new Error("Doctor not found"));
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a doctor profile & login user credentials
 * @route   POST /api/doctors
 * @access  Private (Admin Only)
 */
const createDoctor = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, experience, bio, consultationFee, availability } = req.body;

    if (!name || !email || !password || !specialization || experience === undefined) {
      res.status(400);
      return next(new Error("Please enter all required fields: name, email, password, specialization, experience"));
    }

    // 1. Check if user credentials already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error("A user account with this email already exists"));
    }

    // 2. Create the User auth profile
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "doctor",
    });

    // 3. Create the Doctor Profile
    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      experience,
      bio,
      consultationFee: consultationFee || 0,
      availability: availability || [],
    });

    await logActivity(req.user._id, "DOCTOR_PROFILE_CREATED", `Admin created doctor profile for: ${email}`, req);

    res.status(201).json({
      success: true,
      message: "Doctor profile and user account created successfully.",
      data: {
        id: doctor._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        availability: doctor.availability,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update doctor profile
 * @route   PUT /api/doctors/:id
 * @access  Private (Admin or Specific Doctor)
 */
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      return next(new Error("Doctor not found"));
    }

    // Check Authorization: Admin or the Doctor who owns this profile
    if (req.user.role !== "admin" && req.user._id.toString() !== doctor.user.toString()) {
      res.status(403);
      return next(new Error("Not authorized to update this doctor profile"));
    }

    // Update Doctor profile properties
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience !== undefined ? req.body.experience : doctor.experience;
    doctor.bio = req.body.bio || doctor.bio;
    doctor.consultationFee = req.body.consultationFee !== undefined ? req.body.consultationFee : doctor.consultationFee;
    doctor.availability = req.body.availability || doctor.availability;
    doctor.status = req.body.status || doctor.status;

    await doctor.save();

    // Optionally update user properties (name, phone)
    const user = await User.findById(doctor.user);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
    }

    await logActivity(req.user._id, "DOCTOR_PROFILE_UPDATED", `Updated doctor profile ID: ${doctor._id}`, req);

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully.",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate Doctor profile (Soft Delete)
 * @route   DELETE /api/doctors/:id
 * @access  Private (Admin Only)
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      return next(new Error("Doctor not found"));
    }

    // Deactivate doctor
    doctor.status = "inactive";
    await doctor.save();

    // Deactivate associated user credentials
    const user = await User.findById(doctor.user);
    if (user) {
      user.status = "inactive";
      await user.save();
    }

    await logActivity(req.user._id, "DOCTOR_PROFILE_DEACTIVATED", `Deactivated doctor profile ID: ${doctor._id}`, req);

    res.status(200).json({
      success: true,
      message: "Doctor profile deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
