'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Employee } from './lib/type';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, newHires: 0, active: 0, totalManagers: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/employees').then((res) => res.json()),
      fetch('/api/managers').then((res) => res.json()),
    ]).then(([employeeData, managerData]) => {
      const totalEmployees = employeeData.employees.length;
      const newHires = employeeData.employees.filter((e: Employee) => new Date(e.hireDate).getMonth() === new Date().getMonth()).length;
      const active = employeeData.employees.filter((e: Employee) => e.status === 'Active').length;
      const totalManagers = managerData.length;
      setStats({ totalEmployees, newHires, active, totalManagers });
    });
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Total Employees</h2>
          <p className="text-2xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">New Hires This Month</h2>
          <p className="text-2xl font-bold">{stats.newHires}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Active Employees</h2>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Total Managers</h2>
          <p className="text-2xl font-bold">{stats.totalManagers}</p>
        </div>
      </div>
    </Layout>
  );
}