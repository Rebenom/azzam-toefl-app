import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

// GET /api/tests/[id] - Get test session details
export async function GET(
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
            include: {
                answers: {
                    select: {
                        questionId: true,
                        selectedAnswer: true,
                        isCorrect: true,
                    },
                },
            },
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

        return NextResponse.json({
            success: true,
            data: {
                id: testSession.id,
                status: testSession.status,
                currentSection: testSession.currentSection,
                startedAt: testSession.startedAt,
                finishedAt: testSession.finishedAt,
                scores: testSession.status === 'COMPLETED' ? {
                    listeningRaw: testSession.listeningRaw,
                    structureRaw: testSession.structureRaw,
                    readingRaw: testSession.readingRaw,
                    listeningScore: testSession.listeningScore,
                    structureScore: testSession.structureScore,
                    readingScore: testSession.readingScore,
                    totalScore: testSession.totalScore,
                } : null,
                answers: testSession.answers,
            },
        });
    } catch (error) {
        console.error('Get test session error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
