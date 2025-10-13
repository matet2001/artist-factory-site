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
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
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
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome back${userName ? ', ' + userName : ''}!</h2>
        
        <p>We're excited to announce that ArtistFactory has been rebuilt with a brand new platform!</p>
        
        <p><strong>What's new?</strong></p>
        <ul>
          <li>Modern, faster interface</li>
          <li>Enhanced security</li>
          <li>New features and improvements</li>
        </ul>
        
        <p><strong>Action Required:</strong></p>
        <p>To continue using your account, you'll need to set up a new password. Your old password won't work on the new platform for security reasons.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 30px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Set Up My Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">Or copy this link: ${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px;">This link will remain valid for 30 days.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          If you have any questions or need assistance, please contact our support team.
        </p>
      </div>
    `,
    })
}
