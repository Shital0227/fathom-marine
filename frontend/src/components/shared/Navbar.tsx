'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useState } from 'react';

const pageNames: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/maintenance': 'Maintenance',
  '/drills': 'Safety Drills',
  '/compliance': 'Compliance',
  '/crew': 'Crew Management',
  '/': 'Dashboard',
};

export function Navbar() {
  const pathname = usePathname();
  const [notificationCount] = useState(3);

  const pageTitle = pageNames[pathname] || 'Dashboard';

  return (
    <header className="fixed top-0 right-0 left-60 h-16 bg-[#0a0f1e] border-b border-[#1e2d4a] flex items-center justify-between px-8 z-40">
      <h1 className="text-2xl font-bold text-[#f1f5f9]">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative text-[#94a3b8] hover:text-[#f1f5f9] transition-colors duration-200 p-2 rounded-lg hover:bg-[#1e2d4a]">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-[#f1f5f9] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
