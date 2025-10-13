import { sendVerificationEmail } from '@/lib/email'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                name: { label: 'Name', type: 'name' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    // Create new user
                    const newUser = await prisma.user.create({
                        data: {
                            name: credentials.name ?? credentials.email,
                            email: credentials.email,
                            password: await bcrypt.hash(credentials.password, 10),
                            emailVerified: null, // Not verified yet
                        },
                    })

                    // Generate verification token
                    const token = crypto.randomBytes(32).toString('hex')
                    await prisma.verificationToken.create({
                        data: {
                            email: newUser.email,
                            token,
                            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                            type: 'EMAIL_VERIFICATION',
                        },
                    })

                    // Send verification email
                    try {
                        await sendVerificationEmail(newUser.email, token)
                    } catch (error) {
                        console.error('Failed to send verification email:', error)
                        // Still allow user creation even if email fails
                    }

                    // Prevent auto-login after registration
                    throw new Error(
                        'Account created! Please check your email to verify your account.'
                    )
                }

                // Check if user's email is verified
                if (!user.emailVerified) {
                    throw new Error('Please verify your email before logging in')
                }

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials')
                }

                return user
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, id: token.id ?? user?.id }
        },
        async session({ session, token }) {
            return { ...session, user: { ...session.user, id: token.id } }
        },
    },
} satisfies NextAuthOptions
