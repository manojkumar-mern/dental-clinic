const serviceService = require("../services/serviceService");

/**
 * @desc    Get all services with filters
 * @route   GET /api/services
 * @access  Public
 */
const getServices = async (req, res, next) => {
  try {
    const { search, status, page, limit } = req.query;
    
    const result = await serviceService.getAllServices({
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
 * @desc    Get specific service by ID or Slug
 * @route   GET /api/services/:idOrSlug
 * @access  Public
 */
const getService = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const service = await serviceService.getServiceByIdOrSlug(idOrSlug);

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private (Admin Only)
 */
const createService = async (req, res, next) => {
  try {
    const { title, shortDescription, image, icon, displayOrder, status } = req.body;
    
    const newService = await serviceService.createService({
      title,
      shortDescription,
      image,
      icon,
      displayOrder,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service: newService,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update service details
 * @route   PUT /api/services/:id
 * @access  Private (Admin Only)
 */
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, image, icon, displayOrder, status } = req.body;

    const updatedService = await serviceService.updateService(id, {
      title,
      shortDescription,
      image,
      icon,
      displayOrder,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete a service
 * @route   DELETE /api/services/:id
 * @access  Private (Admin Only)
 */
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceService.deleteServiceSoft(id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle service status between Active / Inactive
 * @route   PATCH /api/services/:id/toggle
 * @access  Private (Admin Only)
 */
const toggleServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceByIdOrSlug(id);
    
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    const updatedService = await serviceService.updateService(id, { status: newStatus });

    res.status(200).json({
      success: true,
      message: `Service status toggled to ${newStatus}.`,
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
};
