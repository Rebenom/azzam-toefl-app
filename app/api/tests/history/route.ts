import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

// GET /api/tests/history - Get user's test history
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const testSessions = await prisma.testSession.findMany({
            where: {
                userId: session.user.id,
                status: 'COMPLETED',
            },
            orderBy: { finishedAt: 'desc' },
            select: {
                id: true,
                startedAt: true,
                finishedAt: true,
                listeningScore: true,
                structureScore: true,
                readingScore: true,
                totalScore: true,
            },
        });

        return NextResponse.json({ success: true, data: testSessions });
    } catch (error) {
        console.error('Get test history error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
