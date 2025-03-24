import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { manager: true, addedBy: true, updatedBy: true },
    });
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
    const { id } = await params;
  const body = await req.json();
  const { fullName, employeeId, email, phoneNumber, jobTitle, department, hireDate, salary, status, managerId, updatedById } = body;
  try {
    const employee = await prisma.employee.update({
      where: { id: Number(id) },
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
        updatedById: Number(updatedById),
      },
      include: { manager: true, addedBy: true, updatedBy: true },
    });
    return NextResponse.json(employee);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
    const { id } = await params;
  try {
    await prisma.employee.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}