'use client';

import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AnalyticsData } from '@/lib/admin/analytics';

interface DashboardStatsProps {
  analytics: AnalyticsData;
  period: 'today' | 'week' | 'month' | 'all';
  locale: 'uk' | 'ru';
}

export default function DashboardStats({ analytics, period, locale }: DashboardStatsProps) {
  // Рассчитать изменения
  const revenueChange = period === 'today' 
    ? ((analytics.todayRevenue / (analytics.weekRevenue / 7)) - 1) * 100
    : period === 'week'
    ? ((analytics.weekRevenue / (analytics.monthRevenue / 4)) - 1) * 100
    : 0;

  const ordersChange = period === 'today'
    ? ((analytics.todayOrders / (analytics.weekOrders / 7)) - 1) * 100
    : period === 'week'
    ? ((analytics.weekOrders / (analytics.monthOrders / 4)) - 1) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
            <DollarSign className="text-dark-bg" size={24} />
          </div>
          {revenueChange !== 0 && (
            <div className={`flex items-center space-x-1 ${revenueChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {revenueChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-semibold">{Math.abs(revenueChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">
          {period === 'today' ? (locale === 'uk' ? 'Дохід сьогодні' : 'Доход сегодня') :
           period === 'week' ? (locale === 'uk' ? 'Дохід за тиждень' : 'Доход за неделю') :
           period === 'month' ? (locale === 'uk' ? 'Дохід за місяць' : 'Доход за месяц') :
           (locale === 'uk' ? 'Загальний дохід' : 'Общий доход')}
        </h3>
        <p className="text-3xl font-bold text-neon-cyan">
          {period === 'today' ? analytics.todayRevenue :
           period === 'week' ? analytics.weekRevenue :
           period === 'month' ? analytics.monthRevenue :
           analytics.totalRevenue} ₴
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-dark-bg" size={24} />
          </div>
          {ordersChange !== 0 && (
            <div className={`flex items-center space-x-1 ${ordersChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {ordersChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-semibold">{Math.abs(ordersChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">
          {period === 'today' ? (locale === 'uk' ? 'Замовлення сьогодні' : 'Заказы сегодня') :
           period === 'week' ? (locale === 'uk' ? 'Замовлення за тиждень' : 'Заказы за неделю') :
           period === 'month' ? (locale === 'uk' ? 'Замовлення за місяць' : 'Заказы за месяц') :
           (locale === 'uk' ? 'Всього замовлень' : 'Всего заказов')}
        </h3>
        <p className="text-3xl font-bold text-neon-purple">
          {period === 'today' ? analytics.todayOrders :
           period === 'week' ? analytics.weekOrders :
           period === 'month' ? analytics.monthOrders :
           analytics.totalOrders}
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
            <TrendingUp className="text-dark-bg" size={24} />
          </div>
        </div>
        <h3 className="text-gray-400 text-sm mb-1">
          {locale === 'uk' ? 'Середній чек' : 'Средний чек'}
        </h3>
        <p className="text-3xl font-bold text-neon-pink">
          {analytics.averageOrderValue} ₴
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center">
            <Users className="text-dark-bg" size={24} />
          </div>
        </div>
        <h3 className="text-gray-400 text-sm mb-1">
          {locale === 'uk' ? 'Конверсія' : 'Конверсия'}
        </h3>
        <p className="text-3xl font-bold text-neon-blue">
          {analytics.conversionRate}%
        </p>
      </div>
    </div>
  );
}
