const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");
const Setting = require("../models/Setting");
const Faq = require("../models/Faq");
const logActivity = require("../utils/logger");

// ==========================================
// 2. TESTIMONIALS
// ==========================================

const submitTestimonial = async (req, res, next) => {
  try {
    const { patientName, rating, comment } = req.body;

    if (!patientName || !rating || !comment) {
      res.status(400);
      return next(new Error("Please provide patientName, rating, and comment"));
    }

    const testimonial = await Testimonial.create({
      patientName,
      rating,
      comment,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted and is pending review.",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    // Public gets approved testimonials only
    if (!req.user) {
      query.status = "approved";
    } else if (status) {
      query.status = status;
    }

    const skipIndex = (page - 1) * limit;
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skipIndex);

    const total = await Testimonial.countDocuments(query);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      totalPages: Math.ceil(total / limit),
      total,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

const reviewTestimonial = async (req, res, next) => {
  try {
    const { status } = req.body; // approved or rejected
    if (!["approved", "rejected", "pending"].includes(status)) {
      res.status(400);
      return next(new Error("Invalid status type"));
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404);
      return next(new Error("Testimonial not found"));
    }

    testimonial.status = status;
    await testimonial.save();

    await logActivity(req.user._id, "TESTIMONIAL_REVIEWED", `Testimonial ID ${testimonial._id} reviewed status: ${status}`, req);

    res.status(200).json({
      success: true,
      message: `Testimonial status updated to ${status}.`,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. GALLERY IMAGES
// ==========================================

const getGalleryImages = async (req, res, next) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

const uploadGalleryImage = async (req, res, next) => {
  try {
    const { title, category, imageUrl, publicId } = req.body;

    if (!imageUrl || !publicId) {
      res.status(400);
      return next(new Error("Image URL and public ID are required (upload via Cloudinary on client side first)"));
    }

    const image = await Gallery.create({
      title,
      category,
      imageUrl,
      publicId,
    });

    await logActivity(req.user._id, "GALLERY_IMAGE_UPLOADED", `Uploaded gallery image: ${title || "Untitled"}`, req);

    res.status(201).json({
      success: true,
      message: "Image registered in gallery successfully.",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      res.status(404);
      return next(new Error("Image not found"));
    }

    await Gallery.findByIdAndDelete(req.params.id);

    await logActivity(req.user._id, "GALLERY_IMAGE_DELETED", `Deleted gallery image: ${image.title || "Untitled"}`, req);

    res.status(200).json({
      success: true,
      message: "Gallery image metadata deleted from database.",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. CLINIC SETTINGS
// ==========================================

const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Setting.create({});
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    // General
    settings.clinicName = req.body.clinicName !== undefined ? req.body.clinicName : settings.clinicName;
    settings.logo = req.body.logo !== undefined ? req.body.logo : settings.logo;
    settings.favicon = req.body.favicon !== undefined ? req.body.favicon : settings.favicon;

    // Contact
    settings.phone = req.body.phone !== undefined ? req.body.phone : settings.phone;
    settings.whatsapp = req.body.whatsapp !== undefined ? req.body.whatsapp : settings.whatsapp;
    settings.email = req.body.email !== undefined ? req.body.email : settings.email;
    settings.address = req.body.address !== undefined ? req.body.address : settings.address;
    settings.googleMapsUrl = req.body.googleMapsUrl !== undefined ? req.body.googleMapsUrl : settings.googleMapsUrl;

    // Working Hours
    if (req.body.workingHours) {
      settings.workingHours = {
        monFri: req.body.workingHours.monFri !== undefined ? req.body.workingHours.monFri : settings.workingHours.monFri,
        saturday: req.body.workingHours.saturday !== undefined ? req.body.workingHours.saturday : settings.workingHours.saturday,
        sunday: req.body.workingHours.sunday !== undefined ? req.body.workingHours.sunday : settings.workingHours.sunday,
      };
    }

    // Social Media
    if (req.body.socialMedia) {
      settings.socialMedia = {
        facebook: req.body.socialMedia.facebook !== undefined ? req.body.socialMedia.facebook : settings.socialMedia.facebook,
        instagram: req.body.socialMedia.instagram !== undefined ? req.body.socialMedia.instagram : settings.socialMedia.instagram,
        linkedin: req.body.socialMedia.linkedin !== undefined ? req.body.socialMedia.linkedin : settings.socialMedia.linkedin,
        youtube: req.body.socialMedia.youtube !== undefined ? req.body.socialMedia.youtube : settings.socialMedia.youtube,
      };
    }

    // Website / SEO
    settings.footerCopyright = req.body.footerCopyright !== undefined ? req.body.footerCopyright : settings.footerCopyright;
    settings.seoTitle = req.body.seoTitle !== undefined ? req.body.seoTitle : settings.seoTitle;
    settings.seoDescription = req.body.seoDescription !== undefined ? req.body.seoDescription : settings.seoDescription;

    const updated = await settings.save();

    await logActivity(req.admin._id, "CLINIC_SETTINGS_UPDATED", "Updated clinic configurations.", req);

    res.status(200).json({
      success: true,
      message: "Clinic settings updated successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. FAQ ACTIONS
// ==========================================

const getFaqs = async (req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const { question, answer, category, order } = req.body;
    const newFaq = await Faq.create({ question, answer, category, order });
    res.status(201).json({
      success: true,
      message: "FAQ created successfully.",
      data: newFaq,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitTestimonial,
  getTestimonials,
  reviewTestimonial,
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  getSettings,
  updateSettings,
  getFaqs,
  createFaq,
};
