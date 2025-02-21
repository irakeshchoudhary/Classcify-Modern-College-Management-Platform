import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

if (!accountSid || !authToken || !fromNumber) {
  console.error("❌ Twilio Credentials Missing! Check your .env file.");
  process.exit(1); // Stop the server if credentials are missing
}

const client = twilio(accountSid, authToken);

export const sendOTP = async (to, otp) => {
  try {
    console.log(`📩 Sending OTP to: +91${to}`);
    const message = await client.messages.create({
      body: `Your Classcify OTP: ${otp} - Valid for 10 minutes`,
      from: fromNumber,
      to: `+91${to}`
    });
    console.log("✅ Twilio Message Sent:", message.sid);
    return true;
  } catch (err) {
    console.error("❌ Twilio Error:", err);
    return false;
  }
};
