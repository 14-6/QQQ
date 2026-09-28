'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Megaphone, Globe, Menu, X } from 'lucide-react';
import AdBookingForm from '../AdBookingForm';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // قراءة اللغة المحفوظة عند التحميل الأول
  useEffect(() => {
    const savedLang = localStorage.getItem('qqq_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // دالة تبديل اللغة وإرسال تنبيه لبقية الصفحة لتتحدث فوراً
  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('qqq_lang', newLang);
    
    // إطلاق حدث مخصص لكي تشعر صفحة page.tsx بالتغيير وتتحدث لغتها
    window.dispatchEvent(new Event('languageChange'));
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* الشعار أو اسم المجموعة */}
        <div className="flex items-center gap-3">
          <Link href="/" className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/25 to-yellow-300/25 rounded-xl blur-sm opacity-40 group-hover:opacity-75 transition-all duration-500"></div>
            <div className="relative px-3.5 py-1.2 rounded-xl border border-amber-400/50 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-sm sm:text-base font-black tracking-[0.22em] text-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.3)]">QQQ</span>
            </div>
          </Link>
        </div>

        {/* روابط التنقل الرئيسية */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-full border border-neutral-800/80 shadow-inner">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/') ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>

          <Link
            href="/about"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/about') ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </Link>

          <Link
            href="/brands"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/brands') ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'البراندات والمشاريع' : 'Brands'}
          </Link>

          <Link
            href="/contact"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/contact') ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
        </nav>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2.5">
          <AdBookingForm lang={lang === 'en' ? 'en' : 'ar'} />

          {/* زر تغيير اللغة المستقل */}
          <button
            onClick={toggleLanguage}
            className="relative group flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-400/50 bg-neutral-900/90 backdrop-blur-xl shadow-md hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300"
            title="تغيير اللغة / Change Language"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-bold text-xs tracking-wider">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-amber-400/50 bg-neutral-900/90 text-amber-400 hover:bg-neutral-800 transition-all shadow-md"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-800 px-6 py-6 flex flex-col gap-3 shadow-2xl transition-all animate-fadeIn">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${isActive('/') ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300'}`}>
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${isActive('/about') ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300'}`}>
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </Link>
          <Link href="/brands" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${isActive('/brands') ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300'}`}>
            {lang === 'ar' ? 'البراندات والمشاريع' : 'Brands'}
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${isActive('/contact') ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300'}`}>
            {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
        </div>
      )}
    </header>
  );
}