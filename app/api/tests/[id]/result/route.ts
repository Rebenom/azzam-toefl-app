import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';
import { SECTION_QUESTION_COUNT } from '../../../../../lib/scoring';

// GET /api/tests/[id]/result - Get detailed test result
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
                    include: {
                        question: {
                            select: {
                                id: true,
                                section: true,
                                questionText: true,
                                options: true,
                                correctAnswer: true,
                                explanation: true,
                            },
                        },
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

        if (testSession.status !== 'COMPLETED') {
            return NextResponse.json(
                { success: false, error: 'Test is not completed yet' },
                { status: 400 }
            );
        }

        // Format answers with question details for review
        const answerDetails = testSession.answers.map(a => ({
            questionId: a.questionId,
            section: a.question.section,
            questionText: a.question.questionText,
            options: a.question.options,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: a.question.correctAnswer,
            isCorrect: a.isCorrect,
            explanation: a.question.explanation,
        }));

        return NextResponse.json({
            success: true,
            data: {
                testId: testSession.id,
                startedAt: testSession.startedAt,
                finishedAt: testSession.finishedAt,
                scores: {
                    listeningRaw: testSession.listeningRaw,
                    structureRaw: testSession.structureRaw,
                    readingRaw: testSession.readingRaw,
                    listeningScore: testSession.listeningScore,
                    structureScore: testSession.structureScore,
                    readingScore: testSession.readingScore,
                    totalScore: testSession.totalScore,
                },
                sections: {
                    listening: {
                        correct: testSession.listeningRaw,
                        total: SECTION_QUESTION_COUNT.LISTENING,
                        maxScore: 68,
                    },
                    structure: {
                        correct: testSession.structureRaw,
                        total: SECTION_QUESTION_COUNT.STRUCTURE,
                        maxScore: 68,
                    },
                    reading: {
                        correct: testSession.readingRaw,
                        total: SECTION_QUESTION_COUNT.READING,
                        maxScore: 68,
                    },
                },
                answers: answerDetails,
            },
        });
    } catch (error) {
        console.error('Get result error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
