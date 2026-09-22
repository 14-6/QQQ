'use client';

import React, { useState, useEffect } from 'react';
import {  
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Globe, 
  Search,
  X,
  Loader2
} from 'lucide-react';
import AdBookingForm from './AdBookingForm';
import { createClient } from '@supabase/supabase-js';

// تهيئة عميل Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DeliveryPlatform {
  name: string;
  nameEn: string;
  logo: string;
  url: string;
  bgColor: string;
}

interface Brand {
  id: number;
  name: string;
  arabicName: string;
  category: string;
  handle: string;
  logo: string;
  typeAr: string;
  typeEn: string;
  locationsAr: string[];
  locationsEn: string[];
  deliveryPlatforms: DeliveryPlatform[];
}

// أيقونات وسائل التواصل Social SVG Icons
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.92a6.34 6.34 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.28a8.16 8.16 0 0 0 4.77 1.52V7.34a4.85 4.85 0 0 1-1-.65z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Home() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedBrandForOrder, setSelectedBrandForOrder] = useState<Brand | null>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const videoSources = [
    '/videos/clip1.mp4',
    '/videos/clip2.mp4',
    '/videos/clip3.mp4',
  ];

  // جلب البراندات ديناميكيًا من Supabase
  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching brands:', error);
        } else if (data && data.length > 0) {
          const formattedBrands: Brand[] = data.map((b) => ({
            id: b.id,
            name: b.name_en || b.name || '',
            arabicName: b.name_ar || b.arabicName || '',
            category: b.category || 'fastfood',
            handle: b.handle || '@brand',
            logo: b.logo || '/logos/placeholder.png',
            typeAr: b.type_ar || b.typeAr || 'مطعم',
            typeEn: b.type_en || b.typeEn || 'Restaurant',
            locationsAr: Array.isArray(b.locations_ar) ? b.locations_ar : (typeof b.locations_ar === 'string' ? b.locations_ar.split(',').map((s: string) => s.trim()) : ['الدوحة']),
            locationsEn: Array.isArray(b.locations_en) ? b.locations_en : (typeof b.locations_en === 'string' ? b.locations_en.split(',').map((s: string) => s.trim()) : ['Doha']),
            deliveryPlatforms: [
              { name: 'سنونو', nameEn: 'Snoonu', logo: '/logos/snoonu.png', url: b.snoonu_url || '', bgColor: 'hover:bg-amber-500/10 hover:border-amber-500/40' },
              { name: 'طلبات', nameEn: 'Talabat', logo: '/logos/talabat.png', url: b.talabat_url || '', bgColor: 'hover:bg-orange-500/10 hover:border-orange-500/40' },
              { name: 'رفيق', nameEn: 'Rafeeq', logo: '/logos/rafeeq.png', url: b.rafeeq_url || '', bgColor: 'hover:bg-red-500/10 hover:border-red-500/40' }
            ].filter(p => p.url)
          }));
          setBrands(formattedBrands);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [videoSources.length]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // تصفية البراندات حسب الفئة وكلمة البحث
  const filteredBrands = brands.filter(brand => {
    const matchesCategory = activeFilter === 'all' || brand.category === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      brand.name.toLowerCase().includes(query) || 
      brand.arabicName.toLowerCase().includes(query) || 
      brand.handle.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const content = {
    ar: {
      subtitle: 'المنصة الرقمية الموحدة لاستكشاف وإدارة براندات ومشاريع مجموعة QQQ في قطر.',
      brandsHeading: 'المشاريع والعلامات التجارية',
      brandsSub: 'تصفح المطاعم والكافيهات والمتاجر المباشرة',
      brandsCount: 'علامة تجارية',
      locationsLabel: 'الفروع والتواجد:',
      orderBtn: 'اطلب الآن',
      searchPlaceholder: 'ابحث عن براند أو مطعم...',
      noResults: 'لا توجد نتائج تطابق بحثك',
      filters: [
        { id: 'all', label: 'الكل' },
        { id: 'fastfood', label: 'مطاعم وبرجر' },
        { id: 'cafe', label: 'كافيهات' },
        { id: 'sweets', label: 'حلويات' },
        { id: 'breakfast', label: 'فطور' },
        { id: 'healthy', label: 'صحي ومجمدات' },
      ]
    },
    en: {
      subtitle: 'The unified digital platform to explore QQQ Group brands and ventures in Qatar.',
      brandsHeading: 'Projects & Brands',
      brandsSub: 'Explore restaurants, cafes, and direct stores',
      brandsCount: 'Brands',
      locationsLabel: 'Locations:',
      orderBtn: 'Order Now',
      searchPlaceholder: 'Search for a brand or restaurant...',
      noResults: 'No brands match your search',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'fastfood', label: 'Burgers & Food' },
        { id: 'cafe', label: 'Cafes' },
        { id: 'sweets', label: 'Sweets' },
        { id: 'breakfast', label: 'Breakfast' },
        { id: 'healthy', label: 'Healthy & Frozen' },
      ]
    }
  };

  const t = content[lang];

  return (
    <main className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ==================== 1. HEADER WITH VIDEO BACKGROUND ==================== */}
      <header className="relative w-full min-h-[520px] sm:min-h-[550px] lg:h-[85vh] overflow-hidden flex items-center justify-center text-white py-12 sm:py-0">

        {/* الشريط العلوي */}
        <div className="absolute top-4 left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-2" dir="ltr">
          
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold border border-white/20 bg-black/60 hover:bg-black/80 text-amber-400 backdrop-blur-md transition-all duration-300 active:scale-95 shrink-0 whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-amber-400/60 bg-black/60 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 shrink-0">
            <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400">QQQ</span>
          </div>

          <div className="shrink-0 flex items-center">
            <AdBookingForm lang={lang} />
          </div>

        </div>

        {/* خلفية الفيديو */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {videoSources.map((src, index) => (
            <video
              key={src}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              onEnded={handleVideoEnded}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-20" />

        {/* محتوى الهيدر الرئيسي */}
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center pt-20 sm:pt-12">
          
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wide mb-2 text-white drop-shadow-md">
            {lang === 'ar' ? 'عبدالله الغافري' : 'Abdulla AlGhafri'}
          </h1>
          
          <p className="text-amber-400 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider mb-3 sm:mb-4 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> A. ALGHAFRI | QQQ GROUP
          </p>

          <p className="max-w-xl text-neutral-200 text-xs sm:text-sm md:text-base leading-relaxed font-light mb-6">
            {t.subtitle}
          </p>

          {/* بطاقة الإحصائيات */}
          <div className="flex items-center justify-around w-full max-w-sm sm:max-w-lg bg-neutral-900/70 backdrop-blur-md border border-neutral-700/50 rounded-2xl p-3 sm:p-4 my-2 text-white shadow-xl">
            
            <div className="text-center px-1 sm:px-2">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{brands.length || 13}</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">{t.brandsCount}</div>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-neutral-700/60"></div>

            <div className="text-center px-1 sm:px-2">
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold">
                <span>+2.5M</span>
                <svg className="w-3.5 h-3.5 text-pink-500 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">Instagram</div>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-neutral-700/60"></div>

            <div className="text-center px-1 sm:px-2">
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold">
                <span>+4.5M</span>
                <svg className="w-4 h-4 text-red-600 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">YouTube</div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-5">
            {videoSources.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentVideoIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentVideoIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Video ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#121212] to-transparent z-20 pointer-events-none" />
      </header>

      {/* ==================== 2. BRANDS SECTION ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-neutral-900/60 backdrop-blur-md shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t.brandsHeading}</h2>
              <p className="text-xs text-neutral-400 mt-1">{t.brandsSub}</p>
            </div>

            {/* شريط البحث */}
            <div className="relative w-full md:w-72">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-neutral-800/80 border border-white/10 rounded-xl py-2 px-9 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 right-3 rtl:left-3 rtl:right-auto text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* أزرار الفئات */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 sm:pb-6 scrollbar-none sm:flex-wrap w-full">
            {t.filters.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border ${
                  activeFilter === tab.id
                    ? 'bg-amber-400 text-black font-bold border-amber-400 shadow-lg shadow-amber-400/20'
                    : 'bg-neutral-800 text-neutral-300 border-white/10 hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* حالة التحميل */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
              <p className="text-sm font-medium">جاري تحميل البيانات من السيرفر...</p>
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBrands.map(brand => (
                <div 
                  key={brand.id} 
                  className="border border-white/10 bg-neutral-800/80 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-neutral-900 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-amber-400/80 transition-colors">
                          <img 
                            src={brand.logo} 
                            alt={brand.name} 
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
                          />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {brand.name} {lang === 'ar' && brand.arabicName && <span className="text-[11px] font-normal text-neutral-400">({brand.arabicName})</span>}
                          </h3>
                          <span className="text-[11px] block text-neutral-400">{brand.handle}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-full border border-white/10 bg-white/5 text-amber-400 shrink-0">
                        {lang === 'ar' ? brand.typeAr : brand.typeEn}
                      </span>
                    </div>

                    <div className="mb-4 mt-2">
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-1.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{t.locationsLabel}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(lang === 'ar' ? brand.locationsAr : brand.locationsEn).map((loc, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded border border-white/10 bg-neutral-900 text-neutral-200"
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <button 
                      onClick={() => setSelectedBrandForOrder(brand)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer text-black bg-amber-400 hover:bg-amber-300"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {t.orderBtn}
                    </button>
                    
                    <a 
                      href={`https://instagram.com/${brand.handle.replace('@', '')}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 border border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      title="Instagram"
                    >
                      <InstagramIcon className="w-4 h-4 text-amber-400" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400 border border-dashed border-white/10 rounded-2xl">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-400" />
              <p className="text-sm">{t.noResults}</p>
            </div>
          )}

        </div>
      </section>

      {/* مودال الطلب المباشر للمنصات */}
      {selectedBrandForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setSelectedBrandForOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <img 
                src={selectedBrandForOrder.logo} 
                alt={selectedBrandForOrder.name} 
                className="w-16 h-16 mx-auto rounded-xl border border-white/10 p-1 mb-3 object-contain bg-black"
              />
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? selectedBrandForOrder.arabicName || selectedBrandForOrder.name : selectedBrandForOrder.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">اختر منصة التوصيل المباشرة</p>
            </div>
            <div className="space-y-3">
              {selectedBrandForOrder.deliveryPlatforms && selectedBrandForOrder.deliveryPlatforms.length > 0 ? (
                selectedBrandForOrder.deliveryPlatforms.map((platform, i) => (
                  <a
                    key={i}
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-neutral-800 hover:border-amber-400 transition-all group"
                  >
                    <span className="text-sm font-semibold text-white">
                      {lang === 'ar' ? platform.name : platform.nameEn}
                    </span>
                    <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </a>
                ))
              ) : (
                <p className="text-center text-xs text-neutral-500 py-4">لا تتوفر روابط توصيل حالياً لهذا البراند.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. COMPREHENSIVE FOOTER ==================== */}
      <footer className="w-full bg-neutral-950 text-neutral-300 pt-12 sm:pt-16 pb-8 border-t border-white/10 font-sans mt-12 sm:mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full border border-amber-400 bg-neutral-900 flex items-center justify-center shadow-lg">
                    <span className="text-base font-black tracking-widest text-amber-400">QQQ</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'ar' ? 'مجموعة QQQ' : 'QQQ Group'}
                    </h3>
                    <span className="text-xs text-amber-400/90 font-medium">
                      {lang === 'ar' ? 'عبدالله الغافري' : 'Abdulla AlGhafri'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-light">
                  {lang === 'ar'
                    ? 'المظلة الاستثمارية الموحدة لجميع علاماتنا التجارية والمبادرات الرقمية والترفيهية في دولة قطر والخليج.'
                    : 'The unified investment umbrella for all our commercial brands, digital initiatives, and hospitality ventures in Qatar and the Gulf.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <a href="https://instagram.com/qqq" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors" aria-label="Instagram">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a href="https://tiktok.com/@qqq" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors" aria-label="TikTok">
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                  <a href="https://x.com/qqq" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors" aria-label="Twitter">
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>© {new Date().getFullYear()} QQQ Group. All rights reserved.</p>
            <p className="text-neutral-400">Doha, State of Qatar 🇶🇦</p>
          </div>
        </div>
      </footer>
    </main>
  );
}