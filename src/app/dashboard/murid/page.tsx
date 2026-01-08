'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Murid, Kelas } from '@/types';
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

export default function MuridPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [muridList, setMuridList] = useState<Murid[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [muridRes, kelasRes] = await Promise.all([
        fetch('/api/murid?limit=100'),
        fetch('/api/kelas?limit=100'),
      ]);
      
      if (muridRes.ok) {
        const muridData = await muridRes.json();
        setMuridList(muridData);
      }
      
      if (kelasRes.ok) {
        const kelasData = await kelasRes.json();
        setKelasList(kelasData);
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
      const response = await fetch(`/api/murid?id=${deleteId}`, {
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

  const getKelasName = (kelasId: number | null) => {
    if (!kelasId) return '-';
    const kelas = kelasList.find((k) => k.id === kelasId);
    return kelas ? kelas.namaKelas : '-';
  };

  const filteredMurid = muridList.filter(
    (m) =>
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.nisn.includes(search) ||
      getKelasName(m.kelasId).toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Data Murid</h1>
            <p className="text-muted-foreground mt-1">
              Kelola data siswa sekolah
            </p>
          </div>
          {isAdmin && (
            <Link href="/dashboard/murid/tambah">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Murid
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, NISN, atau kelas..."
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
            ) : filteredMurid.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data murid ditemukan
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">NISN</th>
                      <th className="text-left py-3 px-4 font-medium">Nama</th>
                      <th className="text-left py-3 px-4 font-medium">L/P</th>
                      <th className="text-left py-3 px-4 font-medium">Kelas</th>
                      <th className="text-left py-3 px-4 font-medium">Orang Tua</th>
                      <th className="text-right py-3 px-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMurid.map((murid) => (
                      <tr key={murid.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{murid.nisn}</td>
                        <td className="py-3 px-4 font-medium">{murid.nama}</td>
                        <td className="py-3 px-4">{murid.jenisKelamin}</td>
                        <td className="py-3 px-4">{getKelasName(murid.kelasId)}</td>
                        <td className="py-3 px-4">{murid.namaOrangTua || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/murid/${murid.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {isAdmin && (
                              <>
                                <Link href={`/dashboard/murid/${murid.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(murid.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
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
            <AlertDialogTitle>Hapus Data Murid</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data murid ini? Tindakan ini tidak dapat dibatalkan.
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
