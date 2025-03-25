'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null); // Ref to track sidebar element

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-900 text-gray-100 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-300 ease-in-out z-20 shadow-lg`}
      >
        {/* Close Button for Mobile */}
        {isOpen && (
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold focus:outline-none hover:text-gray-300 transition"
            >
              ✕
            </button>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-white">Employee MGA</h2>
        <nav className="space-y-2">
          <Link href="/" prefetch className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/employees" prefetch className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            All Employees
          </Link>
          <Link href="/managers" prefetch className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Managers
          </Link>
          <Link href="/add" prefetch className="block py-2.5 px-4 rounded hover:bg-gray-700 hover:text-white transition">
            Add Employee
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 bg-white shadow">
          <button onClick={() => setIsOpen(true)} className="text-gray-700 focus:outline-none">
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