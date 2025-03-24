'use client'; // Required for client-side components in App Router
import { useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <h2 className="text-2xl font-semibold text-center">Employee Mgmt</h2>
        <nav>
          <Link href="/" className="block py-2.5 px-4 rounded hover:bg-blue-700">Dashboard</Link>
          <Link href="/employees" className="block py-2.5 px-4 rounded hover:bg-blue-700">All Employees</Link>
          <Link href="/managers" className="block py-2.5 px-4 rounded hover:bg-blue-700">Managers</Link>
          <Link href="/add" className="block py-2.5 px-4 rounded hover:bg-blue-700">Add Employee</Link>
        </nav>
      </div>
      <div className="flex-1 p-4">
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}