'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer } from 'lucide-react';
import { Murid, Kelas } from '@/types';

export default function LaporanPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [muridList, setMuridList] = useState<Murid[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState<string>('all');

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
        fetch('/api/murid?limit=1000'),
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

  const getKelasName = (kelasId: number | null) => {
    if (!kelasId) return '-';
    const kelas = kelasList.find((k) => k.id === kelasId);
    return kelas ? kelas.namaKelas : '-';
  };

  const filteredMurid = selectedKelas === 'all' 
    ? muridList 
    : muridList.filter(m => m.kelasId?.toString() === selectedKelas);

  const handlePrint = () => {
    window.print();
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Data Murid</h1>
            <p className="text-muted-foreground mt-1">
              Laporan lengkap data siswa
            </p>
          </div>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak Laporan
          </Button>
        </div>

        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Kelas:</label>
              <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id.toString()}>
                      {kelas.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none">
          <CardHeader className="text-center print:border-b-2 print:border-black">
            <div className="space-y-1">
              <CardTitle className="text-2xl">LAPORAN DATA MURID</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sistem Informasi Akademik Sekolah Menengah Atas
              </p>
              {selectedKelas !== 'all' && (
                <p className="text-sm font-medium">
                  Kelas: {kelasList.find(k => k.id.toString() === selectedKelas)?.namaKelas}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : filteredMurid.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data murid untuk kelas yang dipilih
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-2 font-semibold">No</th>
                      <th className="text-left py-2 px-2 font-semibold">NISN</th>
                      <th className="text-left py-2 px-2 font-semibold">Nama Lengkap</th>
                      <th className="text-left py-2 px-2 font-semibold">L/P</th>
                      <th className="text-left py-2 px-2 font-semibold">Tanggal Lahir</th>
                      <th className="text-left py-2 px-2 font-semibold">Kelas</th>
                      <th className="text-left py-2 px-2 font-semibold">Orang Tua</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMurid.map((murid, index) => (
                      <tr key={murid.id} className="border-b border-gray-200">
                        <td className="py-2 px-2">{index + 1}</td>
                        <td className="py-2 px-2">{murid.nisn}</td>
                        <td className="py-2 px-2">{murid.nama}</td>
                        <td className="py-2 px-2">{murid.jenisKelamin}</td>
                        <td className="py-2 px-2">{murid.tanggalLahir || '-'}</td>
                        <td className="py-2 px-2">{getKelasName(murid.kelasId)}</td>
                        <td className="py-2 px-2">{murid.namaOrangTua || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 print:block hidden">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm">Total Murid: <strong>{filteredMurid.length}</strong></p>
                </div>
                <div className="text-center">
                  <p className="text-sm mb-16">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm">Kepala Sekolah</p>
                  <p className="text-sm mt-12 border-t border-black inline-block px-8">(...........................)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
