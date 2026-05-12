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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0f1729] border-r border-[#1e2d4a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1e2d4a]">
        <div className="flex items-center gap-2">
          <Anchor className="w-8 h-8 text-[#3b82f6]" />
          <span className="text-lg font-bold text-[#f1f5f9]">Fathom Marine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {navItems.map((item: NavLink) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#3b82f6] text-[#f1f5f9] shadow-lg shadow-[#3b82f6]/20'
                  : 'text-[#94a3b8] hover:bg-[#1e2d4a] hover:text-[#f1f5f9]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
<div className="border-t border-[#1e2d4a] p-4 space-y-4">
  <div className="bg-[#0a0f1e] rounded-lg p-4 border border-[#1e2d4a]">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-[#3b82f6] flex items-center justify-center text-[#f1f5f9] font-bold text-sm">
        {initials || (isLoading ? '..' : '?')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">User</p>
        <p className="text-sm font-medium text-[#f1f5f9] truncate mt-0.5">
          {isLoading ? 'Loading...' : (user?.name || 'Guest')}
        </p>
      </div>
    </div>
    <span className="text-xs bg-[#3b82f6]/20 text-[#3b82f6] px-2.5 py-1 rounded-md font-medium capitalize inline-block">
      {isLoading ? '...' : (user?.role || 'crew')}
    </span>
  </div>

  <Button
    onClick={handleLogout}
    className="w-full justify-start gap-2 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 border border-[#ef4444]/20 font-medium h-9 transition-colors duration-200"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Button>
</div>
    </aside>
  );
}
