import { PrismaGetInstance } from '@/lib/prisma-pg'
import {NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const prisma = PrismaGetInstance()
  const body = await req.json()
  const { fullName, email, password } = body

  if(!fullName || !email || !password) {
    return NextResponse.json({ error: 'Missing fields!' }, { status: 400 })
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if(isUserExists){
    return NextResponse.json({ error: 'Email already exists!' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword
    }
  });

  if(!user) {
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 400 })
  }

  const rate = await prisma.rate.create({
    data: {
        rate: 25,
        userId: user.id
    }    
  });
  return NextResponse.json({ user }, { status: 200 })
}