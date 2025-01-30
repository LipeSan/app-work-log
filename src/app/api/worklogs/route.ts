import { PrismaGetInstance } from '@/lib/prisma-pg'
import { getCurrentUser } from '@/lib/session';
import {NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const prisma = PrismaGetInstance()
  const body = await req.json()
  const { date, startTime, endTime } = body
  const user = await getCurrentUser();
  if(!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if(!date || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing fields!' }, { status: 400 })
  }
  const splitStartTime = startTime.split(':');
  const splitEndTime = endTime.split(':');
  if(splitStartTime[0] > splitEndTime[0]){
    return NextResponse.json({ error: 'Start time must be lesser than End time!' }, { status: 400 })
  } else if(splitStartTime[0] === splitEndTime[0] && splitStartTime[1] >= splitEndTime[1]){
    return NextResponse.json({ error: 'Start time must be lesser than End time!' }, { status: 400 })
  }
  const worklog = await prisma.worklog.create({
    data: {
      date,
      startTime,
      endTime,
      userId: user.id
    }    
  });
  return NextResponse.json({ worklog }, { status: 200 })
}

export async function GET() {
  const prisma = PrismaGetInstance()
  const user = await getCurrentUser();
  if(!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const worklogs = await prisma.worklog.findMany({
    where: {
      userId: user.id
    }, 
    orderBy: {
      date: 'asc'
    }
  });
  return NextResponse.json({ worklogs }, { status: 200 })
}