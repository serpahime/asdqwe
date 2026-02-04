import { ExtendedOrder } from './orders';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  orders: ExtendedOrder[];
  city?: string;
}

// Получить всех уникальных клиентов
export function getAllCustomers(orders: ExtendedOrder[]): Customer[] {
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    orders: ExtendedOrder[];
    city?: string;
  }>();

  orders.forEach((order) => {
    const key = order.customer.email.toLowerCase();
    const existing = customerMap.get(key);
    
    if (existing) {
      existing.orders.push(order);
      if (order.delivery.city && !existing.city) {
        existing.city = order.delivery.city;
      }
    } else {
      customerMap.set(key, {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        orders: [order],
        city: order.delivery.city,
      });
    }
  });

  return Array.from(customerMap.entries()).map(([email, data]) => {
    const validOrders = data.orders.filter(
      (o) => o.status !== 'cancelled' && o.status !== 'returned'
    );
    
    const totalSpent = validOrders.reduce((sum, o) => sum + o.total, 0);
    const orderDates = data.orders.map((o) => new Date(o.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    
    return {
      id: email.toLowerCase(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: validOrders.length,
      totalSpent,
      averageOrderValue: validOrders.length > 0 ? Math.round(totalSpent / validOrders.length) : 0,
      firstOrderDate: orderDates[0]?.toISOString() || '',
      lastOrderDate: orderDates[orderDates.length - 1]?.toISOString() || '',
      orders: data.orders,
      city: data.city,
    };
  });
}

// Получить клиента по email
export function getCustomerByEmail(
  orders: ExtendedOrder[],
  email: string
): Customer | null {
  const customers = getAllCustomers(orders);
  return customers.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null;
}

// Получить повторных покупателей
export function getRepeatCustomers(orders: ExtendedOrder[]): Customer[] {
  const customers = getAllCustomers(orders);
  return customers.filter((c) => c.totalOrders > 1);
}

// Получить географию клиентов
export function getCustomerGeography(orders: ExtendedOrder[]): Map<string, number> {
  const geography = new Map<string, number>();
  
  orders.forEach((order) => {
    const city = order.delivery.city || 'Не указан';
    geography.set(city, (geography.get(city) || 0) + 1);
  });
  
  return geography;
}

