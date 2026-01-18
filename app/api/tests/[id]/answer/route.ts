import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';

// POST /api/tests/[id]/answer - Submit an answer
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

        const body = await request.json();
        const { questionId, selectedAnswer } = body;

        if (!questionId || selectedAnswer === undefined) {
            return NextResponse.json(
                { success: false, error: 'questionId and selectedAnswer are required' },
                { status: 400 }
            );
        }

        // Get the question to check correct answer
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return NextResponse.json(
                { success: false, error: 'Question not found' },
                { status: 404 }
            );
        }

        const isCorrect = question.correctAnswer === selectedAnswer;

        // Upsert the answer (update if exists, create if not)
        await prisma.answer.upsert({
            where: {
                testSessionId_questionId: {
                    testSessionId: params.id,
                    questionId,
                },
            },
            update: {
                selectedAnswer,
                isCorrect,
                answeredAt: new Date(),
            },
            create: {
                testSessionId: params.id,
                questionId,
                selectedAnswer,
                isCorrect,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submit answer error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
