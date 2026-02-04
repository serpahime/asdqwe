'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  Calendar,
  X
} from 'lucide-react';
import { 
  getAllOrders, 
  getOrdersByStatus, 
  getTodayOrders, 
  getWeekOrders, 
  getMonthOrders,
  updateOrderStatus,
  deleteOrder,
  type OrderStatus,
  type ExtendedOrder
} from '@/lib/admin/orders';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/dateLocale';

const statusLabels = {
  uk: {
    new: 'Новий',
    processing: 'В обробці',
    completed: 'Виконано',
    delivered: 'Доставлено',
    cancelled: 'Скасовано',
    returned: 'Повернення',
  },
  ru: {
    new: 'Новый',
    processing: 'В обработке',
    completed: 'Выполнен',
    delivered: 'Доставлено',
    cancelled: 'Отменён',
    returned: 'Возврат',
  },
};

export default function AdminOrdersPage() {
  const locale = useLocale();
  const router = useRouter();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const loadOrders = () => {
    let allOrders = getAllOrders();
    
    // Применяем фильтр по дате
    if (dateFilter === 'today') {
      allOrders = getTodayOrders();
    } else if (dateFilter === 'week') {
      allOrders = getWeekOrders();
    } else if (dateFilter === 'month') {
      allOrders = getMonthOrders();
    }
    
    setOrders(allOrders);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.customer.email.toLowerCase().includes(query) ||
          o.customer.phone.includes(query)
      );
    }

    // Сортировка по дате (новые сначала)
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredOrders(filtered);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // Получаем заказ до изменения статуса
    const currentOrders = getAllOrders();
    const order = currentOrders.find(o => o.id === orderId);
    
    updateOrderStatus(orderId, newStatus);
    
    // Проверяем достижения при завершении заказа
    if (newStatus === 'completed' && order?.customer.userId && typeof window !== 'undefined') {
      setTimeout(() => {
        import('@/lib/achievements/userAchievements').then(({ checkAndUnlockAchievements }) => {
          checkAndUnlockAchievements(order.customer.userId!);
        });
      }, 100);
    }
    
    loadOrders();
    toastManager.success(
      locale === 'uk' ? 'Статус оновлено' : 'Статус обновлён'
    );
  };

  const handleDelete = (orderId: string) => {
    if (confirm(locale === 'uk' ? 'Видалити замовлення?' : 'Удалить заказ?')) {
      deleteOrder(orderId);
      loadOrders();
      toastManager.success(
        locale === 'uk' ? 'Замовлення видалено' : 'Заказ удалён'
      );
    }
  };

  const exportToCSV = () => {
    const headers = [
      locale === 'uk' ? 'ID' : 'ID',
      locale === 'uk' ? 'Клієнт' : 'Клиент',
      locale === 'uk' ? 'Email' : 'Email',
      locale === 'uk' ? 'Телефон' : 'Телефон',
      locale === 'uk' ? 'Сума' : 'Сумма',
      locale === 'uk' ? 'Статус' : 'Статус',
      locale === 'uk' ? 'Дата' : 'Дата',
    ];
    
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.total.toString(),
      statusLabels[locale][order.status],
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const statusCounts = {
    all: orders.length,
    new: getOrdersByStatus('new').length,
    processing: getOrdersByStatus('processing').length,
    completed: getOrdersByStatus('completed').length,
    cancelled: getOrdersByStatus('cancelled').length,
    returned: getOrdersByStatus('returned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Замовлення' : 'Заказы'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? `Всього: ${orders.length} замовлень`
              : `Всего: ${orders.length} заказов`}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>{locale === 'uk' ? 'Експорт CSV' : 'Экспорт CSV'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {(['all', 'new', 'processing', 'completed', 'cancelled', 'returned'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`card text-center p-4 transition-all ${
              statusFilter === status
                ? 'border-2 border-neon-cyan bg-neon-cyan/10'
                : 'hover:bg-dark-border'
            }`}
          >
            <p className="text-2xl font-bold text-neon-cyan mb-1">
              {statusCounts[status]}
            </p>
            <p className="text-xs text-gray-400">
              {status === 'all' ? (locale === 'uk' ? 'Всі' : 'Все') :
               statusLabels[locale][status]}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'uk' ? 'Пошук замовлень...' : 'Поиск заказов...'}
              className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={dateFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan appearance-none"
            >
              <option value="all">{locale === 'uk' ? 'Всі дати' : 'Все даты'}</option>
              <option value="today">{locale === 'uk' ? 'Сьогодні' : 'Сегодня'}</option>
              <option value="week">{locale === 'uk' ? 'Тиждень' : 'Неделя'}</option>
              <option value="month">{locale === 'uk' ? 'Місяць' : 'Месяц'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan appearance-none"
            >
              <option value="all">{locale === 'uk' ? 'Всі статуси' : 'Все статусы'}</option>
              <option value="new">{statusLabels[locale].new}</option>
              <option value="processing">{statusLabels[locale].processing}</option>
              <option value="completed">{statusLabels[locale].completed}</option>
              <option value="cancelled">{statusLabels[locale].cancelled}</option>
              <option value="returned">{statusLabels[locale].returned}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'ID' : 'ID'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Клієнт' : 'Клиент'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Товари' : 'Товары'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Сума' : 'Сумма'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Статус' : 'Статус'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дата' : 'Дата'}
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дії' : 'Действия'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    {locale === 'uk' ? 'Замовлення не знайдено' : 'Заказы не найдены'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-dark-border hover:bg-dark-border/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-300 font-medium">{order.customer.name}</p>
                        <p className="text-gray-500 text-xs">{order.customer.email}</p>
                        <p className="text-gray-500 text-xs">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-300">
                        {order.items.length} {locale === 'uk' ? 'товарів' : 'товаров'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neon-cyan font-semibold">
                      {order.total} ₴
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : order.status === 'returned'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        <option value="new">{statusLabels[locale].new}</option>
                        <option value="processing">{statusLabels[locale].processing}</option>
                        <option value="completed">{statusLabels[locale].completed}</option>
                        <option value="cancelled">{statusLabels[locale].cancelled}</option>
                        <option value="returned">{statusLabels[locale].returned}</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatDate(new Date(order.createdAt), 'dd.MM.yyyy HH:mm', locale)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-neon-cyan hover:bg-dark-border rounded transition-colors"
                          title={locale === 'uk' ? 'Переглянути' : 'Просмотреть'}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title={locale === 'uk' ? 'Видалити' : 'Удалить'}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {locale === 'uk' ? 'Деталі замовлення' : 'Детали заказа'} #{selectedOrder.id.slice(-6)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-neon-cyan"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Інформація про клієнта' : 'Информация о клиенте'}
                </h3>
                <div className="bg-dark-border rounded-lg p-4 space-y-2">
                  <p><strong className="text-white">{locale === 'uk' ? 'Ім\'я' : 'Имя'}:</strong> {selectedOrder.customer.name}</p>
                  <p><strong className="text-white">Email:</strong> {selectedOrder.customer.email}</p>
                  <p><strong className="text-white">{locale === 'uk' ? 'Телефон' : 'Телефон'}:</strong> {selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Доставка' : 'Доставка'}
                </h3>
                <div className="bg-dark-border rounded-lg p-4 space-y-2">
                  <p><strong className="text-white">{locale === 'uk' ? 'Спосіб' : 'Способ'}:</strong> {
                    selectedOrder.delivery.method === 'courier' ? (locale === 'uk' ? 'Кур\'єром' : 'Курьером') :
                    selectedOrder.delivery.method === 'post' ? (locale === 'uk' ? 'Новою поштою' : 'Новой почтой') :
                    (locale === 'uk' ? 'Самовивіз' : 'Самовывоз')
                  }</p>
                  {selectedOrder.delivery.city && (
                    <p><strong className="text-white">{locale === 'uk' ? 'Місто' : 'Город'}:</strong> {selectedOrder.delivery.city}</p>
                  )}
                  {selectedOrder.delivery.address && (
                    <p><strong className="text-white">{locale === 'uk' ? 'Адреса' : 'Адрес'}:</strong> {selectedOrder.delivery.address}</p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Оплата' : 'Оплата'}
                </h3>
                <div className="bg-dark-border rounded-lg p-4">
                  <p><strong className="text-white">{locale === 'uk' ? 'Спосіб' : 'Способ'}:</strong> {
                    selectedOrder.payment.method === 'card' 
                      ? (locale === 'uk' ? 'Банківською карткою' : 'Банковской картой')
                      : (locale === 'uk' ? 'Готівкою' : 'Наличными')
                  }</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Товари' : 'Товары'}
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-dark-border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-300">{item.name}</p>
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-500">
                            {item.selectedVariant.volume && `${locale === 'uk' ? 'Об\'єм' : 'Объём'}: ${item.selectedVariant.volume}`}
                            {item.selectedVariant.volume && item.selectedVariant.resistance && ' • '}
                            {item.selectedVariant.resistance && `${locale === 'uk' ? 'Опір' : 'Сопротивление'}: ${item.selectedVariant.resistance}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {locale === 'uk' ? 'Кількість' : 'Количество'}: {item.quantity} × {item.price} ₴
                        </p>
                      </div>
                      <p className="text-neon-cyan font-semibold">
                        {item.price * item.quantity} ₴
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-dark-border pt-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>{locale === 'uk' ? 'Всього' : 'Итого'}:</span>
                  <span className="text-neon-cyan">{selectedOrder.total} ₴</span>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {locale === 'uk' ? 'Історія статусів' : 'История статусов'}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="bg-dark-border rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            {statusLabels[locale][history.status]}
                          </p>
                          {history.note && (
                            <p className="text-xs text-gray-500">{history.note}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(new Date(history.date), 'dd.MM.yyyy HH:mm', locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

