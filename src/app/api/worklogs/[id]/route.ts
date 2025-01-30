import { PrismaGetInstance } from '@/lib/prisma-pg'
import { getCurrentUser } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const prisma = PrismaGetInstance()
    const user = await getCurrentUser();
    const body = await req.json();
    const paramsAux = await params;
    const { date, startTime, endTime } = body;
    if (!user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!paramsAux || !paramsAux.id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

    const id = paramsAux.id;
    const worklog = await prisma.worklog.update({
        where: { id: id },
        data: {
            date,
            startTime,
            endTime
        }
    });
    if (!worklog) {
        return NextResponse.json({ error: 'Worklog not found' }, { status: 404 })
    }
    return NextResponse.json({ worklog }, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    console.log(req.json());
    const prisma = PrismaGetInstance()
    const user:any = await getCurrentUser();
    const paramsAux = await params;
    if (!user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!paramsAux || !paramsAux.id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

    const id = paramsAux.id;
    const worklog = await prisma.worklog.delete({
        where: { id: id },
    });
    if (!worklog) {
        return NextResponse.json({ error: 'Worklog not found' }, { status: 404 })
    }
    return NextResponse.json({ worklog }, { status: 200 })
}