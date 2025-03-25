'use client';
import { Employee, Manager } from '../lib/type';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      <div
        className={`mb-6 flex flex-col gap-4 ${
          isFilterOpen ? 'block' : 'hidden'
        } md:flex md:flex-row md:gap-4 `}
      >
        <input
          type="text"
          placeholder="Search by Name, ID, or Job Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className="w-full border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Managers</option>
          {managers?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <th className="p-2 text-left font-semibold w-[25%]">Name</th>
              <th className="p-2 text-left font-semibold w-[15%]">ID</th>
              <th className="p-2 text-left font-semibold w-[20%] hidden sm:table-cell">Job Title</th>
              <th className="p-2 text-left font-semibold w-[15%] hidden sm:table-cell">Dept</th>
              <th className="p-2 text-left font-semibold w-[10%] hidden md:table-cell">Status</th>
              <th className="p-2 text-left font-semibold w-[15%] hidden md:table-cell">Manager</th>
              <th className="p-2 text-left font-semibold w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition border-b border-gray-200">
                <td className="p-2 truncate">
                  <Link href={`/employees/${employee.id}`} className="text-indigo-600 hover:underline">
                    {employee.fullName}
                  </Link>
                </td>
                <td className="p-2 text-gray-600 truncate">{employee.employeeId}</td>
                <td className="p-2 text-gray-600 truncate hidden sm:table-cell">{employee.jobTitle}</td>
                <td className="p-2 text-gray-600 truncate hidden sm:table-cell">{employee.department}</td>
                <td className="p-2 text-gray-600 truncate hidden md:table-cell">{employee.status}</td>
                <td className="p-2 text-gray-600 truncate hidden md:table-cell">{employee.manager?employee.manager.fullName : 'N/A'}</td>
                <td className="p-2 flex gap-1 whitespace-nowrap">
                  <Link href={`/edit/${employee.id}`} className="px-3 text-indigo-600 hover:underline">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.id, employee.fullName)}
                    className="px-3 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )):(<>LoadingPage</>)}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full sm:w-auto border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}