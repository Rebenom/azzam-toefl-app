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

// GET /api/admin/stats/score-distribution - Get score distribution
export async function GET() {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const completedTests = await prisma.testSession.findMany({
            where: {
                status: 'COMPLETED',
                totalScore: { not: null },
            },
            select: { totalScore: true },
        });

        // Define score ranges
        const ranges = [
            { range: '310-350', min: 310, max: 350, count: 0 },
            { range: '351-400', min: 351, max: 400, count: 0 },
            { range: '401-450', min: 401, max: 450, count: 0 },
            { range: '451-500', min: 451, max: 500, count: 0 },
            { range: '501-550', min: 501, max: 550, count: 0 },
            { range: '551-600', min: 551, max: 600, count: 0 },
            { range: '601-650', min: 601, max: 650, count: 0 },
            { range: '651-677', min: 651, max: 677, count: 0 },
        ];

        // Count tests in each range
        completedTests.forEach(test => {
            const score = test.totalScore!;
            const range = ranges.find(r => score >= r.min && score <= r.max);
            if (range) {
                range.count++;
            }
        });

        return NextResponse.json({
            success: true,
            data: ranges.map(r => ({ range: r.range, count: r.count })),
        });
    } catch (error) {
        console.error('Get score distribution error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
