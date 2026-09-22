'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, Upload, Trash2, Plus, RefreshCw, ArrowLeft, Settings, Building2 } from 'lucide-react';
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
}

export default function AdminPanel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogoIndex, setUploadingLogoIndex] = useState<number | null>(null);

  const [settings, setSettings] = useState<SiteSettings>({
    header_video_url: '',
    header_title_ar: '',
    header_title_en: '',
    header_subtitle_ar: '',
    header_subtitle_en: '',
    footer_text_ar: '',
    footer_text_en: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // جلب البراندات
    const { data: brandsData } = await supabase.from('brands').select('*').order('id', { ascending: true });
    if (brandsData) setBrands(brandsData);

    // جلب إعدادات الموقع
    const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (settingsData) setSettings(settingsData);

    setLoading(false);
  };

  const handleInputChange = (index: number, field: keyof Brand, value: any) => {
    const updated = [...brands];
    updated[index] = { ...updated[index], [field]: value };
    setBrands(updated);
  };

  // رفع الصورة إلى Supabase Storage
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
      alert('خطأ في رفع الصورة: تأكد من إنشاء Bucket باسم brand-assets وتجعله Public في Supabase Storage');
    } finally {
      setUploadingLogoIndex(null);
    }
  };

  // حفظ براند واحد
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

  // حفظ إعدادات الهيدر والفوتر
  const saveSettings = async () => {
    setSavingSettings(true);
    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings });
    setSavingSettings(false);

    if (error) {
      alert('حدث خطأ أثناء حفظ الإعدادات: ' + error.message);
    } else {
      alert('تم حفظ إعدادات الهيدر والفوتر بنجاح!');
    }
  };

  // حذف براند
  const deleteBrand = async (id?: number, index?: number) => {
    if (!confirm('هل أنت تأكد من إزالة هذا البراند؟')) return;
    if (id) {
      await supabase.from('brands').delete().eq('id', id);
    }
    setBrands(brands.filter((_, i) => i !== index));
  };

  // إضافة براند جديد
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
            <p className="text-xs text-neutral-400 mr-11">إدارة بيانات البراندات، الفروع، وإعدادات الهيدر والفوتر للموقع.</p>
          </div>

          <button
            onClick={addNewBrand}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/10"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة براند جديد</span>
          </button>
        </div>

        
        {/* ⚙️ قسم إعدادات الهيدر والفوتر والفيديو */}
        <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-amber-400 border-b border-white/5 pb-3">
            <Settings className="w-5 h-5" />
            <h2 className="font-bold text-base text-white">إعدادات الهيدر والفوتر (Header & Footer)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* الهيدر */}
            <div className="md:col-span-2">
              <label className="text-[11px] text-neutral-400 block mb-1">رابط فيديو الهيدر (Header Video URL)</label>
              <input
                type="text"
                value={settings.header_video_url || ''}
                onChange={(e) => setSettings({ ...settings, header_video_url: e.target.value })}
                placeholder="videos/clip1.mp4"
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

            {/* الفوتر وحقوق النشر */}
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

            {/* روابط التواصل الاجتماعي والفوتر */}
            <div className="md:col-span-2 border-t border-white/5 pt-3 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-amber-400 block mb-1">رابط إنستغرام (Instagram)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={(settings as any).instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value } as any)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                />
              </div>

              <div>
                <label className="text-[11px] text-yellow-400 block mb-1">رابط سناب شات (Snapchat)</label>
                <input
                  type="url"
                  placeholder="https://snapchat.com/add/..."
                  value={(settings as any).snapchat_url || ''}
                  onChange={(e) => setSettings({ ...settings, snapchat_url: e.target.value } as any)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                />
              </div>

              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">رابط تيك توك (TikTok)</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@..."
                  value={(settings as any).tiktok_url || ''}
                  onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value } as any)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                />
              </div>

              <div>
                <label className="text-[11px] text-sky-400 block mb-1">البريد الإلكتروني للظهور في الفوتر</label>
                <input
                  type="email"
                  placeholder="info@qqq.qa"
                  value={(settings as any).email_address || ''}
                  onChange={(e) => setSettings({ ...settings, email_address: e.target.value } as any)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-white focus:border-amber-400 outline-none dir-ltr"
                />
              </div>
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

        {/* 🏷️ قائمة البراندات */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg">قائمة البراندات والمطاعم</h2>
          </div>

          {brands.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/50 border border-white/10 rounded-2xl">
              <p className="text-neutral-400 text-sm mb-4">لا توجد براندات حالياً في قاعدة البيانات.</p>
              <button
                onClick={addNewBrand}
                className="px-4 py-2 bg-amber-400 text-black font-bold rounded-xl text-xs"
              >
                إضافة أول براند
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {brands.map((brand, index) => (
                <div key={brand.id || index} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 shadow-xl transition-all">
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* رفع وقراءة الصورة */}
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

                    {/* البيانات الأساسية */}
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
                          placeholder="ازغوى، الهلال"
                          value={Array.isArray(brand.locations_ar) ? brand.locations_ar.join(', ') : brand.locations_ar || ''}
                          onChange={(e) => handleInputChange(index, 'locations_ar', e.target.value.split(',').map(s => s.trim()))}
                          className="w-full bg-neutral-800/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">الفروع بالإنجليزي (افصل بفاصلة)</label>
                        <input
                          type="text"
                          placeholder="Izghawa, Al Hilal"
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

                    </div>

                  </div>

                  {/* روابط منصات التوصيل */}
                  <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-amber-400 font-medium block mb-1">رابط سنونو المباشر (Snoonu)</label>
                      <input
                        type="url"
                        placeholder="https://snoonu.com/merchant/..."
                        value={brand.snoonu_url || ''}
                        onChange={(e) => handleInputChange(index, 'snoonu_url', e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-neutral-300 focus:border-amber-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-orange-400 font-medium block mb-1">رابط طلبات المباشر (Talabat)</label>
                      <input
                        type="url"
                        placeholder="https://www.talabat.com/..."
                        value={brand.talabat_url || ''}
                        onChange={(e) => handleInputChange(index, 'talabat_url', e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-neutral-300 focus:border-orange-400 outline-none dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-red-400 font-medium block mb-1">رابط رفيق المباشر (Rafeeq)</label>
                      <input
                        type="url"
                        placeholder="https://www.gorafeeq.com/..."
                        value={brand.rafeeq_url || ''}
                        onChange={(e) => handleInputChange(index, 'rafeeq_url', e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2 text-xs text-neutral-300 focus:border-red-400 outline-none dir-ltr"
                      />
                    </div>
                  </div>

                  {/* أزرار الحفظ والحذف */}
                  <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => deleteBrand(brand.id, index)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>

                    <button
                      onClick={() => saveBrand(index)}
                      disabled={savingId === (brand.id || index)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingId === (brand.id || index) ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}