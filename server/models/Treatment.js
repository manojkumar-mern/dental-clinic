const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatmentCategory",
      required: [true, "Treatment category is required"],
    },
    name: {
      type: String,
      required: [true, "Treatment name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration (in minutes) is required"],
      min: [5, "Duration must be at least 5 minutes"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

treatmentSchema.index({ category: 1 });

// Mongoose query middleware to filter out soft-deleted documents
treatmentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Treatment", treatmentSchema);
