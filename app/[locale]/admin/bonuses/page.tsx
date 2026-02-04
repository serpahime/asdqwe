'use client';

import { useEffect, useState } from 'react';
import { 
  Gift, 
  Search, 
  Plus, 
  Minus,
  Download,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';
import { getAllUsers, addBonusToUser, deductBonusFromUser, getUserBonusHistory, type User } from '@/lib/referral/users';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';

export default function AdminBonusesPage() {
  const locale = useLocale();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [bonusReason, setBonusReason] = useState('');
  const [isAdding, setIsAdding] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    // Сортируем по балансу (больше сначала)
    allUsers.sort((a, b) => b.bonusBalance - a.bonusBalance);
    setUsers(allUsers);
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.referralCode.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleBonusAction = () => {
    if (!selectedUser || bonusAmount <= 0 || !bonusReason.trim()) {
      toastManager.error(
        locale === 'uk' ? 'Заповніть всі поля' : 'Заполните все поля'
      );
      return;
    }

    if (isAdding) {
      addBonusToUser(selectedUser.id, bonusAmount, bonusReason);
      toastManager.success(
        locale === 'uk' 
          ? `Нараховано ${bonusAmount} грн бонусів`
          : `Начислено ${bonusAmount} грн бонусов`
      );
    } else {
      if (selectedUser.bonusBalance < bonusAmount) {
        toastManager.error(
          locale === 'uk' ? 'Недостатньо бонусів у користувача' : 'Недостаточно бонусов у пользователя'
        );
        return;
      }
      deductBonusFromUser(selectedUser.id, bonusAmount, bonusReason);
      toastManager.success(
        locale === 'uk' 
          ? `Списано ${bonusAmount} грн бонусів`
          : `Списано ${bonusAmount} грн бонусов`
      );
    }

    loadUsers();
    setSelectedUser(null);
    setBonusAmount(0);
    setBonusReason('');
  };

  const exportToCSV = () => {
    const headers = [
      locale === 'uk' ? 'Email' : 'Email',
      locale === 'uk' ? 'Ім\'я' : 'Имя',
      locale === 'uk' ? 'Реферальний код' : 'Реферальный код',
      locale === 'uk' ? 'Бонусний баланс' : 'Бонусный баланс',
      locale === 'uk' ? 'Запрошено друзів' : 'Приглашено друзей',
    ];
    
    const rows = filteredUsers.map((user) => {
      const referrals = users.filter(u => u.referredBy === user.id);
      return [
        user.email,
        user.name,
        user.referralCode,
        user.bonusBalance.toString(),
        referrals.length.toString(),
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bonuses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalBonuses = users.reduce((sum, u) => sum + u.bonusBalance, 0);
  const totalUsers = users.length;
  const usersWithBonuses = users.filter(u => u.bonusBalance > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {locale === 'uk' ? 'Управління бонусами' : 'Управление бонусами'}
          </h1>
          <p className="text-gray-400">
            {locale === 'uk' 
              ? `Всього користувачів: ${totalUsers}`
              : `Всего пользователей: ${totalUsers}`}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <Gift className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Загальний баланс бонусів' : 'Общий баланс бонусов'}
          </h3>
          <p className="text-3xl font-bold text-neon-cyan">{totalBonuses} ₴</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
              <UserIcon className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Користувачів з бонусами' : 'Пользователей с бонусами'}
          </h3>
          <p className="text-3xl font-bold text-neon-purple">{usersWithBonuses}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
              <TrendingUp className="text-dark-bg" size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">
            {locale === 'uk' ? 'Середній баланс' : 'Средний баланс'}
          </h3>
          <p className="text-3xl font-bold text-neon-pink">
            {totalUsers > 0 ? Math.round(totalBonuses / totalUsers) : 0} ₴
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'uk' ? 'Пошук користувачів...' : 'Поиск пользователей...'}
            className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Користувач' : 'Пользователь'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Реферальний код' : 'Реферальный код'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Бонусний баланс' : 'Бонусный баланс'}
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Запрошено друзів' : 'Приглашено друзей'}
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  {locale === 'uk' ? 'Дії' : 'Действия'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    {locale === 'uk' ? 'Користувачі не знайдені' : 'Пользователи не найдены'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const referrals = users.filter(u => u.referredBy === user.id);
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-dark-border hover:bg-dark-border/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-gray-300 font-medium">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded text-sm font-mono">
                          {user.referralCode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neon-purple font-semibold">
                          {user.bonusBalance} ₴
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {referrals.length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAdding(true);
                            }}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                            title={locale === 'uk' ? 'Нарахувати бонуси' : 'Начислить бонусы'}
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAdding(false);
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title={locale === 'uk' ? 'Списати бонуси' : 'Списать бонусы'}
                          >
                            <Minus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bonus Action Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-dark-border">
              <h2 className="text-2xl font-semibold">
                {isAdding
                  ? (locale === 'uk' ? 'Нарахувати бонуси' : 'Начислить бонусы')
                  : (locale === 'uk' ? 'Списати бонуси' : 'Списать бонусы')}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {selectedUser.name} ({selectedUser.email})
              </p>
              <p className="text-gray-400 text-sm">
                {locale === 'uk' ? 'Поточний баланс' : 'Текущий баланс'}:{' '}
                <span className="text-neon-cyan font-semibold">
                  {selectedUser.bonusBalance} ₴
                </span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Сума' : 'Сумма'} (₴)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Причина' : 'Причина'} *
                </label>
                <textarea
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  rows={3}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder={locale === 'uk' ? 'Опишіть причину...' : 'Опишите причину...'}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBonusAction}
                  className={`flex-1 ${isAdding ? 'btn-primary' : 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors'}`}
                >
                  {isAdding
                    ? (locale === 'uk' ? 'Нарахувати' : 'Начислить')
                    : (locale === 'uk' ? 'Списати' : 'Списать')}
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setBonusAmount(0);
                    setBonusReason('');
                  }}
                  className="btn-secondary flex-1"
                >
                  {locale === 'uk' ? 'Скасувати' : 'Отменить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

