import { PrismaGetInstance } from '@/lib/prisma-pg'
import { getCurrentUser } from '@/lib/session';
import {NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const prisma = PrismaGetInstance()
  const body = await req.json()
  const { rate } = body
  const user = await getCurrentUser();
  if(!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if(!rate) {
    return NextResponse.json({ error: 'Missing fields!' }, { status: 400 })
  }
  const rateObject = await prisma.rate.create({
    data: {
        rate,
        userId: user.id
    }    
  });
  return NextResponse.json({ rateObject }, { status: 200 })
}

export async function GET() {
  const prisma = PrismaGetInstance()
  const user = await getCurrentUser();
  if(!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rateObject = await prisma.rate.findFirst({
    where: {
      userId: user.id
    }
  });
  return NextResponse.json({ rateObject }, { status: 200 })
}