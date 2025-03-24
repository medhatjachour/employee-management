'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-gray-100 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-300 ease-in-out z-20 shadow-lg`}
      >
        <h2 className="text-2xl font-bold text-center text-white">Employee Mgmt</h2>
        <nav className="space-y-2">
          <Link href="/" className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/employees" className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            All Employees
          </Link>
          <Link href="/managers" className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Managers
          </Link>
          <Link href="/add" className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Add Employee
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 bg-white shadow">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}