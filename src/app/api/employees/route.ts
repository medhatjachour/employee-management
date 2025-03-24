import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const department = searchParams.get('department');
  const status = searchParams.get('status');
  const managerId = searchParams.get('managerId');
  const skip = (page - 1) * limit;

  const where: {
    OR: { fullName?: { contains: string, mode: 'insensitive' }, employeeId?: { contains: string, mode: 'insensitive' }, jobTitle?: { contains: string, mode: 'insensitive' } }[],
    department?: string,
    status?: string,
    managerId?: number | null
  } = {
    OR: [
      { fullName: { contains: search, mode: 'insensitive' } },
      { employeeId: { contains: search, mode: 'insensitive' } },
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ],
    ...(department && { department }),
    ...(status && { status }),
    ...(managerId && { managerId: Number(managerId) }),
  };

  try {
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fullName: 'asc' },
        include: { manager: true, addedBy: true, updatedBy: true },
      }),
      prisma.employee.count({ where }),
    ]);
    return NextResponse.json({ employees, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, employeeId, email, phoneNumber, jobTitle, department, hireDate, salary, status, managerId, addedById } = body;
  if (!fullName || !employeeId || !email || !addedById) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const employee = await prisma.employee.create({
      data: {
        fullName,
        employeeId,
        email,
        phoneNumber,
        jobTitle,
        department,
        hireDate: new Date(hireDate),
        salary: parseFloat(salary),
        status,
        managerId: managerId ? Number(managerId) : null,
        addedById: Number(addedById),
        updatedById: Number(addedById),
      },
      include: { manager: true, addedBy: true, updatedBy: true },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}