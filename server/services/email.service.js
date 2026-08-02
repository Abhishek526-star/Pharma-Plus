const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP Connection Error:", error.message);
  } else {
    console.log("The SMTP server is ready to send emails.");
  }
});

const sendEmail = async (to, subject, html, replyTo = null) => {
  try {
    const mailOptions = {
      from: `"PharmaPlus Support" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;