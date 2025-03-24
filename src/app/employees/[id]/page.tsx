'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Employee } from '@/app/lib/type';

export default function EmployeeDetail({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetch(`/api/employees/${params.id}`)
        .then((res) => res.json())
        .then((data) => setEmployee(data));
    }
  }, [params.id]);

  if (!employee) return <Layout><p>Loading...</p></Layout>;

  const handleDelete = async () => {
    if (confirm(`Delete ${employee.fullName}?`)) {
      await fetch(`/api/employees/${params.id}`, { method: 'DELETE' });
      router.push('/employees');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{employee.fullName}</h1>
      <div className="bg-white p-6 rounded shadow max-w-lg">
        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phoneNumber || 'N/A'}</p>
        <p><strong>Job Title:</strong> {employee.jobTitle}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
        <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Manager:</strong> {employee.manager?.fullName || 'N/A'} ({employee.manager?.level || ''})</p>
        <p><strong>Added By:</strong> {employee.addedBy?.fullName} on {new Date(employee.createdAt).toLocaleString()}</p>
        <p><strong>Last Updated By:</strong> {employee.updatedBy?.fullName} on {new Date(employee.updatedAt).toLocaleString()}</p>
        <div className="mt-4 space-x-4">
          <Link href={`/edit/${employee.id}`} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Edit</Link>
          <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    </Layout>
  );
}