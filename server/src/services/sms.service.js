import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsOtp = async (phone, otp) => {
  try {
    const sms = await client.messages.create({
      body: `Bookent: Your verification code is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (error) {
    throw new Error('Error sending SMS:', error.message);
  }
};