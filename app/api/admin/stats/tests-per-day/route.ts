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

// GET /api/admin/stats/tests-per-day - Get tests per day for last 30 days
export async function GET() {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const tests = await prisma.testSession.findMany({
            where: {
                startedAt: { gte: thirtyDaysAgo },
            },
            select: { startedAt: true },
        });

        // Group by date
        const testsPerDay: { [key: string]: number } = {};

        // Initialize all 30 days with 0
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            testsPerDay[dateStr] = 0;
        }

        // Count tests per day
        tests.forEach(test => {
            const dateStr = test.startedAt.toISOString().split('T')[0];
            if (testsPerDay[dateStr] !== undefined) {
                testsPerDay[dateStr]++;
            }
        });

        // Convert to array and sort by date
        const data = Object.entries(testsPerDay)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Get tests per day error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
