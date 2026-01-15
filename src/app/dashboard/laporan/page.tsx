'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Printer, 
  FileText, 
  Filter, 
  Download,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { Murid, Kelas } from '@/types';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function LaporanPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [muridList, setMuridList] = useState<Murid[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<string>('all');
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExporting(true);
    try {
      const element = reportRef.current;
      
      // Create a temporary container for the export to ensure white background and proper styling
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('report-to-export');
          if (clonedElement) {
            // Force white background and black text for export
            clonedElement.style.backgroundColor = 'white';
            clonedElement.style.color = 'black';
            
            // Show the hidden print header
            const printHeader = clonedElement.querySelector('.print-header-content');
            if (printHeader) {
              (printHeader as HTMLElement).style.display = 'block';
              (printHeader as HTMLElement).style.color = 'black';
            }

            // Show signature
            const signature = clonedElement.querySelector('.print-signature-content');
            if (signature) {
              (signature as HTMLElement).style.display = 'block';
              (signature as HTMLElement).style.color = 'black';
            }

            // Style tables for clarity in PDF
            const tables = clonedElement.querySelectorAll('table');
            tables.forEach(table => {
              table.style.color = 'black';
              table.style.backgroundColor = 'white';
            });

            const cells = clonedElement.querySelectorAll('th, td');
            cells.forEach(cell => {
              (cell as HTMLElement).style.color = 'black';
              (cell as HTMLElement).style.borderColor = '#e5e7eb';
              (cell as HTMLElement).style.backgroundColor = 'white';
            });

            const textElements = clonedElement.querySelectorAll('h1, h2, h3, p, span');
            textElements.forEach(text => {
              (text as HTMLElement).style.color = 'black';
            });
            
            // Hide preview-only elements
            const previewOnly = clonedElement.querySelector('.preview-only-content');
            if (previewOnly) {
              (previewOnly as HTMLElement).style.display = 'none';
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `Laporan_Akademik_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Export PDF error:', error);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Laporan Akademik</h1>
            <p className="text-muted-foreground mt-1">
              Generate dan cetak laporan data murid berdasarkan filter.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              disabled={exporting || loading || filteredMurid.length === 0}
              className="bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {exporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button 
              onClick={handlePrint} 
              disabled={loading || filteredMurid.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak Laporan
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-2xl p-6 print:hidden">
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-1.5 flex-1 max-w-xs">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Pilih Kelas</label>
              <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Pilih kelas..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id.toString()}>
                      {kelas.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex-1 max-w-xs">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Periode Laporan</label>
              <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 h-10 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Semester Ganjil 2023/2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div 
          id="report-to-export"
          ref={reportRef}
          className="bg-card border border-border rounded-2xl overflow-hidden print:bg-white print:border-none print:rounded-none print:shadow-none"
        >
          {/* Print Header */}
          <div className="hidden print:block print-header-content text-center p-8 border-b-2 border-black mb-8 text-black">
            <h2 className="text-2xl font-bold uppercase">Laporan Data Murid</h2>
            <p className="text-sm font-medium">Sistem Informasi Akademik Sekolah Menengah Atas</p>
            <p className="text-sm mt-1">Tahun Ajaran: 2023/2024</p>
            {selectedKelas !== 'all' && (
              <p className="text-sm font-bold mt-2">
                Kelas: {kelasList.find(k => k.id.toString() === selectedKelas)?.namaKelas}
              </p>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6 print:hidden preview-only-content">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Preview Laporan</h3>
                  <p className="text-muted-foreground text-xs">Total {filteredMurid.length} murid terdaftar</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="text-muted-foreground text-sm">Menyiapkan laporan...</p>
              </div>
            ) : filteredMurid.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada data murid untuk kelas yang dipilih</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse print:text-black">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 print:bg-gray-100 print:border-black">
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">No</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">NISN</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">Nama Lengkap</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">L/P</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">Tanggal Lahir</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">Kelas</th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider print:text-black">Wali Murid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border print:divide-black">
                    {filteredMurid.map((murid, index) => (
                      <tr key={murid.id} className="hover:bg-muted/30 transition-colors print:hover:bg-transparent">
                        <td className="py-4 px-4 text-sm text-muted-foreground print:text-black">{index + 1}</td>
                        <td className="py-4 px-4 text-sm text-foreground/80 font-mono print:text-black">{murid.nisn}</td>
                        <td className="py-4 px-4 text-sm text-foreground font-medium print:text-black">{murid.nama}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground print:text-black">{murid.jenisKelamin}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground print:text-black">{murid.tanggalLahir || '-'}</td>
                        <td className="py-4 px-4 text-sm text-foreground/80 print:text-black">{getKelasName(murid.kelasId)}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground print:text-black">{murid.namaOrangTua || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Print Signature */}
            <div className="mt-12 hidden print:block print-signature-content text-black">
              <div className="flex justify-between items-end">
                <div className="text-sm">
                  <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                  <p className="mt-1">Petugas: {user.nama}</p>
                </div>
                <div className="text-center w-64">
                  <p className="mb-24">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold border-t border-black pt-2">Kepala Sekolah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, button, .print\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .custom-scrollbar {
            overflow: visible !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
