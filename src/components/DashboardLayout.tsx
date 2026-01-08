'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  FileText, 
  LogOut,
  GraduationCap,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isGuru = user?.role === 'guru';
    const isMurid = user?.role === 'murid';

    const navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, access: ['admin', 'guru', 'murid'] },
      { href: '/dashboard/murid', label: 'Data Murid', icon: Users, access: ['admin', 'guru'] },
      { href: '/dashboard/kelas', label: 'Data Kelas', icon: School, access: ['admin'] },
      { href: '/dashboard/laporan', label: 'Laporan', icon: FileText, access: ['admin', 'guru'] },
    ];

    const filteredNavItems = navItems.filter(item => item.access.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="font-bold text-lg">Sistem Informasi Akademik</h1>
              <p className="text-xs text-muted-foreground">SMA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.nama}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] fixed lg:static transition-transform z-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="p-4 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
