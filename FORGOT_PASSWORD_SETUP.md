# Forgot Password Feature Setup

## Overview
The forgot password feature has been successfully implemented with the following components:

### Backend Changes
1. **User Model** - Added reset token fields:
   - `resetPasswordToken`: Stores hashed reset token
   - `resetPasswordExpire`: Token expiration timestamp

2. **Auth Controller** - Added new endpoints:
   - `POST /api/auth/forgot-password` - Send password reset email
   - `POST /api/auth/reset-password` - Reset password with token

3. **Email Service** - Created `server/utils/emailService.js`:
   - Uses Nodemailer for sending emails
   - Supports both development (Ethereal Email) and production email services
   - Sends beautifully formatted HTML emails

### Frontend Changes
1. **Login Page** - Added:
   - "Forgot password?" link (only visible in login mode)
   - Modal dialog for entering email address
   - Loading states and error handling

2. **Reset Password Page** - New component:
   - Accessible via `/reset-password?token=<token>`
   - Validates password confirmation
   - Auto-login after successful reset

3. **App Context** - Added functions:
   - `forgotPassword(email)` - Request password reset
   - `resetPassword(token, newPassword)` - Reset password

## Environment Variables Required

For the email service to work properly, add these to your `server/.env` file:

### Development (uses Ethereal Email - fake SMTP service):
```env
NODE_ENV=development
```

### Production (use real email service):
```env
NODE_ENV=production
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@fintract-lite.com
FRONTEND_URL=https://your-frontend-domain.com
```

## Email Service Configuration

### For Gmail (Production):
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for this application
3. Use the App Password as `EMAIL_PASSWORD`

### For Other Services:
Modify `server/utils/emailService.js` to use your preferred email service (SendGrid, Mailgun, etc.)

## Testing

### Development Testing:
1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm run dev`
3. Go to login page and click "Forgot password?"
4. Enter an email and submit
5. Check console logs for the Ethereal Email preview URL

### Production Testing:
1. Set up real email service credentials
2. Test with actual email addresses
3. Verify email delivery and reset link functionality

## Security Features

1. **Token Expiration**: Reset tokens expire after 10 minutes
2. **Token Hashing**: Tokens are hashed before storage in database
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Secure Links**: Reset links are one-time use only

## User Flow

1. User clicks "Forgot password?" on login page
2. User enters email in modal and submits
3. System sends reset email (if email exists)
4. User clicks link in email → redirected to reset page
5. User enters new password and confirms
6. Password is reset and user is automatically logged in
7. User is redirected to dashboard

## Notes

- Email service uses fake SMTP in development (Ethereal Email)
- Reset tokens are automatically cleaned up when used or expired
- The system doesn't reveal whether an email exists for security
- All password reset attempts are logged for security monitoring

The forgot password feature is now fully functional and ready for use!


