'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Filter,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const scheduleData = {
  'Senin': [
    { time: '07:30 - 09:00', subject: 'Matematika', room: 'Ruang 102', teacher: 'Budi Santoso', type: 'Teori' },
    { time: '09:00 - 10:30', subject: 'Bahasa Inggris', room: 'Ruang 105', teacher: 'Siti Aminah', type: 'Praktikum' },
    { time: '11:00 - 12:30', subject: 'Fisika', room: 'Lab Fisika', teacher: 'Agus Salim', type: 'Teori' },
  ],
  'Selasa': [
    { time: '07:30 - 09:00', subject: 'Bahasa Indonesia', room: 'Ruang 101', teacher: 'Dewi Lestari', type: 'Teori' },
    { time: '09:00 - 10:30', subject: 'Biologi', room: 'Lab Biologi', teacher: 'Indra Herlambang', type: 'Praktikum' },
  ],
  'Rabu': [
    { time: '08:00 - 10:00', subject: 'Kimia', room: 'Lab Kimia', teacher: 'Retno Wulandari', type: 'Praktikum' },
    { time: '10:30 - 12:00', subject: 'Sejarah', room: 'Ruang 202', teacher: 'Haryanto', type: 'Teori' },
  ],
  'Kamis': [
    { time: '07:30 - 09:30', subject: 'Pendidikan Jasmani', room: 'Lapangan Olahraga', teacher: 'Dedi Kurniawan', type: 'Praktik' },
    { time: '10:00 - 12:00', subject: 'Seni Budaya', room: 'Ruang Seni', teacher: 'Maya Sofia', type: 'Teori' },
  ],
  'Jumat': [
    { time: '07:30 - 09:00', subject: 'Agama', room: 'Masjid Sekolah', teacher: 'Ustadz Ahmad', type: 'Teori' },
    { time: '09:30 - 11:00', subject: 'PPKN', room: 'Ruang 104', teacher: 'Suryo', type: 'Teori' },
  ],
  'Sabtu': [
    { time: '08:00 - 10:00', subject: 'Ekstrakurikuler', room: 'Aula Utama', teacher: 'Berbagai Pelatih', type: 'Praktik' },
  ],
};

const dummyMateri = [
  { title: 'Pendahuluan dan Silabus', date: '4 Sep 2023', type: 'PDF', size: '1.2 MB' },
  { title: 'Materi Bab 1: Konsep Dasar', date: '11 Sep 2023', type: 'PPTX', size: '4.5 MB' },
  { title: 'Latihan Soal Mandiri', date: '18 Sep 2023', type: 'DOCX', size: '850 KB' },
  { title: 'Video Pembelajaran Pertemuan 3', date: '25 Sep 2023', type: 'Link', size: '-' },
];

const dummyAbsensi = [
  { name: 'Ahmad Fauzi', status: 'Hadir', time: '07:25' },
  { name: 'Bunga Citra', status: 'Hadir', time: '07:28' },
  { name: 'Candra Wijaya', status: 'Sakit', time: '-' },
  { name: 'Dini Aminarti', status: 'Izin', time: '-' },
  { name: 'Eka Saputra', status: 'Hadir', time: '07:30' },
  { name: 'Fajar Siddiq', status: 'Alpa', time: '-' },
];

