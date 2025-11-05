import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
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

                // User not found
                if (!user) {
                    throw new Error('Invalid credentials')
                }

                // Check if user's email is verified
                if (!user.emailVerified) {
                    throw new Error('Please verify your email before logging in')
                }

                // Check password
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
