import nodemailer from 'nodemailer'

// Don't create transporter immediately - create it when needed
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: true,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            logger: true,
            debug: true,
        })
    }
    return transporter
}

export async function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`

    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email address',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0B0B0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0B0B; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 48px 40px; text-align: center;">
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">Email Verification</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">Click the button below to verify your email address and get started.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">Or copy this link:</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${verificationUrl}</p>
                      
                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">This link will expire in 24 hours.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    })
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0B0B0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0B0B; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 48px 40px; text-align: center;">
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">Password Reset</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">We received a request to reset your password. Click the button below to create a new password.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">Or copy this link:</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${resetUrl}</p>
                      
                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">This link will expire in 1 hour.</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    })
}

export async function sendMigrationWelcomeEmail(email: string, token: string, userName?: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/migration-welcome?token=${token}`

    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to the New ArtistFactory Platform!',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0B0B0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0B0B; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 48px 40px; text-align: center;">
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 8px 0;">Welcome back${userName ? ', ' + userName : ''}!</h1>
                      <p style="color: #ff6b9d; font-size: 18px; font-weight: 500; margin: 0 0 24px 0;">ArtistFactory has been rebuilt</p>
                      
                      <div style="text-align: left; margin: 0 0 32px 0;">
                        <p style="color: #f5f5f5; font-size: 16px; font-weight: 500; margin: 0 0 12px 0;">What's new?</p>
                        <table cellpadding="0" cellspacing="0" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <span style="color: #ff3b7f; margin-right: 8px;">•</span>
                              <span style="color: #919191; font-size: 15px;">Modern, faster interface</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <span style="color: #ff3b7f; margin-right: 8px;">•</span>
                              <span style="color: #919191; font-size: 15px;">Enhanced security</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <span style="color: #ff3b7f; margin-right: 8px;">•</span>
                              <span style="color: #919191; font-size: 15px;">New features and improvements</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <div style="background-color: #2d2d2d; border-left: 3px solid #ff3b7f; padding: 16px; border-radius: 8px; margin: 0 0 32px 0; text-align: left;">
                        <p style="color: #f5f5f5; font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">Action Required</p>
                        <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 0;">To continue using your account, you'll need to set up a new password. Your old password won't work on the new platform for security reasons.</p>
                      </div>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Set Up My Password</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">Or copy this link:</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${resetUrl}</p>
                      
                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">This link will remain valid for 30 days.</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">If you have any questions or need assistance, please contact our support team.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    })
}
