import { NextResponse } from 'next/server';
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

// GET /api/admin/stats/overview - Get dashboard statistics
export async function GET() {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalQuestions, totalUsers, testsToday, completedTests] = await Promise.all([
            prisma.question.count({ where: { isActive: true } }),
            prisma.user.count(),
            prisma.testSession.count({
                where: {
                    startedAt: { gte: today },
                },
            }),
            prisma.testSession.findMany({
                where: { status: 'COMPLETED' },
                select: { totalScore: true },
            }),
        ]);

        const averageScore =
            completedTests.length > 0
                ? Math.round(
                    completedTests.reduce((sum, t) => sum + (t.totalScore || 0), 0) /
                    completedTests.length
                )
                : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalQuestions,
                totalUsers,
                testsToday,
                averageScore,
            },
        });
    } catch (error) {
        console.error('Get overview stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
