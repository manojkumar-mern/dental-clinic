/**
 * Seed Script: Dental Services
 * Seeds all standard dental services into MongoDB.
 * Safe to run multiple times — skips services that already exist by slug.
 *
 * Usage: node seedServices.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./models/Service");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dental-clinic-management";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const DENTAL_SERVICES = [
  {
    title: "Preventative Care",
    shortDescription:
      "Comprehensive cleanings, digital diagnostics, and custom cavity prevention maps to keep your smile healthy long-term.",
    image: "/images/book_appointment.png",
    icon: "ShieldCheck",
    displayOrder: 1,
  },
  {
    title: "Dental Implants",
    shortDescription:
      "Permanent titanium root replacements with CAD-mapped crowns that look, feel, and function exactly like natural teeth.",
    image: "/images/implant_graphic.png",
    icon: "Heart",
    displayOrder: 2,
  },
  {
    title: "Clear Aligners",
    shortDescription:
      "Virtually invisible teeth alignment using certified Invisalign pathways for a confident, straighter smile without braces.",
    image: "/images/clear_aligners.png",
    icon: "Compass",
    displayOrder: 3,
  },
  {
    title: "Cosmetic Makeovers",
    shortDescription:
      "Enhance your smile with porcelain veneers, teeth whitening, and premium composite bonding treatments.",
    image: "/images/patient_smile.png",
    icon: "Sparkles",
    displayOrder: 4,
  },
  {
    title: "Root Canal Treatment",
    shortDescription:
      "Painless microscopic nerve-saving therapies that relieve acute toothache and preserve your natural root structure.",
    image: "/images/tooth_pain.png",
    icon: "Activity",
    displayOrder: 5,
  },
  {
    title: "Pediatric Dentistry",
    shortDescription:
      "Gentle, comfort-first dental check-ups and protective sealant therapies designed specifically for children.",
    image: "/images/kids_dental.png",
    icon: "Smile",
    displayOrder: 6,
  },
  {
    title: "Emergency Dental Care",
    shortDescription:
      "Same-day priority slots for unexpected dental pain, cracked teeth, lost fillings, or dental trauma.",
    image: "/images/emergency_dental.png",
    icon: "AlertTriangle",
    displayOrder: 7,
  },
  {
    title: "Laser Dentistry",
    shortDescription:
      "Suture-free, drill-free soft tissue therapies for gum reshaping and cavity treatment with faster healing.",
    image: "/images/tooth_hologram.png",
    icon: "Shield",
    displayOrder: 8,
  },
  {
    title: "Dental Braces",
    shortDescription:
      "Traditional metal or ceramic orthodontic brackets for precise, reliable alignment correction at any age.",
    image: "/images/clear_aligners.png",
    icon: "Grid",
    displayOrder: 9,
  },
  {
    title: "Dental Crown & Bridge",
    shortDescription:
      "CAD/CAM-milled protective caps and fixed bridges to restore damaged or missing teeth with precision fit.",
    image: "/images/implant_graphic.png",
    icon: "Award",
    displayOrder: 10,
  },
  {
    title: "Teeth Whitening",
    shortDescription:
      "Professional-grade in-clinic and take-home whitening systems to brighten your smile by several shades safely.",
    image: "/images/teeth_whitening.png",
    icon: "Star",
    displayOrder: 11,
  },
  {
    title: "Gum Treatment",
    shortDescription:
      "Advanced periodontal deep-cleaning therapies targeting gum disease, pocket reduction, and long-term gum health.",
    image: "/images/tooth_hologram.png",
    icon: "HeartPulse",
    displayOrder: 12,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected.");

    let created = 0;
    let updated = 0;

    for (const svc of DENTAL_SERVICES) {
      const slug = slugify(svc.title);
      const exists = await Service.findOne({ slug });
      if (exists) {
        exists.image = svc.image;
        exists.icon = svc.icon;
        exists.displayOrder = svc.displayOrder;
        exists.shortDescription = svc.shortDescription;
        await exists.save();
        console.log(`   ⚙️  Updated (existing): ${svc.title}`);
        updated++;
      } else {
        await Service.create({ ...svc, slug, status: "Active" });
        console.log(`   ✅ Created: ${svc.title}`);
        created++;
      }
    }

    console.log(`\n🎉 Done. Created: ${created}  Updated: ${updated}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
