'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Kelas, Guru } from '@/types';
import Link from 'next/link';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Kelas</h1>
            <p className="text-muted-foreground mt-1">
              Kelola data kelas dan wali kelas
            </p>
          </div>
          <Link href="/dashboard/kelas/tambah">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kelas
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama kelas, tahun ajaran, atau wali kelas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : filteredKelas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data kelas ditemukan
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nama Kelas</th>
                      <th className="text-left py-3 px-4 font-medium">Tahun Ajaran</th>
                      <th className="text-left py-3 px-4 font-medium">Wali Kelas</th>
                      <th className="text-left py-3 px-4 font-medium">Jumlah Siswa</th>
                      <th className="text-right py-3 px-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKelas.map((kelas) => (
                      <tr key={kelas.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{kelas.namaKelas}</td>
                        <td className="py-3 px-4">{kelas.tahunAjaran}</td>
                        <td className="py-3 px-4">{getWaliKelasName(kelas.waliKelasId)}</td>
                        <td className="py-3 px-4">{kelas.jumlahSiswa}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/kelas/${kelas.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(kelas.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Kelas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data kelas ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
