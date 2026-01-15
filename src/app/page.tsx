'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Sparkles, Menu, X, CheckCircle2, ShieldCheck, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ModeToggle } from '@/components/ModeToggle';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Fitur', href: '#features' },
    { name: 'Tentang', href: '#about' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-[#2dd4bf]/30 overflow-x-hidden font-sans">
      {/* Navbar */}
      <header className={`px-6 lg:px-12 h-20 flex items-center border-b transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? 'border-border bg-background/90 backdrop-blur-xl h-16' : 'border-transparent bg-transparent h-20'
      }`}>
        <Link className="flex items-center justify-center group" href="/">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-br from-[#2dd4bf] to-blue-600 rounded-xl mr-3 shadow-[0_0_20px_rgba(45,212,191,0.2)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </motion.div>
          <span className="font-bold text-2xl tracking-tighter">SIAKAD<span className="text-[#2dd4bf]">SMA</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="ml-auto hidden lg:flex items-center gap-10">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-sm font-medium text-muted-foreground hover:text-[#2dd4bf] transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-border" />
          <ModeToggle />
          <Button asChild className="bg-[#2dd4bf] hover:bg-[#26b4a2] text-[#0a0a0b] font-bold rounded-full px-8 shadow-[0_0_20px_rgba(45,212,191,0.15)] hover:shadow-[0_0_30px_rgba(45,212,191,0.25)] transition-all">
            <Link href="/login">Login</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-muted-foreground hover:text-foreground relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </motion.button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-border z-50 lg:hidden p-8 flex flex-col shadow-2xl"
              >
                <div className="flex items-center mb-12">
                   <div className="p-2 bg-gradient-to-br from-[#2dd4bf] to-blue-600 rounded-lg mr-3">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tighter">SIAKAD<span className="text-[#2dd4bf]">SMA</span></span>
                </div>

                <div className="flex flex-col gap-4 mb-auto">
                  {menuItems.map((item, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      key={item.name}
                    >
                      <Link 
                        href={item.href} 
                        className="text-lg font-medium text-muted-foreground hover:text-foreground flex items-center py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-8 border-t border-border">
                  <Button asChild className="bg-[#2dd4bf] hover:bg-[#26b4a2] text-[#0a0a0b] font-bold rounded-2xl h-14 text-lg shadow-[0_0_20px_rgba(45,212,191,0.2)]" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login Ke Sistem</Link>
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-40">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[60%] lg:w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -40, 0],
                y: [0, 40, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[60%] lg:w-[40%] h-[40%] bg-[#2dd4bf]/20 blur-[120px] rounded-full" 
            />
          </div>

          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 lg:space-y-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-xs lg:text-sm text-muted-foreground shadow-xl"
              >
                <Sparkles className="h-4 w-4 text-[#2dd4bf]" />
                <span className="font-medium">Sistem Akademik Generasi Terbaru</span>
              </motion.div>
              
              <div className="space-y-6 max-w-5xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl/none bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground leading-[1.1]"
                >
                  Kelola Sekolah <br className="hidden sm:block" />
                  <span className="text-[#2dd4bf]">Lebih Cerdas.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed"
                >
                  SIAKAD SMA menghadirkan ekosistem digital terpadu untuk efisiensi administrasi, transparansi nilai, dan kemudahan akses data kapan saja, di mana saja.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4 sm:px-0"
              >
                <Button asChild size="lg" className="bg-[#2dd4bf] hover:bg-[#26b4a2] text-[#0a0a0b] font-bold h-16 px-12 rounded-2xl text-xl shadow-[0_20px_40px_-10px_rgba(45,212,191,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(45,212,191,0.4)] transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                  <Link href="/login" className="flex items-center">Login Ke Sistem <ArrowRight className="ml-2 h-6 w-6" /></Link>
                </Button>
              </motion.div>

              {/* Trust Badge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-12 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale dark:opacity-40 opacity-60"
              >
                <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="h-6 w-6" /> SECURE</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6" /> FAST</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Users className="h-6 w-6" /> COLLABORATIVE</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Preview Section */}
        <section id="features" className="py-24 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Fitur Unggulan Kami</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Segala yang Anda butuhkan untuk manajemen sekolah modern dalam satu platform yang intuitif.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Manajemen Kelas', 
                  desc: 'Atur jadwal, absensi, dan materi pelajaran dengan mudah secara real-time.',
                  icon: <Users className="h-10 w-10 text-[#2dd4bf]" />
                },
                { 
                  title: 'Laporan Akademik', 
                  desc: 'Pantau perkembangan nilai siswa dengan grafik dan laporan yang komprehensif.',
                  icon: <CheckCircle2 className="h-10 w-10 text-blue-500" />
                },
                { 
                  title: 'Akses Multi-Role', 
                  desc: 'Portal khusus untuk Admin, Guru, Siswa, dan Orang Tua dengan hak akses yang aman.',
                  icon: <ShieldCheck className="h-10 w-10 text-purple-500" />
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl bg-card border border-border hover:border-[#2dd4bf]/30 transition-all group shadow-sm"
                >
                  <div className="mb-6 p-4 rounded-2xl bg-background inline-block group-hover:bg-[#2dd4bf]/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-16 border-t border-border bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6 group">
                <div className="p-2 bg-gradient-to-br from-[#2dd4bf] to-blue-600 rounded-lg mr-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tighter">SIAKAD<span className="text-[#2dd4bf]">SMA</span></span>
              </div>
              <p className="text-muted-foreground text-lg max-sm mb-8">
                Memberdayakan institusi pendidikan dengan teknologi masa depan untuk mencetak generasi unggul.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Tautan Cepat</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-[#2dd4bf] transition-colors">Fitur</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-[#2dd4bf] transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-[#2dd4bf] transition-colors">Bantuan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legalitas</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-[#2dd4bf] transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-[#2dd4bf] transition-colors">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">© 2024 SIAKAD SMA. Seluruh hak cipta dilindungi undang-undang.</p>
            <div className="flex gap-6">
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-[#2dd4bf]/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">IG</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-[#2dd4bf]/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">FB</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-[#2dd4bf]/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">TW</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
