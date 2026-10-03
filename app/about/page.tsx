'use client';

import { useState, useEffect } from 'react';
import { Building2, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem('qqq_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
    };

    checkLang();
    window.addEventListener('languageChange', checkLang);
    return () => window.removeEventListener('languageChange', checkLang);
  }, []);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center custom-section-bg">
      <div className="max-w-7xl w-full mx-auto space-y-24">
        
        {/* السكشن الرئيسي والهيدر */}
        <section className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center pt-10 sm:pt-6">
          
          {/* 1. LARGER & HIGHER QQQ BRAND ELEMENT */}
          <div className="mb-4 sm:mb-5 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/50 to-yellow-300/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-90 transition duration-500"></div>
            <div className="relative px-8 py-2.5 sm:py-3 rounded-2xl border border-amber-400/60 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl sm:text-4xl font-black tracking-[0.25em] text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)]">QQQ</span>
            </div>
          </div>

          {/* 2. NAME & SUBTITLE */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wide mb-3 text-white drop-shadow-md">
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
          
          <p className="text-amber-400 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider mb-3 sm:mb-4 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> A. ALGHAFRI | QQQ GROUP
          </p>

          <p className="max-w-xl text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-light mb-5">
            {lang === 'ar'
              ? 'نحن المنصة الرقمية الموحدة لاستكشاف وإدارة براندات ومشاريع مجموعة QQQ في قطر والمنطقة. نسعى لتقديم تجربة فريدة ومتميزة تجمع تحت مظلتها أحدث المشاريع الابتكارية والتجارية بمعايير عالمية.'
              : 'We are the unified digital platform for exploring and managing QQQ Group brands and projects in Qatar and the region. We strive to provide a unique and exceptional experience bringing together the latest innovative and commercial projects with global standards.'}
          </p>
        </section>

        {/* 1. سكشن مستقل: أرقام ونسب الوصول */}
        <section className="space-y-8 custom-section-bg p-6 md:p-10 rounded-3xl border shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {lang === 'ar' ? 'أرقام ونسب الوصول' : 'Reach & Numbers'}
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">
              {lang === 'ar' ? 'قوة التأثير والانتشار الشامل عبر مختلف المنصات الرقمية' : 'The power of comprehensive impact and reach across digital platforms'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* مشاهدات شهرية */}
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 text-center group shadow-xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gold mb-1">100M+</h3>
              <p className="text-sm text-[var(--text-muted)]">{lang === 'ar' ? 'مشاهدات شهرية' : 'Monthly Views'}</p>
            </div>

            {/* مشاركو يوتيوب */}
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 text-center group shadow-xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gold mb-1">4.5M+</h3>
              <p className="text-sm text-[var(--text-muted)]">{lang === 'ar' ? 'مشاركو يوتيوب' : 'YouTube Subscribers'}</p>
            </div>

            {/* متابعي إنستغرام */}
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 text-center group shadow-xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-4 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gold mb-1">2.5M+</h3>
              <p className="text-sm text-[var(--text-muted)]">{lang === 'ar' ? 'متابعي إنستغرام' : 'Instagram Followers'}</p>
            </div>

            {/* متابعي سناب شات */}
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1 text-center group shadow-xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2C7.305 2 4.412 5.092 4.412 9.073c0 2.454 1.054 4.148 2.195 5.253.513.493.99.95.99 1.637 0 .428-.216 1.037-.655 1.69-.47.701-1.127 1.681-1.229 1.792-.127.137-.168.326-.107.493.061.166.223.277.404.277 1.34 0 2.65-.483 3.844-1.434.542-.43 1.031-.893 1.445-1.37.195-.226.377-.457.545-.694.168.237.35.468.545.694.414.477 1.903.94 1.445 1.37 1.194.951 2.504 1.434 3.844 1.434.181 0 .343-.111.404-.277.061-.167.02-.356-.107-.493-.102-.111-.759-1.091-1.229-1.792-.439-.653-.655-1.262-.655-1.69 0-.687.477-1.144.99-1.637 1.141-1.105 2.195-2.799 2.195-5.253 0-3.981-2.893-7.073-7.6-7.073z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gold mb-1">3.8M+</h3>
              <p className="text-sm text-[var(--text-muted)]">{lang === 'ar' ? 'متابعي سناب شات' : 'Snapchat Followers'}</p>
            </div>

          </div>
        </section>

        {/* 2. سكشن مستقل: شركات ومؤسسات المجموعة */}
        <section className="space-y-8 custom-section-bg p-6 md:p-10 rounded-3xl border shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {lang === 'ar' ? 'شركات ومؤسسات المجموعة' : 'Group Companies & Entities'}
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">
              {lang === 'ar' ? 'منظومة متكاملة من الخدمات الإعلانية والاستثمارية والابداعية' : 'An integrated ecosystem of advertising, investment, and creative services'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QQQ Hospitality</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'قطاع الضيافة الفاخرة، المطاعم، المقاهي والضيافة العصرية.' : 'Luxury hospitality, restaurants, cafes, and modern dining.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QQQ Real Estate</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'استثمارات عقارية نوعية، إدارة الأصول والمشاريع التجارية السكنية.' : 'Quality real estate investments, asset management, and residential-commercial projects.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cuatro Agency</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'وكالة متخصصة في التسويق الرقمي، صناعة المحتوى وإدارة الحملات.' : 'Specialized agency in digital marketing, content creation, and campaign management.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QQQ Media</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'إنتاج الإعلامي المخصص، البرامج الإذاعية والتلفزيونية ومنصات البث.' : 'Custom media production, broadcasting programs, and streaming platforms.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3. سكشن مستقل: لماذا تعلن مع مجموعة QQQ */}
        <section className="space-y-8 custom-section-bg p-6 md:p-10 rounded-3xl border shadow-2xl pb-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {lang === 'ar' ? 'لماذا تعلن مع مجموعة QQQ؟' : 'Why Advertise with QQQ Group?'}
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">
              {lang === 'ar' ? 'نصل بعلامتك التجارية إلى الجمهور المستهدف بأعلى درجات التأثير والاحترافية' : 'We reach your target audience with the highest standards of impact and professionalism'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{lang === 'ar' ? 'زيادة المبيعات والانتشار' : 'Sales & Reach Growth'}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'ربط الإعلان بمسار شراء مباشر عبر التطبيقات أو زيارات الفروع لزيادة العائد على الاستثمار.' : 'Connecting ads to direct purchasing paths via apps or store visits to boost ROI.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{lang === 'ar' ? 'إنتاج إعلامي احترافي' : 'Professional Production'}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'فريق متخصص لتصوير وإخراج وتصميم المواد الإعلانية بأعلى معايير الجودة العالمية.' : 'Dedicated team for filming, directing, and designing ad materials at global quality standards.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{lang === 'ar' ? 'ثقة وتأثير حقيقي' : 'Trust & Real Impact'}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'بناء مصداقية عالية لعلامتك التجارية عبر ترشيحات مبتكرة وسلطة مؤثر في سوق التجارة.' : 'Building high credibility for your brand through innovative recommendations and market authority.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl custom-card-bg border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{lang === 'ar' ? 'وصول مباشر ومضمون' : 'Direct Guaranteed Reach'}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {lang === 'ar' ? 'تغطيات تصل فورياً لمئات الآلاف من المتابعين المهتمين والنشطين في قطر والخارج.' : 'Coverages reaching instantly hundreds of thousands of active interested followers in Qatar and abroad.'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}