import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

// Define response types
interface DeptData {
  labels: string[];
  totalByDept: number[];
  activeByDept: number[];
  inactiveByDept: number[];
}

interface HireData {
  labels: string[];
  totalHires: number[];
  activeHires: number[];
  inactiveHires: number[];
}

interface Stats {
  totalEmployees: number;
  newHires: number;
  active: number;
  totalManagers: number;
}

interface DashboardResponse {
  stats: Stats;
  deptData: DeptData;
  hireData: HireData;
}

// Utility function to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
    return error.message;
  }
  return 'An unexpected error occurred';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeView = searchParams.get('timeView') || 'month';

  // Validate timeView
  if (!['day', 'month', 'year'].includes(timeView)) {
    return NextResponse.json(
      { error: 'Invalid timeView parameter. Use "day", "month", or "year".' },
      { status: 400 }
    );
  }

  try {
    // Fetch all employees and managers in one go
    const [employees, totalManagers] = await Promise.all([
      prisma.employee.findMany({
        select: {
          department: true,
          status: true,
          hireDate: true,
        },
      }),
      prisma.manager.count(),
    ]);

    // Stats Calculations
    const totalEmployees = employees.length;
    const newHires = employees.filter(
      (e) => new Date(e.hireDate).getMonth() === new Date().getMonth()
    ).length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    const stats: Stats = {
      totalEmployees,
      newHires,
      active,
      totalManagers,
    };

    // Bar Chart Data: Employees by Department
    const deptStats = employees.reduce(
      (acc, emp) => {
        acc.total[emp.department] = (acc.total[emp.department] || 0) + 1;
        if (emp.status === 'ACTIVE') {
          acc.active[emp.department] = (acc.active[emp.department] || 0) + 1;
        } else {
          acc.inactive[emp.department] = (acc.inactive[emp.department] || 0) + 1;
        }
        return acc;
      },
      {
        total: {} as Record<string, number>,
        active: {} as Record<string, number>,
        inactive: {} as Record<string, number>,
      }
    );

    const deptLabels = Object.keys(deptStats.total);
    const deptData: DeptData = {
      labels: deptLabels,
      totalByDept: deptLabels.map((dept) => deptStats.total[dept] || 0),
      activeByDept: deptLabels.map((dept) => deptStats.active[dept] || 0),
      inactiveByDept: deptLabels.map((dept) => deptStats.inactive[dept] || 0),
    };

    // Line Chart Data: Hires Over Time
    const hiresByTime = employees.reduce(
      (acc, emp) => {
        const hireDate = new Date(emp.hireDate);
        let key: string;
        switch (timeView) {
          case 'month':
            key = hireDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            break;
          case 'year':
            key = hireDate.getFullYear().toString();
            break;
          case 'day':
            key = hireDate.toLocaleDateString();
            break;
          default:
            throw new Error('Unexpected timeView value');
        }
        acc.total[key] = (acc.total[key] || 0) + 1;
        if (emp.status === 'ACTIVE') {
          acc.active[key] = (acc.active[key] || 0) + 1;
        } else {
          acc.inactive[key] = (acc.inactive[key] || 0) + 1;
        }
        return acc;
      },
      {
        total: {} as Record<string, number>,
        active: {} as Record<string, number>,
        inactive: {} as Record<string, number>,
      }
    );

    const hireLabels = Object.keys(hiresByTime.total).sort((a, b) => {
      if (timeView === 'year') return Number(a) - Number(b);
      return new Date(a) > new Date(b) ? 1 : -1;
    });
    const hireData: HireData = {
      labels: hireLabels,
      totalHires: hireLabels.map((key) => hiresByTime.total[key] || 0),
      activeHires: hireLabels.map((key) => hiresByTime.active[key] || 0),
      inactiveHires: hireLabels.map((key) => hiresByTime.inactive[key] || 0),
    };

    const response: DashboardResponse = { stats, deptData, hireData };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    const errorMessage = getErrorMessage(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}