export default function JadwalPage() {
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [isMateriOpen, setIsMateriOpen] = useState(false);
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const handleDownload = () => {
    toast.success("Mendownload jadwal...", {
      description: "Jadwal sedang diproses dalam format PDF."
    });
  };

  const openMateri = (subject: string) => {
    setActiveSubject(subject);
    setIsMateriOpen(true);
  };

  const openAbsensi = (subject: string) => {
    setActiveSubject(subject);
    setIsAbsensiOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Jadwal Pelajaran</h1>
            <p className="text-muted-foreground mt-1">Lihat dan kelola jadwal akademik mingguan Anda.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-card border-border text-foreground hover:bg-accent rounded-xl flex items-center gap-2 h-11 px-5"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {days.map((day) => (
            <Button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "rounded-2xl px-8 h-12 font-semibold transition-all whitespace-nowrap",
                selectedDay === day 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {day}
            </Button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border py-6 px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Jadwal Hari {selectedDay}</CardTitle>
                    <p className="text-sm text-muted-foreground">Total {scheduleData[selectedDay as keyof typeof scheduleData]?.length || 0} mata pelajaran</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Cari matpel..." 
                      className="bg-transparent border-0 focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground w-32"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {scheduleData[selectedDay as keyof typeof scheduleData]?.length > 0 ? (
                    scheduleData[selectedDay as keyof typeof scheduleData].map((item, idx) => (
                      <div key={idx} className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group hover:bg-accent/30 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                          <div className="flex flex-row sm:flex-col items-center justify-center min-w-full sm:min-w-[120px] bg-background rounded-2xl p-3 sm:p-4 border border-border group-hover:border-blue-500/30 transition-colors gap-3 sm:gap-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 sm:mb-2" />
                            <span className="text-xs sm:text-sm font-bold text-foreground">{item.time}</span>
                          </div>
                          
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors">{item.subject}</h3>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                item.type === 'Teori' ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                              )}>
                                {item.type}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                                <User className="w-3.5 h-3.5 text-blue-500/70" />
                                <span>{item.teacher}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                                <MapPin className="w-3.5 h-3.5 text-red-500/70" />
                                <span>{item.room}</span>
                              </div>
                            </div>
                          </div>
                        </div>
  
                        <div className="flex items-center gap-3 self-end md:self-center mt-2 md:mt-0">
                          <Button 
                            variant="ghost" 
                            className="bg-background border border-border text-muted-foreground hover:text-foreground rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                            onClick={() => openMateri(item.subject)}
                          >
                            Materi
                          </Button>
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm font-semibold shadow-lg shadow-blue-900/20"
                            onClick={() => openAbsensi(item.subject)}
                          >
                            Absensi
                          </Button>
                        </div>
                      </div>
                    ))

                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Tidak Ada Jadwal</h3>
                      <p className="text-muted-foreground">Nikmati waktu istirahat Anda hari ini.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips / Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-foreground font-bold">Informasi Akademik</h4>
            <p className="text-muted-foreground text-sm">Jadwal ini dapat berubah sewaktu-waktu sesuai kebijakan sekolah. Pastikan Anda selalu mengecek notifikasi terbaru.</p>
          </div>
          <Button variant="ghost" className="md:ml-auto text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
            Hubungi Admin
          </Button>
        </div>
      </div>

      {/* Materi Dialog */}
      <Dialog open={isMateriOpen} onOpenChange={setIsMateriOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Materi: {activeSubject}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Daftar bahan ajar dan modul yang tersedia untuk mata pelajaran ini.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {dummyMateri.map((materi, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">{materi.title}</h4>
                    <p className="text-xs text-muted-foreground">{materi.date} • {materi.type} • {materi.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Download className="w-4 h-4 mr-2" />
                  Unduh
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Absensi Dialog */}
      <Dialog open={isAbsensiOpen} onOpenChange={setIsAbsensiOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Presensi Kelas: {activeSubject}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Daftar kehadiran siswa untuk sesi hari ini ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}).
            </DialogDescription>
          </DialogHeader>
          
            <div className="mt-6 border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Nama Siswa</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Jam Masuk</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dummyAbsensi.map((siswa, i) => (
                      <tr key={i} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{siswa.name}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            siswa.status === 'Hadir' ? "bg-emerald-500/10 text-emerald-500" :
                            siswa.status === 'Sakit' ? "bg-amber-500/10 text-amber-500" :
                            siswa.status === 'Izin' ? "bg-blue-500/10 text-blue-500" :
                            "bg-red-500/10 text-red-500"
                          )}>
                            {siswa.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                          {siswa.time !== '-' ? (
                            <div className="flex items-center gap-1.5">
                              <Clock3 className="w-3 h-3" />
                              {siswa.time}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                            Ubah
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          
          <div className="flex justify-between items-center mt-6">
            <div className="text-xs text-muted-foreground italic">
              * Terakhir diperbarui 5 menit yang lalu
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent border-border text-muted-foreground hover:text-foreground" onClick={() => setIsAbsensiOpen(false)}>
                Tutup
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Submit Presensi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
