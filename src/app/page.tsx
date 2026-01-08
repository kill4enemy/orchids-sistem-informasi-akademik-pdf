'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0b] text-white selection:bg-[#2dd4bf]/30">
      {/* Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-[#1a1a1b] bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="p-2 bg-gradient-to-br from-[#2dd4bf] to-blue-600 rounded-lg mr-3 shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:scale-110 transition-transform">
            < GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-white">SIAKAD<span className="text-[#2dd4bf]">SMA</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#1a1a1b]">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Link href="/login">Mulai Sekarang</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2dd4bf]/10 blur-[120px] rounded-full" />
          </div>

          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141415] border border-[#1a1a1b] text-[13px] text-gray-400 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-[#2dd4bf]" />
                Sistem Akademik Generasi Terbaru
              </div>
              
              <div className="space-y-6 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                  Modernisasi Manajemen <br />
                  <span className="text-[#2dd4bf]">Sekolah Anda</span> Sekarang
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-400 md:text-xl lg:text-2xl leading-relaxed">
                  Sistem Informasi Akademik terpadu untuk efisiensi administrasi, transparansi nilai, dan kemudahan akses data bagi guru, murid, dan wali murid.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-[#2dd4bf] hover:bg-[#26b4a2] text-[#0a0a0b] font-bold h-14 px-10 rounded-2xl text-lg shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                  <Link href="/login">Coba Gratis <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg border-[#1a1a1b] bg-[#141415] text-white hover:bg-[#1a1a1b]">
                  <Link href="/login">Login Akun</Link>
                </Button>
              </div>


            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t border-[#1a1a1b] bg-[#0a0a0b]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center group">
            <GraduationCap className="h-6 w-6 text-[#2dd4bf] mr-2" />
            <span className="font-bold text-xl tracking-tighter text-white">SIAKAD<span className="text-[#2dd4bf]">SMA</span></span>
          </div>
          <p className="text-sm text-gray-500">© 2024 SIAKAD SMA. Hak Cipta Dilindungi.</p>
          <nav className="flex gap-8">
            <Link className="text-xs text-gray-500 hover:text-white" href="#">Syarat & Ketentuan</Link>
            <Link className="text-xs text-gray-500 hover:text-white" href="#">Kebijakan Privasi</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
