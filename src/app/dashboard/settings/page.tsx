'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useTheme } from 'next-themes';
import { 
  User, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Key, 
  Mail, 
  UserCircle, 
  ShieldCheck,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    username: user?.username || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/pengguna', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memperbarui profil');
      }

      updateUser(formData);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Semua field password harus diisi');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/pengguna/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memperbarui password');
      }

      toast.success('Password berhasil diperbarui');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Settings</h1>
          <p className="text-muted-foreground">Kelola preferensi akun dan tampilan sistem Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Navigation for Settings */}
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start gap-3 bg-accent text-accent-foreground">
              <UserCircle className="w-4 h-4" />
              Akun & Biodata
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
              <SettingsIcon className="w-4 h-4" />
              Preferensi
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
              <ShieldCheck className="w-4 h-4" />
              Keamanan
            </Button>
          </div>

            <div className="md:col-span-2 space-y-6">
              {/* Theme Toggle Section */}
              <Card className="bg-card border-border text-card-foreground">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-500" />
                    <CardTitle>Tampilan</CardTitle>
                  </div>
                  <CardDescription>Ubah tema sistem antara mode terang dan gelap.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Gelap</Label>
                    <p className="text-sm text-muted-foreground">Gunakan tema gelap untuk mengurangi kelelahan mata.</p>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </CardContent>
              </Card>

              {/* Account & Biodata Section */}
              <Card className="bg-card border-border text-card-foreground">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <CardTitle>Biodata Akun</CardTitle>
                  </div>
                  <CardDescription>Informasi dasar akun Anda.</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input 
                          id="nama" 
                          value={formData.nama}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                          className="bg-background border-border focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="bg-background border-border focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="px-3 py-2 bg-secondary border border-border rounded-md text-sm text-muted-foreground capitalize">
                        {user?.role}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-6">
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 ml-auto gap-2">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan Perubahan
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Password Reset Section */}
              <Card className="bg-card border-border text-card-foreground">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-500" />
                    <CardTitle>Ganti Password</CardTitle>
                  </div>
                  <CardDescription>Pastikan password Anda kuat untuk keamanan akun.</CardDescription>
                </CardHeader>
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Password Saat Ini</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="bg-background border-border focus-visible:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="bg-background border-border focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="bg-background border-border focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-6">
                    <Button type="submit" disabled={passwordLoading} variant="outline" className="border-border hover:bg-secondary ml-auto gap-2">
                      {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update Password
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
