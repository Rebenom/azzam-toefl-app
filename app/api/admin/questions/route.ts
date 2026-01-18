import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { Section, QuestionType, Difficulty } from '@prisma/client';

// Middleware to check admin role
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Unauthorized', status: 401 };
    }
    if (session.user.role !== 'ADMIN') {
        return { error: 'Forbidden - Admin access required', status: 403 };
    }
    return { session };
}

// GET /api/admin/questions - List all questions (with filters)
export async function GET(request: NextRequest) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const section = searchParams.get('section') as Section | null;
        const difficulty = searchParams.get('difficulty') as Difficulty | null;
        const isActive = searchParams.get('isActive');

        const where: any = {};
        if (section) where.section = section;
        if (difficulty) where.difficulty = difficulty;
        if (isActive !== null) where.isActive = isActive === 'true';

        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    audioFile: true,
                    passage: { select: { id: true, title: true } },
                },
            }),
            prisma.question.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: questions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get questions error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/admin/questions - Create new question
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const body = await request.json();
        const {
            section,
            questionType,
            questionText,
            options,
            correctAnswer,
            explanation,
            difficulty,
            passageId,
        } = body;

        // Validation
        if (!section || !questionType || !questionText || !options || correctAnswer === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!Array.isArray(options) || options.length < 2) {
            return NextResponse.json(
                { success: false, error: 'Options must be an array with at least 2 items' },
                { status: 400 }
            );
        }

        if (correctAnswer < 0 || correctAnswer >= options.length) {
            return NextResponse.json(
                { success: false, error: 'correctAnswer must be a valid index' },
                { status: 400 }
            );
        }

        const question = await prisma.question.create({
            data: {
                section,
                questionType,
                questionText,
                options,
                correctAnswer,
                explanation,
                difficulty: difficulty || 'MEDIUM',
                passageId,
            },
            include: {
                passage: { select: { id: true, title: true } },
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: 'QUESTION_ADDED',
                message: `Admin added new ${section} question`,
                metadata: { questionId: question.id, section },
            },
        });

        return NextResponse.json({ success: true, data: question }, { status: 201 });
    } catch (error) {
        console.error('Create question error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
