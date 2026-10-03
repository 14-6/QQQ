'use client';

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Search, MapPin, ShoppingBag, Loader2 } from 'lucide-react';

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
  typeAr: string;
  typeEn: string;
  handle: string;
  logo: string;
  locationsAr: string[];
  locationsEn: string[];
  deliveryPlatforms: DeliveryPlatform[];
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const t = {
    brandsHeading: lang === 'ar' ? 'البراندات والمشاريع' : 'Brands & Projects',
    brandsSub: lang === 'ar' ? 'تصفح محفظة أعمالنا وعلاماتنا التجارية المتنوعة' : 'Browse our portfolio of diverse businesses and brands',
    searchPlaceholder: lang === 'ar' ? 'ابحث عن براند أو معرف...' : 'Search brand or handle...',
    locationsLabel: lang === 'ar' ? 'الفروع والتواجد:' : 'Locations & Presence:',
    orderBtn: lang === 'ar' ? 'التفاصيل والطلب' : 'Details & Order',
    noResults: lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching results found',
    filters: [
      { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
      { id: 'restaurant', label: lang === 'ar' ? 'مطعم وبرجر' : 'Restaurants & Burgers' },
      { id: 'cafe', label: lang === 'ar' ? 'كافيهات' : 'Cafes' },
      { id: 'sweets', label: lang === 'ar' ? 'حلويات' : 'Sweets' },
      { id: 'breakfast', label: lang === 'ar' ? 'فطور' : 'Breakfast' },
      { id: 'healthy', label: lang === 'ar' ? 'صحي ومجمدات' : 'Healthy & Frozen' },
    ]
  };

  useEffect(() => {
    // دالة لقراءة اللغة من المفتاح الصحيح qqq_lang
    const updateLanguageFromStorage = () => {
      const savedLang = localStorage.getItem('qqq_lang') as 'ar' | 'en';
      if (savedLang === 'en' || savedLang === 'ar') {
        setLang(savedLang);
      }
    };

    // القراءة عند التحميل الأول
    updateLanguageFromStorage();

    async function fetchBrands() {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching brands:', error);
      } else {
        const parseLocations = (locField: any) => {
          if (!locField) return [];
          if (Array.isArray(locField)) {
            const flattened: string[] = [];
            locField.forEach(item => {
              if (typeof item === 'string') {
                const parts = item.split(/[,،]+/).map(s => s.trim()).filter(Boolean);
                flattened.push(...parts);
              } else {
                flattened.push(item);
              }
            });
            return flattened;
          }
          if (typeof locField === 'string') {
            return locField.split(/[,،]+/).map(s => s.trim()).filter(Boolean);
          }
          return [];
        };

        const formatted = (data || []).map((b: any) => {
          const finalLocAr = parseLocations(b.locations_ar || b.locationsAr);
          const finalLocEn = parseLocations(b.locations_en || b.locationsEn || b.locations_ar || b.locationsAr);

          return {
            id: b.id,
            name: b.name_en || b.name || '',
            arabicName: b.arabic_name || b.arabicName || b.name_ar || b.name || '',
            category: b.category || 'fastfood',
            handle: b.handle || '@brand',
            logo: b.logo || b.logo_url || b.image_url || '/logos/placeholder.png',
            typeAr: b.type_ar || b.typeAr || 'مطعم',
            typeEn: b.type_en || b.typeEn || 'Restaurant',
            locationsAr: finalLocAr,
            locationsEn: finalLocEn,
            deliveryPlatforms: [
              { name: 'سنونو', nameEn: 'Snoonu', logo: '/logos/snoonu.png', url: b.snoonu_url || '', bgColor: 'hover:bg-amber-500/10 hover:border-amber-500/40' },
              { name: 'طلبات', nameEn: 'Talabat', logo: '/logos/talabat.png', url: b.talabat_url || '', bgColor: 'hover:bg-orange-500/10 hover:border-orange-500/40' },
              { name: 'رفيق', nameEn: 'Rafeeq', logo: '/logos/rafeeq.png', url: b.rafeeq_url || '', bgColor: 'hover:bg-red-500/10 hover:border-red-500/40' }
            ].filter(p => p.url)
          };
        });
        setBrands(formatted);
      }
      setLoading(false);
    }
    fetchBrands();

    // الاستماع لحدث تغيير اللغة القادم من الـ Navbar
    window.addEventListener('languageChange', updateLanguageFromStorage);
    window.addEventListener('storage', updateLanguageFromStorage);

    return () => {
      window.removeEventListener('languageChange', updateLanguageFromStorage);
      window.removeEventListener('storage', updateLanguageFromStorage);
    };
  }, []);

  const filteredBrands = brands.filter(brand => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      brand.name?.toLowerCase().includes(query) ||
      brand.arabicName?.toLowerCase().includes(query) ||
      brand.handle?.toLowerCase().includes(query);

    const matchesFilter = activeFilter === 'all' || brand.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-neutral-900/60 backdrop-blur-md shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t.brandsHeading}</h2>
              <p className="text-xs text-neutral-400 mt-1">{t.brandsSub}</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3' : 'left-3'} w-4 h-4 text-neutral-400 pointer-events-none`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-neutral-800/80 border border-white/10 rounded-xl py-2 ${lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-colors`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'left-3' : 'right-3'} text-neutral-400 hover:text-white text-xs`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
              <p className="text-sm font-medium">{lang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}</p>
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBrands.map(brand => {
                const currentLocations = lang === 'ar' ? (brand.locationsAr || []) : (brand.locationsEn || brand.locationsAr || []);
                const displayName = lang === 'ar' ? (brand.arabicName || brand.name) : (brand.name || brand.arabicName);

                return (
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
                              alt={displayName} 
                              className="w-full h-full object-contain rounded-lg"
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
                            />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">
                              {displayName}
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
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{t.locationsLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {currentLocations.slice(0, 3).map((loc, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md border border-neutral-700/60 bg-neutral-900/90 text-neutral-300 shadow-sm font-medium"
                            >
                              {loc}
                            </span>
                          ))}
                          {currentLocations.length > 3 && (
                            <span className="text-[10px] sm:text-[11px] px-2 py-1 rounded-md border border-neutral-700/60 bg-neutral-900/90 text-amber-400 font-medium">
                              +{currentLocations.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                      <button 
                        onClick={() => setSelectedBrand(brand)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer text-black bg-amber-400 hover:bg-amber-300"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {t.orderBtn}
                      </button>
                      
                      <a 
                        href={`https://instagram.com/${brand.handle?.replace('@', '')}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 border border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      >
                        <InstagramIcon className="w-4 h-4 text-amber-400" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400 border border-dashed border-white/10 rounded-2xl">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-400" />
              <p className="text-sm">{t.noResults}</p>
            </div>
          )}

        </div>
      </section>

      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`absolute top-5 ${lang === 'ar' ? 'left-5' : 'right-5'} w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors`}
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <img
                src={selectedBrand.logo}
                alt={selectedBrand.arabicName}
                className="w-20 h-20 rounded-2xl mx-auto mb-4 object-contain border border-white/10 bg-neutral-950 p-2 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-white mb-1">
                {lang === 'ar' ? (selectedBrand.arabicName || selectedBrand.name) : (selectedBrand.name || selectedBrand.arabicName)}
              </h2>
              <p className="text-sm text-gray-400 font-mono">{selectedBrand.handle}</p>
            </div>

            {((lang === 'ar' ? selectedBrand.locationsAr : (selectedBrand.locationsEn || selectedBrand.locationsAr)))?.length > 0 && (
              <div className="mb-6 bg-neutral-950/60 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs text-amber-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold">{t.locationsLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(lang === 'ar' ? selectedBrand.locationsAr : (selectedBrand.locationsEn || selectedBrand.locationsAr)).map((loc, idx) => (
                    <span key={idx} className="bg-white/5 px-3 py-1 rounded-lg text-xs text-gray-300 border border-white/5">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center mb-2">
                {lang === 'ar' ? 'روابط الطلب المباشر' : 'Direct Ordering Links'}
              </p>

              {selectedBrand.deliveryPlatforms && selectedBrand.deliveryPlatforms.length > 0 ? (
                selectedBrand.deliveryPlatforms.map((platform, idx) => (
                  <a
                    key={idx}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 transition-all group ${platform.bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-neutral-950 p-1 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                        <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-medium text-white group-hover:text-amber-400">
                        {lang === 'ar' ? `${platform.name} (${platform.nameEn})` : `${platform.nameEn} (${platform.name})`}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-gray-500 bg-white/5 rounded-xl">
                  {lang === 'ar' ? 'لا توجد روابط طلب مباشر متوفرة حالياً' : 'No direct delivery links available currently'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}