'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Employee, Manager } from '../lib/type';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [managerId, setManagerId] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data: Manager[]) => setManagers(data));
    fetch(`/api/employees?page=${page}&limit=${limit}&search=${search}&department=${department}&status=${status}&managerId=${managerId}`)
      .then((res) => res.json())
      .then((data: { employees: Employee[]; total: number; pages: number }) => {
        setEmployees(data.employees);
        setTotalPages(data.pages);
      });
  }, [page, limit, search, department, status, managerId]);

  const handleDelete = async (id: number, fullName: string) => {
    if (confirm(`Are you sure you want to delete ${fullName}?`)) {
      await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Employees</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Name, ID, or Job Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border text-black border-gray-300 p-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className="border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Managers</option>
          {managers?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Manager</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition">
                <td className="p-3">
                  <Link href={`/employees/${employee.id}`} className="text-indigo-600 hover:underline">
                    {employee.fullName}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{employee.employeeId}</td>
                <td className="p-3 text-gray-600">{employee.jobTitle}</td>
                <td className="p-3 text-gray-600">{employee.department}</td>
                <td className="p-3 text-gray-600">{employee.status}</td>
                <td className="p-3 text-gray-600">{employee.manager?.fullName || 'N/A'}</td>
                <td className="p-3">
                  <Link href={`/edit/${employee.id}`} className="text-indigo-600 hover:underline mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.id, employee.fullName)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}