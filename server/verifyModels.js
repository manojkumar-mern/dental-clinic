try {
  require("./models/Doctor");
  require("./models/Patient");
  require("./models/Appointment");
  require("./models/Service");
  require("./models/Testimonial");
  require("./models/ContactMessage");
  require("./models/Gallery");
  require("./models/Faq");
  require("./models/Setting");
  require("./models/Notification");
  require("./models/ActivityLog");
  console.log("All 11 Mongoose models compiled and validated successfully!");
  process.exit(0);
} catch (error) {
  console.error("Mongoose model validation failed:", error.message);
  process.exit(1);
}
