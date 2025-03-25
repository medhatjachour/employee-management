'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Employee, Manager } from '@/app/lib/types'; // Fixed import path
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    active: 0,
    totalManagers: 0,
  });
  const [deptData, setDeptData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/employees').then((res) => res.json()),
      fetch('/api/managers').then((res) => res.json()),
    ]).then(([employeeData, managerData]: [{ employees: Employee[] }, Manager[]]) => {
      const employees = employeeData.employees;
      const totalEmployees = employees.length;
      const newHires = employees.filter(
        (e) => new Date(e.hireDate).getMonth() === new Date().getMonth()
      ).length;
      const active = employees.filter((e) => e.status === 'ACTIVE').length;
      const totalManagers = managerData.length;

      // Calculate employees per department
      const deptCounts = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setStats({ totalEmployees, newHires, active, totalManagers });
      setDeptData(deptCounts);
    });
  }, []);

  // Chart data
  const chartData = {
    labels: Object.keys(deptData),
    datasets: [
      {
        label: 'Employees by Department',
        data: Object.values(deptData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fit container height
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Employees by Department' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Employees' },
      },
      x: {
        title: { display: true, text: 'Department' },
      },
    },
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">New Hires This Month</h2>
          <p className="text-2xl font-bold text-green-600">{stats.newHires}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Active Employees</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Managers</h2>
          <p className="text-2xl font-bold text-purple-600">{stats.totalManagers}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px] bg-white p-6 rounded-lg shadow-md">
        <div className="h-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </Layout>
  );
}