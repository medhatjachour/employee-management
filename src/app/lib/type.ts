export interface Manager {
    id: number;
    fullName: string;
    managerId: string;
    email: string;
    level: string; // Could be an enum: 'Junior' | 'Senior' | 'Executive'
    createdAt: string; // ISO string from DateTime
    employees?: Employee[]; // Optional relation
    added?: Employee[]; // Optional relation
    updated?: Employee[]; // Optional relation
  }
  
  export interface Employee {
    id: number;
    fullName: string;
    employeeId: string;
    email: string;
    phoneNumber: string | null;
    jobTitle: string;
    department: string;
    hireDate: string; // ISO string from DateTime
    salary: number;
    status: string; // Could be an enum: 'Active' | 'Inactive'
    profilePic: string | null;
    createdAt: string; // ISO string from DateTime
    updatedAt: string; // ISO string from DateTime
    addedById: number | null;
    updatedById: number | null;
    managerId: number | null;
    addedBy?: Manager | null;
    updatedBy?: Manager | null;
    manager?: Manager | null;
  }