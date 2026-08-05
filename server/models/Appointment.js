const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time slot is required"],
      trim: true,
    },
    reasonForVisit: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
      trim: true,
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

// Indexes
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ preferredDate: 1 });

// Pre-save sequencer hook (APPT-00001)
appointmentSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    try {
      const lastAppt = await mongoose.model("Appointment").findOne(
        { appointmentId: { $exists: true } },
        { appointmentId: 1 },
        { sort: { appointmentId: -1 } }
      );

      let nextNum = 1;
      if (lastAppt && lastAppt.appointmentId) {
        const lastNum = parseInt(lastAppt.appointmentId.replace("APPT-", ""), 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }
      this.appointmentId = `APPT-${String(nextNum).padStart(5, "0")}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
