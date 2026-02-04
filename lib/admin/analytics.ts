import { ExtendedOrder } from './orders';
import { Product } from '@/types';

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductSales {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  conversionRate: number;
  topProducts: ProductSales[];
  revenueByDay: RevenueData[];
  revenueByProduct: ProductSales[];
}

// Рассчитать общий доход
export function calculateTotalRevenue(orders: ExtendedOrder[]): number {
  return orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'returned')
    .reduce((sum, order) => sum + order.total, 0);
}

// Рассчитать доход за период
export function calculateRevenueByDateRange(
  orders: ExtendedOrder[],
  startDate: Date,
  endDate: Date
): number {
  const filtered = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= startDate &&
      orderDate <= endDate &&
      order.status !== 'cancelled' &&
      order.status !== 'returned'
    );
  });
  return filtered.reduce((sum, order) => sum + order.total, 0);
}

// Рассчитать средний чек
export function calculateAverageOrderValue(orders: ExtendedOrder[]): number {
  const validOrders = orders.filter(
    (o) => o.status !== 'cancelled' && o.status !== 'returned'
  );
  if (validOrders.length === 0) return 0;
  const total = calculateTotalRevenue(orders);
  return Math.round(total / validOrders.length);
}

// Получить топ товаров
export function getTopProducts(
  orders: ExtendedOrder[],
  limit: number = 10
): ProductSales[] {
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

  orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'returned')
    .forEach((order) => {
      order.items.forEach((item) => {
        const existing = productMap.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

  return Array.from(productMap.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      quantity: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// Получить доход по дням
export function getRevenueByDay(
  orders: ExtendedOrder[],
  days: number = 30
): RevenueData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const data: RevenueData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate >= date &&
        orderDate < nextDate &&
        order.status !== 'cancelled' &&
        order.status !== 'returned'
      );
    });
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }
  
  return data;
}

// Рассчитать конверсию
export function calculateConversionRate(
  orders: ExtendedOrder[],
  visitors?: number
): number {
  // В реальном приложении visitors берется из аналитики
  // Здесь используем упрощенную формулу: конверсия = заказы / (заказы * 10)
  const totalOrders = orders.length;
  const estimatedVisitors = visitors || totalOrders * 10;
  if (estimatedVisitors === 0) return 0;
  return Number(((totalOrders / estimatedVisitors) * 100).toFixed(2));
}

// Получить полную аналитику
export function getFullAnalytics(orders: ExtendedOrder[]): AnalyticsData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const todayOrders = orders.filter(
    (o) =>
      new Date(o.createdAt) >= today &&
      new Date(o.createdAt) < tomorrow &&
      o.status !== 'cancelled' &&
      o.status !== 'returned'
  );

  const weekOrders = orders.filter(
    (o) =>
      new Date(o.createdAt) >= weekAgo &&
      o.status !== 'cancelled' &&
      o.status !== 'returned'
  );

  const monthOrders = orders.filter(
    (o) =>
      new Date(o.createdAt) >= monthAgo &&
      o.status !== 'cancelled' &&
      o.status !== 'returned'
  );

  return {
    totalRevenue: calculateTotalRevenue(orders),
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    weekRevenue: weekOrders.reduce((sum, o) => sum + o.total, 0),
    monthRevenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
    averageOrderValue: calculateAverageOrderValue(orders),
    totalOrders: orders.filter((o) => o.status !== 'cancelled' && o.status !== 'returned').length,
    todayOrders: todayOrders.length,
    weekOrders: weekOrders.length,
    monthOrders: monthOrders.length,
    conversionRate: calculateConversionRate(orders),
    topProducts: getTopProducts(orders),
    revenueByDay: getRevenueByDay(orders),
    revenueByProduct: getTopProducts(orders, 20),
  };
}

