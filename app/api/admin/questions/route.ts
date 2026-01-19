import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET /api/admin/questions - List questions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const section = searchParams.get('section');
        const search = searchParams.get('search');

        const where: any = { isActive: true };
        if (section) where.section = section;
        if (search) {
            where.questionText = { contains: search, mode: 'insensitive' };
        }

        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
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

// POST /api/admin/questions - Create question
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { section, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty } = body;

        if (!section || !questionText || !optionA || !optionB || !optionC || !correctAnswer) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const question = await prisma.question.create({
            data: {
                section,
                questionText,
                optionA,
                optionB,
                optionC,
                optionD: optionD || null,
                correctAnswer,
                difficulty: difficulty || 'MEDIUM',
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
