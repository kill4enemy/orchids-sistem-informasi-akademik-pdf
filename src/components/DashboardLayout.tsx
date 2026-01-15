'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  FileText, 
  LogOut,
  GraduationCap,
  Search,
  Bell,
  Settings,
  Sun,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilModal } from './ProfilModal';
import { NotificationsSheet } from './NotificationsSheet';

import { ModeToggle } from './ModeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Insights', icon: Sparkles, access: ['admin', 'guru', 'murid'] },
    { href: '/dashboard/murid', label: 'Murid', icon: Users, access: ['admin', 'guru'] },
    { href: '/dashboard/kelas', label: 'Kelas', icon: School, access: ['admin'] },
    { href: '/dashboard/laporan', label: 'Laporan', icon: FileText, access: ['admin', 'guru'] },
  ];

  const filteredNavItems = navItems.filter(item => item.access.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r border-border flex flex-col transition-all duration-300 z-50",
        sidebarCollapsed ? "w-20" : "w-64",
        "fixed inset-y-0 left-0 lg:static transform",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl tracking-tight">SIAKAD</span>}
          </Link>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "group-hover:text-foreground")} />
                {!sidebarCollapsed && <span className="font-medium text-[15px]">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
                pathname === '/dashboard/settings' 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Settings className={cn("w-5 h-5", pathname === '/dashboard/settings' ? "text-blue-500" : "group-hover:text-foreground")} />
              {!sidebarCollapsed && <span className="font-medium text-[15px]">Settings</span>}
            </Link>
            
            <button
              onClick={() => {
                setIsProfilOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all group"
            >
              <User className="w-5 h-5 group-hover:text-foreground" />
              {!sidebarCollapsed && <span className="font-medium text-[15px]">Profil</span>}
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:text-destructive" />
              {!sidebarCollapsed && <span className="font-medium text-[15px]">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setMobileMenuOpen(true)}
              >
                <PanelLeftOpen className="w-5 h-5" />
              </Button>
              
                <div className="hidden sm:flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => router.back()}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => router.forward()}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground hover:bg-accent text-sm hidden sm:flex items-center gap-2"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </Button>
            </div>

            <div className="flex items-center gap-6 flex-1 max-w-2xl justify-end">
              <div className="relative w-full max-w-sm hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search anything..." 
                  className="bg-secondary border-border pl-10 h-9 text-sm focus-visible:ring-1 focus-visible:ring-ring w-full"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-accent px-1.5 py-0.5 rounded border border-border">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <NotificationsSheet>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Bell className="w-5 h-5" />
                  </Button>
                </NotificationsSheet>
                
                <ModeToggle />

                <div 
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 border border-border cursor-pointer hover:opacity-80 transition-opacity" 
                  title={user?.nama}
                  onClick={() => setIsProfilOpen(true)}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {user?.foto ? (
                      <img src={user.foto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama}`} alt="avatar" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
              {children}
            </main>

        </div>

        <ProfilModal isOpen={isProfilOpen} onClose={() => setIsProfilOpen(false)} />

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--accent);
          }
        `}</style>
      </div>
  );
}
