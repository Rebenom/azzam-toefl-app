import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { SECTION_QUESTION_COUNT } from '../../../../lib/scoring';

// POST /api/tests/start - Start a new test session
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check for existing in-progress test
        const existingTest = await prisma.testSession.findFirst({
            where: {
                userId: session.user.id,
                status: 'IN_PROGRESS',
            },
        });

        if (existingTest) {
            return NextResponse.json(
                { success: false, error: 'You have an in-progress test. Please complete or abandon it first.', testId: existingTest.id },
                { status: 400 }
            );
        }

        // Get random questions for each section
        const listeningQuestions = await prisma.question.findMany({
            where: { section: 'LISTENING', isActive: true },
            take: SECTION_QUESTION_COUNT.LISTENING,
            include: { audioFile: true },
        });

        const structureQuestions = await prisma.question.findMany({
            where: { section: 'STRUCTURE', isActive: true },
            take: SECTION_QUESTION_COUNT.STRUCTURE,
        });

        const readingQuestions = await prisma.question.findMany({
            where: { section: 'READING', isActive: true },
            take: SECTION_QUESTION_COUNT.READING,
            include: { passage: true },
        });

        // Create test session
        const testSession = await prisma.testSession.create({
            data: {
                userId: session.user.id,
                currentSection: 'LISTENING',
            },
        });

        // Format questions without correct answers
        const formatQuestion = (q: any) => ({
            id: q.id,
            section: q.section,
            questionType: q.questionType,
            questionText: q.questionText,
            options: q.options,
            audioUrl: q.audioFile?.url,
            passageId: q.passageId,
        });

        return NextResponse.json({
            success: true,
            data: {
                testId: testSession.id,
                currentSection: 'LISTENING',
                questions: {
                    listening: listeningQuestions.map(formatQuestion),
                    structure: structureQuestions.map(formatQuestion),
                    reading: readingQuestions.map(formatQuestion),
                },
                passages: readingQuestions
                    .filter(q => q.passage)
                    .map(q => q.passage)
                    .filter((v, i, a) => a.findIndex(t => t?.id === v?.id) === i),
            },
        });
    } catch (error) {
        console.error('Start test error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
