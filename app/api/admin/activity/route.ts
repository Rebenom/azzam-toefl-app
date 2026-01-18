import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

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

// GET /api/admin/activity - Get recent activity log
export async function GET(request: NextRequest) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        const activities = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        // Format relative time
        const now = new Date();
        const formattedActivities = activities.map(activity => {
            const diffMs = now.getTime() - activity.createdAt.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let timeAgo: string;
            if (diffMins < 1) {
                timeAgo = 'Baru saja';
            } else if (diffMins < 60) {
                timeAgo = `${diffMins} menit lalu`;
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} jam lalu`;
            } else {
                timeAgo = `${diffDays} hari lalu`;
            }

            return {
                id: activity.id,
                type: activity.type,
                message: activity.message,
                time: timeAgo,
                createdAt: activity.createdAt,
            };
        });

        return NextResponse.json({ success: true, data: formattedActivities });
    } catch (error) {
        console.error('Get activity error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
