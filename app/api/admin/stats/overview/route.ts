import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET /api/admin/stats/overview
export async function GET(request: NextRequest) {
    try {
        // Get total counts
        const [totalUsers, totalQuestions, testsToday, completedTests] = await Promise.all([
            prisma.user.count(),
            prisma.question.count({ where: { isActive: true } }),
            prisma.testSession.count({
                where: {
                    startedAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.testSession.findMany({
                where: { status: 'COMPLETED' },
                select: { totalScore: true },
            }),
        ]);

        // Calculate average score
        const totalScore = completedTests.reduce((sum, test) => sum + (test.totalScore || 0), 0);
        const averageScore = completedTests.length > 0 ? Math.round(totalScore / completedTests.length) : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalQuestions,
                testsToday,
                averageScore,
                completedTestsCount: completedTests.length,
            },
        });
    } catch (error) {
        console.error('Get admin overview error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
