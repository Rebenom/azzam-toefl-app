import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET /api/admin/activity - Get recent activity
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        const activities = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        // Format time ago
        const formatTimeAgo = (date: Date) => {
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffMins < 1) return 'Baru saja';
            if (diffMins < 60) return `${diffMins} menit lalu`;
            if (diffHours < 24) return `${diffHours} jam lalu`;
            return `${diffDays} hari lalu`;
        };

        return NextResponse.json({
            success: true,
            data: activities.map(a => ({
                id: a.id,
                type: a.type,
                message: a.message,
                timeAgo: formatTimeAgo(a.createdAt),
                createdAt: a.createdAt,
            })),
        });
    } catch (error) {
        console.error('Get activity error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
