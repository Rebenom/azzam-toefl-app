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

// GET /api/admin/passages - List all passages
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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const [passages, total] = await Promise.all([
            prisma.passage.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { questions: true } },
                },
            }),
            prisma.passage.count(),
        ]);

        return NextResponse.json({
            success: true,
            data: passages.map(p => ({
                ...p,
                questionCount: p._count.questions,
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
        console.error('Get passages error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/admin/passages - Create new passage
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const body = await request.json();
        const { title, content, paragraphs } = body;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const passage = await prisma.passage.create({
            data: {
                title,
                content,
                paragraphs: paragraphs || [content],
            },
        });

        return NextResponse.json({ success: true, data: passage }, { status: 201 });
    } catch (error) {
        console.error('Create passage error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
