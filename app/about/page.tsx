export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-20 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-amber-400">
          من نحن
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
          نحن المنصة الرقمية الموحدة لاستكشاف وإدارة براندات ومشاريع مجموعة QQQ في قطر والمنطقة. نسعى لتقديم تجربة فريدة ومتميزة تجمع تحت مظلتها أحدث المشاريع الابتكارية والتجارية بمعايير عالمية.
        </p>
        <div className="p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl">
          هنا يمكنك إضافة المزيد من التفاصيل حول قصة النجاح، الرؤية، والأهداف المستقبلية للمجموعة.
        </div>
      </div>
    </main>
  );
}