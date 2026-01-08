'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { Murid, Kelas } from '@/types';
import Link from 'next/link';

export default function DetailMuridPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [murid, setMurid] = useState<Murid | null>(null);
  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchMurid();
  }, [params.id]);

  const fetchMurid = async () => {
    try {
      const response = await fetch(`/api/murid?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMurid(data);

        if (data.kelasId) {
          const kelasRes = await fetch(`/api/kelas?id=${data.kelasId}`);
          if (kelasRes.ok) {
            const kelasData = await kelasRes.json();
            setKelas(kelasData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch murid:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!murid) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Data murid tidak ditemukan</p>
          <Link href="/dashboard/murid">
            <Button className="mt-4">Kembali</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <Link href="/dashboard/murid">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detail Murid</h1>
              <p className="text-muted-foreground mt-1">
                Informasi lengkap data siswa
              </p>
            </div>
            {isAdmin && (
              <Link href={`/dashboard/murid/${murid.id}/edit`}>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">NISN</p>
                <p className="font-medium">{murid.nisn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{murid.nama}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                <p className="font-medium">{murid.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                <p className="font-medium">{murid.tanggalLahir || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{murid.alamat || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Kelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kelas</p>
                <p className="font-medium">{kelas?.namaKelas || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tahun Ajaran</p>
                <p className="font-medium">{kelas?.tahunAjaran || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Orang Tua</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Orang Tua</p>
                <p className="font-medium">{murid.namaOrangTua || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. Telp Orang Tua</p>
                <p className="font-medium">{murid.noTelpOrangTua || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
