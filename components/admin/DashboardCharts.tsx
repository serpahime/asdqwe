'use client';

import dynamic from 'next/dynamic';
import { AnalyticsData } from '@/lib/admin/analytics';
import { useLocale } from '@/hooks/useLocale';

// Динамическая загрузка графиков с SSR: false
const RevenueLineChart = dynamic(
  () => import('@/components/charts/LineChart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-dark-border/20 rounded-lg animate-pulse" />
  }
);

const RevenueBarChart = dynamic(
  () => import('@/components/charts/BarChart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-dark-border/20 rounded-lg animate-pulse" />
  }
);

interface DashboardChartsProps {
  analytics: AnalyticsData;
}

export default function DashboardCharts({ analytics }: DashboardChartsProps) {
  const locale = useLocale();
  const revenueData = analytics.revenueByDay.slice(-7);
  const topProducts = analytics.topProducts.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          {locale === 'uk' ? 'Дохід за останні 7 днів' : 'Доход за последние 7 дней'}
        </h2>
        <RevenueLineChart data={revenueData} locale={locale} />
      </div>

      {/* Top Products Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          {locale === 'uk' ? 'Топ-5 товарів' : 'Топ-5 товаров'}
        </h2>
        <RevenueBarChart data={topProducts} locale={locale} />
      </div>
    </div>
  );
}
