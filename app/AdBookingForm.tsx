'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdBookingFormProps {
  lang: 'ar' | 'en';
}

export default function AdBookingForm({ lang }: AdBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // حقول النموذج
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp: '',
    ad_date: '',
    ad_time: '',
    project_details: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // تعطيل تمرير خلفية الصفحة عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('ad_requests')
      .insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          ad_date: formData.ad_date,
          ad_time: formData.ad_time,
          project_details: formData.project_details,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error('Error inserting data:', error.message);
      alert(lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'Error submitting request, please try again.');
    } else {
      alert(lang === 'ar' ? 'تم إرسال طلبك بنجاح وسيتم مراجعته قريباً!' : 'Your request has been submitted successfully!');
      // إعادة تعيين الحقول وإغلاق النافذة
      setFormData({
        full_name: '',
        email: '',
        whatsapp: '',
        ad_date: '',
        ad_time: '',
        project_details: ''
      });
      setIsOpen(false);
    }
  };

  const modalContent = isOpen ? (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* خلفية لإغلاق النافذة */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsOpen(false)} 
      />

      {/* بطاقة نموذج الحجز */}
      <div className="relative w-full max-w-lg my-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* عنوان النافذة */}
        <h2 className="text-xl font-bold text-amber-400 mb-1">
          {lang === 'ar' ? 'حجز مساحة إعلانية' : 'Book an Ad Slot'}
        </h2>
        <p className="text-xs text-neutral-400 mb-5">
          {lang === 'ar' 
            ? 'أدخل تفاصيل مشروعك للمراجعة وإرسال رابط الدفع.' 
            : 'Submit your project details for review and payment link.'}
        </p>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {lang === 'ar' ? 'الاسم / الشركة' : 'Name / Company'}
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder={lang === 'ar' ? 'مثال: شركة QQQ' : 'Example: QQQ Company'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              placeholder="+974 5000 0000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* التاريخ والوقت بتنسيق ثابت موحد لكل المتصفحات وانستغرام */}
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full">
              <label className="block text-xs font-medium text-neutral-300 mb-1 truncate">
                {lang === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
              </label>
              <input
                type="date"
                name="ad_date"
                value={formData.ad_date}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors appearance-none [color-scheme:dark]"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-medium text-neutral-300 mb-1 truncate">
                {lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}
              </label>
              <input
                type="time"
                name="ad_time"
                value={formData.ad_time}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors appearance-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
            </label>
            <textarea
              rows={3}
              name="project_details"
              value={formData.project_details}
              onChange={handleChange}
              required
              placeholder={lang === 'ar' ? 'اكتب نبذة عن الإعلان...' : 'Briefly describe your ad...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading 
              ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') 
              : (lang === 'ar' ? 'إرسال الطلب' : 'Submit Application')}
          </button>
        </form>

      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold border border-amber-400/50 bg-black/60 hover:bg-black/80 text-amber-400 backdrop-blur-md transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span>{lang === 'ar' ? 'حجز إعلان' : 'Book Ad'}</span>
      </button>

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}