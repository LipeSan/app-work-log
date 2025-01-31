import { PrismaGetInstance } from '@/lib/prisma-pg'
import {NextRequest, NextResponse } from 'next/server'
import moment from 'moment';
import { getCurrentUser } from '@/lib/session';

const prisma = PrismaGetInstance()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { startDate, endDate } = body;
  const user:any = getCurrentUser()
  const endDateAux = endDate ? endDate : moment(startDate).add(13, 'days').format("YYYY-MM-DD");

  if(!user) {
    return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
  }

  if(!startDate) {
    return NextResponse.json({ error: 'Missing fields!' }, { status: 400 })
  }

  const paymentPeriod = await prisma.paymentPeriod.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDateAux),
    }
  });

  if(!paymentPeriod) {
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 400 })
  }

  return NextResponse.json({ paymentPeriod }, { status: 200 })
}

export async function GET() {
    const user:any = getCurrentUser()
  
    if(!user) {
      return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 })
    }
  
  
    const paymentPeriod = await prisma.paymentPeriod.findMany({orderBy: {startDate: 'asc'} });
    if(!paymentPeriod) {
      return NextResponse.json({ error: 'Something went wrong!' }, { status: 400 })
    }
  
    return NextResponse.json({ paymentPeriod }, { status: 200 })
  }