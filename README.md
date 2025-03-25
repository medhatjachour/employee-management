# 🏢 Employee Management Dashboard
A modern web application built with Next.js to manage employee data, visualize workforce statistics, and perform CRUD operations.

---
## 🖼️ **Screenshots**

![Home Page](https://github.com/medhatjachour/employee-management/blob/main/samples/1.png?raw=true)
*Home Page - Dashboard to view data.*

https://employee-management-theta-amber.vercel.app/

![Home Page](https://github.com/medhatjachour/employee-management/blob/main/samples/2.png?raw=true)
*Employees  - View all the employees with filtration and search option.*
https://employee-management-theta-amber.vercel.app/employee


![Home Page](https://github.com/medhatjachour/employee-management/blob/main/samples/3.png?raw=true)
*Add employee - input with validation and feedback .*
https://employee-management-theta-amber.vercel.app/add


![live Preview](https://employee-management-theta-amber.vercel.app/)

## ✨ Features

- **📝 Employee CRUD** - Full Create, Read, Update, Delete functionality
- **📊 Data Visualization** - Interactive charts for department distribution and hiring trends
- **🔍 Advanced Filtering** - Filter employees by multiple criteria
- **📱 Responsive Design** - Works on all device sizes
- **🔄 Real-time Updates** - Instant feedback on all operations
- **🔒 Type Safety** - Built with TypeScript

## 🛠 Tech Stack

| Category       | Technology   |
|----------------|------------  |
| Framework      | Next.js 14   |
| Language       | TypeScript   |
| ORM            | Prisma       |
| Database       | SQL LITE     |
| Styling        | Tailwind CSS |
| Visualization  | Chart.js     |
| Deployment     | Vercel       |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- SQL LITE  
- Git


### Installation
1. Clone the repository:
```bash
git clone https://github.com/medhatjachour/employee-management.git
cd employee-management
```

2. Install dependencies:
```bash
npm install 
```
3. Set up database:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed 
```
3. run server :
```bash
npm run dev
```


## 🌐 API Endpoints

| Endpoint                   | Method | Description                    |
|----------------------------|--------|--------------------------------|
| `/api/employees`           | GET    | List all employees             |
| `/api/employees`           | POST   | Create new employee            |
| `/api/employees/[id]`      | GET    | Get single employee            |
| `/api/employees/[id]`      | PUT    | Update employee                |
| `/api/employees/[id]`      | DELETE | Delete employee                |
| `/api/dashboard`           | GET    | Get dashboard stats            |

## 📁 Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── dashboard/     # Dashboard data endpoint
│   │   │   └── route.ts
│   │   ├── employees/     # Employee CRUD endpoints
│   │   │   ├── [id]/      # Dynamic route for single employee
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── managers/      # Managers endpoint
│   │       └── route.ts
│   ├── employees/         # Employee pages
│   │   ├── [id]/          # Employee detail page
│   │   │   └── page.tsx
│   ├── edit/          # Edit employee page
│   │   └── [id]/
│   │       └── page.tsx
│   │   └── page.tsx       # Employee list page
│   ├── managers/    
│   │   └── page.tsx       # Managers list page
│   ├── add/    
│   │   └── page.tsx       # Add Employee page
│   ├── page.tsx           # Dashboard (root page)
│   ├── globals.css        # Global styles (Tailwind)
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── Layout.tsx         # Main layout component for navigation
├── lib/                   # Utilities and types
│   ├── prisma.ts          # Prisma client setup
│   └── types.ts           # TypeScript types (Employee, Manager)
├── public/                # Static assets
│   ├── favicon.ico
│   └── logo.png
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── .eslintrc.json         # ESLint config
├── .gitignore
├── next.config.js         # Next.js config
├── package.json
├── postcss.config.js      # PostCSS config for Tailwind
├── tailwind.config.js     # Tailwind config
└── tsconfig.json          # TypeScript config
```