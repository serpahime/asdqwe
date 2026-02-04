'use client';

import { ExtendedOrder } from '@/lib/admin/orders';

interface RecentOrdersTableProps {
  orders: ExtendedOrder[];
  locale: 'uk' | 'ru';
}

export default function RecentOrdersTable({ orders, locale }: RecentOrdersTableProps) {
  const recentOrders = orders.slice(-10).reverse();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {locale === 'uk' ? 'Останні замовлення' : 'Последние заказы'}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                {locale === 'uk' ? 'ID' : 'ID'}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                {locale === 'uk' ? 'Клієнт' : 'Клиент'}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                {locale === 'uk' ? 'Сума' : 'Сумма'}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                {locale === 'uk' ? 'Статус' : 'Статус'}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                {locale === 'uk' ? 'Дата' : 'Дата'}
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-dark-border hover:bg-dark-border/50">
                <td className="py-3 px-4 text-gray-300 text-sm">#{order.id.slice(-6)}</td>
                <td className="py-3 px-4 text-gray-300">{order.customer.name}</td>
                <td className="py-3 px-4 text-neon-cyan font-semibold">{order.total} ₴</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    order.status === 'returned' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {order.status === 'new' ? (locale === 'uk' ? 'Новий' : 'Новый') :
                     order.status === 'processing' ? (locale === 'uk' ? 'В обробці' : 'В обработке') :
                     order.status === 'completed' ? (locale === 'uk' ? 'Виконано' : 'Выполнен') :
                     order.status === 'cancelled' ? (locale === 'uk' ? 'Скасовано' : 'Отменён') :
                     (locale === 'uk' ? 'Повернення' : 'Возврат')}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
