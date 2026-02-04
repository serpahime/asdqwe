'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ExtendedOrder, getAllOrders } from '@/lib/admin/orders';
import { AnalyticsData, getFullAnalytics } from '@/lib/admin/analytics';
import { useLocale } from '@/hooks/useLocale';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';

// Динамическая загрузка таблицы заказов
const RecentOrdersTable = dynamic(
  () => import('./RecentOrdersTable'),
  { 
    ssr: false,
    loading: () => (
      <div className="card">
        <div className="h-64 bg-dark-border/20 rounded-lg animate-pulse" />
      </div>
    )
  }
);

export default function DashboardContent() {
  const locale = useLocale();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Загружаем данные на клиенте (localStorage доступен только здесь)
    const loadData = () => {
      const allOrders = getAllOrders();
      const analyticsData = getFullAnalytics(allOrders);
      setOrders(allOrders);
      setAnalytics(analyticsData);
      setLoading(false);
    };

    loadData();
    // Обновление каждые 30 секунд
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // На сервере или до монтирования показываем placeholder (одинаковый рендеринг)
  if (typeof window === 'undefined' || !mounted || loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64" suppressHydrationWarning>
        <div className="text-gray-400">{locale === 'uk' ? 'Завантаження...' : 'Загрузка...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">
          {locale === 'uk' ? 'Дашборд' : 'Дашборд'}
        </h1>
        <div className="flex items-center space-x-2">
          {(['today', 'week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-neon-cyan text-dark-bg'
                  : 'bg-dark-border text-gray-300 hover:bg-dark-card'
              }`}
            >
              {p === 'today' ? (locale === 'uk' ? 'Сьогодні' : 'Сегодня') :
               p === 'week' ? (locale === 'uk' ? 'Тиждень' : 'Неделя') :
               p === 'month' ? (locale === 'uk' ? 'Місяць' : 'Месяц') :
               (locale === 'uk' ? 'Всі' : 'Все')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards - Client Component */}
      <DashboardStats analytics={analytics} period={period} locale={locale} />

      {/* Charts - Client Component с dynamic import */}
      <DashboardCharts analytics={analytics} />

      {/* Recent Orders - Dynamic import */}
      <RecentOrdersTable orders={orders} locale={locale} />
    </div>
  );
}
