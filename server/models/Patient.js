const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Patient full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Mobile phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for lookup
patientSchema.index({ phone: 1 });

// Pre-save hook to generate sequential Patient ID (PAT-00001)
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    try {
      const lastPatient = await mongoose.model("Patient").findOne(
        { patientId: { $exists: true } },
        { patientId: 1 },
        { sort: { patientId: -1 } }
      );

      let nextNum = 1;
      if (lastPatient && lastPatient.patientId) {
        const lastNum = parseInt(lastPatient.patientId.replace("PAT-", ""), 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }
      this.patientId = `PAT-${String(nextNum).padStart(5, "0")}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
