import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ENV } from "../../config/env.conf.js";
dotenv.config();

const logo = ENV.LOGO_URL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
});

// Sent OTP to Email
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const companyName = "Bookent";

  const mailOptions = {
    from: `${companyName} <${ENV.EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};

// OTP Template
export const otpTemplate = (otp, fullname) => {
  return `
    <h2>Hello ${fullname}</h2>
    <p>Your OTP is: <strong>${otp}</strong></p>
  `;
};

// Rejection Template
export const rejectionTemplate = (fullname, reason) => {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background-color:#202020; padding:20px; color:white;">
  <div style="max-width:600px; margin:auto; background:#333; padding:20px; border-radius:8px;">
    <h2 style="color:#f56;">Organizer Request Rejected</h2>

    <p>Hi <strong>${fullname}</strong>,</p>

    <p>We reviewed your organizer request, but unfortunately it has been <strong>rejected</strong>.</p>

    <div style="margin:20px 0; padding:15px; background:#444; border-left:4px solid #f56;">
      <strong>Reason:</strong><br/>
      ${reason}
    </div>

    <p>If you believe this was a mistake, feel free to contact support.</p>

    <p style="margin-top:30px;">— Bookent Team</p>
  </div>
</body>
</html>
`;
};

// Ticket Booking Confirmation Template
export const bookingConfirmationTemplate = ({
  fullname,
  orderId,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  qty,
  orderAmount = null,
  discount = 0,
  totalAmount,
}) => {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color:#202020; padding:20px; color:white;">
  <div style="max-width:600px; margin:auto; background:#2b2b2b; padding:24px; border-radius:10px;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:20px;">
      <img src="${logo}" alt="Bookent" style="height:40px; margin-bottom:10px;" />
      <h2 style="color:#4ade80; margin:0;">Booking Confirmed 🎟️</h2>
    </div>

    <p>Hi <strong>${fullname}</strong>,</p>

    <p>
      Your booking has been <strong>successfully confirmed</strong>.
      Below are your ticket details.
    </p>

    <div style="text-align:center;margin-top:24px">
      <p style="font-size:14px;color:#555">Scan this QR code at the entry gate</p>
      <img src="cid:ticketqr" width="220" />
    </div>

    <!-- Booking Details -->
    <div style="background:#1f1f1f; padding:16px; border-radius:8px; margin:20px 0;">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Time:</strong> ${eventTime}</p>
      <p><strong>Venue:</strong> ${venue}</p>
      <p><strong>Tickets:</strong> ${qty}</p>
      ${orderAmount !== null ? `<p><strong>Order Amount:</strong> $${orderAmount}</p>` : ``}
      ${discount > 0 ? `<p style="color:#4ade80;"><strong>Coupon Discount:</strong> - $${discount}</p>` : ``}
      <p><strong>Total Paid:</strong> $${totalAmount}</p>
    </div>

    <p style="margin-top:20px;">
      Please keep this email for entry verification.  
      We’re excited to see you at the event!
    </p>

    <p style="margin-top:30px;">
      — <strong>Bookent Team</strong>
    </p>

    <hr style="border:none; border-top:1px solid #444; margin:30px 0;" />

    <p style="font-size:12px; color:#aaa; text-align:center;">
      © ${new Date().getFullYear()} Bookent. All rights reserved.
    </p>
  </div>
</body>
</html>
`;
};
