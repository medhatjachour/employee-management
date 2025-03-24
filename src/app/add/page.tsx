'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { Manager } from '../lib/type';

export default function AddEmployee() {
  const [form, setForm] = useState({
    fullName: '', employeeId: '', email: '', phoneNumber: '', jobTitle: '', department: '', hireDate: '', salary: '', status: 'Active', managerId: '', addedById: '1',
  });
  const [error, setError] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data: Manager[]) => setManagers(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.employeeId || !form.email) {
      setError('Please fill in all required fields');
      return;
    }
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      if (confirm('Employee added successfully!')) router.push('/employees');
    } else setError('Failed to add employee');
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-lg shadow-md max-w-2xl space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Employee ID</label>
          <input
            type="text"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="text-black w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className=" w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Department</label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Hire Date</label>
          <input
            type="date"
            value={form.hireDate}
            onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Salary</label>
          <input
            type="number"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Manager</label>
          <select
            value={form.managerId}
            onChange={(e) => setForm({ ...form, managerId: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} ({m.level})
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/employees')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
}