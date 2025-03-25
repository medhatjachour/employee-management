'use client';
import { useState, useEffect } from 'react';
import { useRouter,useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Manager } from '@/app/lib/type';



export default function EditEmployee() {
  const [form, setForm] = useState({
    fullName: '', employeeId: '', email: '', phoneNumber: '', jobTitle: '', department: '', hireDate: '', salary: '', status: '', managerId: '', updatedById: '1',
  });
  const [error, setError] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data) => setManagers(data));
    if (id) {
      fetch(`/api/employees/${id}`)
        .then((res) => res.json())
        .then((data) => setForm({
          ...data,
          hireDate: new Date(data.hireDate).toISOString().split('T')[0],
          salary: data.salary.toString(),
          managerId: data.managerId?.toString() || '',
          updatedById: data.updatedById?.toString() || '1',
        }));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      if (confirm('Employee updated successfully!')) router.push('/employees');
    } else setError('Failed to update employee');
  };

  return (
    <Layout>
      <h1 className="text-3xl text-gray-600 font-bold mb-6">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="text-black space-y-4 max-w-lg">
        <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="text" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full rounded" required />
        <input type="text" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="border p-2 w-full rounded" />
        <input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="border p-2 w-full rounded" />
        <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border p-2 w-full rounded">
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
        <input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} className="border p-2 w-full rounded" />
        <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="border p-2 w-full rounded" />
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
          <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 cursor-pointer ">Save</button>
          <button type="button" onClick={() => router.push('/employees')} className="bg-gray-300 p-2 rounded hover:bg-gray-400  cursor-pointer ">Cancel</button>
        </div>
      </form>
    </Layout>
  );
}