// app/managers/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout'; // Adjust path as needed
import { Manager } from '../lib/type';

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    managerId: string;
    email: string;
    level: 'JUNIOR' | 'SENIOR' | 'EXECUTIVE';
  }>({
    fullName: '',
    managerId: '',
    email: '',
    level: 'JUNIOR',
  });
  const [error, setError] = useState<string>('');

  // Fetch managers
  const fetchManagers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/managers');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch managers');
      }
      const data: Manager[] = await res.json();
      setManagers(data);
    } catch (error: unknown) {
      console.error('Error fetching managers:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to load managers');
      } else {
        setError('Failed to load managers');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create manager');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create manager');
      }
      setFormData({ fullName: '', managerId: '', email: '', level: 'JUNIOR' });
      setIsModalOpen(false);
    } 
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Managers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          + Add Manager
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 text-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Add New Manager</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullNameManger" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullNameManger"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="managerId">Manager ID</label>
                <input
                  type="text"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="e.g., MGR001"
                  required
                />
              </div>
              <div>
                <label htmlFor='emailManger' className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="emailManger"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="e.g., john.doe@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor='' className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <div className="flex space-x-4">
                  {['JUNIOR', 'SENIOR', 'EXECUTIVE'].map((level) => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={formData.level === level}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 capitalize">{level.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                >
                  Add Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Managers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold hidden sm:table-cell">Manager ID</th>
              <th className="p-4 text-left font-semibold hidden sm:table-cell">Email</th>
              <th className="p-4 text-left font-semibold">Level</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                );
              } else if (managers.length > 0) {
                return managers.map((manager) => (
                  <tr key={manager.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-4 text-gray-600">{manager.fullName}</td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{manager.managerId}</td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{manager.email}</td>
                    <td className="p-4 text-gray-600 capitalize">{manager.level.toLowerCase()}</td>
                  </tr>
                ));
              } else {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-600">
                      No data exists
                    </td>
                  </tr>
                );
              }
            })()}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}