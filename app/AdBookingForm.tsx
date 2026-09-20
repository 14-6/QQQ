'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AdBookingFormProps {
  lang: 'ar' | 'en';
}

export default function AdBookingForm({ lang }: AdBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر فتح النافذة */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold border border-amber-400/50 bg-black/60 hover:bg-black/80 text-amber-400 backdrop-blur-md transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span>{lang === 'ar' ? 'حجز إعلان' : 'Book Ad'}</span>
      </button>

      {/* النافذة المنبثقة - Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* خلفية الإغلاق عند النقر خارج البطاقة */}
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => setIsOpen(false)} 
          />

          {/* محتوى نموذج الحجز */}
          <div className="relative w-full max-w-lg my-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* زر الإغلاق */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
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
            <form onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  {lang === 'ar' ? 'الاسم / الشركة' : 'Name / Company'}
                </label>
                <input
                  type="text"
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
                  required
                  placeholder="+974 5000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {lang === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}
                  </label>
                  <input
                    type="time"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                </label>
                <textarea
                  rows={3}
                  placeholder={lang === 'ar' ? 'اكتب نبذة عن الإعلان...' : 'Briefly describe your ad...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-lg active:scale-98"
              >
                {lang === 'ar' ? 'إرسال الطلب' : 'Submit Application'}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}