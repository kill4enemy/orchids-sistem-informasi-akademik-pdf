'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, ArrowLeft, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Username atau password salah');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2dd4bf]/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden p-8 md:p-10">
          <div className="flex flex-col items-center text-center space-y-6 mb-10">
            <div className="p-4 bg-gradient-to-br from-[#2dd4bf] to-blue-600 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">Selamat Datang</h1>
              <p className="text-muted-foreground">Masuk ke SIAKAD SMA untuk melanjutkan</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground text-sm ml-1">Username</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#2dd4bf] transition-colors" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Username / NISN"
                  className="bg-background border-border h-12 pl-12 rounded-xl focus-visible:ring-[#2dd4bf] transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-sm ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#2dd4bf] transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password anda"
                  className="bg-background border-border h-12 pl-12 rounded-xl focus-visible:ring-[#2dd4bf] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-xl">
                <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2dd4bf] hover:bg-[#26b4a2] text-[#0a0a0b] font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0a0a0b]/30 border-t-[#0a0a0b] rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : 'Masuk Sekarang'}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-muted-foreground text-xs mt-8">
          © 2024 SIAKAD SMA. All rights reserved.
        </p>
      </div>
    </div>
  );
}
