const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      default: "Aura Dental Clinic",
      required: [true, "Clinic name is required"],
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
    // Contact
    phone: {
      type: String,
      default: "+1-555-019-2834",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "+1-555-019-2835",
      trim: true,
    },
    email: {
      type: String,
      default: "care@auradental.com",
      trim: true,
    },
    address: {
      type: String,
      default: "123 Dental Lane, Suite 100, New York, NY 10001",
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: "",
    },
    // Working Hours
    workingHours: {
      monFri: {
        type: String,
        default: "8:00 AM - 6:00 PM",
      },
      saturday: {
        type: String,
        default: "9:00 AM - 4:00 PM",
      },
      sunday: {
        type: String,
        default: "Closed",
      },
    },
    // Social Media
    socialMedia: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      youtube: {
        type: String,
        default: "",
      },
    },
    // Website
    footerCopyright: {
      type: String,
      default: "© 2026 Aura Dental Clinic. All rights reserved.",
    },
    seoTitle: {
      type: String,
      default: "Aura Dental Clinic - Modern Dental Care",
    },
    seoDescription: {
      type: String,
      default: "Experience state of the art premium dental care with CAD-mapped precision diagnostics.",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
