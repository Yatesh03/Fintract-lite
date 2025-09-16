import nodemailer from 'nodemailer';

const createTransporter = async () => {
  // For development, we'll use ethereal email (a fake SMTP service)
  // In production, you should use a real email service like Gmail, SendGrid, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransporter({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development/test configuration using Ethereal Email
    // Create a test account dynamically
    try {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.error('Failed to create Ethereal test account, using fallback configuration');
      console.log('💡 Tip: For full email testing, you can set up Gmail credentials in production mode');
      // Fallback to a simple configuration that logs instead of sending
      return {
        sendMail: async (mailOptions) => {
          console.log('\n📧 ===== EMAIL PREVIEW (Development Mode) =====');
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          console.log('From:', mailOptions.from);
          
          // Extract the reset URL from the HTML content
          const htmlContent = mailOptions.html;
          const resetUrlMatch = htmlContent.match(/href="([^"]*reset-password[^"]*)"/);
          if (resetUrlMatch) {
            console.log('\n🔗 Password Reset Link:');
            console.log(resetUrlMatch[1]);
            console.log('\n📋 To test: Copy this URL and paste it in your browser');
          }
          
          console.log('\n💌 Full email content saved to console');
          console.log('===============================================\n');
          
          return { messageId: 'dev-mode-' + Date.now() };
        }
      };
    }
  }
};

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = await createTransporter();
    
    // Create reset URL - you'll need to adjust this based on your frontend URL
    const resetUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      : `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fintract-lite.com',
      to: email,
      subject: 'Password Reset Request - FinTract-Lite',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - FinTract-Lite</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">💰 FinTract-Lite</div>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>We received a request to reset your password for your FinTract-Lite account.</p>
              <p>Click the button below to create a new password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 10 minutes for security reasons. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </div>
            </div>
            <div class="footer">
              <p>This email was sent by FinTract-Lite. If you have any questions, please contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} FinTract-Lite. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${userName},
        
        We received a request to reset your password for your FinTract-Lite account.
        
        Please click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 10 minutes for security reasons.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        FinTract-Lite Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Preview URL: %s', previewUrl);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send password reset email');
  }
};

export default { sendPasswordResetEmail };
