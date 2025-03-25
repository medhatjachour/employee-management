import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
function normalizeStatus(status: string): EmployeeStatus {
// Utility function to normalize status to EmployeeStatus enum
// function normalizeStatus(status: string): Prisma.EmployeeStatus {
  const upperStatus = status.toUpperCase();
  if (upperStatus === 'ACTIVE' || upperStatus === 'INACTIVE') {
    return upperStatus as EmployeeStatus;
  }
  throw new Error('Invalid status value. Must be "ACTIVE" or "INACTIVE"');
}

// Utility function to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    switch (error.code) {
      case 'P2002':
        return `Duplicate entry: ${error.meta?.target || 'field'} already exists`;
      case 'P2003':
        return 'Invalid foreign key reference';
      case 'P2025':
        return 'Record not found';
      default:
        return `Database error: ${error.message}`;
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return `Validation error: ${error.message}`;
  } else if (error instanceof Error) {
    return error.message; // Generic error message
  }
  return 'An unexpected error occurred';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const department = searchParams.get('department');
  const status = searchParams.get('status');
  const managerId = searchParams.get('managerId');
  const skip = (page - 1) * limit;

  const where: Prisma.EmployeeWhereInput = {
    OR: [
      { fullName: { contains: search } },
      { employeeId: { contains: search } },
      { jobTitle: { contains: search } },
    ],
    ...(department && { department }),
    ...(status && { status: normalizeStatus(status) }),
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
    console.error('GET /api/employees error:', error);
    const errorMessage = getErrorMessage(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    fullName,
    employeeId,
    email,
    phoneNumber,
    jobTitle,
    department,
    hireDate,
    salary,
    status,
    managerId,
    addedById,
  } = body as {
    fullName: string;
    employeeId: string;
    email: string;
    phoneNumber?: string;
    jobTitle: string;
    department: string;
    hireDate: string;
    salary: string | number;
    status?: string;
    managerId?: string | number;
    addedById: string | number;
  };

  if (!fullName || !employeeId || !email || !addedById) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        fullName,
        employeeId,
        email,
        phoneNumber: phoneNumber || null,
        jobTitle,
        department,
        hireDate: new Date(hireDate),
        salary: typeof salary === 'string' ? parseFloat(salary) : salary || 0.00,
        status: status ? normalizeStatus(status) : 'ACTIVE',
        managerId: managerId ? Number(managerId) : null,
        addedById: Number(addedById),
        updatedById: Number(addedById),
      },
      include: { manager: true, addedBy: true, updatedBy: true },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('POST /api/employees error:', error);
    const errorMessage = getErrorMessage(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}