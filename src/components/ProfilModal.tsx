'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ProfilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilModal({ isOpen, onClose }: ProfilModalProps) {
  const { user, updateUser } = useAuth();
  const [nama, setNama] = useState(user?.nama || '');
  const [foto, setFoto] = useState(user?.foto || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For this demo/MVP, we'll use FileReader to create a base64 string
      // In production, you'd upload to Supabase Storage or similar
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFoto(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah foto');
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/pengguna', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          nama,
          foto,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      updateUser({ nama, foto });
      toast.success('Profil berhasil diperbarui');
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0a0a0b] border-[#1a1a1b] text-white overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                  Profil Pengguna
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Perbarui informasi profil Anda di sini. Klik simpan setelah selesai.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-[#1a1a1b] overflow-hidden bg-[#141415] flex items-center justify-center">
                      {foto ? (
                        <img src={foto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-600" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <span className="text-xs text-gray-500">Format: JPG, PNG. Maks 2MB.</span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nama" className="text-gray-300">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="bg-[#141415] border-[#1a1a1b] text-white focus-visible:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-gray-300">Username</Label>
                  <Input
                    value={user?.username}
                    disabled
                    className="bg-[#0a0a0b] border-[#1a1a1b] text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-gray-300">Role</Label>
                  <div className="px-3 py-2 bg-[#141415] border border-[#1a1a1b] rounded-md text-sm text-gray-400 capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-[#1a1a1b]"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}