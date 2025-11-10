import { getTranslations } from 'next-intl/server'
import nodemailer from 'nodemailer'

// Email statistics tracking
const emailStats = {
    sent: 0,
    failed: 0,
}

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
            logger: false, // Disable verbose logging
            debug: false, // Disable debug output
        })
    }
    return transporter
}

export async function sendVerificationEmail(email: string, token: string, locale: string = 'hu') {
    const t = await getTranslations({ locale, namespace: 'EMAIL.VERIFICATION' })
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: t('SUBJECT'),
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
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">${t('TITLE')}</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">${t('DESCRIPTION')}</p>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${t('BUTTON')}</a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">${t('OR_COPY')}</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${verificationUrl}</p>

                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${t('EXPIRES')}</p>
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
        emailStats.sent++
        console.log(`✓ Verification email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(`✗ Failed to send verification email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
        throw error
    }
}

export async function sendPasswordResetEmail(email: string, token: string, locale: string = 'hu') {
    const t = await getTranslations({ locale, namespace: 'EMAIL.PASSWORD_RESET' })
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: t('SUBJECT'),
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
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">${t('TITLE')}</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">${t('DESCRIPTION')}</p>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${t('BUTTON')}</a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">${t('OR_COPY')}</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${resetUrl}</p>

                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">${t('EXPIRES')}</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${t('NO_REQUEST')}</p>
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
        emailStats.sent++
        console.log(`✓ Password reset email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(`✗ Failed to send password reset email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
        throw error
    }
}

export async function sendBookingVerificationEmail(
    email: string,
    token: string,
    bookings: Array<{ roomName: string; date: string; time: number }>,
    locale: string = 'hu'
) {
    const t = await getTranslations({ locale, namespace: 'EMAIL.BOOKING' })
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-booking?token=${token}`

    const bookingsList = bookings
        .map((b) => `<li>${b.roomName} - ${b.date} ${b.time}:00 - ${b.time + 1}:00</li>`)
        .join('')

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: t('SUBJECT'),
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
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 16px 0;">${t('TITLE')}</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">${t('DESCRIPTION')}</p>

                      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: left;">
                        <h2 style="color: #f5f5f5; font-size: 18px; margin: 0 0 16px 0;">${t('YOUR_BOOKINGS')}</h2>
                        <ul style="color: #919191; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px;">
                          ${bookingsList}
                        </ul>
                      </div>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 24px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff3b7f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${t('BUTTON')}</a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">${t('OR_COPY')}</p>
                      <p style="color: #ff6b9d; font-size: 14px; line-height: 20px; margin: 8px 0 0 0; word-break: break-all;">${verificationUrl}</p>

                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${t('EXPIRES')}</p>
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
        emailStats.sent++
        console.log(`✓ Booking verification email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(`✗ Failed to send booking verification email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
        throw error
    }
}

export async function sendMigrationWelcomeEmail(email: string, token: string, userName?: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/migration-welcome?token=${token}`

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Megújult az ArtistFactory oldala! / ArtistFactory has a new look!',
            html: `
<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body style="background-color: #0B0B0B; font-family: sans-serif; padding: 40px 20px; color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: #242424; border-radius: 12px; padding: 40px;">

      <!-- HUNGARIAN VERSION -->
      <h1 style="margin-bottom: 8px;">Szia ${userName || ''}!</h1>
      <p style="color: #ff6b9d; font-weight: 500; font-size: 18px; margin-bottom: 24px;">
        Teljesen megújult az ArtistFactory weboldalunk – új arculat, új funkciók, új élmény.
      </p>

      <p style="margin-bottom: 12px;"><strong>Mit jelent ez számodra?</strong></p>
      <ul style="color: #ccc; margin-bottom: 32px; padding-left: 20px;">
        <li>Modern, intuitív felület a jobb felhasználói élményért</li>
        <li>Fokozott biztonság az adataid védelméért</li>
        <li>Mobilbarát design valós idejű foglalásokkal</li>
      </ul>

      <div style="border-left: 3px solid #ff3b7f; background: #2d2d2d; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
        <p style="margin: 0 0 8px;"><strong>Teendő:</strong></p>
        <p style="margin: 0;">
          A régi jelszavakat biztonsági okokból nem tudtuk áthozni, ezért kérjük, állíts be egy újat az alábbi gomb segítségével.
        </p>
      </div>

      <p style="text-align: center;">
        <a href="${resetUrl}" style="background: #ff3b7f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Új jelszó beállítása
        </a>
      </p>

      <p style="margin-top: 24px;">Vagy másold be a böngésződbe:</p>
      <p style="color: #ff6b9d; word-break: break-all;">${resetUrl}</p>

      <p style="margin-top: 32px; font-size: 13px; color: #aaa;">
        A link 24 órán belül lejár. Ha segítségre van szükséged, írj nekünk ide:
        <a href="mailto:${process.env.EMAIL_FROM}" style="color: #ff6b9d;">${process.env.EMAIL_FROM}</a>
      </p>

      <hr style="margin: 48px 0; border: none; border-top: 1px solid #333;" />

      <!-- ENGLISH VERSION -->

      <h1 style="margin-bottom: 8px;">Hi ${userName || ''}!</h1>
      <p style="color: #ff6b9d; font-weight: 500; font-size: 18px; margin-bottom: 24px;">
        The ArtistFactory website has been completely redesigned – new look, new features, new experience.
      </p>

      <p style="margin-bottom: 12px;"><strong>What does this mean for you?</strong></p>
      <ul style="color: #ccc; margin-bottom: 32px; padding-left: 20px;">
        <li>Modern, intuitive interface for better user experience</li>
        <li>Enhanced security to protect your data</li>
        <li>Mobile-friendly design with real-time bookings</li>
      </ul>

      <div style="border-left: 3px solid #ff3b7f; background: #2d2d2d; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
        <p style="margin: 0 0 8px;"><strong>Action required:</strong></p>
        <p style="margin: 0;">
          For security reasons, we couldn't migrate your previous password. Please set a new one by clicking the button below.
        </p>
      </div>

      <p style="text-align: center;">
        <a href="${resetUrl}" style="background: #ff3b7f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Set new password
        </a>
      </p>

      <p style="margin-top: 24px;">Or copy and paste this URL:</p>
      <p style="color: #ff6b9d; word-break: break-all;">${resetUrl}</p>

      <div style="margin-top: 32px; font-size: 13px; color: #aaa;">
        <p>This link will expire in 24 hours.</p>
        <p>If you need help, contact us at <a href="mailto:${process.env.EMAIL_FROM}" style="color: #ff6b9d;">${process.env.EMAIL_FROM}</a></p>
      </div>
    </div>
  </body>
</html>
    `,
        })
        emailStats.sent++
        console.log(`✓ Migration email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(`✗ Failed to send migration email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
        throw error
    }
}
