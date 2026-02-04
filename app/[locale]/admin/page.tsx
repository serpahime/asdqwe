import dynamic from 'next/dynamic';

interface PageProps {
  params: {
    locale: 'uk' | 'ru';
  };
}

// ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Динамически загружаем DashboardContent
// Это гарантирует, что код админки НЕ попадет в bundle магазина
const DashboardContent = dynamic(() => import('@/components/admin/DashboardContent'), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Завантаження...</div>
    </div>
  ),
  ssr: false, // Админка работает только на клиенте (localStorage)
});

// Server Component - БЕЗ "use client"
// Client Component загружается динамически
export default function AdminDashboard({ params }: PageProps) {
  return <DashboardContent />;
}
