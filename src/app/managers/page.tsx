'use client';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

type Manager = { id: number; fullName: string; managerId: string; email: string; level: string };

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data) => setManagers(data));
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Managers</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Manager ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((manager) => (
            <tr key={manager.id}>
              <td className="border p-2">{manager.fullName}</td>
              <td className="border p-2">{manager.managerId}</td>
              <td className="border p-2">{manager.email}</td>
              <td className="border p-2">{manager.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}