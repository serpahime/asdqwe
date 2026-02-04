import { Order } from '@/types';

const ORDERS_STORAGE_KEY = 'juicelab_orders';

export type OrderStatus = 'new' | 'processing' | 'completed' | 'delivered' | 'cancelled' | 'returned';

export interface ExtendedOrder extends Order {
  status: OrderStatus;
  statusHistory?: {
    status: OrderStatus;
    date: string;
    note?: string;
  }[];
  updatedAt?: string;
}

// Получить все заказы
export function getAllOrders(): ExtendedOrder[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Сохранить заказы
export function saveOrders(orders: ExtendedOrder[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

// Добавить заказ
export function addOrder(order: ExtendedOrder): void {
  const orders = getAllOrders();
  orders.push({
    ...order,
    statusHistory: [
      {
        status: order.status,
        date: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  });
  saveOrders(orders);
}

// Обновить статус заказа
export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): void {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  
  order.statusHistory.push({
    status: newStatus,
    date: new Date().toISOString(),
    note,
  });

  saveOrders(orders);
}

// Получить заказ по ID
export function getOrderById(orderId: string): ExtendedOrder | null {
  const orders = getAllOrders();
  return orders.find((o) => o.id === orderId) || null;
}

// Удалить заказ
export function deleteOrder(orderId: string): void {
  const orders = getAllOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  saveOrders(filtered);
}

// Получить заказы по статусу
export function getOrdersByStatus(status: OrderStatus): ExtendedOrder[] {
  const orders = getAllOrders();
  return orders.filter((o) => o.status === status);
}

// Получить заказы за период
export function getOrdersByDateRange(startDate: Date, endDate: Date): ExtendedOrder[] {
  const orders = getAllOrders();
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

// Получить заказы за сегодня
export function getTodayOrders(): ExtendedOrder[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getOrdersByDateRange(today, tomorrow);
}

// Получить заказы за неделю
export function getWeekOrders(): ExtendedOrder[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return getOrdersByDateRange(weekAgo, today);
}

// Получить заказы за месяц
export function getMonthOrders(): ExtendedOrder[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return getOrdersByDateRange(monthAgo, today);
}

