import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.manager.createMany({
    data: [
      { fullName: 'John Doe', managerId: 'M001', email: 'john@example.com', level: 'Senior' },
      { fullName: 'Jane Smith', managerId: 'M002', email: 'jane@example.com', level: 'Executive' },
    ],
  });
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); });