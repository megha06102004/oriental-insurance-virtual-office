const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailConnection() {
    console.log('🔧 Testing Gmail Connection...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Password Length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'Not set');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        console.log('🔍 Verifying connection...');
        await transporter.verify();
        console.log('✅ Gmail connection successful!');
        
        // Send a test email
        console.log('📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"Oriental Insurance" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: '🎉 Email Service Test - Success!',
            text: 'This is a test email from Oriental Insurance Virtual Office. Email service is working correctly!',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2a5298;">🎉 Email Service Test</h2>
                <p>Congratulations! Your Oriental Insurance email service is working correctly.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>✅ Test Results:</h3>
                    <ul>
                        <li>Gmail SMTP connection: <strong>Success</strong></li>
                        <li>Email delivery: <strong>Working</strong></li>
                        <li>HTML formatting: <strong>Applied</strong></li>
                    </ul>
                </div>
                <p style="color: #666;">This email was sent automatically by your Oriental Insurance Virtual Office application.</p>
            </div>`
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Check your Gmail inbox for the test email');
        
    } catch (error) {
        console.error('❌ Gmail connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('Username and Password not accepted')) {
            console.log('\n🔧 Troubleshooting Steps:');
            console.log('1. Verify 2-Factor Authentication is enabled');
            console.log('2. Generate a NEW App Password:');
            console.log('   - Go to: https://myaccount.google.com/apppasswords');
            console.log('   - Delete old App Password if exists');
            console.log('   - Create new one for "Mail" application');
            console.log('3. Update .env file with the new App Password');
            console.log('4. Restart the server');
        }
    }
}

testGmailConnection();
