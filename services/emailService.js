const nodemailer = require('nodemailer');
const moment = require('moment');

let transporter;

const createTransporter = async () => {
  // If Gmail credentials are not set, use Ethereal for testing
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n=== Using Ethereal Email for Testing ===');
    console.log('WARNING: Emails will not be delivered to real email addresses in test mode');
    console.log('To send real emails, please configure Gmail SMTP settings in .env:\n');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your.email@gmail.com');
    console.log('SMTP_PASS=your-app-specific-password\n');
    
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a testing transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('\nEthereal Email Test Credentials:');
    console.log('--------------------------------');
    console.log('Username:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('\nView sent emails at: https://ethereal.email');
    console.log('Login with the credentials above ☝️\n');
    
    return transporter;
  }

  // Use Gmail configuration
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
};

const sendAppointmentEmail = async (appointmentData) => {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }

    const { userInfo, doctorInfo, date, time } = appointmentData;
    const isTestMode = !process.env.SMTP_USER || !process.env.SMTP_PASS;

    // Format date and time for email
    const formattedDate = moment(date, "DD-MM-YYYY").format("dddd, MMMM Do YYYY");
    const formattedTime = moment(time, "HH:mm").format("h:mm A");

    const mailOptions = {
      from: `"Doctoro Appointments" <${transporter.options.auth.user}>`,
      to: userInfo.email,
      subject: 'Your Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${isTestMode ? '<div style="background: #fff3cd; color: #856404; padding: 15px; margin-bottom: 20px; border-radius: 5px; border: 1px solid #ffeeba;">⚠️ This is a test email. In production, this would be sent to: ${userInfo.email}</div>' : ''}
          <h2 style="color: #075e54;">Appointment Confirmation</h2>
          <p>Dear ${userInfo.name},</p>
          <p>Your appointment has been confirmed with the following details:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorInfo.firstName} ${doctorInfo.lastName}</li>
              <li style="margin: 10px 0;"><strong>Specialization:</strong> ${doctorInfo.specialization}</li>
              <li style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</li>
              <li style="margin: 10px 0;"><strong>Time:</strong> ${formattedTime}</li>
            </ul>
          </div>
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Please arrive 10 minutes before your scheduled time</li>
            <li>Bring any relevant medical records</li>
            <li>If you need to cancel or reschedule, please do so at least 24 hours in advance</li>
          </ul>
          <p style="color: #666;">Thank you for choosing our services!</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply to this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (isTestMode) {
      console.log('\n=== Test Email Details ===');
      console.log('Intended recipient:', userInfo.email);
      console.log('Preview URL:', info.previewURL);
      console.log('Note: Use the Ethereal credentials above to view the email');
      console.log('Message ID:', info.messageId);
    } else {
      console.log('Email sent successfully to:', userInfo.email);
    }

  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      code: error.code,
      response: error.response,
      auth: {
        user: transporter?.options?.auth?.user,
        isEthereal: transporter?.options?.host === 'smtp.ethereal.email'
      }
    });
    // Don't throw error as email sending is non-critical
  }
};

module.exports = {
  sendAppointmentEmail
}; 