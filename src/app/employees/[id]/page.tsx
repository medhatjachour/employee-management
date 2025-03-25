'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Employee } from '@/app/lib/type';
import { toast } from 'react-toastify';



interface EmployeeDetailProps {
  params: { id: string }; // Explicit type for Client Component
}
export default function EmployeeDetail({ params }:EmployeeDetailProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const router = useRouter();
  const { id } = params; // Destructure id directly since it's not a Promise in Client Components

  useEffect(() => {
    if (id) {
      fetch(`/api/employees/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch employee');
          return res.json();
        })
        .then((data: Employee) => setEmployee(data))
        .catch((error) => {
          console.error('Error fetching employee:', error);
          setEmployee(null); // Handle error state if needed
        });
    }
  }, [id]); // Dependency on id, not params.id

  if (!employee) return <Layout><p className="text-gray-600">Loading...</p></Layout>;

  const handleDelete = async () => {

    if (confirm(`Delete ${employee.fullName}?`)) {
      
   
      try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete employee');
      toast.done(`Deleted ${employee.fullName}...`);

        router.push('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{employee.fullName}</h1>
      <div className="text-black bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-700">Employee ID:</strong>{' '}
            <span className="text-gray-600">{employee.employeeId}</span>
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{' '}
            <span className="text-gray-600">{employee.email}</span>
          </p>
          <p>
            <strong className="text-gray-700">Phone:</strong>{' '}
            <span className="text-gray-600">{employee.phoneNumber || 'N/A'}</span>
          </p>
          <p>
            <strong className="text-gray-700">Job Title:</strong>{' '}
            <span className="text-gray-600">{employee.jobTitle}</span>
          </p>
          <p>
            <strong className="text-gray-700">Department:</strong>{' '}
            <span className="text-gray-600">{employee.department}</span>
          </p>
          <p>
            <strong className="text-gray-700">Hire Date:</strong>{' '}
            <span className="text-gray-600">{new Date(employee.hireDate).toLocaleDateString()}</span>
          </p>
          <p>
            <strong className="text-gray-700">Salary:</strong>{' '}
            <span className="text-gray-600">${employee.salary.toLocaleString()}</span>
          </p>
          <p>
            <strong className="text-gray-700">Status:</strong>{' '}
            <span className="text-gray-600">{employee.status}</span>
          </p>
          <p>
            <strong className="text-gray-700">Manager:</strong>{' '}
            <span className="text-gray-600">
              {employee.manager?.fullName || 'N/A'} ({employee.manager?.level || ''})
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Added By:</strong>{' '}
            <span className="text-gray-600">
              {employee.addedBy?.fullName} on {new Date(employee.createdAt).toLocaleString()}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Last Updated By:</strong>{' '}
            <span className="text-gray-600">
              {employee.updatedBy?.fullName} on {new Date(employee.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Link
            href={`/edit/${employee.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Layout>
  );
}