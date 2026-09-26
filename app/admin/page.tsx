'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  RefreshCw, 
  ArrowLeft, 
  Settings, 
  Building2, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Lock, 
  LogOut,
  Search,
  Filter,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Brand {
  id?: number;
  name: string;
  arabic_name: string;
  category: string;
  handle: string;
  logo: string;
  type_ar: string;
  type_en: string;
  locations_ar: string[];
  locations_en: string[];
  snoonu_url: string;
  talabat_url: string;
  rafeeq_url: string;
}

interface SiteSettings {
  header_video_url: string;
  header_title_ar: string;
  header_title_en: string;
  header_subtitle_ar: string;
  header_subtitle_en: string;
  footer_text_ar: string;
  footer_text_en: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  youtube_url: string;
  snapchat_url: string;
  whatsapp_url: string;
  email_url: string;
  facebook_url: string; 
}
interface AdRequest {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  ad_date: string;
  ad_time: string;
  project_details: string;
  created_at: string;
  status?: string;
}

interface ContactMessage {
  id: number;
  name: string;
  contact: string;
  message: string;
  created_at: string;
  status?: string;
}

export default function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogoIndex, setUploadingLogoIndex] = useState<number | null>(null);

  // حالة البحث والفلترة
  const [adSearch, setAdSearch] = useState('');
  const [adFilterStatus, setAdFilterStatus] = useState('all');

  const [msgSearch, setMsgSearch] = useState('');
  const [msgFilterStatus, setMsgFilterStatus] = useState('all');

