'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  DollarSign,
  TrendingUp,
  Download,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { getAllOrders } from '@/lib/admin/orders';
import { getFullAnalytics, type AnalyticsData } from '@/lib/admin/analytics';
import { useLocale } from '@/hooks/useLocale';
import { subDays } from 'date-fns';

// Динамическая загрузка графиков с SSR: false
const RevenueLineChart = dynamic(
  () => import('@/components/charts/LineChart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-dark-border/20 rounded-lg animate-pulse" />
  }
);

const RevenueBarChart = dynamic(
  () => import('@/components/charts/BarChart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-dark-border/20 rounded-lg animate-pulse" />
  }
);

const TopProductsPieChart = dynamic(
  () => import('@/components/charts/PieChart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-dark-border/20 rounded-lg animate-pulse" />
  }
);

export default function AnalyticsPage() {
  const locale = useLocale();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const loadAnalytics = () => {
    const orders = getAllOrders();
    let data: AnalyticsData;
    
    // Фильтруем данные по выбранному периоду
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoffDate = subDays(new Date(), days);
      const filteredOrders = orders.filter(
        (o) => new Date(o.createdAt) >= cutoffDate
      );
      data = getFullAnalytics(filteredOrders);
    } else {
      data = getFullAnalytics(orders);
    }
    
    setAnalytics(data);
    setLoading(false);
  };

  // На сервере или до монтирования показываем placeholder (одинаковый рендеринг)
  if (typeof window === 'undefined' || !mounted || loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64" suppressHydrationWarning>
        <div className="text-gray-400">{locale === 'uk' ? 'Завантаження...' : 'Загрузка...'}</div>
      </div>
    );
  }

  const revenueData = dateRange === 'all' 
    ? analytics.revenueByDay 
    : analytics.revenueByDay.slice(-parseInt(dateRange));

  const topProducts = analytics.topProducts.slice(0, 10);
  const revenueByProduct = analytics.revenueByProduct.slice(0, 8);

  const exportToCSV = () => {
    const headers = [
      locale === 'uk' ? 'Дата' : 'Дата',
      locale === 'uk' ? 'Дохід' : 'Доход',
      locale === 'uk' ? 'Замовлення' : 'Заказы',
    ];
    
    const rows = revenueData.map((data) => [
      data.date,
      data.revenue.toString(),
      data.orders.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Аналітика' : 'Аналитика'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? 'Детальна фінансова аналітика та статистика'
              : 'Детальная финансовая аналитика и статистика'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value as '7' | '30' | '90' | 'all')}
            className="bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
          >
            <option value="7">{locale === 'uk' ? '7 днів' : '7 дней'}</option>
            <option value="30">{locale === 'uk' ? '30 днів' : '30 дней'}</option>
            <option value="90">{locale === 'uk' ? '90 днів' : '90 дней'}</option>
            <option value="all">{locale === 'uk' ? 'Всі' : 'Все'}</option>
          </select>
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{locale === 'uk' ? 'Експорт CSV' : 'Экспорт CSV'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <DollarSign className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Загальний дохід' : 'Общий доход'}
          </h3>
          <p className="text-3xl font-bold text-neon-cyan">{analytics.totalRevenue} ₴</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
              <TrendingUp className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Середній чек' : 'Средний чек'}
          </h3>
          <p className="text-3xl font-bold text-neon-purple">{analytics.averageOrderValue} ₴</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
              <BarChart3 className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Всього замовлень' : 'Всего заказов'}
          </h3>
          <p className="text-3xl font-bold text-neon-pink">{analytics.totalOrders}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center">
              <PieChartIcon className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Конверсія' : 'Конверсия'}
          </h3>
          <p className="text-3xl font-bold text-neon-blue">{analytics.conversionRate}%</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="text-neon-cyan" size={24} />
          <span>{locale === 'uk' ? 'Дохід по дням' : 'Доход по дням'}</span>
        </h2>
        <RevenueLineChart data={revenueData} locale={locale} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Revenue */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <BarChart3 className="text-neon-purple" size={24} />
            <span>{locale === 'uk' ? 'Дохід по товарах' : 'Доход по товарам'}</span>
          </h2>
          <RevenueBarChart data={revenueByProduct} locale={locale} />
        </div>

        {/* Top Products Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <PieChartIcon className="text-neon-pink" size={24} />
            <span>{locale === 'uk' ? 'Топ товарів' : 'Топ товаров'}</span>
          </h2>
          <TopProductsPieChart data={topProducts} locale={locale} />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          {locale === 'uk' ? 'Топ-10 товарів за доходом' : 'Топ-10 товаров по доходу'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  #
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Товар' : 'Товар'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Кількість продажів' : 'Количество продаж'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дохід' : 'Доход'}
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b border-dark-border hover:bg-dark-border/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-400">#{index + 1}</td>
                  <td className="py-3 px-4 text-gray-300 font-medium">
                    {product.productName}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {product.quantity}
                  </td>
                  <td className="py-3 px-4 text-neon-cyan font-semibold">
                    {product.revenue} ₴
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
