/**
 * Safety rail for scripts that touch the database.
 *
 * The project has historically had one database — production — and the scripts
 * in here happily write to whatever DATABASE_URL happens to be loaded. This
 * module makes the target explicit and forces an opt-in before anything
 * destructive runs against production.
 *
 * Set DB_ENVIRONMENT in .env to either "development" or "production".
 */

import { config } from 'dotenv'

config({ path: '.env' })

export type DbEnvironment = 'development' | 'production'

export interface DatabaseTarget {
    environment: DbEnvironment
    host: string
    database: string
    /** Neon puts the branch/endpoint id in the host, which is the useful bit. */
    endpoint: string
}

export function describeDatabase(): DatabaseTarget {
    const url = process.env.DATABASE_URL

    if (!url) {
        throw new Error('DATABASE_URL is not set. Copy .env.example to .env first.')
    }

    const declared = (process.env.DB_ENVIRONMENT || '').toLowerCase()

    if (declared !== 'development' && declared !== 'production') {
        throw new Error(
            'DB_ENVIRONMENT must be set to "development" or "production" in .env.\n' +
                'This is deliberate: without it there is no way to tell which database ' +
                'you are about to write to.'
        )
    }

    let parsed: URL
    try {
        parsed = new URL(url)
    } catch {
        throw new Error('DATABASE_URL is not a valid connection string.')
    }

    return {
        environment: declared,
        host: parsed.host,
        database: parsed.pathname.replace(/^\//, '') || '(default)',
        endpoint: parsed.hostname.split('.')[0],
    }
}

/** Prints the target so nobody has to guess what a script is about to hit. */
export function printTarget(action: string): DatabaseTarget {
    const target = describeDatabase()
    const badge = target.environment === 'production' ? '🔴 PRODUCTION' : '🟢 development'

    console.log('')
    console.log(`   Action:   ${action}`)
    console.log(`   Database: ${badge}`)
    console.log(`   Endpoint: ${target.endpoint}`)
    console.log(`   Host:     ${target.host}`)
    console.log(`   Name:     ${target.database}`)
    console.log('')

    return target
}

/**
 * Blocks writes to production unless the caller passed --allow-production.
 * Reads never need this.
 */
export function assertWritable(argv: string[] = process.argv): DatabaseTarget {
    const target = describeDatabase()

    if (target.environment !== 'production') {
        return target
    }

    if (!argv.includes('--allow-production')) {
        throw new Error(
            'Refusing to write to the PRODUCTION database.\n\n' +
                '  Point DATABASE_URL at your development branch instead (see README),\n' +
                '  or, if you really mean it, re-run with --allow-production.'
        )
    }

    console.log('⚠️  --allow-production given: writing to PRODUCTION.')
    return target
}

/** Ten seconds to hit Ctrl+C before a production write starts. */
export async function countdown(seconds = 10): Promise<void> {
    process.stdout.write(`   Starting in ${seconds}s — Ctrl+C to abort `)
    for (let i = seconds; i > 0; i--) {
        process.stdout.write('.')
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    process.stdout.write('\n\n')
}
