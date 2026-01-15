'use client';

import { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
    BookOpen,
    Award,
    Bell,
    Sparkles
  } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NotificationsSheet } from './NotificationsSheet';

  import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentProfile {
    id: number;
    nama: string;
    nisn: string;
    kelasId: number | null;
    namaKelas: string | null;
    waliKelas: string | null;
    waliKelasFoto: string | null;
  }

  interface ClassOption {
    id: number;
    namaKelas: string;
    tahunAjaran: string;
  }

  interface RequestStatus {
    id: number;
    status: string;
    namaKelas: string;
    createdAt: string;
  }
  
  interface StudentDashboardProps {
    user: any;
  }
  
  export default function StudentDashboard({ user }: StudentDashboardProps) {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [myRequests, setMyRequests] = useState<RequestStatus[]>([]);
    const [selectedKelasId, setSelectedKelasId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
          try {
            const profileRes = await fetch(`/api/murid/me?penggunaId=${user.id}`);
            if (profileRes.ok) {
              const data = await profileRes.json();
              setProfile(data);

              if (!data.kelasId) {
                // Fetch available classes
                const classesRes = await fetch('/api/kelas');
                if (classesRes.ok) {
                  const classesData = await classesRes.json();
                  setClasses(classesData);
                }

                // Fetch student's requests
                const requestsRes = await fetch(`/api/permintaan-kelas?muridId=${data.id}`);
                if (requestsRes.ok) {
                  const requestsData = await requestsRes.json();
                  setMyRequests(requestsData);
                }
              }
            }
          } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [user.id]);

    const handleJoinClass = async () => {
      if (!selectedKelasId || !profile) return;
      
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/permintaan-kelas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            muridId: profile.id,
            kelasId: parseInt(selectedKelasId),
          }),
        });

        if (response.ok) {
          toast.success("Permintaan terkirim", {
            description: "Wali kelas akan meninjau permintaan Anda.",
          });
          // Refresh requests
          const requestsRes = await fetch(`/api/permintaan-kelas?muridId=${profile.id}`);
          if (requestsRes.ok) {
            const requestsData = await requestsRes.json();
            setMyRequests(requestsData);
          }
        } else {
          const error = await response.json();
          toast.error(error.error || "Gagal mengirim permintaan");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan");
      } finally {
        setIsSubmitting(false);
      }
    };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Mock data for student dashboard
  const stats = [
    { title: 'Rata-rata Nilai', value: '85.4', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+2.1%' },
    { title: 'Presensi', value: '98%', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'Sangat Baik' },
    { title: 'Tugas Aktif', value: '3', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: 'Deadline Dekat' },
    { title: 'Poin Kebaikan', value: '120', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'Peringkat 5' },
  ];

  const schedule = [
    { time: '07:30 - 09:00', subject: 'Matematika', room: 'Ruang 102', teacher: 'Budi Santoso' },
    { time: '09:00 - 10:30', subject: 'Bahasa Inggris', room: 'Ruang 105', teacher: 'Siti Aminah' },
    { time: '11:00 - 12:30', subject: 'Fisika', room: 'Lab Fisika', teacher: 'Agus Salim' },
  ];

  const recentGrades = [
    { subject: 'Matematika', score: 90, type: 'Tugas 2', date: '2 hari yang lalu' },
    { subject: 'Bahasa Indonesia', score: 85, type: 'UTS', date: '5 hari yang lalu' },
    { subject: 'Biologi', score: 78, type: 'Tugas 1', date: '1 minggu yang lalu' },
  ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                SIAKAD Student Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Halo, {profile?.nama || user.nama || user.username}! 👋
              </h1>
              <p className="text-blue-200/70 text-base sm:text-lg">
                Semangat belajarnya hari ini. Kamu punya {schedule.length} kelas terjadwal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-blue-900/40 w-full sm:w-auto">
                <Link href="/dashboard/jadwal">
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Jadwal
                </Link>
              </Button>
              <NotificationsSheet>
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 px-6 w-full sm:w-auto">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifikasi
                </Button>
              </NotificationsSheet>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-5 group hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                  {stat.trend}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Col */}
          <div className="lg:col-span-2 space-y-8">
            {/* Jadwal Pelajaran */}
            <Card className="bg-card border-border rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg text-foreground">Jadwal Hari Ini</CardTitle>
                </div>
                  <Button asChild variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 text-xs">
                    <Link href="/dashboard/jadwal">
                      Selengkapnya
                    </Link>
                  </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {schedule.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between group hover:bg-accent/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[100px]">
                          <p className="text-xs text-muted-foreground font-medium">{item.time.split(' - ')[0]}</p>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-tighter">Mulai</p>
                        </div>
                        <div className="h-10 w-px bg-border" />
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">{item.subject}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <User className="w-3 h-3" /> {item.teacher} • {item.room}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nilai Terbaru */}
            <Card className="bg-card border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-lg text-foreground">Nilai Terbaru</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {recentGrades.map((grade, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{grade.subject}</p>
                          <p className="text-xs text-muted-foreground">{grade.type} • {grade.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-lg font-bold",
                            grade.score >= 80 ? "text-emerald-500" : grade.score >= 70 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {grade.score}
                          </span>
                          <span className="text-xs text-muted-foreground/60 ml-1">/100</span>
                        </div>
                      </div>
                      <Progress value={grade.score} className="h-1.5 bg-secondary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Col */}
          <div className="space-y-8">
            {/* Informasi Kelas */}
            <Card className={cn(
              "bg-card border-border rounded-2xl overflow-hidden transition-all duration-500",
              !profile?.namaKelas && "border-dashed border-orange-500/30"
            )}>
              <div className={cn(
                "h-20 relative transition-all duration-500",
                profile?.namaKelas 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                  : "bg-gradient-to-r from-orange-600/20 to-amber-600/20"
              )}>
                {!profile?.namaKelas && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-8 left-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl border-4 border-card shadow-xl flex items-center justify-center transition-all duration-500",
                    profile?.namaKelas ? "bg-card" : "bg-secondary"
                  )}>
                    {profile?.namaKelas ? (
                      <BookOpen className="w-8 h-8 text-blue-500" />
                    ) : (
                      <div className="relative">
                        <BookOpen className="w-8 h-8 text-orange-500/40" />
                        <AlertCircle className="w-4 h-4 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-12 pb-6 px-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "text-xl font-bold tracking-tight transition-colors",
                        profile?.namaKelas ? "text-foreground" : "text-orange-500/80"
                      )}>
                        {profile?.namaKelas || 'Menunggu Kelas'}
                      </h3>
                      {!profile?.namaKelas && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-500 uppercase tracking-tighter animate-pulse">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Tahun Ajaran 2024/2025</p>
                  </div>
                  
                    {profile?.namaKelas ? (
                      <>
                        <div className="pt-2 space-y-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Wali Kelas</p>
                          <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border hover:border-blue-500/30 transition-colors cursor-default">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{profile?.waliKelas || 'Belum Ditentukan'}</p>
                              <p className="text-[10px] text-muted-foreground">Dosen Pembimbing Akademik</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 grid grid-cols-2 gap-2">
                          <div className="bg-secondary/30 p-3 rounded-xl border border-border text-center hover:bg-accent/5 transition-colors">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">NISN</p>
                            <p className="text-sm font-semibold text-foreground mt-1">{profile?.nisn || '-'}</p>
                          </div>
                          <div className="bg-secondary/30 p-3 rounded-xl border border-border text-center hover:bg-accent/5 transition-colors">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Status</p>
                            <p className="text-sm font-semibold text-emerald-500 mt-1 flex items-center justify-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Aktif
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-2 space-y-4">
                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-4">
                          <p className="text-xs text-orange-500/70 leading-relaxed">
                            Kamu belum terdaftar di kelas manapun. Silakan pilih kelas untuk bergabung.
                          </p>
                          
                          <div className="space-y-3">
                            <Select value={selectedKelasId} onValueChange={setSelectedKelasId}>
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Pilih Kelas" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border text-foreground">
                                {classes.map((k) => (
                                  <SelectItem key={k.id} value={k.id.toString()}>
                                    {k.namaKelas} ({k.tahunAjaran})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button 
                              onClick={handleJoinClass} 
                              disabled={!selectedKelasId || isSubmitting}
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-10 rounded-xl transition-all"
                            >
                              {isSubmitting ? "Mengirim..." : "Ajukan Masuk Kelas"}
                            </Button>
                          </div>
                        </div>

                        {myRequests.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Riwayat Permintaan</p>
                            <div className="space-y-2">
                              {myRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between bg-secondary/30 p-3 rounded-xl border border-border">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{req.namaKelas}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {new Date(req.createdAt).toLocaleDateString('id-ID')}
                                    </p>
                                  </div>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                                    req.status === 'pending' ? "bg-orange-500/10 text-orange-500" :
                                    req.status === 'disetujui' ? "bg-emerald-500/10 text-emerald-500" :
                                    "bg-red-500/10 text-red-500"
                                  )}>
                                    {req.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                </div>
              </CardContent>
            </Card>

            {/* Pengumuman Terkini */}
            <Card className="bg-card border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Pengumuman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-orange-500 uppercase">Ujian Akhir Semester</p>
                  <p className="text-sm text-muted-foreground">UAS akan dilaksanakan mulai tanggal 15 Juli 2025. Harap persiapkan diri.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">Diterbitkan: 12 Jun 2025</p>
                </div>
                <div className="p-3 bg-secondary/30 border border-border rounded-xl space-y-1">
                  <p className="text-xs font-bold text-blue-500 uppercase">Libur Nasional</p>
                  <p className="text-sm text-muted-foreground">Kegiatan belajar mengajar ditiadakan pada tanggal 1 Juni (Hari Lahir Pancasila).</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">Diterbitkan: 28 Mei 2025</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}

