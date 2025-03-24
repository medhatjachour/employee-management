'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Manager } from '../lib/type';

type Employee = {
  id: number; fullName: string; employeeId: string; jobTitle: string; department: string; status: string; manager?: { fullName: string };
};

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
      .then((data) => setManagers(data));
    fetch(`/api/employees?page=${page}&limit=${limit}&search=${search}&department=${department}&status=${status}&managerId=${managerId}`)
      .then((res) => res.json())
      .then((data) => {
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
      <h1 className="text-3xl font-bold mb-6">All Employees</h1>
      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Name, ID, or Job Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-auto"
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="border p-2 rounded">
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={managerId} onChange={(e) => setManagerId(e.target.value)} className="border p-2 rounded">
          <option value="">All Managers</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>{m.fullName}</option>
          ))}
        </select>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Job Title</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Manager</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border p-2">
                <Link href={`/employees/${employee.id}`} className="text-blue-500">{employee.fullName}</Link>
              </td>
              <td className="border p-2">{employee.employeeId}</td>
              <td className="border p-2">{employee.jobTitle}</td>
              <td className="border p-2">{employee.department}</td>
              <td className="border p-2">{employee.status}</td>
              <td className="border p-2">{employee.manager?.fullName || 'N/A'}</td>
              <td className="border p-2">
                <Link href={`/edit/${employee.id}`} className="text-blue-500 mr-2">Edit</Link>
                <button onClick={() => handleDelete(employee.id, employee.fullName)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border p-2 rounded">
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <div>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2">Previous</button>
          <span className="px-4">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2">Next</button>
        </div>
      </div>
    </Layout>
  );
}
