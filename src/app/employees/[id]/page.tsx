'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { toast } from 'react-toastify';
import { Employee } from '@/app/lib/type';

// Utility function to format datetime in a readable way
const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long', // e.g., "March"
    day: 'numeric', // e.g., "25"
    year: 'numeric', // e.g., "2025"
    hour: 'numeric', // e.g., "3 PM"
    minute: '2-digit', // e.g., "45"
    hour12: true, // 12-hour format with AM/PM
  });
};

export default function EmployeeDetail() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    if (id) {
      setIsLoading(true); // Start loading
      fetch(`/api/employees/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch employee');
          return res.json();
        })
        .then((data: Employee) => {
          setEmployee(data);
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
          setEmployee(null); // Handle error state
        })
        .finally(() => setIsLoading(false)); // Stop loading
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm(`Delete ${employee?.fullName}?`)) {
      try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete employee');
        toast.success(`Deleted ${employee?.fullName} successfully!`); // Changed to success
        router.push('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  // Show spinner while loading
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // Show error or no data message if employee is null
  if (!employee) {
    return (
      <Layout>
        <p className="text-gray-600">Employee not found</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{employee.fullName}</h1>
      <div className="text-black bg-white p-6 rounded-lg shadow-md max-w-4xl">
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
            <span className="text-gray-600">{formatDateTime(employee.hireDate)}</span>
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
              {employee.manager ? `${employee.manager.fullName} (${employee.manager.level})` : 'N/A'}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Added By:</strong>{' '}
            <span className="text-gray-600">
              {employee.addedBy?.fullName} on {formatDateTime(employee.createdAt)}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Last Updated By:</strong>{' '}
            <span className="text-gray-600">
              {employee.updatedBy?.fullName} on {formatDateTime(employee.updatedAt)}
            </span>
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Link
            href={`/edit/${employee.id}`}
            className="px-10 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-10 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Layout>
  );
}