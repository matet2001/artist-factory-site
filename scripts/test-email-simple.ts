import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { sendEmail, getEmailProviderInfo } from '@/lib/email-provider'

async function testEmail() {
    console.log('📧 Email Provider Test\n')

    // Check provider configuration
    const providerInfo = getEmailProviderInfo()
    console.log(`Provider: ${providerInfo.provider.toUpperCase()}`)
    console.log(`Configured: ${providerInfo.configured ? '✅' : '❌'}`)
    console.log(`EMAIL_PROVIDER env: ${process.env.EMAIL_PROVIDER}`)
    console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM}`)
    console.log('─'.repeat(60))

    if (!providerInfo.configured) {
        console.error('❌ Email provider not configured!')
        process.exit(1)
    }

    // Test email
    const testEmailAddress = process.env.BUG_REPORT_EMAIL || 'matet2001@gmail.com'
    console.log(`\n🧪 Sending test email to: ${testEmailAddress}\n`)

    try {
        await sendEmail({
            from: process.env.EMAIL_FROM!,
            to: testEmailAddress,
            subject: 'Test Email from Artist Factory',
            html: `
                <!DOCTYPE html>
                <html>
                    <head><meta charset="UTF-8" /></head>
                    <body style="background: #242424; color: #f5f5f5; font-family: sans-serif; padding: 40px;">
                        <h1 style="color: #ff3b7f;">Test Email ✅</h1>
                        <p>This is a test email from Artist Factory.</p>
                        <p>Email provider: <strong>${providerInfo.provider.toUpperCase()}</strong></p>
                        <p>If you're seeing this, emails are working! 🎉</p>
                    </body>
                </html>
            `,
        })
        console.log('\n✅ Test email sent successfully!\n')
        console.log('Check your inbox at:', testEmailAddress)
    } catch (error) {
        console.error('\n❌ Failed to send test email:\n')
        console.error(error)
        process.exit(1)
    }
}

testEmail()
