import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// GET /api/users/me/stats - Get user statistics
export async function GET(request: NextRequest) {
    try {
        // Get user ID from header (sent by frontend)
        const userId = request.headers.get('x-user-id');

        // If no user ID, return empty stats (for demo)
        if (!userId) {
            return NextResponse.json({
                success: true,
                data: {
                    totalTests: 0,
                    completedTests: 0,
                    highestScore: 0,
                    averageScore: 0,
                    lastTestDate: null,
                    recentTests: [],
                    sectionAverages: {
                        listening: 0,
                        structure: 0,
                        reading: 0,
                    },
                },
            });
        }

        // Get all test sessions for user
        const testSessions = await prisma.testSession.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
        });

        const completedTests = testSessions.filter(t => t.status === 'COMPLETED');

        // Calculate statistics
        const totalTests = testSessions.length;
        const completedCount = completedTests.length;

        let highestScore = 0;
        let totalScore = 0;
        let totalListening = 0;
        let totalStructure = 0;
        let totalReading = 0;

        for (const test of completedTests) {
            if (test.totalScore) {
                totalScore += test.totalScore;
                if (test.totalScore > highestScore) {
                    highestScore = test.totalScore;
                }
            }
            if (test.listeningScore) totalListening += test.listeningScore;
            if (test.structureScore) totalStructure += test.structureScore;
            if (test.readingScore) totalReading += test.readingScore;
        }

        const averageScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;
        const lastTestDate = testSessions.length > 0 ? testSessions[0].startedAt : null;

        // Get recent tests for display
        const recentTests = completedTests.slice(0, 5).map(t => ({
            id: t.id,
            totalScore: t.totalScore,
            listeningScore: t.listeningScore,
            structureScore: t.structureScore,
            readingScore: t.readingScore,
            completedAt: t.completedAt,
        }));

        const stats = {
            totalTests,
            completedTests: completedCount,
            highestScore,
            averageScore,
            lastTestDate,
            recentTests,
            sectionAverages: {
                listening: completedCount > 0 ? Math.round(totalListening / completedCount) : 0,
                structure: completedCount > 0 ? Math.round(totalStructure / completedCount) : 0,
                reading: completedCount > 0 ? Math.round(totalReading / completedCount) : 0,
            },
        };

        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        console.error('Get user stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
