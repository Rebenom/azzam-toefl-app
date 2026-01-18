import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { Section, Difficulty } from '@prisma/client';

// GET /api/questions - Get questions with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section') as Section | null;
        const difficulty = searchParams.get('difficulty') as Difficulty | null;
        const limit = parseInt(searchParams.get('limit') || '50');
        const random = searchParams.get('random') === 'true';

        const where: any = { isActive: true };
        if (section) where.section = section;
        if (difficulty) where.difficulty = difficulty;

        let questions;

        if (random) {
            // For random selection, we fetch all matching and shuffle
            const allQuestions = await prisma.question.findMany({
                where,
                include: {
                    audioFile: true,
                },
            });

            // Shuffle array
            for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
            }

            questions = allQuestions.slice(0, limit);
        } else {
            questions = await prisma.question.findMany({
                where,
                take: limit,
                include: {
                    audioFile: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        // Remove correct answer from response for test-taking
        const sanitizedQuestions = questions.map(q => ({
            id: q.id,
            section: q.section,
            questionType: q.questionType,
            questionText: q.questionText,
            options: q.options,
            difficulty: q.difficulty,
            audioUrl: q.audioFile?.url,
            passageId: q.passageId,
        }));

        return NextResponse.json({ success: true, data: sanitizedQuestions });
    } catch (error) {
        console.error('Get questions error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
