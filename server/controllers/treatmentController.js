const Treatment = require("../models/Treatment");
const logActivity = require("../utils/logger");

/**
 * @desc    Get all treatments (with pagination, filtering, search)
 * @route   GET /api/treatments
 * @access  Public / Private
 */
const getTreatments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sort } = req.query;
    const query = {};

    // For public requests, only return active treatments
    // If req.user is undefined or not authenticated, restrict to active
    if (!req.user) {
      query.status = "active";
    } else if (status) {
      query.status = status;
    }

    // Search query mapping
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Pagination
    const skipIndex = (page - 1) * limit;

    // Sorting
    let sortOptions = { name: 1 }; // Default alphabet sorting
    if (sort) {
      const parts = sort.split(":");
      sortOptions[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    const treatments = await Treatment.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skipIndex);

    const total = await Treatment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: treatments.length,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      data: treatments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single treatment by ID
 * @route   GET /api/treatments/:id
 * @access  Public / Private
 */
const getTreatmentById = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      res.status(404);
      return next(new Error("Treatment not found"));
    }

    res.status(200).json({
      success: true,
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new treatment
 * @route   POST /api/treatments
 * @access  Private (Admin Only)
 */
const createTreatment = async (req, res, next) => {
  try {
    const { name, description, duration, cost, status } = req.body;

    if (!name || !duration || cost === undefined) {
      res.status(400);
      return next(new Error("Please enter all required fields: name, duration, cost"));
    }

    const exists = await Treatment.findOne({ name });
    if (exists) {
      res.status(400);
      return next(new Error("Treatment name already exists"));
    }

    const treatment = await Treatment.create({
      name,
      description,
      duration,
      cost,
      status: status || "active",
    });

    await logActivity(req.user._id, "TREATMENT_CREATED", `Admin created treatment: ${name}`, req);

    res.status(201).json({
      success: true,
      message: "Treatment created successfully.",
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a treatment
 * @route   PUT /api/treatments/:id
 * @access  Private (Admin Only)
 */
const updateTreatment = async (req, res, next) => {
  try {
    let treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      res.status(404);
      return next(new Error("Treatment not found"));
    }

    treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await logActivity(req.user._id, "TREATMENT_UPDATED", `Admin updated treatment ID: ${treatment._id}`, req);

    res.status(200).json({
      success: true,
      message: "Treatment updated successfully.",
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a treatment (Soft Delete: Toggle status to inactive)
 * @route   DELETE /api/treatments/:id
 * @access  Private (Admin Only)
 */
const deleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      res.status(404);
      return next(new Error("Treatment not found"));
    }

    // Soft delete by switching status
    treatment.status = "inactive";
    await treatment.save();

    await logActivity(req.user._id, "TREATMENT_DEACTIVATED", `Admin deactivated treatment ID: ${treatment._id}`, req);

    res.status(200).json({
      success: true,
      message: "Treatment deactivated successfully.",
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
};
