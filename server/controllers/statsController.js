const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Service = require("../models/Service");
const ActivityLog = require("../models/ActivityLog");
const ContactMessage = require("../models/ContactMessage");

/**
 * @desc    Get dashboard metrics & summary statistics (Admin Only)
 * @route   GET /api/stats/dashboard
 * @access  Private (Admin Only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core Counts
    const totalPatients = await Patient.countDocuments({ isDeleted: { $ne: true } });
    const totalDoctors = await Doctor.countDocuments({ isDeleted: { $ne: true }, status: "active" });
    const totalServices = await Service.countDocuments({ isDeleted: { $ne: true }, status: "Active" });
    const totalAppointments = await Appointment.countDocuments({ isDeleted: { $ne: true } });

    // 2. Appointment status breakdown
    const appointmentsGrouped = await Appointment.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusBreakdown = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };
    
    appointmentsGrouped.forEach((item) => {
      if (statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // 3. Estimated Revenue (Sum of Completed consultations with flat average)
    const estimatedRevenue = statusBreakdown.Completed * 150; // $150 average dental consultation checkup fee

    // 4. Recent Appointments list
    const recentAppointments = await Appointment.find({ isDeleted: { $ne: true } })
      .populate("patient", "name phone email")
      .populate("service", "title icon")
      .sort({ preferredDate: -1, preferredTime: -1 })
      .limit(5);

    // 5. Recent System Logs
    const recentLogs = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Recent Contact Messages
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalPatients,
          totalDoctors,
          totalServices,
          totalAppointments,
          estimatedRevenue,
        },
        statusBreakdown,
        recentAppointments,
        recentLogs,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed activity logs list (Admin Only)
 * @route   GET /api/stats/logs
 * @access  Private (Admin Only)
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }

    const skipIndex = (page - 1) * limit;

    const logs = await ActivityLog.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skipIndex);

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivityLogs,
};
