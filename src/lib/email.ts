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
    const tFooter = await getTranslations({ locale, namespace: 'EMAIL' })
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
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
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

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 4px 0;">${t('EXPIRES')}</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${tFooter('FOOTER')}</p>
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
    const tFooter = await getTranslations({ locale, namespace: 'EMAIL' })
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
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
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

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 4px 0;">${t('EXPIRES')}</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 4px 0;">${t('NO_REQUEST')}</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${tFooter('FOOTER')}</p>
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
    const tFooter = await getTranslations({ locale, namespace: 'EMAIL' })
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
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 60px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
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

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0 0 4px 0;">${t('EXPIRES')}</p>
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${tFooter('FOOTER')}</p>
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

export async function sendBookingConfirmationEmail(
    email: string,
    bookings: Array<{ roomId: string; roomName: string; date: string; time: number; price: number }>,
    locale: string = 'hu'
) {
    const t = await getTranslations({ locale, namespace: 'EMAIL.BOOKING_CONFIRMATION' })
    const tRooms = await getTranslations({ locale, namespace: 'ROOMS' })
    const tFooter = await getTranslations({ locale, namespace: 'EMAIL' })

    // Combine consecutive bookings for the same room
    interface CombinedBooking {
        roomId: string
        roomName: string
        date: string
        startTime: number
        endTime: number
        price: number
    }

    const combineBookings = (
        bookings: Array<{ roomId: string; roomName: string; date: string; time: number; price: number }>
    ): CombinedBooking[] => {
        if (bookings.length === 0) return []

        // Sort bookings by room and time
        const sorted = [...bookings].sort((a, b) => {
            if (a.roomId !== b.roomId) return a.roomId.localeCompare(b.roomId)
            return a.time - b.time
        })

        const combined: CombinedBooking[] = []
        let current: CombinedBooking = {
            roomId: sorted[0].roomId,
            roomName: sorted[0].roomName,
            date: sorted[0].date,
            startTime: sorted[0].time,
            endTime: sorted[0].time + 1,
            price: sorted[0].price,
        }

        for (let i = 1; i < sorted.length; i++) {
            const booking = sorted[i]

            // Check if this booking is consecutive to the current one
            if (booking.roomId === current.roomId && booking.time === current.endTime) {
                // Extend the current combined booking
                current.endTime = booking.time + 1
            } else {
                // Save the current combined booking and start a new one
                combined.push(current)
                current = {
                    roomId: booking.roomId,
                    roomName: booking.roomName,
                    date: booking.date,
                    startTime: booking.time,
                    endTime: booking.time + 1,
                    price: booking.price,
                }
            }
        }

        // Add the last combined booking
        combined.push(current)
        return combined
    }

    const combinedBookings = combineBookings(bookings)

    const bookingsList = combinedBookings
        .map(
            (b) =>
                `<li style="margin-bottom: 12px;">
          <strong style="color: #f5f5f5;">${tRooms(b.roomName)}</strong><br/>
          <span style="color: #919191;">${b.date} ${b.startTime}:00 - ${b.endTime}:00</span><br/>
          <span style="color: #ff6b9d;">${t('PRICE_PER_HOUR')}: ${b.price.toLocaleString()} Ft</span>
        </li>`
        )
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
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
                  <tr>
                    <td style="padding: 48px 40px; text-align: center;">
                      <h1 style="color: #f5f5f5; font-size: 28px; font-weight: 600; margin: 0 0 32px 0;">${t('TITLE')}</h1>

                      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: left;">
                        <h2 style="color: #f5f5f5; font-size: 18px; margin: 0 0 16px 0;">${t('YOUR_BOOKINGS')}</h2>
                        <ul style="color: #919191; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px; list-style: none;">
                          ${bookingsList}
                        </ul>
                      </div>

                      <div style="background-color: #1a1a1a; border-left: 3px solid #ff3b7f; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
                        <p style="color: #f5f5f5; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">${t('CANCELLATION_POLICY')}</p>
                        <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 0;">${t('CANCELLATION_INFO')}</p>
                      </div>

                      <div style="background-color: #1a1a1a; border-left: 3px solid #ff3b7f; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: left;">
                        <p style="color: #f5f5f5; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${t('CLOSING')}</p>
                        <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 0 0 12px 0;">${t('CONTACT_INFO')}</p>
                        <p style="color: #919191; font-size: 14px; line-height: 20px; margin: 0;">
                          <strong style="color: #f5f5f5;">${t('PHONE')}:</strong> +36 20 258 9449<br/>
                          <strong style="color: #f5f5f5;">${t('EMAIL')}:</strong> ${process.env.EMAIL_FROM}
                        </p>
                      </div>

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">${tFooter('FOOTER')}</p>
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
        console.log(
            `✓ Booking confirmation email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`
        )
    } catch (error) {
        emailStats.failed++
        console.error(
            `✗ Failed to send booking confirmation email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`
        )
        throw error
    }
}

