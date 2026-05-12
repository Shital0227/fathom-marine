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
          <span className="text-xl font-bold text-[#f1f5f9]">Fathom Marine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item: NavLink) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#3b82f6] text-[#f1f5f9]'
                  : 'text-[#94a3b8] hover:bg-[#1e2d4a]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
<div className="border-t border-[#1e2d4a] p-4 space-y-4">
  <div className="bg-[#0f1729] rounded-lg p-3">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-[#f1f5f9] font-bold">
        {initials || (isLoading ? '..' : '?')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#f1f5f9] truncate">
          {isLoading ? 'Loading...' : (user?.name || 'Guest')}
        </p>
        <span className="text-xs bg-[#3b82f6] text-[#f1f5f9] px-2 py-1 rounded inline-block capitalize">
          {isLoading ? '...' : (user?.role || 'crew')}
        </span>
      </div>
    </div>
  </div>

  <Button
    variant="outline"
    size="sm"
    onClick={handleLogout}
    className="w-full justify-start gap-2 text-[#94a3b8] border-[#1e2d4a] hover:bg-[#1e2d4a] hover:text-[#f1f5f9]"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Button>
</div>
    </aside>
  );
}
