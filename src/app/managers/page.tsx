'use client';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Manager } from '../lib/type';

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data: Manager[]) => setManagers(data));
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Managers</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left  hidden sm:table-cell">Manager ID</th>
              <th className="p-3 text-left  hidden sm:table-cell">Email</th>
              <th className="p-3 text-left">Level</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-600">{manager.fullName}</td>
                <td className="p-3 text-gray-600  hidden sm:table-cell">{manager.managerId}</td>
                <td className="p-3 text-gray-600  hidden sm:table-cell">{manager.email}</td>
                <td className="p-3 text-gray-600">{manager.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}