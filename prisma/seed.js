// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.manager.createMany({
    data: [
      { fullName: 'John Doe', managerId: 'M001', email: 'john@example.com', level: 'SENIOR' },
      { fullName: 'Jane Smith', managerId: 'M002', email: 'jane@example.com', level: 'EXECUTIVE' },
    ],
  });

  await prisma.employee.createMany({
    data: [
      {
        fullName: 'Alice Johnson',
        employeeId: 'E001',
        email: 'alice@example.com',
        phoneNumber: '123-456-7890',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        hireDate: new Date('2023-01-15'),
        salary: 75000.00,
        status: 'ACTIVE',
        managerId: 1, // References John Doe
        addedById: 1, // Added by John Doe
        updatedById: 1, // Updated by John Doe
      },
      {
        fullName: 'Bob Wilson',
        employeeId: 'E002',
        email: 'bob@example.com',
        jobTitle: 'HR Specialist',
        department: 'HR',
        hireDate: new Date('2023-03-10'),
        salary: 60000.00,
        status: 'ACTIVE',
        managerId: 2, // References Jane Smith
        addedById: 2, // Added by Jane Smith
        updatedById: 2, // Updated by Jane Smith
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });