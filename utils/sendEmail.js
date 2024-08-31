const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create reuable transporter object using the default SMTP transporter
  console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_EMAIL);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_Email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  // console.log('message sent: $s', info);
};

module.exports = sendEmail;
