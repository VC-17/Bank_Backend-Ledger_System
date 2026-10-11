import nodemailer from "nodemailer";

//transporter is used to contact the SMTP server and send emails. It is configured with the email service provider's settings and authentication credentials. In this case, we are using Gmail as the email service provider and OAuth2 for authentication.
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
// const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
//       to, // list of receivers
//       subject, // Subject line
//       text, // plain text body
//       html, // html body
//     });

//     console.log('Message sent: %s', info.messageId);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const context = `Hello ${name},\n\nThank you for registering at Backend Ledger.
    We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger.
    We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, context, html);
}

async function sendTransactionEmail(userEmail, name, amount , toAccount) {
  const subject = 'Transaction Notification';
  const text = `Hello ${name},\n\nA transaction of amount ${amount} has been made to account ${toAccount}.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>A transaction of amount ${amount} has been made to account ${toAccount}.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount , toAccount) {
  const subject = 'Transaction Failure Notification';
  const text = `Hello ${name},\n\nWe regret to inform you that a transaction of amount ${amount} to account ${toAccount} has failed.\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that a transaction of amount ${amount} to account ${toAccount} has failed.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

export default sendRegistrationEmail;
export {sendTransactionEmail, sendTransactionFailureEmail}

