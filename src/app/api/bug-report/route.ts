import { sendBugReportEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const description = formData.get('description') as string

        // Validation
        if (!name || !email || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            )
        }

        // Description validation
        if (description.length < 10) {
            return NextResponse.json(
                { error: 'Description too short' },
                { status: 400 }
            )
        }

        // Process image attachments
        const attachments: Array<{ filename: string; content: Buffer }> = []
        let imageIndex = 0

        while (formData.has(`image${imageIndex}`)) {
            const imageFile = formData.get(`image${imageIndex}`) as File

            if (imageFile && imageFile.size > 0) {
                // Limit file size to 5MB
                if (imageFile.size > 5 * 1024 * 1024) {
                    return NextResponse.json(
                        { error: `Image ${imageIndex} is too large. Maximum size is 5MB.` },
                        { status: 400 }
                    )
                }

                // Convert File to Buffer
                const arrayBuffer = await imageFile.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                attachments.push({
                    filename: imageFile.name || `screenshot-${imageIndex + 1}.png`,
                    content: buffer,
                })
            }

            imageIndex++
        }

        // Send email
        await sendBugReportEmail(name, email, description, attachments)

        return NextResponse.json({
            success: true,
            message: 'Bug report submitted successfully'
        })
    } catch (error) {
        console.error('Error processing bug report:', error)
        return NextResponse.json(
            { error: 'Failed to submit bug report' },
            { status: 500 }
        )
    }
}
