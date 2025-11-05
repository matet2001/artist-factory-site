// import { sendVerificationEmail } from '@/lib/email'
// import { getLocaleForEmail } from '@/lib/email-local-helper'
// import { NextResponse } from 'next/server'

// export async function POST(request: Request) {
//     try {
//         const { email } = await request.json()

//         if (!email) {
//             return NextResponse.json({ error: 'Email is required' }, { status: 400 })
//         }

//         // Find the user
//         const user = await db.user.findUnique({
//             where: { email: email.toLowerCase() },
//         })

//         if (!user) {
//             // Don't reveal if user exists or not for security
//             return NextResponse.json(
//                 { message: 'If an account exists, a verification email has been sent.' },
//                 { status: 200 }
//             )
//         }

//         // Check if already verified
//         if (user.emailVerified) {
//             return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
//         }

//         // Check rate limiting (optional but recommended)
//         // You might want to check when the last email was sent
//         // and prevent sending too many emails in a short time

//         // Generate new verification token
//         const verificationToken = await generateVerificationToken(email)

//         // Get user's locale
//         const locale = await getLocaleForEmail()

//         // Send verification email
//         await sendVerificationEmail(email, verificationToken, locale)

//         return NextResponse.json(
//             { message: 'Verification email sent successfully' },
//             { status: 200 }
//         )
//     } catch (error) {
//         console.error('Error resending verification email:', error)
//         return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
//     }
// }