const [settings, setSettings] = useState<SiteSettings>({
    header_video_url: '',
    header_title_ar: '',
    header_title_en: '',
    header_subtitle_ar: '',
    header_subtitle_en: '',
    footer_text_ar: '',
    footer_text_en: '',
    instagram_url: '',
    twitter_url: '',
    tiktok_url: '',
    youtube_url: '',
    snapchat_url: '',
    whatsapp_url: '',
    email_url: '',
    facebook_url: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoginLoading(false);

    if (error) {
      alert('خطأ في تسجيل الدخول: البريد أو كلمة المرور غير صحيحة.');
    } else {
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const fetchData = async () => {
    setLoading(true);
    
    const { data: brandsData } = await supabase.from('brands').select('*').order('id', { ascending: true });
    if (brandsData) setBrands(brandsData);

    const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (settingsData) setSettings(settingsData);

    const { data: requestsData } = await supabase.from('ad_requests').select('*').order('created_at', { ascending: false });
    if (requestsData) setAdRequests(requestsData);

    const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (messagesData) setContactMessages(messagesData);

    setLoading(false);
  };

  const updateStatus = async (id: string | number, table: 'ad_requests' | 'messages', newStatus: string) => {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      if (table === 'ad_requests') {
        setAdRequests(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } else {
        setContactMessages(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } else {
      console.error('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleContactAction = (id: string | number, table: 'ad_requests' | 'messages', currentStatus?: string) => {
    if (!currentStatus || currentStatus === 'new') {
      updateStatus(id, table, 'contacted');
    }
  };

  const handleInputChange = (index: number, field: keyof Brand, value: any) => {
    const updated = [...brands];
    updated[index] = { ...updated[index], [field]: value };
    setBrands(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      setUploadingLogoIndex(index);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
      handleInputChange(index, 'logo', data.publicUrl);
    } catch (err: any) {
      alert('خطأ في رفع الصورة تأكد من إعدادات الـ Supabase Storage');
    } finally {
      setUploadingLogoIndex(null);
    }
  };

  const saveBrand = async (index: number) => {
    const brand = brands[index];
    setSavingId(brand.id || index);

    if (brand.id) {
      const { error } = await supabase.from('brands').update(brand).eq('id', brand.id);
      if (error) alert('حدث خطأ أثناء الحفظ');
      else alert('تم حفظ التغييرات بنجاح!');
    } else {
      const { data, error } = await supabase.from('brands').insert([brand]).select();
      if (!error && data) {
        const updated = [...brands];
        updated[index] = data[0];
        setBrands(updated);
        alert('تمت إضافة البراند بنجاح!');
      } else {
        alert('حدث خطأ أثناء إضافة البراند');
      }
    }
    setSavingId(null);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings });
    setSavingSettings(false);

    if (error) {
      alert('حدث خطأ أثناء حفظ الإعدادات: ' + error.message);
    } else {
      alert('تم حفظ إعدادات الموقع بالكامل بنجاح!');
    }
  };

  const deleteBrand = async (id?: number, index?: number) => {
    if (!confirm('هل أنت تأكد من إزالة هذا البراند؟')) return;
    if (id) {
      await supabase.from('brands').delete().eq('id', id);
    }
    setBrands(brands.filter((_, i) => i !== index));
  };

  const deleteAdRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    const { error } = await supabase.from('ad_requests').delete().eq('id', id);
    if (!error) {
      setAdRequests(adRequests.filter(req => req.id !== id));
    } else {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const addNewBrand = () => {
    const newBrand: Brand = {
      name: 'New Brand',
      arabic_name: 'براند جديد',
      category: 'fastfood',
      handle: '@brand',
      logo: '/logos/placeholder.png',
      type_ar: 'مطعم',
      type_en: 'Restaurant',
      locations_ar: ['الدوحة'],
      locations_en: ['Doha'],
      snoonu_url: '',
      talabat_url: '',
      rafeeq_url: '',
    };
    setBrands([...brands, newBrand]);
  };

  const filteredAdRequests = adRequests.filter(req => {
    const matchesSearch = 
      (req.full_name || '').toLowerCase().includes(adSearch.toLowerCase()) ||
      (req.email || '').toLowerCase().includes(adSearch.toLowerCase()) ||
      (req.whatsapp || '').includes(adSearch) ||
      (req.project_details || '').toLowerCase().includes(adSearch.toLowerCase());

    const matchesStatus = 
      adFilterStatus === 'all' || 
      (adFilterStatus === 'new' && (!req.status || req.status === 'new')) ||
      req.status === adFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredContactMessages = contactMessages.filter(msg => {
    const matchesSearch = 
      (msg.name || '').toLowerCase().includes(msgSearch.toLowerCase()) ||
      (msg.contact || '').toLowerCase().includes(msgSearch.toLowerCase()) ||
      (msg.message || '').toLowerCase().includes(msgSearch.toLowerCase());

    const matchesStatus = 
      msgFilterStatus === 'all' || 
      (msgFilterStatus === 'new' && (!msg.status || msg.status === 'new')) ||
      msg.status === msgFilterStatus;

    return matchesSearch && matchesStatus;
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 dir-rtl font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-white mb-2">تسجيل دخول لوحة التحكم</h1>
            <p className="text-xs text-neutral-400">أدخل بيانات الحساب المعتمد للوصول إلى لوحة الإدارة.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-right">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="admin@qqq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors dir-ltr text-right"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">كلمة المرور</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors dir-ltr text-right"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-amber-400 text-black font-bold rounded-2xl text-sm hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10 cursor-pointer mt-2"
            >
              {loginLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5">
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              ← العودة إلى الصفحة الرئيسية للموقع
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-3 dir-rtl font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm text-neutral-400">جاري تحميل بيانات لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* شريط العنوان العلوي */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-400/50 text-neutral-400 hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
              <h1 className="text-2xl font-bold text-white">لوحة إدارة مجموعة QQQ</h1>
            </div>
            <p className="text-xs text-neutral-400 mr-11">إدارة البراندات، الحجوزات الإعلانية، وإعدادات الهيدر والفوتر للموقع.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>

            <button
              onClick={addNewBrand}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/10"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة براند جديد</span>
            </button>
          </div>
        </div>

        {/* 📋 طلبات الإعلانات */}
        <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <MessageSquare className="w-5 h-5" />
              <h2 className="font-bold text-base text-white">طلبات حجز المساحات الإعلانية الواردة</h2>
            </div>
            <span className="px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full text-xs font-bold">
              {filteredAdRequests.length} / {adRequests.length} طلبات
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-950 p-3 rounded-xl border border-white/5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم، هاتف أو إيميل..."
                value={adSearch}
                onChange={(e) => setAdSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new', label: '🟢 جديد' },
                { id: 'contacted', label: '🔵 تم الرد' },
                { id: 'completed', label: '⚪ مكتمل' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAdFilterStatus(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    adFilterStatus === tab.id 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAdRequests.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-6">لا توجد طلبات حجز مطابقة للبحث أو الفلتر.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAdRequests.map((req) => (
                <div key={req.id} className="bg-neutral-950 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">{req.full_name}</span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-white/5">
                        {new Date(req.created_at).toLocaleString('ar-QA')}
                      </span>

                      <select
                        value={req.status || 'new'}
                        onChange={(e) => updateStatus(req.id, 'ad_requests', e.target.value)}
                        className={`px-3 py-1 text-xs rounded-full border font-bold cursor-pointer outline-none transition-colors ${
                          req.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/40'
                            : req.status === 'completed'
                            ? 'bg-zinc-700/50 text-zinc-300 border-zinc-600'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        <option value="new" className="bg-zinc-900 text-emerald-400">🟢 جديد</option>
                        <option value="contacted" className="bg-zinc-900 text-blue-400">🔵 تم الرد</option>
                        <option value="completed" className="bg-zinc-900 text-zinc-400">⚪ مكتمل</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span className="dir-ltr">{req.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="dir-ltr">{req.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{req.ad_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>{req.ad_time}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 bg-neutral-900/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-amber-400 font-bold">تفاصيل المشروع: </span>
                      {req.project_details}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <a
                      href={`https://wa.me/${req.whatsapp?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً بك ${req.full_name}، بخصوص طلبك لحجز مساحة إعلانية في مجموعة QQQ...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleContactAction(req.id, 'ad_requests', req.status)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>رد واتساب</span>
                    </a>

                    <a
                      href={`mailto:${req.email}?subject=${encodeURIComponent('بخصوص طلب حجز مساحة إعلانية - مجموعة QQQ')}&body=${encodeURIComponent(`مرحباً ${req.full_name},\n\nشكراً لتواصلك معنا بخصوص طلب إعلانك بمشروع QQQ.\n\nتحياتنا،`)}`}
                      onClick={() => handleContactAction(req.id, 'ad_requests', req.status)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>إرسال إيميل</span>
                    </a>

                    <button
                      onClick={() => deleteAdRequest(req.id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📬 رسائل نموذج "اتصل معنا" */}
        <div className="bg-neutral-900 border border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Mail className="w-5 h-5" />
              <h2 className="font-bold text-base text-white">رسائل "اتصل معنا" الواردة</h2>
            </div>
            <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full text-xs font-bold">
              {filteredContactMessages.length} / {contactMessages.length} رسائل
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-950 p-3 rounded-xl border border-white/5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم، هاتف أو نص الرسالة..."
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new', label: '🟢 جديد' },
                { id: 'contacted', label: '🔵 تم الرد' },
                { id: 'completed', label: '⚪ مكتمل' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMsgFilterStatus(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    msgFilterStatus === tab.id 
                      ? 'bg-cyan-400 text-black font-bold' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredContactMessages.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-6">لا توجد رسائل تواصل مطابقة للبحث أو الفلتر.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContactMessages.map((msg) => (
                <div key={msg.id} className="bg-neutral-950 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-white/5">
                        {new Date(msg.created_at).toLocaleString('ar-QA')}
                      </span>

                      <select
                        value={msg.status || 'new'}
                        onChange={(e) => updateStatus(msg.id, 'messages', e.target.value)}
                        className={`px-3 py-1 text-xs rounded-full border font-bold cursor-pointer outline-none transition-colors ${
                          msg.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/40'
                            : msg.status === 'completed'
                            ? 'bg-zinc-700/50 text-zinc-300 border-zinc-600'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        <option value="new" className="bg-zinc-900 text-emerald-400">🟢 جديد</option>
                        <option value="contacted" className="bg-zinc-900 text-blue-400">🔵 تم الرد</option>
                        <option value="completed" className="bg-zinc-900 text-zinc-400">⚪ مكتمل</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="dir-ltr">{msg.contact}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-lg border border-white/5">
                      <span className="text-cyan-400 font-bold block mb-1">الرسالة:</span>
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <a
                      href={`mailto:${msg.contact}?subject=${encodeURIComponent('الرد على استفسارك - مجموعة QQQ')}&body=${encodeURIComponent(`مرحباً ${msg.name},\n\nشكراً لتواصلك معنا.\n\nتحياتنا،`)}`}
                      onClick={() => handleContactAction(msg.id, 'messages', msg.status)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>رد عبر البريد</span>
                    </a>

                    <button
                      onClick={async () => {
                        if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
                        const { error } = await supabase.from('messages').delete().eq('id', msg.id);
                        if (!error) {
                          setContactMessages(contactMessages.filter(m => m.id !== msg.id));
                        } else {
                          alert('حدث خطأ أثناء حذف الرسالة');
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🍔 قائمة إدارة البراندات وروابط التوصيل (سنونو، طلبات، رفيق) */}
        <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Building2 className="w-5 h-5" />
              <h2 className="font-bold text-base text-white">إدارة براندات ومطاعم QQQ وروابط التوصيل</h2>
            </div>
            <button
              onClick={addNewBrand}
              className="px-3 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة براند</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {brands.map((brand, idx) => (
              <div key={brand.id || idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* الشعار والحزمة الحالية */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center p-2 group">
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(idx, e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{brand.arabic_name || brand.name}</h3>
                      <p className="text-xs text-amber-400/80 dir-ltr">{brand.handle}</p>
                    </div>
                  </div>

                  {/* معلومات البراند المباشرة */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">الاسم بالإنجليزي</label>
                      <input
                        type="text"
                        value={brand.name}
                        onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">الاسم بالعربي</label>
                      <input
                        type="text"
                        value={brand.arabic_name}
                        onChange={(e) => handleInputChange(idx, 'arabic_name', e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* تصنيف وفئة البراند */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">التصنيف (Category)</label>
                      <select
                        value={brand.category}
                        onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white focus:border-amber-400 outline-none cursor-pointer"
                      >
                        <option value="fastfood">الوجبات السريعة (Fast Food)</option>
                        <option value="sweets">الحلويات والكافيهات (Sweets & Cafes)</option>
                        <option value="services">الخدمات والشركات (Services)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">اليوزر/الهاندل (@)</label>
                      <input
                        type="text"
                        value={brand.handle}
                        onChange={(e) => handleInputChange(idx, 'handle', e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>
                  </div>

                </div>

                {/* 🛵 روابط تطبيقات التوصيل (سنونو، طلبات، رفيق) */}
                <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-emerald-400 block mb-1 font-bold">رابط سنونو (Snoonu URL)</label>
                    <input
                      type="text"
                      placeholder="https://snoonu.com/..."
                      value={brand.snoonu_url || ''}
                      onChange={(e) => handleInputChange(idx, 'snoonu_url', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-emerald-400 outline-none dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-orange-400 block mb-1 font-bold">رابط طلبات (Talabat URL)</label>
                    <input
                      type="text"
                      placeholder="https://www.talabat.com/..."
                      value={brand.talabat_url || ''}
                      onChange={(e) => handleInputChange(idx, 'talabat_url', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-orange-400 outline-none dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-400 block mb-1 font-bold">رابط رفيق (Rafeeq URL)</label>
                    <input
                      type="text"
                      placeholder="https://gorafeeq.com/..."
                      value={brand.rafeeq_url || ''}
                      onChange={(e) => handleInputChange(idx, 'rafeeq_url', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none dir-ltr"
                    />
                  </div>
                </div>

                {/* أزرار الحفظ والحذف */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => saveBrand(idx)}
                    disabled={savingId === (brand.id || idx)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingId === (brand.id || idx) ? 'جاري الحفظ...' : 'حفظ البراند'}</span>
                  </button>

                  <button
                    onClick={() => deleteBrand(brand.id, idx)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="حذف البراند"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

  {/* ⚙️ إعدادات الهيدر والفوتر ووسائل التواصل */}
        <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-amber-400 border-b border-white/5 pb-3">
            <Settings className="w-5 h-5" />
            <h2 className="font-bold text-base text-white">إعدادات الهيدر والفوتر ووسائل التواصل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] text-neutral-400 block mb-1">رابط فيديو الهيدر (Header Video URL)</label>
              <input
                type="text"
                value={settings.header_video_url || ''}
                onChange={(e) => setSettings({ ...settings, header_video_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">عنوان الهيدر (عربي)</label>
              <input
                type="text"
                value={settings.header_title_ar || ''}
                onChange={(e) => setSettings({ ...settings, header_title_ar: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Header Title (English)</label>
              <input
                type="text"
                value={settings.header_title_en || ''}
                onChange={(e) => setSettings({ ...settings, header_title_en: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">الوصف الفرعي للهيدر (عربي)</label>
              <textarea
                rows={2}
                value={settings.header_subtitle_ar || ''}
                onChange={(e) => setSettings({ ...settings, header_subtitle_ar: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Header Subtitle (English)</label>
              <textarea
                rows={2}
                value={settings.header_subtitle_en || ''}
                onChange={(e) => setSettings({ ...settings, header_subtitle_en: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            {/* روابط وسائل التواصل الاجتماعي */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط إنستغرام (Instagram URL)</label>
              <input
                type="text"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط تويتر / إكس (Twitter/X URL)</label>
              <input
                type="text"
                value={settings.twitter_url || ''}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط تيك توك (TikTok URL)</label>
              <input
                type="text"
                value={settings.tiktok_url || ''}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط يوتيوب (YouTube URL)</label>
              <input
                type="text"
                value={settings.youtube_url || ''}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط سناب شات (Snapchat URL)</label>
              <input
                type="text"
                value={settings.snapchat_url || ''}
                onChange={(e) => setSettings({ ...settings, snapchat_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط فيسبوك (Facebook URL)</label>
              <input
                type="text"
                value={settings.facebook_url || ''}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رقم واتساب الرئيسي (WhatsApp)</label>
              <input
                type="text"
                value={settings.whatsapp_url || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">البريد الإلكتروني (Email)</label>
              <input
                type="text"
                value={settings.email_url || ''}
                onChange={(e) => setSettings({ ...settings, email_url: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>
          </div>
        </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={saveSettings}
              disabled={savingSettings}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ إعدادات الموقع'}</span>
            </button>
          </div>
        </div>

      </div>
  );
}