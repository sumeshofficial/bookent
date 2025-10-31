import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Sent OTP to Email
export const sendMail = async (recipient, otp, fullname) => {
  const companyName = "Bookent";
  const logoUrl =
    "https://firebasestorage.googleapis.com/v0/b/sel-resell-application.firebasestorage.app/o/products%2Fbookent-logo-white.png?alt=media&token=47bc5a0d-1de7-4ee0-ac2e-0dca162ed1c0";

  const mailOptions = {
    from: `${companyName} <${process.env.EMAIL}>`,
    to: recipient,
    subject: `Your OTP Code - ${companyName}`,
    html: getEmailTemplate(otp, companyName, logoUrl, fullname),
  };

  await transporter.sendMail(mailOptions);
};

// html for mail
function getEmailTemplate(otp, companyName, logoUrl, fullname) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #404040 !important;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #404040 !important;">
    <tr>
      <td style="padding: 20px;">
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #202020 !important; border-radius: 12px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #4f4f4f !important; padding: 30px; text-align: left; color: #ffffff !important;">
              <img src="${logoUrl}" alt="${companyName} Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Email Verification</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #ffffff !important; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Hello ${fullname} !</h2>
              
              <p style="color: #999999 !important; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                We received a request to verify your email address. Please use the following One-Time Password (OTP) to complete your verification:
              </p>

              <!-- OTP Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 10px 30px; border-radius: 8px;background-color: #2f2f2f !important; color: #ffffff !important; font-size: 14px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Important Notes -->
              <div style="background-color: #4f4f4f !important; border-left: 4px solid #1a1a1a !important; padding: 10px 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #f1f1f1 !important; font-size: 12px; line-height: 1.6; margin: 0;">
                  <strong>Important:</strong><br>
                  • This OTP is valid for <strong>5 minutes</strong><br>
                  • Do not share this code with anyone<br>
                  • If you didn't request this, please ignore this email
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #4f4f4f !important; padding: 20px; text-align: center; font-size: 12px; color: #f1f1f1 !important;">
              <p style="margin: 0 0 5px 0;">
                Best regards,<br>
                <strong style="color: #f1f1f1 !important;">${companyName} Team</strong>
              </p>
              <p style="margin: 0; line-height: 1.5;">
                This is an automated message, please do not reply.<br>
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
