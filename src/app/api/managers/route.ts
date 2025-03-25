// app/api/managers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const managers = await prisma.manager.findMany();
    return NextResponse.json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, managerId, email, level } = body;

    // Validation
    if (!fullName || !managerId || !email || !level) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const validLevels = ['JUNIOR', 'SENIOR', 'EXECUTIVE'];
    if (!validLevels.includes(level)) {
      return NextResponse.json({ error: 'Invalid manager level' }, { status: 400 });
    }

    // Check for duplicates
    const existingManager = await prisma.manager.findFirst({
      where: { OR: [{ managerId }, { email }] },
    });
    if (existingManager) {
      return NextResponse.json(
        { error: 'Manager ID or email already exists' },
        { status: 400 }
      );
    }

    const manager = await prisma.manager.create({
      data: { fullName, managerId, email, level },
    });
    return NextResponse.json(manager, { status: 201 });
  } catch (error) {
    console.error('Error creating manager:', error);
    return NextResponse.json({ error: 'Failed to create manager' }, { status: 500 });
  }
}