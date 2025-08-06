const nodemailer = require('nodemailer');

// Load environment variables
require('dotenv').config();

// Email configuration
const EMAIL_CONFIG = {
    // Gmail SMTP configuration (you can change this to any email provider)
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Replace with your app password
    }
};

// Alternative configuration for other email providers
const ALTERNATIVE_CONFIGS = {
    outlook: {
        service: 'hotmail',
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    },
    yahoo: {
        service: 'yahoo',
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }
};

class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.init();
    }

    init() {
        try {
            // Create transporter with the configuration
            this.transporter = nodemailer.createTransport(EMAIL_CONFIG);
            
            // Verify the connection
            this.verifyConnection();
        } catch (error) {
            console.error('❌ Email service initialization failed:', error.message);
            this.isConfigured = false;
        }
    }

    async verifyConnection() {
        try {
            if (this.transporter) {
                await this.transporter.verify();
                console.log('✅ Email service connected successfully');
                this.isConfigured = true;
            }
        } catch (error) {
            console.error('❌ Email connection verification failed:', error.message);
            console.log('💡 Email service will use demo mode. To enable real emails:');
            console.log('   1. Set EMAIL_USER and EMAIL_PASSWORD environment variables');
            console.log('   2. For Gmail: Use App Password (not regular password)');
            console.log('   3. For Gmail: Enable 2-Factor Authentication first');
            this.isConfigured = false;
        }
    }

    async sendPolicyConfirmation(policyData, customerEmail) {
        const emailContent = this.generatePolicyEmailContent(policyData);
        
        const mailOptions = {
            from: {
                name: 'Oriental Insurance',
                address: EMAIL_CONFIG.auth.user
            },
            to: customerEmail,
            subject: `Policy Confirmation - ${policyData.policyNumber}`,
            html: emailContent.html,
            text: emailContent.text
        };

        return this.sendEmail(mailOptions);
    }

    async sendClaimConfirmation(claimData, customerEmail) {
        const emailContent = this.generateClaimEmailContent(claimData);
        
        const mailOptions = {
            from: {
                name: 'Oriental Insurance Claims',
                address: EMAIL_CONFIG.auth.user
            },
            to: customerEmail,
            subject: `Claim Confirmation - ${claimData.claimId}`,
            html: emailContent.html,
            text: emailContent.text
        };

        return this.sendEmail(mailOptions);
    }

    async sendEmail(mailOptions) {
        if (!this.isConfigured) {
            // Demo mode - log email details
            console.log('📧 DEMO MODE - Email would be sent:');
            console.log('   To:', mailOptions.to);
            console.log('   Subject:', mailOptions.subject);
            console.log('   Content:', mailOptions.text.substring(0, 200) + '...');
            
            return {
                success: true,
                message: 'Email sent in demo mode',
                messageId: 'demo_' + Date.now(),
                mode: 'demo'
            };
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully:', info.messageId);
            
            return {
                success: true,
                message: 'Email sent successfully',
                messageId: info.messageId,
                mode: 'live'
            };
        } catch (error) {
            console.error('❌ Email sending failed:', error.message);
            
            // Fallback to demo mode
            console.log('📧 Falling back to demo mode...');
            return {
                success: false,
                message: 'Email sending failed, demo mode used',
                error: error.message,
                mode: 'demo'
            };
        }
    }

    generatePolicyEmailContent(policyData) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .policy-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .highlight { color: #2a5298; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Policy Confirmation</h1>
                    <p>Welcome to Oriental Insurance Family!</p>
                </div>
                
                <div class="content">
                    <p>Dear <strong>${policyData.customerName}</strong>,</p>
                    
                    <p>Congratulations! Your insurance policy has been successfully approved and activated.</p>
                    
                    <div class="policy-details">
                        <h3>📋 Policy Details</h3>
                        <div class="detail-row">
                            <span>Policy Number:</span>
                            <span class="highlight">${policyData.policyNumber}</span>
                        </div>
                        <div class="detail-row">
                            <span>Policy Type:</span>
                            <span>${policyData.policyType?.toUpperCase()} Insurance</span>
                        </div>
                        <div class="detail-row">
                            <span>Premium Amount:</span>
                            <span class="highlight">₹${policyData.premium?.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Coverage Amount:</span>
                            <span class="highlight">₹${policyData.coverageAmount?.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Policy Start Date:</span>
                            <span>${policyData.startDate}</span>
                        </div>
                        <div class="detail-row">
                            <span>Policy End Date:</span>
                            <span>${policyData.endDate}</span>
                        </div>
                        <div class="detail-row">
                            <span>Status:</span>
                            <span class="highlight">ACTIVE</span>
                        </div>
                    </div>
                    
                    <h3>📌 Next Steps</h3>
                    <ul>
                        <li>Your policy is now active and coverage has begun</li>
                        <li>Policy documents will be sent separately</li>
                        <li>Set up auto-pay for hassle-free renewals</li>
                        <li>Download our mobile app for easy policy management</li>
                        <li>Keep this email for your records</li>
                    </ul>
                    
                    <h3>📞 Need Help?</h3>
                    <p>Our customer support team is here to help:</p>
                    <ul>
                        <li><strong>Phone:</strong> 1800-XXX-XXXX (Toll Free)</li>
                        <li><strong>Email:</strong> support@orientalinsurance.com</li>
                        <li><strong>WhatsApp:</strong> +91-XXXXXXXXXX</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Thank you for choosing Oriental Insurance!</p>
                    <p>This is an automated email. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>`;

        const text = `
Policy Confirmation - Oriental Insurance

Dear ${policyData.customerName},

Congratulations! Your insurance policy has been successfully approved.

Policy Details:
- Policy Number: ${policyData.policyNumber}
- Policy Type: ${policyData.policyType?.toUpperCase()} Insurance
- Premium: ₹${policyData.premium?.toLocaleString()}
- Coverage: ₹${policyData.coverageAmount?.toLocaleString()}
- Start Date: ${policyData.startDate}
- End Date: ${policyData.endDate}
- Status: ACTIVE

Your policy is now active and coverage has begun.

For support: 1800-XXX-XXXX
Email: support@orientalinsurance.com

Thank you for choosing Oriental Insurance!`;

        return { html, text };
    }

    generateClaimEmailContent(claimData) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .claim-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .highlight { color: #28a745; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📝 Claim Confirmation</h1>
                    <p>Your claim has been submitted successfully!</p>
                </div>
                
                <div class="content">
                    <p>Dear Customer,</p>
                    
                    <p>We have received your insurance claim and it is now under review.</p>
                    
                    <div class="claim-details">
                        <h3>📋 Claim Details</h3>
                        <div class="detail-row">
                            <span>Claim ID:</span>
                            <span class="highlight">${claimData.claimId}</span>
                        </div>
                        <div class="detail-row">
                            <span>Policy Number:</span>
                            <span>${claimData.policyNumber}</span>
                        </div>
                        <div class="detail-row">
                            <span>Claim Type:</span>
                            <span>${claimData.claimType}</span>
                        </div>
                        <div class="detail-row">
                            <span>Estimated Amount:</span>
                            <span class="highlight">₹${claimData.estimatedAmount?.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Status:</span>
                            <span class="highlight">UNDER REVIEW</span>
                        </div>
                        <div class="detail-row">
                            <span>Assigned Surveyor:</span>
                            <span>${claimData.assignedSurveyor}</span>
                        </div>
                    </div>
                    
                    <h3>📌 What's Next?</h3>
                    <ul>
                        <li>Our surveyor will contact you within 24-48 hours</li>
                        <li>Please keep all original documents ready</li>
                        <li>You will receive regular updates on your claim status</li>
                        <li>Estimated processing time: 7-14 business days</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>For claim status updates: 1800-XXX-XXXX</p>
                    <p>This is an automated email. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>`;

        const text = `
Claim Confirmation - Oriental Insurance

Dear Customer,

Your insurance claim has been submitted successfully.

Claim Details:
- Claim ID: ${claimData.claimId}
- Policy Number: ${claimData.policyNumber}
- Claim Type: ${claimData.claimType}
- Estimated Amount: ₹${claimData.estimatedAmount?.toLocaleString()}
- Status: UNDER REVIEW
- Assigned Surveyor: ${claimData.assignedSurveyor}

Our surveyor will contact you within 24-48 hours.

For updates: 1800-XXX-XXXX`;

        return { html, text };
    }
}

module.exports = new EmailService();
