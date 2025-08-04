const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'orientalinsurance.demo@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Email templates
const policyApprovalTemplate = (policyData) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .policy-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
        .status-badge { background: #27ae60; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        .highlight { color: #667eea; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Policy Approved Successfully!</h1>
            <h2>Oriental Insurance Company</h2>
        </div>
        
        <div class="content">
            <h3>Dear ${policyData.customerName || policyData.fullName},</h3>
            
            <p>Congratulations! Your insurance policy application has been <span class="status-badge">APPROVED</span> and is now active.</p>
            
            <div class="policy-details">
                <h4>📋 Policy Details:</h4>
                <p><strong>Policy Number:</strong> <span class="highlight">${policyData.policyNumber}</span></p>
                <p><strong>Policy Type:</strong> ${policyData.policyType?.toUpperCase()} Insurance</p>
                <p><strong>Premium Amount:</strong> ₹${policyData.premium?.toLocaleString()}</p>
                <p><strong>Coverage Amount:</strong> ₹${policyData.coverageAmount?.toLocaleString()}</p>
                <p><strong>Policy Start Date:</strong> ${policyData.startDate}</p>
                <p><strong>Policy End Date:</strong> ${policyData.endDate}</p>
                <p><strong>Status:</strong> <strong style="color: #27ae60;">ACTIVE</strong></p>
            </div>

            <div class="policy-details">
                <h4>✨ Key Features:</h4>
                <ul>
                    ${policyData.features?.map(feature => `<li>${feature}</li>`).join('') || '<li>Comprehensive coverage as per policy terms</li>'}
                </ul>
            </div>

            <div class="policy-details">
                <h4>🎯 What's Next:</h4>
                <ul>
                    <li>Your policy is now active and coverage has commenced</li>
                    <li>Premium payment due within 30 days of policy start date</li>
                    <li>Download your policy documents from customer portal</li>
                    <li>Save this email and policy number for future reference</li>
                    <li>Contact us for any claims or assistance: 1800-XXX-XXXX</li>
                </ul>
            </div>

            <div class="policy-details">
                <h4>📞 Customer Support:</h4>
                <p><strong>24/7 Helpline:</strong> 1800-XXX-XXXX</p>
                <p><strong>Email:</strong> support@orientalinsurance.co.in</p>
                <p><strong>Website:</strong> www.orientalinsurance.org.in</p>
                <p><strong>Customer Portal:</strong> Login with policy number</p>
            </div>

            <p style="margin-top: 20px;">
                <strong>Important:</strong> Keep this policy number safe. You'll need it for:
                <br>• Filing claims • Premium payments • Policy renewals • Customer service
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Oriental Insurance Company Limited</p>
            <p>Thank you for choosing Oriental Insurance - Your Trusted Partner</p>
        </div>
    </div>
</body>
</html>
  `;
};

const welcomeEmailTemplate = (userData, policyData) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .welcome-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Welcome to Oriental Insurance!</h1>
        </div>
        
        <div class="content">
            <div class="welcome-box">
                <h3>Welcome ${userData.name}!</h3>
                <p>Thank you for joining the Oriental Insurance family. Your trust in us motivates us to serve you better.</p>
                <p><strong>Your Policy Number:</strong> ${policyData.policyNumber}</p>
                <p>We're committed to protecting what matters most to you.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Oriental Insurance Company Limited</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Send policy approval email
const sendPolicyApprovalEmail = async (policyData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Oriental Insurance Company',
        address: process.env.EMAIL_USER || 'orientalinsurance.demo@gmail.com'
      },
      to: policyData.email,
      subject: `🎉 Policy Approved - ${policyData.policyNumber} | Oriental Insurance`,
      html: policyApprovalTemplate(policyData),
      attachments: []
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Policy approval email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending policy approval email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (userData, policyData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Oriental Insurance Company',
        address: process.env.EMAIL_USER || 'orientalinsurance.demo@gmail.com'
      },
      to: userData.email,
      subject: `Welcome to Oriental Insurance - ${policyData.policyNumber}`,
      html: welcomeEmailTemplate(userData, policyData)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
};

// Send policy document email
const sendPolicyDocumentEmail = async (policyData, documentPath) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Oriental Insurance Company',
        address: process.env.EMAIL_USER || 'orientalinsurance.demo@gmail.com'
      },
      to: policyData.email,
      subject: `Policy Documents - ${policyData.policyNumber} | Oriental Insurance`,
      html: `
        <h2>Policy Documents</h2>
        <p>Dear ${policyData.customerName || policyData.fullName},</p>
        <p>Please find attached your policy documents for policy number: <strong>${policyData.policyNumber}</strong></p>
        <p>Keep these documents safe for future reference.</p>
        <br>
        <p>Thank you for choosing Oriental Insurance!</p>
      `,
      attachments: documentPath ? [{
        filename: `Policy_${policyData.policyNumber}.pdf`,
        path: documentPath
      }] : []
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Policy document email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending policy document email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPolicyApprovalEmail,
  sendWelcomeEmail,
  sendPolicyDocumentEmail,
  testEmailConnection
};
