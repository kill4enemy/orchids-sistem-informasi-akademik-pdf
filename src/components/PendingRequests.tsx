'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, User, School, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';

interface PendingRequest {
  id: number;
  muridId: number;
  namaMurid: string;
  nisn: string;
  kelasId: number;
  namaKelas: string;
  createdAt: string;
}

export default function PendingRequests({ userId, role }: { userId: number, role: string }) {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [guruId, setGuruId] = useState<number | null>(null);

    useEffect(() => {
      const fetchGuruAndRequests = async () => {
        try {
          let url = '/api/permintaan-kelas';
          
          if (role === 'guru') {
            // Find guru linked to this penggunaId
            const guruRes = await fetch(`/api/guru/me?penggunaId=${userId}`);
            if (guruRes.ok) {
              const currentGuru = await guruRes.json();
              if (currentGuru && currentGuru.id) {
                setGuruId(currentGuru.id);
                url += `?guruId=${currentGuru.id}`;
              }
            }
          } else if (role === 'admin') {
            // Admin sees all
            url += '?all=true';
          }

          const reqRes = await fetch(url);
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            setRequests(reqData);
          }
        } catch (error) {
          console.error('Failed to fetch requests:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGuruAndRequests();
    }, [userId, role]);

  const handleAction = async (id: number, status: 'disetujui' | 'ditolak') => {
    try {
      const response = await fetch('/api/permintaan-kelas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast.success(`Permintaan ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`);
        setRequests(requests.filter(r => r.id !== id));
      } else {
        toast.error("Gagal memproses permintaan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-orange-500/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Permintaan Masuk Kelas
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-tighter">
          {requests.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{req.namaMurid}</h4>
                <p className="text-xs text-muted-foreground">NISN: {req.nisn}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <School className="w-3 h-3 text-emerald-500" />
                  Kelas: {req.namaKelas}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => handleAction(req.id, 'disetujui')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/10"
              >
                <Check className="w-4 h-4" /> Setujui
              </Button>
              <Button 
                onClick={() => handleAction(req.id, 'ditolak')}
                variant="outline"
                className="flex-1 border-border bg-transparent text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 h-9 rounded-lg font-bold text-xs flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Tolak
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
