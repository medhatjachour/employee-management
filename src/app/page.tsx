'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Employee, Manager } from './lib/type';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, newHires: 0, active: 0, totalManagers: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/employees').then((res) => res.json()),
      fetch('/api/managers').then((res) => res.json()),
    ]).then(([employeeData, managerData]: [{ employees: Employee[] }, Manager[]]) => {
      const totalEmployees = employeeData.employees.length;
      const newHires = employeeData.employees.filter((e) => new Date(e.hireDate).getMonth() === new Date().getMonth()).length;
      const active = employeeData.employees.filter((e) => e.status === 'ACTIVE').length;
      const totalManagers = managerData.length;
      setStats({ totalEmployees, newHires, active, totalManagers });
    });
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">New Hires This Month</h2>
          <p className="text-2xl font-bold text-green-600">{stats.newHires}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Active Employees</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Total Managers</h2>
          <p className="text-2xl font-bold text-purple-600">{stats.totalManagers}</p>
        </div>
      </div>
    </Layout>
  );
}