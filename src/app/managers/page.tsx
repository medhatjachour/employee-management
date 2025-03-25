'use client';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Manager } from '../lib/type';

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetch starts
    fetch('/api/managers')
      .then((res) => res.json())
      .then((data: Manager[]) => {
        setManagers(data);
        setIsLoading(false); // Set loading to false when data is received
      })
      .catch((error) => {
        console.error('Error fetching managers:', error);
        setIsLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Managers</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left hidden sm:table-cell">Manager ID</th>
              <th className="p-3 text-left hidden sm:table-cell">Email</th>
              <th className="p-3 text-left">Level</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                );
              } else if (managers.length > 0) {
                return managers.map((manager) => (
                  <tr key={manager.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-600">{manager.fullName}</td>
                    <td className="p-3 text-gray-600 hidden sm:table-cell">{manager.managerId}</td>
                    <td className="p-3 text-gray-600 hidden sm:table-cell">{manager.email}</td>
                    <td className="p-3 text-gray-600">{manager.level}</td>
                  </tr>
                ));
              } else {
                return (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-600">
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