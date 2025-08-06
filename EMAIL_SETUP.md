# Email Configuration Setup Guide

## Quick Setup for Gmail

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the setup process to enable 2-Factor Authentication

### Step 2: Generate App Password

1. In Google Account settings, go to **Security** → **App passwords**
2. Select app: **Mail**
3. Select device: **Windows Computer** (or your device)
4. Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```
   ⚠️ **Important**: Use the App Password (16 characters), not your regular Gmail password!

### Step 4: Test Email Configuration

1. Restart your server:

   ```bash
   node test-server.js
   ```

2. Look for this message in console:

   ```
   ✅ Email service connected successfully
   ```

3. If you see connection errors, the system will automatically fall back to demo mode.

## Alternative Email Providers

### Outlook/Hotmail

```
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo Mail

```
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

(Yahoo also requires App Passwords for third-party apps)

## Testing Email Functionality

### Test Policy Registration Email

1. Go to your application
2. Apply for a new policy
3. Check console logs for email status
4. If configured correctly, you'll receive a professional confirmation email

### Test Claim Submission Email

1. Submit a claim for any policy
2. Check console logs for email confirmation
3. You should receive a claim acknowledgment email

## Troubleshooting

### "Authentication failed" Error

- ✅ Make sure 2-Factor Authentication is enabled
- ✅ Use App Password, not regular password
- ✅ Check EMAIL_USER and EMAIL_PASSWORD in .env file
- ✅ Restart the server after changing .env

### "Connection refused" Error

- ✅ Check your internet connection
- ✅ Some networks block SMTP connections
- ✅ Try using a different network or VPN

### Demo Mode Fallback

If email configuration fails, the system automatically uses demo mode:

- ✅ All email content is logged to console
- ✅ Application continues to work normally
- ✅ Users see "demo mode" in API responses

## Security Best Practices

1. **Never commit .env file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Keep credentials secure** and don't share them
4. **Regularly rotate** your app passwords
5. **Monitor email logs** for suspicious activity

## Production Deployment

For production environments:

1. Use environment variables instead of .env file
2. Consider using dedicated email services (SendGrid, AWS SES, etc.)
3. Implement email rate limiting
4. Add email templates versioning
5. Set up email delivery monitoring

## Support

If you need help with email configuration:

1. Check console logs for detailed error messages
2. Verify your email provider's SMTP settings
3. Test with a simple email client first
4. The system will always fall back to demo mode if needed
