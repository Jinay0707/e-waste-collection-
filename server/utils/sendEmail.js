const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // If SMTP credentials exist, use them; otherwise use ethereal/test transporter or log it
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `"E-Waste Collection Portal" <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    return await transporter.sendMail(message);
  } else {
    console.warn("⚠️ SMTP_EMAIL or SMTP_PASSWORD not set in server/.env");
    console.log(`Simulating email to: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    return { simulated: true };
  }
};

module.exports = sendEmail;
