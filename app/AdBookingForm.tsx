'use client';
import { useState } from 'react';

interface AdBookingFormProps {
  lang?: 'ar' | 'en';
}

export default function AdBookingForm({ lang = 'ar' }: AdBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    details: '',
  });

  const isAr = lang === 'ar';

  const t = {
    button: isAr ? 'حجز دعاية / إعلان' : 'Book an Ad',
    title: isAr ? 'حجز موعد دعاية' : 'Book an Ad Slot',
    subtitle: isAr 
      ? 'أدخل تفاصيل مشروعك وسيتم مراجعة الطلب والرد ببيانات الدفع.' 
      : 'Submit your project details for review and payment link.',
    nameLabel: isAr ? 'اسمك / اسم الشركة' : 'Name / Company',
    namePlaceholder: isAr ? 'مثال : شركة QQQ ' : 'Example: QQQ Company',
    emailLabel: isAr ? 'البريد الإلكتروني' : 'Email Address',
    phoneLabel: isAr ? 'رقم الواتساب' : 'WhatsApp Number',
    dateLabel: isAr ? 'التاريخ المفضل' : 'Preferred Date',
    timeLabel: isAr ? 'الوقت المفضل' : 'Preferred Time',
    detailsLabel: isAr ? 'تفاصيل الدعاية والمشروع' : 'Project Details',
    detailsPlaceholder: isAr 
      ? 'اكتب نبذة عن مشروعك ونوع الدعاية المطلوبة...' 
      : 'Describe your brand and required promotion type...',
    submitBtn: isAr ? 'إرسال الطلب للمراجعة' : 'Submit Request',
    sending: isAr ? 'جاري الإرسال...' : 'Sending...',
    success: isAr 
      ? 'تم إرسال طلبك بنجاح! سيتم مراجعته والتواصل معك قريباً.' 
      : 'Request sent successfully! We will contact you soon.',
    error: isAr ? 'حدث خطأ، يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/book-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(t.success);
        setIsOpen(false);
      } else {
        alert(t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-semibold text-amber-400 border border-amber-400/40 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300 shadow-sm hover:shadow-amber-400/20 active:scale-95 flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        {t.button}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white ${isAr ? 'text-right dir-rtl' : 'text-left dir-ltr'}`}>
            
            <button
              onClick={() => setIsOpen(false)}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} text-neutral-400 hover:text-white text-xl font-bold p-1 rounded-lg transition`}
            >
              ✕
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-400">{t.title}</h3>
              <p className="text-sm text-neutral-400 mt-1">{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+974 5000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">{t.dateLabel}</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition [color-scheme:dark]"
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">{t.timeLabel}</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition [color-scheme:dark]"
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">{t.detailsLabel}</label>
                <textarea
                  rows={3}
                  placeholder={t.detailsPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 font-bold text-black rounded-xl shadow-lg transition duration-200 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? t.sending : t.submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}