const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


const sendPasswordResetOTP = async (email, otp) => {

  const mailOptions = {
    from: `"Civic Issue Tracker" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Civic Issue Tracker - Password Reset OTP",

    text: `Your password reset OTP is ${otp}. It is valid for 10 minutes. Do not share this OTP with anyone.`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2>Civic Issue Tracker</h2>

        <p>You requested to reset your password.</p>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          Do not share this OTP with anyone.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {
  sendPasswordResetOTP,
};