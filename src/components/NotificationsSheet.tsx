'use client';

import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Info, 
  AlertTriangle, 
  X,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from 'react';

const notifications = [
  {
    id: 1,
    title: "Ujian Akhir Semester",
    description: "Jadwal UAS Semester Genap sudah tersedia. Silakan cek di menu Jadwal.",
    time: "2 jam yang lalu",
    type: "info",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    unread: true
  },
  {
    id: 2,
    title: "Nilai Matematika Keluar",
    description: "Nilai Tugas 2 Matematika Anda telah diinput oleh Budi Santoso.",
    time: "5 jam yang lalu",
    type: "success",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    unread: true
  },
  {
    id: 3,
    title: "Pengingat Tugas",
    description: "Tugas Biologi: Laporan Praktikum akan berakhir dalam 24 jam.",
    time: "1 hari yang lalu",
    type: "warning",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    unread: false
  },
  {
    id: 4,
    title: "Pesan Baru",
    description: "Wali kelas Anda mengirimkan pesan mengenai progres akademik.",
    time: "2 hari yang lalu",
    type: "message",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    unread: false
  }
];

export function NotificationsSheet({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(notifications);

  const markAllRead = () => {
    setItems(items.map(item => ({ ...item, unread: false })));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="bg-[#0a0a0b] border-[#1a1a1b] w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-[#1a1a1b] flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <SheetTitle className="text-xl font-bold text-white">Notifikasi</SheetTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllRead}
              className="text-xs text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer relative group",
                    item.unread 
                      ? "bg-[#141415] border-blue-500/20 hover:border-blue-500/40" 
                      : "bg-[#0a0a0b] border-[#1a1a1b] hover:border-[#2a2a2b]"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                      <item.icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={cn("text-sm font-bold", item.unread ? "text-white" : "text-gray-300")}>
                          {item.title}
                        </h4>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600 font-medium">{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-[#141415] border border-[#1a1a1b] flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tidak Ada Notifikasi</h3>
                  <p className="text-sm text-gray-500">Kami akan memberi tahu Anda jika ada info terbaru.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#1a1a1b] bg-[#0a0a0b]">
            <Button className="w-full bg-[#1a1a1b] hover:bg-[#2a2a2b] text-white rounded-xl h-12 font-semibold">
              Lihat Semua Aktivitas
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
