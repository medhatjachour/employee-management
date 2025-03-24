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
      .then((data) => setManagers(data));
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
      <h1 className="text-3xl font-bold mb-6">Add Employee</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input type="text" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="border p-2 w-full rounded" />
        <input type="text" placeholder="Job Title" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="border p-2 w-full rounded" />
        <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border p-2 w-full rounded">
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
        <input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="border p-2 w-full rounded" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border p-2 w-full rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })} className="border p-2 w-full rounded">
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>{m.fullName} ({m.level})</option>
          ))}
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-x-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save</button>
          <button type="button" onClick={() => router.push('/employees')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </Layout>
  );
}