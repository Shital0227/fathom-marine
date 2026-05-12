'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Shield,
  BarChart3,
  Users,
  Anchor,
  LogOut,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuth } from '@/lib/auth';
import { useUser } from '@/contexts/userContext';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Maintenance', icon: Wrench, href: '/maintenance' },
  { label: 'Safety Drills', icon: Shield, href: '/drills' },
  { label: 'Compliance', icon: BarChart3, href: '/compliance' },
  { label: 'Crew', icon: Users, href: '/crew' },
];

interface NavLink {
  label: string;
  icon: LucideIcon;
  href: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initials, isLoading } = useUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-e2e8f0 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-e2e8f0">
        <div className="flex items-center gap-3">
          <Anchor className="w-8 h-8 text-[#3b82f6]" />
          <span className="text-lg font-bold text-[#1e293b]">Fathom Marine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-2">
        {navItems.map((item: NavLink) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/20'
                  : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
<div className="border-t border-e2e8f0 p-6 space-y-4">
  <div className="bg-[#f8fafc] rounded-lg p-6 border border-e2e8f0">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white font-bold text-sm">
        {initials || (isLoading ? '..' : '?')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">User</p>
        <p className="text-sm font-medium text-[#1e293b] truncate mt-0.5">
          {isLoading ? 'Loading...' : (user?.name || 'Guest')}
        </p>
      </div>
    </div>
    <span className="text-xs bg-blue-100 text-[#3b82f6] px-2.5 py-1 rounded-md font-medium capitalize inline-block">
      {isLoading ? '...' : (user?.role || 'crew')}
    </span>
  </div>

  <Button
    onClick={handleLogout}
    className="w-full justify-start gap-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-medium h-10 transition-colors duration-200"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Button>
</div>
    </aside>
  );
}
