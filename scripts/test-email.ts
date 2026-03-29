import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { sendVerificationEmail } from '@/lib/email'
import { getEmailProviderInfo } from '@/lib/email-provider'

async function testEmail() {
    console.log('📧 Email Provider Test\n')

    // Check provider configuration
    const providerInfo = getEmailProviderInfo()
    console.log(`Provider: ${providerInfo.provider.toUpperCase()}`)
    console.log(`Configured: ${providerInfo.configured ? '✅' : '❌'}`)
    console.log('─'.repeat(60))

    if (!providerInfo.configured) {
        console.error('❌ Email provider not configured!')
        console.log('\nFor Resend:')
        console.log('  Set EMAIL_PROVIDER=resend in .env')
        console.log('  Set RESEND_API_KEY=your_api_key in .env')
        console.log('\nFor SMTP:')
        console.log('  Set EMAIL_PROVIDER=smtp in .env')
        console.log('  Ensure EMAIL_SERVER_* variables are set')
        process.exit(1)
    }

    // Test email
    const testEmailAddress = process.env.BUG_REPORT_EMAIL || 'matet2001@gmail.com'
    console.log(`\n🧪 Sending test verification email to: ${testEmailAddress}\n`)

    try {
        await sendVerificationEmail(testEmailAddress, 'test-token-12345', 'en')
        console.log('\n✅ Test email sent successfully!\n')
        console.log('Check your inbox at:', testEmailAddress)
    } catch (error) {
        console.error('\n❌ Failed to send test email:\n')
        console.error(error)
        process.exit(1)
    }
}

testEmail()
