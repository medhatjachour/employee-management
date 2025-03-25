'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast styling
import { Manager } from '../lib/type';

export default function AddEmployee() {
  const [form, setForm] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    hireDate: '',
    salary: '',
    status: 'ACTIVE', // Default to match Prisma enum
    managerId: '',
    addedById: '1', // Assuming a default admin ID; adjust as needed
  });
  const [error, setError] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch managers');
        return res.json();
      })
      .then((data: Manager[]) => setManagers(data))
      .catch((err) => {
        console.error('Error fetching managers:', err);
        toast.error('Failed to load managers');
      });
  }, []);

  const validateForm = () => {
    const errors: string[] = [];
    if (!form.fullName.trim()) errors.push('Full Name is required');
    if (!form.employeeId.trim()) errors.push('Employee ID is required');
    if (!form.email.trim()) errors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.push('Email is invalid');
    if (form.salary && isNaN(Number(form.salary))) errors.push('Salary must be a valid number');
    if (form.hireDate && isNaN(Date.parse(form.hireDate))) errors.push('Hire Date is invalid');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      toast.error(validationErrors.join(', '));
      return;
    }

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: form.status.toUpperCase(), // Ensure status matches Prisma enum (ACTIVE/INACTIVE)
          salary: form.salary ? Number(form.salary) : null, // Convert to number or null
          managerId: form.managerId ? Number(form.managerId) : null, // Convert to number or null
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success('Employee added successfully!');
        router.push('/employees');
      } else {
        const errorMsg = responseData.error || 'Failed to add employee';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }
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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            required
            
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
            min="0"
            step="0.01" // Allow decimals
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
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