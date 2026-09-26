'use client';

import React, { useState, useEffect } from 'react';
import {  
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Globe, 
  Search,
  X,
  Loader2,
  ExternalLink,
  Mail,
  Send,
  Building2,
  TrendingUp,
  Megaphone,
  Eye,
  Users,
  Target,
  Award,
  Play
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

// الأيقونات الخاصة بالسوشيال ميديا
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.92a6.34 6.34 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.28a8.16 8.16 0 0 0 4.77 1.52V7.34a4.85 4.85 0 0 1-1-.65z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c-3.204 0-5.8 2.338-5.8 5.219 0 .802.203 1.57.574 2.274-.633.272-1.385.748-1.543 1.531-.082.408.06.828.37 1.111.391.357 1.002.43 1.504.484.1.28.214.56.342.833-.861.436-1.956.883-2.335 1.777-.281.662-.058 1.455.517 1.912.637.507 1.464.671 2.247.781.332.607 1.396 1.722 4.124 1.722 2.727 0 3.792-1.115 4.124-1.722.783-.11 1.61-.274 2.247-.781.575-.457.798-1.25.517-1.912-.379-.894-1.474-1.341-2.335-1.777.128-.273.242-.553.342-.833.502-.054 1.113-.127 1.504-.484.31-.283.452-.703.37-1.111-.158-.783-.91-1.259-1.543-1.531.371-.704.574-1.472.574-2.274 0-2.881-2.596-5.219-5.8-5.219z" />
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export default function Home() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [contactForm, setContactForm] = useState({ name: '', contact: '', message: '' });
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const videoSources = [
    '/videos/clip1.mp4',
    '/videos/clip2.mp4',
    '/videos/clip3.mp4',
  ];

  const parseLocations = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) {
      return input
        .flatMap(item => String(item).split(/,|،/))
        .map(s => s.replace(/[\[\]'"]/g, '').trim())
        .filter(Boolean);
    }
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed
            .flatMap(item => String(item).split(/,|،/))
            .map(s => s.replace(/[\[\]'"]/g, '').trim())
            .filter(Boolean);
        }
      } catch (e) {}

      return input
        .replace(/[\[\]'"]/g, '')
        .split(/,|،/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (settingsData) {
          setSiteSettings(settingsData);
        }

        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          const formattedBrands: Brand[] = data.map((b) => {
            const locAr = parseLocations(b.locations_ar || b.branches || b.locations);
            const locEnRaw = parseLocations(b.locations_en || b.branches_en);

            const finalLocAr = locAr.length > 0 ? locAr : ['الدوحة'];
            const finalLocEn = locEnRaw.length > 0 ? locEnRaw : finalLocAr;

            return {
              id: b.id,
              name: b.name_en || b.name || '',
              arabicName: b.arabic_name || b.arabicName || b.name_ar || b.name || '',
              category: b.category || 'fastfood',
              handle: b.handle || '@brand',
              logo: b.logo || '/logos/placeholder.png',
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
          setBrands(formattedBrands);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [videoSources.length]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
        setContactForm({ name: '', contact: '', message: '' });
      } else {
        alert(lang === 'ar' ? 'حدث خطأ أثناء الإرسال، حاول مرة أخرى.' : 'Error sending message, please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(lang === 'ar' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.');
    } finally {
      setIsSendingMessage(false);
    }
  };

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
      subtitle: siteSettings?.header_subtitle_ar || 'المنصة الرقمية الموحدة لاستكشاف وإدارة براندات ومشاريع مجموعة QQQ في قطر.',
      title: siteSettings?.header_title_ar || 'عبدالله الغافري',
      
      // Stats Section
      statsTitle: 'أرقام ونسب الوصول',
      statsSub: 'قوة التأثير والانتشار الشامل عبر مختلف المنصات الرقمية',
      
      // Group Entities
      entitiesTitle: 'شركات ومؤسسات المجموعة',
      entitiesSub: 'منظومة متكاملة من الخدمات الإعلامية والاستثمارية والإبداعية',

      // Why Advertise
      whyTitle: 'لماذا تعلن مع مجموعة QQQ؟',
      whySub: 'نصل بعلامتك التجارية إلى الجمهور المستهدف بأعلى درجات التأثير والاحترافية',

      // Campaigns Showcase
      campaignsTitle: 'معرض التغطيات والحملات',
      campaignsSub: 'لقطات من أحدث الحملات والتغطيات الإعلانية والفعاليات',

      // Brands Section
      brandsHeading: 'المشاريع والعلامات التجارية',
      brandsSub: 'تصفح المطاعم والكافيهات والمتاجر المباشرة',
      brandsCount: 'علامة تجارية',
      locationsLabel: 'الفروع والتواجد:',
      orderBtn: 'التفاصيل والطلب',
      searchPlaceholder: 'ابحث عن براند أو مطعم...',
      noResults: 'لا توجد نتائج تطابق بحثك',
      orderModalTitle: 'تفاصيل البراند وروابط الطلب المباشر',
      noDeliveryAvailable: 'لا تتوفر روابط توصيل حالياً لهذا البراند.',
      quickLinks: 'روابط سريعة',
      contactUs: 'تواصل معنا',
      rightsReserved: 'جميع الحقوق محفوظة.',
      namePlaceholder: 'الاسم الكامل',
      contactPlaceholder: 'البريد الإلكتروني أو رقم الهاتف',
      detailsPlaceholder: 'شرح التفاصيل أو الاستفسار...',
      sendBtn: 'إرسال الرسالة',
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
      subtitle: siteSettings?.header_subtitle_en || 'The unified digital platform to explore QQQ Group brands and ventures in Qatar.',
      title: siteSettings?.header_title_en || 'Abdulla AlGhafri',

      // Stats Section
      statsTitle: 'Reach & Impact Numbers',
      statsSub: 'Unrivaled presence and audience engagement across digital platforms',

      // Group Entities
      entitiesTitle: 'Group Entities & Companies',
      entitiesSub: 'An integrated ecosystem for media, investment, and creative solutions',

      // Why Advertise
      whyTitle: 'Why Advertise With QQQ Group?',
      whySub: 'We connect your brand with targeted audiences through high-impact storytelling',

      // Campaigns Showcase
      campaignsTitle: 'Campaigns & Coverage Showcase',
      campaignsSub: 'Highlights from recent brand campaigns and high-profile events',

      // Brands Section
      brandsHeading: 'Projects & Brands',
      brandsSub: 'Explore restaurants, cafes, and direct stores',
      brandsCount: 'Brands',
      locationsLabel: 'Locations:',
      orderBtn: 'Details & Order',
      searchPlaceholder: 'Search for a brand or restaurant...',
      noResults: 'No brands match your search',
      orderModalTitle: 'Brand Details & Order Links',
      noDeliveryAvailable: 'No delivery links currently available for this brand.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rightsReserved: 'All rights reserved.',
      namePlaceholder: 'Full Name',
      contactPlaceholder: 'Email or Phone Number',
      detailsPlaceholder: 'Message or Inquiry Details...',
      sendBtn: 'Send Message',
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

  // بيانات إحصائيات الانتشار
  const statsList = [
    { labelAr: 'متابعي سناب شات', labelEn: 'Snapchat Followers', value: '+3.8M', icon: SnapchatIcon, color: 'text-yellow-400', border: 'border-yellow-400/30' },
    { labelAr: 'متابعي إنستغرام', labelEn: 'Instagram Followers', value: '+2.5M', icon: InstagramIcon, color: 'text-pink-500', border: 'border-pink-500/30' },
    { labelAr: 'مشتركي يوتيوب', labelEn: 'YouTube Subscribers', value: '+4.5M', icon: YoutubeIcon, color: 'text-red-500', border: 'border-red-500/30' },
    { labelAr: 'مشاهدات شهرية', labelEn: 'Monthly Views', value: '+100M', icon: Eye, color: 'text-amber-400', border: 'border-amber-400/30' }
  ];

  // بيانات شركات المجموعة
  const groupEntities = [
    {
      titleAr: 'QQQ Media',
      titleEn: 'QQQ Media',
      descAr: 'الذراع الإعلامي المتخصص في إنتاج المحتوى، إدارة الحملات الإعلانية، وصناعة الهوية.',
      descEn: 'Media arm specialized in content production, campaign management, and branding.',
      icon: Megaphone,
      badge: 'Media & Production'
    },
    {
      titleAr: 'Cuatro Agency',
      titleEn: 'Cuatro Agency',
      descAr: 'وكالة متخصصة في التصوير الاحترافي، تصميم وتطوير المواقع الإلكترونية، والحلول الرقمية.',
      descEn: 'Specialized agency for photography, web design & development, and digital solutions.',
      icon: Building2,
      badge: 'Digital & Agency'
    },
    {
      titleAr: 'QQQ Real Estate',
      titleEn: 'QQQ Real Estate',
      descAr: 'استشارات وتطوير عقاري وإدارة الأصول في المواقع الاستراتيجية.',
      descEn: 'Real estate advisory, development, and asset management in prime locations.',
      icon: Building2,
      badge: 'Real Estate'
    },
    {
      titleAr: 'QQQ Hospitality',
      titleEn: 'QQQ Hospitality',
      descAr: 'إدارة وتطوير سلاسل المطاعم والكافيهات وتجارب الضيافة المبتكرة.',
      descEn: 'Management and expansion of F&B chains and innovative dining experiences.',
      icon: ShoppingBag,
      badge: 'F&B & Hospitality'
    }
  ];

  // مميزات الإعلان مع QQQ
  const adBenefits = [
    {
      titleAr: 'وصول مباشر ومضمون',
      titleEn: 'Direct & Guaranteed Reach',
      descAr: 'تغطيات تصل فورياً لمئات الآلاف من المتابعين المهتمين والمتفاعلين في قطر والخليج.',
      descEn: 'Instant coverage reaching hundreds of thousands of engaged followers in Qatar and the Gulf.',
      icon: Target
    },
    {
      titleAr: 'ثقة وتأثير حقيقي',
      titleEn: 'High Trust & Authority',
      descAr: 'بناء مصداقية عالية لعلامتك التجارية عبر توصيات مباشرة وصادقة تؤثر في سلوك الشراء.',
      descEn: 'Building high credibility through direct, authentic endorsements that drive consumer behavior.',
      icon: Award
    },
    {
      titleAr: 'إنتاج إعلامي احترافي',
      titleEn: 'Professional Production',
      descAr: 'فريق متخصص لتصوير وإخراج وتصميم المواد الإعلانية بأعلى معايير الجودة العالمية.',
      descEn: 'A dedicated team to shoot, direct, and design marketing assets with international standards.',
      icon: TrendingUp
    },
    {
      titleAr: 'زيادة المبيعات والانتشار',
      titleEn: 'Sales & Growth Boost',
      descAr: 'ربط الإعلان بمسار شراء مباشر عبر التطبيقات أو زيارات الفروع لزيادة العائد على الاستثمار.',
      descEn: 'Connecting ads with direct order links and branch visits to maximize your ROI.',
      icon: Users
    }
  ];

  // معرض الحملات الإعلانية
  const campaignHighlights = [
    { titleAr: 'افتتاح براند جيل', titleEn: 'GEL Brand Launch', tag: 'Streetwear & Fashion', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' },
    { titleAr: 'تغطيات الضيافة الفاخرة', titleEn: 'Luxury F&B Campaigns', tag: 'Restaurants & Cafes', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' },
    { titleAr: 'الحملات الرقمية والتطبيقات', titleEn: 'App & Digital Campaigns', tag: 'Tech & Services', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' }
  ];

  const instagramUrl = siteSettings?.instagram_url || '#';
  const tiktokUrl = siteSettings?.tiktok_url || '#';
  const twitterUrl = siteSettings?.twitter_url || '#';
  const youtubeUrl = siteSettings?.youtube_url || '#';
  const emailUrl = siteSettings?.email_url ? `mailto:${siteSettings.email_url}` : '#';
  const whatsappUrl = siteSettings?.whatsapp_url ? `https://wa.me/${siteSettings.whatsapp_url.replace(/[^0-9]/g, '')}` : '#';

  return (
    <main className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>


{/* HEADER WITH PROMINENT & HIGHER QQQ BRAND */}
      <header className="relative w-full min-h-[580px] sm:min-h-[620px] lg:h-[85vh] overflow-hidden flex items-center justify-center text-white py-12 sm:py-0 bg-neutral-950 border-b border-white/10">

        {/* TOP NAVIGATION BAR */}
        <div className="absolute top-4 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4" dir="ltr">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold border border-white/20 bg-neutral-900/80 hover:bg-neutral-800 text-amber-400 backdrop-blur-md transition-all duration-300 active:scale-95 shrink-0 whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Empty spacer to balance flex alignment */}
          <div className="w-10"></div>

          {/* Right Action: Ad Booking Form */}
          <div className="shrink-0 flex items-center">
            <AdBookingForm lang={lang} />
          </div>
        </div>

        {/* BACKGROUND GRADIENT & AMBIENT GLOW ORBS */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-[#121212]" />
        
        {/* Ambient Glow Orb 1 (Top Left) */}
        <div className="absolute -top-20 -left-20 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-500/[0.07] blur-[140px] rounded-full pointer-events-none z-10" />

        {/* Ambient Glow Orb 2 (Bottom Right) */}
        <div className="absolute -bottom-20 -right-20 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-600/[0.05] blur-[140px] rounded-full pointer-events-none z-10" />

        {/* Subtle Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-10" />

        {/* HERO CONTENT */}
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center pt-10 sm:pt-6">
          
          {/* 1. LARGER & HIGHER QQQ BRAND ELEMENT */}
          <div className="mb-4 sm:mb-5 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/50 to-yellow-300/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-90 transition duration-500"></div>
            <div className="relative px-8 py-2.5 sm:py-3 rounded-2xl border border-amber-400/60 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl sm:text-4xl font-black tracking-[0.25em] text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)]">QQQ</span>
            </div>
          </div>

          {/* 2. NAME & SUBTITLE */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wide mb-3 text-white drop-shadow-md">
            {t.title}
          </h1>
          
          <p className="text-amber-400 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider mb-3 sm:mb-4 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> A. ALGHAFRI | QQQ GROUP
          </p>

          <p className="max-w-xl text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-light mb-5">
            {t.subtitle}
          </p>

          {/* 3. EXTENDED SOCIAL MEDIA LINKS BAR (7 Channels) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-5 z-30 max-w-2xl">
            
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            {/* Twitter / X */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="Twitter / X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.54z"/></svg>
            </a>
            
            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>

            {/* Email */}
            <a 
              href="mailto:info@qqq.com"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-400/50 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-all duration-300 shadow-lg hover:scale-110"
              title="Email"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>

          </div>

          {/* 4. STATS COUNTER BAR */}
          <div className="flex items-center justify-around w-full max-w-sm sm:max-w-lg bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 my-1 text-white shadow-xl">
            <div className="text-center px-1 sm:px-2">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{brands.length || 5}</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">{t.brandsCount}</div>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-neutral-800"></div>

            <div className="text-center px-1 sm:px-2">
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold">
                <span>+2.5M</span>
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">Instagram</div>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-neutral-800"></div>

            <div className="text-center px-1 sm:px-2">
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold">
                <span>+4.5M</span>
                <YoutubeIcon className="w-4 h-4 text-red-600 shrink-0" />
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 sm:mt-1">YouTube</div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#121212] to-transparent z-20 pointer-events-none" />
      </header>

      
      {/* STATS COUNTER SECTION (قسم إحصائيات وأرقام الانتشار) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.statsTitle}</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">{t.statsSub}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {statsList.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div 
                key={idx} 
                className={`bg-neutral-900/80 border ${stat.border} rounded-2xl p-5 text-center backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl flex flex-col items-center justify-center`}
              >
                <div className="p-3 rounded-xl bg-neutral-800/80 mb-3">
                  <IconComp className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                  {lang === 'ar' ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GROUP ENTITIES SECTION (قسم شركات المجموعة) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-white/10 bg-neutral-900/40 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.entitiesTitle}</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">{t.entitiesSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {groupEntities.map((entity, idx) => {
              const IconComp = entity.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-neutral-800/60 border border-white/10 hover:border-amber-400/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                        {entity.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {lang === 'ar' ? entity.titleAr : entity.titleEn}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {lang === 'ar' ? entity.descAr : entity.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-neutral-900/60 backdrop-blur-md shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t.brandsHeading}</h2>
              <p className="text-xs text-neutral-400 mt-1">{t.brandsSub}</p>
            </div>

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
              <p className="text-sm font-medium">جاري تحميل البيانات...</p>
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBrands.map(brand => {
                const currentLocations = lang === 'ar' ? brand.locationsAr : brand.locationsEn;
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
                        href={`https://instagram.com/${brand.handle.replace('@', '')}`}
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

      {/* WHY ADVERTISE WITH US SECTION (مميزات ومنافع الإعلان) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.whyTitle}</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">{t.whySub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {adBenefits.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {lang === 'ar' ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CAMPAIGNS SHOWCASE SECTION (معرض التغطيات والحملات) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-white/10 bg-neutral-900/50 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.campaignsTitle}</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">{t.campaignsSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaignHighlights.map((campaign, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-800 h-64 shadow-xl"
              >
                <img 
                  src={campaign.image} 
                  alt={campaign.titleAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {campaign.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {lang === 'ar' ? campaign.titleAr : campaign.titleEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{lang === 'ar' ? 'مشاهدة التغطية' : 'Watch Coverage'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE BRAND MODAL (النافذة التفاعلية للبراندات) */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-6 max-w-md w-full relative shadow-2xl overflow-hidden">
            
            <button 
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 pt-2">
              <div className="w-20 h-20 mx-auto rounded-2xl border border-amber-400/30 bg-neutral-950 p-2 mb-3 shadow-xl flex items-center justify-center">
                <img 
                  src={selectedBrand.logo} 
                  alt={selectedBrand.name} 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'ar' ? (selectedBrand.arabicName || selectedBrand.name) : selectedBrand.name}
              </h3>
              <p className="text-xs text-amber-400 font-medium mt-1">{selectedBrand.handle}</p>
            </div>

            {/* قسم الفروع والمواقع */}
            <div className="mb-6 bg-neutral-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'الفروع المتاحة:' : 'Available Branches:'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(lang === 'ar' ? selectedBrand.locationsAr : selectedBrand.locationsEn).map((loc, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 border border-white/10 text-neutral-200 font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* قسم تطبيقات التوصيل المباشر */}
            <div>
              <p className="text-xs font-bold text-neutral-400 mb-3 px-1">{t.orderModalTitle}</p>
              <div className="space-y-2.5">
                {selectedBrand.deliveryPlatforms && selectedBrand.deliveryPlatforms.length > 0 ? (
                  selectedBrand.deliveryPlatforms.map((platform, i) => (
                    <a
                      key={i}
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-neutral-800/90 transition-all duration-300 ${platform.bgColor} group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 p-1 flex items-center justify-center shrink-0">
                          <img 
                            src={platform.logo} 
                            alt={platform.name} 
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {lang === 'ar' ? platform.name : platform.nameEn}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                    </a>
                  ))
                ) : (
                  <p className="text-center text-xs text-neutral-500 py-4">{t.noDeliveryAvailable}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-neutral-950 text-neutral-300 pt-12 sm:pt-16 pb-8 border-t border-white/10 font-sans mt-12 sm:mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            
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

                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-light max-w-md">
                  {lang === 'ar'
                    ? 'المظلة الاستثمارية الموحدة لجميع علاماتنا التجارية والمبادرات الرقمية والترفيهية في دولة قطر والخليج.'
                    : 'The unified investment umbrella for all our commercial brands, digital initiatives, and hospitality ventures in Qatar and the Gulf.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <a href={instagramUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 transition-colors">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a href={tiktokUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 transition-colors">
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                  <a href={twitterUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 transition-colors">
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  <a href={youtubeUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-red-500 transition-colors">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                  <a href={emailUrl} className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-amber-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-green-400 transition-colors">
                     <WhatsappIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold text-white mb-4 border-b border-amber-400/30 pb-2 inline-block">
                {t.quickLinks}
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                {t.filters.map(item => (
                  <li key={item.id}>
                    <button 
                      onClick={() => {
                        setActiveFilter(item.id);
                        window.scrollTo({ top: 1200, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <h4 className="text-sm font-bold text-white mb-4 border-b border-amber-400/30 pb-2 inline-block">
                {t.contactUs}
              </h4>
              <form onSubmit={handleSendMessage} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder={t.contactPlaceholder}
                  value={contactForm.contact}
                  onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <textarea
                  required
                  rows={3}
                  placeholder={t.detailsPlaceholder}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSendingMessage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.sendBtn}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          <div className="pt-6 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} QQQ Group. {t.rightsReserved}</p>
            <p className="text-[11px] text-neutral-600">Qatar • Doha</p>
          </div>
        </div>
      </footer>

    </main>
  );
}