import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../../lib/auth';
import prisma from '../../../../../lib/prisma';

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

// PUT /api/admin/questions/[id] - Update question
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            questionType,
            questionText,
            options,
            correctAnswer,
            explanation,
            difficulty,
            isActive,
            passageId,
        } = body;

        const updateData: any = {};
        if (questionType) updateData.questionType = questionType;
        if (questionText) updateData.questionText = questionText;
        if (options) updateData.options = options;
        if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
        if (explanation !== undefined) updateData.explanation = explanation;
        if (difficulty) updateData.difficulty = difficulty;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (passageId !== undefined) updateData.passageId = passageId;

        const question = await prisma.question.update({
            where: { id: params.id },
            data: updateData,
            include: {
                audioFile: true,
                passage: { select: { id: true, title: true } },
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: 'QUESTION_UPDATED',
                message: `Admin updated ${question.section} question`,
                metadata: { questionId: question.id },
            },
        });

        return NextResponse.json({ success: true, data: question });
    } catch (error) {
        console.error('Update question error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/questions/[id] - Delete question
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        await prisma.question.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: 'Question deleted' });
    } catch (error) {
        console.error('Delete question error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
