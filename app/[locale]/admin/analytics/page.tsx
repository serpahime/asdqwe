import dynamic from 'next/dynamic';

interface PageProps {
  params: {
    locale: 'uk' | 'ru';
  };
}

// ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Динамически загружаем AnalyticsPage
// Это гарантирует, что Recharts, date-fns и аналитика НЕ попадут в bundle магазина
const AnalyticsPage = dynamic(() => import('@/components/admin/AnalyticsPage'), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Завантаження аналітики...</div>
    </div>
  ),
  ssr: false, // Аналитика работает только на клиенте (localStorage)
});

// Server Component - БЕЗ "use client"
// Client Component загружается динамически
export default function AdminAnalyticsPage({ params }: PageProps) {
  return <AnalyticsPage />;
}
