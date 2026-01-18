import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

// GET /api/passages/[id] - Get passage with its questions
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

        const passage = await prisma.passage.findUnique({
            where: { id: params.id },
            include: {
                questions: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        questionType: true,
                        questionText: true,
                        options: true,
                        difficulty: true,
                    },
                },
            },
        });

        if (!passage) {
            return NextResponse.json(
                { success: false, error: 'Passage not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: passage });
    } catch (error) {
        console.error('Get passage error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
