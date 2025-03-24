# Employee Management System

A full-stack CRUD app for managing employees and managers, built with Next.js, Prisma, SQLite, and Tailwind CSS.

## Setup
1. Clone the repo: `git clone <your-repo-url>`
2. Install dependencies: `npm install`
3. Set up the database: `npx prisma generate`
35. Set up the database: `npx prisma migrate dev --name init`
4. (Optional) Seed data: `npm run seed`
5. Run the app: `npm run dev`
<!-- npx prisma db seed --preview-feature -->
## Features
- Dashboard with stats (employees, new hires, active, managers).
- Add, view, edit, and delete employees with manager assignments and audit tracking.
- View managers and their levels (Junior, Senior, Executive).
- Search, filter (by manager), and paginate employee list.
- Responsive design with sidebar navigation.

## Deployment
Deployed on Vercel: [Live URL](#)

## file structure 

employee-management/
├── app/
│   ├── api/
│   │   ├── employees/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    // CRUD for a single employee
│   │   │   └── route.ts        // CRUD for all employees
│   │   └── managers/
│   │       └── route.ts        // CRUD for managers
│   ├── employees/
│   │   ├── [id]/
│   │   │   └── page.tsx        // View single employee details
│   │   └── page.tsx            // View all employees
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx        // Edit employee page
│   ├── add/
│   │   └── page.tsx            // Add employee page
│   ├── managers/
│   │   └── page.tsx            // View all managers
│   └── page.tsx                // Dashboard (home page)
├── components/
│   └── Layout.tsx              // Sidebar navigation component
├── lib/
│   └── prisma.ts               // Prisma client setup
├── prisma/
│   ├── schema.prisma           // Prisma schema
│   └── seed.ts                 // Optional seed script
├── styles/
│   └── globals.css             // Global styles with Tailwind
├── package.json                // Dependencies and scripts
└── tsconfig.json               // TypeScript config