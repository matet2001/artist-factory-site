/**
 * Check which migrated users need to reset their password
 */

import prisma from '../src/lib/prisma'

async function checkMigratedUsers() {
    console.log('\n🔍 Checking for migrated users who need password reset...\n')

    // Find users who are migrated but have no password set
    const migratedUsersWithoutPassword = await prisma.user.findMany({
        where: {
            isOldUser: true,
            password: '',
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            createdAt: true,
        },
        orderBy: {
            email: 'asc',
        },
    })

    console.log(`📊 Found ${migratedUsersWithoutPassword.length} migrated users without passwords\n`)

    if (migratedUsersWithoutPassword.length > 0) {
        console.log('Email                                    | Name                    | Email Verified | Created At')
        console.log('-'.repeat(110))

        migratedUsersWithoutPassword.forEach((user) => {
            const verified = user.emailVerified ? '✅ Yes' : '❌ No'
            const createdDate = user.createdAt.toISOString().split('T')[0]

            console.log(
                `${user.email.padEnd(40)} | ${(user.name || 'N/A').padEnd(23)} | ${verified.padEnd(14)} | ${createdDate}`
            )
        })

        console.log('\n')
        console.log('ℹ️  These users will see a message telling them to use "Forgot Password"')
        console.log('   when they try to log in.\n')
    } else {
        console.log('✅ All migrated users have passwords set!\n')
    }

    await prisma.$disconnect()
}

checkMigratedUsers()
