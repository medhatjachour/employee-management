import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
export async function GET() {
  try {
    const managers = await prisma.manager.findMany();
    return NextResponse.json(managers);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, managerId, email, level } = body;
  if (!fullName || !managerId || !email || !level) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const manager = await prisma.manager.create({
      data: { fullName, managerId, email, level },
    });
    return NextResponse.json(manager, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create manager' }, { status: 500 });
  }
}
