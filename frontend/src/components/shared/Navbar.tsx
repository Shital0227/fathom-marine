'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

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
  
    const { user, initials, isLoading } = useUser();

  const pageTitle = pageNames[pathname] || 'Dashboard';

  return (
    <header className="fixed top-0 right-0 left-60 h-16 bg-[#0a0f1e] border-b border-[#1e2d4a] flex items-center justify-between px-6 z-40">
      <h1 className="text-2xl font-bold text-[#f1f5f9]">{pageTitle}</h1>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-[#94a3b8] hover:text-[#f1f5f9] transition">
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-[#f1f5f9] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-[#f1f5f9] font-bold cursor-pointer hover:ring-2 hover:ring-[#1e3a8a] transition">
         {initials || (isLoading ? '..' : '?')}
        </div>
      </div>
    </header>
  );
}
