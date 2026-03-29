import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Get email provider configuration (evaluated at runtime, not module load time)
function getEmailProvider() {
    return (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase()
}

// Initialize Resend client (only if using Resend)
let resendClient: Resend | null = null
function getResendClient() {
    if (!resendClient && process.env.RESEND_API_KEY) {
        resendClient = new Resend(process.env.RESEND_API_KEY)
    }
    return resendClient
}

// Initialize SMTP transporter (only if using SMTP)
let smtpTransporter: ReturnType<typeof nodemailer.createTransport> | null = null
function getSMTPTransporter() {
    if (!smtpTransporter) {
        smtpTransporter = nodemailer.createTransport({
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
            logger: false,
            debug: false,
        })
    }
    return smtpTransporter
}

interface EmailOptions {
    from: string
    to: string
    subject: string
    html: string
    replyTo?: string
    attachments?: Array<{
        filename: string
        content: Buffer
    }>
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    const provider = getEmailProvider()

    console.log(
        `📧 Sending email via ${provider.toUpperCase()}: ${options.subject} to ${options.to}`
    )

    if (provider === 'resend') {
        // Use Resend
        const resend = getResendClient()
        if (!resend) {
            throw new Error('Resend API key not configured')
        }

        try {
            const { data, error } = await resend.emails.send({
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                replyTo: options.replyTo,
                // Note: Resend handles attachments differently - would need to adjust if needed
            })

            if (error) {
                throw new Error(`Resend error: ${error.message}`)
            }

            console.log(`✓ Email sent via Resend (ID: ${data?.id})`)
        } catch (error) {
            console.error('✗ Resend error:', error)
            throw error
        }
    } else {
        // Use SMTP (DotRoll or other)
        const transporter = getSMTPTransporter()

        try {
            await transporter.sendMail({
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                replyTo: options.replyTo,
                attachments: options.attachments,
            })

            console.log(`✓ Email sent via SMTP`)
        } catch (error) {
            console.error('✗ SMTP error:', error)
            throw error
        }
    }
}

// Helper to get current provider info
export function getEmailProviderInfo() {
    const provider = getEmailProvider()
    return {
        provider,
        configured:
            provider === 'resend' ? !!process.env.RESEND_API_KEY : !!process.env.EMAIL_SERVER_HOST,
    }
}
