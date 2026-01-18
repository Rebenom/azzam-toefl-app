import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';
import { Section } from '@prisma/client';

// POST /api/tests/[id]/next-section - Move to next section
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const testSession = await prisma.testSession.findUnique({
            where: { id: params.id },
        });

        if (!testSession) {
            return NextResponse.json(
                { success: false, error: 'Test session not found' },
                { status: 404 }
            );
        }

        if (testSession.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            );
        }

        if (testSession.status !== 'IN_PROGRESS') {
            return NextResponse.json(
                { success: false, error: 'Test is not in progress' },
                { status: 400 }
            );
        }

        const sectionOrder: Section[] = ['LISTENING', 'STRUCTURE', 'READING'];
        const currentIndex = sectionOrder.indexOf(testSession.currentSection);

        if (currentIndex === sectionOrder.length - 1) {
            return NextResponse.json(
                { success: false, error: 'Already on the last section. Use /finish instead.' },
                { status: 400 }
            );
        }

        const nextSection = sectionOrder[currentIndex + 1];

        // Save remaining time for current section if provided
        const body = await request.json().catch(() => ({}));
        const { remainingTime } = body;

        const updateData: any = { currentSection: nextSection };
        if (remainingTime !== undefined) {
            const timeField = `${testSession.currentSection.toLowerCase()}Time`;
            updateData[timeField] = remainingTime;
        }

        await prisma.testSession.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            data: { nextSection },
        });
    } catch (error) {
        console.error('Next section error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
