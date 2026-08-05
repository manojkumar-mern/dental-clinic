const nodemailer = require("nodemailer");

/**
 * Send an email using SMTP transport or log mock email to console in development
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.message - Text/HTML body of the email
 */
const sendEmail = async (options) => {
  const isMockEnv =
    !process.env.EMAIL_HOST ||
    process.env.EMAIL_USER === "your_email_user" ||
    process.env.EMAIL_PASS === "your_email_password";

  if (isMockEnv || process.env.NODE_ENV === "test") {
    console.log("\n==================================================");
    console.log("📨 [MOCK EMAIL DISPATCH]");
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.message.replace(/<[^>]*>/g, "")}`);
    console.log("==================================================\n");
    return { success: true, message: "Mock email logged successfully." };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || "Aura Dental Clinic"} <${process.env.EMAIL_FROM || "noreply@auradental.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message.replace(/<[^>]*>/g, ""),
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

/**
 * Sends receipt acknowledgment email to patient
 */
const sendAppointmentReceiptEmail = async (appt) => {
  if (!appt.patient || !appt.patient.email) return;

  const clinicName = process.env.CLINIC_NAME || "Aura Dental Clinic";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f1f1f1; border-radius: 8px; padding: 24px;">
      <h2 style="color: #0ea5e9;">${clinicName.toUpperCase()}</h2>
      <p>Hello <strong>${appt.patient.name}</strong>,</p>
      <p>Thank you for scheduling a consultation with Aura Dental. We have received your request and it is currently awaiting confirmation from our care coordinator.</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0;">Consultation Details</h3>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 0;">
          <li><strong>Booking ID:</strong> ${appt.appointmentId}</li>
          <li><strong>Preferred Date:</strong> ${new Date(appt.preferredDate).toLocaleDateString()}</li>
          <li><strong>Time Slot:</strong> ${appt.preferredTime}</li>
          <li><strong>Reason for Visit:</strong> ${appt.reasonForVisit || "Not specified"}</li>
        </ul>
      </div>
      <p>We will contact you shortly at ${appt.patient.phone} to confirm details. Thank you for choosing us.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">This is an automated request acknowledgment. Please do not reply directly to this mail.</p>
    </div>
  `;

  await sendEmail({
    email: appt.patient.email,
    subject: `Appointment Request Received - ${appt.appointmentId}`,
    message: html,
  });
};

/**
 * Sends official confirmation email to patient
 */
const sendAppointmentConfirmationEmail = async (appt) => {
  if (!appt.patient || !appt.patient.email) return;

  const clinicName = process.env.CLINIC_NAME || "Aura Dental Clinic";
  const clinicAddress = process.env.CLINIC_ADDRESS || "123 Dental Lane, Suite 100, New York";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f1f1f1; border-radius: 8px; padding: 24px;">
      <h2 style="color: #10b981;">${clinicName.toUpperCase()}</h2>
      <p>Hello <strong>${appt.patient.name}</strong>,</p>
      <p>Your appointment request has been officially <strong>CONFIRMED</strong> by Aura Dental. We look forward to seeing you at your scheduled slot.</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #047857;">Appointment Details</h3>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 0;">
          <li><strong>Appointment ID:</strong> ${appt.appointmentId}</li>
          <li><strong>Date:</strong> ${new Date(appt.preferredDate).toLocaleDateString()}</li>
          <li><strong>Confirmed Time:</strong> ${appt.preferredTime}</li>
          <li><strong>Service:</strong> ${appt.service ? appt.service.title : "Dental Consultation"}</li>
        </ul>
      </div>
      ${appt.adminNotes ? `<p><strong>Clinic Notes:</strong> ${appt.adminNotes}</p>` : ""}
      <p>If you need to reschedule or cancel, please contact our front desk at least 24 hours in advance.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">${clinicAddress}</p>
    </div>
  `;

  await sendEmail({
    email: appt.patient.email,
    subject: `Appointment Confirmed! - ${appt.appointmentId}`,
    message: html,
  });
};

/**
 * Sends cancellation email to patient
 */
const sendAppointmentCancellationEmail = async (appt) => {
  if (!appt.patient || !appt.patient.email) return;

  const clinicEmail = process.env.EMAIL_FROM || "care@auradental.com";
  const clinicName = process.env.CLINIC_NAME || "Aura Dental Clinic";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f1f1f1; border-radius: 8px; padding: 24px;">
      <h2 style="color: #ef4444;">${clinicName.toUpperCase()}</h2>
      <p>Hello <strong>${appt.patient.name}</strong>,</p>
      <p>Your scheduled appointment has been <strong>CANCELLED</strong>.</p>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #b91c1c;">Cancelled Booking Details</h3>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 0;">
          <li><strong>Appointment ID:</strong> ${appt.appointmentId}</li>
          <li><strong>Original Date:</strong> ${new Date(appt.preferredDate).toLocaleDateString()}</li>
          <li><strong>Original Time:</strong> ${appt.preferredTime}</li>
        </ul>
      </div>
      <p>If you did not request this cancellation or would like to reschedule, please contact our support staff.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">${clinicName} • ${clinicEmail}</p>
    </div>
  `;

  await sendEmail({
    email: appt.patient.email,
    subject: `Appointment Cancelled - ${appt.appointmentId}`,
    message: html,
  });
};

module.exports = {
  sendEmail,
  sendAppointmentReceiptEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentCancellationEmail,
};
