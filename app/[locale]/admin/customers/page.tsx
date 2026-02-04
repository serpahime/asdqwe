'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  X
} from 'lucide-react';
import { getAllOrders } from '@/lib/admin/orders';
import { getAllCustomers, getRepeatCustomers, getCustomerGeography, type Customer } from '@/lib/admin/customers';
import { useLocale } from '@/hooks/useLocale';
import { ExtendedOrder } from '@/lib/admin/orders';

export default function AdminCustomersPage() {
  const locale = useLocale();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery]);

  const loadCustomers = () => {
    const orders = getAllOrders();
    const allCustomers = getAllCustomers(orders);
    setCustomers(allCustomers);
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.city && c.city.toLowerCase().includes(query))
      );
    }

    // Сортировка по общему доходу (больше сначала)
    filtered.sort((a, b) => b.totalSpent - a.totalSpent);

    setFilteredCustomers(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      locale === 'uk' ? 'Email' : 'Email',
      locale === 'uk' ? 'Ім\'я' : 'Имя',
      locale === 'uk' ? 'Телефон' : 'Телефон',
      locale === 'uk' ? 'Місто' : 'Город',
      locale === 'uk' ? 'Замовлень' : 'Заказов',
      locale === 'uk' ? 'Витрачено' : 'Потрачено',
      locale === 'uk' ? 'Середній чек' : 'Средний чек',
    ];
    
    const rows = filteredCustomers.map((customer) => [
      customer.email,
      customer.name,
      customer.phone,
      customer.city || '-',
      customer.totalOrders.toString(),
      customer.totalSpent.toString(),
      customer.averageOrderValue.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const repeatCustomers = getRepeatCustomers(getAllOrders());
  const geography = getCustomerGeography(getAllOrders());

  const stats = {
    total: customers.length,
    repeat: repeatCustomers.length,
    new: customers.length - repeatCustomers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Клієнти' : 'Клиенты'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? `Всього: ${stats.total} клієнтів`
              : `Всего: ${stats.total} клиентов`}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Всього клієнтів' : 'Всего клиентов'}
          </h3>
          <p className="text-3xl font-bold text-neon-cyan">{stats.total}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Повторні покупки' : 'Повторные покупки'}
          </h3>
          <p className="text-3xl font-bold text-neon-purple">{stats.repeat}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
              <DollarSign className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Загальний дохід' : 'Общий доход'}
          </h3>
          <p className="text-3xl font-bold text-neon-pink">{stats.totalRevenue} ₴</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center">
              <DollarSign className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Середній чек' : 'Средний чек'}
          </h3>
          <p className="text-3xl font-bold text-neon-blue">
            {stats.total > 0 ? Math.round(stats.totalRevenue / stats.total) : 0} ₴
          </p>
        </div>
      </div>

      {/* Geography */}
      {geography.size > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="text-neon-cyan" size={24} />
            <span>{locale === 'uk' ? 'Географія клієнтів' : 'География клиентов'}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(geography.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([city, count]) => (
                <div key={city} className="bg-dark-border rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">{city}</p>
                  <p className="text-2xl font-bold text-neon-cyan">{count}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'uk' ? 'Пошук клієнтів...' : 'Поиск клиентов...'}
            className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Клієнт' : 'Клиент'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Контакти' : 'Контакты'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Місто' : 'Город'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Замовлень' : 'Заказов'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Витрачено' : 'Потрачено'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Середній чек' : 'Средний чек'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Останнє замовлення' : 'Последний заказ'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    {locale === 'uk' ? 'Клієнти не знайдено' : 'Клиенты не найдены'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-dark-border hover:bg-dark-border/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="py-3 px-4">
                      <p className="text-gray-300 font-medium">{customer.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="text-gray-400 text-sm flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{customer.email}</span>
                        </p>
                        <p className="text-gray-400 text-sm flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{customer.phone}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {customer.city || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded text-sm font-medium">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neon-purple font-semibold">
                      {customer.totalSpent} ₴
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {customer.averageOrderValue} ₴
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString(
                            locale === 'uk' ? 'uk-UA' : 'ru-RU'
                          )
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {locale === 'uk' ? 'Деталі клієнта' : 'Детали клиента'}
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-neon-cyan"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Інформація' : 'Информация'}
                </h3>
                <div className="bg-dark-border rounded-lg p-4 space-y-2">
                  <p><strong className="text-white">{locale === 'uk' ? 'Ім\'я' : 'Имя'}:</strong> {selectedCustomer.name}</p>
                  <p><strong className="text-white">Email:</strong> {selectedCustomer.email}</p>
                  <p><strong className="text-white">{locale === 'uk' ? 'Телефон' : 'Телефон'}:</strong> {selectedCustomer.phone}</p>
                  {selectedCustomer.city && (
                    <p><strong className="text-white">{locale === 'uk' ? 'Місто' : 'Город'}:</strong> {selectedCustomer.city}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark-border rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Замовлень' : 'Заказов'}
                  </p>
                  <p className="text-2xl font-bold text-neon-cyan">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="bg-dark-border rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Витрачено' : 'Потрачено'}
                  </p>
                  <p className="text-2xl font-bold text-neon-purple">
                    {selectedCustomer.totalSpent} ₴
                  </p>
                </div>
                <div className="bg-dark-border rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Середній чек' : 'Средний чек'}
                  </p>
                  <p className="text-2xl font-bold text-neon-pink">
                    {selectedCustomer.averageOrderValue} ₴
                  </p>
                </div>
              </div>

              {/* Orders History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {locale === 'uk' ? 'Історія замовлень' : 'История заказов'}
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => (
                      <div key={order.id} className="bg-dark-border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-300 font-medium">
                            {locale === 'uk' ? 'Замовлення' : 'Заказ'} #{order.id.slice(-6)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              locale === 'uk' ? 'uk-UA' : 'ru-RU',
                              { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-cyan font-semibold">{order.total} ₴</p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {order.status === 'new' ? (locale === 'uk' ? 'Новий' : 'Новый') :
                             order.status === 'processing' ? (locale === 'uk' ? 'В обробці' : 'В обработке') :
                             order.status === 'completed' ? (locale === 'uk' ? 'Виконано' : 'Выполнен') :
                             order.status === 'cancelled' ? (locale === 'uk' ? 'Скасовано' : 'Отменён') :
                             (locale === 'uk' ? 'Повернення' : 'Возврат')}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

