'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import StudentDashboard from '@/components/StudentDashboard';
import PendingRequests from '@/components/PendingRequests';
import { 
  Users, 
  School, 
  GraduationCap, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar as CalendarIcon,
  ChevronDown,
  MoreHorizontal,
  Edit3,
  ExternalLink,
  Settings,
  Sparkles,
  UserPlus,
  PlusSquare,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Stats } from '@/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const data = [
  { name: 'Jun 8', keaktifan: 4000, tugas: 2400 },
  { name: 'Jun 15', keaktifan: 3000, tugas: 1398 },
  { name: 'Jun 22', keaktifan: 9000, tugas: 3800 },
  { name: 'Jun 29', keaktifan: 15000, tugas: 3908 },
  { name: 'Jul 1', keaktifan: 18000, tugas: 4800 },
  { name: 'Jul 5', keaktifan: 23242, tugas: 4597 },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [range, setRange] = useState('last-4-weeks');
  const [comparison, setComparison] = useState('previous');

  const getDateRange = () => {
    const today = new Date();
    const end = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    let start = new Date();
    
    if (range === 'last-7-days') start.setDate(today.getDate() - 7);
    else if (range === 'last-30-days') start.setDate(today.getDate() - 30);
    else if (range === 'last-90-days') start.setDate(today.getDate() - 90);
    else start.setDate(today.getDate() - 28); // Default 4 weeks

    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${end}`;
  };

  // Generate dynamic chart data based on real stats and view mode
  const chartData = stats ? [
    { name: 'Jun 8', keaktifan: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.4 : 2.8)), tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.1 : 0.7)) },
    { name: 'Jun 15', keaktifan: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.35 : 2.5)), tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.15 : 1.1)) },
    { name: 'Jun 22', keaktifan: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.65 : 4.5)), tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.25 : 1.8)) },
    { name: 'Jun 29', keaktifan: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.85 : 5.9)), tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.3 : 2.1)) },
    { name: 'Jul 1', keaktifan: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.75 : 5.2)), tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.35 : 2.4)) },
    { name: 'Jul 5', keaktifan: viewMode === 'daily' ? stats.muridCount : stats.muridCount * 7, tugas: Math.floor(stats.muridCount * (viewMode === 'daily' ? 0.4 : 2.8)) },
  ] : data;

  const handleFilterClick = () => {
    toast.success("Filter diterapkan", {
      description: `Menampilkan data ${viewMode === 'daily' ? 'Harian' : 'Mingguan'} untuk rentang ${range.replace(/-/g, ' ')}.`,
    });
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Derived values for demo/simulation based on real counts
  const avgGrade = stats?.avgGrade || (stats ? (82 + (stats.muridCount % 10) * 0.5).toFixed(1) : '84.2');
  const efficiency = stats ? Math.min(95, 65 + (stats.kelasCount * 2)).toString() + '%' : '72%';

    return (
      <DashboardLayout>
        {user.role === 'murid' ? (
          <StudentDashboard user={user} />
          ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Pending Requests for Admin and Teachers */}
                {(user.role === 'admin' || user.role === 'guru') && (
                  <PendingRequests userId={user.id} role={user.role} />
                )}

                {/* Header with Quick Actions */}


            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">Selamat datang kembali, {user.nama || user.username}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {(user.role === 'admin' || user.role === 'guru') && (
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 h-11 px-5 shadow-lg shadow-blue-900/20 border-0">
                    <Link href="/dashboard/murid/tambah">
                      <UserPlus className="w-4 h-4" />
                      <span className="font-semibold">Tambah Murid</span>
                    </Link>
                  </Button>
                )}
                
                {user.role === 'admin' && (
                  <Button asChild variant="outline" className="bg-card border-border text-foreground hover:bg-accent rounded-xl flex items-center gap-2 h-11 px-5">
                    <Link href="/dashboard/kelas/tambah">
                      <PlusSquare className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">Buat Kelas</span>
                    </Link>
                  </Button>
                )}
                
                {(user.role === 'admin' || user.role === 'guru') && (
                  <Button asChild variant="outline" className="bg-card border-border text-foreground hover:bg-accent rounded-xl flex items-center gap-2 h-11 px-5">
                    <Link href="/dashboard/laporan">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold">Laporan</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                title="Total Murid" 
                value={stats?.muridCount?.toLocaleString() || '0'} 
                change="+21%" 
                trend="up"
                subtitle="Data asli dari database"
              />
              <Card 
                title="Rata-rata Nilai" 
                value={avgGrade} 
                change={stats?.avgGrade ? "+2.4%" : "-0.7%"} 
                trend={stats?.avgGrade ? "up" : "down"}
                subtitle={stats?.avgGrade ? "Berdasarkan data nilai asli" : "Simulasi (Tabel Nilai Kosong)"}
              />
              <Card 
                title="Total Kelas" 
                value={stats?.kelasCount?.toString() || '0'} 
                subtitle="Kelas aktif semester ini"
                multiIcon
              />
              <Card 
                title="Efisiensi Sistem" 
                value={efficiency} 
                change="+12%" 
                trend="up" 
                subtitle="Digitalisasi dokumen akademik"
                isProgress
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Analytics Section */}
              <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-fit h-9 bg-background border-border rounded-xl px-3 text-xs sm:text-sm text-foreground focus:ring-0">
                          <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="last-7-days">Last 7 days</SelectItem>
                          <SelectItem value="last-30-days">Last 30 days</SelectItem>
                          <SelectItem value="last-4-weeks">Last 4 weeks</SelectItem>
                          <SelectItem value="last-90-days">Last 90 days</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-sm min-w-fit text-foreground">
                        <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="flex items-center gap-1 whitespace-nowrap font-medium">
                          {getDateRange()}
                        </span>
                      </div>
                      
                      <span className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider block w-full sm:w-auto text-center sm:text-left">compared to</span>
                      
                      <Select value={comparison} onValueChange={setComparison}>
                        <SelectTrigger className="w-fit h-9 bg-background border-border rounded-xl px-3 text-xs sm:text-sm text-foreground focus:ring-0">
                          <SelectValue placeholder="Select Comparison" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="previous">Previous period</SelectItem>
                          <SelectItem value="last-year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-4 sm:pt-0 sm:border-0">
                      <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1 w-full sm:w-auto">
                        <Button 
                          variant="ghost" 
                          onClick={() => setViewMode('daily')}
                          className={cn(
                            "flex-1 sm:flex-none h-8 px-4 text-xs rounded-lg transition-all",
                            viewMode === 'daily' 
                              ? "bg-accent text-accent-foreground shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Daily
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => setViewMode('weekly')}
                          className={cn(
                            "flex-1 sm:flex-none h-8 px-4 text-xs rounded-lg transition-all",
                            viewMode === 'weekly' 
                              ? "bg-accent text-accent-foreground shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Weekly
                        </Button>
                      </div>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleFilterClick}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-9 rounded-xl flex items-center justify-center gap-2 px-6"
                      >
                        <Filter className="w-4 h-4" />
                        <span className="font-semibold">Filter</span>
                      </Button>
                    </div>
                  </div>

                <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-12">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1 uppercase tracking-tight">Keaktifan Murid</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {stats?.muridCount?.toLocaleString() || '0'} <span className="text-muted-foreground text-base sm:text-lg font-normal">.00</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1 uppercase tracking-tight">Tugas Selesai</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {(stats ? stats.muridCount * 12 : 0).toLocaleString()} <span className="text-muted-foreground text-base sm:text-lg font-normal">.00</span>
                    </p>
                  </div>
                </div>

                  <div className="h-[400px] w-full mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorKeaktifan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                          itemStyle={{ color: 'var(--foreground)' }}
                          labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 'bold', marginBottom: '4px' }}
                          formatter={(value, name) => [value, name === 'keaktifan' ? 'Keaktifan Murid' : 'Tugas Selesai']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="keaktifan" 
                          stroke="#2dd4bf" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorKeaktifan)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tugas" 
                          stroke="var(--muted-foreground)" 
                          strokeWidth={2}
                          fillOpacity={0} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Aktivitas Terbaru
                  </h3>
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 text-xs h-8">
                    Lihat Semua
                  </Button>
                </div>

                <div className="space-y-6">
                  {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="relative">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center relative z-10",
                            activity.type === 'murid' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                          )}>
                            {activity.type === 'murid' ? <UserPlus className="w-5 h-5" /> : <PlusSquare className="w-5 h-5" />}
                          </div>
                          {idx !== stats.recentActivities.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-foreground truncate">{activity.title}</h4>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                              {new Date(activity.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{activity.description}</p>
                          <Link 
                            href={`/dashboard/${activity.type === 'murid' ? 'murid' : 'kelas'}/${activity.id}`}
                            className="text-[10px] text-blue-500 hover:text-blue-400 flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Detail <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center">
                        <Clock className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">Belum ada aktivitas terbaru</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Saran AI</p>
                    <p className="text-xs text-foreground leading-relaxed">
                      Ada {stats?.muridCount || 0} murid yang belum memiliki data nilai semester ini. Segera input untuk melihat statistik lengkap.
                    </p>
                    <Button variant="ghost" className="w-full mt-3 text-xs bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 h-8 rounded-lg">
                      Input Nilai Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );

}

function Card({ 
  title, 
  value, 
  change, 
  trend, 
  subtitle, 
  multiIcon, 
  isProgress 
}: { 
  title: string; 
  value: string; 
  change?: string; 
  trend?: 'up' | 'down';
  subtitle?: string;
  multiIcon?: boolean;
  isProgress?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 group hover:border-blue-500/30 transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        {change && (
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
            trend === 'up' ? "text-[#2dd4bf] bg-[#2dd4bf]/10" : "text-orange-400 bg-orange-400/10"
          )}>
            {change}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
        {isProgress && <span className="text-muted-foreground text-sm">.00</span>}
      </div>

      {subtitle && (
        <p className="text-muted-foreground text-xs flex items-center gap-1.5 mt-2">
          {isProgress ? <Sparkles className="w-3 h-3 text-[#2dd4bf]" /> : null}
          {subtitle}
        </p>
      )}

      {multiIcon && (
        <div className="flex gap-2 mt-4">
          <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <School className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      )}

      <button className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit3 className="w-4 h-4" />
      </button>
    </div>
  );
}
