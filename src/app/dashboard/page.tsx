'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, GraduationCap, UserCheck } from 'lucide-react';
import { Stats } from '@/types';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

    const isAdmin = user.role === 'admin';
    const isGuru = user.role === 'guru';
    const isMurid = user.role === 'murid';

    const statCards = [
      {
        title: 'Total Murid',
        value: stats?.muridCount || 0,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        hidden: isMurid,
      },
      {
        title: 'Total Kelas',
        value: stats?.kelasCount || 0,
        icon: School,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        hidden: isMurid,
      },
      {
        title: 'Total Guru',
        value: stats?.guruCount || 0,
        icon: GraduationCap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        hidden: isMurid,
      },
      {
        title: 'Total Pengguna',
        value: stats?.penggunaCount || 0,
        icon: UserCheck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        adminOnly: true,
        hidden: isMurid,
      },
    ];

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang, {user.nama}
            </p>
          </div>

          {loading && !isMurid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !isMurid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards
                .filter((card) => (!card.adminOnly || isAdmin) && !card.hidden)
                .map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card key={card.title}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${card.bgColor}`}>
                          <Icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{card.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Informasi {isMurid ? 'Profil' : 'Sistem'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Nama {isMurid ? 'Murid' : 'Pengguna'}</span>
                <span className="font-medium">{user.nama}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Hak Akses</span>
                <span className="font-medium">
                  {isAdmin ? 'Penuh (Admin)' : isGuru ? 'Baca (Guru)' : 'Siswa (Murid)'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
}
