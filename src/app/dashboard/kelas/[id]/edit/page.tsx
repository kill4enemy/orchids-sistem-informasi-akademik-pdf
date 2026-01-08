'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Kelas, Guru } from '@/types';
import Link from 'next/link';

export default function EditKelasPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    namaKelas: '',
    tahunAjaran: '',
    waliKelasId: '',
    jumlahSiswa: 0,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard/kelas');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [kelasRes, guruRes] = await Promise.all([
        fetch(`/api/kelas?id=${params.id}`),
        fetch('/api/guru?limit=100'),
      ]);

      if (kelasRes.ok) {
        const kelas: Kelas = await kelasRes.json();
        setFormData({
          namaKelas: kelas.namaKelas,
          tahunAjaran: kelas.tahunAjaran,
          waliKelasId: kelas.waliKelasId?.toString() || '',
          jumlahSiswa: kelas.jumlahSiswa,
        });
      }

      if (guruRes.ok) {
        const guru = await guruRes.json();
        setGuruList(guru);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        waliKelasId: formData.waliKelasId ? parseInt(formData.waliKelasId) : null,
      };

      const response = await fetch(`/api/kelas?id=${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/dashboard/kelas');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <Link href="/dashboard/kelas">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Kelas</h1>
          <p className="text-muted-foreground mt-1">
            Perbarui data kelas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaKelas">Nama Kelas *</Label>
                  <Input
                    id="namaKelas"
                    required
                    value={formData.namaKelas}
                    onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tahunAjaran">Tahun Ajaran *</Label>
                  <Input
                    id="tahunAjaran"
                    required
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waliKelasId">Wali Kelas</Label>
                <Select
                  value={formData.waliKelasId}
                  onValueChange={(value) => setFormData({ ...formData, waliKelasId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih wali kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tidak ada wali kelas</SelectItem>
                    {guruList.map((guru) => (
                      <SelectItem key={guru.id} value={guru.id.toString()}>
                        {guru.nama} - {guru.mataPelajaran}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlahSiswa">Jumlah Siswa</Label>
                <Input
                  id="jumlahSiswa"
                  type="number"
                  min="0"
                  value={formData.jumlahSiswa}
                  onChange={(e) => setFormData({ ...formData, jumlahSiswa: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Link href="/dashboard/kelas">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
