import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';
import { calculateSectionScore, calculateTotalScore, SECTION_QUESTION_COUNT } from '../../../../../lib/scoring';

// POST /api/tests/[id]/finish - Finish test and calculate scores
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
            include: {
                answers: {
                    include: {
                        question: true,
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

        if (testSession.status !== 'IN_PROGRESS') {
            return NextResponse.json(
                { success: false, error: 'Test is not in progress' },
                { status: 400 }
            );
        }

        // Count correct answers by section
        const listeningCorrect = testSession.answers.filter(
            a => a.question.section === 'LISTENING' && a.isCorrect
        ).length;
        const structureCorrect = testSession.answers.filter(
            a => a.question.section === 'STRUCTURE' && a.isCorrect
        ).length;
        const readingCorrect = testSession.answers.filter(
            a => a.question.section === 'READING' && a.isCorrect
        ).length;

        // Calculate scores
        const listeningScore = calculateSectionScore('LISTENING', listeningCorrect);
        const structureScore = calculateSectionScore('STRUCTURE', structureCorrect);
        const readingScore = calculateSectionScore('READING', readingCorrect);
        const totalScore = calculateTotalScore(listeningScore, structureScore, readingScore);

        // Save remaining time if provided
        const body = await request.json().catch(() => ({}));
        const { remainingTime } = body;

        // Update test session with scores
        const updatedSession = await prisma.testSession.update({
            where: { id: params.id },
            data: {
                status: 'COMPLETED',
                finishedAt: new Date(),
                listeningRaw: listeningCorrect,
                structureRaw: structureCorrect,
                readingRaw: readingCorrect,
                listeningScore,
                structureScore,
                readingScore,
                totalScore,
                ...(remainingTime !== undefined && { readingTime: remainingTime }),
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: 'TEST_COMPLETED',
                message: `User completed test with score ${totalScore}`,
                metadata: {
                    userId: session.user.id,
                    testId: params.id,
                    totalScore,
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                testId: updatedSession.id,
                completedAt: updatedSession.finishedAt,
                scores: {
                    listeningRaw: listeningCorrect,
                    structureRaw: structureCorrect,
                    readingRaw: readingCorrect,
                    listeningScore,
                    structureScore,
                    readingScore,
                    totalScore,
                },
                sections: {
                    listening: { correct: listeningCorrect, total: SECTION_QUESTION_COUNT.LISTENING },
                    structure: { correct: structureCorrect, total: SECTION_QUESTION_COUNT.STRUCTURE },
                    reading: { correct: readingCorrect, total: SECTION_QUESTION_COUNT.READING },
                },
            },
        });
    } catch (error) {
        console.error('Finish test error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
