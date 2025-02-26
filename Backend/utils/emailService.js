import nodemailer from 'nodemailer';
import { createWelcomeEmailTemplate } from '../utils/emailTemplates.js';

export const sendOTPEmail = async (req, res) => {
  try {
    const { title, uid, description, recipientEmail } = req.body;

    // Basic validations
    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing title" });
    }
    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing uid" });
    }
    if (!description || typeof description !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing description" });
    }
    if (!recipientEmail || typeof recipientEmail !== "string" || !/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid or missing recipientEmail" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // Generate email template dynamically
    const clientURL = process.env.CLIENT_URL || "https://yourclienturl.com";
    const emailTemplate = createWelcomeEmailTemplate({ title, uid, recipientEmail, clientURL });

    // Email content
    const mailOptions = {
      from: `Classcify <${process.env.SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: title,
      html: emailTemplate,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully", info });
  } catch (err) {
    console.error("sendOTPEmail error:", err);
    res.status(500).json({ success: false, message: "Error sending invitation email", error: err.message });
  }
};
