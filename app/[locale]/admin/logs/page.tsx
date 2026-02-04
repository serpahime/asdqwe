'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Download, Trash2, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { logger, type LogEntry, type LogLevel, type LogCategory } from '@/lib/logger';
import { useLocale } from '@/hooks/useLocale';
import { formatDate } from '@/lib/utils/dateLocale';

export default function AdminLogsPage() {
  const locale = useLocale();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');

  useEffect(() => {
    loadLogs();
    // Обновляем логи каждые 5 секунд
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, selectedLevel, selectedCategory]);

  const loadLogs = () => {
    const allLogs = logger.getLogs(undefined, undefined, 500); // Получаем последние 500 логов
    setLogs(allLogs.reverse()); // Переворачиваем, чтобы новые были сверху
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Фильтр по уровню
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Поиск по тексту
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.category.toLowerCase().includes(query) ||
        log.url?.toLowerCase().includes(query) ||
        log.userId?.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(filtered);
  };

  const clearLogs = () => {
    if (confirm(locale === 'uk' ? 'Ви впевнені, що хочете очистити всі логи?' : 'Вы уверены, что хотите очистить все логи?')) {
      logger.clearLogs();
      loadLogs();
    }
  };

  const exportLogs = () => {
    const jsonLogs = logger.exportLogs();
    const blob = new Blob([jsonLogs], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return <XCircle className="text-red-400" size={16} />;
      case 'warn':
        return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'info':
        return <Info className="text-blue-400" size={16} />;
      case 'debug':
        return <AlertCircle className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const getLevelBadgeColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warn':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'debug':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Логи системи' : 'Логи системы'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? 'Перегляд та аналіз системних логів'
              : 'Просмотр и анализ системных логов'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportLogs}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{locale === 'uk' ? 'Експорт' : 'Экспорт'}</span>
          </button>
          <button
            onClick={clearLogs}
            className="btn-secondary flex items-center space-x-2 text-red-400 hover:text-red-300"
          >
            <Trash2 size={20} />
            <span>{locale === 'uk' ? 'Очистити' : 'Очистить'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={locale === 'uk' ? 'Пошук по логах...' : 'Поиск по логам...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-border border border-dark-border rounded-lg text-gray-300 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
            className="px-4 py-2 bg-dark-border border border-dark-border rounded-lg text-gray-300 focus:outline-none focus:border-neon-cyan"
          >
            <option value="all">{locale === 'uk' ? 'Всі рівні' : 'Все уровни'}</option>
            <option value="error">{locale === 'uk' ? 'Помилки' : 'Ошибки'}</option>
            <option value="warn">{locale === 'uk' ? 'Попередження' : 'Предупреждения'}</option>
            <option value="info">{locale === 'uk' ? 'Інформація' : 'Информация'}</option>
            <option value="debug">{locale === 'uk' ? 'Відлагодження' : 'Отладка'}</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as LogCategory | 'all')}
            className="px-4 py-2 bg-dark-border border border-dark-border rounded-lg text-gray-300 focus:outline-none focus:border-neon-cyan"
          >
            <option value="all">{locale === 'uk' ? 'Всі категорії' : 'Все категории'}</option>
            <option value="auth">{locale === 'uk' ? 'Авторизація' : 'Авторизация'}</option>
            <option value="cart">{locale === 'uk' ? 'Кошик' : 'Корзина'}</option>
            <option value="order">{locale === 'uk' ? 'Замовлення' : 'Заказы'}</option>
            <option value="payment">{locale === 'uk' ? 'Оплата' : 'Оплата'}</option>
            <option value="product">{locale === 'uk' ? 'Товари' : 'Товары'}</option>
            <option value="api">{locale === 'uk' ? 'API' : 'API'}</option>
            <option value="ui">{locale === 'uk' ? 'Інтерфейс' : 'Интерфейс'}</option>
            <option value="system">{locale === 'uk' ? 'Система' : 'Система'}</option>
            <option value="security">{locale === 'uk' ? 'Безпека' : 'Безопасность'}</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          {locale === 'uk' 
            ? `Показано ${filteredLogs.length} з ${logs.length} логів`
            : `Показано ${filteredLogs.length} из ${logs.length} логов`}
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Час' : 'Время'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Рівень' : 'Уровень'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Категорія' : 'Категория'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Повідомлення' : 'Сообщение'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'URL' : 'URL'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Користувач' : 'Пользователь'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {locale === 'uk' ? 'Логи не знайдено' : 'Логи не найдены'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-dark-border hover:bg-dark-border/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatDate(new Date(log.timestamp), 'dd.MM.yyyy HH:mm:ss', locale)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelBadgeColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {log.category}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm max-w-md truncate">
                      {log.message}
                      {log.error && (
                        <div className="text-red-400 text-xs mt-1">
                          {log.error.message}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs max-w-xs truncate">
                      {log.url || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {log.userId ? `#${log.userId.slice(-6)}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