export async function sendAdminBookingNotification(
    bookings: Array<{
        roomId: string
        roomName: string
        date: string
        startTime: number
        endTime: number
        price: number
        bookingId: string
    }>
) {
    const adminEmail = process.env.ADMIN_EMAIL || 'artistfactory@artistfactory.hu'

    // Combine consecutive bookings for display
    const bookingsList = bookings
        .map(
            (b) => `
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #f5f5f5; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
            Terem: ${b.roomName} - ${b.price.toLocaleString()} Ft
          </p>
          <p style="color: #919191; font-size: 14px; margin: 0 0 4px 0;">
            Kezdés időpontja: ${b.date} - ${b.startTime}:00 - ${b.endTime}:00
          </p>
          <p style="color: #919191; font-size: 14px; margin: 0 0 4px 0;">
            Foglalás időtartama (perc): ${(b.endTime - b.startTime) * 60}
          </p>
          <p style="color: #ff6b9d; font-size: 14px; margin: 0;">
            Foglalás azonosítója: ${b.bookingId}
          </p>
        </div>
      `
        )
        .join('')

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: adminEmail,
            subject: 'Új foglalás érkezett - ArtistFactory',
            html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
                  <tr>
                    <td style="padding: 48px 40px;">
                      <h1 style="color: #f5f5f5; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Tisztelt Admin,</h1>
                      <p style="color: #919191; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">
                        A rendszerben új foglalás érkezett. A foglalás részletes adatait az adminban megtekintheti.
                      </p>

                      ${bookingsList}

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">ArtistFactory - Próbaterem és Stúdió</p>
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
        console.log(`✓ Admin notification email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(
            `✗ Failed to send admin notification email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`
        )
        // Don't throw - we don't want to fail the booking if admin email fails
        console.error('Admin notification error:', error)
    }
}

export async function sendBugReportEmail(
    name: string,
    email: string,
    description: string,
    attachments: Array<{ filename: string; content: Buffer }> = []
) {
    const bugReportEmail = process.env.BUG_REPORT_EMAIL || 'matet2001@gmail.com'

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: bugReportEmail,
            replyTo: email,
            subject: `Bug Report from ${name}`,
            html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #242424; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #242424;">
                  <tr>
                    <td style="padding: 48px 40px;">
                      <h1 style="color: #f5f5f5; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">🐛 New Bug Report</h1>

                      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <p style="color: #ff6b9d; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Reporter Information</p>
                        <p style="color: #f5f5f5; font-size: 14px; margin: 0 0 4px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="color: #f5f5f5; font-size: 14px; margin: 0;"><strong>Email:</strong> ${email}</p>
                      </div>

                      <div style="background-color: #1a1a1a; border-left: 3px solid #ff3b7f; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <p style="color: #ff6b9d; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Bug Description</p>
                        <p style="color: #f5f5f5; font-size: 14px; line-height: 20px; margin: 0; white-space: pre-wrap;">${description}</p>
                      </div>

                      ${
                          attachments.length > 0
                              ? `
                      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px;">
                        <p style="color: #ff6b9d; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">📎 Attachments</p>
                        <p style="color: #919191; font-size: 13px; margin: 0;">${attachments.length} file(s) attached</p>
                      </div>
                      `
                              : ''
                      }

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;">
                        <p style="color: #919191; font-size: 13px; line-height: 18px; margin: 0;">ArtistFactory - Bug Report System</p>
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
            attachments: attachments.map((att) => ({
                filename: att.filename,
                content: att.content,
            })),
        })
        emailStats.sent++
        console.log(`✓ Bug report email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(`✗ Failed to send bug report email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
        throw error
    }
}

export async function sendMigrationVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`

    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Erősítsd meg az email címed / Verify your email - Artist Factory',
            html: `
<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body style="background-color: #242424; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: #242424; padding: 40px;">

      <!-- HUNGARIAN VERSION -->
      <h1 style="color: #f5f5f5; margin-bottom: 16px;">Erősítsd meg az email címed</h1>
      <p style="color: #919191; margin-bottom: 32px; line-height: 24px;">
        Üdvözlünk az új Artist Factory weboldalon! Kérjük, erősítsd meg az email címedet, hogy folytathasd.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${verificationUrl}" style="display: inline-block; background: #ff3b7f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Email cím megerősítése
        </a>
      </div>

      <p style="color: #919191; font-size: 14px; margin-bottom: 8px;">Vagy másold be ezt a linket a böngésződbe:</p>
      <p style="color: #ff6b9d; font-size: 14px; word-break: break-all; margin-bottom: 32px;">${verificationUrl}</p>

      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
        <p style="color: #919191; font-size: 13px; line-height: 20px; margin: 0;">
          ⏰ Ez a link 7 napig érvényes.<br/>
          💌 Ha nem kértél regisztrációt, figyelmen kívül hagyhatod ezt az emailt.
        </p>
      </div>

      <hr style="margin: 48px 0; border: none; border-top: 1px solid #333;" />

      <!-- ENGLISH VERSION -->
      <h1 style="color: #f5f5f5; margin-bottom: 16px;">Verify your email address</h1>
      <p style="color: #919191; margin-bottom: 32px; line-height: 24px;">
        Welcome to the new Artist Factory website! Please verify your email address to continue.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${verificationUrl}" style="display: inline-block; background: #ff3b7f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Verify Email Address
        </a>
      </div>

      <p style="color: #919191; font-size: 14px; margin-bottom: 8px;">Or copy and paste this link into your browser:</p>
      <p style="color: #ff6b9d; font-size: 14px; word-break: break-all; margin-bottom: 32px;">${verificationUrl}</p>

      <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
        <p style="color: #919191; font-size: 13px; line-height: 20px; margin: 0;">
          ⏰ This link is valid for 7 days.<br/>
          💌 If you didn't request this, you can safely ignore this email.
        </p>
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #333333;">
        <p style="color: #919191; font-size: 13px; margin: 0;">Artist Factory - Próbaterem és Stúdió</p>
      </div>
    </div>
  </body>
</html>
    `,
        })
        emailStats.sent++
        console.log(`✓ Migration verification email sent | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`)
    } catch (error) {
        emailStats.failed++
        console.error(
            `✗ Failed to send migration verification email | Total: ${emailStats.sent} sent, ${emailStats.failed} failed`
        )
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
  <body style="background-color: #242424; font-family: sans-serif; padding: 40px 20px; color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: #242424; padding: 40px;">

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

      <div style="margin-top: 32px; padding: 16px; background: #1a1a1a; border-radius: 8px; font-size: 13px; color: #ccc;">
        <p style="margin: 0 0 8px;"><strong>Fontos információk:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>A link <strong>7 napig érvényes</strong></li>
          <li><strong>Ha a link lejár:</strong> használd az "Elfelejtett jelszó" funkciót a bejelentkezési oldalon</li>
          <li>Ha segítségre van szükséged, írj nekünk: <a href="mailto:${process.env.EMAIL_FROM}" style="color: #ff6b9d;">${process.env.EMAIL_FROM}</a></li>
        </ul>
      </div>

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

      <div style="margin-top: 32px; padding: 16px; background: #1a1a1a; border-radius: 8px; font-size: 13px; color: #ccc;">
        <p style="margin: 0 0 8px;"><strong>Important information:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>This link is <strong>valid for 7 days</strong></li>
          <li><strong>If the link expires:</strong> use the "Forgot password" feature on the login page</li>
          <li>If you need help, contact us: <a href="mailto:${process.env.EMAIL_FROM}" style="color: #ff6b9d;">${process.env.EMAIL_FROM}</a></li>
        </ul>
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
