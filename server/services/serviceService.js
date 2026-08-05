const Service = require("../models/Service");

// Helper to slugify strings
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Helper to generate a unique slug
const makeUniqueSlug = async (title, excludeId = null) => {
  let slug = slugify(title);
  let count = 0;
  
  const query = { slug, isDeleted: { $ne: true } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  while (await Service.findOne(query)) {
    count++;
    slug = `${slugify(title)}-${count}`;
    query.slug = slug;
  }
  return slug;
};

/**
 * Create a new service
 */
const createService = async (data) => {
  const slug = await makeUniqueSlug(data.title);
  const serviceData = { ...data, slug };
  
  return await Service.create(serviceData);
};

/**
 * Get all services (handles search, status filtering, pagination, and sorting)
 */
const getAllServices = async (options = {}) => {
  const { search, status, page = 1, limit = 10 } = options;
  
  const query = { isDeleted: { $ne: true } };

  // Status Filter
  if (status) {
    query.status = status;
  }

  // Search Filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
    ];
  }

  const skipIndex = (page - 1) * limit;

  // Sorting: displayOrder ascending, then createdAt descending
  const services = await Service.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skipIndex)
    .limit(Number(limit));

  const total = await Service.countDocuments(query);

  return {
    services,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a specific service by ID or Slug
 */
const getServiceByIdOrSlug = async (idOrSlug) => {
  const query = { isDeleted: { $ne: true } };
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    query._id = idOrSlug;
  } else {
    query.slug = idOrSlug;
  }

  const service = await Service.findOne(query);
  if (!service) {
    throw new Error("Service not found.");
  }
  return service;
};

/**
 * Update service details
 */
const updateService = async (id, data) => {
  const service = await Service.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!service) {
    throw new Error("Service not found.");
  }

  // Generate new slug if title has changed
  if (data.title && data.title !== service.title) {
    data.slug = await makeUniqueSlug(data.title, id);
  }

  return await Service.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Soft delete a service
 */
const deleteServiceSoft = async (id) => {
  const service = await Service.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!service) {
    throw new Error("Service not found.");
  }

  service.isDeleted = true;
  service.deletedAt = Date.now();
  await service.save();

  return service;
};

module.exports = {
  createService,
  getAllServices,
  getServiceByIdOrSlug,
  updateService,
  deleteServiceSoft,
};
