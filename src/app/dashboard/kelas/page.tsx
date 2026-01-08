'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  School,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Users
} from 'lucide-react';
import { Kelas, Guru } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function KelasPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kelasRes, guruRes] = await Promise.all([
        fetch('/api/kelas?limit=100'),
        fetch('/api/guru?limit=100'),
      ]);
      
      if (kelasRes.ok) {
        const kelasData = await kelasRes.json();
        setKelasList(kelasData);
      }
      
      if (guruRes.ok) {
        const guruData = await guruRes.json();
        setGuruList(guruData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/kelas?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getWaliKelasName = (waliKelasId: number | null) => {
    if (!waliKelasId) return '-';
    const guru = guruList.find((g) => g.id === waliKelasId);
    return guru ? guru.nama : '-';
  };

  const filteredKelas = kelasList.filter(
    (k) =>
      k.namaKelas.toLowerCase().includes(search.toLowerCase()) ||
      k.tahunAjaran.includes(search) ||
      getWaliKelasName(k.waliKelasId).toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Data Kelas</h1>
            <p className="text-gray-500 mt-1">
              Manajemen ruang kelas dan penugasan wali kelas.
            </p>
          </div>
          <Link href="/dashboard/kelas/tambah">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kelas
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#141415] border border-[#1a1a1b] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Cari kelas, tahun ajaran, atau wali kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0a0a0b] border-[#1a1a1b] pl-10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-[#0a0a0b] border-[#1a1a1b] text-gray-400 hover:text-white hover:bg-[#1a1a1b]">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="bg-[#0a0a0b] border-[#1a1a1b] text-gray-400 hover:text-white hover:bg-[#1a1a1b]">
              <ChevronDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-[#141415] border border-[#1a1a1b] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              <p className="text-gray-500 text-sm">Memuat data kelas...</p>
            </div>
          ) : filteredKelas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="w-12 h-12 rounded-full bg-[#0a0a0b] border border-[#1a1a1b] flex items-center justify-center mb-2">
                <School className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-white font-medium">Tidak ada data kelas ditemukan</p>
              <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a1b] bg-[#0a0a0b]/50">
                    <th className="py-4 px-6 font-medium text-gray-400 text-sm">Informasi Kelas</th>
                    <th className="py-4 px-6 font-medium text-gray-400 text-sm">Wali Kelas</th>
                    <th className="py-4 px-6 font-medium text-gray-400 text-sm">Tahun Ajaran</th>
                    <th className="py-4 px-6 font-medium text-gray-400 text-sm">Kapasitas</th>
                    <th className="py-4 px-6 font-medium text-gray-400 text-sm text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1b]">
                  {filteredKelas.map((kelas) => (
                    <tr key={kelas.id} className="group hover:bg-[#1a1a1b]/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-600/10 border border-teal-600/20 flex items-center justify-center">
                            <School className="w-5 h-5 text-teal-500" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{kelas.namaKelas}</p>
                            <p className="text-gray-500 text-xs">ID: #{kelas.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-300 text-sm">{getWaliKelasName(kelas.waliKelasId)}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a1a1b] text-gray-400 border border-[#2a2a2b]">
                          {kelas.tahunAjaran}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300 text-sm">{kelas.jumlahSiswa} Siswa</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/kelas/${kelas.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a2a2b]">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(kelas.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a2a2b]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#141415] border-[#1a1a1b] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Kelas</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Apakah Anda yakin ingin menghapus data kelas ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#1a1a1b] text-white hover:bg-[#1a1a1b] hover:text-white">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Hapus Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
