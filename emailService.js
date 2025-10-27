const nodemailer = require("nodemailer");

const sendVerificationEmail = async (recipientEmail, recipientName) => {
  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Your SaaS Team" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Welcome to Our SaaS! Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hi ${recipientName},</h2>
          <p>Thank you for signing up for our SaaS platform! 🎉</p>
          <p>Please click the button below to verify your email and access your dashboard:</p>
          <a href="https://yourwebsite.com/verify?email=${encodeURIComponent(recipientEmail)}" 
             style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: #fff; text-decoration: none; border-radius: 8px;">
             Verify My Email
          </a>
          <p>If you didn’t request this, please ignore this message.</p>
          <p>The SaaS Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to: ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
