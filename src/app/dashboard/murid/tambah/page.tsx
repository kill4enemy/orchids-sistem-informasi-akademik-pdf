'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Kelas } from '@/types';
import Link from 'next/link';

export default function TambahMuridPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    jenisKelamin: 'L' as 'L' | 'P',
    tanggalLahir: '',
    alamat: '',
    kelasId: '',
    namaOrangTua: '',
    noTelpOrangTua: '',
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard/murid');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    try {
      const response = await fetch('/api/kelas?limit=100');
      if (response.ok) {
        const data = await response.json();
        setKelasList(data);
      }
    } catch (error) {
      console.error('Failed to fetch kelas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        kelasId: formData.kelasId ? parseInt(formData.kelasId) : null,
      };

      const response = await fetch('/api/murid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/dashboard/murid');
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

  if (isLoading || !user) {
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
          <Link href="/dashboard/murid">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Murid</h1>
          <p className="text-muted-foreground mt-1">
            Tambahkan data siswa baru
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Murid</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nisn">NISN *</Label>
                  <Input
                    id="nisn"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0051234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Ahmad Pratama"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                  <Select
                    value={formData.jenisKelamin}
                    onValueChange={(value: 'L' | 'P') =>
                      setFormData({ ...formData, jenisKelamin: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelasId">Kelas</Label>
                <Select
                  value={formData.kelasId}
                  onValueChange={(value) => setFormData({ ...formData, kelasId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tidak ada kelas</SelectItem>
                    {kelasList.map((kelas) => (
                      <SelectItem key={kelas.id} value={kelas.id.toString()}>
                        {kelas.namaKelas} - {kelas.tahunAjaran}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Contoh: Jl. Merdeka No. 15, Jakarta"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaOrangTua">Nama Orang Tua</Label>
                  <Input
                    id="namaOrangTua"
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    placeholder="Contoh: Bapak Ahmad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noTelpOrangTua">No. Telp Orang Tua</Label>
                  <Input
                    id="noTelpOrangTua"
                    value={formData.noTelpOrangTua}
                    onChange={(e) => setFormData({ ...formData, noTelpOrangTua: e.target.value })}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Link href="/dashboard/murid">
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
