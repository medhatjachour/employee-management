'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Employee, Manager } from './lib/type';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    active: 0,
    totalManagers: 0,
  });
  const [deptData, setDeptData] = useState<{
    labels: string[];
    totalByDept: number[];
    activeByDept: number[];
    inactiveByDept: number[];
  }>({ labels: [], totalByDept: [], activeByDept: [], inactiveByDept: [] });
  const [hireData, setHireData] = useState<{
    labels: string[];
    totalHires: number[];
    activeHires: number[];
    inactiveHires: number[];
  }>({ labels: [], totalHires: [], activeHires: [], inactiveHires: [] });
  const [timeView, setTimeView] = useState<'month' | 'year' | 'day'>('month');

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

      // Department stats (for bar chart)
      const deptStats = employees.reduce(
        (acc, emp) => {
          acc.total[emp.department] = (acc.total[emp.department] || 0) + 1;
          if (emp.status === 'ACTIVE') {
            acc.active[emp.department] = (acc.active[emp.department] || 0) + 1;
          } else {
            acc.inactive[emp.department] = (acc.inactive[emp.department] || 0) + 1;
          }
          return acc;
        },
        {
          total: {} as { [key: string]: number },
          active: {} as { [key: string]: number },
          inactive: {} as { [key: string]: number },
        }
      );
      const deptLabels = Object.keys(deptStats.total);
      const totalByDept = deptLabels.map((dept) => deptStats.total[dept] || 0);
      const activeByDept = deptLabels.map((dept) => deptStats.active[dept] || 0);
      const inactiveByDept = deptLabels.map((dept) => deptStats.inactive[dept] || 0);

      // Hiring stats (for line chart)
      const updateHireData = (view: 'month' | 'year' | 'day') => {
        const hiresByTime = employees.reduce(
          (acc, emp) => {
            const hireDate = new Date(emp.hireDate);
            let key: string;
            if (view === 'month') {
              key = hireDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            } else if (view === 'year') {
              key = hireDate.getFullYear().toString();
            } else {
              key = hireDate.toLocaleDateString();
            }
            acc.total[key] = (acc.total[key] || 0) + 1;
            if (emp.status === 'ACTIVE') {
              acc.active[key] = (acc.active[key] || 0) + 1;
            } else {
              acc.inactive[key] = (acc.inactive[key] || 0) + 1;
            }
            return acc;
          },
          {
            total: {} as { [key: string]: number },
            active: {} as { [key: string]: number },
            inactive: {} as { [key: string]: number },
          }
        );

        const timeKeys = Object.keys(hiresByTime.total).sort((a, b) => {
          if (view === 'year') return Number(a) - Number(b);
          return new Date(a) > new Date(b) ? 1 : -1;
        });
        const totalHires = timeKeys.map((key) => hiresByTime.total[key] || 0);
        const activeHires = timeKeys.map((key) => hiresByTime.active[key] || 0);
        const inactiveHires = timeKeys.map((key) => hiresByTime.inactive[key] || 0);

        setHireData({ labels: timeKeys, totalHires, activeHires, inactiveHires });
      };
      updateHireData(timeView);

      setStats({ totalEmployees, newHires, active, totalManagers });
      setDeptData({ labels: deptLabels, totalByDept, activeByDept, inactiveByDept });
    });
  }, [timeView]);

  // Bar chart data (departments)
  const barChartData = {
    labels: deptData.labels,
    datasets: [
      {
        label: 'Total Employees by Department',
        data: deptData.totalByDept,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Teal
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Active Employees by Department',
        data: deptData.activeByDept,
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Inactive Employees by Department',
        data: deptData.inactiveByDept,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart data (hires over time)
  const lineChartData = {
    labels: hireData.labels,
    datasets: [
      {
        label: 'Total Hires',
        data: hireData.totalHires,
        borderColor: 'rgba(75, 192, 192, 1)', // Teal
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Active Hires',
        data: hireData.activeHires,
        borderColor: 'rgba(54, 162, 235, 1)', // Blue
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Inactive Hires',
        data: hireData.inactiveHires,
        borderColor: 'rgba(255, 99, 132, 1)', // Red
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Employee Distribution by Department' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Employees' } },
      x: { title: { display: true, text: 'Department' } },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: `Hires Per ${timeView.charAt(0).toUpperCase() + timeView.slice(1)}`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Hires' } },
      x: { title: { display: true, text: timeView.charAt(0).toUpperCase() + timeView.slice(1) } },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart (Departments) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Line Chart (Hires Over Time) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-end mb-4">
            <select
              value={timeView}
              onChange={(e) => setTimeView(e.target.value as 'month' | 'year' | 'day')}
              className="border text-black border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="day">Per Day</option>
              <option value="month">Per Month</option>
              <option value="year">Per Year</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}