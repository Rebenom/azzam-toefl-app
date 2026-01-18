import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../lib/auth';
import prisma from '../../../lib/prisma';

// GET /api/passages - Get all passages
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const passages = await prisma.passage.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                content: true,
                paragraphs: true,
            },
        });

        return NextResponse.json({ success: true, data: passages });
    } catch (error) {
        console.error('Get passages error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
