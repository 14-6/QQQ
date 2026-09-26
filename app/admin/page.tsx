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
  LogOut 
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
  social_instagram: string;
  social_whatsapp: string;
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
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogoIndex, setUploadingLogoIndex] = useState<number | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const [settings, setSettings] = useState<SiteSettings>({
    header_video_url: '',
    header_title_ar: '',
    header_title_en: '',
    header_subtitle_ar: '',
    header_subtitle_en: '',
    footer_text_ar: '',
    footer_text_en: '',
    social_instagram: '',
    social_whatsapp: ''
  });

  // التحقق من حالة الجلسة عند فتح الصفحة
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
      alert('حدث خطأ أثناء تحديث الحالة');
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

  // 🔒 شاشة تسجيل الدخول الآمنة عبر Supabase Auth
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
              {adRequests.length} طلبات
            </span>
          </div>

          {adRequests.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-6">لا توجد طلبات حجز إعلانات حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {adRequests.map((req) => (
                <div key={req.id} className="bg-neutral-950 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">{req.full_name}</span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-white/5">
                        {new Date(req.created_at).toLocaleString('ar-QA')}
                      </span>

                      {/* حالة الطلب */}
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
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>رد واتساب</span>
                    </a>

                    <a
                      href={`mailto:${req.email}?subject=${encodeURIComponent('بخصوص طلب حجز مساحة إعلانية - مجموعة QQQ')}&body=${encodeURIComponent(`مرحباً ${req.full_name},\n\nشكراً لتواصلك معنا بخصوص طلب إعلانك بمشروع QQQ.\n\nتحياتنا،`)}`}
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
              {contactMessages.length} رسائل
            </span>
          </div>

          {contactMessages.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-6">لا توجد رسائل تواصل جديدة حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {contactMessages.map((msg) => (
                <div key={msg.id} className="bg-neutral-950 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-white/5">
                        {new Date(msg.created_at).toLocaleString('ar-QA')}
                      </span>

                      {/* حالة الرسالة */}
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

        {/* ⚙️ إعدادات الموقع */}
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

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط إنستغرام (عبدالله الغافري)</label>
              <input
                type="text"
                value={settings.social_instagram || ''}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رابط أو رقم واتساب (عبدالله الغافري)</label>
              <input
                type="text"
                value={settings.social_whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, social_whatsapp: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">نص الفوتر وحقوق النشر (عربي)</label>
              <input
                type="text"
                value={settings.footer_text_ar || ''}
                onChange={(e) => setSettings({ ...settings, footer_text_ar: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Footer Text & Copyright (English)</label>
              <input
                type="text"
                value={settings.footer_text_en || ''}
                onChange={(e) => setSettings({ ...settings, footer_text_en: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={saveSettings}
              disabled={savingSettings}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ إعدادات الموقع بالكامل'}</span>
            </button>
          </div>
        </div>

        {/* 🏷️ البراندات */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg">قائمة البراندات والمطاعم</h2>
          </div>

          <div className="space-y-6">
            {brands.map((brand, index) => (
              <div key={brand.id || index} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 shadow-xl transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-3 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 bg-neutral-950/60">
                    <div className="w-24 h-24 bg-black rounded-xl border border-white/10 flex items-center justify-center p-2 mb-3 relative overflow-hidden group">
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                    </div>

                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-amber-400 cursor-pointer transition-colors border border-white/5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingLogoIndex === index ? 'جاري الرفع...' : 'تغيير الشعار'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(index, e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>

                  <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الاسم بالإنجليزية</label>
                      <input
                        type="text"
                        value={brand.name || ''}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الاسم بالعربية</label>
                      <input
                        type="text"
                        value={brand.arabic_name || ''}
                        onChange={(e) => handleInputChange(index, 'arabic_name', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">المعرف (Instagram Handle)</label>
                      <input
                        type="text"
                        value={brand.handle || ''}
                        onChange={(e) => handleInputChange(index, 'handle', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الفروع بالعربي (افصل بفاصلة)</label>
                      <input
                        type="text"
                        value={Array.isArray(brand.locations_ar) ? brand.locations_ar.join(', ') : brand.locations_ar || ''}
                        onChange={(e) => handleInputChange(index, 'locations_ar', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الفروع بالإنجليزي (افصل بفاصلة)</label>
                      <input
                        type="text"
                        value={Array.isArray(brand.locations_en) ? brand.locations_en.join(', ') : brand.locations_en || ''}
                        onChange={(e) => handleInputChange(index, 'locations_en', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الفئة (Category Filter)</label>
                      <select
                        value={brand.category || 'fastfood'}
                        onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                      >
                        <option value="fastfood">مطاعم وبرجر</option>
                        <option value="cafe">كافيهات</option>
                        <option value="sweets">حلويات</option>
                        <option value="breakfast">فطور</option>
                        <option value="healthy">صحي ومجمدات</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">رابط سنونو (Snoonu URL)</label>
                      <input
                        type="text"
                        value={brand.snoonu_url || ''}
                        onChange={(e) => handleInputChange(index, 'snoonu_url', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">رابط طلبات (Talabat URL)</label>
                      <input
                        type="text"
                        value={brand.talabat_url || ''}
                        onChange={(e) => handleInputChange(index, 'talabat_url', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">رابط رفيق (Rafeeq URL)</label>
                      <input
                        type="text"
                        value={brand.rafeeq_url || ''}
                        onChange={(e) => handleInputChange(index, 'rafeeq_url', e.target.value)}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/5">
                  <button
                    onClick={() => deleteBrand(brand.id, index)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف البراند</span>
                  </button>

                  <button
                    onClick={() => saveBrand(index)}
                    disabled={savingId === (brand.id || index)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingId === (brand.id || index) ? 'جاري الحفظ...' : 'حفظ البراند'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}