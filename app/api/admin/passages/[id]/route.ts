import { NextRequest, NextResponse } from 'next/server';
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

// GET /api/admin/passages/[id] - Get single passage
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        const passage = await prisma.passage.findUnique({
            where: { id: params.id },
            include: {
                questions: true,
            },
        });

        if (!passage) {
            return NextResponse.json(
                { success: false, error: 'Passage not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: passage });
    } catch (error) {
        console.error('Get passage error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/passages/[id] - Update passage
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const updateData: any = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (paragraphs) updateData.paragraphs = paragraphs;

        const passage = await prisma.passage.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, data: passage });
    } catch (error) {
        console.error('Update passage error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/passages/[id] - Delete passage
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdmin();
        if ('error' in auth) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: auth.status }
            );
        }

        await prisma.passage.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: 'Passage deleted' });
    } catch (error) {
        console.error('Delete passage error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
