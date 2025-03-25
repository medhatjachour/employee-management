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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Define types for API response
interface DeptData {
  labels: string[];
  totalByDept: number[];
  activeByDept: number[];
  inactiveByDept: number[];
}

interface HireData {
  labels: string[];
  totalHires: number[];
  activeHires: number[];
  inactiveHires: number[];
}

interface Stats {
  totalEmployees: number;
  newHires: number;
  active: number;
  totalManagers: number;
}

interface DashboardData {
  stats: Stats;
  deptData: DeptData;
  hireData: HireData;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: { totalEmployees: 0, newHires: 0, active: 0, totalManagers: 0 },
    deptData: { labels: [], totalByDept: [], activeByDept: [], inactiveByDept: [] },
    hireData: { labels: [], totalHires: [], activeHires: [], inactiveHires: [] },
  });
  const [timeView, setTimeView] = useState<'month' | 'year' | 'day'>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/dashboard?timeView=${timeView}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((data: DashboardData) => {
        setDashboardData(data);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      })
      .finally(() => setIsLoading(false));
  }, [timeView]);

  // Bar chart data
  const barChartData = {
    labels: dashboardData.deptData.labels,
    datasets: [
      {
        label: 'Total Employees by Department',
        data: dashboardData.deptData.totalByDept,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Teal
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Active Employees by Department',
        data: dashboardData.deptData.activeByDept,
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Inactive Employees by Department',
        data: dashboardData.deptData.inactiveByDept,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart data
  const lineChartData = {
    labels: dashboardData.hireData.labels,
    datasets: [
      {
        label: 'Total Hires',
        data: dashboardData.hireData.totalHires,
        borderColor: 'rgba(75, 192, 192, 1)', // Teal
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Active Hires',
        data: dashboardData.hireData.activeHires,
        borderColor: 'rgba(54, 162, 235, 1)', // Blue
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Inactive Hires',
        data: dashboardData.hireData.inactiveHires,
        borderColor: 'rgba(255, 99, 132, 1)', // Red
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

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

  if (isLoading) return <Layout><p className="text-gray-600">Loading...</p></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
          <p className="text-2xl font-bold text-indigo-600">{dashboardData.stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">New Hires This Month</h2>
          <p className="text-2xl font-bold text-green-600">{dashboardData.stats.newHires}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Active Employees</h2>
          <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Managers</h2>
          <p className="text-2xl font-bold text-purple-600">{dashboardData.stats.totalManagers}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-100">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
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
          <div className="h-100">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}