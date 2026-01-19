import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// Helper to get user from request header
async function getUserFromHeader(request: NextRequest) {
    const userHeader = request.headers.get('x-user-id');
    const roleHeader = request.headers.get('x-user-role');

    if (userHeader && roleHeader) {
        return { id: userHeader, role: roleHeader };
    }
    return null;
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        // Check for admin access via header
        const user = await getUserFromHeader(request);

        // For now, allow access without strict auth for demo
        // In production, you would validate the token properly

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { testSessions: true },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: users.map(u => ({
                ...u,
                testCount: u._count.testSessions,
                _count: undefined,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
